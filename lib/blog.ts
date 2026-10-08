import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  author?: string;
  tags?: string[];
  cover?: string;
}

export interface Post extends PostMeta {
  content: string;
}

const POSTS_DIR = path.join(process.cwd(), 'content', 'blog');
const TMP_POSTS_DIR = path.join('/tmp', 'checkout_blog');

const memoryPosts = new Map<string, Post>();

function ensureDir(targetDir: string) {
  try {
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
  } catch {
    // ignore read-only fs error
  }
}

export function getAllPosts(): PostMeta[] {
  ensureDir(POSTS_DIR);
  ensureDir(TMP_POSTS_DIR);

  const postsMap = new Map<string, PostMeta>();

  // 1. Read static project posts
  try {
    if (fs.existsSync(POSTS_DIR)) {
      const files = fs
        .readdirSync(POSTS_DIR)
        .filter((f) => (f.endsWith('.mdx') || f.endsWith('.md')) && !f.endsWith('.draft.mdx') && !f.endsWith('.draft.md'));
      
      for (const file of files) {
        try {
          const slug = file.replace(/\.(mdx|md)$/, '');
          const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
          const { data } = matter(raw);
          if (data.draft === true) continue;
          postsMap.set(slug, {
            slug,
            title: data.title || slug,
            description: data.description || '',
            date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
            author: data.author,
            tags: data.tags,
            cover: data.cover,
          });
        } catch {
          // ignore single file parse error
        }
      }
    }
  } catch {
    // directory reading error
  }

  // 2. Read tmp posts (e.g. created at runtime on serverless)
  try {
    if (fs.existsSync(TMP_POSTS_DIR)) {
      const files = fs
        .readdirSync(TMP_POSTS_DIR)
        .filter((f) => (f.endsWith('.mdx') || f.endsWith('.md')) && !f.endsWith('.draft.mdx') && !f.endsWith('.draft.md'));
      
      for (const file of files) {
        try {
          const slug = file.replace(/\.(mdx|md)$/, '');
          const raw = fs.readFileSync(path.join(TMP_POSTS_DIR, file), 'utf8');
          const { data } = matter(raw);
          postsMap.set(slug, {
            slug,
            title: data.title || slug,
            description: data.description || '',
            date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
            author: data.author,
            tags: data.tags,
            cover: data.cover,
          });
        } catch {
          // ignore single file parse error
        }
      }
    }
  } catch {
    // tmp reading error
  }

  // 3. Include memory posts
  for (const [slug, p] of memoryPosts.entries()) {
    postsMap.set(slug, {
      slug: p.slug,
      title: p.title,
      description: p.description,
      date: p.date,
      author: p.author,
      tags: p.tags,
      cover: p.cover,
    });
  }

  const posts = Array.from(postsMap.values());
  return posts.sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

/**
 * Async version of getAllPosts that also queries Supabase blog_posts table
 * if configured, merging local posts with cloud database posts.
 */
export async function getStoredBlogPosts(): Promise<PostMeta[]> {
  const localPosts = getAllPosts();
  const map = new Map<string, PostMeta>();
  for (const p of localPosts) map.set(p.slug, p);

  const hasSupabase = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );

  if (hasSupabase) {
    try {
      const { getSupabaseClient } = await import('@/lib/supabase');
      const supabase = getSupabaseClient(process.env.SUPABASE_SERVICE_ROLE_KEY);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('published_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        for (const item of data) {
          const postMeta: PostMeta = {
            slug: item.slug,
            title: item.title || item.slug,
            description: item.description || '',
            date: item.published_at || item.created_at || new Date().toISOString(),
            author: item.author || 'AI-analytikern',
            tags: Array.isArray(item.tags) ? item.tags : [],
            cover: item.cover_url || undefined,
          };
          map.set(item.slug, postMeta);
          if (!memoryPosts.has(item.slug)) {
            memoryPosts.set(item.slug, {
              ...postMeta,
              content: item.content || '',
            });
          }
        }
      }
    } catch {
      // fallback to local posts
    }
  }

  const posts = Array.from(map.values());
  return posts.sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export async function getStoredBlogPost(slug: string): Promise<Post | null> {
  const local = getPost(slug);
  if (local) return local;

  const hasSupabase = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );

  if (hasSupabase) {
    try {
      const { getSupabaseClient } = await import('@/lib/supabase');
      const supabase = getSupabaseClient(process.env.SUPABASE_SERVICE_ROLE_KEY);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (!error && data) {
        const post: Post = {
          slug: data.slug,
          title: data.title,
          description: data.description || '',
          date: data.published_at || data.created_at || new Date().toISOString(),
          author: data.author || 'AI-analytikern',
          tags: Array.isArray(data.tags) ? data.tags : [],
          cover: data.cover_url || undefined,
          content: data.content || '',
        };
        memoryPosts.set(slug, post);
        return post;
      }
    } catch {}
  }

  return null;
}

