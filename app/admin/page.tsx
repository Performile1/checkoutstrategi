import { redirect } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { Plus, FileText, Users, LogOut, Settings } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Checkoutstrategi',
  description: 'Hantera recensioner, spelare och blogginlägg.',
  alternates: { canonical: '/admin' },
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function AdminPage() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.user_metadata?.role !== 'admin') {
    redirect('/admin/login');
  }

  // Fetch stats
  const [{ count: playersCount }, { count: postsCount }, { count: reviewsCount }] = await Promise.all([
    supabase.from('players').select('*', { count: 'exact', head: true }),
    supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
    supabase.from('reviews').select('*', { count: 'exact', head: true }),
  ]);

  const handleLogout = async () => {
    'use server';
    // This will be handled by a client component
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="container-prose py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {user?.email}
            </span>
            <form action="/api/auth/logout" method="POST">
              <button type="submit" className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100">
                <LogOut size={16} /> Logga ut
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="container-prose py-8">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <StatCard
            title="Players"
            count={playersCount || 0}
            icon={<Users size={20} />}
            href="/admin/players"
          />
          <StatCard
            title="Blogginlägg"
            count={postsCount || 0}
            icon={<FileText size={20} />}
            href="/admin/blog"
          />
          <StatCard
            title="Reviews"
            count={reviewsCount || 0}
            icon={<Settings size={20} />}
            href="/admin/reviews"
          />
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Snabbåtgärder</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <QuickAction
              title="Lägg till ny player"
              description="Skapa en ny checkout-aktör"
              icon={<Plus size={18} />}
              href="/admin/players/new"
            />
            <QuickAction
              title="Kör blogg-automation"
              description="Generera AI-blogginlägg från RSS"
              icon={<FileText size={18} />}
              href="/admin/blog/generate"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, count, icon, href }: { title: string; count: number; icon: React.ReactNode; href: string }) {
  return (
    <Link href={href} className="card group hover:border-brand-500 transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-600 dark:text-slate-400">{title}</p>
          <p className="text-3xl font-bold mt-2">{count}</p>
        </div>
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-600 dark:group-hover:bg-brand-950 dark:group-hover:text-brand-400 transition">
          {icon}
        </div>
      </div>
    </Link>
  );
}

function QuickAction({ title, description, icon, href }: { title: string; description: string; icon: React.ReactNode; href: string }) {
  return (
    <Link href={href} className="flex items-start gap-4 p-4 border border-slate-200 dark:border-slate-800 rounded-lg hover:border-brand-500 transition">
      <div className="p-2 bg-brand-50 dark:bg-brand-950 rounded-lg text-brand-600 dark:text-brand-400 shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{description}</p>
      </div>
    </Link>
  );
}
