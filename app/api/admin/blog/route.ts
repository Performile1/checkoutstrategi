import { NextRequest, NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/auth';
import { saveBlogPost, getPost } from '@/lib/blog';
import { getSupabaseClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  const user = await getAdminUser(request);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { slug, title, description, date, author, tags, cover, content } = body;

  if (!slug || !title) {
    return NextResponse.json({ error: 'Slug and title are required' }, { status: 400 });
  }

  const existing = getPost(slug);
  if (existing) {
    return NextResponse.json({ error: 'Post with this slug already exists' }, { status: 409 });
  }

  saveBlogPost(slug, content || '', {
    title,
    description: description || '',
    date: date || new Date().toISOString(),
    author: author || 'AI-analytikern',
    tags: tags || [],
    cover: cover || '',
  });

  // Sync to Supabase blog_posts table if connected
  const hasSupabase = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
  if (hasSupabase) {
    try {
      const supabase = getSupabaseClient(process.env.SUPABASE_SERVICE_ROLE_KEY);
      await supabase.from('blog_posts').upsert({
        slug,
        title,
        description: description || '',
        content: content || '',
        author: author || 'AI-analytikern',
        tags: tags || [],
        cover_url: cover || null,
        draft: false,
        published_at: date ? new Date(date).toISOString() : new Date().toISOString(),
      }, { onConflict: 'slug' });
    } catch {
      // ignore
    }
  }

  return NextResponse.json({ success: true, slug });
}

