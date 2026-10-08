'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Calculator,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  CreditCard,
  FileSpreadsheet,
  Info,
  DollarSign,
  PieChart,
  Layers,
  ArrowUpRight,
  Send,
  Zap,
} from 'lucide-react';

export function CheckoutBenchmarks() {
  // --- Kalkylator-state ---
  const [visitors, setVisitors] = useState<number>(50000);
  const [addToCart, setAddToCart] = useState<number>(5000);
  const [checkoutStarts, setCheckoutStarts] = useState<number>(3000);
  const [completedOrders, setCompletedOrders] = useState<number>(1050);
  const [aov, setAov] = useState<number>(750);

  // --- Kassa-diagnos state ---
  const [selectedPlatform, setSelectedPlatform] = useState<string>('shopify');
  const [selectedPayments, setSelectedPayments] = useState<string[]>(['klarna', 'swish', 'card']);
  const [identifiedIssues, setIdentifiedIssues] = useState<string[]>(['konto', 'dolda_kostnader']);
  const [storeName, setStoreName] = useState<string>('');
  const [storeEmail, setStoreEmail] = useState<string>('');
  const [auditSubmitted, setAuditSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // --- Aktiva filter & tabs ---
  const [benchmarkFilter, setBenchmarkFilter] = useState<'all' | 'industry' | 'device' | 'region'>('all');

  // Beräkningar
  const validVisitors = Math.max(visitors, 1);
  const validAddToCart = Math.min(Math.max(addToCart, 0), validVisitors);
  const validCheckoutStarts = Math.min(Math.max(checkoutStarts, 0), validVisitors);
  const validCompletedOrders = Math.min(Math.max(completedOrders, 0), validCheckoutStarts || validVisitors);

  const addToCartRate = Number(((validAddToCart / validVisitors) * 100).toFixed(2));
  const checkoutConversionRate = validCheckoutStarts > 0
    ? Number(((validCompletedOrders / validCheckoutStarts) * 100).toFixed(1))
    : 0;
  const checkoutAbandonmentRate = Number((100 - checkoutConversionRate).toFixed(1));
  const totalSiteConversionRate = Number(((validCompletedOrders / validVisitors) * 100).toFixed(2));
  const monthlyRevenue = Math.round(validCompletedOrders * aov);

  // Uppsidor
  const targetOrdersAt45 = Math.round(validCheckoutStarts * 0.45);
  const extraRevenueAt45 = Math.max(0, Math.round((targetOrdersAt45 - validCompletedOrders) * aov));

  const targetOrdersAtPlus5 = Math.round(validCheckoutStarts * ((checkoutConversionRate + 5) / 100));
  const extraRevenueAtPlus5 = Math.max(0, Math.round((targetOrdersAtPlus5 - validCompletedOrders) * aov));

  const getStatusBadge = (rate: number) => {
    if (rate >= 45) {
      return {
        text: 'Toppresterande (>45%)',
        color: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      };
    }
    if (rate >= 20) {
      return {
        text: 'Normalt genomsnitt (20% – 45%)',
        color: 'text-amber-700 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      };
    }
    return {
      text: 'Hög friktion i kassan (<20%)',
      color: 'text-rose-700 bg-rose-50 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    };
  };

  const handleTogglePayment = (method: string) => {
    setSelectedPayments((prev) =>
      prev.includes(method) ? prev.filter((m) => m !== method) : [...prev, method]
    );
  };

  const handleToggleIssue = (issue: string) => {
    setIdentifiedIssues((prev) =>
      prev.includes(issue) ? prev.filter((i) => i !== issue) : [...prev, issue]
    );
  };

  const handleAuditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: storeName || 'CheckoutLab Granskning',
          email: storeEmail,
          message: `Kassa-analys från CheckoutLab:\nPlattform: ${selectedPlatform}\nBetalsätt: ${selectedPayments.join(', ')}\nIdentifierade friktioner: ${identifiedIssues.join(', ')}\nNuvarande checkout-konvertering: ${checkoutConversionRate}%\nTotal konvertering: ${totalSiteConversionRate}%`,
        }),
      });
      setAuditSubmitted(true);
    } catch {
      setAuditSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="checkout-benchmarks" className="mt-16 space-y-12">
      {/* HEADER & INTRODUKTION */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
          <PieChart size={14} />
          <span>Branschdata & Konverteringsbenchmarks</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Vad är en bra konvertering i kassan?
        </h2>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
          Den genomsnittliga konverteringen i en checkout ligger vanligtvis mellan{' '}
          <strong className="text-slate-900 dark:text-white font-semibold">20 % och 46 %</strong>.
          Det innebär att av alla kunder som klickar sig in i kassan slutför ca 20–46 % köpet, medan
          hela <strong className="text-rose-600 dark:text-rose-400 font-semibold">54–80 % avbryter</strong> mitt i kassan
          (checkout abandonment).
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/testcheckout?view=research"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 text-white dark:bg-brand-600 hover:bg-slate-800 dark:hover:bg-brand-500 transition shadow-sm"
          >
            <Sparkles size={14} />
            <span>Sök empirisk forskningsdata & stegstudier &rarr;</span>
          </Link>
          <Link
            href="/testcheckout?tab=steps"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-sm"
          >
            <Layers size={14} />
            <span>Skapa kassa med steg &rarr;</span>
          </Link>
        </div>
      </div>

      {/* NYCKELSKILLNAD: CHECKOUT VS TOTAL KONVERTERING */}
      <div className="card bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-brand-400 flex items-center gap-2 mb-1">
                <Info size={16} /> Viktig princip
              </div>
              <h3 className="text-2xl font-bold">Checkout-konvertering vs. Total konvertering</h3>
            </div>
            <span className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 self-start sm:self-auto">
              Två helt olika mätpunkter
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-slate-800/60 border border-slate-700/60 relative overflow-hidden">
              <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
                Checkout-konvertering
              </div>
              <div className="text-3xl font-black text-white mb-2">
                20 % – 46 %
              </div>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                Andelen besökare som slutför köpet <em>efter</em> att ha gått in i kassan.
                Isolerar hur smidig och förtroendeingivande din själva betal- och leveransprocess är.
              </p>
              <div className="text-xs font-mono bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 text-emerald-300">
                (Slutförda köp ÷ Påbörjade kassor) × 100
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-800/60 border border-slate-700/60 relative overflow-hidden">
              <div className="text-xs font-semibold uppercase tracking-wider text-blue-400 mb-1">
                Total webbplatskonvertering
              </div>
              <div className="text-3xl font-black text-white mb-2">
                1,5 % – 3,0 %
              </div>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                Andelen av <em>alla</em> unika besökare på hela sajten som gör ett köp.
                Påverkas av trafikkvalitet, produktutbud, prissättning och varukorgsgrad.
              </p>
              <div className="text-xs font-mono bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 text-blue-300">
                (Slutförda köp ÷ Totala webbplatsbesök) × 100
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-400 italic">
            Tänk dig en kund som lägger varor i varukorgen, går till kassan, börjar fylla i leveransadressen
            och sedan stänger fliken på grund av oväntade fraktkostnader. Det är ett <strong>tapp i kassan</strong>,
            trots att köpintentionen var kristallklar.
          </p>
        </div>
      </div>

      {/* INTERAKTIV KALKYLATOR */}
      <div className="card p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg rounded-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 flex items-center gap-2 mb-1">
              <Calculator size={16} /> Gratis Verktyg
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              Ecommerce & Checkout Conversion Calculator
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Fyll i dina egna siffror nedan och se var friktionen uppstår samt din potentiella intäktsökning.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-full border ${getStatusBadge(checkoutConversionRate).color}`}
            >
              {getStatusBadge(checkoutConversionRate).text}
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Vänster: Inputs */}
          <div className="lg:col-span-6 space-y-5">
            <div>
              <div className="flex justify-between text-sm font-medium mb-1.5">
                <label htmlFor="input-visitors" className="text-slate-700 dark:text-slate-300">
                  Totala besökare per månad
                </label>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {visitors.toLocaleString('sv-SE')}
                </span>
              </div>
              <input
                id="input-visitors"
                type="number"
                min="100"
                step="1000"
                value={visitors}
                onChange={(e) => setVisitors(Number(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-sm font-medium mb-1.5">
                  <label htmlFor="input-addtocart" className="text-slate-700 dark:text-slate-300">
                    Lagt i varukorg
                  </label>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {addToCart.toLocaleString('sv-SE')}
                  </span>
                </div>
                <input
                  id="input-addtocart"
                  type="number"
                  min="0"
                  step="100"
                  value={addToCart}
                  onChange={(e) => setAddToCart(Number(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm font-medium mb-1.5">
                  <label htmlFor="input-checkout" className="text-slate-700 dark:text-slate-300">
                    Påbörjade kassor
                  </label>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {checkoutStarts.toLocaleString('sv-SE')}
                  </span>
                </div>
                <input
                  id="input-checkout"
                  type="number"
                  min="0"
                  step="50"
                  value={checkoutStarts}
                  onChange={(e) => setCheckoutStarts(Number(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-sm font-medium mb-1.5">
                  <label htmlFor="input-orders" className="text-slate-700 dark:text-slate-300">
                    Slutförda köp (Ordrar)
                  </label>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {completedOrders.toLocaleString('sv-SE')}
                  </span>
                </div>
                <input
                  id="input-orders"
                  type="number"
                  min="0"
                  step="25"
                  value={completedOrders}
                  onChange={(e) => setCompletedOrders(Number(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm font-medium mb-1.5">
                  <label htmlFor="input-aov" className="text-slate-700 dark:text-slate-300">
                    Snittordervärde (AOV)
                  </label>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {aov.toLocaleString('sv-SE')} kr
                  </span>
                </div>
                <input
                  id="input-aov"
                  type="number"
                  min="1"
                  step="50"
                  value={aov}
                  onChange={(e) => setAov(Number(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
            </div>

            {/* Snabbval av scenarier */}
            <div className="pt-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 block mb-2 font-medium">
                Snabbval scenarier:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setVisitors(25000);
                    setAddToCart(2500);
                    setCheckoutStarts(1500);
                    setCompletedOrders(375);
                    setAov(650);
                  }}
                  className="text-xs px-3 py-1.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                >
                  Genomsnittlig butik (25 % checkout)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setVisitors(100000);
                    setAddToCart(12000);
                    setCheckoutStarts(8000);
                    setCompletedOrders(3840);
                    setAov(890);
                  }}
                  className="text-xs px-3 py-1.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                >
                  Toppresterande butik (48 % checkout)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setVisitors(40000);
                    setAddToCart(3600);
                    setCheckoutStarts(2200);
                    setCompletedOrders(396);
                    setAov(550);
                  }}
                  className="text-xs px-3 py-1.5 rounded-md bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 hover:bg-rose-100 transition"
                >
                  Hög friktion (18 % checkout)
                </button>
              </div>
            </div>
          </div>

          {/* Höger: Resultat & Visualisering */}
          <div className="lg:col-span-6 flex flex-col justify-between bg-slate-50 dark:bg-slate-950/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Checkout-konvertering
                </div>
                <div className="text-3xl font-extrabold text-brand-600 dark:text-brand-400">
                  {checkoutConversionRate} %
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Benchmark: 20 % – 46 %
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Kassa-avhopp (Abandonment)
                </div>
                <div className="text-3xl font-extrabold text-rose-600 dark:text-rose-400">
                  {checkoutAbandonmentRate} %
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Normalt: 54 % – 80 %
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Total sajtkvoter
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {totalSiteConversionRate} %
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Globalt: 1,5 % – 3,0 %
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Add-to-Cart grad
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {addToCartRate} %
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Typiskt: 7 % – 15 %
                </div>
              </div>
            </div>

            {/* Månadsomsättning & Potential */}
            <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                  Beräknad månatlig omsättning
                </span>
                <span className="text-lg font-bold text-emerald-900 dark:text-emerald-200">
                  {monthlyRevenue.toLocaleString('sv-SE')} kr
                </span>
              </div>

              <div className="text-xs text-emerald-900/80 dark:text-emerald-300/90 space-y-1.5 pt-2 border-t border-emerald-200/60 dark:border-emerald-800/40">
                <div className="flex justify-between items-center">
                  <span>Vid +5% förbättrad kassa:</span>
                  <strong className="font-bold text-emerald-700 dark:text-emerald-300">
                    +{extraRevenueAtPlus5.toLocaleString('sv-SE')} kr/mån (+{(extraRevenueAtPlus5 * 12).toLocaleString('sv-SE')} kr/år)
                  </strong>
                </div>
                {checkoutConversionRate < 45 && (
                  <div className="flex justify-between items-center">
                    <span>Om kassan når toppklass (45%):</span>
                    <strong className="font-bold text-emerald-700 dark:text-emerald-300">
                      +{extraRevenueAt45.toLocaleString('sv-SE')} kr/mån (+{(extraRevenueAt45 * 12).toLocaleString('sv-SE')} kr/år)
                    </strong>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VARFÖR AVBRYTER SÅ MÅNGA I KASSAN? (BAYMARD INSTITUTE) */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-2 mb-1">
              <AlertTriangle size={16} /> Baymard Institute Research
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              Varför avbryter så många köpet i kassan?
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              De 4 främsta friktionspunkterna som skapar 54–80 % checkout abandonment och hur du löser dem.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl relative overflow-hidden">
            <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 grid place-items-center mb-4 font-bold">
              1
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Dolda kostnader
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Oväntade avgifter för frakt, hantering eller moms som dyker upp först i det sista steget
              är den enskilt största anledningen till avhopp (48 % enligt Baymard).
            </p>
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 size={14} /> Lösning: Tydlig fraktgräns & beräknad frakt tidigt
            </div>
          </div>

          <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl relative overflow-hidden">
            <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 grid place-items-center mb-4 font-bold">
              2
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Krav på konto
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Att kunden tvingas skapa ett lösenord och registrera sig innan köp skapar enorm friktion.
              26 % avbryter omedelbart om gästkassa saknas.
            </p>
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 size={14} /> Lösning: Erbjud alltid sömlös gästutcheckning
            </div>
          </div>

          <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl relative overflow-hidden">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 grid place-items-center mb-4 font-bold">
              3
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              För många fält
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Långa, krångliga formulär med dubbla adressrader, manuell inmatning av personnummer
              och repetitiva fält tröttar ut användaren (särskilt på mobil).
            </p>
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 size={14} /> Lösning: Autofill (Klarna/Walley) & Google Maps
            </div>
          </div>

          <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl relative overflow-hidden">
            <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 grid place-items-center mb-4 font-bold">
              4
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Brist på betalsätt
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Om kundens föredragna betalmetod saknas (t.ex. Swish i Sverige, Vipps i Norge eller
              Klarna/faktura) överges köpet ofta direkt för en konkurrent.
            </p>
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 size={14} /> Lösning: Swish + Faktura + Apple Pay & Kort
            </div>
          </div>
        </div>
      </div>

      {/* BENCHMARK-TABELLER: BRANSCH, ENHET, REGION & KANAL */}
      <div className="card p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Checkout & E-handelsbenchmarks i detalj
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Baserat på globala e-handelsstudier och data från tusentals nätbutiker.
            </p>
          </div>
          <div className="flex gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setBenchmarkFilter('all')}
              className={`px-3 py-1.5 rounded-md transition ${benchmarkFilter === 'all' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'}`}
            >
              Alla
            </button>
            <button
              onClick={() => setBenchmarkFilter('industry')}
              className={`px-3 py-1.5 rounded-md transition ${benchmarkFilter === 'industry' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'}`}
            >
              Branscher
            </button>
            <button
              onClick={() => setBenchmarkFilter('device')}
              className={`px-3 py-1.5 rounded-md transition ${benchmarkFilter === 'device' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'}`}
            >
              Enheter
            </button>
            <button
              onClick={() => setBenchmarkFilter('region')}
              className={`px-3 py-1.5 rounded-md transition ${benchmarkFilter === 'region' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'}`}
            >
              Regioner
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Branscher */}
          {(benchmarkFilter === 'all' || benchmarkFilter === 'industry') && (
            <div className="space-y-4">
              <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShoppingBag size={16} className="text-brand-500" /> Konvertering per Bransch
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                  <span className="font-medium text-slate-700 dark:text-slate-300">Mat & Dryck (Food & Bev)</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">6,17 %</span>
                </div>
                <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                  <span className="font-medium text-slate-700 dark:text-slate-300">Skönhet & Hälsa (Beauty)</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">5,10 %</span>
                </div>
                <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                  <span className="font-medium text-slate-700 dark:text-slate-300">Mode & Kläder (Fashion)</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">4,07 %</span>
                </div>
                <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                  <span className="font-medium text-slate-700 dark:text-slate-300">Elektronik & Teknik</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">3,60 %</span>
                </div>
                <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                  <span className="font-medium text-slate-700 dark:text-slate-300">Husdjur (Pet Care)</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">2,67 %</span>
                </div>
                <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                  <span className="font-medium text-slate-700 dark:text-slate-300">Hem & Möbler (Furniture)</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">1,42 %</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                Dyrare sällanköpsvaror (möbler) har längre betänketid och kräver fler besök, medan
                förbrukningsvaror (mat/hälsa) har hög konvertering.
              </p>
            </div>
          )}

          {/* Enheter */}
          {(benchmarkFilter === 'all' || benchmarkFilter === 'device') && (
            <div className="space-y-4">
              <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Smartphone size={16} className="text-indigo-500" /> Enhetsgapet (Device Gap)
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 space-y-1">
                  <div className="flex justify-between font-medium">
                    <span className="flex items-center gap-1.5"><Monitor size={14} /> Desktop</span>
                    <strong className="text-emerald-600 dark:text-emerald-400">3,5 % – 4,0 %</strong>
                  </div>
                  <div className="text-[11px] text-slate-500 flex justify-between">
                    <span>Trafikandel: Minskar</span>
                    <span>Större skärm, enklare formulär</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 space-y-1">
                  <div className="flex justify-between font-medium">
                    <span className="flex items-center gap-1.5"><Smartphone size={14} /> Mobil</span>
                    <strong className="text-rose-600 dark:text-rose-400">1,8 % – 2,5 %</strong>
                  </div>
                  <div className="text-[11px] text-slate-500 flex justify-between">
                    <span>Trafikandel: &gt;70% (Växer)</span>
                    <span>Hög friktion, avbrott, små knappar</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 space-y-1">
                  <div className="flex justify-between font-medium">
                    <span className="flex items-center gap-1.5"><Tablet size={14} /> Surfplatta</span>
                    <strong className="text-blue-600 dark:text-blue-400">3,0 % – 3,5 %</strong>
                  </div>
                  <div className="text-[11px] text-slate-500 flex justify-between">
                    <span>Trafikandel: Stabil</span>
                    <span>Hembaserad användning</span>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                Mobilkassan representerar den absolut största tillväxtmöjligheten för nästan varje e-handlare.
              </p>
            </div>
          )}

          {/* Regioner & Shopify */}
          {(benchmarkFilter === 'all' || benchmarkFilter === 'region') && (
            <div className="space-y-4">
              <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Globe size={16} className="text-cyan-500" /> Globala Regioner & Plattformar
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                  <span className="font-medium text-slate-700 dark:text-slate-300">Americas (Nord- & Sydamerika)</span>
                  <span className="font-bold text-slate-900 dark:text-white">3,14 %</span>
                </div>
                <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                  <span className="font-medium text-slate-700 dark:text-slate-300">EMEA (Europa, Mellanöstern, Afrika)</span>
                  <span className="font-bold text-slate-900 dark:text-white">2,78 %</span>
                </div>
                <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                  <span className="font-medium text-slate-700 dark:text-slate-300">APAC (Asien & Stillahavsregionen)</span>
                  <span className="font-bold text-slate-900 dark:text-white">1,83 %</span>
                </div>
                <div className="p-3 rounded-lg bg-brand-50/60 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800/60 text-brand-900 dark:text-brand-300 space-y-1">
                  <div className="font-bold flex justify-between">
                    <span>Shopify Genomsnitt</span>
                    <span>1,3 % – 1,5 %</span>
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400">
                    Toppresterande butiker på Shopify når <strong>3,0 % och högre</strong> genom optimerad Shop Pay,
                    lokala betalmetoder och strömlinjeformad checkout.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* KASSA-DIAGNOS: VILL DU ATT VI TITTAR NÄRMARE PÅ DIN KASSA? */}
      <div className="card p-6 sm:p-10 bg-gradient-to-br from-slate-900 via-brand-950 to-slate-900 text-white rounded-2xl border border-brand-800/50 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto space-y-8 relative z-10">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30">
              <Sparkles size={14} /> Kostnadsfri genomgång
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Vill du att vi tittar närmare på din kassa?
            </h3>
            <p className="text-sm text-slate-300 max-w-xl mx-auto">
              Berätta vilken plattform och vilka betallösningar du använder idag, så identifierar vi dina
              största konverteringsläckor och ger konkreta rekommendationer.
            </p>
          </div>

          <form onSubmit={handleAuditSubmit} className="space-y-6">
            {/* 1. Plattform */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                1. Vilken e-handelsplattform använder du idag?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'shopify', name: 'Shopify' },
                  { id: 'woocommerce', name: 'WooCommerce' },
                  { id: 'centra', name: 'Centra' },
                  { id: 'magento', name: 'Magento / Adobe' },
                  { id: 'norce', name: 'Norce / Jetshop' },
                  { id: 'askas', name: 'Askås' },
                  { id: 'prestashop', name: 'PrestaShop' },
                  { id: 'custom', name: 'Egen / Annan' },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPlatform(p.id)}
                    className={`px-3 py-2 text-xs font-semibold rounded-lg border text-left transition ${
                      selectedPlatform === p.id
                        ? 'bg-brand-600 text-white border-brand-400 shadow-md'
                        : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700/80'
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Betallösningar */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                2. Vilka betallösningar erbjuder du i kassan?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'klarna', name: 'Klarna Checkout' },
                  { id: 'swish', name: 'Swish' },
                  { id: 'walley', name: 'Walley Checkout' },
                  { id: 'qliro', name: 'Qliro' },
                  { id: 'svea', name: 'Svea Checkout' },
                  { id: 'stripe', name: 'Stripe' },
                  { id: 'adyen', name: 'Adyen' },
                  { id: 'card', name: 'Kort (Visa/MC)' },
                  { id: 'applepay', name: 'Apple / Google Pay' },
                  { id: 'vipps', name: 'Vipps / MobilePay' },
                ].map((pay) => (
                  <button
                    key={pay.id}
                    type="button"
                    onClick={() => handleTogglePayment(pay.id)}
                    className={`px-3 py-2 text-xs font-semibold rounded-lg border text-left transition flex items-center justify-between ${
                      selectedPayments.includes(pay.id)
                        ? 'bg-emerald-600/30 text-emerald-200 border-emerald-500'
                        : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:bg-slate-700/80'
                    }`}
                  >
                    <span>{pay.name}</span>
                    {selectedPayments.includes(pay.id) && <CheckCircle2 size={13} className="text-emerald-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Kända problem */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                3. Misstänkta friktionspunkter (valfritt)
              </label>
              <div className="grid sm:grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'dolda_kostnader', label: 'Höga eller oväntade fraktkostnader i sista steget' },
                  { id: 'konto', label: 'Tvingat konto / Krånglig registrering' },
                  { id: 'manga_falt', label: 'För många formulärfält på mobil' },
                  { id: 'saknar_swish', label: 'Saknar Swish eller lokal betalmetod' },
                  { id: 'langsam_laddtid', label: 'Kassan laddar långsamt / seg iframe' },
                  { id: 'svag_mobil', label: 'Hög avhoppsprocent specifikt på smartphones' },
                ].map((issue) => (
                  <button
                    key={issue.id}
                    type="button"
                    onClick={() => handleToggleIssue(issue.id)}
                    className={`p-2.5 rounded-lg border text-left transition flex items-center justify-between ${
                      identifiedIssues.includes(issue.id)
                        ? 'bg-rose-950/40 text-rose-200 border-rose-800'
                        : 'bg-slate-800/60 text-slate-400 border-slate-700'
                    }`}
                  >
                    <span>{issue.label}</span>
                    {identifiedIssues.includes(issue.id) && <AlertTriangle size={13} className="text-rose-400 shrink-0 ml-2" />}
                  </button>
                ))}
              </div>
            </div>

            {/* E-post och submit */}
            <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Butiksnamn eller domän (t.ex. mystore.se)"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm outline-none focus:ring-2 focus:ring-brand-500"
              />
              <input
                type="email"
                required
                placeholder="Din e-postadress"
                value={storeEmail}
                onChange={(e) => setStoreEmail(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary py-2.5 px-6 whitespace-nowrap justify-center text-sm"
              >
                {isSubmitting ? (
                  'Skickar...'
                ) : auditSubmitted ? (
                  'Mottaget! Vi hörs!'
                ) : (
                  <>
                    Skicka analys <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>

            {auditSubmitted && (
              <div className="p-3 rounded-lg bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs text-center">
                Tack! Vi har tagit emot dina uppgifter och återkopplar inom 24 timmar med konkreta förbättringsförslag för din kassa.
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
