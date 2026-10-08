'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import { AdminGuard, getAdminAuthHeaders } from '@/components/AdminGuard';
import { ImageUploadField } from '@/components/ImageUploadField';
import { slugify } from '@/lib/slugify';

export default function NewBlogPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [slugLocked, setSlugLocked] = useState(false);
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    author: '',
    tags: '',
    cover: '',
    content: '',
  });

  const handleTitleChange = (newTitle: string) => {
    setFormData((prev) => ({
      ...prev,
      title: newTitle,
      slug: slugLocked ? prev.slug : slugify(newTitle),
    }));
  };

  const handleGenerateSlug = () => {
    if (formData.title) {
      setFormData((prev) => ({ ...prev, slug: slugify(prev.title) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const finalSlug = formData.slug.trim() || slugify(formData.title);
      if (!finalSlug) {
        throw new Error('Vänligen ange en titel eller slug.');
      }

      const authHeaders = getAdminAuthHeaders();
      const response = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify({
          slug: finalSlug,
          title: formData.title,
          description: formData.description,
          date: formData.date,
          author: formData.author || 'AI-analytikern',
          tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
          cover: formData.cover,
          content: formData.content,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Kunde inte skapa blogginlägget');
      }

      window.location.href = '/admin/blog';
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="container-prose py-4 flex items-center justify-between">
            <h1 className="text-xl font-bold">Nytt blogginlägg</h1>
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-secondary text-xs py-1.5 px-3"
            >
              Tillbaka
            </button>
          </div>
        </header>

        <div className="container-prose py-8">
          <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
            {error && (
              <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="card space-y-4">
              <h2 className="text-lg font-semibold">Grundläggande info</h2>

              <div>
                <label className="block text-sm font-medium mb-1.5">Titel</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="T.ex. Konverteringsanalys: Så optimerar du kassan 2026"
                  required
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-medium">Slug (skapas automatiskt)</label>
                    <button
                      type="button"
                      onClick={handleGenerateSlug}
                      className="text-xs text-brand-600 hover:underline inline-flex items-center gap-1"
                    >
                      <Sparkles size={11} /> Generera
                    </button>
                  </div>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => {
                      setSlugLocked(true);
                      setFormData({ ...formData, slug: e.target.value });
                    }}
                    placeholder="konverteringsanalys-sa-optimerar-du-kassan-2026"
                    required
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Genereras automatiskt från titeln med svenska tecken konverterade.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">Datum</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Beskrivning / Ingress</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  placeholder="Kort sammanfattning för läsaren och sökmotorer..."
                  required
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Författare</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="AI-analytikern"
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Tags (kommaseparerad)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="checkout, cro, e-handel"
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              {/* Cover Image Upload */}
              <ImageUploadField
                label="Omslagsbild (Cover Image)"
                value={formData.cover}
                onChange={(url) => setFormData((prev) => ({ ...prev, cover: url }))}
                type="cover"
                placeholder="/images/blog/cover.jpg eller klistra in URL"
                helperText="Ladda upp från datorn eller ange bildlänk"
              />
            </div>

            <div className="card space-y-4">
              <h2 className="text-lg font-semibold">Innehåll</h2>
              <div>
                <label className="block text-sm font-medium mb-1.5">Innehåll (Markdown)</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={15}
                  placeholder="Skriv inläggets text här i markdown..."
                  required
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary py-2.5 px-6"
              >
                {loading ? 'Sparar...' : 'Spara och publicera inlägg'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="btn-secondary py-2.5 px-4"
              >
                Avbryt
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminGuard>
  );
}
