import type { Metadata } from 'next';
import { players } from '@/lib/players';
import { PlayerCard } from '@/components/PlayerCard';

export const metadata: Metadata = {
  title: 'Checkout Players – jämför Klarna, Walley, Kustom, Qliro, Ingrid & nShift',
  description:
    'Oberoende analys av de viktigaste checkout- och leveransleverantörerna i Norden. Trust-cards, konverteringsvärderingar och affärslogik.',
  alternates: { canonical: '/players' },
};

export default function PlayersPage() {
  const playerCount = players.length;
  const countText = playerCount === 1 ? 'En aktör' : `${playerCount} aktörer`;

  return (
    <section className="container-prose py-16">
      <div className="max-w-2xl">
        <p className="badge">Trust Layer</p>
        <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">Checkout Players</h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
          {countText}, en analysram. Vi värderar varje leverantör som en analystjänst gör – på affärs­logik, konverterings­impact och vilket segment de faktiskt vinner i.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3 lg:grid-cols-3">
        {players.map((p, i) => (
          <PlayerCard key={p.slug} player={p} index={i} />
        ))}
      </div>
    </section>
  );
}
