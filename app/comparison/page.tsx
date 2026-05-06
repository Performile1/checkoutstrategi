import type { Metadata } from 'next';
import { ComparisonTable } from '@/components/ComparisonTable';

export const metadata: Metadata = {
  title: 'Jämförelsetabell – Klarna vs Walley vs Kustom vs Qliro vs Ingrid vs nShift',
  description:
    'Side-by-side jämförelse av Sveriges viktigaste checkout- och leveransplattformar. Konverteringsbetyg, prismodell, marknader och nyckelfunktioner.',
  alternates: { canonical: '/comparison' },
};

export default function ComparisonPage() {
  return (
    <section className="container-prose py-16">
      <div className="max-w-2xl">
        <p className="badge">Side-by-side</p>
        <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">Jämförelsetabell</h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
          Välj vilka aktörer du vill jämföra. Tabellen uppdateras live och täcker konverterings­impact, pris, marknader, funktioner och affärsmodell.
        </p>
      </div>

      <div className="mt-10">
        <ComparisonTable />
      </div>
    </section>
  );
}
