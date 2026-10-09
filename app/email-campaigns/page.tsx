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
import { useLanguage } from '@/lib/i18n/context';

interface EmailTemplate {
  id: string;
  type: string;
  name: string;
  nameEn: string;
  defaultSubject: string;
  defaultSubjectEn: string;
  preheader: string;
  preheaderEn: string;
  timing: string;
  timingEn: string;
  openRateBenchmark: number;
  ctrBenchmark: number;
  conversionBenchmark: number;
  description: string;
  descriptionEn: string;
  recommendedDiscount: string;
  recommendedDiscountEn: string;
  bodyPreview: {
    heading: string;
    headingEn: string;
    text: string;
    textEn: string;
    ctaText: string;
    ctaTextEn: string;
    productSample: { name: string; nameEn: string; price: number; priceEn: number; image: string };
  };
}

const TEMPLATES: EmailTemplate[] = [
  {
    id: 'cart-abandon-1h',
    type: 'abandoned-cart',
    name: 'Varukorgsavhopp: Snabb påminnelse (1 timme)',
    nameEn: 'Cart Abandonment: Rapid Reminder (1 Hour)',
    defaultSubject: 'Glömde du något? Dina varor är reserverade en stund till ⏳',
    defaultSubjectEn: 'Forgot something? Your items are reserved for a limited time ⏳',
    preheader: 'Vi har sparat din varukorg så att du slipper börja om.',
    preheaderEn: 'We saved your shopping cart so you can pick up right where you left off.',
    timing: '1 timme efter avhopp',
    timingEn: '1 hour after checkout exit',
    openRateBenchmark: 46.5,
    ctrBenchmark: 22.4,
    conversionBenchmark: 14.8,
    recommendedDiscount: 'Ingen rabatt behövs i steg 1 (skydda marginalen)',
    recommendedDiscountEn: 'No discount needed in Step 1 (protect gross margins)',
    description: 'Skickas snabbt medan köpintentionen fortfarande är färsk. Påminner utan att sänka priset.',
    descriptionEn: 'Dispatched swiftly while purchase intent remains hot. Nudges without eroding price perception.',
    bodyPreview: {
      heading: 'Dina varor väntar i kassan',
      headingEn: 'Your items are waiting in checkout',
      text: 'Vi märkte att du lämnade din varukorg. Vi har reserverat dina produkter så att du kan slutföra ditt köp med ett klick.',
      textEn: 'We noticed you stepped away from checkout. We temporarily reserved your products so you can finalize with 1 click.',
      ctaText: 'Slutför mitt köp nu',
      ctaTextEn: 'Complete purchase now',
      productSample: {
        name: 'Trådlösa Brusreducerande Hörlurar',
        nameEn: 'Wireless ANC Studio Headphones',
        price: 1899,
        priceEn: 189,
        image: '🎧'
      }
    }
  },
  {
    id: 'cart-abandon-24h',
    type: 'abandoned-cart',
    name: 'Varukorgsavhopp: Incitament & Fri Frakt (24 timmar)',
    nameEn: 'Cart Abandonment: Free Shipping Incentive (24 Hours)',
    defaultSubject: 'Fri frakt på din sparade varukorg (gäller i 24 timmar) 🎁',
    defaultSubjectEn: 'Free shipping on your saved bag (valid for 24h) 🎁',
    preheader: 'Använd koden FRIFRAKT och slutför köpet innan lagret tar slut.',
    preheaderEn: 'Use code FREESHIP and complete your order before inventory sells out.',
    timing: '24 timmar efter avhopp',
    timingEn: '24 hours after checkout exit',
    openRateBenchmark: 38.2,
    ctrBenchmark: 28.5,
    conversionBenchmark: 18.2,
    recommendedDiscount: 'Fri frakt eller 10% rabattkod',
    recommendedDiscountEn: 'Free shipping voucher or 10% cart coupon',
    description: 'Konverterar prismedvetna och tvekande besökare genom att eliminera fraktfriktion.',
    descriptionEn: 'Converts price-sensitive shoppers by eliminating unexpected delivery fee friction.',
    bodyPreview: {
      heading: 'Här bjuder vi på frakten!',
      headingEn: 'Shipping is on us today!',
      text: 'Vi vill gärna ge dig en extra bra upplevelse. Slutför din beställning idag och få fri expressfrakt med koden nedan.',
      textEn: 'We would love to welcome you! Finalize your saved bag today and unlock free express delivery with the code below.',
      ctaText: 'Aktivera fri frakt & köp',
      ctaTextEn: 'Activate free shipping & buy',
      productSample: {
        name: 'Trådlösa Brusreducerande Hörlurar',
        nameEn: 'Wireless ANC Studio Headphones',
        price: 1899,
        priceEn: 189,
        image: '🎧'
      }
    }
  },
  {
    id: 'post-purchase-upsell',
    type: 'post-purchase',
    name: 'Efterköpsmejl: 1-klick Tilläggsorder (Walley Engage-stil)',
    nameEn: 'Post-Purchase: 1-Click Add-on Order (Walley Engage Style)',
    defaultSubject: 'Tack för ditt köp! Lägg till detta tillbehör fraktfritt ⚡',
    defaultSubjectEn: 'Thanks for your order! Add this matching accessory free shipping ⚡',
    preheader: 'Gäller i 60 minuter innan ditt paket packas på lagret.',
    preheaderEn: 'Valid for 60 minutes before our warehouse packs your parcel.',
    timing: 'Direkt efter genomfört köp (Minut 5)',
    timingEn: 'Immediately post-checkout (Minute 5)',
    openRateBenchmark: 68.4,
    ctrBenchmark: 36.1,
    conversionBenchmark: 12.5,
    recommendedDiscount: '15-20% tilläggsrabatt på kompatibelt tillbehör',
    recommendedDiscountEn: '15-20% add-on discount on strictly compatible accessory',
    description: 'Kapitaliserar på dopamintoppen direkt efter köp utan att kräva att kunden matar in kortuppgifter igen.',
    descriptionEn: 'Capitalizes on the post-purchase dopamine surge without requiring re-entering payment credentials.',
    bodyPreview: {
      heading: 'Glömde du tillbehör till din order?',
      headingEn: 'Need a compatible accessory for your order?',
      text: 'Eftersom ditt paket fortfarande förbereds kan du lägga till matchande tillbehör med 1 klick utan extra fraktkostnad.',
      textEn: 'Because your parcel is currently being prepared, add this accessory with 1 click with zero extra shipping cost.',
      ctaText: 'Lägg till i ordern (1-klick)',
      ctaTextEn: 'Add to order (1-click)',
      productSample: {
        name: 'Skyddsfodral i Äkta Läder',
        nameEn: 'Genuine Leather Protective Case',
        price: 299,
        priceEn: 29,
        image: '📱'
      }
    }
  },
  {
    id: 'tracking-update',
    type: 'shipping-update',
    name: 'Leveransavisering: "Ditt paket är på väg!"',
    nameEn: 'Delivery Alert: "Your package is on its way!"',
    defaultSubject: 'Ditt paket är skickat! Spåra i realtid här 🚚',
    defaultSubjectEn: 'Your package is on the move! Track in real-time here 🚚',
    preheader: 'Beräknad ankomst: Imorgon kl 16:30 till din valda Instabox.',
    preheaderEn: 'Estimated arrival: Tomorrow at 4:30 PM at your selected parcel locker.',
    timing: 'När transportör skannar kollit',
    timingEn: 'When courier scans the parcel',
    openRateBenchmark: 74.2,
    ctrBenchmark: 42.0,
    conversionBenchmark: 9.8,
    recommendedDiscount: 'VIP-rabattkod för nästa köp',
    recommendedDiscountEn: 'VIP return voucher for next purchase',
    description: 'Kunder älskar leveransuppdateringar. Länka direkt till din varumärkta trackingsida för maximal återbesöksfrekvens.',
    descriptionEn: 'Shoppers obsess over shipping alerts. Route straight to your brand-owned tracking page for maximum repeat engagement.',
    bodyPreview: {
      heading: 'Ditt paket är på rull!',
      headingEn: 'Your parcel is in motion!',
      text: 'Nu har din beställning lämnat vårt lager och sorteras för expressleverans till din Instabox i Hemköp City.',
      textEn: 'Your order just departed our central warehouse and is en route for express locker delivery.',
      ctaText: 'Spåra paketet i realtid',
      ctaTextEn: 'Track package in real time',
      productSample: {
        name: 'Order #98214 (2 artiklar)',
        nameEn: 'Order #98214 (2 items)',
        price: 1489,
        priceEn: 149,
        image: '📦'
      }
    }
  }
];

