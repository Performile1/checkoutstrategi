import type { MetadataRoute } from 'next';
import { players } from '@/lib/players';
import { getAllPosts } from '@/lib/blog';
import { siteConfig } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url.replace(/\/$/, '');
  const staticPaths = ['', '/players', '/comparison', '/blog', '/guides', '/contact'];
  const guides = ['cro-checkout', 'delivery-experience', 'one-click-future'];
  const now = new Date();

  return [
    ...staticPaths.map((p) => ({ url: `${base}${p}`, lastModified: now, changeFrequency: 'weekly' as const, priority: p === '' ? 1 : 0.8 })),
    ...players.map((p) => ({ url: `${base}/players/${p.slug}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7 })),
    ...guides.map((s) => ({ url: `${base}/guides/${s}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.6 })),
    ...getAllPosts().map((p) => ({ url: `${base}/blog/${p.slug}`, lastModified: new Date(p.date), changeFrequency: 'monthly' as const, priority: 0.6 })),
  ];
}
