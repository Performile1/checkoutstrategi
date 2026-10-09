'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ExternalLink,
  Search,
  Sparkles,
  TrendingUp,
  DollarSign,
  Users,
  Repeat,
  ShieldCheck,
  CheckCircle2,
  Award,
  ArrowRight,
  Filter,
  BarChart3,
  Layers,
  HeartHandshake,
  Truck,
  CreditCard,
  Microscope,
  HelpCircle,
  Calculator,
  Compass
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';

interface ResourceItem {
  id: string;
  name: string;
  category: 'institutes' | 'referral' | 'delivery' | 'payments' | 'analytics';
  categoryLabel: string;
  url: string;
  tagline: string;
  description: string;
  impactMetrics?: {
    metric: string;
    value: string;
  }[];
  tags: string[];
  featured?: boolean;
}

const RESOURCES: ResourceItem[] = [
  // --- REFERRAL & AMBASSADOR ---
  {
    id: 'ambassadorflow',
    name: 'AmbassadorFlow',
    category: 'referral',
    categoryLabel: 'Referral & Ambassadörer',
    url: 'https://ambassadorflow.com',
    tagline: 'Nordens ledande plattform för automatiserade ambassadörs- och referral-program',
    description:
      'AmbassadorFlow omvandlar nöjda e-handelskunder och mikro-kreatörer till ett lojalt, prestationsbaserat förvärvsteam. Genom sömlös integrering i tacksidan och kassan skapas virala referral loops som ersätter dyra köpta annonser med genuin word-of-mouth.',
    impactMetrics: [
      { metric: 'CAC-sänkning', value: '-35% till -60%' },
      { metric: 'CVR på refererad trafik', value: '2.5x - 4x högre' },
      { metric: 'Återköpsgrad (CLV)', value: '+37% retention' },
    ],
    tags: ['Referral Loops', 'Kapa CAC', 'Lyft CLV', 'Social Proof', 'Mikro-influencers'],
    featured: true,
  },
  {
    id: 'trustpilot',
    name: 'Trustpilot',
    category: 'referral',
    categoryLabel: 'Social Proof & Recensioner',
    url: 'https://www.trustpilot.com',
    tagline: 'Global plattform för verifierade kundrecensioner och konsumentförtroende',
    description:
      'Att exponera verifierade omdömen över ' +
      'veckningen och i direkt anslutning till betalknappen minskar köparångest (Anxiety i LIFT-modellen) och lyfter kassan med upp till 8–12%.',
    impactMetrics: [
      { metric: 'Förtroendelyft', value: '+12% CVR' },
      { metric: 'Anxiety-reduktion', value: 'Signifikant' },
    ],
    tags: ['Social Proof', 'Konsumentbetyg', 'LIFT-modellen', 'Trygghet'],
  },
  {
    id: 'yotpo',
    name: 'Yotpo',
    category: 'referral',
    categoryLabel: 'Social Proof & Lojalitet',
    url: 'https://www.yotpo.com',
    tagline: 'E-handelsplattform för UGC, recensioner, lojalitetspoäng och SMS-marknadsföring',
    description:
      'Driver återköpscykler genom automatiserad insamling av kundbilder, recensioner och poängsystem direkt kopplade till e-handelsplattformen.',
    tags: ['UGC', 'Lojalitet', 'SMS', 'Retention'],
  },

  // --- FORSKNINGSINSTITUT & CRO-BENCHMARK ---
  {
    id: 'baymard',
    name: 'Baymard Institute',
    category: 'institutes',
    categoryLabel: 'Forskningsinstitut',
    url: 'https://baymard.com',
    tagline: 'Världens ledande oberoende forskningsinstitut för e-commerce UX och checkout',
    description:
      'Med över 130 000 timmars storskaliga användartester är Baymard den globala guldstandarden för kassadesign. Deras benchmark visar att genomsnittlig övergiven varukorg är 70.19%, och att en optimerad kassa kan återhämta upp till 35.26% av dessa ordrar enbart via bättre checkout-ergonomi.',
    impactMetrics: [
      { metric: 'Forskningsunderlag', value: '130 000+ timmar' },
      { metric: 'Återvinningspotential', value: '+35.26% CVR' },
      { metric: 'Design guidelines', value: '550+ mönster' },
    ],
    tags: ['Usability Research', 'Kassadesign', 'Formulärergonomi', 'Global Benchmark'],
    featured: true,
  },
  {
    id: 'nngroup',
    name: 'Nielsen Norman Group (NN/g)',
    category: 'institutes',
    categoryLabel: 'Forskningsinstitut',
    url: 'https://www.nngroup.com',
    tagline: 'Världsauktoritet inom användarcentrerad design och människa-dator-interaktion',
    description:
      'Grundat av Jakob Nielsen och Don Norman. Banbrytande forskning om F-mönster i läsning, mobil kognitiv friktion, visuell hierarki och heuristiska utvärderingar som styr modern digital produktutveckling.',
    impactMetrics: [
      { metric: 'Grundat', value: '1998' },
      { metric: 'Område', value: 'Heuristisk UX' },
    ],
    tags: ['Heuristik', 'UX-forskning', 'Kognitiv belastning', 'Jakob Nielsen'],
  },
  {
    id: 'cxl',
    name: 'CXL (ConversionXL)',
    category: 'institutes',
    categoryLabel: 'Forskningsinstitut & Utbildning',
    url: 'https://cxl.com',
    tagline: 'Elitorganisation för evidensbaserad konverteringsoptimering och A/B-testning',
    description:
      'Grundat av Peep Laja. Ledande inom vetenskaplig CRO, statistisk signifikans, ögonrörelsemätningar (eyetracking) och rigorösa hypotesmodeller för att eliminera gissningslekar i e-handel.',
    impactMetrics: [
      { metric: 'Metodik', value: 'Vetenskaplig CRO' },
      { metric: 'A/B-testning', value: 'Statistisk validitet' },
    ],
    tags: ['A/B-testning', 'CRO-vetenskap', 'Eyetracking', 'Statistik'],
  },
  {
    id: 'svensk-handel',
    name: 'Svensk Handel & E-barometern',
    category: 'institutes',
    categoryLabel: 'Svensk Branschforskning',
    url: 'https://www.svenskhandel.se',
    tagline: 'Sveriges officiella branschrapporter och konsumentbeteenden för e-handel',
    description:
      'E-barometern publiceras i samarbete med PostNord och HUI Research. Ger kvartalsvis data om svenskarnas betalpreferenser (Klarna, Swish, faktura), leveransförväntningar, paketboxarnas frammarsch och returgrad per bransch.',
    impactMetrics: [
      { metric: 'Marknadstäckning', value: 'Sverige & Norden' },
      { metric: 'Fokus', value: 'Konsumenttrender & Frakt' },
    ],
    tags: ['E-barometern', 'PostNord', 'HUI Research', 'Svenska Konsumenter'],
  },
  {
    id: 'goodui',
    name: 'GoodUI',
    category: 'institutes',
    categoryLabel: 'Experiment & Databas',
    url: 'https://goodui.org',
    tagline: 'Evidensbaserade UI/UX-mönster validerade med verkliga A/B-testresultat',
    description:
      'Kurerar hundratals genomförda A/B-tester med detaljerade signifikansbetyg, vilket hjälper team att prioritera testidéer med hög sannolikhet för mätbar konverteringslyft.',
    tags: ['A/B-test patterns', 'UI-design', 'Hypoteser'],
  },

  // --- LOGISTIK & DELIVERY EXPERIENCE ---
  {
    id: 'ingrid',
    name: 'Ingrid Delivery Platform',
    category: 'delivery',
    categoryLabel: 'Logistik & Delivery Checkout',
    url: 'https://www.ingrid.com',
    tagline: 'Nordens ledande plattform för delivery checkout och leveransupplevelse',
    description:
      'Ingrid revolutionerade e-handelskassan genom att flytta fraktvalet från en statisk rullgardinsmeny till en intelligent, postnummerstyrd leveransväljare med exakta datum, badging och paketboxkartor. Bevisat att lyfta konvertering med 5–15%.',
    impactMetrics: [
      { metric: 'Konverteringslyft', value: '+5% till +15%' },
      { metric: 'Tidsangivelse', value: 'Exakta leveransdatum' },
    ],
    tags: ['Delivery Checkout', 'Postnummerstyrning', 'Paketboxar', 'Tracking'],
  },
  {
    id: 'nshift',
    name: 'nShift (f.d. Unifaun & Consignor)',
    category: 'delivery',
    categoryLabel: 'Logistik & TMS',
    url: 'https://nshift.com',
    tagline: 'Global jätte inom leveranshantering, transportörsintegrationer och returportaler',
    description:
      'Kopplar ihop tusentals transportörer världen över och möjliggör automatiserade fraktsedlar, digitala returlösningar med QR-koder och spårningsaviseringar.',
    tags: ['Transportadministration', 'Returportal', 'Carrier Management'],
  },
  {
    id: 'instabee',
    name: 'Instabee (Budbee & Instabox)',
    category: 'delivery',
    categoryLabel: 'Last Mile & Paketboxar',
    url: 'https://instabee.com',
    tagline: 'Fossilfria hemleveranser och rikstäckande nätverk av smarta paketboxar',
    description:
      'Sveriges mest populära paketboxlösning för unga och mobila konsumenter. Flexibla PIN-kodslösningar och precisionstracking i appen minskar hämtningsfriktion.',
    tags: ['Instabox', 'Budbee', 'Paketboxar', 'Fossilfritt'],
  },
  {
    id: 'postnord',
    name: 'PostNord Developer Portal',
    category: 'delivery',
    categoryLabel: 'Transport & Infrastruktur',
    url: 'https://www.postnord.se',
    tagline: 'Nordens största distributionsnätverk för ombud, brev och paketlogistik',
    description:
      'Ryggraden i svensk och nordisk infrastruktur med 2 000+ ombud, automatiserade paketboxar och integrationer för PostNord Checkout och spårnings-API:er.',
    tags: ['Ombudslogistik', 'Nordisk täckning', 'Svanenmärkt frakt'],
  },

  // --- KASSA & BETALNINGAR ---
  {
    id: 'klarna',
    name: 'Klarna',
    category: 'payments',
    categoryLabel: 'Checkout & Betalsystem',
    url: 'https://www.klarna.com',
    tagline: 'Global pionjär inom 1-klick betalning, BNPL och personlig shopping',
    description:
      'Klarna är Sveriges starkaste betalsignal med över 85% igenkänning bland svenska konsumenter. Klarna KCO erbjuder extremt låg friktion genom förifyllning på 150 miljoner globala profiler.',
    impactMetrics: [
      { metric: 'Marknadspenetration', value: 'Dominerande i Norden' },
      { metric: 'Betalmetoder', value: 'Faktura, Delbetala, Direkt' },
    ],
    tags: ['BNPL', 'Klarna KCO', '1-klick', 'Pre-fill'],
  },
  {
    id: 'walley',
    name: 'Walley',
    category: 'payments',
    categoryLabel: 'Checkout & Betalsystem',
    url: 'https://www.walley.se',
    tagline: 'Handlarens kassa med eget varumärke och Walley Engage efterköpsupsell',
    description:
      'Walley låter e-handlaren behålla 100% kontroll över kundrelationen och varumärket. Känd för innovativa funktioner som Walley Engage (post-purchase 1-klick tillägg utan ny autentisering) och stark B2B-funktionalitet.',
    impactMetrics: [
      { metric: 'Varumärkeskontroll', value: '100% Merchant Brand' },
      { metric: 'Efterköpsupsell', value: 'Walley Engage' },
    ],
    tags: ['Walley Engage', 'Post-purchase upsell', 'B2B & B2C', 'White-label'],
  },
  {
    id: 'qliro',
    name: 'Qliro',
    category: 'payments',
    categoryLabel: 'Checkout & Betalsystem',
    url: 'https://www.qliro.com',
    tagline: 'Nordisk flexibel betallösning optimerad för medelstora och stora e-handlare',
    description:
      'Erbjuder en modern checkout med moduluppbyggnad, hög anpassningsbarhet och skräddarsydda upsell-lösningar för nordiska varumärken som Nelly och CDON.',
    tags: ['Qliro Checkout', 'Upsell', 'Nordisk handel'],
  },
  {
    id: 'swish',
    name: 'Swish för Handel',
    category: 'payments',
    categoryLabel: 'Mobilbetalning',
    url: 'https://www.swish.nu',
    tagline: 'Sveriges mest älskade mobila betalsätt med över 8,5 miljoner användare',
    description:
      'Att erbjuda Swish som direktknapp eller förvalt val på mobil lyfter konverteringen kraftigt, särskilt bland unga konsumenter och vid snabba impulsköp under 500 kr.',
    impactMetrics: [
      { metric: 'Svenska användare', value: '8.5+ miljoner' },
      { metric: 'Mobil konvertering', value: 'Snabbast i Sverige' },
    ],
    tags: ['BankID', 'Mobil first', 'Impulsköp', '0 sekunder'],
  },
  {
    id: 'svea',
    name: 'Svea Bank',
    category: 'payments',
    categoryLabel: 'Betalning & B2B Faktura',
    url: 'https://www.svea.com',
    tagline: 'Omfattande kassa- och finansieringslösning med stark styrka inom B2B',
    description:
      'Specialister på automatiserad organisationsnummeruppslagning, kreditbedömning i realtid och 30–60 dagars E-faktura för företagskunder.',
    tags: ['B2B Checkout', 'Peppol', 'Kreditkontroll'],
  },

  // --- ANALYS & A/B-TESTNING ---
  {
    id: 'clarity',
    name: 'Microsoft Clarity',
    category: 'analytics',
    categoryLabel: 'Beteendeanalys & Heatmaps',
    url: 'https://clarity.microsoft.com',
    tagline: '100% kostnadsfri beteendeanalys med heatmaps och sessionsinspelningar',
    description:
      'Upptäck exakt var kunder tvekar i kassan. Utrustad med automatiska mätvärden för "Rage clicks" och "Dead clicks" som omedelbart avslöjar trasiga knappar eller otydliga fält.',
    tags: ['Rage clicks', 'Heatmaps', 'Sessionsinspelning', 'Gratis'],
  },
  {
    id: 'vwo',
    name: 'VWO (Visual Website Optimizer)',
    category: 'analytics',
    categoryLabel: 'A/B-testning & Experiment',
    url: 'https://vwo.com',
    tagline: 'Plattform för A/B-testning, multivariata experiment och funnel-analys',
    description:
      'Hjälper e-handlare att testa hypoteser i kassan (t.ex. 1-steg vs flersteg, placering av leveransval, gratis frakt-mätare) och bevisa statistisk signifikans.',
    tags: ['A/B-testning', 'Flerstegstest', 'Funnel analysis'],
  },
  {
    id: 'optimizely',
    name: 'Optimizely',
    category: 'analytics',
    categoryLabel: 'Enterprise Experimentation',
    url: 'https://www.optimizely.com',
    tagline: 'Global ledare inom storskalig experimentering och webbpersonalisering',
    description:
      'Byggd för storskaliga organisationer som kör hundratals parallella experiment på servrar och webbapplikationer samtidigt.',
    tags: ['Enterprise CRO', 'Server-side testing', 'Personalisering'],
  },
];

