export type Market = 'B2C' | 'B2B' | 'B2B/B2C';
export type Category = 'Checkout' | 'BNPL' | 'Logistics' | 'Post-purchase';

export interface Player {
  slug: string;
  name: string;
  tagline: string;
  logoUrl: string; // absolute path inside /public
  websiteUrl: string; // canonical company website
  brandColor: string; // tailwind class for brand bar
  category: Category;
  targetMarket: Market;
  conversionImpact: number; // 1-10
  trustAngle: string; // Gartner-style positioning angle
  pros: string[];
  cons: string[];
  keyFeatures: string[];
  pricing: string;
  countries: string[];
  affiliateUrl: string;
  description: string;
  faq: { q: string; a: string }[];
}

export const players: Player[] = [
  {
    slug: 'klarna',
    name: 'Klarna',
    tagline: 'Marknadens mest igenkända checkout med BNPL i kärnan.',
    logoUrl: '/logos/klarna.png',
    websiteUrl: 'https://www.klarna.com',
    brandColor: 'bg-pink-500',
    category: 'Checkout',
    targetMarket: 'B2C',
    conversionImpact: 9,
    trustAngle: 'Brand recognition & frictionless BNPL',
    pros: [
      'Hög igenkänning ökar trygghet i kassan',
      'Stark suite för delbetalning och faktura',
      'Brett internationellt stöd',
      'Mogen merchant-portal med insikter',
    ],
    cons: [
      'Högre transaktionskostnader än vissa konkurrenter',
      'Mindre customizable UI än Kustom',
      'Beroende av Klarnas branding i kassan',
    ],
    keyFeatures: [
      'BNPL (faktura, delbetalning, konto)',
      'One-click & express checkout',
      'Inbyggd riskbedömning',
      'Klarna app & loyalty-flöden',
      'Omnichannel: in-store + online',
    ],
    pricing: 'Transaktionsbaserad. Förhandlas per merchant.',
    countries: ['SE', 'NO', 'DK', 'FI', 'DE', 'UK', 'US', '+15'],
    affiliateUrl: 'https://www.klarna.com/business/',
    description:
      'Klarna är den globalt dominerande checkout-aktören med rötter i Sverige. Erbjudandet kombinerar betallösning, BNPL och en konsumentapp som driver återkommande köp. För svenska e-handlare är Klarna ofta default-valet, men beslutet bör vägas mot marginalpåverkan och behov av branding-kontroll.',
    faq: [
      { q: 'Är Klarna bäst för svensk e-handel?', a: 'Klarna har starkast igenkänning i Sverige men inte alltid bäst marginal. För högre AOV eller B2B-flöden kan Walley eller Qliro vara mer kostnadseffektivt.' },
      { q: 'Stödjer Klarna B2B?', a: 'Klarna har B2B-funktionalitet men det är mest moget för B2C. För renodlat B2B är Walley/Qliro starkare alternativ.' },
    ],
  },
  {
    slug: 'walley',
    name: 'Walley',
    tagline: 'Post-purchase intäkter och stark B2B-checkout.',
    logoUrl: '/logos/walley.png',
    websiteUrl: 'https://www.walley.se',
    brandColor: 'bg-emerald-500',
    category: 'Checkout',
    targetMarket: 'B2B/B2C',
    conversionImpact: 8,
    trustAngle: 'Post-purchase revenue & B2B strength',
    pros: [
      'Stark B2B-funktionalitet (organisationsnummer-flöde)',
      'Post-purchase upsell ökar intäkten per order',
      'Konkurrenskraftiga priser',
      'Nordiskt fokus med god lokal support',
    ],
    cons: [
      'Lägre internationell igenkänning än Klarna',
      'Mindre konsument-app-ekosystem',
    ],
    keyFeatures: [
      'B2B & B2C i samma checkout',
      'Walley Engage – post-purchase widgets',
      'Faktura, delbetalning, kort, Swish',
      'Organisationsnummer-uppslag',
      'Abonnemangshantering',
    ],
    pricing: 'Transaktionsbaserad, transparent prismodell.',
    countries: ['SE', 'NO', 'DK', 'FI'],
    affiliateUrl: 'https://www.walley.se/foretag/',
    description:
      'Walley (tidigare Collector Checkout) är en av Sveriges starkaste utmanare till Klarna. Bolaget har särskilt stark position inom B2B där organisationsnummer-flöden och fakturabetalning är avgörande. Walley Engage – produkter för post-purchase intäkt – är ett tydligt differentieringsvärde.',
    faq: [
      { q: 'Vad är Walley Engage?', a: 'Ett post-purchase-lager som visar relevanta erbjudanden direkt efter köp och driver merförsäljning utan att påverka konverteringsflödet.' },
      { q: 'Klarar Walley B2B-flöden?', a: 'Ja, det är en av Walleys starkaste sidor – inklusive organisationsnummer-uppslag och fakturahantering mot företag.' },
    ],
  },
  {
    slug: 'kustom',
    name: 'Kustom',
    tagline: 'Headless checkout för varumärken som vill äga UI:t.',
    logoUrl: '/logos/kustom.png',
    websiteUrl: 'https://kustom.co',
    brandColor: 'bg-violet-500',
    category: 'Checkout',
    targetMarket: 'B2C',
    conversionImpact: 8,
    trustAngle: 'Customizable UI & full brand control',
    pros: [
      'Full UI-kontroll – inget tredjeparts-branding',
      'Headless arkitektur passar moderna stackar',
      'Composable: välj betalmetoder fritt',
      'Snabb laddning, hög teknisk standard',
    ],
    cons: [
      'Kräver mer utvecklingsresurser',
      'Mindre färdig BNPL-funktionalitet jämfört med Klarna',
    ],
    keyFeatures: [
      'Headless / API-first',
      'Customizable UI-komponenter',
      'Multipla PSP:er bakom samma flöde',
      'A/B-test ready',
      'GDPR-vänlig datamodell',
    ],
    pricing: 'SaaS + transaktion. Offert per merchant.',
    countries: ['SE', 'NO', 'DK', 'FI', 'EU'],
    affiliateUrl: 'https://kustom.co/',
    description:
      'Kustom (tidigare Briqpay) bygger en headless checkout för varumärken som vill behålla full UI- och datakontroll. Lämpar sig särskilt väl för D2C-brands och avancerade e-handlare som A/B-testar kassan kontinuerligt och inte vill kompromissa på brand experience.',
    faq: [
      { q: 'Behöver jag utvecklare för Kustom?', a: 'Ja, det är en headless lösning som kräver implementation. I gengäld får du full kontroll över UX och konvertering.' },
      { q: 'Kan jag kombinera Kustom med Klarna?', a: 'Ja – Kustom är PSP-agnostisk och kan rendera Klarna, Adyen, Stripe m.fl. som betalmetoder.' },
    ],
  },
  {
    slug: 'qliro',
    name: 'Qliro',
    tagline: 'Svensk utmanare med stark fokus på AOV och säkerhet.',
    logoUrl: '/logos/qliro.png',
    websiteUrl: 'https://www.qliro.com',
    brandColor: 'bg-orange-500',
    category: 'Checkout',
    targetMarket: 'B2C',
    conversionImpact: 7,
    trustAngle: 'Post-purchase revenue & high-AOV ecommerce',
    pros: [
      'Stark vid höga ordervärden (möbler, hemelektronik)',
      'Konkurrenskraftig prismodell',
      'Genomtänkt riskhantering',
      'Lokalt nordiskt fotfäste',
    ],
    cons: [
      'Mindre internationell räckvidd än Klarna',
      'Svagare app-ekosystem',
    ],
    keyFeatures: [
      'BNPL, faktura, delbetalning, kort',
      'Riskbaserad authentication',
      'Snabb integration via SDK',
      'Bra lojalitets- och återköpsflöden',
    ],
    pricing: 'Transaktionsbaserad. Förhandlingsbar.',
    countries: ['SE', 'NO', 'DK', 'FI'],
    affiliateUrl: 'https://www.qliro.com/sv-se/handel',
    description:
      'Qliro är en noterad svensk utmanare som historiskt drivit handel med högt ordervärde. Erbjudandet är moget och konkurrenskraftigt prissatt, särskilt för segment där delbetalning är ett verkligt köpargument.',
    faq: [
      { q: 'När väljer jag Qliro framför Klarna?', a: 'När din genomsnittliga ordervärde är hög och delbetalning är ett verkligt köpargument – Qliros prismodell kan ge bättre marginal i det segmentet.' },
    ],
  },
  {
    slug: 'ingrid',
    name: 'Ingrid',
    tagline: 'Delivery experience platform – konvertering via leverans.',
    logoUrl: '/logos/ingrid.png',
    websiteUrl: 'https://www.ingrid.com',
    brandColor: 'bg-sky-500',
    category: 'Logistics',
    targetMarket: 'B2C',
    conversionImpact: 8,
    trustAngle: 'Logistics conversion & delivery UX',
    pros: [
      'Leveransval i kassan ökar konvertering bevisligen',
      'Modulärt: kan kombineras med valfri checkout',
      'Stark data och track & trace',
      'Bra ramverk för CO₂-medvetna leveranser',
    ],
    cons: [
      'Inte en betallösning – komplement, inte substitut',
      'Kräver integrations-arbete med både checkout och WMS',
    ],
    keyFeatures: [
      'Smart leveransval i kassan',
      'Branded tracking-page',
      'Adressvalidering',
      'Multi-carrier dashboard',
      'Returer & post-purchase',
    ],
    pricing: 'SaaS + transaktion.',
    countries: ['SE', 'NO', 'DK', 'FI', 'DE', 'NL', 'UK'],
    affiliateUrl: 'https://www.ingrid.com/',
    description:
      'Ingrid bygger Sveriges mest mogna Delivery Experience Platform. Plattformen optimerar steget mellan "lagt i varukorgen" och "levererat" – det skede där flest köp tappas. För e-handel med fysiska varor är delivery experience ett av de största orörda CRO-spakerna.',
    faq: [
      { q: 'Är Ingrid en checkout?', a: 'Nej, Ingrid är en delivery experience platform som integreras i din befintliga checkout (Klarna, Walley, Kustom etc.) och optimerar leveranssteget.' },
      { q: 'Hur mycket ökar konverteringen?', a: 'Mätningar i nordiska e-handelssegment indikerar att smart leveransval kan lyfta checkout-konvertering med 5–15%.' },
    ],
  },
  {
    slug: 'nshift',
    name: 'nShift',
    tagline: 'Enterprise-skalad delivery management & multicarrier.',
    logoUrl: '/logos/nshift.png',
    websiteUrl: 'https://www.nshift.com',
    brandColor: 'bg-indigo-500',
    category: 'Logistics',
    targetMarket: 'B2B/B2C',
    conversionImpact: 7,
    trustAngle: 'Logistics conversion at enterprise scale',
    pros: [
      'Bredaste carrier-nätverket i Norden',
      'Robust för stora volymer & komplex logistik',
      'Stark TMS-funktionalitet',
      'Bevisat enterprise-track-record',
    ],
    cons: [
      'Mer komplex implementation – passar mid-market och uppåt',
      'Mindre konsument-fokuserad UX än Ingrid',
    ],
    keyFeatures: [
      'Delivery Checkout',
      'Multicarrier-shipping',
      'Returer & track-and-trace',
      'Warehouse integrations',
      'Customer comms post-purchase',
    ],
    pricing: 'Enterprise – offert.',
    countries: ['SE', 'NO', 'DK', 'FI', 'EU', 'UK'],
    affiliateUrl: 'https://www.nshift.com/',
    description:
      'nShift är den nordiska enterprise-tungviktaren inom delivery management. Plattformen täcker hela kedjan från checkout till returer och passar e-handlare med komplexa carrier-mixer och stora volymer. Mer enterprise-orienterat än Ingrid, men oslagbart vid skala.',
    faq: [
      { q: 'nShift eller Ingrid?', a: 'Ingrid har vassare konsument-UX och passar D2C-brands. nShift är starkare vid enterprise-volymer och komplex multi-carrier-logistik.' },
    ],
  },
  {
    slug: 'svea',
    name: 'Svea',
    tagline: 'Svensk finansiell infrastruktur med bred checkout- och betalmeny.',
    logoUrl: '/logos/svea.png',
    websiteUrl: 'https://www.svea.com',
    brandColor: 'bg-rose-500',
    category: 'Checkout',
    targetMarket: 'B2B/B2C',
    conversionImpact: 7,
    trustAngle: 'Etablerad finansiell partner med full betalmeny',
    pros: [
      'Stor svensk finansiell koncern – högt förtroende',
      'Bredd i betalmetoder (faktura, delbetalning, kort, Swish)',
      'Starkt B2B-erbjudande via organisationsnummer-flöden',
      'Inkasso- och kredithantering i samma koncern',
    ],
    cons: [
      'Mindre modernt UI-skal än Kustom/Klarna',
      'Lägre internationell räckvidd än Klarna',
    ],
    keyFeatures: [
      'Svea Checkout (hosted)',
      'Faktura, delbetalning, kort, Swish, Trustly',
      'B2B-flöden med organisationsnummer',
      'Kredit- och inkassohantering',
      'Abonnemang & återkommande betalningar',
    ],
    pricing: 'Transaktionsbaserad, förhandlas per merchant.',
    countries: ['SE', 'NO', 'DK', 'FI', 'NL', 'DE'],
    affiliateUrl: 'https://www.svea.com/se/sv/foretag/vara-tjanster/checkout/',
    description:
      'Svea är en etablerad svensk finansiell aktör som bygger checkout ovanpå en full finansiell stack – kredit, faktura, inkasso. Det gör Svea till ett särskilt starkt alternativ när du vill äga hela kedjan från kassa till fordran, och när både B2B- och B2C-flöden ska samsas i samma checkout.',
    faq: [
      { q: 'När väljer jag Svea?', a: 'När du vill ha en svensk finansiell partner med full bredd på betalmetoder och behov av både B2B och B2C i samma flöde – särskilt om kredit- och inkassohantering är viktigt.' },
      { q: 'Hur står sig Svea mot Klarna?', a: 'Klarna vinner på global igenkänning och konsument-app. Svea vinner på svensk finansiell djup, B2B-styrka och att hela kreditkedjan kan hanteras internt.' },
    ],
  },
];

export function getPlayer(slug: string): Player | undefined {
  return players.find((p) => p.slug === slug);
}

export function getPlayerSlugs(): string[] {
  return players.map((p) => p.slug);
}
