import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const POSTS_DIR = path.join(process.cwd(), 'content', 'blog');

function ensureDir() {
  if (!fs.existsSync(POSTS_DIR)) fs.mkdirSync(POSTS_DIR, { recursive: true });
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.user_metadata?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  ensureDir();
  const candidates = ['mdx', 'md'].map((ext) => path.join(POSTS_DIR, `${params.slug}.${ext}`));
  const file = candidates.find((p) => fs.existsSync(p));
  
  if (!file) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }
  
  const raw = fs.readFileSync(file, 'utf8');
  const { data, content } = matter(raw);
  
  return NextResponse.json({
    slug: params.slug,
    ...data,
    content,
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.user_metadata?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { title, description, date, author, tags, cover, content } = body;

  const frontmatter: Record<string, any> = {
    title,
    description,
    date: date || new Date().toISOString(),
  };

  if (author) frontmatter.author = author;
  if (tags && tags.length > 0) frontmatter.tags = tags;
  if (cover) frontmatter.cover = cover;

  const raw = matter.stringify(content || '', frontmatter);
  ensureDir();
  
  // Write to .mdx file
  const filePath = path.join(POSTS_DIR, `${params.slug}.mdx`);
  fs.writeFileSync(filePath, raw, 'utf8');

  return NextResponse.json({ success: true, slug: params.slug });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.user_metadata?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  ensureDir();
  const candidates = ['mdx', 'md'].map((ext) => path.join(POSTS_DIR, `${params.slug}.${ext}`));
  const file = candidates.find((p) => fs.existsSync(p));
  
  if (!file) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }
  
  fs.unlinkSync(file);

  return NextResponse.json({ success: true });
}
