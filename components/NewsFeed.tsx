import { ExternalLink, Newspaper } from 'lucide-react';
import Parser from 'rss-parser';

const FEEDS: { name: string; url: string }[] = [
  { name: 'Ehandel.se', url: 'https://www.ehandel.se/feed' },
  { name: 'Digital Commerce 360', url: 'https://www.digitalcommerce360.com/feed/' },
  { name: 'Finextra', url: 'https://www.finextra.com/rss/headlines.aspx' },
];

interface FeedItem {
  title: string;
  link: string;
  isoDate?: string;
  source: string;
}

async function fetchFeeds(): Promise<FeedItem[]> {
  const parser = new Parser({ timeout: 8000 });
  const all: FeedItem[] = [];
  await Promise.all(
    FEEDS.map(async (f) => {
      try {
        const feed = await parser.parseURL(f.url);
        feed.items.slice(0, 8).forEach((item) => {
          if (item.title && item.link) {
            all.push({ title: item.title, link: item.link, isoDate: item.isoDate, source: f.name });
          }
        });
      } catch {
        /* ignore */
      }
    })
  );
  return all.sort((a, b) => +new Date(b.isoDate || 0) - +new Date(a.isoDate || 0));
}

export async function NewsFeed({ limit = 6, compact = false }: { limit?: number; compact?: boolean }) {
  const items = await fetchFeeds().catch(() => [] as FeedItem[]);
  const list = items.slice(0, limit);

  if (list.length === 0) {
    return (
      <div className="card text-sm text-slate-500 flex items-center gap-2">
        <Newspaper size={16} /> Live-feeden är tillfälligt otillgänglig.
      </div>
    );
  }

  if (compact) {
    return (
      <ul className="space-y-3 text-sm">
        {list.map((it) => (
          <li key={it.link}>
            <a href={it.link} target="_blank" rel="noopener" className="block group">
              <span className="text-xs text-slate-500">{it.source} · {it.isoDate ? new Date(it.isoDate).toLocaleDateString('sv-SE') : ''}</span>
              <span className="block mt-0.5 font-medium group-hover:text-brand-600 line-clamp-2">{it.title}</span>
            </a>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {list.map((it) => (
        <a
          key={it.link}
          href={it.link}
          target="_blank"
          rel="noopener"
          className="card group flex flex-col justify-between hover:border-brand-300 transition"
        >
          <div>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <Newspaper size={12} /> {it.source} · {it.isoDate ? new Date(it.isoDate).toLocaleDateString('sv-SE') : ''}
            </p>
            <h3 className="mt-2 font-semibold leading-snug group-hover:text-brand-600 line-clamp-3">{it.title}</h3>
          </div>
          <p className="mt-4 inline-flex items-center gap-1 text-xs text-brand-600">
            Läs hos {it.source} <ExternalLink size={12} />
          </p>
        </a>
      ))}
    </div>
  );
}
