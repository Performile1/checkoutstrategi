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
