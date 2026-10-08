export interface OptimizationFactor {
  id: string;
  number: number;
  title: string;
  description: string;
  defaultBoost: number; // in percentage points
  liftPillar: 'Värdeerbjudande' | 'Relevans' | 'Tydlighet' | 'Brådska' | 'Oro' | 'Friktion';
  liftExplanation: string;
  isActive: (config: any) => boolean;
}

export interface LiftPillarInfo {
  pillar: 'Värdeerbjudande' | 'Relevans' | 'Tydlighet' | 'Brådska' | 'Oro' | 'Friktion';
  title: string;
  role: 'Drivkraft' | 'Hämmare';
  color: string;
  description: string;
  impactScore: number;
}

export const CRO_OPTIMIZATION_FACTORS: OptimizationFactor[] = [
  {
    id: 'f1-prefill',
    number: 1,
    title: 'Pre-fill så mycket som möjligt',
    description: 'Postnummer, adress, telefonnummer – allt som kan hämtas från BankID eller tidigare besök förifylls.',
    defaultBoost: 3.5,
    liftPillar: 'Friktion',
    liftExplanation: 'Kapar 20–45 sekunder av kognitiv och manuell inmatningsfriktion.',
    isActive: (c) => Boolean(c.hasAutofill || c.hasLightningAutofill || c.prefillActive),
  },
  {
    id: 'f2-bnpl',
    number: 2,
    title: 'BNPL som default för svenska B2C',
    description: 'Klarna, Walley och Swish är trygghetssignaler i Sverige. Att ha dem överst minskar motstånd.',
    defaultBoost: 4.0,
    liftPillar: 'Oro',
    liftExplanation: 'Minskar betalningsoro genom att kunden slipper ange kortnummer och betalar först efter leverans.',
    isActive: (c) => Boolean(c.paymentMethods?.includes('klarna') || c.paymentMethods?.includes('walley') || c.paymentMethods?.includes('swish')),
  },
  {
    id: 'f3-delivery-first',
    number: 3,
    title: 'Leveransval före betalning',
    description: 'Ingrid och nShift visar att tydligt leveransval före betalning lyfter konvertering 5–15 %.',
    defaultBoost: 6.5,
    liftPillar: 'Tydlighet',
    liftExplanation: 'Skapar total klarhet kring hur, när och till vilket pris varan når fram innan plånboken öppnas.',
    isActive: (c) => {
      // Leverans kommer före betalning i layout-ordningen
      const shipIdx = c.layoutOrder?.indexOf('shipping') ?? -1;
      const payIdx = c.layoutOrder?.indexOf('payment') ?? -1;
      return shipIdx !== -1 && payIdx !== -1 && shipIdx < payIdx;
    },
  },
  {
    id: 'f4-minimal-fields',
    number: 4,
    title: 'Minimera fältkrav',
    description: 'Varje extra fält kostar 1–2 % konvertering. Fråga enbart om det som behövs för leveransen.',
    defaultBoost: 4.5,
    liftPillar: 'Friktion',
    liftExplanation: 'Färre fält minimerar drop-off vid formulärsteget (Baymard: max 8 fält, Click & Collect 3 fält).',
    isActive: (c) => Boolean(c.pickupFirstStep || c.stepConfig?.mode === 'click-collect' || c.isGuestCheckout),
  },
  {
    id: 'f5-trust-signals',
    number: 5,
    title: 'Trust-signaler över veckningen',
    description: 'BankID, SSL, Visa/Mastercard, Reco och Trustpilot synliga utan scrollning.',
    defaultBoost: 3.0,
    liftPillar: 'Oro',
    liftExplanation: 'Avväpnar tveksamhet och oro hos förstagångsbesökare vid sista beslutet.',
    isActive: (c) => Boolean(c.showTrustBadges !== false && (c.showBankId || c.hasSSL || c.showReviews)),
  },
  {
    id: 'f6-mobile-keyboard',
    number: 6,
    title: 'Mobiloptimerade tangentbord',
    description: 'inputmode="numeric" för postnummer och mobil, type="email" för e-post.',
    defaultBoost: 2.0,
    liftPillar: 'Friktion',
    liftExplanation: 'Eliminerar inmatningsfel på mobila enheter där 70%+ av trafiken sker.',
    isActive: () => true, // Standard i moderna implementationer
  },
  {
    id: 'f7-address-validation',
    number: 7,
    title: 'Adressvalidering live',
    description: 'Direktkontroll mot register minskar felskrivningar och sänker returgraden.',
    defaultBoost: 2.5,
    liftPillar: 'Friktion',
    liftExplanation: 'Förhindrar felaktiga adresser och försenade transporter.',
    isActive: (c) => Boolean(c.addressAutocomplete || c.hasAutofill),
  },
  {
    id: 'f8-progress-indicator',
    number: 8,
    title: 'Progress-indikator vid 2+ steg',
    description: 'Tydlig visuell framstegsindikator. Aldrig fler än tre steg i en modern konsumentkassa.',
    defaultBoost: 2.0,
    liftPillar: 'Tydlighet',
    liftExplanation: 'Ger kunden överblick över var de befinner sig i köpresan och hur lite som återstår.',
    isActive: (c) => {
      const mode = c.stepConfig?.mode || '1-steg';
      return mode === '1-steg' || c.stepConfig?.indicatorStyle === 'numbered' || c.stepConfig?.indicatorStyle === 'progressbar' || c.stepConfig?.indicatorStyle === 'accordion';
    },
  },
  {
    id: 'f9-post-purchase-upsell',
    number: 9,
    title: 'Post-purchase upsell (Walley Engage-stil)',
    description: 'Merförsäljning och lojalitet efter genomfört köp – intäkt utan friktion i huvudflödet.',
    defaultBoost: 3.5,
    liftPillar: 'Värdeerbjudande',
    liftExplanation: 'Ökar livstidsvärde och AOV utan att äventyra konverteringen på första ordern.',
    isActive: (c) => Boolean(c.hasUpsell || c.showNextPurchaseDiscount),
  },
  {
    id: 'f10-save-choices',
    number: 10,
    title: 'Spara kundens val',
    description: 'Återkommande besök förväljer automatiskt tidigare använt leveranssätt och paketbox.',
    defaultBoost: 3.5,
    liftPillar: 'Relevans',
    liftExplanation: 'Kunden känner igen sig och kan slutföra köpet med ett minimum av klick.',
    isActive: (c) => Boolean(c.rememberShipping),
  },
  {
    id: 'f11-clear-returns',
    number: 11,
    title: 'Tydlig returpolicy i kassan',
    description: '14–30 dagars fri retur eller QR-kod i butik tydligt kommunicerad, inte gömd i footern.',
    defaultBoost: 3.0,
    liftPillar: 'Oro',
    liftExplanation: 'Ger kunden psykologisk trygghet i att de enkelt kan lämna tillbaka varan vid felköp.',
    isActive: (c) => Boolean(c.showEuReturnButton || c.returnCost === 'free'),
  },
  {
    id: 'f12-funnel-analytics',
    number: 12,
    title: 'Mät allt (Mikrosteg & Trattanalys)',
    description: 'Mät mikrokonverteringar per formulärfält, inte bara sessionsnivå.',
    defaultBoost: 2.5,
    liftPillar: 'Tydlighet',
    liftExplanation: 'Möjliggör datadrivna A/B-tester och kontinuerlig optimering.',
    isActive: () => true,
  },
];

