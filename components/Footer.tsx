import Link from 'next/link';
import { Rss, Mail, Github } from 'lucide-react';
import { siteConfig } from '@/lib/site';
import { players } from '@/lib/players';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-950">
      <div className="container-prose py-14 grid gap-10 md:grid-cols-4">
        <div>
          <h3 className="text-base font-semibold">{siteConfig.name}</h3>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 max-w-xs">
            {siteConfig.description}
          </p>
          <div className="mt-4 flex gap-3">
            <Link href="/rss.xml" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-brand-600 dark:text-slate-400">
              <Rss size={16} /> RSS
            </Link>
            <Link href={`mailto:${siteConfig.contactEmail}`} className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-brand-600 dark:text-slate-400">
              <Mail size={16} /> {siteConfig.contactEmail}
            </Link>
          </div>
        </div>

        <div className="md:col-span-2">
          <h4 className="text-sm font-semibold">Players</h4>
          <ul className="mt-3 grid grid-cols-3 gap-x-6 gap-y-2 text-sm">
            {players.map((p) => (
              <li key={p.slug}>
                <Link href={`/players/${p.slug}`} className="text-slate-600 hover:text-brand-600 dark:text-slate-400">
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Resurser</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/comparison" className="text-slate-600 hover:text-brand-600 dark:text-slate-400">Jämförelsetabell</Link></li>
            <li><Link href="/blog" className="text-slate-600 hover:text-brand-600 dark:text-slate-400">Blogg</Link></li>
            <li><Link href="/guides" className="text-slate-600 hover:text-brand-600 dark:text-slate-400">Strategiguider</Link></li>
            <li><Link href="/contact" className="text-slate-600 hover:text-brand-600 dark:text-slate-400">Kontakt / Köp domän</Link></li>
            <li><Link href="/sitemap.xml" className="text-slate-600 hover:text-brand-600 dark:text-slate-400">Sitemap</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200 dark:border-slate-800">
        <div className="container-prose py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {siteConfig.name}. Oberoende analys – ej anslutet till någon leverantör.</p>
          <p className="flex items-center gap-1"><Github size={14} /> Byggd för konvertering.</p>
        </div>
      </div>
    </footer>
  );
}
