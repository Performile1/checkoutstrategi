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
  Compass
} from 'lucide-react';

export default function TrackingCROPage() {
  // Simuleringstillstånd för Live Demo (Optimerad vs Traditionell)
  const [trackingViewMode, setTrackingViewMode] = useState<'optimized' | 'traditional'>('optimized');
  const [selectedDemoCarrier, setSelectedDemoCarrier] = useState<'instabox' | 'budbee' | 'postnord'>('instabox');
  const [activeStepTab, setActiveStepTab] = useState<'out_for_delivery' | 'delivered'>('out_for_delivery');

  // Kalkylator för CLV & Återkommande kunder
  const [calcMonthlyOrders, setCalcMonthlyOrders] = useState<number>(4000);
  const [calcAOV, setCalcAOV] = useState<number>(680);
  const [calcCurrentRepeatRate, setCalcCurrentRepeatRate] = useState<number>(19); // %
  const [calcWismoCost, setCalcWismoCost] = useState<number>(55); // kr per ärende

  // Beräkningar för affärsvärde
  const calculatedMetrics = useMemo(() => {
    // Branschdata: Varumärkesägd tracking med CRO ökar återköpsfrekvensen med 22-38% relativt
    const repeatRateLiftAbsolute = 5.5; // från t.ex. 19% till 24.5%
    const newRepeatRate = calcCurrentRepeatRate + repeatRateLiftAbsolute;
    
    // Extra återkommande ordrar per månad
    const extraRepeatOrdersMonthly = Math.round(calcMonthlyOrders * (repeatRateLiftAbsolute / 100));
    const extraRevenueMonthly = extraRepeatOrdersMonthly * calcAOV;
    const extraRevenueYearly = extraRevenueMonthly * 12;

    // WISMO-minskning: Ca 12% av ordrar genererar "Where Is My Order"-frågor vid dålig tracking.
    // Med varumärkesägd tracking och live-notiser sjunker WISMO med ca 50%.
    const baselineWismoInquiries = Math.round(calcMonthlyOrders * 0.11);
    const savedWismoInquiries = Math.round(baselineWismoInquiries * 0.52);
    const monthlySupportSavings = savedWismoInquiries * calcWismoCost;
    const yearlySupportSavings = monthlySupportSavings * 12;

    // Total årlig vinstpåverkan
    const totalYearlyImpact = extraRevenueYearly * 0.35 + yearlySupportSavings; // 35% bruttomarginal på merförsäljning

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-12 pb-24">
      <div className="container-prose max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* ========================================================================= */}
        {/* HERO HEADER */}
        {/* ========================================================================= */}
        <div className="max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <Truck size={14} /> Efterköps-CRO, Retention &amp; Post-Purchase CLV
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-slate-100">
            CRO i Tracking: Så förvandlar du spårningssidan till en intäktsmaskin
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            De flesta e-handlare skickar kunden till PostNords eller Budbees generiska externa spårningssida och slänger bort e-handelns mest besökta efterköpskanal. Lär dig hur en varumärkesägd tracking-upplevelse sänker WISMO, lyfter <strong>Customer Lifetime Value (CLV)</strong> och driver lojala återkommande kunder.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href="#simulator"
              className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-brand-600 hover:bg-slate-800 dark:hover:bg-brand-500 text-white font-bold text-sm shadow-md transition flex items-center gap-2"
            >
              <span>Se Optimerad vs Traditionell Tracking</span>
              <ArrowRight size={15} />
            </a>
            <a
              href="#kalkylator"
              className="px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold text-sm shadow-sm transition flex items-center gap-2"
            >
              <Calculator size={15} className="text-emerald-500" />
              <span>Beräkna din CLV-potential</span>
            </a>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STATISTIK: VARFÖR TRACKING ÄR E-HANDELNS STÖRSTA DOLDA INTÄKTSMÖJLIGHET */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-3xl sm:text-4xl font-black text-brand-600 dark:text-brand-400">4.6 ggr</span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Besök per order</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              En genomsnittlig kund kollar sändningsstatus 3–5 gånger mellan köp och utlämning.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-3xl sm:text-4xl font-black text-emerald-500">78 %</span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Öppningsgrad på avisering</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Leveransnotiser har 3–4x högre engagement än traditionella nyhetsbrev (18–22%).
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-3xl sm:text-4xl font-black text-indigo-500">+28 %</span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Högre återköpsgrad</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Kunder som möts av rekommenderade tillbehör och personlig tracking köper snabbare igen.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-3xl sm:text-4xl font-black text-rose-500">-52 %</span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Minskad WISMO-support</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              &quot;Where Is My Order&quot;-frågor halveras när kunden ser exakta tidsfönster och PIN-koder.
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
                Interaktiv Jämförelse
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-0.5">
                Traditionell extern tracking vs. Varumärkesägd CRO-tracking
              </h2>
            </div>

            {/* Växlare mellan Traditionell och Optimerad */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setTrackingViewMode('traditional')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  trackingViewMode === 'traditional'
                    ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <AlertTriangle size={14} />
                <span>Traditionell (Hur 90% gör fel)</span>
              </button>
              <button
                type="button"
                onClick={() => setTrackingViewMode('optimized')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  trackingViewMode === 'optimized'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Sparkles size={14} />
                <span>Optimerad CRO-Tracking (Best Practice)</span>
              </button>
            </div>
          </div>

          {/* SIMULERINGSRUTA */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
            {/* Browser Chrome Header */}
            <div className="bg-slate-100 dark:bg-slate-950 px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs select-none">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                <span className="hidden sm:inline font-mono text-[11px] text-slate-400 ml-2">
                  {trackingViewMode === 'traditional' ? 'postnord.se/tracking/SE-98124' : 'dinbutik.se/tracking/ORD-98214'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  trackingViewMode === 'traditional'
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                }`}>
                  {trackingViewMode === 'traditional' ? '⚠️ Tappad kundrelation & 0 kr merförsäljning' : '✅ 100% Varumärkesägt & Högkonverterande'}
                </span>
              </div>
            </div>

            {/* Innehåll baserat på vy */}
            {trackingViewMode === 'traditional' ? (
              /* TRADITIONELL EXTERNT UTSKICKAD TRACKING */
              <div className="p-6 sm:p-10 bg-slate-50 dark:bg-slate-950/40 text-slate-800 dark:text-slate-200 space-y-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-w-2xl mx-auto shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <span className="font-bold text-slate-500 text-xs">TRANSPORTÖRENS TRACKING-PORTAL</span>
                    <span className="text-xs text-slate-400 font-mono">ID: 981240182410</span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Försändelsen är på väg</h3>
                    <p className="text-xs text-slate-500">Senaste händelse: Sorterad vid terminal Västberga (Idag 04:12)</p>
                  </div>

                  <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 rounded-xl text-xs text-amber-800 dark:text-amber-200">
                    <strong>Vag tidsangivelse:</strong> &quot;Leverans beräknas inom 1–3 helgfria vardagar mellan 08:00 och 17:00.&quot;
                  </div>

                  {/* Avsaknad av varumärke */}
                  <div className="border border-dashed border-rose-300 dark:border-rose-900/60 p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 text-xs text-rose-700 dark:text-rose-300 space-y-1.5">
                    <strong>Här slutar kundresan:</strong>
                    <ul className="list-disc list-inside space-y-1 text-[11px] text-rose-600 dark:text-rose-400">
                      <li>Kunden har lämnat din butik helt och hållet.</li>
                      <li>Ingen länk tillbaka till dina produkter eller varumärke.</li>
                      <li>Noll möjlighet att erbjuda matchande tillbehör eller medlemskap.</li>
                      <li>Kunden tvingas ringa din kundtjänst för att förstå när paketet kan hämtas (WISMO).</li>
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
                      <div className="font-bold text-sm text-slate-900 dark:text-white">SNKR STORE STOCKHOLM</div>
                      <div className="text-[11px] text-slate-500">Order #ORD-98214 &bull; Köpt igår kl 21:14</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
                      <Clock size={13} /> Beräknas idag kl 16:30 – 17:15
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
                          Instabox Smart Paketskåp
                        </span>
                        <span className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">
                          Spårnings-ID: INSTA-4819
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                          <Truck size={20} className="text-emerald-500" />
                          <span>Ute för utkörning med fossilfri bil</span>
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Levereras till: <strong>Hemköp City, Klarabergsgatan 50, Stockholm</strong>
                        </p>
                      </div>

                      {/* Progress bar */}
                      <div className="space-y-2 pt-2">
                        <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                          <div className="w-4/5 bg-gradient-to-r from-brand-600 to-emerald-500 h-full rounded-full transition-all" />
                        </div>
                        <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                          <span>Plockad</span>
                          <span>Sorterad</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">Ute för leverans (Steg 3/4)</span>
                          <span className="text-slate-400">Levererad</span>
                        </div>
                      </div>

                      {/* PIN & QR-kod direkt i trackingen (Raderar friktion) */}
                      <div className="bg-indigo-50/70 dark:bg-indigo-950/40 p-4 rounded-xl border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-between gap-4">
                        <div className="space-y-0.5">
                          <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400 block">
                            Hämtkod för skåplucka (Box 14)
                          </span>
                          <div className="text-2xl font-black tracking-widest text-indigo-950 dark:text-indigo-100 font-mono">
                            7429
                          </div>
                          <span className="text-[10px] text-slate-500">
                            Aktiveras automatiskt när budet lagt in paketet kl 16:45.
                          </span>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-2 rounded-lg border border-indigo-200 dark:border-indigo-800 shadow-sm shrink-0">
                          <QrCode size={36} className="text-slate-900 dark:text-white" />
                        </div>
                      </div>
                    </div>

                    {/* VAD KÖPTES (Order Receipt med 1-klick återköp) */}
                    <div className="bg-white dark:bg-slate-850 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Innehåll i denna sändning
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">👟</span>
                            <div>
                              <div className="text-xs font-bold text-slate-900 dark:text-white">Airflow Runner Pro v2 (Storlek 43)</div>
                              <div className="text-[11px] text-slate-500">1 st &bull; 1 299 kr</div>
                            </div>
                          </div>
                          <button
                            type="button"
                            className="text-[11px] font-bold text-brand-600 dark:text-brand-400 hover:underline"
                          >
                            Köp igen &rarr;
                          </button>
                        </div>
                      </div>

                      {/* DIGITAL RETUR MED 1 KLICK (INGEN SKRIVARE KRÄVS) */}
                      <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
                        <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                          <RotateCcw size={14} className="text-brand-500" />
                          <span>Behöver du byta storlek? Papperslös retur via QR-kod.</span>
                        </span>
                        <button
                          type="button"
                          className="font-bold text-slate-700 dark:text-slate-300 hover:text-brand-600 underline"
                        >
                          Starta retur (0 kr)
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Höger kolumn: CRO-MOTORERNA (Merförsäljning, Klubb, Ambassadör) */}
                  <div className="lg:col-span-5 space-y-6">
                    {/* CRO-LEVER 1: TILLBEHÖR SOM PASSAR DET KÖPTA (Re-order & Upsell) */}
                    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-6 rounded-2xl border border-indigo-700/60 shadow-lg space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-300 flex items-center gap-1">
                          <Sparkles size={12} /> Exklusivt tillägg till din order
                        </span>
                        <span className="text-[10px] bg-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded-full font-bold">
                          -20% Rabatt
                        </span>
                      </div>

                      <div>
                        <h4 className="text-base font-bold text-white">
                          Skydda dina nya skor innan första användning
                        </h4>
                        <p className="text-xs text-indigo-200 mt-1 leading-relaxed">
                          Vattentät Nano-impregnering spray 250ml. Skickas fraktfritt med nästa sändning.
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div>
                          <span className="text-lg font-black text-white">149 kr</span>
                          <span className="text-xs text-indigo-300 line-through ml-2">189 kr</span>
                        </div>
                        <button
                          type="button"
                          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition transform hover:-translate-y-0.5"
                        >
                          1-klick Köp (Swish/Klarna)
                        </button>
                      </div>
                    </div>

                    {/* CRO-LEVER 2: AKTIVERING AV KUNDKLUBB (GÄST TILL MEDLEM) */}
                    <div className="bg-white dark:bg-slate-850 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
                      <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
                        <Users size={15} /> Bli Medlem med 1 klick
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        Samla 129 poäng på detta köp
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        Handlade du som gäst? Klicka nedan för att spara dina uppgifter till nästa gång och låsa upp fri medlemsfrakt.
                      </p>
                      <button
                        type="button"
                        className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-xs transition"
                      >
                        Aktivera SNKR Club (Sparar dina val)
                      </button>
                    </div>

                    {/* CRO-LEVER 3: AMBASSADORFLOW REFERRAL-LOOP */}
                    <div className="bg-emerald-950/40 border border-emerald-700/60 p-5 rounded-2xl text-emerald-200 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                        <span className="flex items-center gap-1.5"><Gift size={14} /> Tipsa en vän &amp; få 150 kr</span>
                        <span className="text-[10px] bg-emerald-900/60 px-2 py-0.5 rounded font-mono">AmbassadorFlow</span>
                      </div>
                      <p className="text-xs text-emerald-300 leading-relaxed">
                        Dela din personliga länk. När din vän köper får de 15% rabatt och du får 150 kr i butikskredit.
                      </p>
                      <div className="flex gap-2 pt-1">
                        <input
                          type="text"
                          readOnly
                          value="https://snkr.se/r/johan-a"
                          className="bg-emerald-950 border border-emerald-800 rounded-lg px-2.5 py-1.5 text-xs text-emerald-300 flex-1 font-mono outline-none"
                        />
                        <button
                          type="button"
                          className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs rounded-lg transition"
                        >
                          Kopiera
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* DE 6 OPTIMERINGSFAKTORERNA: SÅ ARBETAR DU MED CRO I TRACKING */}
        {/* ========================================================================= */}
        <div className="space-y-8 pt-6">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
              Strategisk Playbook
            </span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">
              De 6 optimeringsfaktorerna för lönsam tracking
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              Konkreta åtgärder som förvandlar sändningsaviseringar och spårningssidor från kostnadsdrivande administration till tillväxtmotorer.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* 1. Äg domänen */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Äg domänen &amp; sluta outsourca trafiken
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Varje klick på &quot;Spåra paket&quot; ska leda till <code>dindoman.se/tracking</code> – aldrig direkt till PostNord, Schenker eller DHL. Genom att behålla kunden på din sajt bevaras dina tracking-pixlar, din navigation och dina konverteringschanser.
              </p>
              <div className="pt-2 text-[11px] font-bold text-brand-600 dark:text-brand-400">
                Effekt: +100% behållen sessionstid
              </div>
            </div>

            {/* 2. Tillbehör & Re-order */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Relevanta tillbehör (Kompatibelt Upsell)
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Undvik generiska bästsäljare. Koppla spårningssidans rekommendationsmotor direkt till varukorgens innehåll: köptes en kaffemaskin? Visa avkalkningsmedel och bönor. Köptes löparskor? Visa funktionsstrumpor och impregnering.
              </p>
              <div className="pt-2 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                Effekt: +14% till +22% AOV-expansion
              </div>
            </div>

            {/* 3. Gäst till Medlem */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Konvertera gäster till medlemmar i trackingen
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                I kassan vägrar 24% att skapa konto p.g.a. formulärstress. På trackingsidan har kunden redan betalat och är avslappnad. Ett enkelt klick för att &quot;Spara ordern till mitt konto och få bonuspoäng&quot; konverterar upp till 35% av gästerna.
              </p>
              <div className="pt-2 text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                Effekt: +30% snabbare tillväxt i kundklubben
              </div>
            </div>

            {/* 4. Tidsstyrd Bounce-Back rabatt */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                4
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Trigga Bounce-Back vid leveransögonblicket
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                När webhooken från Budbee/PostNord signalerar &quot;DELIVERED&quot; är dopaminnivån som högst. Visa omedelbart en tidsbegränsad rabattkod som gäller i 7 dagar på nästa köp. Det förkortar tiden mellan köp 1 och köp 2 drastiskt.
              </p>
              <div className="pt-2 text-[11px] font-bold text-purple-600 dark:text-purple-400">
                Effekt: 42% snabbare andra köp
              </div>
            </div>

            {/* 5. Radera WISMO och supportkostnad */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                5
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Exakta tidsfönster krossar WISMO
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Byt ut diffusa &quot;1–3 arbetsdagar&quot; mot realtidsstatus, adresskarta och PIN-kod direkt på skärmen. När kunden har total kontroll uppstår inga oroliga mail eller samtal till kundsupporten.
              </p>
              <div className="pt-2 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                Effekt: Halverad supportbörda (-50%)
              </div>
            </div>

            {/* 6. Papperslös retur skapar trygghet */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
                6
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Sömlös QR-retur bygger livstidsförtroende
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Ingen konsument har en skrivare hemma idag. Att erbjuda digital returstart direkt på trackingsidan med en QR-kod till ombudet minskar returångest och gör att kunden vågar handla igen med full tillit.
              </p>
              <div className="pt-2 text-[11px] font-bold text-rose-600 dark:text-rose-400">
                Effekt: +28% återköpsgrad (CLV)
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
              <Calculator size={16} /> ROI-Kalkylator
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Hur mycket ökar ditt CLV och dina återkommande kunder?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Dra i reglagen nedan för att simulera den finansiella effekten av att optimera din spårningsupplevelse baserat på din butiks faktiska siffror.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 pt-2 text-xs">
            {/* Input 1 */}
            <div className="space-y-2">
              <div className="flex justify-between font-semibold text-slate-300">
                <span>Månatliga ordrar:</span>
                <span className="text-brand-400 font-bold">{calcMonthlyOrders.toLocaleString('sv-SE')} st</span>
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
              <span className="text-[10px] text-slate-500 block">Antal genomförda köp per månad</span>
            </div>

            {/* Input 2 */}
            <div className="space-y-2">
              <div className="flex justify-between font-semibold text-slate-300">
                <span>Snittordervärde (AOV):</span>
                <span className="text-brand-400 font-bold">{calcAOV} kr</span>
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
              <span className="text-[10px] text-slate-500 block">Genomsnittlig varukorgsstorlek</span>
            </div>

            {/* Input 3 */}
            <div className="space-y-2">
              <div className="flex justify-between font-semibold text-slate-300">
                <span>Nuvarande återköp (Repeat):</span>
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
              <span className="text-[10px] text-slate-500 block">Andel kunder som köper igen inom 90 dagar</span>
            </div>

            {/* Input 4 */}
            <div className="space-y-2">
              <div className="flex justify-between font-semibold text-slate-300">
                <span>Kostnad per supportärende:</span>
                <span className="text-amber-400 font-bold">{calcWismoCost} kr</span>
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
              <span className="text-[10px] text-slate-500 block">Genomsnittlig hanteringskostnad (WISMO)</span>
            </div>
          </div>

          {/* RESULTATKORT */}
          <div className="pt-6 border-t border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                Extra återköpsordrar
              </span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-400">
                +{calculatedMetrics.extraRepeatOrdersMonthly} st
              </span>
              <span className="text-[10px] text-slate-400 block">per månad</span>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                Ny återköpsgrad (Retention)
              </span>
              <span className="text-2xl sm:text-3xl font-black text-indigo-400">
                {calculatedMetrics.newRepeatRate.toFixed(1)} %
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold block">+5.5 procentenheter</span>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                Sparad support (WISMO)
              </span>
              <span className="text-2xl sm:text-3xl font-black text-amber-400">
                {Math.round(calculatedMetrics.yearlySupportSavings).toLocaleString('sv-SE')} kr
              </span>
              <span className="text-[10px] text-slate-400 block">besparing per år</span>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                Årlig merintäkt från tracking
              </span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-400">
                +{Math.round(calculatedMetrics.extraRevenueYearly).toLocaleString('sv-SE')} kr
              </span>
              <span className="text-[10px] text-emerald-300 font-semibold block">direkt tillväxt per år</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* LEVERANSKEDJANS TIDSLINJE: VAD DU SKA KOMMUNICERA VID VARJE STEG */}
        {/* ========================================================================= */}
        <div className="space-y-8 pt-4">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
              Steg för steg
            </span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">
              Tidslinjen för högkonverterande efterköpskommunikation
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Hur du koordinerar SMS, push-notiser och e-post så att varje interaktion driver kunden tillbaka till din optimerade spårningssida.
            </p>
          </div>

          <div className="relative border-l-2 border-brand-500/30 ml-4 sm:ml-6 space-y-8 pl-6 sm:pl-8">
            {/* Steg 1 */}
            <div className="relative space-y-1.5">
              <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-6 h-6 rounded-full bg-brand-600 border-4 border-white dark:border-slate-950 flex items-center justify-center text-[10px] font-bold text-white shadow" />
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 font-mono">01. Order lagd (Minut 0)</span>
                <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-400">Orderbekräftelse</span>
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Sätt rätt förväntan direkt &amp; visa beräknat leveransdatum
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Ge kunden en direktlänk till den varumärkesägda trackingsidan. Bekräfta lagrets cut-off (&quot;Packas innan kl 15:00&quot;) och ge möjlighet till 1-klick tillägg av glömda varor inom 30 minuter.
              </p>
            </div>

            {/* Steg 2 */}
            <div className="relative space-y-1.5">
              <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-6 h-6 rounded-full bg-indigo-600 border-4 border-white dark:border-slate-950 flex items-center justify-center text-[10px] font-bold text-white shadow" />
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-mono">02. Skickad från lager (Dag 1)</span>
                <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-400">Leveransavisering</span>
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Fira att paketet är på väg &amp; presentera kompatibla tillbehör
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Skicka SMS med länk till din egen tracking. Visa chaufförens rutt eller paketboxens läge och erbjud tilläggsprodukter med fri frakt innan leveransen når mottagaren.
              </p>
            </div>

            {/* Steg 3 */}
            <div className="relative space-y-1.5">
              <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-6 h-6 rounded-full bg-emerald-600 border-4 border-white dark:border-slate-950 flex items-center justify-center text-[10px] font-bold text-white shadow" />
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-mono">03. Framme vid box/dörr (Leveransögonblicket)</span>
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded font-bold">Dopaminpeak</span>
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Leverera PIN-kod friktionsfritt &amp; aktivera Bounce-Back rabatt
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                SMS visar PIN-koden och länk till trackingen med tydlig karta och öppettider. I samma sekund triggas &quot;Tack för att du handlade! Här är 15% rabatt på nästa order&quot;.
              </p>
            </div>

            {/* Steg 4 */}
            <div className="relative space-y-1.5">
              <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-6 h-6 rounded-full bg-purple-600 border-4 border-white dark:border-slate-950 flex items-center justify-center text-[10px] font-bold text-white shadow" />
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 font-mono">04. Dag 5–7 efter leverans (Unboxing &amp; Recension)</span>
                <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-400">Ambassadör &amp; Lojalitet</span>
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Samla in recension och bjud in till AmbassadorFlow
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Be om en snabb 5-stjärnig Trustpilot- eller fotorecension. Erbjud kunden att bli ambassadör via AmbassadorFlow och dela sin länk för att tjäna krediter till sitt nästa köp.
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
              Vill du optimera hela din kassa- och efterköpsresa?
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              I <strong>Checkout Lab</strong> kan du simulera alla 12 konverteringsfaktorer, fraktväljarens cut-off och medlemskassor i realtid. I vår resurssida hittar du verktyg som Ingrid, nShift och AmbassadorFlow.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href="/testcheckout"
              className="px-5 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-2"
            >
              <span>Öppna Checkout Lab</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/links"
              className="px-5 py-3 rounded-xl bg-indigo-900/80 hover:bg-indigo-800 text-white border border-indigo-700/80 font-bold text-xs transition flex items-center gap-2"
            >
              <Compass size={14} />
              <span>Resurser &amp; Partners</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
