import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const POSTS_DIR = path.join(process.cwd(), 'content', 'blog');

function ensureDir() {
  if (!fs.existsSync(POSTS_DIR)) fs.mkdirSync(POSTS_DIR, { recursive: true });
}

export async function POST(request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.user_metadata?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { slug, title, description, date, author, tags, cover, content } = body;

  if (!slug || !title) {
    return NextResponse.json({ error: 'Slug and title are required' }, { status: 400 });
  }

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
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
  
  if (fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'Post with this slug already exists' }, { status: 409 });
  }
  
  fs.writeFileSync(filePath, raw, 'utf8');

  return NextResponse.json({ success: true, slug });
}
