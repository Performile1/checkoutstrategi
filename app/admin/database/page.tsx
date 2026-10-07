'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Database,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Server,
  FileCode,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  Layers,
  UploadCloud,
} from 'lucide-react';
import { AdminGuard, getAdminAuthHeaders } from '@/components/AdminGuard';

export default function AdminDatabasePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const headers = getAdminAuthHeaders();
      const res = await fetch('/api/admin/database-status', { headers });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleSyncToSupabase = async () => {
    if (!confirm('Detta kommer att synka alla aktörer (inklusive Dintero) och sparade byggen till Supabase. Fortsätt?')) return;
    setSyncing(true);
    setSyncResult(null);
    try {
      const headers = getAdminAuthHeaders();
      const res = await fetch('/api/admin/database-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({ action: 'sync_all_to_supabase' }),
      });
      const json = await res.json();
      setSyncResult(json);
      fetchStatus();
    } catch (err: any) {
      setSyncResult({ error: err.message });
    } finally {
      setSyncing(false);
    }
  };

  const copyEnvSnippet = () => {
    const snippet = `# Supabase databasanslutning
NEXT_PUBLIC_SUPABASE_URL=https://ditt-projekt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=din-anon-key
SUPABASE_SERVICE_ROLE_KEY=din-service-role-key`;
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isSupabaseConnected = data?.supabase?.status === 'connected';
  const dinteroOk = data?.dinteroVerification?.foundInStore;

  return (
    <AdminGuard>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-20">
        {/* Header */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20">
          <div className="container-prose py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition"
              >
                ← Tillbaka till Dashboard
              </Link>
              <h1 className="text-xl font-bold flex items-center gap-2">
                <Database className="text-brand-600" size={20} />
                Databasstatus & Systemkontroll
              </h1>
            </div>
            <button
              onClick={fetchStatus}
              className="btn-secondary text-xs py-2 px-3 inline-flex items-center gap-1.5"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
              Kontrollera igen
            </button>
          </div>
        </header>

        <div className="container-prose py-8 space-y-6">
          {/* Huvudstatus-banner */}
          <div
            className={`p-6 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm ${
              isSupabaseConnected
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
                : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800'
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  isSupabaseConnected
                    ? 'bg-emerald-500 text-white'
                    : 'bg-amber-500 text-white'
                }`}
              >
                <Database size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold">
                    {isSupabaseConnected
                      ? 'Supabase Databas: Ansluten & Aktiv'
                      : 'Lokal JSON & Serverless Lagring Aktiv (Supabase ej ansluten)'}
                  </h2>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
                  {isSupabaseConnected
                    ? 'Applikationen har en aktiv anslutning mot Supabase PostgreSQL. Ändringar synkas och lagras direkt i molndatabasen.'
                    : 'Miljövariablerna för Supabase är för närvarande inte satta. Data läses och sparas i projektets lokala datalager (content/players.json & /tmp/checkout_players.json).'}
                </p>
              </div>
            </div>

            {isSupabaseConnected && (
              <button
                onClick={handleSyncToSupabase}
                disabled={syncing}
                className="btn-primary text-xs py-2.5 px-4 whitespace-nowrap inline-flex items-center gap-2"
              >
                <UploadCloud size={15} className={syncing ? 'animate-spin' : ''} />
                {syncing ? 'Synkroniserar...' : 'Synka allt till Supabase'}
              </button>
            )}
          </div>

          {/* DINTERO VERIFIERINGSRUTA */}
          <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    dinteroOk ? 'bg-indigo-600 text-white' : 'bg-rose-500 text-white'
                  }`}
                >
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-base flex items-center gap-2">
                    Dintero – Verifiering i Databasen
                    {dinteroOk ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        <CheckCircle2 size={12} /> Verifierad
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-rose-100 text-rose-800">
                        <XCircle size={12} /> Saknas
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Kontroll av att Dintero är registrerad, sparad och tillgänglig för frontend och analys.
                  </p>
                </div>
              </div>

              <Link
                href="/players/dintero"
                target="_blank"
                className="btn-secondary text-xs py-1.5 px-3 inline-flex items-center gap-1"
              >
                Öppna /players/dintero
                <ArrowRight size={13} />
              </Link>
            </div>

            {data?.dinteroVerification?.playerDetails ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Namn</span>
                  <strong className="text-slate-900 dark:text-white font-semibold">
                    {data.dinteroVerification.playerDetails.name}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Slug</span>
                  <code className="text-indigo-600 dark:text-indigo-400 font-mono">
                    {data.dinteroVerification.playerDetails.slug}
                  </code>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Konverteringsimpact</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {data.dinteroVerification.playerDetails.conversionImpact}/10
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Webbplats</span>
                  <a
                    href={data.dinteroVerification.playerDetails.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-brand-600 hover:underline"
                  >
                    {data.dinteroVerification.playerDetails.websiteUrl}
                  </a>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-rose-50 text-rose-700 text-sm">
                Dintero hittades inte i det aktiva datalagret.
              </div>
            )}
          </div>

          {/* Datalager & Tabellstatus */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Aktörer (Players)
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-white">
                {data?.counts?.players ?? '...'}
              </div>
              <div className="text-xs text-slate-500 mt-1">Inkluderar Dintero, Klarna, Walley m.fl.</div>
            </div>

            <div className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Sparade Byggen (Builds)
              </div>
              <div className="text-3xl font-black text-brand-600 dark:text-brand-400">
                {data?.counts?.builds ?? '...'}
              </div>
              <div className="text-xs text-slate-500 mt-1">Exporter från CheckoutLab</div>
            </div>

            <div className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Blogginlägg
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-white">
                {data?.counts?.blogPosts ?? '...'}
              </div>
              <div className="text-xs text-slate-500 mt-1">Guider och analyser</div>
            </div>

            <div className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Recensioner
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-white">
                {data?.counts?.reviews ?? '...'}
              </div>
              <div className="text-xs text-slate-500 mt-1">Verifierade omdömen</div>
            </div>
          </div>

          {/* Guide för Supabase koppling */}
          <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode className="text-brand-600" size={18} />
                <h3 className="font-bold text-base">Så här kopplar du en permanent Supabase-databas</h3>
              </div>
              <button
                onClick={copyEnvSnippet}
                className="btn-secondary text-xs py-1.5 px-3 inline-flex items-center gap-1.5"
              >
                {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                {copied ? 'Kopierat!' : 'Kopiera .env mall'}
              </button>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-400">
              Om du vill att data ska sparas oberoende av Vercels serverless container-omstarter behöver du lägga till dina Supabase-nycklar i dina <strong>Environment Variables</strong> i Vercel (eller i din <code>.env.local</code>):
            </p>

            <div className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto space-y-1">
              <div className="text-slate-500"># 1. Hämta dina nycklar från ditt Supabase-projekt (Project Settings → API)</div>
              <div><span className="text-brand-400">NEXT_PUBLIC_SUPABASE_URL</span>=https://ditt-projekt.supabase.co</div>
              <div><span className="text-brand-400">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...</div>
              <div><span className="text-brand-400">SUPABASE_SERVICE_ROLE_KEY</span>=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs space-y-2">
              <div className="font-semibold text-slate-800 dark:text-slate-200">
                2. Kör databasschemat i Supabase SQL Editor:
              </div>
              <p className="text-slate-500">
                Schemat finns färdigt i <code>supabase/schema.sql</code> och skapar tabellerna <code>players</code>, <code>builds</code>, <code>blog_posts</code> och <code>reviews</code> med RLS-säkerhetsregler.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
