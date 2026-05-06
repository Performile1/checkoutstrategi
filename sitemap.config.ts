import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://checkoutstrategi.se';

  // Static pages
  const staticPages = [
    '',
    '/players',
    '/comparison',
    '/blog',
    '/guides',
    '/testcheckout',
  ];

  // Generate static sitemap entries
  const staticEntries = staticPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.8,
  }));

  // Dynamic player pages (will be generated from players data)
  const { players } = require('@/lib/players');
  const playerEntries = players.map((player: any) => ({
    url: `${baseUrl}/players/${player.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Dynamic blog pages (will be generated from blog_posts table)
  // This would require fetching from Supabase, but for now we'll add a placeholder
  const blogEntries: MetadataRoute.Sitemap = [];

  return [...staticEntries, ...playerEntries, ...blogEntries];
}