// De 4 fraktoptimeringarna från blogginlägget
export const SHIPPING_CRO_VARIABLES = [
  {
    id: 'ship-exact-dates',
    title: 'Exakta leveransdatum (istället för 1–3 dagar)',
    description: 'Byt ut "1–3 arbetsdagar" mot "Levereras på torsdag 12 maj" kopplat till lagrets cut-off-tid.',
    boost: 3.5,
    liftPillar: 'Tydlighet',
  },
  {
    id: 'ship-badging',
    title: 'Guidning genom märkning (Badging)',
    description: 'Etiketter som "Snabbast", "Mest populärt" och "Fossilfritt" halverar valstress.',
    boost: 2.8,
    liftPillar: 'Relevans',
  },
  {
    id: 'ship-postcode-driven',
    title: 'Postnummer-drivet flöde',
    description: 'Mata in postnummer tidigt för att direkt visa paketboxar och relevanta hemleveranser.',
    boost: 3.2,
    liftPillar: 'Friktion',
  },
  {
    id: 'ship-free-shipping-meter',
    title: 'Dynamisk fri frakt-mätare',
    description: 'Visar tydligt hur nära kunden är fri frakt direkt i anslutning till leveransvalet (+18 % AOV).',
    boost: 2.5,
    liftPillar: 'Värdeerbjudande',
  },
];

