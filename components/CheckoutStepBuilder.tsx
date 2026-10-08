'use client';

import { useState } from 'react';
import {
  Layers,
  ArrowRight,
  Plus,
  Trash2,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Info,
  CheckCircle2,
  HelpCircle,
  Smartphone,
  ChevronDown,
  ChevronUp,
  Settings2,
  MoveDown,
  MoveUp
} from 'lucide-react';

export type CheckoutStepMode = '1-steg' | '2-steg' | '3-steg' | '4-steg' | 'accordion' | 'custom';

export interface StepDefinition {
  id: string;
  number: number;
  title: string;
  description: string;
  moduleIds: string[];
}

export interface StepBuilderConfig {
  mode: CheckoutStepMode;
  indicatorStyle: 'numbered' | 'progressbar' | 'tabs' | 'accordion';
  steps: StepDefinition[];
  autoAdvanceOnValid: boolean;
  showStepSummary: boolean;
}

export const DEFAULT_PRESETS: Record<CheckoutStepMode, StepDefinition[]> = {
  '1-steg': [
    {
      id: 'step-all',
      number: 1,
      title: 'Kassa (Alla sektioner på en sida)',
      description: 'Samlad översikt över kunduppgifter, frakt och betalning',
      moduleIds: ['expressWallets', 'customer', 'guest', 'coupon', 'shipping', 'payment', 'review']
    }
  ],
  '2-steg': [
    {
      id: 'step-1-details',
      number: 1,
      title: 'Steg 1: Kund & Leverans',
      description: 'E-post, adress och val av fraktmetod',
      moduleIds: ['expressWallets', 'customer', 'guest', 'shipping']
    },
    {
      id: 'step-2-pay',
      number: 2,
      title: 'Steg 2: Betalning & Slutför',
      description: 'Betalsätt, rabattkod och orderöversikt',
      moduleIds: ['coupon', 'payment', 'review']
    }
  ],
  '3-steg': [
    {
      id: 'step-1-cust',
      number: 1,
      title: 'Steg 1: Kunduppgifter',
      description: 'E-postadress, namn och leveransadress',
      moduleIds: ['expressWallets', 'customer', 'guest']
    },
    {
      id: 'step-2-ship',
      number: 2,
      title: 'Steg 2: Leveransval',
      description: 'Välj fraktbolag, ombud eller hemleverans',
      moduleIds: ['shipping', 'deliveryTimer', 'packaging']
    },
    {
      id: 'step-3-pay',
      number: 3,
      title: 'Steg 3: Betalning',
      description: 'Välj betalsätt och godkänn beställningen',
      moduleIds: ['coupon', 'payment', 'euReturn', 'review']
    }
  ],
  '4-steg': [
    {
      id: 'step-1-id',
      number: 1,
      title: 'Steg 1: Identifiering / B2B',
      description: 'Privat eller organisationsnummer och faktureringsadress',
      moduleIds: ['customer', 'guest']
    },
    {
      id: 'step-2-del',
      number: 2,
      title: 'Steg 2: Leveransadress & Ombud',
      description: 'Leveransdestination och fraktalternativ',
      moduleIds: ['shipping', 'packaging']
    },
    {
      id: 'step-3-meth',
      number: 3,
      title: 'Steg 3: Betalningsvillkor',
      description: 'Faktura 30 dgr, kort eller leasing',
      moduleIds: ['payment', 'coupon']
    },
    {
      id: 'step-4-rev',
      number: 4,
      title: 'Steg 4: Slutgodkännande',
      description: 'Orderöversikt, inköpsordernummer och signering',
      moduleIds: ['review', 'euReturn']
    }
  ],
  'accordion': [
    {
      id: 'acc-1',
      number: 1,
      title: '1. Dina uppgifter',
      description: 'E-post och leveransadress',
      moduleIds: ['expressWallets', 'customer', 'guest']
    },
    {
      id: 'acc-2',
      number: 2,
      title: '2. Välj leverans',
      description: 'Fraktmetod och ombud',
      moduleIds: ['shipping', 'deliveryTimer']
    },
    {
      id: 'acc-3',
      number: 3,
      title: '3. Betalning & Slutför',
      description: 'Välj hur du vill betala',
      moduleIds: ['coupon', 'payment', 'review']
    }
  ],
  'custom': [
    {
      id: 'cust-1',
      number: 1,
      title: 'Steg 1: Kontakt & Adress',
      description: 'Grundläggande kontaktuppgifter',
      moduleIds: ['customer', 'guest']
    },
    {
      id: 'cust-2',
      number: 2,
      title: 'Steg 2: Frakt & Betalsätt',
      description: 'Slutför köpet direkt',
      moduleIds: ['shipping', 'payment', 'review']
    }
  ]
};

