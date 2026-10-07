import { NextRequest, NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/auth';
import { getPost, saveBlogPost, deleteBlogPost } from '@/lib/blog';
import { getSupabaseClient } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const user = await getAdminUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const post = getPost(params.slug);
  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  return NextResponse.json(post);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const user = await getAdminUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { title, description, date, author, tags, cover, content } = body;

  saveBlogPost(params.slug, content || '', {
    title,
    description: description || '',
    date: date || new Date().toISOString(),
    author: author || 'AI-analytikern',
    tags: tags || [],
    cover: cover || '',
  });

  // Sync to Supabase
  const hasSupabase = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
  if (hasSupabase) {
    try {
      const supabase = getSupabaseClient(process.env.SUPABASE_SERVICE_ROLE_KEY);
      await supabase.from('blog_posts').upsert({
        slug: params.slug,
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

  return NextResponse.json({ success: true, slug: params.slug });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const user = await getAdminUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  deleteBlogPost(params.slug);

  const hasSupabase = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
  if (hasSupabase) {
    try {
      const supabase = getSupabaseClient(process.env.SUPABASE_SERVICE_ROLE_KEY);
      await supabase.from('blog_posts').delete().eq('slug', params.slug);
    } catch {
      // ignore
    }
  }

  return NextResponse.json({ success: true });
}

// Support browser form deletion via POST method with _method="DELETE"
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  return DELETE(request, { params }).then((res) => {
    const acceptHeader = request.headers.get('accept') || '';
    if (acceptHeader.includes('text/html')) {
      return NextResponse.redirect(new URL('/admin/blog', request.url), { status: 303 });
    }
    return res;
  });
}