// Mock-kunder för testning av förifyllnadsflöde i Checkout Lab
export interface MockCustomer {
  id: string;
  email: string;
  phone: string;
  name: string;
  firstName: string;
  lastName: string;
  address: string;
  postalCode: string;
  city: string;
  preferredCarrier: string;
  preferredPayment: string;
  savedLocker: string;
  ordersCount: number;
}

export const DEFAULT_MOCK_CUSTOMERS: MockCustomer[] = [
  {
    id: 'cust-1',
    email: 'anna@example.se',
    phone: '070-123 45 67',
    name: 'Anna Svensson',
    firstName: 'Anna',
    lastName: 'Svensson',
    address: 'Vasagatan 14B',
    postalCode: '111 20',
    city: 'Stockholm',
    preferredCarrier: 'instabox',
    preferredPayment: 'klarna',
    savedLocker: 'Instabox – ICA Nära Centralen (Box 4)',
    ordersCount: 8,
  },
  {
    id: 'cust-2',
    email: 'erik.lindqvist@foretag.se',
    phone: '073-987 65 43',
    name: 'Erik Lindqvist',
    firstName: 'Erik',
    lastName: 'Lindqvist',
    address: 'Kungsportsavenyen 22',
    postalCode: '411 36',
    city: 'Göteborg',
    preferredCarrier: 'postnord',
    preferredPayment: 'swish',
    savedLocker: 'PostNord Ombud – Pressbyrån Avenyn',
    ordersCount: 3,
  },
  {
    id: 'cust-3',
    email: 'sara.malm@test.com',
    phone: '072-555 12 34',
    name: 'Sara Malm',
    firstName: 'Sara',
    lastName: 'Malm',
    address: 'Stortorget 5',
    postalCode: '211 22',
    city: 'Malmö',
    preferredCarrier: 'budbee',
    preferredPayment: 'walley',
    savedLocker: 'Budbee Box – Entré Köpcentrum',
    ordersCount: 12,
  },
];

export interface SavedCheckoutVariant {
  id: string;
  name: string;
  description: string;
  dateCreated: string;
  mode: string;
  estimatedConversionRate: number;
  estimatedAOV: number;
  formFieldsCount: number;
  liftScores: {
    value: number;
    relevance: number;
    clarity: number;
    anxiety: number;
    friction: number;
  };
  configSnapshot: any;
}

