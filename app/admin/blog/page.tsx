import { redirect } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { Plus, Edit, Trash2, Calendar } from 'lucide-react';
import { getAllPosts } from '@/lib/blog';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hantera Blogginlägg - Admin Dashboard',
  description: 'Skapa, redigera och ta bort blogginlägg.',
  alternates: { canonical: '/admin/blog' },
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function AdminBlogPage() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.user_metadata?.role !== 'admin') {
    redirect('/admin/login');
  }

  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="container-prose py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100">
              ← Tillbaka
            </Link>
            <h1 className="text-xl font-bold">Blogginlägg</h1>
          </div>
          <Link
            href="/admin/blog/new"
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus size={16} /> Nytt inlägg
          </Link>
        </div>
      </header>

      <div className="container-prose py-8">
        {posts.length > 0 ? (
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="text-left p-4 font-semibold">Titel</th>
                  <th className="text-left p-4 font-semibold">Datum</th>
                  <th className="text-left p-4 font-semibold">Slug</th>
                  <th className="text-right p-4 font-semibold">Åtgärder</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {posts.map((post) => (
                  <tr key={post.slug}>
                    <td className="p-4 font-medium">{post.title}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <Calendar size={12} />
                        {new Date(post.date).toLocaleDateString('sv-SE')}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{post.slug}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/blog/${post.slug}`}
                          className="p-2 text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400"
                        >
                          <Edit size={16} />
                        </Link>
                        <form action={`/api/admin/blog/${post.slug}`} method="POST">
                          <input type="hidden" name="_method" value="DELETE" />
                          <button
                            type="submit"
                            className="p-2 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400"
                          >
                            <Trash2 size={16} />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="card text-center py-12">
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Inga blogginlägg än
            </p>
            <Link href="/admin/blog/new" className="btn-primary inline-flex items-center gap-2">
              <Plus size={16} /> Skapa första inlägget
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
