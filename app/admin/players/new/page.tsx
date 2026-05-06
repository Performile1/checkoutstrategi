'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function NewPlayerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    slug: '',
    name: '',
    tagline: '',
    logo_url: '',
    website_url: '',
    brand_color: 'bg-pink-500',
    category: 'Checkout' as const,
    target_market: 'B2C' as const,
    conversion_impact: 7,
    trust_angle: '',
    pros: '',
    cons: '',
    key_features: '',
    pricing: '',
    countries: '',
    affiliate_url: '',
    description: '',
    faq: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.from('players').insert({
        slug: formData.slug,
        name: formData.name,
        tagline: formData.tagline,
        logo_url: formData.logo_url,
        website_url: formData.website_url,
        brand_color: formData.brand_color,
        category: formData.category,
        target_market: formData.target_market,
        conversion_impact: formData.conversion_impact,
        trust_angle: formData.trust_angle,
        pros: formData.pros.split('\n').filter(Boolean),
        cons: formData.cons.split('\n').filter(Boolean),
        key_features: formData.key_features.split('\n').filter(Boolean),
        pricing: formData.pricing,
        countries: formData.countries.split(',').map(c => c.trim()),
        affiliate_url: formData.affiliate_url,
        description: formData.description,
        faq: formData.faq.split('\n\n').map(block => {
          const [q, a] = block.split('\n');
          return { q: q?.replace(/^Q:\s*/i, '') || '', a: a?.replace(/^A:\s*/i, '') || '' };
        }).filter(f => f.q && f.a),
      });

      if (error) throw error;

      router.push('/admin/players');
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="container-prose py-4">
          <h1 className="text-xl font-bold">Lägg till ny player</h1>
        </div>
      </header>

      <div className="container-prose py-8">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
          {error && (
            <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="card space-y-4">
            <h2 className="text-lg font-semibold">Grundläggande info</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-2">Slug (URL-vänligt)</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Namn</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                required
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-2">Logo URL</label>
                <input
                  type="text"
                  value={formData.logo_url}
                  onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                  required
                  placeholder="/logos/klarna.png"
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Website URL</label>
                <input
                  type="text"
                  value={formData.website_url}
                  onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900"
                />
              </div>
            </div>
          </div>

          <div className="card space-y-4">
            <h2 className="text-lg font-semibold">Kategorisering</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="block text-sm font-medium mb-2">Kategori</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900"
                >
                  <option value="Checkout">Checkout</option>
                  <option value="BNPL">BNPL</option>
                  <option value="Logistics">Logistics</option>
                  <option value="Post-purchase">Post-purchase</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Målmarknad</label>
                <select
                  value={formData.target_market}
                  onChange={(e) => setFormData({ ...formData, target_market: e.target.value as any })}
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900"
                >
                  <option value="B2C">B2C</option>
                  <option value="B2B">B2B</option>
                  <option value="B2B/B2C">B2B/B2C</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Konverteringsimpact (1-10)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.conversion_impact}
                  onChange={(e) => setFormData({ ...formData, conversion_impact: parseInt(e.target.value) })}
                  required
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Trust angle</label>
              <input
                type="text"
                value={formData.trust_angle}
                onChange={(e) => setFormData({ ...formData, trust_angle: e.target.value })}
                required
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900"
              />
            </div>
          </div>

          <div className="card space-y-4">
            <h2 className="text-lg font-semibold">Funktioner & Pris</h2>
            <div>
              <label className="block text-sm font-medium mb-2">Pros (en per rad)</label>
              <textarea
                value={formData.pros}
                onChange={(e) => setFormData({ ...formData, pros: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Cons (en per rad)</label>
              <textarea
                value={formData.cons}
                onChange={(e) => setFormData({ ...formData, cons: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Nyckelfunktioner (en per rad)</label>
              <textarea
                value={formData.key_features}
                onChange={(e) => setFormData({ ...formData, key_features: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Pris</label>
              <input
                type="text"
                value={formData.pricing}
                onChange={(e) => setFormData({ ...formData, pricing: e.target.value })}
                required
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Länder (kommaseparerad)</label>
              <input
                type="text"
                value={formData.countries}
                onChange={(e) => setFormData({ ...formData, countries: e.target.value })}
                placeholder="SE, NO, DK, FI"
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900"
              />
            </div>
          </div>

          <div className="card space-y-4">
            <h2 className="text-lg font-semibold">Länkar & Beskrivning</h2>
            <div>
              <label className="block text-sm font-medium mb-2">Affiliate URL</label>
              <input
                type="text"
                value={formData.affiliate_url}
                onChange={(e) => setFormData({ ...formData, affiliate_url: e.target.value })}
                required
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Beskrivning</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                required
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">FAQ (Q: fråga\nA: svar, separera par med tom rad)</label>
              <textarea
                value={formData.faq}
                onChange={(e) => setFormData({ ...formData, faq: e.target.value })}
                rows={6}
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Sparar...' : 'Spara player'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-secondary"
            >
              Avbryt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
