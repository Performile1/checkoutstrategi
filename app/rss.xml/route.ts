import { NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/blog';
import { siteConfig } from '@/lib/site';

export const revalidate = 3600;

function escape(s: string) {
  return s.replace(/[<>&'"]/g, (c) =>
    ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c] as string)
  );
}

export async function GET() {
  const base = siteConfig.url.replace(/\/$/, '');
  const posts = getAllPosts();

  const items = posts
    .map(
      (p) => `
    <item>
      <title>${escape(p.title)}</title>
      <link>${base}/blog/${p.slug}</link>
      <guid>${base}/blog/${p.slug}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description>${escape(p.description)}</description>
    </item>`
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escape(siteConfig.name)}</title>
    <link>${base}</link>
    <description>${escape(siteConfig.description)}</description>
    <language>sv-SE</language>
    ${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