export const DEFAULT_SAVED_VARIANTS: SavedCheckoutVariant[] = [
  {
    id: 'var-1-express',
    name: 'Variant A: 1-stegs Expresskassa',
    description: 'En-sidig checkout med Blixt-autofill, Klarna, Swish och Instabox.',
    dateCreated: '2026-05-01',
    mode: '1-steg',
    estimatedConversionRate: 84.5,
    estimatedAOV: 699,
    formFieldsCount: 4,
    liftScores: { value: 85, relevance: 92, clarity: 88, anxiety: 15, friction: 12 },
    configSnapshot: {
      mode: '1-steg',
      prefill: true,
      lightningAutofill: true,
      pickupFirstStep: false,
    },
  },
  {
    id: 'var-2-ingrid-3step',
    name: 'Variant B: 3-stegs Leverans-fokuserad (Ingrid-stil)',
    description: 'Tydligt leveransval före betalning, exakta leveransdatum och Walley.',
    dateCreated: '2026-05-04',
    mode: '3-steg',
    estimatedConversionRate: 81.0,
    estimatedAOV: 785,
    formFieldsCount: 6,
    liftScores: { value: 82, relevance: 86, clarity: 95, anxiety: 18, friction: 22 },
    configSnapshot: {
      mode: '3-steg',
      prefill: true,
      pickupFirstStep: false,
    },
  },
  {
    id: 'var-3-accordion-clickcollect',
    name: 'Variant C: Accordion + Click & Collect',
    description: 'Expanderande dragspelskassa med Hämta i butik i steg 1 (endast 3 kontaktfält).',
    dateCreated: '2026-05-08',
    mode: 'accordion',
    estimatedConversionRate: 88.2,
    estimatedAOV: 649,
    formFieldsCount: 3,
    liftScores: { value: 90, relevance: 94, clarity: 92, anxiety: 10, friction: 8 },
    configSnapshot: {
      mode: 'accordion',
      pickupFirstStep: true,
      pickupModeActive: true,
    },
  },
];

export const LIFT_PILLARS_DATA: LiftPillarInfo[] = [
  {
    pillar: 'Värdeerbjudande',
    title: 'Värdeerbjudande (Value Proposition)',
    role: 'Drivkraft',
    color: 'emerald',
    description: 'Kärnan i köpbeslutet. Vad får kunden och varför ska de köpa av just dig? Förstärks av fri frakt-mätare, medlemsrabatter och tydliga garantier.',
    impactScore: 88,
  },
  {
    pillar: 'Relevans',
    title: 'Relevans (Relevance)',
    role: 'Drivkraft',
    color: 'blue',
    description: 'Matchar kassan kundens förväntningar och lokala marknad? Svenska betalsätt (Swish/Klarna/Walley), lokala paketboxar (Instabox/Budbee) och badging.',
    impactScore: 92,
  },
  {
    pillar: 'Tydlighet',
    title: 'Tydlighet (Clarity)',
    role: 'Drivkraft',
    color: 'indigo',
    description: 'Förstår kunden vad som händer i varje steg? Exakta leveransdatum ("Torsdag 12 maj" istället för "1–3 dagar"), tydlig ordersummering och progress-indikator.',
    impactScore: 90,
  },
  {
    pillar: 'Brådska',
    title: 'Brådska (Urgency)',
    role: 'Drivkraft',
    color: 'amber',
    description: 'Varför ska köpet genomföras just nu? Äkta cut-off klockor ("Beställ inom 42 min för leverans imorgon") och begränsat lagersaldo. Ska användas varsamt.',
    impactScore: 74,
  },
  {
    pillar: 'Oro',
    title: 'Oro (Anxiety)',
    role: 'Hämmare',
    color: 'rose',
    description: 'Tvivel, säkerhetsrädsla eller otydliga villkor. Minskas med BankID, SSL, kända betallogotyper, 30 dagars returrätt och transparenta kostnader.',
    impactScore: 16, // Lägre är bättre för hämmare
  },
  {
    pillar: 'Friktion',
    title: 'Friktion (Friction)',
    role: 'Hämmare',
    color: 'rose',
    description: 'Psykologiskt och praktiskt motstånd. Onödiga formulärfält, tvingat konto, tröga tangentbord. Minskas med Pre-fill, Blixt-kassa och Click & Collect.',
    impactScore: 14, // Lägre är bättre för hämmare
  },
];

