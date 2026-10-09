import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

export const dynamic = 'force-dynamic';

const FEEDS: { name: string; url: string }[] = [
  { name: 'Ehandel.se', url: 'https://www.ehandel.se/feed' },
  { name: 'Digital Commerce 360', url: 'https://www.digitalcommerce360.com/feed/' },
  { name: 'Finextra', url: 'https://www.finextra.com/rss/headlines.aspx' },
];

export interface FeedItem {
  title: string;
  link: string;
  isoDate?: string;
  source: string;
}

const FALLBACK_NEWS: FeedItem[] = [
  {
    title: 'Svensk e-handel: Leveransväljarens utformning avgör upp till 15% av kassans konvertering',
    link: 'https://www.ehandel.se',
    isoDate: new Date().toISOString(),
    source: 'Ehandel.se',
  },
  {
    title: 'Klarna och Walley driver skiftet mot friktionsfria ettklicksköp i Norden',
    link: 'https://www.ehandel.se',
    isoDate: new Date().toISOString(),
    source: 'Ehandel.se',
  },
  {
    title: 'Baymard Institute: Dolda avgifter och otydliga leveransdatum sänker checkout-konvertering',
    link: 'https://www.digitalcommerce360.com',
    isoDate: new Date().toISOString(),
    source: 'Digital Commerce 360',
  },
  {
    title: 'Instabee och PostNord lanserar realtidsvalidering av paketboxar i e-handelskassor',
    link: 'https://www.ehandel.se',
    isoDate: new Date().toISOString(),
    source: 'Ehandel.se',
  },
  {
    title: 'Post-purchase CRO: Så förvandlas tracking och leveransavier till återkommande köp',
    link: 'https://www.finextra.com',
    isoDate: new Date().toISOString(),
    source: 'Finextra',
  },
  {
    title: 'Qliro och Adyen förstärker stödet för dynamisk betalnings-routing i Norden',
    link: 'https://www.finextra.com',
    isoDate: new Date().toISOString(),
    source: 'Finextra',
  },
];

let cachedFeed: { data: FeedItem[]; timestamp: number } | null = null;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '6', 10);

  const now = Date.now();
  if (cachedFeed && now - cachedFeed.timestamp < CACHE_TTL_MS) {
    return NextResponse.json({ items: cachedFeed.data.slice(0, limit) });
  }

  const parser = new Parser({ timeout: 5000 });
  const all: FeedItem[] = [];

  try {
    await Promise.all(
      FEEDS.map(async (f) => {
        try {
          const feed = await parser.parseURL(f.url);
          feed.items.slice(0, 8).forEach((item) => {
            if (item.title && item.link) {
              all.push({
                title: item.title,
                link: item.link,
                isoDate: item.isoDate,
                source: f.name,
              });
            }
          });
        } catch {
          // Ignore individual feed failures
        }
      })
    );
  } catch {
    // Ignore overall failures
  }

  const sorted = all.length > 0
    ? all.sort((a, b) => +new Date(b.isoDate || 0) - +new Date(a.isoDate || 0))
    : FALLBACK_NEWS;

  cachedFeed = {
    data: sorted,
    timestamp: now,
  };

  return NextResponse.json({ items: sorted.slice(0, limit) });
}
