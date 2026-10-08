'use client';

import { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  Layers,
  Smartphone,
  CreditCard,
  Truck,
  ShieldCheck,
  FileText,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  Sparkles,
  PieChart,
  ArrowRight,
  Copy,
  Check,
  Info
} from 'lucide-react';

import {
  ResearchItem,
  ResearchInstitute,
  EXTERNAL_RESEARCH_INSTITUTES,
  CONVERSION_RESEARCH_DATA
} from '@/lib/research';

export type { ResearchItem, ResearchInstitute };
export { EXTERNAL_RESEARCH_INSTITUTES, CONVERSION_RESEARCH_DATA };

export function ConversionResearchExplorer({
  activeCheckoutType = '1-steg',
  onSelectStrategy
}: {
  activeCheckoutType?: string;
  onSelectStrategy?: (item: ResearchItem) => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCheckoutFilter, setSelectedCheckoutFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'Alla områden' },
    { id: 'steps', label: 'Stegarkitektur' },
    { id: 'fields', label: 'Formulär & Fält' },
    { id: 'payment', label: 'Betalmetoder' },
    { id: 'shipping', label: 'Frakt & Logistik' },
    { id: 'mobile', label: 'Mobil UX' },
    { id: 'trust', label: 'Förtroende' },
  ];

  // Filtrering & Sökning
  const filteredData = useMemo(() => {
    return CONVERSION_RESEARCH_DATA.filter((item) => {
      // Kategori-match
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // Kassa-typ filter
      if (selectedCheckoutFilter !== 'all') {
        const matchesType =
          item.applicableCheckouts.includes('alla') ||
          item.applicableCheckouts.includes(selectedCheckoutFilter as any);
        if (!matchesType) return false;
      }

      // Söktext
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchSummary = item.summary.toLowerCase().includes(q);
      const matchTags = item.tags.some((t) => t.toLowerCase().includes(q));
      const matchSource = item.source.toLowerCase().includes(q);
      const matchAction = item.recommendedAction.toLowerCase().includes(q);

      return matchTitle || matchSummary || matchTags || matchSource || matchAction;
    });
  }, [searchQuery, selectedCategory, selectedCheckoutFilter]);

  const handleCopyInsight = (item: ResearchItem) => {
    const text = `${item.title}\nEffekt: ${item.impactValue}\nKälla: ${item.source} (${item.sourceYear})\nInsikt: ${item.keyTakeaway}\nÅtgärd: ${item.recommendedAction}`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* SÖKHUVUD */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-brand-950 p-6 sm:p-8 rounded-2xl border border-slate-800 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30">
            <Sparkles size={14} />
            <span>Forskningsdatabas & Benchmarks</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Sök data: Hur påverkar steg och kassadesign konverteringen?
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Sök i vår kurerade databas med empiriska studier från <strong className="text-white font-semibold">Baymard Institute</strong>,{' '}
            <strong className="text-white font-semibold">Klarna</strong>, <strong className="text-white font-semibold">Stripe</strong>,{' '}
            <strong className="text-white font-semibold">PostNord E-barometern</strong> och nordiska A/B-tester.
          </p>

          {/* SÖKFÄLT */}
          <div className="pt-2">
            <div className="relative flex items-center">
              <Search size={18} className="absolute left-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Sök på t.ex. '1-steg', '3-steg', 'swish', 'mobil', 'baymard', 'frakt', 'gästkassa'..."
                className="w-full pl-11 pr-24 py-3.5 bg-slate-800/90 hover:bg-slate-800 focus:bg-slate-800 border border-slate-700 focus:border-brand-500 rounded-xl text-white placeholder-slate-400 text-sm outline-none focus:ring-2 focus:ring-brand-500/30 transition shadow-inner"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-2.5 py-1 rounded-md transition"
                >
                  Rensa
                </button>
              )}
            </div>

            {/* Snabbtaggar */}
            <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Populära sökningar:</span>
              {['1-steg vs 3-steg', 'Swish', 'Gästkassa', 'Drop-off', 'Apple Pay', 'Fältreduktion', 'Autofill'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSearchQuery(tag)}
                  className="bg-slate-800 hover:bg-brand-900/60 hover:text-brand-300 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700/60 transition"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FILTER & KONTROLLER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        {/* Kategori-pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar py-1">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === c.id
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Typ av kassa-filter */}
        <div className="flex items-center gap-2 text-xs shrink-0">
          <span className="text-slate-500 font-medium">Arkitektur:</span>
          <select
            value={selectedCheckoutFilter}
            onChange={(e) => setSelectedCheckoutFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="all">Alla format</option>
            <option value="1-steg">Endast 1-steg</option>
            <option value="2-steg">Endast 2-steg</option>
            <option value="3-steg">Endast 3-steg</option>
          </select>
        </div>
      </div>

      {/* RESULTATLISTA */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Visar {filteredData.length} forskningsinsikter</span>
          {searchQuery && (
            <span>Sökning för: &ldquo;{searchQuery}&rdquo;</span>
          )}
        </div>

        {filteredData.length === 0 ? (
          <div className="text-center py-12 p-8 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <HelpCircle size={32} className="mx-auto text-slate-400" />
            <h4 className="font-bold text-slate-800 dark:text-slate-200">Inga forskningsresultat matchade din sökning</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Testa att söka på bredare termer som &ldquo;steg&rdquo;, &ldquo;kassa&rdquo;, &ldquo;mobil&rdquo; eller välj &ldquo;Alla områden&rdquo;.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedCheckoutFilter('all');
              }}
              className="text-xs font-semibold text-brand-600 hover:underline"
            >
              Återställ alla filter
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredData.map((item) => (
              <div
                key={item.id}
                className="card p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:shadow-md hover:border-brand-400 dark:hover:border-brand-500 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  {/* Topp: Kategori, År och Effekt */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      {item.categoryLabel}
                    </span>

                    <span
                      className={`text-xs font-extrabold px-2.5 py-1 rounded-full border ${
                        item.impactType === 'positive'
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                          : item.impactType === 'negative'
                          ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {item.impactValue}
                    </span>
                  </div>

                  {/* Titel & Sammanfattning */}
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>

                  {/* Konkret Nyckelinsikt & Rekommendation */}
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-100 dark:border-slate-700/60 space-y-1.5 text-xs">
                    <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Sparkles size={13} className="text-brand-500" />
                      <span>Rekommenderad åtgärd:</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                      {item.recommendedAction}
                    </p>
                  </div>
                </div>

                {/* Fot: Källa, Taggar och Kopiera */}
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="truncate max-w-[220px] sm:max-w-[280px]">
                    {item.sourceUrl ? (
                      <a
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 inline-flex items-center gap-1 hover:underline"
                        title={`Läs extern studie hos ${item.source}`}
                      >
                        <span className="truncate">{item.source}</span>
                        <ExternalLink size={10} className="shrink-0 text-slate-400" />
                      </a>
                    ) : (
                      <span className="font-medium text-slate-600 dark:text-slate-400">{item.source}</span>
                    )}
                    <span className="mx-1">·</span>
                    <span>{item.sourceYear}</span>
                    {item.sampleSize && (
                      <span className="hidden sm:inline"> ({item.sampleSize})</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleCopyInsight(item)}
                      title="Kopiera studie till urklipp"
                      className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition"
                    >
                      {copiedId === item.id ? (
                        <Check size={14} className="text-emerald-500" />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>

                    {onSelectStrategy && (
                      <button
                        type="button"
                        onClick={() => onSelectStrategy(item)}
                        className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-0.5"
                      >
                        Tillämpa <ChevronRight size={13} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* JÄMFÖRELSEMATRIS: 1-STEG VS 2-STEG VS 3-STEG */}
      <div className="card p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 flex items-center gap-1.5 mb-1">
              <Layers size={15} /> Empirisk Sammanställning
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              1-stegs vs. 2-stegs vs. 3-stegs kassa: Vilket vinner?
            </h3>
          </div>
          <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg self-start sm:self-auto font-medium">
            Baserat på 2M+ analyserade sessioner
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300">
                <th className="py-3 px-3 font-semibold">Kassatyp</th>
                <th className="py-3 px-3 font-semibold">Genomsnittlig konvertering</th>
                <th className="py-3 px-3 font-semibold">Tid att slutföra</th>
                <th className="py-3 px-3 font-semibold">Bäst lämpad för</th>
                <th className="py-3 px-3 font-semibold">Största fallgropen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  1-stegs kassa (One-Page)
                </td>
                <td className="py-3.5 px-3 font-semibold text-emerald-600 dark:text-emerald-400">
                  38 % – 46 %
                </td>
                <td className="py-3.5 px-3">45 – 70 sek</td>
                <td className="py-3.5 px-3">Mode, D2C, kosmetik, få artiklar, enkla fraktval</td>
                <td className="py-3.5 px-3 text-rose-600 dark:text-rose-400">
                  Känns rörigt om det finns &gt;10 formulärfält
                </td>
              </tr>
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  2-stegs kassa (Kund+Frakt &rarr; Betalning)
                </td>
                <td className="py-3.5 px-3 font-semibold text-blue-600 dark:text-blue-400">
                  34 % – 42 %
                </td>
                <td className="py-3.5 px-3">55 – 85 sek</td>
                <td className="py-3.5 px-3">E-handlare som driver aktiv Abandoned Cart e-post/SMS</td>
                <td className="py-3.5 px-3 text-amber-600 dark:text-amber-400">
                  Kräver tydlig indikation på att betalning väntar i nästa steg
                </td>
              </tr>
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  3-stegs kassa (Klassisk Shopify/Multi-step)
                </td>
                <td className="py-3.5 px-3 font-semibold text-purple-600 dark:text-purple-400">
                  28 % – 36 %
                </td>
                <td className="py-3.5 px-3">90 – 140 sek</td>
                <td className="py-3.5 px-3">Möbler, byggvaror, vitvaror, B2B, högt ordervärde (AOV)</td>
                <td className="py-3.5 px-3 text-rose-600 dark:text-rose-400">
                  Hög drop-off på mobil vid långsamma omladdningar
                </td>
              </tr>
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                  Accordion (Utfällbara steg på samma sida)
                </td>
                <td className="py-3.5 px-3 font-semibold text-cyan-600 dark:text-cyan-400">
                  36 % – 44 %
                </td>
                <td className="py-3.5 px-3">50 – 80 sek</td>
                <td className="py-3.5 px-3">Moderna headless-kassor (t.ex. Kustom, Centra) & SPA</td>
                <td className="py-3.5 px-3 text-amber-600 dark:text-amber-400">
                  Kan förvirra äldre målgrupper om steg stängs oväntat
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FUNNEL DROP-OFF KALKYLATOR PER STEG */}
      <div className="card p-6 sm:p-8 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5 mb-1">
              <TrendingDown size={15} /> Kassa-avhopp per steg
            </div>
            <h3 className="text-xl font-bold">Var förlorar du kunderna i kassan?</h3>
          </div>
          <p className="text-xs text-slate-400 max-w-xs">
            Genomsnittligt bortfall (Drop-off rate) per delmoment i en standardkassa.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Steg 1: Kunduppgifter</span>
              <span className="text-rose-400 font-bold">22 % avhopp</span>
            </div>
            <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
              <div className="bg-rose-500 h-full w-[22%]" />
            </div>
            <p className="text-[11px] text-slate-400 pt-1 leading-normal">
              <strong>Huvudorsaker:</strong> Tvingad inloggning, för många fält, saknad autofill på mobil.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Steg 2: Leverans & Frakt</span>
              <span className="text-rose-400 font-bold">38 % avhopp</span>
            </div>
            <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
              <div className="bg-rose-500 h-full w-[38%]" />
            </div>
            <p className="text-[11px] text-slate-400 pt-1 leading-normal">
              <strong>Huvudorsaker:</strong> Oväntat dyr frakt, saknad paketskåp/Instabox, otydliga leveransdatum.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Steg 3: Betalning & Slutför</span>
              <span className="text-rose-400 font-bold">14 % avhopp</span>
            </div>
            <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
              <div className="bg-rose-500 h-full w-[14%]" />
            </div>
            <p className="text-[11px] text-slate-400 pt-1 leading-normal">
              <strong>Huvudorsaker:</strong> Saknar Swish eller Klarna, misslyckad 3D Secure, otydlig totalkostnad.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-brand-950/40 border border-brand-800/50 text-xs text-brand-200 flex items-start gap-3">
          <Info size={18} className="text-brand-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Slutsats för din kassa:</strong> Genom att lösa de två största läckorna – gästkassa i Steg 1 och transparens kring frakten före Steg 2 – återtar en genomsnittlig e-handel över hälften av alla tappade kunder.
          </p>
        </div>
      </div>

      {/* EXTERNA FORSKNINGSINSTITUT & PRIMÄRKÄLLOR */}
      <div className="card p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 flex items-center gap-1.5 mb-1">
              <ExternalLink size={15} /> Oberoende Källor & Institut
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Externa forskningsinstitut och auktoriteter
            </h3>
          </div>
          <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg self-start sm:self-auto font-medium">
            Direktlänkar till primärstudier
          </span>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
          Vi sammanställer och validerar våra rekommendationer mot världens mest respekterade oberoende UX- och e-handelsinstitut. Klicka dig vidare för att ta del av deras fullständiga rapporter, metodik och dataserier:
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {EXTERNAL_RESEARCH_INSTITUTES.map((inst) => (
            <a
              key={inst.name}
              href={inst.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 hover:border-brand-500 dark:hover:border-brand-500 transition-all group flex flex-col justify-between shadow-sm hover:shadow-md"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-2 py-0.5 rounded border border-brand-200 dark:border-brand-800">
                    {inst.badge}
                  </span>
                  <ExternalLink size={13} className="text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition shrink-0" />
                </div>

                <div>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition flex items-center gap-1.5">
                    {inst.name}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                    {inst.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {inst.highlightStat}
                </span>
                <span className="text-[11px] text-brand-600 dark:text-brand-400 group-hover:underline font-medium">
                  Besök {inst.name.split(' ')[0]} &rarr;
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
