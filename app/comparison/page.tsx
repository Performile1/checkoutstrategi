'use client';

import React from 'react';
import { ComparisonTable } from '@/components/ComparisonTable';
import { useLanguage } from '@/lib/i18n/context';

export default function ComparisonPage() {
  const { isEnglish } = useLanguage();

  return (
    <section className="container-prose py-16">
      <div className="max-w-2xl">
        <p className="badge">{isEnglish ? 'Side-by-side' : 'Side-by-side'}</p>
        <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
          {isEnglish ? 'Comparison Table' : 'Jämförelsetabell'}
        </h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
          {isEnglish
            ? 'Select which providers to compare. The table updates dynamically and covers conversion impact, pricing, supported markets, features, and business models.'
            : 'Välj vilka aktörer du vill jämföra. Tabellen uppdateras live och täcker konverteringsimpact, pris, marknader, funktioner och affärsmodell.'}
        </p>
      </div>

      <div className="mt-10">
        <ComparisonTable />
      </div>
    </section>
  );
}
