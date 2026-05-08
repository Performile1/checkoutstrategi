import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const guides: Record<string, { title: string; description: string; body: string[] }> = {
  'cro-checkout': {
    title: 'CRO i kassan – 12 levers som lyfter konvertering',
    description: 'Konkreta konverteringslevers som bevisat fungerat i svenska kassaflöden.',
    body: [
      'Konvertering i kassan är sällan en enskild knapp – det är 12 små beslut i följd. I den här guiden bryter vi ned varje steg från varukorg till tack-sida.',
      '**1. Pre-fill så mycket som möjligt.** Postnummer, adress, telefonnummer – allt som kan hämtas från ID eller tidigare besök ska vara förifyllt.',
      '**2. BNPL som default för svenska B2C.** Klarna/Walley/Qliro är signaler som minskar friction. Placera dem överst.',
      '**3. Leveransval före betalning.** Ingrid och nShift visar att tydligt leveransval före betalning lyfter konvertering 5–15%.',
      '**4. Minimera fältkrav.** Varje extra fält kostar 1–2% konvertering. Fråga bara om det som behövs för leveransen.',
      '**5. Trust-signaler över veckningen.** Reco, Trustpilot, betalmärken. Gör dem synliga utan att scrolla.',
      '**6. Mobiloptimerade tangentbord.** `inputmode="numeric"` för postnummer, `type="email"` för e-post.',
      '**7. Adressvalidering live.** Färre felkällor = färre returer = högre kundnöjdhet.',
      '**8. Progress-indikator vid 2+ steg.** Ingen kassa ska ha fler än tre steg.',
      '**9. Post-purchase upsell (Walley Engage-stil).** Intäkt utan friktion i huvudflödet.',
      '**10. Spara kundens val.** Nästa besök ska hoppa över val som redan gjorts.',
      '**11. Tydlig retur-policy i kassan.** Inte gömd i footern.',
      '**12. Mät allt.** Funnel-analys på steg, inte bara på sidor.',
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