const ALL_AVAILABLE_MODULES = [
  { id: 'expressWallets', name: 'Expresskassor (Apple/Google Pay)' },
  { id: 'customer', name: 'Kunduppgifter & Adress' },
  { id: 'guest', name: 'Gästutcheckning / Konto' },
  { id: 'coupon', name: 'Rabattkod & Presentkort' },
  { id: 'shipping', name: 'Leveransval & Fraktsätt' },
  { id: 'deliveryTimer', name: 'Leverans-nedräkning' },
  { id: 'packaging', name: 'Klimatsmart / Diskret förpackning' },
  { id: 'crossSell', name: 'Korsförsäljning / Bump-offers' },
  { id: 'payment', name: 'Betalmetoder & Val' },
  { id: 'euReturn', name: 'EU-Ångerknapp' },
  { id: 'review', name: 'Orderöversikt & Slutbelopp' },
  { id: 'trustBadge', name: 'Trustpilot & Säkerhetsmärken' },
  { id: 'giftWrapping', name: 'Presentinslagning' },
  { id: 'insurance', name: 'Transportförsäkring' }
];

export function CheckoutStepBuilder({
  config,
  onChangeConfig
}: {
  config: StepBuilderConfig;
  onChangeConfig: (newConfig: StepBuilderConfig) => void;
}) {
  const [editingStepIndex, setEditingStepIndex] = useState<number | null>(null);

  const handleSelectMode = (mode: CheckoutStepMode) => {
    const newSteps = JSON.parse(JSON.stringify(DEFAULT_PRESETS[mode]));
    onChangeConfig({
      ...config,
      mode,
      steps: newSteps
    });
  };

  const handleUpdateStepTitle = (index: number, title: string, desc: string) => {
    const updated = [...config.steps];
    updated[index] = { ...updated[index], title, description: desc };
    onChangeConfig({ ...config, steps: updated });
  };

  const handleMoveModule = (fromStepIndex: number, toStepIndex: number, moduleId: string) => {
    if (fromStepIndex === toStepIndex) return;
    const updated = [...config.steps];
    updated[fromStepIndex].moduleIds = updated[fromStepIndex].moduleIds.filter((id) => id !== moduleId);
    if (!updated[toStepIndex].moduleIds.includes(moduleId)) {
      updated[toStepIndex].moduleIds.push(moduleId);
    }
    onChangeConfig({ ...config, steps: updated });
  };

  const handleAddCustomStep = () => {
    const newStepNumber = config.steps.length + 1;
    const newStep: StepDefinition = {
      id: `custom-step-${Date.now()}`,
      number: newStepNumber,
      title: `Steg ${newStepNumber}: Nytt moment`,
      description: 'Beskriv vad kunden gör här',
      moduleIds: []
    };
    onChangeConfig({
      ...config,
      mode: 'custom',
      steps: [...config.steps, newStep]
    });
  };

  const handleDeleteStep = (index: number) => {
    if (config.steps.length <= 1) return;
    const stepToDelete = config.steps[index];
    const updated = config.steps.filter((_, i) => i !== index);

    // Flytta modulerna till första steget så de inte tappas bort
    if (stepToDelete.moduleIds.length > 0 && updated[0]) {
      updated[0].moduleIds = [...new Set([...updated[0].moduleIds, ...stepToDelete.moduleIds])];
    }

    // Uppdatera numrering
    const renumbered = updated.map((s, idx) => ({ ...s, number: idx + 1 }));
    onChangeConfig({ ...config, steps: renumbered, mode: 'custom' });
  };

  // Beräkna konverteringsprognos för den aktuella konfigurationen
  const getStepImpactData = () => {
    const stepCount = config.steps.length;
    if (config.mode === '1-steg') {
      return {
        impact: '+11.8 %',
        type: 'positive',
        headline: 'Högst fart & minst klickmotstånd',
        explanation: '1-stegs kassa är oslagbar för impulsköp, kosmetika, mode och enkla D2C-varor.',
        mobileFrictionScore: 28, // låg friktion
        desktopFrictionScore: 22
      };
    }
    if (config.mode === '2-steg') {
      return {
        impact: '+9.4 %',
        type: 'positive',
        headline: 'Optimal e-postfångst & cart recovery',
        explanation: 'Fångar e-post tidigt för återhämtning av övergivna kassor (+32% recovery).',
        mobileFrictionScore: 32,
        desktopFrictionScore: 25
      };
    }
    if (config.mode === '3-steg') {
      return {
        impact: '+8.2 % (för sällanköp)',
        type: 'neutral',
        headline: 'Tydlig struktur för komplexa köp',
        explanation: 'Bra för dyra varukorgar (möbler/elektronik) med inbärning och tidsbokning.',
        mobileFrictionScore: 48,
        desktopFrictionScore: 34
      };
    }
    if (config.mode === 'accordion') {
      return {
        impact: '+6.5 %',
        type: 'positive',
        headline: 'Modern SPA-upplevelse utan omladdningar',
        explanation: 'Kunden behåller sammanhanget men fyller i ett segment i taget.',
        mobileFrictionScore: 35,
        desktopFrictionScore: 29
      };
    }
    return {
      impact: `Anpassad (${stepCount} steg)`,
      type: 'neutral',
      headline: `${stepCount} steg definierade`,
      explanation: 'Överväg att hålla antalet steg under 3 för mobila konsumenter.',
      mobileFrictionScore: stepCount * 14,
      desktopFrictionScore: stepCount * 10
    };
  };

  const impactData = getStepImpactData();

  return (
    <div className="space-y-6">
      {/* VÄLJ KASSA-ARKITEKTUR */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Layers size={14} className="text-brand-500" />
            <span>Kassa-arkitektur & Steglayout</span>
          </label>
          <span className="text-[11px] text-brand-600 dark:text-brand-400 font-semibold">
            {config.steps.length} steg aktiva
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { id: '1-steg', title: '1-stegs kassa', badge: 'Mest populär', desc: 'Allt på 1 sida' },
            { id: '2-steg', title: '2-stegs kassa', badge: 'Högst recovery', desc: 'Uppgifter &rarr; Betalning' },
            { id: '3-steg', title: '3-stegs kassa', badge: 'Standard Shopify', desc: 'Kund &rarr; Frakt &rarr; Betala' },
            { id: 'accordion', title: 'Accordion-kassa', badge: 'Headless-favorit', desc: 'Utfällbara moment' },
            { id: '4-steg', title: '4-stegs (B2B)', badge: 'Stora ordrar', desc: 'Med PO & godkännande' },
            { id: 'custom', title: 'Anpassad layout', badge: 'Bygg själv', desc: 'Egen stegindelning' },
          ].map((modeOption) => (
            <button
              key={modeOption.id}
              type="button"
              onClick={() => handleSelectMode(modeOption.id as CheckoutStepMode)}
              className={`p-3 rounded-xl border text-left transition-all relative ${
                config.mode === modeOption.id
                  ? 'border-brand-500 bg-brand-50/70 dark:bg-brand-950/40 text-brand-950 dark:text-white ring-2 ring-brand-500/30'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="font-bold text-xs">{modeOption.title}</span>
                {config.mode === modeOption.id && (
                  <CheckCircle2 size={13} className="text-brand-600 dark:text-brand-400 shrink-0" />
                )}
              </div>
              <p className="text-[11px] text-slate-500 leading-tight mb-1.5">{modeOption.desc}</p>
              <span className="inline-block text-[9px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-400">
                {modeOption.badge}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* PROGNOS-KORT FÖR VALD STEGARKITEKTUR */}
      <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-brand-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Konverteringsprognos för {config.mode}
            </span>
          </div>
          <span className="text-xs font-black text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-0.5 rounded-full">
            {impactData.impact}
          </span>
        </div>

        <div>
          <h4 className="font-bold text-sm text-white">{impactData.headline}</h4>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            {impactData.explanation}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-xs">
          <div className="p-2 rounded bg-slate-800/60 border border-slate-700/50">
            <span className="text-[10px] text-slate-400 block">Mobilfriktions-index</span>
            <strong className="text-slate-200">{impactData.mobileFrictionScore} / 100</strong>
            <span className="text-[9px] text-emerald-400 block">
              {impactData.mobileFrictionScore < 35 ? 'Låg tröskel' : 'Måttlig tröskel'}
            </span>
          </div>
          <div className="p-2 rounded bg-slate-800/60 border border-slate-700/50">
            <span className="text-[10px] text-slate-400 block">Desktop-effektivitet</span>
            <strong className="text-slate-200">
              {config.mode === '1-steg' ? 'Snabbast' : 'Mycket tydlig'}
            </strong>
            <span className="text-[9px] text-brand-300 block">A/B-test rekommenderas</span>
          </div>
        </div>
      </div>

      {/* STEGINDIKATOR STIL */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
          Visuell Stegindikator
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {[
            { id: 'numbered', label: 'Numrerade cirklar (1, 2, 3)' },
            { id: 'progressbar', label: 'Progress bar (%)' },
            { id: 'tabs', label: 'Flikar / Breadcrumbs' },
            { id: 'accordion', label: 'Accordion (Expandera)' },
          ].map((styleOption) => (
            <button
              key={styleOption.id}
              type="button"
              onClick={() =>
                onChangeConfig({
                  ...config,
                  indicatorStyle: styleOption.id as any
                })
              }
              className={`p-2 rounded-lg border text-left font-medium transition ${
                config.indicatorStyle === styleOption.id
                  ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/30 text-brand-600 dark:text-brand-300'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              {styleOption.label}
            </button>
          ))}
        </div>
      </div>

      {/* STEG-KONFIGURATION & MODULER PER STEG */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Steg & Moduler i kassan
          </label>
          <button
            type="button"
            onClick={handleAddCustomStep}
            className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
          >
            <Plus size={13} /> Lägg till eget steg
          </button>
        </div>

        <div className="space-y-3">
          {config.steps.map((step, stepIndex) => (
            <div
              key={step.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 shadow-sm space-y-3"
            >
              {/* Steghuvud */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-brand-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {step.number}
                  </span>
                  <div>
                    <input
                      type="text"
                      value={step.title}
                      onChange={(e) =>
                        handleUpdateStepTitle(stepIndex, e.target.value, step.description)
                      }
                      className="font-bold text-sm bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:border-brand-500 outline-none text-slate-900 dark:text-white"
                    />
                    <input
                      type="text"
                      value={step.description}
                      onChange={(e) =>
                        handleUpdateStepTitle(stepIndex, step.title, e.target.value)
                      }
                      className="text-xs text-slate-500 bg-transparent block w-full outline-none hover:text-slate-700 dark:hover:text-slate-300"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {config.steps.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteStep(stepIndex)}
                      title="Ta bort detta steg"
                      className="p-1 text-slate-400 hover:text-rose-500 transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Moduler i detta steg */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Aktiva moduler i detta steg ({step.moduleIds.length})
                </div>

                {step.moduleIds.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">
                    Inga moduler tilldelade ännu. Flytta moduler hit från andra steg.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {step.moduleIds.map((modId) => {
                      const modInfo = ALL_AVAILABLE_MODULES.find((m) => m.id === modId);
                      return (
                        <div
                          key={modId}
                          className="text-xs bg-slate-100 dark:bg-slate-700/70 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 px-2.5 py-1 rounded-lg flex items-center gap-1.5"
                        >
                          <span>{modInfo?.name || modId}</span>

                          {/* Flytta till annat steg dropdown */}
                          {config.steps.length > 1 && (
                            <div className="flex items-center gap-0.5 ml-1 border-l border-slate-300 dark:border-slate-600 pl-1">
                              {stepIndex > 0 && (
                                <button
                                  type="button"
                                  onClick={() => handleMoveModule(stepIndex, stepIndex - 1, modId)}
                                  title="Flytta till föregående steg"
                                  className="text-slate-400 hover:text-brand-500 p-0.5"
                                >
                                  <MoveUp size={11} />
                                </button>
                              )}
                              {stepIndex < config.steps.length - 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleMoveModule(stepIndex, stepIndex + 1, modId)}
                                  title="Flytta till nästa steg"
                                  className="text-slate-400 hover:text-brand-500 p-0.5"
                                >
                                  <MoveDown size={11} />
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AUTOMATION & INSTÄLLNINGAR */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
        <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Settings2 size={14} className="text-brand-500" />
          <span>Stegbeteende & Interaktion</span>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={config.autoAdvanceOnValid}
            onChange={(e) =>
              onChangeConfig({ ...config, autoAdvanceOnValid: e.target.checked })
            }
            className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
          />
          <span className="text-slate-700 dark:text-slate-300">
            Automatiskt nästa steg vid ifylld e-post & postnummer (minskar klick)
          </span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={config.showStepSummary}
            onChange={(e) =>
              onChangeConfig({ ...config, showStepSummary: e.target.checked })
            }
            className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
          />
          <span className="text-slate-700 dark:text-slate-300">
            Visa sammanfattning av genomförda steg (t.ex. &ldquo;Kund: anna@me.com [Ändra]&rdquo;)
          </span>
        </label>
      </div>
    </div>
  );
}