export default function LinksAndResourcesPage() {
  const { t, isEnglish } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // ROI-kalkylator för AmbassadorFlow
  const [monthlyOrders, setMonthlyOrders] = useState<number>(2500);
  const [currentCAC, setCurrentCAC] = useState<number>(240);
  const [ambassadorShare, setAmbassadorShare] = useState<number>(18);

  const calculatedSavings = useMemo(() => {
    const ordersViaAmbassador = Math.round(monthlyOrders * (ambassadorShare / 100));
    // Ambassador CAC är ca 70% lägre (enbart provision ~70 kr istället för Meta ad spend ~240 kr)
    const costPerAmbassadorOrder = Math.round(currentCAC * 0.3);
    const cacSavingsPerOrder = currentCAC - costPerAmbassadorOrder;
    const monthlyCostReduction = ordersViaAmbassador * cacSavingsPerOrder;
    const yearlyCostReduction = monthlyCostReduction * 12;

    // Högre CLV: 37% bättre retention ger ca 15% mer i totalt livstidsvärde
    const estimatedExtraRevenueYearly = Math.round(ordersViaAmbassador * 650 * 0.15 * 12);

    return {
      ordersViaAmbassador,
      cacSavingsPerOrder,
      monthlyCostReduction,
      yearlyCostReduction,
      estimatedExtraRevenueYearly,
      blendedCAC: Math.round(
        (monthlyOrders - ordersViaAmbassador) * currentCAC + ordersViaAmbassador * costPerAmbassadorOrder
      ) / monthlyOrders,
    };
  }, [monthlyOrders, currentCAC, ambassadorShare]);

  const filteredResources = useMemo(() => {
    return RESOURCES.filter((res) => {
      const matchesCategory = selectedCategory === 'all' || res.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        res.name.toLowerCase().includes(q) ||
        res.description.toLowerCase().includes(q) ||
        res.tagline.toLowerCase().includes(q) ||
        res.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const categories = [
    { id: 'all', label: isEnglish ? 'All Resources' : 'Alla resurser', count: RESOURCES.length },
    { id: 'referral', label: isEnglish ? 'Referral, Ambassadors & Growth' : 'Referral, Ambassadörer & Tillväxt', count: RESOURCES.filter(r => r.category === 'referral').length },
    { id: 'institutes', label: isEnglish ? 'Research Institutes & Benchmarks' : 'Forskningsinstitut & Benchmark', count: RESOURCES.filter(r => r.category === 'institutes').length },
    { id: 'delivery', label: isEnglish ? 'Logistics & Delivery Checkout' : 'Logistik & Leveranscheckout', count: RESOURCES.filter(r => r.category === 'delivery').length },
    { id: 'payments', label: isEnglish ? 'Checkout & Payment Solutions' : 'Kassa & Betallösningar', count: RESOURCES.filter(r => r.category === 'payments').length },
    { id: 'analytics', label: isEnglish ? 'Analytics, Heatmaps & A/B Testing' : 'Analys, Heatmaps & A/B-testning', count: RESOURCES.filter(r => r.category === 'analytics').length },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-12 pb-24">
      <div className="container-prose max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* --- HEADER --- */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 mb-3">
            <Compass size={14} /> {t.links.badge}
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-slate-100">
            {t.links.title}
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            {t.links.description}
          </p>
        </div>

        {/* ========================================================================= */}
        {/* FEATURED HERO SPOTLIGHT: AMBASSADORFLOW */}
        {/* ========================================================================= */}
        <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-indigo-500/30 relative overflow-hidden">
          {/* Bakgrundsdekoration */}
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-indigo-800/60 pb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg ring-4 ring-indigo-400/20">
                  <HeartHandshake size={26} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-bold tracking-widest text-indigo-300">
                      {t.links.spotlightBadge}
                    </span>
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {t.links.spotlightRating}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-0.5">
                    {t.links.spotlightTitle}
                  </h2>
                </div>
              </div>

              <a
                href="https://ambassadorflow.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-sm shadow-lg hover:shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5"
              >
                <span>{t.links.spotlightVisitBtn}</span>
                <ExternalLink size={16} />
              </a>
            </div>

            {/* Ingress om vad AmbassadorFlow gör */}
            <div className="max-w-4xl space-y-3">
              <p className="text-base sm:text-lg text-indigo-100 font-medium leading-relaxed">
                {t.links.spotlightIntro1}
              </p>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {t.links.spotlightIntro2}
              </p>
            </div>

            {/* DE TRE HUVUDPELARNA: CRO, CAC, CLV */}
            <div className="grid md:grid-cols-3 gap-6 pt-2">
              
              {/* 1. CRO */}
              <div className="bg-slate-900/80 backdrop-blur-sm p-6 rounded-2xl border border-indigo-500/30 flex flex-col justify-between space-y-4 hover:border-indigo-400 transition-all">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-700/60 flex items-center justify-center text-indigo-400">
                    <TrendingUp size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    {t.links.spotlightCroTitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {t.links.spotlightCroDesc}
                  </p>
                  <ul className="text-xs text-slate-400 space-y-2 pt-1">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Automatisk rabatt i kassan:</strong> Inga läckage där kunden lämnar kassan för att leta rabattkoder.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Social Proof i köpögonblicket:</strong> Äkta rekommendationer raderar kundens ångest och tvekan.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Högre AOV (+18%):</strong> Rekommenderade varukorgar innehåller oftare fler artiklar.</span>
                    </li>
                  </ul>
                </div>
                <div className="pt-3 border-t border-indigo-900/60">
                  <span className="text-[11px] font-mono text-indigo-300 font-semibold">Effekt: +15% till +35% CVR</span>
                </div>
              </div>

              {/* 2. CAC */}
              <div className="bg-slate-900/80 backdrop-blur-sm p-6 rounded-2xl border border-emerald-500/30 flex flex-col justify-between space-y-4 hover:border-emerald-400 transition-all">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-700/60 flex items-center justify-center text-emerald-400">
                    <DollarSign size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    Vad det gör för CAC
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    <strong>Kundanskaffningskostnad (-35% till -60%):</strong> Sluta göda auktionsjättarna. Ersätt dyra klick med prestationsbaserad provision.
                  </p>
                  <ul className="text-xs text-slate-400 space-y-2 pt-1">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Betala endast vid slutfört köp:</strong> Noll risk för bränd mediabudget utan ordrar.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Viral tillväxtloop på tacksidan:</strong> Bjud in varje köpare att bli ambassadör direkt efter genomförd order.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Sänkt Blended CAC:</strong> Ju mer word-of-mouth du driver, desto lägre blir snitt-CAC för hela butiken.</span>
                    </li>
                  </ul>
                </div>
                <div className="pt-3 border-t border-emerald-900/60">
                  <span className="text-[11px] font-mono text-emerald-300 font-semibold">Effekt: Kapa CAC med upp till 60%</span>
                </div>
              </div>

              {/* 3. CLV */}
              <div className="bg-slate-900/80 backdrop-blur-sm p-6 rounded-2xl border border-purple-500/30 flex flex-col justify-between space-y-4 hover:border-purple-400 transition-all">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-700/60 flex items-center justify-center text-purple-400">
                    <Repeat size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    Vad det gör för CLV
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    <strong>Kundens livstidsvärde (+37% retention):</strong> Rekommenderade kunder stannar längre och har avsevärt högre återköpsfrekvens.
                  </p>
                  <ul className="text-xs text-slate-400 space-y-2 pt-1">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-purple-400 shrink-0 mt-0.5" />
                      <span><strong>Dubbelsidig lojalitet:</strong> Ambassadören köper själv 2.5x oftare för att använda sina intjänade butikskrediter.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-purple-400 shrink-0 mt-0.5" />
                      <span><strong>Lägre churn &amp; returgrad:</strong> Kunder som köpt på rekommendation returnerar mindre sällan.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-purple-400 shrink-0 mt-0.5" />
                      <span><strong>Varumärkesambassadörer för livet:</strong> Bygger en genuin community kring dina produkter.</span>
                    </li>
                  </ul>
                </div>
                <div className="pt-3 border-t border-purple-900/60">
                  <span className="text-[11px] font-mono text-purple-300 font-semibold">Effekt: +37% högre retention</span>
                </div>
              </div>

            </div>

            {/* INTERAKTIV SIMULATOR: AMBASSADORFLOW ROI */}
            <div className="bg-slate-950/70 p-6 rounded-2xl border border-indigo-900/80">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
                  <Calculator size={18} />
                  <span>Snabbkalkylator: Vad sparar du med AmbassadorFlow?</span>
                </div>
                <span className="text-xs text-slate-400">Interaktiv simulering i realtid</span>
              </div>

              <div className="grid md:grid-cols-3 gap-6 text-xs">
                <div>
                  <div className="flex justify-between font-semibold text-slate-300 mb-1">
                    <span>Månatliga ordrar:</span>
                    <span className="text-indigo-300 font-bold">{monthlyOrders.toLocaleString('sv-SE')} st</span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="20000"
                    step="500"
                    value={monthlyOrders}
                    onChange={(e) => setMonthlyOrders(Number(e.target.value))}
                    className="w-full accent-indigo-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-300 mb-1">
                    <span>Nuvarande CAC (Meta/Google):</span>
                    <span className="text-indigo-300 font-bold">{currentCAC} kr</span>
                  </div>
                  <input
                    type="range"
                    min="80"
                    max="600"
                    step="10"
                    value={currentCAC}
                    onChange={(e) => setCurrentCAC(Number(e.target.value))}
                    className="w-full accent-indigo-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-300 mb-1">
                    <span>Andel via ambassadörer:</span>
                    <span className="text-emerald-400 font-bold">{ambassadorShare} %</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="40"
                    step="1"
                    value={ambassadorShare}
                    onChange={(e) => setAmbassadorShare(Number(e.target.value))}
                    className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* RESULTATRAD */}
              <div className="mt-5 pt-4 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Ambassadörsordrar</span>
                  <span className="text-lg font-black text-white">{calculatedSavings.ordersViaAmbassador} st/mån</span>
                </div>
                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Minskad CAC-kostnad</span>
                  <span className="text-lg font-black text-emerald-400">
                    {Math.round(calculatedSavings.monthlyCostReduction).toLocaleString('sv-SE')} kr/mån
                  </span>
                </div>
                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Besparing per år</span>
                  <span className="text-lg font-black text-emerald-400">
                    {Math.round(calculatedSavings.yearlyCostReduction).toLocaleString('sv-SE')} kr
                  </span>
                </div>
                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Ny Blended CAC</span>
                  <span className="text-lg font-black text-indigo-300">
                    {Math.round(calculatedSavings.blendedCAC)} kr <span className="text-xs text-slate-400 font-normal">(-{Math.round(((currentCAC - calculatedSavings.blendedCAC) / currentCAC) * 100)}%)</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <span className="text-xs text-indigo-200">
                Läs mer om hur AmbassadorFlow integreras på Shopify, WooCommerce, Centra eller headless på deras officiella webbplats.
              </span>
              <a
                href="https://ambassadorflow.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-indigo-300 hover:text-white flex items-center gap-1.5 underline underline-offset-4"
              >
                Kom igång med AmbassadorFlow &rarr;
              </a>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SÖK OCH KATEGORIFILTRERING FÖR FORSKNINGSINSTITUT & RESURSER */}
        {/* ========================================================================= */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Microscope size={24} className="text-brand-600 dark:text-brand-400" />
                <span>{t.links.catalogTitle}</span>
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {t.links.catalogDesc}
              </p>
            </div>

            {/* Sökfält */}
            <div className="relative min-w-[280px]">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={t.links.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
              />
            </div>
          </div>

          {/* KATEGORIKNAPPAR */}
          <div className="flex flex-wrap gap-2 pt-1 border-b border-slate-200 dark:border-slate-800 pb-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                  selectedCategory === cat.id
                    ? 'bg-slate-900 text-white dark:bg-brand-600 shadow-sm'
                    : 'bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  selectedCategory === cat.id ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-900 text-slate-500'
                }`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* RESURS-GRID */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {filteredResources.map((item) => {
              const isBaymard = item.id === 'baymard';
              const isAmbassador = item.id === 'ambassadorflow';

              return (
                <div
                  key={item.id}
                  className={`bg-white dark:bg-slate-800/90 rounded-2xl border transition-all duration-200 p-6 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 ${
                    isBaymard
                      ? 'border-brand-500/60 ring-2 ring-brand-500/10 shadow-lg'
                      : isAmbassador
                      ? 'border-indigo-500/60 ring-2 ring-indigo-500/10 shadow-lg'
                      : 'border-slate-200 dark:border-slate-700/80 hover:border-brand-500/40 shadow-sm'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Header: Kategori och Utvald-badge */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800/60 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {item.categoryLabel}
                      </span>
                      {item.featured && (
                        <span className="text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Award size={10} /> Rekommenderad
                        </span>
                      )}
                    </div>

                    {/* Titel & Tagline */}
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center justify-between">
                        <span>{item.name}</span>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition"
                          title={`Öppna ${item.name} i ny flik`}
                        >
                          <ExternalLink size={16} />
                        </a>
                      </h3>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                        {item.tagline}
                      </p>
                    </div>

                    {/* Beskrivning */}
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Nyckeltal om tillgängligt */}
                    {item.impactMetrics && item.impactMetrics.length > 0 && (
                      <div className="bg-slate-50 dark:bg-slate-900/60 rounded-xl p-3 border border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-center">
                        {item.impactMetrics.slice(0, 2).map((m, idx) => (
                          <div key={idx}>
                            <span className="text-[10px] text-slate-400 block truncate">{m.metric}</span>
                            <span className="text-xs font-black text-brand-600 dark:text-brand-400 truncate block">
                              {m.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Taggar */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] font-medium bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-md"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Botten: Direktlänk */}
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 truncate max-w-[170px] font-mono">
                      {item.url.replace(/^https?:\/\//, '')}
                    </span>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 hover:underline"
                    >
                      <span>Öppna resurs</span>
                      <ArrowRight size={13} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredResources.length === 0 && (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
              <Search size={32} className="mx-auto text-slate-400" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                Inga resurser matchade &quot;{searchQuery}&quot;
              </h3>
              <p className="text-xs text-slate-500">
                Prova att rensa sökningen eller välja en annan kategori ovan.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="mt-2 text-xs font-bold text-brand-600 hover:underline"
              >
                Återställ alla filter
              </button>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* INTERAKTIV FORSKNINGS-SAMMANFATTNING: BAYMARD & NN/G VS SVENSK E-HANDEL */}
        {/* ========================================================================= */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-800 space-y-6">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs uppercase font-bold tracking-widest text-brand-400">
              Vetenskaplig Förankring
            </span>
            <h3 className="text-2xl font-black text-white">
              Hur vi använder data från Baymard Institute och ledande forskning
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Våra modeller i <Link href="/testcheckout" className="text-brand-400 hover:underline font-semibold">Checkout Lab</Link> och i våra <Link href="/guides/empirisk-data" className="text-brand-400 hover:underline font-semibold">Strategiguider</Link> bygger på empiriska mätningar från över 50 vetenskapliga studier.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 pt-2">
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 space-y-2">
              <div className="text-3xl font-black text-brand-400">70.19 %</div>
              <h4 className="text-sm font-bold text-white">Genomsnittligt kassaavhopp</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Baymard Institutes sammanställning av 49 olika e-handelsstudier. 2 av 3 som påbörjar ett köp slutför inte.
              </p>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 space-y-2">
              <div className="text-3xl font-black text-emerald-400">35.26 %</div>
              <h4 className="text-sm font-bold text-white">Återvinningspotential</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Andel av de förlorade köpen som kan räddas enbart genom att optimera formulärergonomi, förifyllning och transparens i fraktsteget.
              </p>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 space-y-2">
              <div className="text-3xl font-black text-indigo-400">4x</div>
              <h4 className="text-sm font-bold text-white">Ambassadörseffekt</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Nielsen &amp; AmbassadorFlow data visar att rekommenderad trafik konverterar upp till 4 gånger högre än kalla annonser.
              </p>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800">
            <span className="text-xs text-slate-400">
              Vill du fördjupa dig i all forskningsdata? Läs vår genomgång av 50+ studier.
            </span>
            <Link
              href="/guides/empirisk-data"
              className="inline-flex items-center gap-2 text-xs font-bold text-brand-400 hover:text-brand-300"
            >
              <span>Gå till Empirisk Forskningsdata</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
