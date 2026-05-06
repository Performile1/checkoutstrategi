'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Check, X, ExternalLink } from 'lucide-react';
import { players, type Player } from '@/lib/players';

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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Section 1: Översikt */}
        <TableSection
          title="Översikt"
          compared={compared}
          rows={[
            { label: 'Trust angle', cells: compared.map((p) => p.trustAngle) },
            { label: 'Kategori', cells: compared.map((p) => p.category) },
            { label: 'Målmarknad', cells: compared.map((p) => p.targetMarket) },
          ]}
        />

        {/* Section 2: Konvertering & Pris */}
        <TableSection
          title="Konvertering & Pris"
          compared={compared}
          rows={[
            {
              label: 'Konverterings­impact',
              cells: compared.map((p) => (
                <span className="inline-flex items-center gap-2">
                  <span className="font-semibold">{p.conversionImpact}/10</span>
                  <span className="h-1.5 w-20 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <span className="block h-full bg-brand-500" style={{ width: `${p.conversionImpact * 10}%` }} />
                  </span>
                </span>
              )),
            },
            { label: 'Pris', cells: compared.map((p) => p.pricing) },
          ]}
        />

        {/* Section 3: Marknad */}
        <TableSection
          title="Marknad"
          compared={compared}
          rows={[
            { label: 'Länder', cells: compared.map((p) => p.countries.join(', ')) },
          ]}
        />

        {/* Section 4: Funktioner */}
        <TableSection
          title="Nyckelfunktioner"
          compared={compared}
          rows={[
            {
              label: 'Funktioner',
              cells: compared.map((p) => (
                <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-400">
                  {p.keyFeatures.slice(0, 4).map((f) => <li key={f}>{f}</li>)}
                </ul>
              )),
            },
          ]}
        />

        {/* Section 5: Länkar */}
        <TableSection
          title="Länkar"
          compared={compared}
          rows={[
            {
              label: 'Affiliate',
              cells: compared.map((p) => (
                <a
                  href={p.affiliateUrl}
                  target="_blank"
                  rel="sponsored noopener"
                  className="inline-flex items-center gap-1 text-brand-600 hover:underline"
                >
                  Besök <ExternalLink size={12} />
                </a>
              )),
            },
          ]}
        />
      </div>
    </div>
  );
}

function TableSection({ title, compared, rows }: { title: string; compared: Player[]; rows: { label: string; cells: React.ReactNode[] }[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="bg-slate-50 dark:bg-slate-900 px-4 py-3 font-semibold text-sm border-b border-slate-200 dark:border-slate-800">
        {title}
      </div>
      <table className="w-full text-sm">
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
          {rows.map((row, i) => (
            <Row key={i} label={row.label} cells={row.cells} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Row({ label, cells }: { label: string; cells: React.ReactNode[] }) {
  return (
    <tr>
      <td className="p-4 align-top font-medium text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-900/40 w-40">{label}</td>
      {cells.map((c, i) => (
        <td key={i} className="p-4 align-top">{c}</td>
      ))}
    </tr>
  );
}
