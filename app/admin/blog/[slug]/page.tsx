'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function EditBlogPostPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    description: '',
    date: '',
    author: '',
    tags: '',
    cover: '',
    content: '',
  });

  useEffect(() => {
    loadPost();
  }, [params.slug]);

  const loadPost = async () => {
    try {
      const response = await fetch(`/api/admin/blog/${params.slug}`);
      if (!response.ok) throw new Error('Failed to load post');
      
      const post = await response.json();
      setFormData({
        slug: post.slug,
        title: post.title,
        description: post.description,
        date: post.date ? post.date.split('T')[0] : '',
        author: post.author || '',
        tags: Array.isArray(post.tags) ? post.tags.join(', ') : '',
        cover: post.cover || '',
        content: post.content || '',
      });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/blog/${params.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: formData.slug,
          title: formData.title,
          description: formData.description,
          date: formData.date,
          author: formData.author,
          tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
          cover: formData.cover,
          content: formData.content,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update post');
      }

      router.push('/admin/blog');
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="container-prose py-4">
            <h1 className="text-xl font-bold">Redigera blogginlägg</h1>
          </div>
        </header>
        <div className="container-prose py-8">
          <p>Laddar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="container-prose py-4">
          <h1 className="text-xl font-bold">Redigera blogginlägg</h1>
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
                <label className="block text-sm font-medium mb-2">Datum</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Titel</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Beskrivning</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                required
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-2">Författare</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Tags (kommaseparerad)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="checkout, cro, e-handel"
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Cover image URL</label>
              <input
                type="text"
                value={formData.cover}
                onChange={(e) => setFormData({ ...formData, cover: e.target.value })}
                placeholder="/images/blog/cover.jpg"
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900"
              />
            </div>
          </div>

          <div className="card space-y-4">
            <h2 className="text-lg font-semibold">Innehåll</h2>
            <div>
              <label className="block text-sm font-medium mb-2">Innehåll (Markdown)</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={15}
                required
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 font-mono text-sm"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary"
            >
              {saving ? 'Sparar...' : 'Spara ändringar'}
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
