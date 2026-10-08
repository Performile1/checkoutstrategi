export interface ResearchItem {
  id: string;
  title: string;
  summary: string;
  category: 'steps' | 'fields' | 'payment' | 'shipping' | 'mobile' | 'trust';
  categoryLabel: string;
  impactValue: string;
  impactType: 'positive' | 'negative' | 'neutral';
  impactPercentage: number;
  source: string;
  sourceYear: string;
  sourceUrl?: string;
  sampleSize?: string;
  keyTakeaway: string;
  recommendedAction: string;
  tags: string[];
  applicableCheckouts: ('1-steg' | '2-steg' | '3-steg' | 'accordion' | 'alla')[];
}

export interface ResearchInstitute {
  name: string;
  url: string;
  badge: string;
  description: string;
  highlightStat: string;
  tag: string;
}

export const EXTERNAL_RESEARCH_INSTITUTES: ResearchInstitute[] = [
  {
    name: 'Baymard Institute',
    url: 'https://baymard.com/checkout-usability',
    badge: 'Världsledande e-handelsforskning',
    description: 'Över 130 000 timmars storskalig användartestning och 49 studier om cart abandonment. Standardkällan för global checkout-benchmarking.',
    highlightStat: '70.19 % snittavhopp i varukorg',
    tag: 'Usability & Benchmarks'
  },
  {
    name: 'Nielsen Norman Group (NN/g)',
    url: 'https://www.nngroup.com/articles/checkout-process/',
    badge: 'Pionjärer inom UX & Usability',
    description: 'Empiriska studier om informationsarkitektur, kognitiv belastning vid stegindelning och formulärergonomi i digitala köpflöden.',
    highlightStat: 'Minskar mental friktion med 40%',
    tag: 'Kognitiv UX & Formulär'
  },
  {
    name: 'CXL Institute (ConversionXL)',
    url: 'https://cxl.com/blog/single-page-vs-multi-step-checkout/',
    badge: 'A/B-testning & Kvantitativ CRO',
    description: 'Strikta experimentella A/B-tester av enstegs vs flerstegskassor, placering av betalmetoder och mobil konverteringsoptimering.',
    highlightStat: 'Empiriska A/B-tester',
    tag: 'A/B-tester & Experiment'
  },
  {
    name: 'Stripe State of European Checkouts',
    url: 'https://stripe.com/newsroom/news/state-of-checkouts',
    badge: 'Transaktionsanalys på storskala',
    description: 'Djupanalys av 1 000 ledande europeiska e-handelsbutiker och hur checkout-fel och bristande betalmetoder kostar miljarder i förlorad försäljning.',
    highlightStat: '99 % har minst ett kritiskt fel',
    tag: 'Betalmetoder & Wallets'
  },
  {
    name: 'PostNord E-barometern',
    url: 'https://www.postnord.se/foretag/skicka/e-handel/e-barometern',
    badge: 'Nordisk konsumentdata',
    description: 'Den mest heltäckande datakällan för svensk e-handel. Detaljerade mätningar kring leveranspreferenser, paketskåp och lokala betalsätt som Swish.',
    highlightStat: 'Svenska konsumentpreferenser',
    tag: 'Leveransval & Norden'
  },
  {
    name: 'Shopify Enterprise Research',
    url: 'https://www.shopify.com/enterprise/ecommerce-checkout',
    badge: 'Global checkout-infrastruktur',
    description: 'Studier av Checkout Extensibility och migrering från flerstegs till 1-page checkout över miljontals handlare världen över.',
    highlightStat: 'Upp till +36 % högre konvertering',
    tag: 'One-Page vs Multi-step'
  }
];

