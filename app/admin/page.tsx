import Link from 'next/link';
import { Plus, FileText, Users, Settings } from 'lucide-react';
import type { Metadata } from 'next';
import { getAdminUser } from '@/lib/auth';
import { getStoredPlayers } from '@/lib/players-store';
import { getAllPosts } from '@/lib/blog';
import { getStoredReviews } from '@/lib/reviews-store';
import { AdminGuard } from '@/components/AdminGuard';
import { AdminLogoutButton } from '@/components/AdminLogoutButton';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Checkoutstrategi',
  description: 'Hantera recensioner, spelare och blogginlägg.',
  alternates: { canonical: '/admin' },
};

export default async function AdminPage() {
  const user = await getAdminUser();

  // Fetch real stats from stores safely
  const [playersList, postsList, reviewsList] = await Promise.all([
    getStoredPlayers().catch(() => []),
    Promise.resolve().then(() => getAllPosts()).catch(() => []),
    getStoredReviews().catch(() => []),
  ]);

  const playersCount = playersList?.length || 0;
  const postsCount = postsList?.length || 0;
  const reviewsCount = reviewsList?.length || 0;

  return (
    <AdminGuard serverAuthenticated={!!user} userEmail={user?.email}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        {/* Header */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="container-prose py-4 flex items-center justify-between">
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {user?.email || 'admin@checkoutstrategi.se'}
              </span>
              <AdminLogoutButton />
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
                title="Skapa blogginlägg"
                description="Skriv eller redigera blogginlägg"
                icon={<FileText size={18} />}
                href="/admin/blog/new"
              />
            </div>
          </div>
        </div>
      </div>
    </AdminGuard>
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
