'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Settings,
  ArrowLeft,
  Save,
  RotateCcw,
  Sparkles,
  Layers,
  TrendingUp,
  Sliders,
  CheckCircle2,
  ExternalLink,
  Shield,
  Truck,
  CreditCard,
  Store,
  HelpCircle,
  Copy,
  Eye
} from 'lucide-react';
import { CRO_OPTIMIZATION_FACTORS, SHIPPING_CRO_VARIABLES, DEFAULT_SAVED_VARIANTS } from '@/lib/checkout-config';

export default function AdminCheckoutConfigPage() {
  const [baseConversionRate, setBaseConversionRate] = useState<number>(52.0);
  const [factorBoosts, setFactorBoosts] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    CRO_OPTIMIZATION_FACTORS.forEach((f) => {
      initial[f.id] = f.defaultBoost;
    });
    return initial;
  });

  const [defaultMode, setDefaultMode] = useState<string>('1-steg');
  const [defaultPickupFirstStep, setDefaultPickupFirstStep] = useState<boolean>(false);
  const [defaultPrefill, setDefaultPrefill] = useState<boolean>(true);
  const [defaultDevice, setDefaultDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [defaultPrimaryCarrier, setDefaultPrimaryCarrier] = useState<string>('instabox');
  const [defaultPrimaryPayment, setDefaultPrimaryPayment] = useState<string>('klarna');
  const [hasSavedToast, setHasSavedToast] = useState<boolean>(false);

  // Ladda från localStorage om tillgängligt
  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem('checkout_admin_settings');
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        if (parsed.baseConversionRate !== undefined) setBaseConversionRate(parsed.baseConversionRate);
        if (parsed.factorBoosts) setFactorBoosts(parsed.factorBoosts);
        if (parsed.defaultMode) setDefaultMode(parsed.defaultMode);
        if (parsed.defaultPickupFirstStep !== undefined) setDefaultPickupFirstStep(parsed.defaultPickupFirstStep);
        if (parsed.defaultPrefill !== undefined) setDefaultPrefill(parsed.defaultPrefill);
        if (parsed.defaultDevice) setDefaultDevice(parsed.defaultDevice);
        if (parsed.defaultPrimaryCarrier) setDefaultPrimaryCarrier(parsed.defaultPrimaryCarrier);
        if (parsed.defaultPrimaryPayment) setDefaultPrimaryPayment(parsed.defaultPrimaryPayment);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSave = () => {
    const config = {
      baseConversionRate,
      factorBoosts,
      defaultMode,
      defaultPickupFirstStep,
      defaultPrefill,
      defaultDevice,
      defaultPrimaryCarrier,
      defaultPrimaryPayment,
      lastUpdated: new Date().toISOString(),
    };
    try {
      localStorage.setItem('checkout_admin_settings', JSON.stringify(config));
      setHasSavedToast(true);
      setTimeout(() => setHasSavedToast(false), 3500);
    } catch {
      // ignore
    }
  };

  const handleReset = () => {
    setBaseConversionRate(52.0);
    const initial: Record<string, number> = {};
    CRO_OPTIMIZATION_FACTORS.forEach((f) => {
      initial[f.id] = f.defaultBoost;
    });
    setFactorBoosts(initial);
    setDefaultMode('1-steg');
    setDefaultPickupFirstStep(false);
    setDefaultPrefill(true);
    setDefaultDevice('desktop');
    setDefaultPrimaryCarrier('instabox');
    setDefaultPrimaryPayment('klarna');
    try {
      localStorage.removeItem('checkout_admin_settings');
    } catch {
      // ignore
    }
    setHasSavedToast(true);
    setTimeout(() => setHasSavedToast(false), 3000);
  };

  const updateBoost = (factorId: string, val: number) => {
    setFactorBoosts((prev) => ({
      ...prev,
      [factorId]: Math.max(0, Math.min(20, Math.round(val * 10) / 10)),
    }));
  };

  // Beräkna teoretisk maxkonvertering med nuvarande reglage
  const theoreticalMax = Math.min(
    98.5,
    baseConversionRate + Object.values(factorBoosts).reduce((a, b) => a + b, 0)
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Top Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-sm">
        <div className="container-prose py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Tillbaka till Admin"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="badge">Checkout Motor</span>
                <span className="text-xs text-slate-400">12 Optimeringsfaktorer &amp; LIFT</span>
              </div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                Styr Konverteringsprocent &amp; Standardkassa
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={handleReset}
              className="btn-secondary text-xs px-3 py-2 flex items-center gap-1.5"
            >
              <RotateCcw size={14} /> Återställ
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5 shadow"
            >
              <Save size={14} /> Spara ändringar
            </button>
            <Link
              href="/testcheckout"
              className="px-3 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:opacity-90 transition flex items-center gap-1"
            >
              <Eye size={13} /> Testa i Lab &rarr;
            </Link>
          </div>
        </div>
      </header>

      {/* Toast */}
      {hasSavedToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-emerald-600 text-white shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 size={20} />
          <div className="text-xs">
            <strong className="block font-bold">Inställningar sparade!</strong>
            <span>Checkout Lab använder nu dina anpassade procent och startregler.</span>
          </div>
        </div>
      )}

      <main className="container-prose py-8 space-y-10">
        {/* Översikt Dashboard */}
        <div className="card p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-slate-900 to-brand-950 text-white rounded-3xl border border-slate-800 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400 bg-brand-950 px-2.5 py-0.5 rounded-full border border-brand-800">
                LIFT &amp; CRO Algoritm
              </span>
              <h2 className="text-2xl font-black text-white mt-2">
                Kalibrera Beräkningsmodellen
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                Justera baslinjen och hur starkt varje enskild optimeringsfaktor flyttar mätaren i Checkout Lab.
              </p>
            </div>
            <div className="text-right sm:text-right">
              <span className="text-xs text-slate-400 block">Teoretiskt max:</span>
              <span className="text-4xl font-black text-brand-400">{theoreticalMax.toFixed(1)}%</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 space-y-2">
              <label className="text-xs font-bold text-slate-300 block">
                Baslinje (Ooptimerad Kassa):
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="30"
                  max="70"
                  step="0.5"
                  value={baseConversionRate}
                  onChange={(e) => setBaseConversionRate(parseFloat(e.target.value))}
                  className="flex-1 accent-brand-500"
                />
                <span className="text-lg font-black text-white w-14 text-right font-mono">
                  {baseConversionRate.toFixed(1)}%
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Startvärde innan några optimeringsfaktorer eller LIFT-förbättringar aktiveras.
              </p>
            </div>

            <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 space-y-2">
              <span className="text-xs font-bold text-slate-300 block">Aktiva Optimeringsfaktorer:</span>
              <div className="text-2xl font-black text-white">12 av 12</div>
              <p className="text-[11px] text-slate-400">
                Pre-fill, BNPL, Frakt först, Minimera fält, Trust-signaler, Tangentbord m.fl.
              </p>
            </div>

            <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 space-y-2">
              <span className="text-xs font-bold text-slate-300 block">LIFT-balans (Drivkraft vs Hämmare):</span>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-800">
                  +Värde &amp; Tydlighet
                </span>
                <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 font-bold border border-rose-800">
                  -Friktion &amp; Oro
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Varje faktor minskar friktion/oro eller ökar värde/tydlighet i kassan.
              </p>
            </div>
          </div>
        </div>

        {/* SEKTION 1: HUR EN FÖRSTA CHECKOUT SKA SE UT */}
        <section className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider">
              <Layers size={14} /> Startkonfiguration
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              Hur en första checkout ska se ut som default
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Välj hur kassan initialt ska presenteras för besökare när Checkout Lab laddas för första gången.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Standard stegarkitektur (Layout-läge):
              </label>
              <select
                value={defaultMode}
                onChange={(e) => setDefaultMode(e.target.value)}
                className="w-full h-11 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="1-steg">1-steg: Alla sektioner på en samlad sida (Svensk B2C-standard)</option>
                <option value="2-steg">2-steg: Kund &amp; Frakt &rarr; Betalning</option>
                <option value="3-steg">3-steg: Kund &rarr; Leveransval &rarr; Betalning (Ingrid/nShift-stil)</option>
                <option value="accordion">Accordion: Expanderande dragspelskassa som ökar i längd</option>
                <option value="click-collect">Click &amp; Collect: Hämta i butik (Endast 3 fält)</option>
              </select>
              <p className="text-[11px] text-slate-500 mt-1.5">
                Styr hur många vyer kassan delas upp i vid första besöket.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Standard enhetsvy:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDefaultDevice('desktop')}
                  className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition ${
                    defaultDevice === 'desktop'
                      ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-500 text-brand-600 dark:text-brand-400'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Desktop (Webb)
                </button>
                <button
                  type="button"
                  onClick={() => setDefaultDevice('mobile')}
                  className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition ${
                    defaultDevice === 'mobile'
                      ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-500 text-brand-600 dark:text-brand-400'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Mobiltelefon (70% av köpen)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Primärt förvalt betalsätt:
              </label>
              <select
                value={defaultPrimaryPayment}
                onChange={(e) => setDefaultPrimaryPayment(e.target.value)}
                className="w-full h-11 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="klarna">Klarna (Köp nu, betala sen)</option>
                <option value="walley">Walley / Collector</option>
                <option value="swish">Swish (Mobil betalning)</option>
                <option value="card">Betalkort (Visa / Mastercard)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Primärt förvalt fraktalternativ:
              </label>
              <select
                value={defaultPrimaryCarrier}
                onChange={(e) => setDefaultPrimaryCarrier(e.target.value)}
                className="w-full h-11 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="instabox">Instabox Paketbox (Förvalt skåp)</option>
                <option value="postnord">PostNord Ombud (Klassiskt utlämningsställe)</option>
                <option value="budbee">Budbee Hemleverans</option>
                <option value="dhl">DHL Send Green (Fossilfri insetting)</option>
              </select>
            </div>

            <div className="md:col-span-2 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={defaultPickupFirstStep}
                  onChange={(e) => setDefaultPickupFirstStep(e.target.checked)}
                  className="w-4 h-4 text-brand-600 rounded border-slate-300"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Ha &ldquo;Hämta i butik&rdquo; (Click &amp; Collect) som första steg i startkassan
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Visar butiksväljare och sparar 5 formulärfält direkt för omnichannel-handlare.
                  </span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={defaultPrefill}
                  onChange={(e) => setDefaultPrefill(e.target.checked)}
                  className="w-4 h-4 text-brand-600 rounded border-slate-300"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Aktivera Blixt-autofill (Pre-fill) vid första sidvisning
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Simulerar en återkommande svensk konsument med färdigifyllda kontakt- och adressuppgifter.
                  </span>
                </div>
              </label>
            </div>
          </div>
        </section>

        {/* SEKTION 2: DE 12 OPTIMERINGSFAKTORERNA OCH DERAS PROCENTPÅVERKAN */}
        <section className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider">
                <Sliders size={14} /> Procentjustering
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                De 12 Optimeringsfaktorerna (Lyft i procentenheter)
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Dessa värden styr hur många procentenheter konverteringspoängen ökar när respektive faktor är aktiv i kassan.
              </p>
            </div>
            <span className="text-xs font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full self-start sm:self-auto">
              LIFT-mappning aktiv
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {CRO_OPTIMIZATION_FACTORS.map((factor) => {
              const currentBoost = factorBoosts[factor.id] ?? factor.defaultBoost;
              return (
                <div
                  key={factor.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider block">
                        Faktor #{factor.number} &bull; LIFT: {factor.liftPillar}
                      </span>
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                        {factor.title}
                      </h3>
                    </div>
                    <span className="text-base font-black text-brand-600 dark:text-brand-400 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700 font-mono">
                      +{currentBoost.toFixed(1)}%
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {factor.description}
                  </p>

                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center gap-3">
                    <span className="text-[11px] text-slate-400 font-medium">Justera lyft:</span>
                    <input
                      type="range"
                      min="0.5"
                      max="15.0"
                      step="0.5"
                      value={currentBoost}
                      onChange={(e) => updateBoost(factor.id, parseFloat(e.target.value))}
                      className="flex-1 accent-brand-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SEKTION 3: DE 4 FRAKTOPTIMERINGARNA (FRÅN BLOGGEN) */}
        <section className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider">
              <Truck size={14} /> Leveransoptimering (5–15 % lyft)
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              De 4 Fraktoptimeringarna i Kassan
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Kopplade till analysen &ldquo;Fraktväljaren: Kassans verkliga flaskhals&rdquo;.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {SHIPPING_CRO_VARIABLES.map((v) => (
              <div
                key={v.id}
                className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    LIFT: {v.liftPillar}
                  </span>
                  <span className="text-sm font-black text-emerald-700 dark:text-emerald-300 font-mono">
                    +{v.boost.toFixed(1)}%
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">{v.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">{v.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
