'use client';

import React from 'react';
import { PlayerCard } from '@/components/PlayerCard';
import type { Player } from '@/lib/players';
import { useLanguage } from '@/lib/i18n/context';

export function PlayersView({ players }: { players: Player[] }) {
  const { isEnglish } = useLanguage();
  const playerCount = players.length;
  const countText = isEnglish
    ? (playerCount === 1 ? '1 provider' : `${playerCount} providers`)
    : (playerCount === 1 ? 'En aktör' : `${playerCount} aktörer`);

  return (
    <section className="container-prose py-16">
      <div className="max-w-2xl">
        <p className="badge">Trust Layer</p>
        <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
          {isEnglish ? 'Checkout Providers' : 'Checkout Players'}
        </h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
          {isEnglish
            ? `${countText}, one unified benchmarking framework. We evaluate each provider just like an enterprise research firm – examining unit economics, conversion impact, and which e-commerce segment they truly win.`
            : `${countText}, en analysram. Vi värderar varje leverantör som en analystjänst gör – på affärslogik, konverteringsimpact och vilket segment de faktiskt vinner i.`}
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
