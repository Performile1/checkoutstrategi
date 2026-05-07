import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { players } from '@/lib/players';

// Generate metadata for SEO
export const metadata: Metadata = {
  title: 'Walley vs Qliro - Jämförelse 2025 | Checkoutstrategi',
  description: 'Jämför Walley och Qliro som checkout-leverantörer. Se priser, funktioner, integrationer och recensioner för att hitta rätt lösning för din e-handel.',
  openGraph: {
    title: 'Walley vs Qliro - Jämförelse',
    description: 'Detaljerad jämförelse av Walley och Qliro för svenska e-handlare.',
    type: 'article',
  },
  alternates: {
    canonical: 'https://checkoutstrategi.se/compare/walley-vs-qliro',
  },
};

export default function WalleyVsQliroPage() {
  const player1 = players.find(p => p.slug === 'walley');
  const player2 = players.find(p => p.slug === 'qliro');

  if (!player1 || !player2) {
    notFound();
  }

  const comparisonData = {
    pricing: {
      player1: player1.pricing || 'Kontakta för pris',
      player2: player2.pricing || 'Kontakta för pris',
    },
    features: {
      player1: player1.keyFeatures || [],
      player2: player2.keyFeatures || [],
    },
    platforms: {
      player1: player1.platforms || [],
      player2: player2.platforms || [],
    },
    conversionImpact: {
      player1: player1.conversionImpact || 5,
      player2: player2.conversionImpact || 5,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Walley vs Qliro
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            En detaljerad jämförelse av två ledande checkout-leverantörer för svenska e-handlare.
            Vi jämför priser, funktioner, integrationer och konverteringspåverkan.
          </p>
        </div>

        {/* Quick Comparison Table */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Snabbjämförelse</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Kriterium</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-brand-600 dark:text-brand-400 mb-2">{player1.name}</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-brand-600 dark:text-brand-400 mb-2">{player2.name}</div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded">
              <div className="font-medium text-slate-900 dark:text-slate-100">Pris</div>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded text-center">
              <div className="text-slate-700 dark:text-slate-300">{comparisonData.pricing.player1}</div>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded text-center">
              <div className="text-slate-700 dark:text-slate-300">{comparisonData.pricing.player2}</div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded">
              <div className="font-medium text-slate-900 dark:text-slate-100">Konverteringspåverkan</div>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded text-center">
              <div className={`font-semibold ${comparisonData.conversionImpact.player1 > comparisonData.conversionImpact.player2 ? 'text-green-600' : 'text-slate-700 dark:text-slate-300'}`}>
                {comparisonData.conversionImpact.player1}/10
              </div>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded text-center">
              <div className={`font-semibold ${comparisonData.conversionImpact.player2 > comparisonData.conversionImpact.player1 ? 'text-green-600' : 'text-slate-700 dark:text-slate-300'}`}>
                {comparisonData.conversionImpact.player2}/10
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded">
              <div className="font-medium text-slate-900 dark:text-slate-100">Länder</div>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded text-center">
              <div className="text-sm text-slate-700 dark:text-slate-300">{player1.countries.join(', ')}</div>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded text-center">
              <div className="text-sm text-slate-700 dark:text-slate-300">{player2.countries.join(', ')}</div>
            </div>
          </div>
        </div>

        {/* Detailed Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Player 1 */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">{player1.name}</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">{player1.description}</p>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Funktioner</h4>
                <ul className="space-y-1">
                  {comparisonData.features.player1.length > 0 ? (
                    comparisonData.features.player1.map((feature, idx) => (
                      <li key={idx} className="text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-brand-600 rounded-full" />
                        {feature}
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-slate-500">Inga funktioner angivna</li>
                  )}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Plattformar</h4>
                <div className="flex flex-wrap gap-2">
                  {comparisonData.platforms.player1.length > 0 ? (
                    comparisonData.platforms.player1.map((platform, idx) => (
                      <span key={idx} className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-xs text-slate-700 dark:text-slate-300">
                        {platform}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-slate-500">Inga plattformar angivna</span>
                  )}
                </div>
              </div>
            </div>

            <Link href={`/players/${player1.slug}`} className="btn-primary mt-6 block text-center">
              Läs mer om {player1.name}
            </Link>
          </div>

          {/* Player 2 */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">{player2.name}</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">{player2.description}</p>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Funktioner</h4>
                <ul className="space-y-1">
                  {comparisonData.features.player2.length > 0 ? (
                    comparisonData.features.player2.map((feature, idx) => (
                      <li key={idx} className="text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-brand-600 rounded-full" />
                        {feature}
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-slate-500">Inga funktioner angivna</li>
                  )}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Plattformar</h4>
                <div className="flex flex-wrap gap-2">
                  {comparisonData.platforms.player2.length > 0 ? (
                    comparisonData.platforms.player2.map((platform, idx) => (
                      <span key={idx} className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-xs text-slate-700 dark:text-slate-300">
                        {platform}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-slate-500">Inga plattformar angivna</span>
                  )}
                </div>
              </div>
            </div>

            <Link href={`/players/${player2.slug}`} className="btn-primary mt-6 block text-center">
              Läs mer om {player2.name}
            </Link>
          </div>
        </div>

        {/* Recommendation */}
        <div className="bg-gradient-to-r from-brand-50 to-brand-100 dark:from-brand-950 dark:to-brand-900 rounded-xl shadow-lg border border-brand-200 dark:border-brand-800 p-6 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">Vår rekommendation</h2>
          <div className="text-slate-700 dark:text-slate-300">
            {comparisonData.conversionImpact.player1 > comparisonData.conversionImpact.player2 ? (
              <p>
                Baserat på vår analys rekommenderar vi <strong>{player1.name}</strong> för högre konverteringsgrad.
                {player1.name} har ett högre trust-score ({comparisonData.conversionImpact.player1}/10) jämfört med {player2.name} ({comparisonData.conversionImpact.player2}/10),
                vilket kan leda till betydligt bättre konvertering för din e-handel.
              </p>
            ) : comparisonData.conversionImpact.player2 > comparisonData.conversionImpact.player1 ? (
              <p>
                Baserat på vår analys rekommenderar vi <strong>{player2.name}</strong> för högre konverteringsgrad.
                {player2.name} har ett högre trust-score ({comparisonData.conversionImpact.player2}/10) jämfört med {player1.name} ({comparisonData.conversionImpact.player1}/10),
                vilket kan leda till betydligt bättre konvertering för din e-handel.
              </p>
            ) : (
              <p>
                Båda leverantörerna har likvärdiga trust-scores ({comparisonData.conversionImpact.player1}/10).
                Vi rekommenderar att du väljer baserat på dina specifika behov gällande priser, integrationer och funktioner.
              </p>
            )}
          </div>
        </div>

        {/* Back to all comparisons */}
        <div className="text-center">
          <Link href="/comparison" className="text-brand-600 dark:text-brand-400 hover:underline">
            ← Tillbaka till alla jämförelser
          </Link>
        </div>
      </div>
    </div>
  );
}
