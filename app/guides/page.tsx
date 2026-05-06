import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, TrendingUp, Truck, MousePointerClick, BarChart3 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Strategiguider – CRO, leverans & one-click checkout',
  description: 'Konkreta playbooks för konvertering, leveransupplevelse och framtidens one-click checkout.',
  alternates: { canonical: '/guides' },
};

const guides = [
  {
    slug: 'cro-checkout',
    title: 'CRO i kassan – 12 spaks som lyfter konvertering',
    summary: 'Från fälten till BNPL-ordning. Vad som faktiskt rör nålen i svenska kassaflöden.',
    icon: TrendingUp,
  },
  {
    slug: 'delivery-experience',
    title: 'Delivery Experience: konvertering genom leverans',
    summary: 'Hur Ingrid och nShift flyttar konvertering och hur du väljer rätt leveransval i kassan.',
    icon: Truck,
  },
  {
    slug: 'one-click-future',
    title: 'Framtiden för one-click checkout',
    summary: 'Wallet-konvergens, passkeys och vad Apple/Google Pay betyder för svensk e-handel.',
    icon: MousePointerClick,
  },
  {
    slug: 'checkout-analys-2026',
    title: 'Checkoutanalys 2026: Micro-conversions, EU-regler och Benchmarks',
    summary: 'Komplett guide till modern checkoutanalys med detaljerade mätpunkter, nya EU-regler för 2026 och uppdaterade branschbenchmarks.',
    icon: BarChart3,
  },
];

export default function GuidesPage() {
  return (
    <section className="container-prose py-16">
      <div className="max-w-2xl">
        <p className="badge">Strategy</p>
        <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">Strategiguider</h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
          Djupguider för e-handelschefer och CRO-ansvariga. Verkliga spaks, inga buzzwords.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {guides.map((g) => {
          const Icon = g.icon;
          return (
            <Link key={g.slug} href={`/guides/${g.slug}`} className="card group block">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                <Icon size={18} />
              </div>
              <h2 className="mt-4 text-lg font-semibold group-hover:text-brand-600 transition">{g.title}</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{g.summary}</p>
              <p className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600">
                <BookOpen size={14} /> Läs guiden
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