export function getPost(slug: string): Post | null {
  // Check memory first
  if (memoryPosts.has(slug)) {
    return memoryPosts.get(slug)!;
  }

  // Check /tmp first (newest updates)
  const tmpCandidates = ['mdx', 'md'].map((ext) => path.join(TMP_POSTS_DIR, `${slug}.${ext}`));
  for (const candidate of tmpCandidates) {
    try {
      if (fs.existsSync(candidate)) {
        const raw = fs.readFileSync(candidate, 'utf8');
        const { data, content } = matter(raw);
        const post: Post = {
          slug,
          title: data.title || slug,
          description: data.description || '',
          date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
          author: data.author,
          tags: data.tags,
          cover: data.cover,
          content,
        };
        memoryPosts.set(slug, post);
        return post;
      }
    } catch {
      // ignore
    }
  }

  // Check project content
  const candidates = ['mdx', 'md'].map((ext) => path.join(POSTS_DIR, `${slug}.${ext}`));
  for (const candidate of candidates) {
    try {
      if (fs.existsSync(candidate)) {
        const raw = fs.readFileSync(candidate, 'utf8');
        const { data, content } = matter(raw);
        const post: Post = {
          slug,
          title: data.title || slug,
          description: data.description || '',
          date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
          author: data.author,
          tags: data.tags,
          cover: data.cover,
          content,
        };
        memoryPosts.set(slug, post);
        return post;
      }
    } catch {
      // ignore
    }
  }

  return null;
}

export function saveBlogPost(slug: string, rawContent: string, data: any): void {
  const post: Post = {
    slug,
    title: data.title || slug,
    description: data.description || '',
    date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
    author: data.author,
    tags: data.tags,
    cover: data.cover,
    content: rawContent,
  };
  memoryPosts.set(slug, post);

  const frontmatter: Record<string, any> = {
    title: post.title,
    description: post.description,
    date: post.date,
  };
  if (post.author) frontmatter.author = post.author;
  if (post.tags && post.tags.length > 0) frontmatter.tags = post.tags;
  if (post.cover) frontmatter.cover = post.cover;

  const fileBody = matter.stringify(rawContent || '', frontmatter);

  // Try writing to project folder
  let written = false;
  try {
    ensureDir(POSTS_DIR);
    const target = path.join(POSTS_DIR, `${slug}.mdx`);
    fs.writeFileSync(target, fileBody, 'utf8');
    written = true;
  } catch {
    // read only filesystem
  }

  // Always write to /tmp as well
  try {
    ensureDir(TMP_POSTS_DIR);
    const tmpTarget = path.join(TMP_POSTS_DIR, `${slug}.mdx`);
    fs.writeFileSync(tmpTarget, fileBody, 'utf8');
    written = true;
  } catch {
    // memory cache remains active
  }
}

export function deleteBlogPost(slug: string): void {
  memoryPosts.delete(slug);

  const dirs = [POSTS_DIR, TMP_POSTS_DIR];
  for (const d of dirs) {
    for (const ext of ['mdx', 'md']) {
      try {
        const file = path.join(d, `${slug}.${ext}`);
        if (fs.existsSync(file)) {
          fs.unlinkSync(file);
        }
      } catch {
        // ignore
      }
    }
  }
}
