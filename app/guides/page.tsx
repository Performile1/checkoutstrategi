'use client';

import React from 'react';
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
  Sparkles,
  Compass
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';

export default function GuidesPage() {
  const { isEnglish } = useLanguage();

  const guides = [
    {
      slug: 'empirisk-data',
      title: isEnglish
        ? 'Empirical Research Data: What Does Science Say About Checkout Steps?'
        : 'Empirisk forskningsdata: Vad säger forskningen om checkout-steg?',
      summary: isEnglish
        ? 'Synthesis of 50+ peer-reviewed studies from Baymard Institute, NN/g, and CXL on single-page vs multi-step checkouts, form friction, and drop-off.'
        : 'Genomgång av 50+ vetenskapliga studier från Baymard Institute, NN/g och CXL om 1-steg vs flerstegskassor, formulärfriktion och konvertering.',
      icon: Search,
      featured: true,
    },
    {
      slug: 'cro-checkout',
      title: isEnglish
        ? 'CRO in Checkout – 12 Optimization Levers That Lift Conversion'
        : 'CRO i kassan – 12 optimeringsfaktorer som lyfter konvertering',
      summary: isEnglish
        ? 'From the LIFT model to BNPL sequencing and mobile keyboard ergonomics. What truly moves the needle in high-intent checkouts.'
        : 'Från LIFT-modellen till BNPL-ordning och formulärergonomi. Vad som faktiskt rör nålen i svenska kassaflöden.',
      icon: TrendingUp,
    },
    {
      slug: 'fraktvaljaren-kassans-flaskhals',
      title: isEnglish
        ? 'The Shipping Selector: The Real Checkout Bottleneck – Lift CVR by 5–15%'
        : 'Fraktväljaren: Kassans verkliga flaskhals – Så lyfter du konverteringen 5–15%',
      summary: isEnglish
        ? 'Why checkout funnels leak at the shipping step and the 4 tactical levers with proven impact on conversion rate.'
        : 'Varför kassan läcker vid fraktvalet och de 4 optimeringsfaktorerna med direkt bevisad effekt på konverteringsgraden.',
      icon: Truck,
    },
    {
      slug: 'delivery-experience',
      title: isEnglish
        ? 'Delivery Experience: Conversion Through Seamless Shipping Options'
        : 'Delivery Experience: konvertering genom leverans',
      summary: isEnglish
        ? 'How dynamic delivery management platforms move conversion and how to design smart parcel locker and home courier options.'
        : 'Hur Ingrid och nShift flyttar konvertering och hur du väljer rätt leveransval i kassan.',
      icon: Truck,
    },
    {
      slug: 'one-click-future',
      title: isEnglish
        ? 'The Future of One-Click Checkout & Mobile Wallets'
        : 'Framtiden för one-click checkout',
      summary: isEnglish
        ? 'Digital wallet convergence, passkeys, biometric authentication, and what Apple/Google Pay mean for e-commerce conversion.'
        : 'Wallet-konvergens, passkeys och vad Apple/Google Pay betyder för svensk e-handel.',
      icon: MousePointerClick,
    },
    {
      slug: 'checkout-analys-2026',
      title: isEnglish
        ? 'Checkout Analysis 2026: Micro-conversions, EU Regulations & Benchmarks'
        : 'Checkoutanalys 2026: Micro-conversions, EU-regler och Benchmarks',
      summary: isEnglish
        ? 'Complete guide to modern checkout performance audits with comprehensive metrics, updated regulations, and conversion benchmarks.'
        : 'Komplett guide till modern checkoutanalys med detaljerade mätpunkter, nya EU-regler för 2026 och uppdaterade branschbenchmarks.',
      icon: BarChart3,
    },
  ];

  return (
    <section className="container-prose py-16 space-y-12">
      <div className="max-w-3xl">
        <p className="badge">{isEnglish ? 'Strategy & Research' : 'Strategy & Research'}</p>
        <h1 className="mt-3 text-4xl md:text-5xl font-black tracking-tight">
          {isEnglish ? 'Strategy Guides & Research Data' : 'Strategiguider & Forskningsdata'}
        </h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
          {isEnglish
            ? 'In-depth playbooks and empirical studies for E-commerce Directors and CRO leaders. Real numbers, zero buzzwords.'
            : 'Djupguider och empiriska studier för e-handelschefer och CRO-ansvariga. Verkliga siffror, inga buzzwords.'}
        </p>
      </div>

      {/* FEATURED CTA: EMPIRISK FORSKNINGSDATA */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-brand-950 p-8 sm:p-10 border border-slate-800 text-white shadow-2xl">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30">
            <Sparkles size={14} />
            <span>{isEnglish ? 'Quantitative Research Database & Sources' : 'Kvantitativ databas & Källor'}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            {isEnglish
              ? 'Empirical Research Data: How Steps & Forms Impact Checkout Conversion'
              : 'Empirisk forskningsdata: Hur påverkar steg och formulär konverteringen?'}
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {isEnglish ? (
              <>
                We synthesized findings from <strong className="text-white font-semibold">Baymard Institute</strong>,{' '}
                <strong className="text-white font-semibold">Nielsen Norman Group (NN/g)</strong>,{' '}
                <strong className="text-white font-semibold">CXL</strong>,{' '}
                <strong className="text-white font-semibold">Stripe</strong>, and leading logistics benchmarks. Compare single-step vs multi-step checkouts and inspect exact drop-off data per step.
              </>
            ) : (
              <>
                Vi har sammanställt den samlade forskningen från <strong className="text-white font-semibold">Baymard Institute</strong>,{' '}
                <strong className="text-white font-semibold">Nielsen Norman Group (NN/g)</strong>,{' '}
                <strong className="text-white font-semibold">CXL</strong>,{' '}
                <strong className="text-white font-semibold">Stripe</strong> och{' '}
                <strong className="text-white font-semibold">PostNord E-barometern</strong>. Sök fritt bland studier, jämför 1-steg vs 3-steg och se exakta drop-off-siffror per moment.
              </>
            )}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/guides/empirisk-data"
              className="btn-primary text-sm font-bold px-6 py-3 shadow-lg"
            >
              {isEnglish ? 'Explore Research Database & Studies' : 'Utforska all forskningsdata & källor'} <ArrowRight size={16} />
            </Link>
            <Link
              href="/links"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 transition"
            >
              <Compass size={16} />
              <span>{isEnglish ? 'Resources & Partners' : 'Resurser & Länkar'}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* GUIDES GRID */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {guides.map((g) => {
          const Icon = g.icon;
          return (
            <Link
              key={g.slug}
              href={`/guides/${g.slug}`}
              className="card group flex flex-col justify-between hover:border-brand-500 hover:shadow-lg transition-all"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950 flex items-center justify-center text-brand-600 dark:text-brand-400 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                  <Icon size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors leading-snug">
                  {g.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {g.summary}
                </p>
              </div>

              <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-brand-600 dark:text-brand-400">
                <span>{isEnglish ? 'Read guide' : 'Läs guiden'}</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
