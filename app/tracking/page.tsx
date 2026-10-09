'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Truck,
  TrendingUp,
  Repeat,
  DollarSign,
  Users,
  CheckCircle2,
  ArrowRight,
  Clock,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Package,
  MapPin,
  QrCode,
  MessageSquare,
  Gift,
  BarChart3,
  ExternalLink,
  AlertTriangle,
  Layers,
  Eye,
  HelpCircle,
  Calculator,
  Sliders,
  Star,
  Check,
  ShoppingBag,
  Bell,
  Smartphone,
  Compass,
  Copy,
  Scissors
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';

export default function TrackingCROPage() {
  const { t, isEnglish, domain } = useLanguage();

  // Simuleringstillstånd för Live Demo (Optimerad vs Traditionell)
  const [trackingViewMode, setTrackingViewMode] = useState<'optimized' | 'traditional'>('optimized');
  const [copiedLink, setCopiedLink] = useState(false);

  // Kalkylator för CLV & Återkommande kunder
  const [calcMonthlyOrders, setCalcMonthlyOrders] = useState<number>(4000);
  const [calcAOV, setCalcAOV] = useState<number>(680);
  const [calcCurrentRepeatRate, setCalcCurrentRepeatRate] = useState<number>(19); // %
  const [calcWismoCost, setCalcWismoCost] = useState<number>(55); // kr / valuta per ärende

  // Beräkningar för affärsvärde
  const calculatedMetrics = useMemo(() => {
    // Branschdata: Varumärkesägd tracking med CRO ökar återköpsfrekvensen med ca 5.5 procentenheter
    const repeatRateLiftAbsolute = 5.5;
    const newRepeatRate = calcCurrentRepeatRate + repeatRateLiftAbsolute;
    
    // Extra återkommande ordrar per månad
    const extraRepeatOrdersMonthly = Math.round(calcMonthlyOrders * (repeatRateLiftAbsolute / 100));
    const extraRevenueMonthly = extraRepeatOrdersMonthly * calcAOV;
    const extraRevenueYearly = extraRevenueMonthly * 12;

    // WISMO-minskning: Ca 11% av ordrar genererar "Where Is My Order"-frågor vid dålig tracking.
    // Med varumärkesägd tracking och live-notiser sjunker WISMO med ca 52%.
    const baselineWismoInquiries = Math.round(calcMonthlyOrders * 0.11);
    const savedWismoInquiries = Math.round(baselineWismoInquiries * 0.52);
    const monthlySupportSavings = savedWismoInquiries * calcWismoCost;
    const yearlySupportSavings = monthlySupportSavings * 12;

    const totalYearlyImpact = extraRevenueYearly * 0.35 + yearlySupportSavings;

    return {
      extraRepeatOrdersMonthly,
      extraRevenueMonthly,
      extraRevenueYearly,
      savedWismoInquiries,
      monthlySupportSavings,
      yearlySupportSavings,
      newRepeatRate,
      totalYearlyImpact: Math.round(totalYearlyImpact)
    };
  }, [calcMonthlyOrders, calcAOV, calcCurrentRepeatRate, calcWismoCost]);

  const handleCopyLink = () => {
    const linkToCopy = isEnglish ? 'https://snkr.store/r/john-d' : 'https://snkr.se/r/johan-a';
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(linkToCopy);
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-12 pb-24">
      <div className="container-prose max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* ========================================================================= */}
        {/* HERO HEADER */}
        {/* ========================================================================= */}
        <div className="max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <Truck size={14} /> {isEnglish ? 'Post-Purchase CRO, Retention & Lifetime Value' : 'Efterköps-CRO, Retention & Post-Purchase CLV'}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-slate-100">
            {isEnglish
              ? 'CRO in Tracking: Turn Your Tracking Page Into a Revenue Engine'
              : 'CRO i Tracking: Så förvandlar du spårningssidan till en intäktsmaskin'}
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            {isEnglish
              ? 'Most e-commerce merchants outsource customers to generic courier portals (DHL, FedEx, PostNord), discarding the highest-intent post-purchase touchpoint. Learn how brand-owned tracking eliminates WISMO, boosts Customer Lifetime Value (CLV), and drives profitable repeat purchases.'
              : 'De flesta e-handlare skickar kunden till PostNords eller Budbees generiska externa spårningssida och slänger bort e-handelns mest besökta efterköpskanal. Lär dig hur en varumärkesägd tracking-upplevelse sänker WISMO, lyfter Customer Lifetime Value (CLV) och driver lojala återkommande kunder.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href="#simulator"
              className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-brand-600 hover:bg-slate-800 dark:hover:bg-brand-500 text-white font-bold text-sm shadow-md transition flex items-center gap-2"
            >
              <span>{isEnglish ? 'View Optimized vs Traditional Tracking' : 'Se Optimerad vs Traditionell Tracking'}</span>
              <ArrowRight size={15} />
            </a>
            <a
              href="#kalkylator"
              className="px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold text-sm shadow-sm transition flex items-center gap-2"
            >
              <Calculator size={15} className="text-emerald-500" />
              <span>{isEnglish ? 'Calculate Your CLV Potential' : 'Beräkna din CLV-potential'}</span>
            </a>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STATISTIK: 4.6x, 78%, +28%, -52% */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-3xl sm:text-4xl font-black text-brand-600 dark:text-brand-400">
              {isEnglish ? '4.6x' : '4.6 ggr'}
            </span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              {isEnglish ? 'Visits Per Order' : 'Besök per order'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {isEnglish
                ? 'Average customers check their delivery status 3 to 5 times between checkout and unboxing.'
                : 'En genomsnittlig kund kollar sändningsstatus 3–5 gånger mellan köp och utlämning.'}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-3xl sm:text-4xl font-black text-emerald-500">78 %</span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              {isEnglish ? 'Notification Open Rate' : 'Öppningsgrad på avisering'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {isEnglish
                ? 'Delivery alerts boast 70–85% open rates — 4x higher engagement than promotional marketing emails.'
                : 'Leveransnotiser har 3–4x högre engagement än traditionella nyhetsbrev (18–22%).'}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-3xl sm:text-4xl font-black text-indigo-500">+28 %</span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              {isEnglish ? 'Higher Repeat Purchase Rate' : 'Högre återköpsgrad'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {isEnglish
                ? 'Shoppers presented with customized accessories and branded tracking re-order significantly faster.'
                : 'Kunder som möts av rekommenderade tillbehör och personlig tracking köper snabbare igen.'}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-3xl sm:text-4xl font-black text-rose-500">-52 %</span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              {isEnglish ? 'Reduced WISMO Support Tickets' : 'Minskad WISMO-support'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {isEnglish
                ? '"Where Is My Order" customer support queries are slashed by half when exact time windows are displayed.'
                : '"Where Is My Order"-frågor halveras när kunden ser exakta tidsfönster och PIN-koder.'}
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* INTERAKTIV JÄMFÖRELSE: TRADITIONELL VS OPTIMERAD TRACKING */}
        {/* ========================================================================= */}
        <div id="simulator" className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
                {isEnglish ? 'Interactive Comparison' : 'Interaktiv Jämförelse'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-0.5">
                {isEnglish
                  ? 'Generic Carrier Tracking vs. Brand-Owned CRO Tracking'
                  : 'Traditionell extern tracking vs. Varumärkesägd CRO-tracking'}
              </h2>
            </div>

            {/* Växlare mellan Traditionell och Optimerad */}
            <div className="flex flex-wrap justify-center bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 gap-1 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setTrackingViewMode('traditional')}
                className={`px-3.5 sm:px-4 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 text-center flex-1 sm:flex-initial ${
                  trackingViewMode === 'traditional'
                    ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <AlertTriangle size={14} />
                <span>{isEnglish ? 'Traditional (How 90% Fail)' : 'Traditionell (Hur 90% gör fel)'}</span>
              </button>
              <button
                type="button"
                onClick={() => setTrackingViewMode('optimized')}
                className={`px-3.5 sm:px-4 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 text-center flex-1 sm:flex-initial ${
                  trackingViewMode === 'optimized'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Sparkles size={14} />
                <span>{isEnglish ? 'Optimized CRO Tracking (Best Practice)' : 'Optimerad CRO-Tracking (Best Practice)'}</span>
              </button>
            </div>
          </div>

          {/* SIMULERINGSRUTA */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden max-w-4xl mx-auto">
            {/* Browser Chrome Header */}
            <div className="bg-slate-100 dark:bg-slate-950 px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs select-none">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                <span className="hidden sm:inline font-mono text-[11px] text-slate-400 ml-2">
                  {trackingViewMode === 'traditional'
                    ? (isEnglish ? 'dhl.com/tracking/US-98124' : 'postnord.se/tracking/SE-98124')
                    : (isEnglish ? 'snkr.store/tracking/ORD-98214' : 'snkr.se/tracking/ORD-98214')}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  trackingViewMode === 'traditional'
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                }`}>
                  {trackingViewMode === 'traditional'
                    ? (isEnglish ? '⚠️ Lost customer session & $0 repeat revenue' : '⚠️ Tappad kundrelation & 0 kr merförsäljning')
                    : (isEnglish ? '✅ 100% Brand-Owned & High Converting' : '✅ 100% Varumärkesägt & Högkonverterande')}
                </span>
              </div>
            </div>

            {/* Innehåll baserat på vy */}
            <div className="relative overflow-y-auto overflow-x-hidden max-h-[660px] ios-scrollbar">
              {/* STRECKAD VIKNINGSLINJE (THE FOLD) PÅ BÅDE DESKTOP OCH MOBIL */}
              <div className="absolute left-0 right-0 top-[480px] sm:top-[520px] z-30 pointer-events-none select-none">
                <div className="relative w-full border-t-2 border-dashed border-rose-500/80 dark:border-rose-400">
                  <div className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-rose-600 text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1.5 whitespace-nowrap">
                    <Scissors size={10} />
                    <span>{isEnglish ? 'THE FOLD (Vikningslinje)' : 'THE FOLD (Vikningslinje)'}</span>
                    <span className="hidden sm:inline opacity-85 font-normal">
                      {isEnglish
                        ? '↑ Above Fold (80% attention) | ↓ Below Fold (Requires scroll)'
                        : '↑ Ovanför fold (80% fokus) | ↓ Under fold (Kräver scroll)'}
                    </span>
                  </div>
                </div>
              </div>

              {trackingViewMode === 'traditional' ? (
              /* TRADITIONELL EXTERNT UTSKICKAD TRACKING */
              <div className="p-6 sm:p-10 bg-slate-50 dark:bg-slate-950/40 text-slate-800 dark:text-slate-200 space-y-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-w-2xl mx-auto shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <span className="font-bold text-slate-500 text-xs">
                      {isEnglish ? 'GENERIC CARRIER PORTAL' : 'TRANSPORTÖRENS TRACKING-PORTAL'}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">ID: 981240182410</span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {isEnglish ? 'Shipment is on its way' : 'Försändelsen är på väg'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {isEnglish
                        ? 'Latest event: Processed at sorting facility (Today 04:12 AM)'
                        : 'Senaste händelse: Sorterad vid terminal Västberga (Idag 04:12)'}
                    </p>
                  </div>

                  <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 rounded-xl text-xs text-amber-800 dark:text-amber-200">
                    <strong>{isEnglish ? 'Vague delivery window:' : 'Vag tidsangivelse:'}</strong>{' '}
                    {isEnglish
                      ? '"Delivery estimated in 1–3 business days between 08:00 and 17:00."'
                      : '"Leverans beräknas inom 1–3 helgfria vardagar mellan 08:00 och 17:00."'}
                  </div>

                  {/* Avsaknad av varumärke */}
                  <div className="border border-dashed border-rose-300 dark:border-rose-900/60 p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 text-xs text-rose-700 dark:text-rose-300 space-y-1.5">
                    <strong>{isEnglish ? 'Where the customer journey dies:' : 'Här slutar kundresan:'}</strong>
                    <ul className="list-disc list-inside space-y-1 text-[11px] text-rose-600 dark:text-rose-400">
                      <li>{isEnglish ? 'Customer has completely left your store.' : 'Kunden har lämnat din butik helt och hållet.'}</li>
                      <li>{isEnglish ? 'Zero links back to your products or brand.' : 'Ingen länk tillbaka till dina produkter eller varumärke.'}</li>
                      <li>{isEnglish ? 'Zero opportunity to offer matching accessories or membership.' : 'Noll möjlighet att erbjuda matchande tillbehör eller medlemskap.'}</li>
                      <li>{isEnglish ? 'Customer is forced to call customer support to understand when the parcel arrives (WISMO).' : 'Kunden tvingas ringa din kundtjänst för att förstå när paketet kan hämtas (WISMO).'}</li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              /* OPTIMERAD VARUMÄRKESÄGD CRO-TRACKING */
              <div className="p-6 sm:p-10 space-y-8 bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
                {/* Topp-bar med butikens logotyp & trygghet */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white font-black text-lg">
                      S
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-900 dark:text-white">
                        {isEnglish ? 'SNKR STORE' : 'SNKR STORE STOCKHOLM'}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {isEnglish ? 'Order #ORD-98214 • Placed yesterday at 9:14 PM' : 'Order #ORD-98214 • Köpt igår kl 21:14'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
                      <Clock size={13} /> {isEnglish ? 'Estimated today at 4:30 PM – 5:15 PM' : 'Beräknas idag kl 16:30 – 17:15'}
                    </span>
                  </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                  {/* Vänster kolumn: Paketstatus & Paketskåps-PIN */}
                  <div className="lg:col-span-7 space-y-6">
                    {/* Huvudkort: Leveransstatus med exakt tidsfönster */}
                    <div className="bg-white dark:bg-slate-850 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                          {isEnglish ? 'Smart Parcel Locker' : 'Instabox Smart Paketskåp'}
                        </span>
                        <span className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">
                          {isEnglish ? 'Tracking ID: INSTA-4819' : 'Spårnings-ID: INSTA-4819'}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                          <Truck size={20} className="text-emerald-500" />
                          <span>{isEnglish ? 'Out for delivery with 100% fossil-free fleet' : 'Ute för utkörning med fossilfri bil'}</span>
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {isEnglish ? 'Delivering to:' : 'Levereras till:'}{' '}
                          <strong>{isEnglish ? 'Central Market Locker #14, Metro Station' : 'Hemköp City, Klarabergsgatan 50, Stockholm'}</strong>
                        </p>
                      </div>

                      {/* Progress bar */}
                      <div className="space-y-2 pt-2">
                        <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                          <div className="w-4/5 bg-gradient-to-r from-brand-600 to-emerald-500 h-full rounded-full transition-all" />
                        </div>
                        <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                          <span>{isEnglish ? 'Picked' : 'Plockad'}</span>
                          <span>{isEnglish ? 'Sorted' : 'Sorterad'}</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                            {isEnglish ? 'Out for delivery (Step 3/4)' : 'Ute för leverans (Steg 3/4)'}
                          </span>
                          <span className="text-slate-400">{isEnglish ? 'Delivered' : 'Levererad'}</span>
                        </div>
                      </div>

                      {/* PIN & QR-kod direkt i trackingen */}
                      <div className="bg-indigo-50/70 dark:bg-indigo-950/40 p-4 rounded-xl border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-between gap-4">
                        <div className="space-y-0.5">
                          <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400 block">
                            {isEnglish ? 'Pickup Code for Locker (Box 14)' : 'Hämtkod för skåplucka (Box 14)'}
                          </span>
                          <div className="text-2xl font-black tracking-widest text-indigo-950 dark:text-indigo-100 font-mono">
                            7429
                          </div>
                          <span className="text-[10px] text-slate-500">
                            {isEnglish
                              ? 'Automatically activates when courier drops off parcel at 4:45 PM.'
                              : 'Aktiveras automatiskt när budet lagt in paketet kl 16:45.'}
                          </span>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-2 rounded-lg border border-indigo-200 dark:border-indigo-800 shadow-sm shrink-0">
                          <QrCode size={36} className="text-slate-900 dark:text-white" />
                        </div>
                      </div>
                    </div>

                    {/* VAD KÖPTES */}
                    <div className="bg-white dark:bg-slate-850 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        {isEnglish ? 'Contents of this shipment' : 'Innehåll i denna sändning'}
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">👟</span>
                            <div>
                              <div className="text-xs font-bold text-slate-900 dark:text-white">
                                {isEnglish ? 'Airflow Runner Pro v2 (Size 43)' : 'Airflow Runner Pro v2 (Storlek 43)'}
                              </div>
                              <div className="text-[11px] text-slate-500">
                                {isEnglish ? '1 pc • $129' : '1 st • 1 299 kr'}
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            className="text-[11px] font-bold text-brand-600 dark:text-brand-400 hover:underline"
                          >
                            {isEnglish ? 'Buy again →' : 'Köp igen →'}
                          </button>
                        </div>
                      </div>

                      {/* DIGITAL RETUR MED 1 KLICK */}
                      <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
                        <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                          <RotateCcw size={14} className="text-brand-500" />
                          <span>{isEnglish ? 'Need a different size? Paperless returns via QR code.' : 'Behöver du byta storlek? Papperslös retur via QR-kod.'}</span>
                        </span>
                        <button
                          type="button"
                          className="font-bold text-slate-700 dark:text-slate-300 hover:text-brand-600 underline"
                        >
                          {isEnglish ? 'Start return ($0)' : 'Starta retur (0 kr)'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Höger kolumn: CRO-MOTORERNA (Merförsäljning, Klubb, Ambassadör) */}
                  <div className="lg:col-span-5 space-y-6">
                    {/* CRO-LEVER 1: TILLBEHÖR SOM PASSAR DET KÖPTA */}
                    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-6 rounded-2xl border border-indigo-700/60 shadow-lg space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-300 flex items-center gap-1">
                          <Sparkles size={12} /> {isEnglish ? 'Exclusive addition to your order' : 'Exklusivt tillägg till din order'}
                        </span>
                        <span className="text-[10px] bg-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded-full font-bold">
                          {isEnglish ? '-20% Discount' : '-20% Rabatt'}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-base font-bold text-white">
                          {isEnglish ? 'Protect your new shoes before first use' : 'Skydda dina nya skor innan första användning'}
                        </h4>
                        <p className="text-xs text-indigo-200 mt-1 leading-relaxed">
                          {isEnglish
                            ? 'Waterproof Nano-Protector spray 250ml. Ships free with this parcel.'
                            : 'Vattentät Nano-impregnering spray 250ml. Skickas fraktfritt med nästa sändning.'}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div>
                          <span className="text-lg font-black text-white">{isEnglish ? '$15' : '149 kr'}</span>
                          <span className="text-xs text-indigo-300 line-through ml-2">{isEnglish ? '$19' : '189 kr'}</span>
                        </div>
                        <button
                          type="button"
                          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition transform hover:-translate-y-0.5"
                        >
                          {isEnglish ? '1-Click Buy (Apple Pay/Klarna)' : '1-klick Köp (Swish/Klarna)'}
                        </button>
                      </div>
                    </div>

                    {/* CRO-LEVER 2: AKTIVERING AV KUNDKLUBB */}
                    <div className="bg-white dark:bg-slate-850 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
                      <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
                        <Users size={15} /> {isEnglish ? 'Become a Member with 1 Click' : 'Bli Medlem med 1 klick'}
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {isEnglish ? 'Earn 129 points on this purchase' : 'Samla 129 poäng på detta köp'}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {isEnglish
                          ? 'Checked out as a guest? Click below to save your details for next time and unlock free member shipping.'
                          : 'Handlade du som gäst? Klicka nedan för att spara dina uppgifter till nästa gång och låsa upp fri medlemsfrakt.'}
                      </p>
                      <button
                        type="button"
                        className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-xs transition"
                      >
                        {isEnglish ? 'Activate SNKR Club (Saves Preferences)' : 'Aktivera SNKR Club (Sparar dina val)'}
                      </button>
                    </div>

                    {/* CRO-LEVER 3: AMBASSADORFLOW REFERRAL-LOOP */}
                    <div className="bg-emerald-950/40 border border-emerald-700/60 p-5 rounded-2xl text-emerald-200 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                        <span className="flex items-center gap-1.5">
                          <Gift size={14} /> {isEnglish ? 'Refer a friend & get $15' : 'Tipsa en vän & få 150 kr'}
                        </span>
                        <span className="text-[10px] bg-emerald-900/60 px-2 py-0.5 rounded font-mono">AmbassadorFlow</span>
                      </div>
                      <p className="text-xs text-emerald-300 leading-relaxed">
                        {isEnglish
                          ? 'Share your personal link. When your friend buys, they get 15% off and you receive $15 in store credit.'
                          : 'Dela din personliga länk. När din vän köper får de 15% rabatt och du får 150 kr i butikskredit.'}
                      </p>
                      <div className="flex gap-2 pt-1">
                        <input
                          type="text"
                          readOnly
                          value={isEnglish ? 'https://snkr.store/r/john-d' : 'https://snkr.se/r/johan-a'}
                          className="bg-emerald-950 border border-emerald-800 rounded-lg px-2.5 py-1.5 text-xs text-emerald-300 flex-1 font-mono outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleCopyLink}
                          className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs rounded-lg transition flex items-center gap-1"
                        >
                          {copiedLink ? <Check size={12} /> : <Copy size={12} />}
                          <span>{copiedLink ? (isEnglish ? 'Copied' : 'Kopierad') : (isEnglish ? 'Copy' : 'Kopiera')}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* DE 6 OPTIMERINGSFAKTORERNA: STRATEGISK PLAYBOOK */}
        {/* ========================================================================= */}
        <div className="space-y-8 pt-6">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
              {isEnglish ? 'Strategic Playbook' : 'Strategisk Playbook'}
            </span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">
              {isEnglish ? 'The 6 Levers for Profitable Order Tracking' : 'De 6 optimeringsfaktorerna för lönsam tracking'}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              {isEnglish
                ? 'Actionable tactics transforming shipment notifications and tracking pages from operational cost centers into growth drivers.'
                : 'Konkreta åtgärder som förvandlar sändningsaviseringar och spårningssidor från kostnadsdrivande administration till tillväxtmotorer.'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* 1. Äg domänen */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isEnglish ? 'Own the Domain & Stop Outsourcing Traffic' : 'Äg domänen & sluta outsourca trafiken'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {isEnglish
                  ? 'Every click on "Track Package" must route to yourdomain.com/tracking – never straight to DHL, FedEx, or national postal couriers. Retaining customers on your website protects your tracking pixels, brand navigation, and repeat sales opportunities.'
                  : 'Varje klick på "Spåra paket" ska leda till dindoman.se/tracking – aldrig direkt till PostNord, Schenker eller DHL. Genom att behålla kunden på din sajt bevaras dina tracking-pixlar, din navigation och dina konverteringschanser.'}
              </p>
              <div className="pt-2 text-[11px] font-bold text-brand-600 dark:text-brand-400">
                {isEnglish ? 'Impact: +100% retained session time' : 'Effekt: +100% behållen sessionstid'}
              </div>
            </div>

            {/* 2. Tillbehör & Re-order */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isEnglish ? 'Relevant Accessories (Compatible Upsell)' : 'Relevanta tillbehör (Kompatibelt Upsell)'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {isEnglish
                  ? 'Ditch generic bestsellers. Anchor the tracking page recommendation engine directly to cart contents: coffee maker purchased? Show descaling kits and beans. Running shoes? Show performance socks and waterproofing spray.'
                  : 'Undvik generiska bästsäljare. Koppla spårningssidans rekommendationsmotor direkt till varukorgens innehåll: köptes en kaffemaskin? Visa avkalkningsmedel och bönor. Köptes löparskor? Visa funktionsstrumpor och impregnering.'}
              </p>
              <div className="pt-2 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                {isEnglish ? 'Impact: +14% to +22% AOV expansion' : 'Effekt: +14% till +22% AOV-expansion'}
              </div>
            </div>

            {/* 3. Gäst till Medlem */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isEnglish ? 'Convert Guests into Members in Tracking' : 'Konvertera gäster till medlemmar i trackingen'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {isEnglish
                  ? 'During checkout, 24% of shoppers refuse account creation due to form fatigue. On the tracking page, the customer has already paid and feels relaxed. A single click to "Save order to my profile and earn points" converts up to 35% of guest buyers.'
                  : 'I kassan vägrar 24% att skapa konto p.g.a. formulärstress. På trackingsidan har kunden redan betalat och är avslappnad. Ett enkelt klick för att "Spara ordern till mitt konto och få bonuspoäng" konverterar upp till 35% av gästerna.'}
              </p>
              <div className="pt-2 text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                {isEnglish ? 'Impact: +30% faster customer club growth' : 'Effekt: +30% snabbare tillväxt i kundklubben'}
              </div>
            </div>

            {/* 4. Tidsstyrd Bounce-Back rabatt */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                4
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isEnglish ? 'Trigger Bounce-Back at the Moment of Delivery' : 'Trigga Bounce-Back vid leveransögonblicket'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {isEnglish
                  ? 'When the carrier webhook signals "DELIVERED", customer dopamine hits its peak. Immediately surface a 7-day time-sensitive discount voucher for their next purchase. This dramatically compresses the purchase cycle between order 1 and 2.'
                  : 'När webhooken från Budbee/PostNord signalerar "DELIVERED" är dopaminnivån som högst. Visa omedelbart en tidsbegränsad rabattkod som gäller i 7 dagar på nästa köp. Det förkortar tiden mellan köp 1 och köp 2 drastiskt.'}
              </p>
              <div className="pt-2 text-[11px] font-bold text-purple-600 dark:text-purple-400">
                {isEnglish ? 'Impact: 42% faster second purchase' : 'Effekt: 42% snabbare andra köp'}
              </div>
            </div>

            {/* 5. Radera WISMO och supportkostnad */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                5
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isEnglish ? 'Precise Time Windows Crush WISMO' : 'Exakta tidsfönster krossar WISMO'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {isEnglish
                  ? 'Replace vague "1–3 business days" with live GPS status, destination maps, and locker PIN codes on screen. When customers have full certainty, anxiety tickets and customer support inquiries vanish.'
                  : 'Byt ut diffusa "1–3 arbetsdagar" mot realtidsstatus, adresskarta och PIN-kod direkt på skärmen. När kunden har total kontroll uppstår inga oroliga mail eller samtal till kundsupporten.'}
              </p>
              <div className="pt-2 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                {isEnglish ? 'Impact: Support ticket volume cut by half (-50%)' : 'Effekt: Halverad supportbörda (-50%)'}
              </div>
            </div>

            {/* 6. Papperslös retur skapar trygghet */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
                6
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isEnglish ? 'Seamless QR Returns Build Lifetime Trust' : 'Sömlös QR-retur bygger livstidsförtroende'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {isEnglish
                  ? 'Almost no consumers own home printers today. Offering instant paperless return initiation directly on the tracking page with a locker/drop-off QR code removes return friction and inspires bold repeat shopping confidence.'
                  : 'Ingen konsument har en skrivare hemma idag. Att erbjuda digital returstart direkt på trackingsidan med en QR-kod till ombudet minskar returångest och gör att kunden vågar handla igen med full tillit.'}
              </p>
              <div className="pt-2 text-[11px] font-bold text-rose-600 dark:text-rose-400">
                {isEnglish ? 'Impact: +28% repeat order rate (CLV)' : 'Effekt: +28% återköpsgrad (CLV)'}
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* INTERAKTIV KALKYLATOR: BERÄKNA AFFÄRSVÄRDET AV CRO I TRACKING */}
        {/* ========================================================================= */}
        <div id="kalkylator" className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-800 space-y-8">
          <div className="max-w-3xl space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <Calculator size={16} /> {isEnglish ? 'ROI Calculator' : 'ROI-Kalkylator'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {isEnglish
                ? 'How Much Can CRO in Tracking Boost Your CLV and Repeat Sales?'
                : 'Hur mycket ökar ditt CLV och dina återkommande kunder?'}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {isEnglish
                ? 'Adjust the sliders below to calculate the financial impact of transforming your tracking experience based on your store metrics.'
                : 'Dra i reglagen nedan för att simulera den finansiella effekten av att optimera din spårningsupplevelse baserat på din butiks faktiska siffror.'}
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 pt-2 text-xs">
            {/* Input 1 */}
            <div className="space-y-2">
              <div className="flex justify-between font-semibold text-slate-300">
                <span>{isEnglish ? 'Monthly Orders:' : 'Månatliga ordrar:'}</span>
                <span className="text-brand-400 font-bold">{calcMonthlyOrders.toLocaleString(isEnglish ? 'en-US' : 'sv-SE')} st</span>
              </div>
              <input
                type="range"
                min="500"
                max="25000"
                step="500"
                value={calcMonthlyOrders}
                onChange={(e) => setCalcMonthlyOrders(Number(e.target.value))}
                className="w-full accent-brand-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 block">
                {isEnglish ? 'Completed orders per month' : 'Antal genomförda köp per månad'}
              </span>
            </div>

            {/* Input 2 */}
            <div className="space-y-2">
              <div className="flex justify-between font-semibold text-slate-300">
                <span>{isEnglish ? 'Average Order Value (AOV):' : 'Snittordervärde (AOV):'}</span>
                <span className="text-brand-400 font-bold">{calcAOV} {isEnglish ? 'SEK / EUR' : 'kr'}</span>
              </div>
              <input
                type="range"
                min="200"
                max="2500"
                step="50"
                value={calcAOV}
                onChange={(e) => setCalcAOV(Number(e.target.value))}
                className="w-full accent-brand-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 block">
                {isEnglish ? 'Average basket size' : 'Genomsnittlig varukorgsstorlek'}
              </span>
            </div>

            {/* Input 3 */}
            <div className="space-y-2">
              <div className="flex justify-between font-semibold text-slate-300">
                <span>{isEnglish ? 'Current Repeat Rate (%):' : 'Nuvarande återköp (%):'}</span>
                <span className="text-emerald-400 font-bold">{calcCurrentRepeatRate} %</span>
              </div>
              <input
                type="range"
                min="5"
                max="45"
                step="1"
                value={calcCurrentRepeatRate}
                onChange={(e) => setCalcCurrentRepeatRate(Number(e.target.value))}
                className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 block">
                {isEnglish ? 'Customers reordering within 90 days' : 'Andel kunder som köper igen inom 90 dagar'}
              </span>
            </div>

            {/* Input 4 */}
            <div className="space-y-2">
              <div className="flex justify-between font-semibold text-slate-300">
                <span>{isEnglish ? 'Support Cost per Ticket:' : 'Supportkostnad per ärende:'}</span>
                <span className="text-amber-400 font-bold">{calcWismoCost} {isEnglish ? 'SEK' : 'kr'}</span>
              </div>
              <input
                type="range"
                min="20"
                max="120"
                step="5"
                value={calcWismoCost}
                onChange={(e) => setCalcWismoCost(Number(e.target.value))}
                className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 block">
                {isEnglish ? 'Support cost per WISMO ticket' : 'Genomsnittlig hanteringskostnad (WISMO)'}
              </span>
            </div>
          </div>

          {/* RESULTATKORT */}
          <div className="pt-6 border-t border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                {isEnglish ? 'Extra Repeat Orders' : 'Extra återköpsordrar'}
              </span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-400">
                +{calculatedMetrics.extraRepeatOrdersMonthly} st
              </span>
              <span className="text-[10px] text-slate-400 block">
                {isEnglish ? 'per month' : 'per månad'}
              </span>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                {isEnglish ? 'New Repeat Rate (Retention)' : 'Ny återköpsgrad (Retention)'}
              </span>
              <span className="text-2xl sm:text-3xl font-black text-indigo-400">
                {calculatedMetrics.newRepeatRate.toFixed(1)} %
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold block">
                {isEnglish ? '+5.5 percentage points' : '+5.5 procentenheter'}
              </span>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                {isEnglish ? 'Saved Support Costs (WISMO)' : 'Sparad support (WISMO)'}
              </span>
              <span className="text-2xl sm:text-3xl font-black text-amber-400">
                {Math.round(calculatedMetrics.yearlySupportSavings).toLocaleString(isEnglish ? 'en-US' : 'sv-SE')} kr
              </span>
              <span className="text-[10px] text-slate-400 block">
                {isEnglish ? 'annual support savings' : 'besparing per år'}
              </span>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                {isEnglish ? 'Annual Extra Revenue from Tracking' : 'Årlig merintäkt från tracking'}
              </span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-400">
                +{Math.round(calculatedMetrics.extraRevenueYearly).toLocaleString(isEnglish ? 'en-US' : 'sv-SE')} kr
              </span>
              <span className="text-[10px] text-emerald-300 font-semibold block">
                {isEnglish ? 'direct recurring revenue' : 'direkt tillväxt per år'}
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* LEVERANSKEDJANS TIDSLINJE: STEG FÖR STEG */}
        {/* ========================================================================= */}
        <div className="space-y-8 pt-4">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
              {isEnglish ? 'Step by Step' : 'Steg för steg'}
            </span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">
              {isEnglish ? 'Timeline for High-Converting Post-Purchase Communication' : 'Tidslinjen för högkonverterande efterköpskommunikation'}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {isEnglish
                ? 'How to coordinate SMS, push alerts, and emails so every touchpoint directs the customer back to your brand-owned tracking page.'
                : 'Hur du koordinerar SMS, push-notiser och e-post så att varje interaktion driver kunden tillbaka till din optimerade spårningssida.'}
            </p>
          </div>

          <div className="relative border-l-2 border-brand-500/30 ml-4 sm:ml-6 space-y-8 pl-6 sm:pl-8">
            {/* Steg 1 */}
            <div className="relative space-y-1.5">
              <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-6 h-6 rounded-full bg-brand-600 border-4 border-white dark:border-slate-950 flex items-center justify-center text-[10px] font-bold text-white shadow" />
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 font-mono">
                  {isEnglish ? '01. Order Placed (Minute 0)' : '01. Order lagd (Minut 0)'}
                </span>
                <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-400">
                  {isEnglish ? 'Order Confirmation' : 'Orderbekräftelse'}
                </span>
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                {isEnglish
                  ? 'Set clear expectations immediately & display estimated arrival'
                  : 'Sätt rätt förväntan direkt & visa beräknat leveransdatum'}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {isEnglish
                  ? 'Give the shopper a direct link to your brand-owned tracking page. Confirm warehouse cut-off ("Packed before 3:00 PM") and offer 1-click addition of forgotten cart items within 30 minutes.'
                  : 'Ge kunden en direktlänk till den varumärkesägda trackingsidan. Bekräfta lagrets cut-off ("Packas innan kl 15:00") och ge möjlighet till 1-klick tillägg av glömda varor inom 30 minuter.'}
              </p>
            </div>

            {/* Steg 2 */}
            <div className="relative space-y-1.5">
              <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-6 h-6 rounded-full bg-indigo-600 border-4 border-white dark:border-slate-950 flex items-center justify-center text-[10px] font-bold text-white shadow" />
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-mono">
                  {isEnglish ? '02. Dispatched from Warehouse (Day 1)' : '02. Skickad från lager (Dag 1)'}
                </span>
                <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-400">
                  {isEnglish ? 'Shipment Notification' : 'Leveransavisering'}
                </span>
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                {isEnglish
                  ? 'Celebrate shipment in transit & showcase compatible accessories'
                  : 'Fira att paketet är på väg & presentera kompatibla tillbehör'}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {isEnglish
                  ? 'Send an SMS with your branded tracking link. Show driver progress or parcel locker location, and offer free-shipping add-ons before the parcel reaches the destination.'
                  : 'Skicka SMS med länk till din egen tracking. Visa chaufförens rutt eller paketboxens läge och erbjud tilläggsprodukter med fri frakt innan leveransen når mottagaren.'}
              </p>
            </div>

            {/* Steg 3 */}
            <div className="relative space-y-1.5">
              <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-6 h-6 rounded-full bg-emerald-600 border-4 border-white dark:border-slate-950 flex items-center justify-center text-[10px] font-bold text-white shadow" />
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-mono">
                  {isEnglish ? '03. Arrived at Locker / Door (Delivery Moment)' : '03. Framme vid box/dörr (Leveransögonblicket)'}
                </span>
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded font-bold">
                  {isEnglish ? 'Dopamine Peak' : 'Dopaminpeak'}
                </span>
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                {isEnglish
                  ? 'Deliver PIN code frictionless & activate Bounce-Back discount'
                  : 'Leverera PIN-kod friktionsfritt & aktivera Bounce-Back rabatt'}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {isEnglish
                  ? 'SMS surfaces locker PIN code and tracking link with clear map and opening hours. Simultaneously trigger: "Thank you for shopping! Here is 15% off your next order valid for 7 days".'
                  : 'SMS visar PIN-koden och länk till trackingen med tydlig karta och öppettider. I samma sekund triggas "Tack för att du handlade! Här är 15% rabatt på nästa order".'}
              </p>
            </div>

            {/* Steg 4 */}
            <div className="relative space-y-1.5">
              <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-6 h-6 rounded-full bg-purple-600 border-4 border-white dark:border-slate-950 flex items-center justify-center text-[10px] font-bold text-white shadow" />
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 font-mono">
                  {isEnglish ? '04. Day 5–7 Post-Delivery (Unboxing & Reviews)' : '04. Dag 5–7 efter leverans (Unboxing & Recension)'}
                </span>
                <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-400">
                  {isEnglish ? 'Ambassador & Loyalty' : 'Ambassadör & Lojalitet'}
                </span>
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                {isEnglish
                  ? 'Gather reviews and invite customers to AmbassadorFlow'
                  : 'Samla in recension och bjud in till AmbassadorFlow'}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {isEnglish
                  ? 'Request a quick 5-star Trustpilot or photo review. Invite customer to become a brand ambassador via AmbassadorFlow and share their invite link to earn store credit for their next haul.'
                  : 'Be om en snabb 5-stjärnig Trustpilot- eller fotorecension. Erbjud kunden att bli ambassadör via AmbassadorFlow och dela sin länk för att tjäna krediter till sitt nästa köp.'}
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* NÄSTA STEG & RESURSLÄNKAR */}
        {/* ========================================================================= */}
        <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 p-6 sm:p-10 rounded-3xl border border-indigo-800/40 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h3 className="text-2xl font-black text-white">
              {isEnglish
                ? 'Want to optimize your entire checkout & post-purchase funnel?'
                : 'Vill du optimera hela din kassa- och efterköpsresa?'}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {isEnglish
                ? 'In Checkout Lab, you can simulate all 12 conversion levers, delivery cut-offs, and member checkouts in real-time. In our resources directory, explore top tools like Ingrid, nShift, and AmbassadorFlow.'
                : 'I Checkout Lab kan du simulera alla 12 konverteringsfaktorer, fraktväljarens cut-off och medlemskassor i realtid. I vår resurssida hittar du verktyg som Ingrid, nShift och AmbassadorFlow.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href="/testcheckout"
              className="px-5 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-2"
            >
              <span>{isEnglish ? 'Open Checkout Lab' : 'Öppna Checkout Lab'}</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/links"
              className="px-5 py-3 rounded-xl bg-indigo-900/80 hover:bg-indigo-800 text-white border border-indigo-700/80 font-bold text-xs transition flex items-center gap-2"
            >
              <Compass size={14} />
              <span>{isEnglish ? 'Resources & Partners' : 'Resurser & Partners'}</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
