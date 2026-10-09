'use client';

import Link from 'next/link';
import { Rss, Mail, Github } from 'lucide-react';
import { players } from '@/lib/players';
import { useLanguage } from '@/lib/i18n/context';

export function Footer() {
  const { t, domain, isEnglish } = useLanguage();

  return (
    <footer className="border-t border-slate-200 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-950">
      <div className="container-prose py-14 grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex flex-col">
            <h3 className="text-base font-bold">{t.brandName}</h3>
            <span className="text-xs text-slate-400 font-mono">{domain}</span>
          </div>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 max-w-xs leading-relaxed">
            {t.brandDescription}
          </p>
          <div className="mt-4 flex gap-3">
            <Link href="/rss.xml" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-brand-600 dark:text-slate-400">
              <Rss size={16} /> {t.footer.rss}
            </Link>
            <Link href={`mailto:${t.footer.contact}`} className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-brand-600 dark:text-slate-400">
              <Mail size={16} /> {t.footer.contact}
            </Link>
          </div>
        </div>

        <div className="md:col-span-2">
          <h4 className="text-sm font-semibold">{t.footer.playersTitle}</h4>
          <ul className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 text-sm">
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
          <h4 className="text-sm font-semibold">{t.footer.resourcesTitle}</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/comparison" className="text-slate-600 hover:text-brand-600 dark:text-slate-400">{t.footer.comparisonTable}</Link></li>
            <li><Link href="/testcheckout" className="text-slate-600 hover:text-brand-600 dark:text-slate-400">{t.nav.checkoutLab}</Link></li>
            <li><Link href="/tracking" className="text-slate-600 hover:text-brand-600 dark:text-slate-400">{t.nav.trackingCro}</Link></li>
            <li><Link href="/spela" className="text-slate-600 hover:text-brand-600 dark:text-slate-400">{t.nav.winTheCustomer}</Link></li>
            <li><Link href="/links" className="text-slate-600 hover:text-brand-600 dark:text-slate-400 font-semibold text-brand-600 dark:text-brand-400">{t.footer.resourcesAndLinks}</Link></li>
            <li><Link href="/blog" className="text-slate-600 hover:text-brand-600 dark:text-slate-400">{t.footer.blog}</Link></li>
            <li><Link href="/guides" className="text-slate-600 hover:text-brand-600 dark:text-slate-400">{t.footer.strategyGuides}</Link></li>
            <li><Link href="/contact" className="text-slate-600 hover:text-brand-600 dark:text-slate-400">{t.footer.contactBuyDomain}</Link></li>
            <li><Link href="/sitemap.xml" className="text-slate-600 hover:text-brand-600 dark:text-slate-400">{t.footer.sitemap}</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200 dark:border-slate-800">
        <div className="container-prose py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {t.brandName} ({domain}). {t.footer.rightsReserved}</p>
          <p className="flex items-center gap-1"><Github size={14} /> {t.footer.builtForConversion}</p>
        </div>
      </div>
    </footer>
  );
}
