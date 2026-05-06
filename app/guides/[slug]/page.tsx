import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const guides: Record<string, { title: string; description: string; body: string[] }> = {
  'cro-checkout': {
    title: 'CRO i kassan – 12 spaks som lyfter konvertering',
    description: 'Konkreta konverteringsspaks som bevisat fungerar i svenska kassaflöden.',
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
    description: 'Hur Ingrid och nShift flyttar konvertering och när du ska välja vilken.',
    body: [
      'Leverans är det sista steget där köpare tappas – och det första där de formar återköpsintentionen.',
      '**Ingrid** är vassast för konsument-UX: smart leveransval, branded tracking, miljödata. Passar D2C-brands och mid-market e-handel.',
      '**nShift** dominerar vid enterprise-skala och komplex multi-carrier. Bredaste carrier-nätverk i Norden.',
      '**Key takeaway:** En checkout utan optimerat leveranssteg lämnar 5–15% konvertering på bordet. Det är i praktiken den största enskilda CRO-spaken för fysisk-varor-e-handel idag.',
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

  return (
    <article className="container-prose py-12">
      <Link href="/guides" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-brand-600">
        <ArrowLeft size={14} /> Alla guider
      </Link>
      <header className="mt-6">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{g.title}</h1>
        <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">{g.description}</p>
      </header>
      <div className="prose prose-slate dark:prose-invert mt-10 max-w-none">
        {g.body.map((p, i) => (
          <p key={i} dangerouslySetInnerHTML={{ __html: p.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />
        ))}
      </div>
    </article>
  );
}
