import Link from 'next/link';
import { Plus, FileText, Users, Settings, Download, Database, ShieldCheck, CheckCircle2, Sliders, Compass } from 'lucide-react';
import type { Metadata } from 'next';
import { getAdminUser } from '@/lib/auth';
import { getStoredPlayers, getStoredPlayer } from '@/lib/players-store';
import { getStoredBuilds } from '@/lib/builds-store';
import { getAllPosts } from '@/lib/blog';
import { getStoredReviews } from '@/lib/reviews-store';
import { AdminGuard } from '@/components/AdminGuard';
import { AdminLogoutButton } from '@/components/AdminLogoutButton';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Checkoutstrategi',
  description: 'Hantera recensioner, spelare, byggen och blogginlägg.',
  alternates: { canonical: '/admin' },
};

export default async function AdminPage() {
  const user = await getAdminUser();

  // Fetch real stats from stores safely
  const [playersList, buildsList, postsList, reviewsList, dinteroPlayer] = await Promise.all([
    getStoredPlayers().catch(() => []),
    getStoredBuilds().catch(() => []),
    Promise.resolve().then(() => getAllPosts()).catch(() => []),
    getStoredReviews().catch(() => []),
    getStoredPlayer('dintero').catch(() => undefined),
  ]);

  const playersCount = playersList?.length || 0;
  const buildsCount = buildsList?.length || 0;
  const postsCount = postsList?.length || 0;
  const reviewsCount = reviewsList?.length || 0;
  const hasSupabase = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')
  );

  return (
    <AdminGuard serverAuthenticated={!!user} userEmail={user?.email}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        {/* Header */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="container-prose py-4 flex items-center justify-between">
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {user?.email || 'Inloggad administratör'}
              </span>
              <AdminLogoutButton />
            </div>
          </div>
        </header>

        <div className="container-prose py-8 space-y-6">
          {/* Databas & System Banner */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${hasSupabase ? 'bg-emerald-500 text-white' : 'bg-brand-600 text-white'}`}>
                <Database size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">
                    {hasSupabase ? 'Supabase Ansluten' : 'Datalager Aktivt'}
                  </span>
                  {dinteroPlayer && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                      <CheckCircle2 size={11} /> Dintero verifierad
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-500">
                  {hasSupabase
                    ? 'Direktkoppling mot Supabase PostgreSQL är aktiv.'
                    : 'Körs med lokalt datalager och serverless-cache. Klicka för att kontrollera eller ansluta.'}
                </div>
              </div>
            </div>
            <Link href="/admin/database" className="btn-secondary text-xs py-1.5 px-3 whitespace-nowrap">
              Databas & Kontroll →
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Players"
              count={playersCount}
              icon={<Users size={20} />}
              href="/admin/players"
              subtitle="Aktörer & jämförelser"
            />
            <StatCard
              title="Nedladdade Byggen"
              count={buildsCount}
              icon={<Download size={20} />}
              href="/admin/builds"
              subtitle="Från CheckoutLab"
              highlight
            />
            <StatCard
              title="Blogginlägg"
              count={postsCount}
              icon={<FileText size={20} />}
              href="/admin/blog"
              subtitle="Guider & analyser"
            />
            <StatCard
              title="Reviews"
              count={reviewsCount}
              icon={<Settings size={20} />}
              href="/admin/reviews"
              subtitle="Verifierade omdömen"
            />
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Snabbåtgärder</h2>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              <QuickAction
                title="Lägg till ny player"
                description="Skapa en ny aktör"
                icon={<Plus size={18} />}
                href="/admin/players/new"
              />
              <QuickAction
                title="Nedladdade Byggen"
                description="Se leads & sparade byggen"
                icon={<Download size={18} />}
                href="/admin/builds"
              />
              <QuickAction
                title="Databasstatus"
                description="Verifiera data & anslutning"
                icon={<Database size={18} />}
                href="/admin/database"
              />
              <QuickAction
                title="Styr kassa & procent"
                description="12 CRO-faktorer & standardkassa"
                icon={<Sliders size={18} />}
                href="/admin/checkout-config"
              />
              <QuickAction
                title="Mailutskick & CRO"
                description="Varukorgsavhopp & ROI-kalkyl"
                icon={<FileText size={18} />}
                href="/email-campaigns"
              />
              <QuickAction
                title="Paketspårning"
                description="Live tracking & delivery status"
                icon={<Settings size={18} />}
                href="/tracking"
              />
              <QuickAction
                title="Resurser & Länkar"
                description="AmbassadorFlow, Baymard, m.fl."
                icon={<Compass size={18} />}
                href="/links"
              />
              <QuickAction
                title="Skapa blogginlägg"
                description="Skriv artikel eller analys"
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

function StatCard({
  title,
  count,
  icon,
  href,
  subtitle,
  highlight,
}: {
  title: string;
  count: number;
  icon: React.ReactNode;
  href: string;
  subtitle?: string;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`card group hover:border-brand-500 transition ${
        highlight ? 'border-brand-500/40 bg-brand-50/20 dark:bg-brand-950/20' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{title}</div>
          <div className="text-2xl font-bold mt-1">{count}</div>
          {subtitle && <div className="text-[11px] text-slate-400 mt-0.5">{subtitle}</div>}
        </div>
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl group-hover:bg-brand-50 dark:group-hover:bg-brand-950/50 group-hover:text-brand-600 transition">
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