export default function EmailCampaignsPage() {
  const { isEnglish, domain } = useLanguage();
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate>(TEMPLATES[0]);
  const [customSubject, setCustomSubject] = useState(
    isEnglish ? TEMPLATES[0].defaultSubjectEn : TEMPLATES[0].defaultSubject
  );
  const [customDiscount, setCustomDiscount] = useState(isEnglish ? 'FREESHIP' : 'FRIFRAKT');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [copied, setCopied] = useState(false);

  // Kalkylator-state
  const [monthlyOrders, setMonthlyOrders] = useState<number>(2500);
  const [averageOrderValue, setAverageOrderValue] = useState<number>(750);
  const [abandonmentRate, setAbandonmentRate] = useState<number>(70);

  // Beräkningar för återvunnen intäkt
  const totalCarts = monthlyOrders > 0 ? Math.round(monthlyOrders / (1 - abandonmentRate / 100)) : 0;
  const abandonedCarts = totalCarts - monthlyOrders;
  const emailsSent = Math.round(abandonedCarts * 0.45);
  const openedEmails = Math.round(emailsSent * (selectedTemplate.openRateBenchmark / 100));
  const clickedEmails = Math.round(openedEmails * (selectedTemplate.ctrBenchmark / 100));
  const recoveredOrders = Math.round(clickedEmails * (selectedTemplate.conversionBenchmark / 100));
  const recoveredRevenue = recoveredOrders * averageOrderValue;

  const handleTemplateChange = (tmpl: EmailTemplate) => {
    setSelectedTemplate(tmpl);
    setCustomSubject(isEnglish ? tmpl.defaultSubjectEn : tmpl.defaultSubject);
  };

  const handleCopyCode = () => {
    const subject = customSubject;
    const preheader = isEnglish ? selectedTemplate.preheaderEn : selectedTemplate.preheader;
    const timing = isEnglish ? selectedTemplate.timingEn : selectedTemplate.timing;
    navigator.clipboard.writeText(`Subject: ${subject}\nPreheader: ${preheader}\nDiscount Code: ${customDiscount}\nTiming: ${timing}`);
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
              <Mail size={14} /> {isEnglish ? 'E-commerce Email & Post-Purchase CRO Simulator' : 'E-handels-e-post & CRO Simulator 2026'}
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              {isEnglish ? 'Build Email Campaigns & Measure Conversion' : 'Skapa Mailutskick & Mät Konvertering'}
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              {isEnglish
                ? 'Design high-converting abandoned cart sequences, order confirmations, and shipment updates. Model open rates, click-through, and recover lost revenue in real time.'
                : 'Skapa högkonverterande abandoned cart-flöden, orderbekräftelser och leveransmail. Simulera öppningsgrad, klick och räkna ut återvunna intäkter i realtid.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/tracking"
              className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white font-medium bg-slate-900 px-3.5 py-2 rounded-lg border border-slate-800 transition"
            >
              {isEnglish ? 'To Tracking CRO →' : 'Till Trackingsidan →'}
            </Link>
            <Link
              href="/testcheckout"
              className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium bg-indigo-950/60 px-3.5 py-2 rounded-lg border border-indigo-800/50 transition"
            >
              {isEnglish ? 'To Checkout Lab →' : 'Till CheckoutLab →'}
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
                  {isEnglish ? tmpl.timingEn : tmpl.timing}
                </span>
                <span className="text-sm font-bold text-white block leading-snug">
                  {isEnglish ? tmpl.nameEn : tmpl.name}
                </span>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-500">{isEnglish ? 'Benchmark:' : 'Benchmark:'}</span>
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
                <Sliders size={18} className="text-indigo-400" /> {isEnglish ? 'Campaign Settings' : 'Kampanjinställningar'}
              </h2>

              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                  {isEnglish ? 'Subject Line' : 'Ämnesrad (Subject Line)'}
                </label>
                <input
                  type="text"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  {isEnglish
                    ? 'Pro-tip: Emojis and urgent scarcity triggers (e.g. ⏳) lift open rates by 7–12%.'
                    : 'Tips: Emojis och tidsbegränsning (t.ex. ⏳) lyfter öppningsgrad med 7–12 %.'}
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                  {isEnglish ? 'Preheader / Snippet' : 'Preheader / Förhandstext'}
                </label>
                <div className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-400">
                  {isEnglish ? selectedTemplate.preheaderEn : selectedTemplate.preheader}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                  {isEnglish ? 'Promo Voucher / Free Shipping Trigger' : 'Aktiv Rabattkod / Fri Frakt Morot'}
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
                    {copied ? (isEnglish ? 'Copied' : 'Kopierat') : (isEnglish ? 'Copy' : 'Kopiera')}
                  </button>
                </div>
                <span className="text-[11px] text-indigo-400/90 mt-1 block">
                  {isEnglish ? 'Recommendation:' : 'Rekommendation:'}{' '}
                  {isEnglish ? selectedTemplate.recommendedDiscountEn : selectedTemplate.recommendedDiscount}
                </span>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>{isEnglish ? 'Trigger Timing:' : 'Triggertid:'}</span>
                  <span className="font-semibold text-white">
                    {isEnglish ? selectedTemplate.timingEn : selectedTemplate.timing}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{isEnglish ? 'Goal:' : 'Mål:'}</span>
                  <span className="font-semibold text-emerald-400">
                    {isEnglish ? 'Recover Abandoned Cart & Cut Friction' : 'Återställ varukorg & minska friktion'}
                  </span>
                </div>
              </div>
            </div>

            {/* Benchmark-box */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                <BarChart3 size={16} className="text-emerald-400" />{' '}
                {isEnglish ? 'Industry Conversion Benchmarks' : 'Svenska Branschbenchmarks 2026'}
              </h3>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-500 block uppercase font-medium">
                    {isEnglish ? 'Open Rate' : 'Öppningsgrad'}
                  </span>
                  <span className="text-lg font-black text-emerald-400">{selectedTemplate.openRateBenchmark}%</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-500 block uppercase font-medium">
                    {isEnglish ? 'Click Rate' : 'Klickfrekvens'}
                  </span>
                  <span className="text-lg font-black text-indigo-400">{selectedTemplate.ctrBenchmark}%</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-500 block uppercase font-medium">
                    {isEnglish ? 'Conversion' : 'Konvertering'}
                  </span>
                  <span className="text-lg font-black text-amber-400">{selectedTemplate.conversionBenchmark}%</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-3 leading-relaxed">
                {isEnglish
                  ? 'Benchmark data across segmented automated triggers on Klaviyo, Omnisend, and Voyado.'
                  : 'Data baserad på genomsnittet för svenska e-handlare som använder segmenterade triggers (Klaviyo, Voyado, Rule).'}
              </p>
            </div>
          </div>

          {/* Höger: Live Preview av E-postklient */}
          <div className="lg:col-span-7">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
              {/* Device switch */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Eye size={14} /> {isEnglish ? 'Email Client Live Preview' : 'Förhandsgranskning av utskick'}
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
                    <Smartphone size={12} /> {isEnglish ? 'Mobile' : 'Mobil'}
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
                      <span className="font-semibold text-slate-900">
                        {isEnglish ? 'From: Your Store <support@yourstore.com>' : 'Från: Din Butik <kundservice@butik.se>'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {isEnglish ? selectedTemplate.timingEn : selectedTemplate.timing}
                      </span>
                    </div>
                    <div className="mt-1 font-bold text-slate-800 truncate">
                      {isEnglish ? 'Subject:' : 'Ämne:'} {customSubject}
                    </div>
                  </div>

                  {/* Email content */}
                  <div className="p-6">
                    {/* Butikens logotyp */}
                    <div className="text-center pb-4 mb-4 border-b border-slate-100">
                      <span className="text-lg font-black tracking-tight text-slate-900">
                        {isEnglish ? 'YOUR STORE' : 'DIN BUTIK'}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 text-center mb-2">
                      {isEnglish ? selectedTemplate.bodyPreview.headingEn : selectedTemplate.bodyPreview.heading}
                    </h3>
                    <p className="text-xs text-slate-600 text-center mb-6 leading-relaxed">
                      {isEnglish ? selectedTemplate.bodyPreview.textEn : selectedTemplate.bodyPreview.text}
                    </p>

                    {/* Produktkort i varukorgen */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-6 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl p-2 bg-white rounded-lg border border-slate-200">
                          {selectedTemplate.bodyPreview.productSample.image}
                        </span>
                        <div>
                          <span className="text-xs font-bold text-slate-900 block">
                            {isEnglish
                              ? selectedTemplate.bodyPreview.productSample.nameEn
                              : selectedTemplate.bodyPreview.productSample.name}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {isEnglish ? '1 item reserved' : '1 st reserverad'}
                          </span>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-slate-900">
                        {isEnglish
                          ? `$${selectedTemplate.bodyPreview.productSample.priceEn}`
                          : `${selectedTemplate.bodyPreview.productSample.price} kr`}
                      </span>
                    </div>

                    {/* Rabattkod banner om satt */}
                    {customDiscount && (
                      <div className="bg-indigo-50 border border-dashed border-indigo-300 rounded-xl p-3 text-center mb-6">
                        <span className="text-[11px] text-indigo-700 block font-medium">
                          {isEnglish ? 'Use your personalized code at checkout:' : 'Använd din personliga kod i kassan:'}
                        </span>
                        <span className="text-sm font-mono font-bold text-indigo-900 tracking-wider">
                          {customDiscount}
                        </span>
                      </div>
                    )}

                    {/* Call to action knapp */}
                    <div className="text-center">
                      <Link
                        href="/testcheckout"
                        className="inline-block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl text-sm transition shadow-md shadow-indigo-600/30 text-center"
                      >
                        {isEnglish ? selectedTemplate.bodyPreview.ctaTextEn : selectedTemplate.bodyPreview.ctaText} →
                      </Link>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 pt-4 border-t border-slate-100 text-[10px] text-slate-400 text-center">
                      {isEnglish
                        ? 'You received this notification because you initiated a checkout on our store.'
                        : 'Du får detta mail för att du påbörjade en beställning hos oss.'}
                      <br />
                      {isEnglish
                        ? 'Secure payment with Klarna, Apple Pay, and frictionless paperless returns.'
                        : 'Säker betalning med Klarna, Swish och friktionsfri retur.'}
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
              <DollarSign size={14} /> {isEnglish ? 'ROI Calculator' : 'ROI-Kalkylator'}
            </div>
            <h2 className="text-2xl font-bold text-white">
              {isEnglish ? 'How Much Revenue Can You Recover Per Month?' : 'Hur mycket omsättning kan du rädda per månad?'}
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              {isEnglish
                ? 'Test with your actual store parameters to calculate the financial impact of automated recovery emails.'
                : 'Testa med din butiks verkliga siffror för att se effekten av optimerade övergivna varukorgsmail.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Reglage */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                  <span>{isEnglish ? 'Completed orders per month:' : 'Genomförda ordrar per månad:'}</span>
                  <span className="text-white font-mono font-bold">
                    {monthlyOrders.toLocaleString(isEnglish ? 'en-US' : 'sv-SE')} st
                  </span>
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
                  <span>{isEnglish ? 'Average Order Value (AOV):' : 'Snittordervärde (AOV):'}</span>
                  <span className="text-white font-mono font-bold">
                    {averageOrderValue} {isEnglish ? 'SEK / EUR' : 'kr'}
                  </span>
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
                  <span>{isEnglish ? 'Checkout Abandonment Rate:' : 'Varukorgsavhopp i kassan (Cart Abandonment):'}</span>
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
                {isEnglish ? 'Estimated Recovered Revenue / Month' : 'Beräknad extra omsättning / månad'}
              </span>
              <span className="text-3xl sm:text-4xl font-black text-emerald-400 block my-2">
                +{recoveredRevenue.toLocaleString(isEnglish ? 'en-US' : 'sv-SE')} kr
              </span>
              <span className="text-xs text-slate-400 block mb-4">
                {isEnglish ? (
                  <>Equals approximately <strong>{recoveredOrders} recovered orders</strong> per month.</>
                ) : (
                  <>Motsvarar ca <strong>{recoveredOrders} återvunna ordrar</strong> per månad via detta trigger-mail.</>
                )}
              </span>

              <div className="pt-4 border-t border-slate-800 text-left space-y-1.5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">{isEnglish ? 'Abandoned Carts:' : 'Övergivna varukorgar:'}</span>
                  <span className="font-mono">{abandonedCarts.toLocaleString(isEnglish ? 'en-US' : 'sv-SE')} st</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{isEnglish ? 'Emails Dispatched:' : 'Skickade påminnelser:'}</span>
                  <span className="font-mono">{emailsSent.toLocaleString(isEnglish ? 'en-US' : 'sv-SE')} st</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{isEnglish ? 'Opened & Clicked:' : 'Öppnade & Klickade:'}</span>
                  <span className="font-mono">{clickedEmails.toLocaleString(isEnglish ? 'en-US' : 'sv-SE')} st</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
