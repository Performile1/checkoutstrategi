import type { Metadata } from 'next';
import Link from 'next/link';
import {
  BarChart3,
  ExternalLink,
  ChevronRight,
  BookOpen,
  ArrowRight,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { ConversionResearchExplorer } from '@/components/ConversionResearchExplorer';
import { EXTERNAL_RESEARCH_INSTITUTES } from '@/lib/research';

export const metadata: Metadata = {
  title: 'Empirisk forskningsdata & Checkout Benchmarks | Strategiguider',
  description:
    'Vad säger vetenskapen om kassan och checkout-steg? Kvantitativ forskningsdata och A/B-tester från Baymard Institute, Nielsen Norman Group, CXL och Stripe.',
  alternates: { canonical: '/guides/empirisk-data' },
};

export default function EmpiricalDataGuidePage() {
  return (
    <div className="container-prose py-12 md:py-16 space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-brand-600">Hem</Link>
        <ChevronRight size={12} />
        <Link href="/guides" className="hover:text-brand-600">Strategiguider</Link>
        <ChevronRight size={12} />
        <span className="text-slate-800 dark:text-slate-200 font-semibold">Empirisk forskningsdata</span>
      </nav>

      {/* Hero Header */}
      <header className="max-w-4xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
          <BarChart3 size={14} />
          <span>Oberoende data & vetenskapliga tester</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
          Vad säger forskningen om checkout-steg och konvertering?
        </h1>

        <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed pt-2">
          Sluta basera kassan på åsikter och anekdoter. Här har vi sammanställt den samlade empiriska forskningen
          från världens tyngsta UX- och e-handelsinstitut – inklusive{' '}
          <strong className="text-slate-900 dark:text-white font-semibold">Baymard Institute</strong>,{' '}
          <strong className="text-slate-900 dark:text-white font-semibold">Nielsen Norman Group (NN/g)</strong>,{' '}
          <strong className="text-slate-900 dark:text-white font-semibold">CXL</strong>,{' '}
          <strong className="text-slate-900 dark:text-white font-semibold">Stripe</strong> och{' '}
          <strong className="text-slate-900 dark:text-white font-semibold">PostNord E-barometern</strong>.
        </p>
      </header>

      {/* Primära institut i blickfånget */}
      <section className="bg-slate-50 dark:bg-slate-900/60 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              De viktigaste forskningskällorna
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Oberoende institut med storskalig användartestning och verifierad metodik.
            </p>
          </div>
          <span className="text-xs font-medium text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950 px-2.5 py-1 rounded-md self-start sm:self-auto">
            6 granskade källor
          </span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {EXTERNAL_RESEARCH_INSTITUTES.map((inst) => (
            <a
              key={inst.name}
              href={inst.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card group hover:border-brand-500 dark:hover:border-brand-500 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                    {inst.tag}
                  </span>
                  <ExternalLink size={13} className="text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition text-base">
                  {inst.name}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  {inst.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">
                  {inst.highlightStat}
                </span>
                <span className="text-brand-600 dark:text-brand-400 font-semibold inline-flex items-center gap-0.5 text-[11px] group-hover:underline">
                  Läs rapport &rarr;
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Huvudverktyg: Forskningsdatabas & Sök */}
      <section className="space-y-6">
        <ConversionResearchExplorer />
      </section>

      {/* Sammanfattande syntes: Hur ska du bygga din kassa? */}
      <section className="card p-6 sm:p-10 bg-gradient-to-br from-white via-slate-50 to-brand-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-brand-950/20 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-8">
        <div>
          <span className="badge">Beslutsmatris</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
            Hur ska du välja stegarkitektur baserat på data?
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2 max-w-3xl">
            Empirisk forskning visar att det inte finns någon &ldquo;universell kassa&rdquo; som fungerar bäst för alla.
            Rätt val beror på ordervärde (AOV), komplexitet i frakt och målgruppens enhetsfördelning:
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-sm">
                1
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">1-stegs kassa</h3>
            </div>
            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Bäst för:</strong> D2C, mode, smink, kosttillskott och enkla standardköp.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Krav:</strong> Högst 6–8 formulärfält och autofill via Klarna eller postnummer.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Forskningsfynd:</strong> Upp till +11.8 % konverteringslyft när klickmotstånd minimeras (CXL).</span>
              </li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-sm">
                2
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">2-stegs kassa</h3>
            </div>
            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 size={14} className="text-blue-500 shrink-0 mt-0.5" />
                <span><strong>Bäst för:</strong> E-handlare med aktiv abandoned cart e-post och flera fraktval.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 size={14} className="text-blue-500 shrink-0 mt-0.5" />
                <span><strong>Krav:</strong> Fånga e-post och mobil i Steg 1 innan frakt/betalning visas.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 size={14} className="text-blue-500 shrink-0 mt-0.5" />
                <span><strong>Forskningsfynd:</strong> Återtar +32 % av övergivna kassor tack vare säkerställd lead-capture (Klaviyo/PostNord).</span>
              </li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-black text-sm">
                3
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">3-stegs kassa</h3>
            </div>
            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 size={14} className="text-purple-500 shrink-0 mt-0.5" />
                <span><strong>Bäst för:</strong> Sällanköp, möbler, elektronik, byggvaror och högt AOV (&gt; 2 500 kr).</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 size={14} className="text-purple-500 shrink-0 mt-0.5" />
                <span><strong>Krav:</strong> Tydlig progressbar och överskådliga sammanfattningar per steg.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 size={14} className="text-purple-500 shrink-0 mt-0.5" />
                <span><strong>Forskningsfynd:</strong> Minskar kognitiv överbelastning vid leveransbokning och delbetalning (Baymard).</span>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA till Checkout Lab */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-lg">
              Vill du testa dessa principer i praktiken?
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Bygg och konfigurera din egen 1-, 2- eller 3-stegskassa i vårt interaktiva Checkout Lab.
            </p>
          </div>
          <Link
            href="/testcheckout"
            className="btn-primary text-sm whitespace-nowrap self-start sm:self-auto"
          >
            Öppna Checkout Lab <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
