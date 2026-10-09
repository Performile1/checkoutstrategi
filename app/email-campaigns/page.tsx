'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Mail,
  Send,
  Clock,
  Sparkles,
  TrendingUp,
  Percent,
  DollarSign,
  Smartphone,
  Monitor,
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  Copy,
  BarChart3,
  RefreshCw,
  Eye,
  Sliders,
  Tag
} from 'lucide-react';

interface EmailTemplate {
  id: string;
  type: string;
  name: string;
  defaultSubject: string;
  preheader: string;
  timing: string;
  openRateBenchmark: number;
  ctrBenchmark: number;
  conversionBenchmark: number;
  description: string;
  recommendedDiscount: string;
  bodyPreview: {
    heading: string;
    text: string;
    ctaText: string;
    productSample: { name: string; price: number; image: string };
  };
}

const TEMPLATES: EmailTemplate[] = [
  {
    id: 'cart-abandon-1h',
    type: 'abandoned-cart',
    name: 'Varukorgsavhopp: Snabb påminnelse (1 timme)',
    defaultSubject: 'Glömde du något? Dina varor är reserverade en stund till ⏳',
    preheader: 'Vi har sparat din varukorg så att du slipper börja om.',
    timing: '1 timme efter avhopp',
    openRateBenchmark: 46.5,
    ctrBenchmark: 22.4,
    conversionBenchmark: 14.8,
    recommendedDiscount: 'Ingen rabatt behövs i steg 1 (skydda marginalen)',
    description: 'Skickas snabbt medan köpintentionen fortfarande är färsk. Påminner utan att sänka priset.',
    bodyPreview: {
      heading: 'Dina varor väntar i kassan',
      text: 'Vi såg att du lämnade din varukorg. Vi har sparat dina artiklar så att du enkelt kan slutföra beställningen med 1 klick via Klarna eller Swish.',
      ctaText: 'Återuppta mitt köp direkt',
      productSample: { name: 'Premium Hörlurar Active ANC', price: 1290, image: '🎧' }
    }
  },
  {
    id: 'cart-abandon-24h',
    type: 'abandoned-cart-incentive',
    name: 'Varukorgsavhopp: Med Fri Frakt / Rabatt (24 timmar)',
    defaultSubject: 'Här är fri frakt på din sparade varukorg (gäller 24h) 🎁',
    preheader: 'Använd koden FRIFRAKT för att slutföra ditt köp.',
    timing: '24 timmar efter avhopp',
    openRateBenchmark: 52.0,
    ctrBenchmark: 26.8,
    conversionBenchmark: 18.2,
    recommendedDiscount: 'Fri frakt eller 10 % (Kupongkod: FRIFRAKT)',
    description: 'Aktiveras om kunden inte reagerat på första mailet. En liten morot som tar bort fraktfriktionen.',
    bodyPreview: {
      heading: 'Vi bjuder på frakten idag!',
      text: 'Tvekade du vid fraktsteget? Vi vill gärna ge dig en chans till. Slutför din order inom 24 timmar så bjuder vi på snabbaste leveransen till närmsta box.',
      ctaText: 'Slutför med fri frakt',
      productSample: { name: 'Skandinavisk Ulltröja Navy', price: 899, image: '🧶' }
    }
  },
  {
    id: 'order-postpurchase-upsell',
    type: 'post-purchase',
    name: 'Orderbekräftelse + 1-Click Post-Purchase Upsell',
    defaultSubject: 'Tack för din order #98214! (Lägg till tillbehör utan extra frakt)',
    preheader: 'Ditt paket packas strax. Vill du lägga till detta innan vi förseglar?',
    timing: 'Direkt vid köp (0 minuter)',
    openRateBenchmark: 68.4,
    ctrBenchmark: 28.5,
    conversionBenchmark: 16.5,
    recommendedDiscount: '15 % på matchande tillbehör (0 kr extra frakt)',
    description: 'Orderbekräftelsen har högst öppningsgrad av alla mail (65–70 %). Perfekt plats för friktionsfritt merköp innan paketet lämnar lagret.',
    bodyPreview: {
      heading: 'Tack för ditt köp! Din order packas nu',
      text: 'Eftersom vi inte hunnit tejpa kartongen kan du med ett enda klick lägga till matchande tillbehör utan att betala en krona extra i frakt.',
      ctaText: 'Lägg till i ordern (1-klick)',
      productSample: { name: 'Skyddsfodral i Äkta Läder', price: 299, image: '📱' }
    }
  },
  {
    id: 'tracking-update',
    type: 'shipping-update',
    name: 'Leveransavisering: "Ditt paket är på väg!"',
    defaultSubject: 'Ditt paket är skickat! Spåra i realtid här 🚚',
    preheader: 'Beräknad ankomst: Imorgon kl 16:30 till din valda Instabox.',
    timing: 'När transportör skannar kollit',
    openRateBenchmark: 74.2,
    ctrBenchmark: 42.0,
    conversionBenchmark: 9.8,
    recommendedDiscount: 'VIP-rabattkod för nästa köp',
    description: 'Kunder älskar leveransuppdateringar. Länka direkt till din varumärkta trackingsida för maximal återbesöksfrekvens.',
    bodyPreview: {
      heading: 'Ditt paket är på rull!',
      text: 'Nu har din beställning lämnat vårt lager och sorteras för expressleverans till din Instabox i Hemköp City.',
      ctaText: 'Spåra paketet i realtid',
      productSample: { name: 'Order #98214 (2 artiklar)', price: 1489, image: '📦' }
    }
  }
];