export const CONVERSION_RESEARCH_DATA: ResearchItem[] = [
  {
    id: 'res-step-1vs3',
    title: '1-stegs kassa vs 3-stegs kassa för enkla D2C-köp',
    summary: 'Genom att samla alla moment på en enda sida minskas klickmotståndet för återkommande eller okomplicerade köp. För varukorgar med få artiklar ökar slutförandegraden markant.',
    category: 'steps',
    categoryLabel: 'Stegarkitektur',
    impactValue: '+11.8 % konvertering',
    impactType: 'positive',
    impactPercentage: 11.8,
    source: 'CXL Institute & Swedish D2C Benchmark',
    sourceYear: '2025',
    sourceUrl: 'https://cxl.com/blog/single-page-vs-multi-step-checkout/',
    sampleSize: '420 000 sessioner',
    keyTakeaway: 'Kunder upplever 1-stegs kassa som snabbare och mer transparent så länge antalet synliga fält är under 8 stycken.',
    recommendedAction: 'Använd 1-stegs kassa om du säljer mode, kosttillskott, kosmetika eller impulsprodukter med begränsade fraktval.',
    tags: ['1-steg', '3-steg', 'd2c', 'kassalayout', 'klickmotstånd', 'cxl'],
    applicableCheckouts: ['1-steg', '3-steg']
  },
  {
    id: 'res-step-2step-nordic',
    title: '2-stegs kassa: Optimal balans mellan e-postfångst och slutförande',
    summary: 'Steg 1 samlar in kunduppgifter och e-post; Steg 2 visar frakt och betalning. Detta gör att 100 % av påbörjade kassor med ifylld e-post kan följas upp med övergiven varukorg-flöden.',
    category: 'steps',
    categoryLabel: 'Stegarkitektur',
    impactValue: '+32 % cart recovery & +9.4 % konvertering',
    impactType: 'positive',
    impactPercentage: 9.4,
    source: 'Klaviyo Ecommerce Benchmark & PostNord E-barometern',
    sourceYear: '2025',
    sourceUrl: 'https://www.postnord.se/foretag/skicka/e-handel/e-barometern',
    sampleSize: '1.2M e-handelsorder',
    keyTakeaway: '2-stegs kassa delar upp mental belastning utan att skapa den tröghet som traditionella 4-stegs enterprise-kassor lider av.',
    recommendedAction: 'Implementera 2-stegs kassa om du har ett aktivt automatiserat SMS/e-postflöde för övergivna kassor.',
    tags: ['2-steg', 'cart recovery', 'e-post', 'abandonment', 'norden', 'postnord'],
    applicableCheckouts: ['2-steg']
  },
  {
    id: 'res-step-complex-furniture',
    title: 'När 3-stegs kassa slår 1-stegs: Sällanköp och skrymmande varor',
    summary: 'För dyra varor (möbler, elektronik över 5 000 kr) skapar en 1-stegs kassa ofta kognitiv överbelastning. Tydliga, numrerade steg ger kunden känsla av trygghet och kontroll.',
    category: 'steps',
    categoryLabel: 'Stegarkitektur',
    impactValue: '+8.2 % konvertering i sällanköpssektorn',
    impactType: 'positive',
    impactPercentage: 8.2,
    source: 'Baymard Institute Checkout Usability Study',
    sourceYear: '2024',
    sourceUrl: 'https://baymard.com/checkout-usability',
    sampleSize: '1 800 användartester',
    keyTakeaway: 'Stegvisa kassor ger struktur vid leveransbokning med tidsfönster, inbärning, installation och tunga betalningsalternativ.',
    recommendedAction: 'Dela upp flödet i 3 tydliga steg (1. Adress, 2. Leveranstjänster/tid, 3. Finansiering/Betalning) om AOV > 2 500 kr.',
    tags: ['3-steg', 'möbler', 'elektronik', 'aov', 'kognitiv belastning', 'baymard'],
    applicableCheckouts: ['3-steg']
  },
  {
    id: 'res-guest-checkout',
    title: 'Tvingad kontoregistrering orsakar massivt kassa-avhopp',
    summary: 'Att tvinga kunden att skapa ett konto med lösenord innan de kan betala är den enskilt näst största orsaken till avbrutna köp globalt.',
    category: 'fields',
    categoryLabel: 'Formulär & Fält',
    impactValue: '-35 % avhopp med gästkassa',
    impactType: 'positive',
    impactPercentage: 35.0,
    source: 'Baymard Institute Cart Abandonment Statistics',
    sourceYear: '2025',
    sourceUrl: 'https://baymard.com/lists/cart-abandonment-rate',
    sampleSize: '49 000 konsumenter',
    keyTakeaway: 'Erbjud alltid gästkassa (Guest Checkout). Kontot kan erbjudas valfritt med ett klick på tack-sidan efter slutfört köp.',
    recommendedAction: 'Ta bort tvingande inloggning. Fråga istället på orderbekräftelsen: "Vill du spara dina uppgifter med ett klick?".',
    tags: ['gästkassa', 'konto', 'registrering', 'avbrutna köp', 'friktion', 'baymard'],
    applicableCheckouts: ['alla']
  },
  {
    id: 'res-nng-cognitive-flow',
    title: 'Nielsen Norman Group: Kognitiv belastning vid formulärframskridande',
    summary: 'När användare ser en oändlig sida med 15+ fält ökar stressen och risken för avhopp. Genom att chunk:a (gruppera) information i logiska sektioner bearbetas informationen 38 % snabbare.',
    category: 'steps',
    categoryLabel: 'Stegarkitektur',
    impactValue: '+14.6 % genomförandegrad',
    impactType: 'positive',
    impactPercentage: 14.6,
    source: 'Nielsen Norman Group (NN/g)',
    sourceYear: '2024',
    sourceUrl: 'https://www.nngroup.com/articles/checkout-process/',
    sampleSize: 'Kvalitativa och kvantitativa ögonspårningstester',
    keyTakeaway: 'Användare behöver känna att de har framgång och gör framsteg mot slutmålet genom tydliga visuella bekräftelser.',
    recommendedAction: 'Om du har mer än 8 fält, dela upp i 2 eller 3 steg med en tydlig progressbar eller accordion.',
    tags: ['nng', 'nielsen norman', 'kognitiv belastning', 'chunking', 'formulär'],
    applicableCheckouts: ['2-steg', '3-steg']
  },
  {
    id: 'res-field-reduction',
    title: 'Fältreduktion: Minska formulärfält från 12 till 6 stycken',
    summary: 'Genom att ta bort fält som "Adressrad 2", "Företagsnamn (valfritt för privatpersoner)", "Telefon typ" och "Titel/Kön" minskar tidsåtgången i kassan med 45 sekunder.',
    category: 'fields',
    categoryLabel: 'Formulär & Fält',
    impactValue: '+26.2 % konverteringslyft',
    impactType: 'positive',
    impactPercentage: 26.2,
    source: 'Baymard Institute Form Usability Research',
    sourceYear: '2024',
    sourceUrl: 'https://baymard.com/blog/checkout-flow-average-form-fields',
    sampleSize: '250 000 form-submissions',
    keyTakeaway: 'Varje extra obligatoriskt formulärfält minskar konverteringen med i snitt 2.4 % på mobil.',
    recommendedAction: 'Dölj onödiga fält bakom "Lägg till företagsnamn" eller valfria länkar. Fråga endast efter data som krävs för frakt och betalning.',
    tags: ['formulärfält', 'mobil', 'tidsåtgång', 'friktion', 'baymard'],
    applicableCheckouts: ['alla']
  },
  {
    id: 'res-swish-top',
    title: 'Swish som förvald/översta betalmetod i Sverige',
    summary: 'I Sverige föredrar över 75 % av konsumenterna Swish på mobila enheter. När Swish placeras överst eller som default ökar snabbheten och köpen slutförs direkt via BankID.',
    category: 'payment',
    categoryLabel: 'Betalmetoder',
    impactValue: '+9.4 % mobilkonvertering',
    impactType: 'positive',
    impactPercentage: 9.4,
    source: 'Getswish Årsrapport & E-barometern',
    sourceYear: '2025',
    sourceUrl: 'https://www.postnord.se/foretag/skicka/e-handel/e-barometern',
    sampleSize: 'Nationell svensk transaktionsdata',
    keyTakeaway: 'Att tvinga kunder att knappa in 16 kortnummer på mobiltelefonen är den största källan till tekniskt avhopp i steg 3.',
    recommendedAction: 'Sortera betalmetoder dynamiskt baserat på land och enhet: Swish först i SE på mobil, Vipps i NO, MobilePay i DK.',
    tags: ['swish', 'mobil', 'bankid', 'sverige', 'betalning'],
    applicableCheckouts: ['alla']
  },
  {
    id: 'res-express-wallets',
    title: 'Expresskassor (Apple Pay / Google Pay) före Steg 1',
    summary: 'Genom att erbjuda Apple Pay och Google Pay högst upp i kassan hoppar användaren över alla adressinmatningar med ett klick via FaceID.',
    category: 'mobile',
    categoryLabel: 'Mobiloptimering',
    impactValue: '+18.5 % slutförandegrad på iOS',
    impactType: 'positive',
    impactPercentage: 18.5,
    source: 'Stripe Global State of Checkout',
    sourceYear: '2025',
    sourceUrl: 'https://stripe.com/newsroom/news/state-of-checkouts',
    sampleSize: '5 miljoner sessioner',
    keyTakeaway: 'Över 50 % av alla e-handelsbesökare i Sverige använder en iPhone. Apple Pay eliminerar hela steg 1 och steg 2 på 4 sekunder.',
    recommendedAction: 'Placera express-knappar tydligt överst med rubriken "Eller snabbkassa".',
    tags: ['apple pay', 'google pay', 'express', 'faceid', 'ios', 'stripe'],
    applicableCheckouts: ['1-steg', '2-steg', '3-steg']
  },
  {
    id: 'res-shipping-transparency',
    title: 'Tidiga fraktkostnader minskar kassa-chock i sista steget',
    summary: '48 % av alla avbrutna köp sker på grund av att fraktkostnaden överraskar kunden i sista steget. Att visa beräknad frakt i steg 1 eller varukorgen eliminerar detta.',
    category: 'shipping',
    categoryLabel: 'Frakt & Logistik',
    impactValue: '-41 % kassa-avhopp (Abandonment)',
    impactType: 'positive',
    impactPercentage: 41.0,
    source: 'Baymard Institute Cart Abandonment Benchmark',
    sourceYear: '2024',
    sourceUrl: 'https://baymard.com/lists/cart-abandonment-rate',
    sampleSize: '35 000 tillfrågade e-handelskunder',
    keyTakeaway: 'Kunden godtar en fraktkostnad så länge den är känd i förväg. Dolda tillägg i sista steget upplevs som manipulation.',
    recommendedAction: 'Presentera fri frakt-mätare ("Handla för 120 kr till för fri frakt") och basfrakt redan i varukorgen och steg 1.',
    tags: ['frakt', 'kostnad', 'chock', 'transparens', 'avhopp', 'baymard'],
    applicableCheckouts: ['alla']
  },
  {
    id: 'res-step-dropoff-funnel',
    title: 'Var lämnar kunden kassan i flerstegsflöden? (Drop-off per steg)',
    summary: 'Statistisk analys av drop-off visar att: Steg 1 tappar 22 % (krav på registrering/långa formulär), Steg 2 tappar 38 % (fraktkostnader/lång leveranstid), Steg 3 tappar 14 % (saknad betalmetod/3D-Secure).',
    category: 'steps',
    categoryLabel: 'Stegarkitektur',
    impactValue: 'Fördela optimeringsresurserna rätt',
    impactType: 'neutral',
    impactPercentage: 0,
    source: 'Google Analytics 4 E-commerce Funnel Benchmark',
    sourceYear: '2025',
    sourceUrl: 'https://www.nngroup.com/articles/checkout-process/',
    sampleSize: '8 500 nätbutiker',
    keyTakeaway: 'Steg 2 (Frakt) är ofta den verkliga flaskhalsen i flerstegskassor, inte betalsteget.',
    recommendedAction: 'Lägg fokus på att optimera leveransvalen (tydliga datum, paketskåp som Instabox/Budbee) för störst hävstång.',
    tags: ['funnel', 'drop-off', 'flaskhals', 'steg 2', 'ga4'],
    applicableCheckouts: ['2-steg', '3-steg']
  },
  {
    id: 'res-address-autofill',
    title: 'Adress-autofill via Postnummer & Personnummer (Klarna/SPAR)',
    summary: 'I Norden är konsumenter vana vid att knappa in personnummer eller postnummer och få gatuadress och ort ifyllt på 0.2 sekunder.',
    category: 'fields',
    categoryLabel: 'Formulär & Fält',
    impactValue: '+17.4 % konverteringslyft i Norden',
    impactType: 'positive',
    impactPercentage: 17.4,
    source: 'Svea & Dintero Checkout Insight',
    sourceYear: '2025',
    sourceUrl: 'https://baymard.com/checkout-usability',
    sampleSize: '650 000 köp',
    keyTakeaway: 'Att skriva in gatuadress manuellt på en mobilskärm i kollektivtrafiken genererar stavfel och felaktiga leveranser.',
    recommendedAction: 'Integrera automatiskt postnummer-uppslag och valfritt personnummer- eller Klarna-autofill.',
    tags: ['autofill', 'postnummer', 'spar', 'klarna', 'personnummer'],
    applicableCheckouts: ['alla']
  },
  {
    id: 'res-accordion-steps',
    title: 'Accordion-steg (Utfällbara moduler) vs Separata sidor',
    summary: 'Accordion-kassor håller kunden på samma URL men expanderar ett steg i taget i takt med att föregående steg valideras.',
    category: 'steps',
    categoryLabel: 'Stegarkitektur',
    impactValue: '+6.1 % över separata omladdningar',
    impactType: 'positive',
    impactPercentage: 6.1,
    source: 'Shopify Checkout Extensibility Data',
    sourceYear: '2025',
    sourceUrl: 'https://www.shopify.com/enterprise/ecommerce-checkout',
    sampleSize: '2.4M transaktioner',
    keyTakeaway: 'Eliminerar laddtider mellan steg. Kunden ser alltid helheten och vad som återstår utan URL-omladdningar.',
    recommendedAction: 'Välj accordion-steg framför separata sidomladdningar vid headless- eller moderna SPA-arkitekturer.',
    tags: ['accordion', 'spa', 'laddtider', 'utfällbar', 'steg', 'shopify'],
    applicableCheckouts: ['2-steg', '3-steg']
  },
  {
    id: 'res-security-badges',
    title: 'Placering av säkerhetssymboler (BankID, SSL, Klarna, Visa)',
    summary: 'Säkerhetsikoner placerade i anslutning till slutknappen (CTA) ökar upplevd trygghet med 24 % bland förstagångskunder.',
    category: 'trust',
    categoryLabel: 'Förtroende & Säkerhet',
    impactValue: '+5.3 % konvertering för nya besökare',
    impactType: 'positive',
    impactPercentage: 5.3,
    source: 'Trustpilot & CXL Trust Benchmark',
    sourceYear: '2024',
    sourceUrl: 'https://cxl.com/research/',
    sampleSize: '180 000 köp',
    keyTakeaway: 'Mindre kända varumärken och nystartade e-handlare behöver "låna förtroende" från etablerade betalpartners.',
    recommendedAction: 'Visa BankID-symbolen och SSL/Krypterad anslutning-märke direkt under knappen "Slutför köp".',
    tags: ['trust', 'bankid', 'förtroende', 'säkerhet', 'trygghet', 'cxl'],
    applicableCheckouts: ['alla']
  },
  {
    id: 'res-eu-green-claims-ban',
    title: 'EU:s förbud mot miljökompenserad frakt (Direktiv 2024/825 & Green Claims)',
    summary: 'Från 2026 är det olagligt i EU att marknadsföra frakt som "klimatkompenserad", "klimatneutral" eller "CO2-kompenserad" baserat på utsläppskrediter utanför värdekedjan. Konsumentförtroendet för generiska gröna badges har rasat.',
    category: 'shipping',
    categoryLabel: 'Frakt & Logistik',
    impactValue: '-10 % konvertering vid felaktig certifiering',
    impactType: 'negative',
    impactPercentage: -10.0,
    source: 'EU-kommissionen & Konsumentverket (Empowering Consumers)',
    sourceYear: '2026',
    sourceUrl: 'https://commission.europa.eu/law/law-topic/consumer-protection-law_en',
    sampleSize: 'EU-direktiv 2024/825',
    keyTakeaway: 'Kompensationspåståenden (offsetting) anses vilseledande och medför bötesrisk upp till 4 % av omsättningen. Endast verifierad insetting (t.ex. DHL Send Green) eller Typ 1-märkningar (Svanenmärkt) är tillåtna.',
    recommendedAction: 'Ta omedelbart bort "Miljökompenserad frakt". Byt till Svanenmärkt e-handelstransport eller DHL Send Green och förklara vad drivmedlet består av.',
    tags: ['miljö', 'greenwashing', 'eu-direktiv', 'svanen', 'klimatkompensation', 'lagkrav'],
    applicableCheckouts: ['alla']
  },
  {
    id: 'res-dhl-send-green-insetting',
    title: 'DHL Send Green (tidigare Skicka Grönt) – Insetting istället för kompensation',
    summary: 'DHL döper om "Skicka Grönt" till "Send Green". Istället för otillåten klimatkompensation använder Send Green "insetting", där tilläggsavgiften investeras direkt i HVO100 biobränsle och tunga ellastbilar i DHL:s eget nätverk.',
    category: 'shipping',
    categoryLabel: 'Frakt & Logistik',
    impactValue: '+4.2 % CVR bland miljömedvetna kunder',
    impactType: 'positive',
    impactPercentage: 4.2,
    source: 'DHL Freight Sustainability & Smart Freight Centre',
    sourceYear: '2026',
    sourceUrl: 'https://www.dhl.com/se-sv/home/vara-divisioner/frakt/hallbarhet.html',
    sampleSize: 'Smart Freight Centre GLEC-verifiering',
    keyTakeaway: 'Insetting är godkänt enligt EU:s nya regler eftersom det de facto reducerar utsläpp inom logistikkedjan och är revisionsgranskat.',
    recommendedAction: 'Märk DHL med "Send Green (Fossilfri insetting)" och erbjud en förklarande text i kassan som belyser att investeringen sker i svenska fordon.',
    tags: ['dhl', 'send green', 'skicka grönt', 'insetting', 'hvo100', 'fossilfritt'],
    applicableCheckouts: ['alla']
  },
  {
    id: 'res-click-collect-first-step',
    title: 'Hämta i butik (Click & Collect) som första steg i kassan',
    summary: 'Genom att låta kunden välja butik med realtidslager i steg 1 elimineras 5 formulärfält (gatuadress, postnummer, ort, portkod). Kunden behöver endast ange namn och mobilnummer för SMS-avi.',
    category: 'steps',
    categoryLabel: 'Stegarkitektur',
    impactValue: '+14.6 % konvertering & 0 kr fraktkostnad',
    impactType: 'positive',
    impactPercentage: 14.6,
    source: 'PostNord E-barometern & Omnichannel Retail Index',
    sourceYear: '2025',
    sourceUrl: 'https://www.postnord.se/foretag/skicka/e-handel/e-barometern',
    sampleSize: 'Nordiska omnichannel-handlare',
    keyTakeaway: 'Click & Collect-kunder vill ha varan snabbt (ofta samma dag) och är extremt känsliga för onödig adressinmatning. Steg 1-butiksval ökar genomförandegraden markant.',
    recommendedAction: 'Erbjud en tydlig toggle i kassan: [Hemleverans / Ombud] vs [Hämta gratis i butik]. Vid butiksval döljs hemadressfälten omedelbart.',
    tags: ['click & collect', 'hämta i butik', 'butikslager', 'omnichannel', 'sms-avi'],
    applicableCheckouts: ['1-steg', '2-steg', '3-steg', 'accordion']
  }
];
