import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getAdminUser } from '@/lib/auth';
import { saveBlogPost, getPost } from '@/lib/blog';
import { getSupabaseClient } from '@/lib/supabase';
import { slugify } from '@/lib/slugify';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const user = await getAdminUser(request);

  if (!user) {
    return NextResponse.json({ error: 'Obehörig. Vänligen logga in som administratör.' }, { status: 401 });
  }

  const body = await request.json();
  const { slug, title, description, date, author, tags, cover, content } = body;

  if (!title) {
    return NextResponse.json({ error: 'Titel är obligatorisk' }, { status: 400 });
  }

  let targetSlug = (slug || '').trim();
  if (!targetSlug) {
    targetSlug = slugify(title);
  } else {
    targetSlug = slugify(targetSlug);
  }

  if (!targetSlug) {
    targetSlug = `post-${Date.now()}`;
  }

  saveBlogPost(targetSlug, content || '', {
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
      const { error: sbError } = await supabase.from('blog_posts').upsert({
        slug: targetSlug,
        title,
        description: description || '',
        content: content || '',
        author: author || 'AI-analytikern',
        tags: tags || [],
        cover_url: cover || null,
        draft: false,
        published_at: date ? new Date(date).toISOString() : new Date().toISOString(),
      }, { onConflict: 'slug' });
      if (sbError) {
        console.warn('Supabase blog post upsert notice:', sbError.message);
      }
    } catch (err: any) {
      console.warn('Supabase blog post sync exception:', err?.message);
    }
  }

  try {
    revalidatePath('/blog');
    revalidatePath('/admin/blog');
    revalidatePath(`/blog/${targetSlug}`);
  } catch {}

  return NextResponse.json({ success: true, slug: targetSlug });
}

