import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Check, X, ExternalLink, ArrowLeft, Star, Globe } from 'lucide-react';
import { getPlayer, getPlayerSlugs, players } from '@/lib/players';
import { siteConfig } from '@/lib/site';

export function generateStaticParams() {
  return getPlayerSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const player = getPlayer(params.slug);
  if (!player) return {};
  const title = `${player.name} – Recension, för- och nackdelar & konverteringsanalys`;
  const description = `${player.tagline} Oberoende analys av ${player.name}: trust angle, key features, prismodell och hur den påverkar konverteringen.`;
  return {
    title,
    description,
    alternates: { canonical: `/players/${player.slug}` },
    openGraph: { title, description, type: 'article' },
  };
}

export default function PlayerPage({ params }: { params: { slug: string } }) {
  const player = getPlayer(params.slug);
  if (!player) notFound();

  const reviewJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'SoftwareApplication',
      name: player.name,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
    },
    author: { '@type': 'Organization', name: siteConfig.name },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: player.conversionImpact,
      bestRating: 10,
      worstRating: 1,
    },
    reviewBody: player.description,
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: player.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <article className="container-prose py-12">
      <Link href="/players" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-brand-600">
        <ArrowLeft size={14} /> Alla players
      </Link>

      <header className="mt-6 flex flex-wrap items-start justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white ring-1 ring-slate-200 overflow-hidden dark:bg-slate-900 dark:ring-slate-700">
            <Image
              src={player.logoUrl}
              alt={`${player.name} logo`}
              width={56}
              height={56}
              className="h-12 w-12 object-contain"
              unoptimized
            />
          </div>
          <div>
            <p className="text-sm text-slate-500">{player.category} · {player.targetMarket}</p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{player.name}</h1>
            <p className="mt-1 text-slate-600 dark:text-slate-400">{player.tagline}</p>
            <a
              href={player.websiteUrl}
              target="_blank"
              rel="noopener"
              className="mt-2 inline-flex items-center gap-1 text-xs text-slate-500 hover:text-brand-600"
            >
              <Globe size={12} /> {player.websiteUrl.replace(/^https?:\/\//, '')}
            </a>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="badge text-base"><Star size={14} className="mr-1" /> {player.conversionImpact}/10 konvertering</span>
          <a href={player.affiliateUrl} target="_blank" rel="sponsored noopener" className="btn-primary">
            Besök {player.name} <ExternalLink size={14} />
          </a>
        </div>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-10">
          <section className="prose prose-slate dark:prose-invert max-w-none">
            <h2>Vår analys</h2>
            <p>{player.description}</p>
          </section>

          <section className="grid gap-6 md:grid-cols-2">
            <div className="card">
              <h3 className="font-semibold flex items-center gap-2 text-emerald-600"><Check size={18} /> Pros</h3>
              <ul className="mt-3 space-y-2 text-sm">
                {player.pros.map((p) => <li key={p} className="flex gap-2"><Check size={16} className="text-emerald-500 shrink-0 mt-0.5" /><span>{p}</span></li>)}
              </ul>
            </div>
            <div className="card">
              <h3 className="font-semibold flex items-center gap-2 text-rose-600"><X size={18} /> Cons</h3>
              <ul className="mt-3 space-y-2 text-sm">
                {player.cons.map((c) => <li key={c} className="flex gap-2"><X size={16} className="text-rose-500 shrink-0 mt-0.5" /><span>{c}</span></li>)}
              </ul>
            </div>
          </section>

          <section className="card">
            <h3 className="font-semibold">Nyckelfunktioner</h3>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2 text-sm">
              {player.keyFeatures.map((f) => (
                <li key={f} className="flex gap-2 items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-500" /> {f}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight">FAQ</h2>
            <div className="mt-4 space-y-3">
              {player.faq.map((f) => (
                <details key={f.q} className="card">
                  <summary className="cursor-pointer font-semibold">{f.q}</summary>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          {player.reviews && player.reviews.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold tracking-tight">Recensioner</h2>
              <div className="mt-4 space-y-4">
                {player.reviews.map((review, index) => (
                  <div key={index} className="card">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}
                              />
                            ))}
                          </div>
                          <span className="font-semibold">{review.title}</span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{review.content}</p>
                        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                          <span>{review.reviewerName}</span>
                          {review.reviewerCompany && (
                            <>
                              <span>·</span>
                              <span>{review.reviewerCompany}</span>
                            </>
                          )}
                          {review.webshopUrl && (
                            <>
                              <span>·</span>
                              <a
                                href={review.webshopUrl}
                                target="_blank"
                                rel="noopener"
                                className="text-brand-600 hover:underline"
                              >
                                {new URL(review.webshopUrl).hostname}
                              </a>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-6">
          <div className="card">
            <h3 className="font-semibold">Snabbfakta</h3>
            <dl className="mt-3 space-y-3 text-sm">
              <Fact label="Trust angle" value={player.trustAngle} />
              <Fact label="Pris" value={player.pricing} />
              <Fact label="Marknader" value={player.countries.join(', ')} />
              <Fact label="Kategori" value={player.category} />
              <Fact label="Mål" value={player.targetMarket} />
            </dl>
          </div>

          <div className="card">
            <h3 className="font-semibold">Liknande aktörer</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {players.filter((p) => p.slug !== player.slug && p.category === player.category).map((p) => (
                <li key={p.slug}>
                  <Link href={`/players/${p.slug}`} className="text-brand-600 hover:underline">{p.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </article>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}