export default function EmailCampaignsPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate>(TEMPLATES[0]);
  const [customSubject, setCustomSubject] = useState(TEMPLATES[0].defaultSubject);
  const [customDiscount, setCustomDiscount] = useState('FRIFRAKT');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [copied, setCopied] = useState(false);

  // Kalkylator-state
  const [monthlyOrders, setMonthlyOrders] = useState<number>(2500);
  const [averageOrderValue, setAverageOrderValue] = useState<number>(750);
  const [abandonmentRate, setAbandonmentRate] = useState<number>(70); // 70% varukorgsavhopp är e-handelsstandard

  // Beräkningar för återvunnen intäkt
  const totalCarts = monthlyOrders > 0 ? Math.round(monthlyOrders / (1 - abandonmentRate / 100)) : 0;
  const abandonedCarts = totalCarts - monthlyOrders;
  const emailsSent = Math.round(abandonedCarts * 0.45); // 45% har fyllt i e-post
  const openedEmails = Math.round(emailsSent * (selectedTemplate.openRateBenchmark / 100));
  const clickedEmails = Math.round(openedEmails * (selectedTemplate.ctrBenchmark / 100));
  const recoveredOrders = Math.round(clickedEmails * (selectedTemplate.conversionBenchmark / 100));
  const recoveredRevenue = recoveredOrders * averageOrderValue;

  const handleTemplateChange = (tmpl: EmailTemplate) => {
    setSelectedTemplate(tmpl);
    setCustomSubject(tmpl.defaultSubject);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(`Ämne: ${customSubject}\nPreheader: ${selectedTemplate.preheader}\nRabattkod: ${customDiscount}\nTiming: ${selectedTemplate.timing}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-2">
              <Mail size={14} /> E-handels-e-post & CRO Simulator 2026
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Skapa Mailutskick & Mät Konvertering
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Skapa högkonverterande abandoned cart-flöden, orderbekräftelser och leveransmail. Simulera öppningsgrad, klick och räkna ut återvunna intäkter i realtid.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/tracking"
              className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white font-medium bg-slate-900 px-3.5 py-2 rounded-lg border border-slate-800 transition"
            >
              Till Trackingsidan →
            </Link>
            <Link
              href="/testcheckout"
              className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium bg-indigo-950/60 px-3.5 py-2 rounded-lg border border-indigo-800/50 transition"
            >
              Till CheckoutLab →
            </Link>
          </div>
        </div>

        {/* Mall-väljare (Flikar) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              onClick={() => handleTemplateChange(tmpl)}
              className={`text-left p-4 rounded-xl border transition flex flex-col justify-between ${
                selectedTemplate.id === tmpl.id
                  ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-lg shadow-indigo-950/40'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <div>
                <span className="text-[11px] font-mono text-indigo-400 uppercase tracking-wider block mb-1">
                  {tmpl.timing}
                </span>
                <span className="text-sm font-bold text-white block leading-snug">
                  {tmpl.name}
                </span>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-500">Benchmark:</span>
                <span className="font-bold text-emerald-400">+{tmpl.conversionBenchmark}% CVR</span>
              </div>
            </button>
          ))}
        </div>

        {/* Huvudsektion: Redigerare & Live Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Vänster: Inställningar & Copy */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sliders size={18} className="text-indigo-400" /> Kampanjinställningar
              </h2>

              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Ämnesrad (Subject Line)
                </label>
                <input
                  type="text"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Tips: Emojis och tidsbegränsning (t.ex. ⏳) lyfter öppningsgrad med 7–12 %.
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Preheader / Förhandstext
                </label>
                <div className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-400">
                  {selectedTemplate.preheader}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Aktiv Rabattkod / Fri Frakt Morot
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                    <input
                      type="text"
                      value={customDiscount}
                      onChange={(e) => setCustomDiscount(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className="bg-slate-800 hover:bg-slate-700 text-xs px-3.5 py-2 rounded-xl border border-slate-700 flex items-center gap-1.5 transition text-slate-300 hover:text-white"
                  >
                    {copied ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    {copied ? 'Kopierat' : 'Kopiera'}
                  </button>
                </div>
                <span className="text-[11px] text-indigo-400/90 mt-1 block">
                  Rekommendation: {selectedTemplate.recommendedDiscount}
                </span>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>Triggertid:</span>
                  <span className="font-semibold text-white">{selectedTemplate.timing}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Mål:</span>
                  <span className="font-semibold text-emerald-400">Återställ varukorg & minska friktion</span>
                </div>
              </div>
            </div>

            {/* Benchmark-box */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                <BarChart3 size={16} className="text-emerald-400" /> Svenska Branschbenchmarks 2026
              </h3>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-500 block uppercase font-medium">Öppningsgrad</span>
                  <span className="text-lg font-black text-emerald-400">{selectedTemplate.openRateBenchmark}%</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-500 block uppercase font-medium">Klickfrekvens</span>
                  <span className="text-lg font-black text-indigo-400">{selectedTemplate.ctrBenchmark}%</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-500 block uppercase font-medium">Konvertering</span>
                  <span className="text-lg font-black text-amber-400">{selectedTemplate.conversionBenchmark}%</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-3 leading-relaxed">
                Data baserad på genomsnittet för svenska e-handlare som använder segmenterade triggers (Klaviyo, Voyado, Rule).
              </p>
            </div>
          </div>

          {/* Höger: Live Preview av E-postklient */}
          <div className="lg:col-span-7">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
              {/* Device switch */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Eye size={14} /> Förhandsgranskning av utskick
                </div>
                <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                  <button
                    onClick={() => setPreviewDevice('desktop')}
                    className={`px-3 py-1 rounded flex items-center gap-1.5 transition ${
                      previewDevice === 'desktop' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Monitor size={12} /> Desktop
                  </button>
                  <button
                    onClick={() => setPreviewDevice('mobile')}
                    className={`px-3 py-1 rounded flex items-center gap-1.5 transition ${
                      previewDevice === 'mobile' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Smartphone size={12} /> Mobil
                  </button>
                </div>
              </div>

              {/* Mockup E-postklient */}
              <div className="flex justify-center bg-slate-950/80 p-4 sm:p-6 rounded-xl border border-slate-800/80 min-h-[520px]">
                <div
                  className={`bg-white text-slate-900 rounded-xl shadow-2xl overflow-hidden transition-all duration-300 ${
                    previewDevice === 'mobile' ? 'w-full max-w-[340px]' : 'w-full max-w-[540px]'
                  }`}
                >
                  {/* Email header chrome */}
                  <div className="bg-slate-100 border-b border-slate-200 px-4 py-3 text-xs text-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900">Från: Din Butik &lt;kundservice@butik.se&gt;</span>
                      <span className="text-[10px] text-slate-400">{selectedTemplate.timing}</span>
                    </div>
                    <div className="mt-1 font-bold text-slate-800 truncate">
                      Ämne: {customSubject}
                    </div>
                  </div>

                  {/* Email content */}
                  <div className="p-6">
                    {/* Butikens logotyp */}
                    <div className="text-center pb-4 mb-4 border-b border-slate-100">
                      <span className="text-lg font-black tracking-tight text-slate-900">DIN BUTIK</span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 text-center mb-2">
                      {selectedTemplate.bodyPreview.heading}
                    </h3>
                    <p className="text-xs text-slate-600 text-center mb-6 leading-relaxed">
                      {selectedTemplate.bodyPreview.text}
                    </p>

                    {/* Produktkort i varukorgen */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-6 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl p-2 bg-white rounded-lg border border-slate-200">
                          {selectedTemplate.bodyPreview.productSample.image}
                        </span>
                        <div>
                          <span className="text-xs font-bold text-slate-900 block">
                            {selectedTemplate.bodyPreview.productSample.name}
                          </span>
                          <span className="text-[11px] text-slate-500">1 st reserverad</span>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-slate-900">
                        {selectedTemplate.bodyPreview.productSample.price} kr
                      </span>
                    </div>

                    {/* Rabattkod banner om satt */}
                    {customDiscount && (
                      <div className="bg-indigo-50 border border-dashed border-indigo-300 rounded-xl p-3 text-center mb-6">
                        <span className="text-[11px] text-indigo-700 block font-medium">Använd din personliga kod i kassan:</span>
                        <span className="text-sm font-mono font-bold text-indigo-900 tracking-wider">
                          {customDiscount}
                        </span>
                      </div>
                    )}

                    {/* Call to action knapp */}
                    <div className="text-center">
                      <a
                        href="/testcheckout"
                        className="inline-block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl text-sm transition shadow-md shadow-indigo-600/30"
                      >
                        {selectedTemplate.bodyPreview.ctaText} →
                      </a>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 pt-4 border-t border-slate-100 text-[10px] text-slate-400 text-center">
                      Du får detta mail för att du påbörjade en beställning hos oss.
                      <br />
                      Säker betalning med Klarna, Swish och friktionsfri retur.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CRO & Återvunnen Intäkts-kalkylator */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl mb-12">
          <div className="max-w-3xl mb-8">
            <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
              <DollarSign size={14} /> ROI-Kalkylator
            </div>
            <h2 className="text-2xl font-bold text-white">
              Hur mycket omsättning kan du rädda per månad?
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Testa med din butiks verkliga siffror för att se effekten av optimerade övergivna varukorgsmail.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Reglage */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                  <span>Genomförda ordrar per månad:</span>
                  <span className="text-white font-mono font-bold">{monthlyOrders.toLocaleString('sv-SE')} st</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="20000"
                  step="100"
                  value={monthlyOrders}
                  onChange={(e) => setMonthlyOrders(Number(e.target.value))}
                  className="w-full accent-indigo-500 h-2 bg-slate-950 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                  <span>Snittordervärde (AOV):</span>
                  <span className="text-white font-mono font-bold">{averageOrderValue} kr</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="3500"
                  step="50"
                  value={averageOrderValue}
                  onChange={(e) => setAverageOrderValue(Number(e.target.value))}
                  className="w-full accent-indigo-500 h-2 bg-slate-950 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                  <span>Varukorgsavhopp i kassan (Cart Abandonment):</span>
                  <span className="text-white font-mono font-bold">{abandonmentRate}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="85"
                  step="1"
                  value={abandonmentRate}
                  onChange={(e) => setAbandonmentRate(Number(e.target.value))}
                  className="w-full accent-indigo-500 h-2 bg-slate-950 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Resultatkort */}
            <div className="lg:col-span-5 bg-gradient-to-br from-indigo-950/60 to-slate-950 p-6 rounded-2xl border border-indigo-500/30 text-center shadow-xl">
              <span className="text-xs uppercase tracking-wider text-indigo-300 font-semibold block mb-1">
                Beräknad extra omsättning / månad
              </span>
              <span className="text-3xl sm:text-4xl font-black text-emerald-400 block my-2">
                +{recoveredRevenue.toLocaleString('sv-SE')} kr
              </span>
              <span className="text-xs text-slate-400 block mb-4">
                Motsvarar ca <strong>{recoveredOrders} återvunna ordrar</strong> per månad via detta trigger-mail.
              </span>

              <div className="pt-4 border-t border-slate-800 text-left space-y-1.5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Övergivna varukorgar:</span>
                  <span className="font-mono">{abandonedCarts.toLocaleString('sv-SE')} st</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Skickade påminnelser:</span>
                  <span className="font-mono">{emailsSent.toLocaleString('sv-SE')} st</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Öppnade & Klickade:</span>
                  <span className="font-mono">{clickedEmails.toLocaleString('sv-SE')} st</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
