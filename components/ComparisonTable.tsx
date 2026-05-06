'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Check, X, ExternalLink } from 'lucide-react';
import { players, type Player } from '@/lib/players';

const CATEGORIES: (keyof Player & string)[] = ['Checkout', 'Betallösning', 'Transportör', 'E-handelsplattform', 'Plugin'];

export function ComparisonTable({ initial }: { initial?: string[] }) {
  const [selected, setSelected] = useState<string[]>(initial || players.map((p) => p.slug));

  const toggle = (slug: string) => {
    setSelected((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const compared: Player[] = useMemo(
    () => players.filter((p) => selected.includes(p.slug)),
    [selected]
  );

  // Group players by category
  const categoryGroups = useMemo(() => {
    const groups: Record<string, Player[]> = {};
    CATEGORIES.forEach((cat) => {
      groups[cat] = compared.filter((p) => p.category === cat);
    });
    return groups;
  }, [compared]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {players.map((p) => {
          const active = selected.includes(p.slug);
          return (
            <button
              key={p.slug}
              onClick={() => toggle(p.slug)}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                active
                  ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300'
                  : 'border-slate-200 text-slate-600 hover:border-slate-400 dark:border-slate-700 dark:text-slate-400'
              }`}
            >
              {active ? <Check size={12} /> : <X size={12} />} {p.name}
            </button>
          );
        })}
      </div>

      {CATEGORIES.map((category) => {
        const categoryPlayers = categoryGroups[category];
        if (categoryPlayers.length === 0) return null;

        return (
          <div key={category} className="space-y-4">
            <h3 className="font-semibold text-lg">{category}</h3>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-4 text-left font-semibold w-40">Attribut</th>
                    {categoryPlayers.map((p) => (
                      <th key={p.slug} className="p-4 text-left font-semibold">{p.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {/* Översikt */}
                  <tr>
                    <td className="p-4 align-top font-medium text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-900/40">Trust angle</td>
                    {categoryPlayers.map((p) => (
                      <td key={p.slug} className="p-4 align-top">{p.trustAngle}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 align-top font-medium text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-900/40">Målmarknad</td>
                    {categoryPlayers.map((p) => (
                      <td key={p.slug} className="p-4 align-top">{p.targetMarket}</td>
                    ))}
                  </tr>

                  {/* Konvertering & Pris */}
                  <tr>
                    <td className="p-4 align-top font-medium text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-900/40">Konverteringsimpact</td>
                    {categoryPlayers.map((p) => (
                      <td key={p.slug} className="p-4 align-top">
                        <span className="inline-flex items-center gap-2">
                          <span className="font-semibold">{p.conversionImpact}/10</span>
                          <span className="h-1.5 w-20 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                            <span className="block h-full bg-brand-500" style={{ width: `${p.conversionImpact * 10}%` }} />
                          </span>
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 align-top font-medium text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-900/40">Pris</td>
                    {categoryPlayers.map((p) => (
                      <td key={p.slug} className="p-4 align-top">{p.pricing}</td>
                    ))}
                  </tr>

                  {/* Marknad */}
                  <tr>
                    <td className="p-4 align-top font-medium text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-900/40">Länder</td>
                    {categoryPlayers.map((p) => (
                      <td key={p.slug} className="p-4 align-top">{p.countries.join(', ')}</td>
                    ))}
                  </tr>

                  {/* Nyckelfunktioner */}
                  <tr>
                    <td className="p-4 align-top font-medium text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-900/40">Nyckelfunktioner</td>
                    {categoryPlayers.map((p) => (
                      <td key={p.slug} className="p-4 align-top">
                        <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-400">
                          {p.keyFeatures.slice(0, 4).map((f) => <li key={f}>{f}</li>)}
                        </ul>
                      </td>
                    ))}
                  </tr>

                  {/* Länkar */}
                  <tr>
                    <td className="p-4 align-top font-medium text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-900/40">Affiliate</td>
                    {categoryPlayers.map((p) => (
                      <td key={p.slug} className="p-4 align-top">
                        <a
                          href={p.affiliateUrl}
                          target="_blank"
                          rel="sponsored noopener"
                          className="inline-flex items-center gap-1 text-brand-600 hover:underline"
                        >
                          Besök <ExternalLink size={12} />
                        </a>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}
