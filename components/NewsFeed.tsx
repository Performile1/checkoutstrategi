'use client';

import React, { useState, useEffect } from 'react';
import { ExternalLink, Newspaper, RefreshCw } from 'lucide-react';

export interface FeedItem {
  title: string;
  link: string;
  isoDate?: string;
  source: string;
}

const DEFAULT_ITEMS: FeedItem[] = [
  {
    title: 'Svensk e-handel: Leveransväljarens utformning avgör upp till 15% av kassans konvertering',
    link: 'https://www.ehandel.se',
    isoDate: '2026-05-10',
    source: 'Ehandel.se',
  },
  {
    title: 'Klarna och Walley driver skiftet mot friktionsfria ettklicksköp i Norden',
    link: 'https://www.ehandel.se',
    isoDate: '2026-05-09',
    source: 'Ehandel.se',
  },
  {
    title: 'Baymard Institute: Dolda avgifter och otydliga leveransdatum sänker checkout-konvertering',
    link: 'https://www.digitalcommerce360.com',
    isoDate: '2026-05-08',
    source: 'Digital Commerce 360',
  },
  {
    title: 'Instabee och PostNord lanserar realtidsvalidering av paketboxar i e-handelskassor',
    link: 'https://www.ehandel.se',
    isoDate: '2026-05-07',
    source: 'Ehandel.se',
  },
  {
    title: 'Post-purchase CRO: Så förvandlas tracking och leveransavier till återkommande köp',
    link: 'https://www.finextra.com',
    isoDate: '2026-05-06',
    source: 'Finextra',
  },
  {
    title: 'Qliro och Adyen förstärker stödet för dynamisk betalnings-routing i Norden',
    link: 'https://www.finextra.com',
    isoDate: '2026-05-05',
    source: 'Finextra',
  },
];

function formatDate(isoString?: string): string {
  if (!isoString) return '';
  return isoString.slice(0, 10);
}

export function NewsFeed({ limit = 6, compact = false }: { limit?: number; compact?: boolean }) {
  const [items, setItems] = useState<FeedItem[]>(() => DEFAULT_ITEMS.slice(0, limit));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadNews() {
      try {
        setLoading(true);
        const res = await fetch(`/api/news?limit=${limit}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && Array.isArray(data.items) && data.items.length > 0) {
            setItems(data.items);
          }
        }
      } catch {
        // Keep default items on network error
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadNews();
    return () => {
      isMounted = false;
    };
  }, [limit]);

  const list = items.slice(0, limit);

  if (list.length === 0) {
    return (
      <div className="card text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
        <Newspaper size={16} /> Live-feeden laddas...
      </div>
    );
  }

  if (compact) {
    return (
      <div className="relative">
        <ul className="space-y-3 text-sm">
          {list.map((it, idx) => (
            <li key={it.link + idx}>
              <a href={it.link} target="_blank" rel="noopener noreferrer" className="block group">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {it.source} {it.isoDate ? `· ${formatDate(it.isoDate)}` : ''}
                </span>
                <span className="block mt-0.5 font-medium group-hover:text-brand-600 dark:group-hover:text-brand-400 line-clamp-2 transition text-slate-900 dark:text-slate-100">
                  {it.title}
                </span>
              </a>
            </li>
          ))}
        </ul>
        {loading && (
          <div className="absolute top-0 right-0 p-1 opacity-40">
            <RefreshCw size={12} className="animate-spin text-slate-400" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {list.map((it, idx) => (
          <a
            key={it.link + idx}
            href={it.link}
            target="_blank"
            rel="noopener noreferrer"
            className="card group flex flex-col justify-between hover:border-brand-300 dark:hover:border-brand-700 transition"
          >
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Newspaper size={13} className="text-brand-500" /> {it.source} {it.isoDate ? `· ${formatDate(it.isoDate)}` : ''}
              </p>
              <h3 className="mt-2.5 font-semibold leading-snug group-hover:text-brand-600 dark:group-hover:text-brand-400 line-clamp-3 transition text-slate-900 dark:text-slate-100">
                {it.title}
              </h3>
            </div>
            <p className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-brand-600 dark:text-brand-400 group-hover:underline">
              Läs artikel <ExternalLink size={12} />
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
export default NewsFeed;
