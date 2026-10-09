import type { Metadata } from 'next';
import Link from 'next/link';
import {
  BookOpen,
  TrendingUp,
  Truck,
  MousePointerClick,
  BarChart3,
  Search,
  ExternalLink,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Strategiguider & Empirisk forskning – CRO, leverans & checkout-steg',
  description: 'Konkreta playbooks och empirisk forskningsdata från Baymard Institute, NN/g och CXL för konvertering och checkout-steg.',
  alternates: { canonical: '/guides' },
};

const guides = [
  {
    slug: 'empirisk-data',
    title: 'Empirisk forskningsdata: Vad säger forskningen om checkout-steg?',
    summary: 'Genomgång av 50+ vetenskapliga studier från Baymard Institute, NN/g och CXL om 1-steg vs flerstegskassor, formulärfriktion och konvertering.',
    icon: Search,
    featured: true,
  },
  {
    slug: 'cro-checkout',
    title: 'CRO i kassan – 12 optimeringsfaktorer som lyfter konvertering',
    summary: 'Från LIFT-modellen till BNPL-ordning och formulärergonomi. Vad som faktiskt rör nålen i svenska kassaflöden.',
    icon: TrendingUp,
  },
  {
    slug: 'fraktvaljaren-kassans-flaskhals',
    title: 'Fraktväljaren: Kassans verkliga flaskhals – Så lyfter du konverteringen 5–15%',
    summary: 'Varför kassan läcker vid fraktvalet och de 4 optimeringsfaktorerna med direkt bevisad effekt på konverteringsgraden.',
    icon: Truck,
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
    <section className="container-prose py-16 space-y-12">
      <div className="max-w-3xl">
        <p className="badge">Strategy & Research</p>
        <h1 className="mt-3 text-4xl md:text-5xl font-black tracking-tight">Strategiguider & Forskningsdata</h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
          Djupguider och empiriska studier för e-handelschefer och CRO-ansvariga. Verkliga siffror, inga buzzwords.
        </p>
      </div>

      {/* FEATURED CTA: EMPIRISK FORSKNINGSDATA */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-brand-950 p-8 sm:p-10 border border-slate-800 text-white shadow-2xl">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30">
            <Sparkles size={14} />
            <span>Kvantitativ databas & Källor</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            Empirisk forskningsdata: Hur påverkar steg och formulär konverteringen?
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Vi har sammanställt den samlade forskningen från <strong className="text-white font-semibold">Baymard Institute</strong>,{' '}
            <strong className="text-white font-semibold">Nielsen Norman Group (NN/g)</strong>,{' '}
            <strong className="text-white font-semibold">CXL</strong>,{' '}
            <strong className="text-white font-semibold">Stripe</strong> och{' '}
            <strong className="text-white font-semibold">PostNord E-barometern</strong>. Sök fritt bland studier, jämför 1-steg vs 3-steg och se exakta drop-off-siffror per moment.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/guides/empirisk-data"
              className="btn-primary text-sm font-bold px-6 py-3 shadow-lg"
            >
              Utforska all forskningsdata & källor <ArrowRight size={16} />
            </Link>

            <a
              href="https://baymard.com/checkout-usability"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition"
            >
              <span>Baymard Institute</span>
              <ExternalLink size={12} />
            </a>

            <a
              href="https://www.nngroup.com/articles/checkout-process/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition"
            >
              <span>Nielsen Norman Group</span>
              <ExternalLink size={12} />
            </a>

            <a
              href="https://cxl.com/blog/single-page-vs-multi-step-checkout/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition"
            >
              <span>CXL Checkout Study</span>
              <ExternalLink size={12} />
            </a>

            <Link
              href="/links"
              className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/80 text-indigo-200 hover:text-white text-xs font-semibold transition"
            >
              <span>Resurser &amp; Länkar (AmbassadorFlow m.fl.)</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {guides.map((g) => {
          const Icon = g.icon;
          return (
            <Link
              key={g.slug}
              href={`/guides/${g.slug}`}
              className={`card group block ${g.featured ? 'border-brand-500/50 bg-brand-50/20 dark:bg-brand-950/20 ring-1 ring-brand-500/30' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                  <Icon size={18} />
                </div>
                {g.featured && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 bg-brand-100 dark:bg-brand-950 px-2 py-0.5 rounded">
                    Nyckelresurs
                  </span>
                )}
              </div>
              <h2 className="mt-4 text-lg font-semibold group-hover:text-brand-600 transition">{g.title}</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{g.summary}</p>
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
