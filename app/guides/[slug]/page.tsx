import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const guides: Record<string, { title: string; description: string; body: string[] }> = {
  'cro-checkout': {
    title: 'CRO i kassan – 12 optimeringsfaktorer som lyfter konvertering',
    description: 'Konkreta konverteringsvariabler och optimeringsfaktorer som bevisat fungerar i svenska kassaflöden.',
    body: [
      'Konvertering i kassan är sällan en enskild knapp – det är 12 små beslut och optimeringsfaktorer i följd. I den här guiden bryter vi ned varje variabel från varukorg till tack-sida och hur de förhåller sig till den beprövade LIFT-modellen.',
      '**LIFT-modellen i kassan (Chris Goward / WiderFunnel)**',
      'För att förstå *varför* en förändring flyttar konverteringen använder vi LIFT-modellen (Landing page and Conversion Improvement Framework). Modellen analyserar köpresan genom 6 centrala dimensioner:',
      '1. **Värdeerbjudande (Value Proposition):** Den centrala drivkraften i konverteringsekvationen. Är fördelarna med produkten och butiken större än priset och ansträngningen? I kassan handlar värdeerbjudandet om trygghet, snabb leverans och garantier.',
      '2. **Relevans (Relevance):** Matchar kassan kundens förväntningar och tidigare steg? (Pre-fill av känd information, lokala svenska betalsätt som Swish och BankID, relevant valuta).',
      '3. **Tydlighet (Clarity):** Är totalkostnad, leveransdag och nästa steg kristallklart kommunicerade? Tydlighet är ofta den enskilt mest underskattade variabeln – otydliga fraktvillkor skapar omedelbart avhopp.',
      '4. **Brådska (Urgency):** Varför ska köpet slutföras *just nu*? Autentiska tidsgränser (t.ex. "Beställ inom 42 min för utleverans idag") utan fula stressmönster.',
      '5. **Oro & Osäkerhet (Anxiety):** De mentala bromsklossarna. Saknas SSL- eller BankID-symboler? Är returpolicyn luddig? Oro dödar konvertering snabbare än högt pris.',
      '6. **Distraktion (Distraction):** Allt som drar fokus bort från slutförandeknappen. Sidomenyer, onödiga länkar och överflödiga banners i kassan ökar risken att kunden lämnar flödet.',
      '**De 12 viktigaste optimeringsfaktorerna för svenska kassaflöden**',
      '**1. Pre-fill så mycket som möjligt (Minskar Friktion & Ökar Relevans).** Postnummer, adress, telefonnummer – allt som kan hämtas från ID, BankID eller tidigare besök ska vara förifyllt. Sparar 20–45 sekunder per session och lyfter CVR med +2–4 %.',
      '**2. BNPL och välbekanta betalmetoder som default (Minskar Oro & Ökar Förtroende).** För svensk B2C är Klarna, Walley och Swish hygienfaktorer. Att placera dem överst eliminerar tröskeln att behöva plocka fram betalkortet.',
      '**3. Leveransval före betalning (Ökar Tydlighet & Relevans).** Ingrid och nShift visar att tydligt leveransval före betalning lyfter konvertering med 5–15 %. Kunden måste veta exakt hur och när varan anländer innan de öppnar plånboken.',
      '**4. Minimera fältkrav (Minskar Friktion).** Varje extra fält kostar 1–2 % konvertering. Fråga enbart om information som oundgängligen krävs för att slutföra transporten. Ett slimmat 3-fältsflöde (Click & Collect) slår alltid ett 9-fältsformulär.',
      '**5. Trust-signaler över veckningen (Minskar Oro).** BankID, SSL, Visa/Mastercard, Reco och Trustpilot. Gör dem synliga direkt utan scrollning så att säkerheten aldrig ifrågasätts.',
      '**6. Mobiloptimerade tangentbord (Minskar Friktion).** `inputmode="numeric"` för postnummer och personnummer, `type="email"` för e-post. En liten koddetalj som kapar mobilfriktion och förhindrar inmatningsfel.',
      '**7. Adressvalidering live (Minskar Friktion & Returer).** Direktkontroll mot folkbokförings- eller postnummerregister förhindrar felskrivningar, sparar kundtjänstkostnader och minskar returfrekvensen.',
      '**8. Progress-indikator vid 2+ steg (Ökar Tydlighet).** Om kassan har flera steg ska kunden veta exakt var de befinner sig. En tumregel: ingen kassa ska någonsin ha fler än tre steg om det inte rör sig om komplex B2B eller bilfinansiering.',
      '**9. Post-purchase upsell (Maximerar Värdeerbjudande utan friktion).** Placera merförsäljning och lojalitetserbjudanden på tack-sidan eller i uppföljande SMS (Walley Engage-stil). Detta maximerar ordervärdet utan att riskera grundköpet.',
      '**10. Spara kundens val (Ökar Relevans & Lojalitet).** Återkommande kunder ska inte behöva välja ombud eller betalsätt igen. Kassan ska automatiskt förvälja det skåp och det betalsätt kunden använde senast.',
      '**11. Tydlig returpolicy i kassan (Minskar Oro).** 14–30 dagars fri retur eller enkel QR-kod i butik ska framgå direkt i kassan, inte gömmas i footern. Tydlighet kring returer ökar tryggheten hos tveksamma förstagångskunder med upp till 24 %.',
      '**12. Mät allt (Datadriven analys).** Bygg trattanalys (funnel-analys) på mikrosteg – inte bara sessionsnivå. Mät fältavhopp, valideringsfel och tveksamhetstid (dwell time) för att veta exakt vilken variabel som läcker.',
    ],
  },
  'fraktvaljaren-kassans-flaskhals': {
    title: 'Fraktväljaren: Kassans verkliga flaskhals – Så lyfter du konverteringen 5–15%',
    description: 'Att driva en kassa utan ett optimerat leveranssteg innebär att du lämnar 5–15 % konvertering på bordet. Här är varför kassan läcker vid fraktvalet och de fyra optimeringarna som fixar det.',
    body: [
      'Många e-handlare lägger månader på att färgtesta CTA-knappar, fila på produkttexter och integrera flashiga betallösningar, men blundar för kassans verkliga flaskhals: fraktväljaren. Att driva en kassa utan ett optimerat leveranssteg innebär i praktiken att du lämnar 5–15 % konvertering rakt på bordet. För e-handel med fysiska varor är leveransupplevelsen idag den enskilt största CRO-variabeln du kan påverka.',
      'Kunder avbryter sällan köpet i sista steget för att de plötsligt ogillar produkten. De avbryter för att fraktsteget skapar friktion, osäkerhet eller valförlamning precis vid mållinjen.',
      '**Varför kassan läcker vid fraktvalet**',
      '- **Vaga tidsangivelser:** "1–3 arbetsdagar" tvingar kunden att räkna i huvudet och skapar tvivel.',
      '- **Överraskande kostnader:** Fraktavgifter som dyker upp först i sista steget dödar köpsuget snabbare än en kraschad checkout.',
      '- **Dålig ombudslogik:** Statiska listor eller tröga kartor som föreslår ett utlämningsställe på fel sida motorvägen.',
      '- **Valstress:** Att presentera sju likvärdiga fraktbolag utan tydlig hierarki leder till tvekan snarare än nöjdhet.',
      '**Fyra optimeringar med direkt effekt på konverteringen**',
      '**1. Gå från tidsintervall till exakta datum (+3.5 % CVR):** Byt ut generiska dagar mot "Levereras på torsdag". Att koppla lagrets cut-off-tid direkt till kundens postnummer tar bort all gissningslek.',
      '**2. Guidning genom märkning / Badging (+2.8 % CVR):** Hjälp kunden välja snabbt med enkla etiketter som *Snabbast*, *Mest populärt* eller *Fossilfritt*. Det halverar beslutstiden.',
      '**3. Postnummer-drivet flöde (+3.2 % CVR):** Låt kunden mata in postnumret tidigt för att omedelbart visa relevanta paketboxar och hemleveransalternativ som faktiskt fungerar för just deras adress.',
      '**4. Dynamisk fri frakt-mätare (+2.5 % CVR & +18 % AOV):** Visa tydligt hur nära kunden är fri frakt direkt i anslutning till leveransvalet. Det skyddar konverteringen och driver samtidigt upp snittordervärdet.',
      'Leveranssteget är inte en administrativ slutstation för logistikavdelningen – det är en avgörande del av säljtunneln. Genom att eliminera osäkerheten kring hur, när och till vilket pris varan når fram förvandlar du kassans största riskmoment till en ren intäktsdrivare.',
    ],
  },
  'delivery-experience': {
    title: 'Delivery Experience: konvertering genom leverans',
    description: 'Hur Ingrid, nShift, Wetail, Fraktjakt, Shipmondo, PostNord, DHL och Bring flyttar konvertering och när du ska välja vilken.',
    body: [
      'Leverans är det sista steget där köpare tappas – och det första där de formar återköpsintentionen.',
      '**Ingrid** är vassast för konsument-UX: smart leveransval, branded tracking, miljödata. Passar D2C-brands och mid-market e-handel.',
      '**nShift** dominerar vid enterprise-skala och komplex multi-carrier. Bredaste carrier-nätverk i Norden.',
      '**Wetail** fokuserar på logistik och leveransoptimering som integreras i befintlig checkout.',
      '**Fraktjakt** erbjuder jämförelse och bokning av frakt med ett fullskaligt TMS-system.',
      '**Shipmondo** är en fraktplattform med många integrationer till webshop-system.',
      '**PostNord** är Nordens ledande logistikaktör med checkout-lösningar och fokus på leveransval.',
      '**DHL** är en global logistikjätte med checkout-integrationer för internationell e-handel.',
      '**Bring** är en nordisk logistikaktör med e-handelslösningar och leveransfokus.',
      '**Key takeaway:** En checkout utan optimerat leveranssteg lämnar 5–15% konvertering på bordet. Det är i praktiken den största enskilda CRO-lever för fysisk-varor-e-handel idag.',
      'Kombinera gärna med Walley Engage eller motsvarande för post-purchase intäkt – då täcker du hela kedjan från varukorg till återköp.',
    ],
  },
  'one-click-future': {
    title: 'Framtiden för one-click checkout',
    description: 'Wallet-konvergens, passkeys och vad Apple/Google Pay betyder för svensk e-handel.',
    body: [
      'One-click checkout är inte längre en Amazon-feature. Klarna Express, Shop Pay, Apple Pay, Google Pay och Kustoms composable-UI konvergerar mot samma UX-mål: noll fält.',
      '**Passkeys** ersätter lösenord och gör 3DS friktionsfritt. Din checkout-leverantör måste supporta detta 2025.',
      '**Wallet-fragmentering** är fortfarande en utmaning. Valet står mellan att köra en lösning (Klarna) eller composera (Kustom + Apple/Google Pay + BNPL).',
      '**Svensk kontext:** Swish och BankID ger Sverige ett försprång i identifiering. Den som bygger "one-click med BankID" tar stor marknad.',
      'Slutsats: Investera i en checkout som låter dig plugga in nya wallets utan re-implementation. Det är därför headless (Kustom) växer.',
    ],
  },
  'checkout-analys-2026': {
    title: 'Checkoutanalys 2026: Micro-conversions, EU-regler och Benchmarks',
    description: 'Komplett guide till modern checkoutanalys med detaljerade mätpunkter, nya EU-regler för 2026 och uppdaterade branschbenchmarks.',
    body: [
      'För att göra er checkoutanalys mer detaljerad och anpassad efter moderna krav (som de nya EU-reglerna för 2026) bör ni bryta ner processen i specifika mätpunkter för varje steg. Genom att mäta "micro-conversions" mellan dessa steg kan ni se exakt var friktionen uppstår.',
      '**1. Detaljerad nedbrytning av steg (Datapunkter)**',
      'Följande mätetal bör spåras för att identifiera specifika flaskhalsar:',
      '<strong>Varukorg (Cart):</strong>',
      '- Andel som går vidare: Hur många klickar på "Till kassan"?',
      '- Interaktion med rabattkoder: Hur många hoppar av om koden inte fungerar eller om fältet är för dominant?',
      '<strong>Adress & Identifiering:</strong>',
      '- Formulärtid: Hur lång tid tar det att fylla i adressuppgifter (snitt bör vara under 2 minuter)?',
      '- Antal fält: <a href="https://baymard.com" target="_blank" rel="noopener">Baymard</a> rekommenderar max 8 fält för optimal konvertering.',
      '- Användning av Autofyll: Hur många använder Google/Browser-autofyll vs. skriver manuellt?',
      '<strong>Leveransväljare:</strong>',
      '- Val av fraktmetod: Vilket alternativ är mest populärt och orsakar specifika alternativ avhopp?',
      '- Leveranstid vs. Avhopp: Korrelation mellan långa leveranstider och avbrutna köp.',
      '<strong>Betalsätt:</strong>',
      '- Betalningsfel: Andel tekniska felmeddelanden per betalningsmetod.',
      '- Metodpreferens: Hur många avbryter om deras föredragna lokala metod saknas?',
      '**2. Nya EU-regler (Ångerknapp/Withdrawal Button)**',
      'Från och med 19 juni 2026 måste e-handlare följa skärpta regler enligt EU:s konsumenträttsdirektiv (Directive (EU) 2023/2673). Detta påverkar er analys direkt:',
      '- <strong>Synlighet för ångerknappen:</strong> Knappen måste vara "prominent placerad" och lättåtkomlig under hela ångerperioden (minst 14 dagar).',
      '- <strong>Etikettering:</strong> Den måste ha tydliga namn som "Ångra köp här" eller liknande; luddiga termer som "Se över avtal" är inte tillåtna.',
      '- <strong>Process för tvåklicks-ånger:</strong> Efter ett klick ska kunden landa på en sida för att bekräfta sina uppgifter, följt av en bekräftelseknapp ("Bekräfta ånger").',
      '- <strong>Analyspunkt:</strong> Mät hur många som använder denna digitala funktion jämfört med traditionell kundtjänstkontakt, då lagen kräver att det ska vara lika lätt att ångra ett köp som att genomföra det.',
      '**3. Tekniska och Beteendebaserade "Friction Points"**',
      'För att förstå varför folk lämnar, lägg till dessa moderna datapunkter:',
      '- <strong>Rage Clicks:</strong> Spåra när användare klickar upprepade gånger på element som inte svarar.',
      '- <strong>Valideringsfel:</strong> Vilka specifika fält (t.ex. personnummer eller postnummer) ger flest felmeddelanden?',
      '- <strong>Laddningstider (LCP):</strong> En fördröjning på bara 1 sekund kan sänka konverteringen märkbart. Spåra laddningstid specifikt för betalningsfönstret.',
      '- <strong>Gästutcheckning vs Konto:</strong> Hur stor andel väljer gästutcheckning? (Forcerat kontoskapande orsakar ca 26 % av alla avhopp).',
      '**4. Uppdaterade Benchmarks (2025–2026)**',
      '<strong>Bransch – Konverteringsgrad (Snitt 2025/26)</strong>',
      '- Mat & Dryck: ~6,02 %',
      '- Skönhet & Hälsa: ~4,89 %',
      '- Mode & Kläder: ~3,13 %',
      '- Hem & Möbler: ~1,46 %',
      '<strong>Viktig insikt:</strong> Enligt <a href="https://baymard.com" target="_blank" rel="noopener">Baymard Institute</a> (2026) har endast 2 % av de ledande e-handelsajterna en checkout som klassas som "bra" rent UX-mässigt, vilket innebär att det finns en enorm konkurrensfördel i att optimera dessa steg.',
      '**5. Hur dina checkout-leverantörer stödjer dessa mätpunkter**',
      'Många av de checkout- och logistiklösningar vi jämför på Checkoutstrategi har byggt funktioner för att spåra dessa micro-conversions:',
      '- <strong>Klarna</strong> och <strong>Walley</strong> erbjuder detaljerad funnel-analys via sina merchant-portaler.',
      '- <strong>Ingrid</strong> och <strong>nShift</strong> ger insikter kring leveransval och avhopp i leveranssteget.',
      '- <strong>Kustom</strong> (headless) låter dig bygga helt anpassad spårning för varje micro-conversion.',
      '- <strong>Shopify</strong> har inbyggd Shopify Analytics som kan kombineras med app-ekosystemet för djupare insikter.',
      'Genom att kombinera dessa mätpunkter med rätt checkout-leverantör kan du identifiera flaskhalsar och öka konverteringen markant.',
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(guides).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const g = guides[params.slug];
  if (!g) return {};
  return {
    title: g.title,
    description: g.description,
    alternates: { canonical: `/guides/${params.slug}` },
  };
}

export default function GuidePage({ params }: { params: { slug: string } }) {
  const g = guides[params.slug];
  if (!g) notFound();

  const stats = [
    { label: 'CRO-impact', value: '+18%', description: 'Genomsnittlig konverteringslyft vid byte av checkout' },
    { label: 'Logistik', value: '+12%', description: 'Kassa-konvertering med smart leveransval' },
    { label: 'Trust', value: '6/6', description: 'Aktörer analyserade med samma ramverk' },
  ];

  return (
    <article className="container-prose py-12">
      <Link href="/guides" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-brand-600">
        <ArrowLeft size={14} /> Alla guider
      </Link>
      <header className="mt-6">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{g.title}</h1>
        <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">{g.description}</p>
      </header>

      {params.slug === 'checkout-analys-2026' && (
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{stat.label}</p>
              <p className="mt-2 text-3xl font-bold text-brand-600">{stat.value}</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{stat.description}</p>
            </div>
          ))}
        </div>
      )}

      <div className="prose prose-slate dark:prose-invert mt-10 max-w-none">
        {g.body.map((p, i) => (
          <p key={i} dangerouslySetInnerHTML={{ __html: p.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />
        ))}
      </div>
    </article>
  );
}
