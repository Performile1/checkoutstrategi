'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  Truck,
  Sparkles,
  ShieldCheck,
  Star,
  Search,
  ExternalLink,
  Layers,
  Sliders,
  Repeat,
  Mail,
  Gamepad2,
  Compass
} from 'lucide-react';
import { players } from '@/lib/players';
import { PlayerCard } from '@/components/PlayerCard';
import { NewsFeed } from '@/components/NewsFeed';
import { useLanguage } from '@/lib/i18n/context';

export default function HomePage() {
  const { t, isEnglish, domain } = useLanguage();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-50 via-white to-white dark:from-brand-950/40 dark:via-slate-950 dark:to-slate-950" />
        <div className="container-prose py-20 md:py-28">
          <div className="flex items-center gap-2 mb-3">
            <span className="badge">{t.home.heroBadge}</span>
            <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
              {domain}
            </span>
          </div>

          <h1 className="mt-4 text-4xl md:text-6xl font-bold tracking-tight max-w-3xl">
            {t.home.heroTitlePrefix} <span className="text-brand-600">{t.home.heroTitleCheckout}</span>.{' '}
            <span className="font-extrabold">{t.home.heroTitleMiddle}</span>.{' '}
            {t.home.heroTitleSuffix}
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            {t.home.heroDescription}
          </p>

          <div className="mt-8 flex flex-wrap gap-2.5 sm:gap-3">
            <Link href="/players" className="btn-primary text-sm sm:text-base md:text-lg px-5 sm:px-8 py-3 sm:py-4">
              {t.home.heroExploreCta} <ArrowRight size={16} />
            </Link>
            <Link href="/comparison" className="btn-secondary text-sm sm:text-base md:text-lg px-5 sm:px-8 py-3 sm:py-4">
              {t.home.heroCompareCta}
            </Link>
            <Link href="/testcheckout" className="inline-flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-bold hover:bg-slate-800 transition text-sm sm:text-base">
              <Sliders size={18} className="text-emerald-400" />
              <span>Checkout Lab</span>
            </Link>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-3 max-w-3xl">
            <Stat
              icon={<BarChart3 size={18} />}
              label={t.home.statCroLabel}
              value="+18%"
              desc={t.home.statCroDesc}
            />
            <Stat
              icon={<Truck size={18} />}
              label={t.home.statLogisticsLabel}
              value="+12%"
              desc={t.home.statLogisticsDesc}
            />
            <Stat
              icon={<ShieldCheck size={18} />}
              label={t.home.statTrustLabel}
              value="6/6"
              desc={t.home.statTrustDesc}
            />
          </div>
        </div>
      </section>

      {/* VIKNINGSLINJE (THE FOLD) PÅ BÅDE DESKTOP OCH MOBIL */}
      <div className="container-prose relative py-3 select-none pointer-events-none">
        <div className="relative w-full border-t-2 border-dashed border-rose-500/70 dark:border-rose-400/70">
          <div className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-rose-600 text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow flex items-center gap-1 whitespace-nowrap">
            <span>✂ {isEnglish ? 'THE FOLD (Vikningslinje) • 80% Attention Above Fold' : 'VIKNINGSLINJE (The Fold) • 80% Av Blickfånget Ligger Ovanför'}</span>
          </div>
        </div>
      </div>

      {/* INTERAKTIVA VERKTYG & LAB SECTION */}
      <section className="bg-slate-900 text-white py-20 border-y border-slate-800 relative overflow-hidden">
        <div className="container-prose relative z-10 space-y-12">
          <div className="max-w-2xl space-y-3">
            <p className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Sparkles size={13} /> {t.home.toolsBadge}
            </p>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">
              {t.home.toolsTitle}
            </h2>
            <p className="text-slate-300 text-base leading-relaxed">
              {t.home.toolsDesc}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Tool 1: Checkout Lab */}
            <Link
              href="/testcheckout"
              className="bg-slate-850 p-6 rounded-2xl border border-slate-700/80 hover:border-brand-500 transition-all group flex flex-col justify-between hover:-translate-y-1"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold">
                  <Sliders size={20} />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-brand-400 transition">
                  {t.home.toolsCheckoutLabTitle}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {t.home.toolsCheckoutLabDesc}
                </p>
              </div>
              <div className="pt-4 mt-2 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-brand-400">
                <span>{t.home.toolsCta}</span>
                <ArrowRight size={14} />
              </div>
            </Link>

            {/* Tool 2: Tracking CRO */}
            <Link
              href="/tracking"
              className="bg-slate-850 p-6 rounded-2xl border border-slate-700/80 hover:border-emerald-500 transition-all group flex flex-col justify-between hover:-translate-y-1"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <Repeat size={20} />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition">
                  {t.home.toolsTrackingTitle}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {t.home.toolsTrackingDesc}
                </p>
              </div>
              <div className="pt-4 mt-2 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-400">
                <span>{t.home.toolsCta}</span>
                <ArrowRight size={14} />
              </div>
            </Link>

            {/* Tool 3: Win the customer game */}
            <Link
              href="/spela"
              className="bg-slate-850 p-6 rounded-2xl border border-slate-700/80 hover:border-indigo-500 transition-all group flex flex-col justify-between hover:-translate-y-1"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                  <Gamepad2 size={20} />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition">
                  {t.home.toolsGameTitle}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {t.home.toolsGameDesc}
                </p>
              </div>
              <div className="pt-4 mt-2 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-indigo-400">
                <span>{isEnglish ? 'Play Now' : 'Spela nu'}</span>
                <ArrowRight size={14} />
              </div>
            </Link>

            {/* Tool 4: Email campaigns & ROI */}
            <Link
              href="/email-campaigns"
              className="bg-slate-850 p-6 rounded-2xl border border-slate-700/80 hover:border-purple-500 transition-all group flex flex-col justify-between hover:-translate-y-1"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                  <Mail size={20} />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition">
                  {t.home.toolsEmailTitle}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {t.home.toolsEmailDesc}
                </p>
              </div>
              <div className="pt-4 mt-2 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-purple-400">
                <span>{t.home.toolsCta}</span>
                <ArrowRight size={14} />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Players preview */}
      <section className="container-prose py-20">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="badge">{t.home.playersBadge}</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
              {t.home.playersTitle}
            </h2>
            <p className="mt-3 max-w-xl text-slate-600 dark:text-slate-400">
              {t.home.playersDesc}
            </p>
          </div>
          <Link href="/players" className="text-sm font-semibold text-brand-600 inline-flex items-center gap-1">
            {t.home.allPlayersLink} <ArrowRight size={14} />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {players.slice(0, 6).map((p, i) => (
            <PlayerCard key={p.slug} player={p} index={i} />
          ))}
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-slate-50 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="container-prose py-16">
          <div className="text-center mb-10">
            <p className="badge">{t.home.testimonialsBadge}</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">
              {t.home.testimonialsTitle}
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <Testimonial
              name="Anna Lindberg"
              company="TechStore AB"
              rating={5}
              text={
                isEnglish
                  ? "Checkout Strategy gave us clarity. Switching our checkout flow improved our conversion rate by 22% in the very first month."
                  : "Checkoutstrategi hjälpte oss välja rätt checkout. Konverteringen ökade med 22% första månaden."
              }
            />
            <Testimonial
              name="Erik Svensson"
              company="Fashion Nordic"
              rating={5}
              text={
                isEnglish
                  ? "The side-by-side comparison tables saved our engineering team weeks of tedious vendor research. Highly recommended!"
                  : "Jämförelsetabellen sparade oss veckor av research. Klar rekommendation!"
              }
            />
            <Testimonial
              name="Maria Nilsson"
              company="HomeDecor SE"
              rating={4}
              text={
                isEnglish
                  ? "Truly independent intelligence makes all the difference. No sales hype, just hard conversion data and real benchmarks."
                  : "Oberoende analyser gör skillnad. Blev inte sålda av säljare utan fick fakta."
              }
            />
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="container-prose py-12">
        <div className="flex flex-wrap items-center justify-center gap-8 text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} />
            <span className="text-sm">{isEnglish ? 'GDPR Compliant' : 'GDPR-kompatibel'}</span>
          </div>
          <div className="flex items-center gap-2">
            <BarChart3 size={20} />
            <span className="text-sm">{isEnglish ? 'Data-Driven Analysis' : 'Data-driven analys'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles size={20} />
            <span className="text-sm">{isEnglish ? 'AI-Powered Insights' : 'AI-powered insights'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck size={20} />
            <span className="text-sm">{isEnglish ? 'Nordic & Global Logistics' : 'Svensk & Nordisk expertis'}</span>
          </div>
        </div>
      </section>

      {/* Empirisk Forskningsdata & Benchmarks CTA */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-950 text-white border-y border-slate-800 py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="container-prose relative z-10 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30">
                <Search size={13} />
                <span>{isEnglish ? 'Independent Science & Empirical Data' : 'Oberoende Forskning & Vetenskap'}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
                {isEnglish
                  ? 'What does research reveal about checkout steps and conversion?'
                  : 'Vad säger forskningen om checkout-steg och konvertering?'}
              </h2>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed pt-1">
                {isEnglish ? (
                  <>
                    Avoid guesswork and anecdotal opinions. Discover what 130,000+ hours of user testing from{' '}
                    <strong className="text-white font-semibold">Baymard Institute</strong>,{' '}
                    <strong className="text-white font-semibold">Nielsen Norman Group (NN/g)</strong>, and{' '}
                    <strong className="text-white font-semibold">CXL</strong> prove regarding single-page vs. multi-step flows.
                  </>
                ) : (
                  <>
                    Sluta gissa och undvik anekdotisk optimering. Upptäck vad över 130 000 timmars användartester och miljontals transaktioner från{' '}
                    <strong className="text-white font-semibold">Baymard Institute</strong>,{' '}
                    <strong className="text-white font-semibold">Nielsen Norman Group (NN/g)</strong>, och{' '}
                    <strong className="text-white font-semibold">CXL</strong> visar om 1-stegs vs flerstegskassor.
                  </>
                )}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                href="/guides/empirisk-data"
                className="btn-primary text-sm font-bold px-6 py-3.5 shadow-lg flex items-center justify-center gap-2"
              >
                <span>{isEnglish ? 'Explore Research Data' : 'Utforska all forskningsdata'}</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/links"
                className="px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 flex items-center justify-center gap-2"
              >
                <Compass size={16} />
                <span>{isEnglish ? 'Resources & Links' : 'Resurser & Länkar'}</span>
              </Link>
            </div>
          </div>

          {/* Forsknings-highlights */}
          <div className="grid sm:grid-cols-3 gap-4 pt-4">
            <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
              <div className="text-xs uppercase font-bold text-brand-400 tracking-wider">
                {isEnglish ? '70.19% Benchmark' : '70.19 % Benchmark'}
              </div>
              <div className="text-2xl font-black text-white">
                {isEnglish ? 'Average Cart Abandonment' : 'Genomsnittligt kassaavhopp'}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isEnglish
                  ? 'Aggregated across 49 studies by Baymard Institute. 2 out of 3 users abandon before completion.'
                  : 'Baserat på 49 studier från Baymard. 2 av 3 som påbörjar ett köp slutför inte.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
              <div className="text-xs uppercase font-bold text-emerald-400 tracking-wider">
                {isEnglish ? '+35.26% Lift' : '+35.26 % Lyft'}
              </div>
              <div className="text-2xl font-black text-white">
                {isEnglish ? 'Recovery Potential' : 'Återhämtningspotential'}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isEnglish
                  ? 'Proportion of lost orders recoverable solely through optimized checkout UX and reduced form friction.'
                  : 'Andel av förlorade ordrar som kan räddas enbart genom bättre formulärergonomi och förenklade fält.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
              <div className="text-xs uppercase font-bold text-indigo-400 tracking-wider">
                {isEnglish ? '-41% Drop-off' : '-41 % Avhopp'}
              </div>
              <div className="text-2xl font-black text-white">
                {isEnglish ? 'Upfront Shipping Rates' : 'Tidig fraktkostnad'}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isEnglish
                  ? 'Reduction in abandonment when shipping costs and delivery ETA are transparent before payment.'
                  : 'Minskning av avhopp när frakt och leveranstid presenteras transparent före betalning.'}
              </p>
            </div>
          </div>

          {/* Externa länkar */}
          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
            <span className="font-semibold text-slate-300">
              {isEnglish ? 'Direct links to primary sources:' : 'Direktlänkar till externa källor:'}
            </span>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="https://baymard.com/checkout-usability"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition inline-flex items-center gap-1 hover:underline"
              >
                Baymard Institute <ExternalLink size={11} />
              </a>
              <span className="text-slate-600">·</span>
              <a
                href="https://www.nngroup.com/articles/checkout-process/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition inline-flex items-center gap-1 hover:underline"
              >
                Nielsen Norman Group <ExternalLink size={11} />
              </a>
              <span className="text-slate-600">·</span>
              <a
                href="https://cxl.com/blog/single-page-vs-multi-step-checkout/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition inline-flex items-center gap-1 hover:underline"
              >
                CXL Institute <ExternalLink size={11} />
              </a>
              <span className="text-slate-600">·</span>
              <a
                href="https://ambassadorflow.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400 transition inline-flex items-center gap-1 hover:underline font-semibold"
              >
                AmbassadorFlow <ExternalLink size={11} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* News feed */}
      <section className="border-t border-slate-200 dark:border-slate-800">
        <div className="container-prose py-20">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <p className="badge"><Sparkles size={12} className="mr-1" /> Traffic Engine</p>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
                {isEnglish ? 'AI-Driven E-Commerce Intelligence' : 'AI-driven nyhetsbevakning'}
              </h2>
              <p className="mt-3 max-w-xl text-slate-600 dark:text-slate-400">
                {isEnglish
                  ? 'Real-time feed of payments, logistics and checkout developments contextualized for e-commerce growth.'
                  : 'Live-feed av e-handelsnyheter från Ehandel.se, Digital Commerce 360 och Finextra – sammanställda och kontextualiserade.'}
              </p>
            </div>
            <Link href="/blog" className="text-sm font-semibold text-brand-600 inline-flex items-center gap-1">
              {isEnglish ? 'View all news' : 'Till bloggen'} <ArrowRight size={14} />
            </Link>
          </div>
          <div className="mt-10">
            <NewsFeed limit={6} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-200 dark:border-slate-800">
        <div className="container-prose py-20">
          <div className="card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold">
                {isEnglish
                  ? 'Need strategic advice – or interested in acquiring the domain?'
                  : 'Behöver du rådgivning – eller vill köpa domänen?'}
              </h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-2xl">
                {isEnglish
                  ? `We conduct actionable checkout audits and CRO diagnostics. Both ${domain} and checkoutstrategy.com are managed under this infrastructure.`
                  : 'Vi gör konkreta CRO-utvärderingar av din kassa och hjälper dig välja rätt stack. Domänen är till salu för rätt köpare.'}
              </p>
            </div>
            <Link href="/contact" className="btn-primary shrink-0">
              {isEnglish ? 'Contact Us' : 'Kontakta oss'} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({ icon, label, value, desc }: { icon: React.ReactNode; label: string; value: string; desc: string }) {
  return (
    <div className="card">
      <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-wide">
        {icon}
        {label}
      </div>
      <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{desc}</p>
    </div>
  );
}

function Testimonial({ name, company, rating, text }: { name: string; company: string; rating: number; text: string }) {
  return (
    <div className="card">
      <div className="flex items-center gap-1 mb-3">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
        ))}
      </div>
      <p className="text-slate-700 dark:text-slate-300 mb-4">&quot;{text}&quot;</p>
      <div>
        <p className="font-semibold text-slate-900 dark:text-slate-100">{name}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{company}</p>
      </div>
    </div>
  );
}
