'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink, Shield, Star } from 'lucide-react';
import type { Player, Review } from '@/lib/players';

function getAverageRating(reviews: Review[]): number {
  if (reviews.length === 0) return 0;
  return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
}

export function PlayerCard({ player, index = 0 }: { player: Player; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="card group flex flex-col"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-white ring-1 ring-slate-200 overflow-hidden dark:bg-slate-900 dark:ring-slate-700">
            <Image
              src={player.logoUrl}
              alt={`${player.name} logo`}
              width={40}
              height={40}
              className="h-9 w-9 object-contain"
              unoptimized
            />
          </div>
          <div>
            <h3 className="font-semibold text-lg leading-tight">{player.name}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{player.category} · {player.targetMarket}</p>
          </div>
        </div>
        <span className="badge"><Star size={12} className="mr-1" /> {player.conversionImpact}/10</span>
      </div>

      <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">{player.tagline}</p>

      <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
        <Shield size={14} /> <span>Trust angle: <strong className="text-slate-700 dark:text-slate-300">{player.trustAngle}</strong></span>
      </div>

      {player.reviews && player.reviews.length > 0 && (
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
          <Star size={14} className="fill-yellow-400 text-yellow-400" />
          <span>
            {player.reviews.length} recension{player.reviews.length > 1 ? 'er' : ''}
            {' '}· {getAverageRating(player.reviews).toFixed(1)}/5
          </span>
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-1.5">
        {player.keyFeatures.slice(0, 3).map((f) => (
          <span key={f} className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {f}
          </span>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <Link href={`/players/${player.slug}`} className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 group-hover:gap-2 transition-all">
          Läs analys <ArrowRight size={14} />
        </Link>
        <a
          href={player.websiteUrl}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-brand-600"
        >
          Webbplats <ExternalLink size={11} />
        </a>
      </div>
    </motion.div>
  );
}
