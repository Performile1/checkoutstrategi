'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Download,
  Trash2,
  Calendar,
  Building,
  Mail,
  TrendingUp,
  CreditCard,
  Truck,
  CheckCircle2,
  Package,
  Layers,
  FileText,
  Search,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  X,
  Sparkles,
} from 'lucide-react';
import { AdminGuard, getAdminAuthHeaders } from '@/components/AdminGuard';
import type { CheckoutBuild } from '@/lib/builds-store';

export default function AdminBuildsPage() {
  const [builds, setBuilds] = useState<CheckoutBuild[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBuild, setSelectedBuild] = useState<CheckoutBuild | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchBuilds = async () => {
    setLoading(true);
    try {
      const headers = getAdminAuthHeaders();
      const res = await fetch('/api/builds', { headers });
      if (res.ok) {
        const data = await res.json();
        setBuilds(data);
      }
    } catch (err) {
      console.error('Kunde inte ladda byggen:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuilds();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Är du säker på att du vill ta bort detta bygge?')) return;
    setDeletingId(id);
    try {
      const headers = getAdminAuthHeaders();
      const res = await fetch(`/api/builds/${id}`, {
        method: 'DELETE',
        headers,
      });
      if (res.ok) {
        setBuilds((prev) => prev.filter((b) => b.id !== id));
        if (selectedBuild?.id === id) setSelectedBuild(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownloadReport = (b: CheckoutBuild) => {
    const report = {
      titel: `Checkout-konfiguration & Analys - ${b.name}`,
      genererad: b.created_at,
      anvandare: {
        namn: b.name,
        epost: b.email,
        foretag: b.company || 'Ej angivet',
        plattform: b.platform || 'shopify',
      },
      kpi_berakning: {
        estimerad_checkout_konvertering: `${b.conversion_score}%`,
        snittordervarde_aov: `${b.aov} ${b.currency}`,
      },
      kassastruktur: {
        layout_ordning: b.layout_order,
        aktiva_moduler: b.active_modules,
        frakt: {
          metod: b.shipping_method,
          kostnad: b.shipping_cost,
          eta: b.shipping_eta,
        },
        betalsatt: b.payment_methods,
        returpolicy: b.return_policy,
      },
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `checkout-bygge-${b.name.toLowerCase().replace(/\s+/g, '-')}-${b.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredBuilds = builds.filter(
    (b) =>
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.company && b.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const avgScore = builds.length > 0
    ? (builds.reduce((sum, b) => sum + (b.conversion_score || 0), 0) / builds.length).toFixed(1)
    : '0';

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
                <Download className="text-brand-600" size={20} />
                Nedladdade Byggen & Kassarapporter
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={fetchBuilds}
                className="btn-secondary text-xs py-2 px-3 inline-flex items-center gap-1.5"
                title="Ladda om data"
              >
                <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
                Uppdatera
              </button>
              <Link
                href="/testcheckout"
                target="_blank"
                className="btn-primary text-xs py-2 px-3 inline-flex items-center gap-1.5"
              >
                <Sparkles size={13} />
                Öppna CheckoutLab
              </Link>
            </div>
          </div>
        </header>

        <div className="container-prose py-8 space-y-6">
          {/* KPI Sammanfattning */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Totalt exporterade byggen
              </div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {builds.length}
              </div>
              <div className="text-xs text-slate-500 mt-1">Registrerade via kassaexporten</div>
            </div>

            <div className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Snitt konverteringsscore
              </div>
              <div className="text-3xl font-extrabold text-brand-600 dark:text-brand-400">
                {avgScore}%
              </div>
              <div className="text-xs text-slate-500 mt-1">Estimerad checkout-konvertering</div>
            </div>

            <div className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Unika Leads / Butiker
              </div>
              <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {new Set(builds.map((b) => b.email.toLowerCase())).size}
              </div>
              <div className="text-xs text-slate-500 mt-1">Med registrerad e-postadress</div>
            </div>
          </div>

          {/* Sökfält */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Sök på namn, e-post eller butik..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div className="text-xs text-slate-500">
              Visar {filteredBuilds.length} av {builds.length} byggen
            </div>
          </div>

          {/* Listning av Byggen */}
          {loading ? (
            <div className="card p-12 text-center text-slate-500">
              <RefreshCw className="animate-spin mx-auto mb-3" size={24} />
              Laddar sparade byggen från databasen...
            </div>
          ) : filteredBuilds.length === 0 ? (
            <div className="card p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <FileText className="mx-auto mb-3 text-slate-400" size={32} />
              <h3 className="text-lg font-bold mb-1">Inga byggen hittades</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
                När besökare konfigurerar en kassa i CheckoutLab och klickar på &quot;Generera och ladda ned PDF&quot; sparas bygget och rapporten här.
              </p>
              <Link href="/testcheckout" className="btn-primary inline-flex items-center gap-2 text-sm">
                <Sparkles size={16} /> Testa att exportera ett bygge i CheckoutLab
              </Link>
            </div>
          ) : (
            <div className="card overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="py-3 px-4">Datum</th>
                      <th className="py-3 px-4">Person & Butik</th>
                      <th className="py-3 px-4">Score</th>
                      <th className="py-3 px-4">Plattform & Betalsätt</th>
                      <th className="py-3 px-4">Aktiva Moduler</th>
                      <th className="py-3 px-4 text-right">Åtgärder</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {filteredBuilds.map((b) => (
                      <tr
                        key={b.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition"
                      >
                        <td className="py-3 px-4 whitespace-nowrap text-xs text-slate-500">
                          <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                            <Calendar size={13} className="text-slate-400" />
                            {new Date(b.created_at).toLocaleDateString('sv-SE', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {new Date(b.created_at).toLocaleTimeString('sv-SE', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {b.name}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <Mail size={12} className="text-slate-400" />
                            <a href={`mailto:${b.email}`} className="hover:underline">
                              {b.email}
                            </a>
                          </div>
                          {b.company && (
                            <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                              <Building size={12} className="text-slate-400" />
                              <span>{b.company}</span>
                            </div>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 font-bold text-xs text-brand-700 dark:text-brand-300">
                            <TrendingUp size={13} />
                            {b.conversion_score}%
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            AOV: {b.aov} {b.currency}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="text-xs font-semibold capitalize text-slate-800 dark:text-slate-200 mb-1">
                            {b.platform || 'Shopify'}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {b.payment_methods?.slice(0, 3).map((pm) => (
                              <span
                                key={pm}
                                className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 capitalize"
                              >
                                {pm}
                              </span>
                            ))}
                            {(b.payment_methods?.length || 0) > 3 && (
                              <span className="text-[10px] text-slate-400">
                                +{(b.payment_methods?.length || 0) - 3}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1">
                            <Layers size={13} className="text-slate-400" />
                            <span>{b.active_modules?.length || 0} moduler aktiva</span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            Frakt: {b.shipping_method || 'Standard'}
                          </div>
                        </td>

                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedBuild(b)}
                              className="btn-secondary text-xs py-1.5 px-2.5 inline-flex items-center gap-1"
                              title="Visa komplett konfiguration"
                            >
                              Granska
                            </button>
                            <button
                              onClick={() => handleDownloadReport(b)}
                              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-brand-600 hover:border-brand-300 transition"
                              title="Ladda ner JSON-rapport"
                            >
                              <Download size={15} />
                            </button>
                            <button
                              onClick={() => handleDelete(b.id)}
                              disabled={deletingId === b.id}
                              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-rose-600 hover:border-rose-300 transition disabled:opacity-50"
                              title="Ta bort bygge"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* MODAL FÖR GRANSKNING AV BYGGE */}
        {selectedBuild && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-1">
                    Kassabygge & Rapport
                  </div>
                  <h3 className="text-xl font-bold">{selectedBuild.name}</h3>
                  <div className="text-xs text-slate-500">
                    {selectedBuild.email} {selectedBuild.company && `• ${selectedBuild.company}`}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedBuild(null)}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="text-xs text-slate-500 mb-1">Beräknad konvertering</div>
                  <div className="text-2xl font-black text-brand-600 dark:text-brand-400">
                    {selectedBuild.conversion_score}%
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="text-xs text-slate-500 mb-1">Snittordervärde (AOV)</div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white">
                    {selectedBuild.aov} {selectedBuild.currency}
                  </div>
                </div>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-500 mb-2">
                    Kassastruktur & Moduler
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedBuild.active_modules?.map((m) => (
                      <span
                        key={m}
                        className="px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1"
                      >
                        <CheckCircle2 size={12} />
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-500 mb-2">
                    Betalmetoder
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedBuild.payment_methods?.map((pm) => (
                      <span
                        key={pm}
                        className="px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 capitalize"
                      >
                        {pm}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-500 mb-2">
                    Frakt & Logistik
                  </h4>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                    <div>
                      <strong>Valt fraktalternativ:</strong> {selectedBuild.shipping_method || 'Standard'}
                    </div>
                    <div>
                      <strong>Kostnad:</strong> {selectedBuild.shipping_cost || '0 kr'}
                    </div>
                    <div>
                      <strong>Leveranstid:</strong> {selectedBuild.shipping_eta || '1-3 dagar'}
                    </div>
                  </div>
                </div>

                {selectedBuild.return_policy && (
                  <div>
                    <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-500 mb-2">
                      Returpolicy
                    </h4>
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                      <div>
                        <strong>Öppet köp:</strong> {selectedBuild.return_policy.window} dagar
                      </div>
                      <div>
                        <strong>Returkostnad:</strong>{' '}
                        {selectedBuild.return_policy.cost === 'free' ? 'Gratis (0 kr)' : 'Avgift (39 kr)'}
                      </div>
                      <div>
                        <strong>Returmetod:</strong> {selectedBuild.return_policy.method}
                      </div>
                      <div>
                        <strong>Erbjuder byte:</strong>{' '}
                        {selectedBuild.return_policy.allow_exchange ? 'Ja' : 'Nej'}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => handleDownloadReport(selectedBuild)}
                  className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-2"
                >
                  <Download size={14} /> Ladda ned JSON-rapport
                </button>
                <button
                  onClick={() => setSelectedBuild(null)}
                  className="btn-secondary text-xs py-2 px-4"
                >
                  Stäng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminGuard>
  );
}
