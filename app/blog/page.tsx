import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Calendar } from 'lucide-react';
import { getAllPosts } from '@/lib/blog';
import { NewsFeed } from '@/components/NewsFeed';

export const metadata: Metadata = {
  title: 'Blogg – Checkout, CRO & e-handelsanalyser',
  description: 'AI-driven nyhetsbevakning och djupanalyser om checkout, BNPL, leverans och konvertering.',
  alternates: { canonical: '/blog' },
};

export default function BlogPage() {
  const posts = getAllPosts();
  return (
    <section className="container-prose py-16">
      <div className="max-w-2xl">
        <p className="badge">Traffic Engine</p>
        <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">Blogg</h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
          Djupare analyser, AI-curated nyheter och konkreta CRO-spaks. Uppdateras dagligen via vår Python-pipeline.
        </p>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {posts.length === 0 && (
            <div className="card text-sm text-slate-500">
              Inga blogposts ännu. Kör <code>python scripts/generate_post.py</code> för att skapa din första post.
            </div>
          )}
          {posts.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="card block hover:border-brand-300 transition group">
              <p className="flex items-center gap-2 text-xs text-slate-500"><Calendar size={12} /> {new Date(p.date).toLocaleDateString('sv-SE')}</p>
              <h2 className="mt-2 text-xl font-bold group-hover:text-brand-600 transition">{p.title}</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{p.description}</p>
              <p className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-600">Läs mer <ArrowRight size={14} /></p>
            </Link>
          ))}
        </div>
        <aside>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Live: e-handelsnyheter</h3>
          <div className="mt-3">
            <NewsFeed limit={8} compact />
          </div>
        </aside>
      </div>
    </section>
  );
}
