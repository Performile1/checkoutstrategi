import type { Metadata } from 'next';
import { getStoredPlayers } from '@/lib/players-store';
import { PlayersView } from '@/components/PlayersView';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Checkout Providers – compare Klarna, Walley, Kustom, Qliro, Ingrid & more',
  description:
    'Independent intelligence on leading checkout and delivery platforms. Trust-cards, conversion ratings, and unit economics.',
  alternates: { canonical: '/players' },
};

export default async function PlayersPage() {
  const players = await getStoredPlayers();
  return <PlayersView players={players} />;
}
