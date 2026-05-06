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

function ensureDir() {
  if (!fs.existsSync(POSTS_DIR)) fs.mkdirSync(POSTS_DIR, { recursive: true });
}

export function getAllPosts(): PostMeta[] {
  ensureDir();
  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => (f.endsWith('.mdx') || f.endsWith('.md')) && !f.endsWith('.draft.mdx') && !f.endsWith('.draft.md'));
  const posts = files
    .map((file) => {
      const slug = file.replace(/\.(mdx|md)$/, '');
      const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
      const { data } = matter(raw);
      if (data.draft === true) return null; // belt-and-braces: honour explicit draft flag
      return {
        slug,
        title: data.title || slug,
        description: data.description || '',
        date: data.date || new Date().toISOString(),
        author: data.author,
        tags: data.tags,
        cover: data.cover,
      } as PostMeta;
    })
    .filter((p): p is PostMeta => p !== null);
  return posts.sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export function getPost(slug: string): Post | null {
  ensureDir();
  const candidates = ['mdx', 'md'].map((ext) => path.join(POSTS_DIR, `${slug}.${ext}`));
  const file = candidates.find((p) => fs.existsSync(p));
  if (!file) return null;
  const raw = fs.readFileSync(file, 'utf8');
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title || slug,
    description: data.description || '',
    date: data.date || new Date().toISOString(),
    author: data.author,
    tags: data.tags,
    cover: data.cover,
    content,
  };
}
