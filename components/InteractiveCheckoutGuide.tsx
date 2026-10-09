'use client';

import React, { useState } from 'react';
import { Monitor, Smartphone, Info, Lock, ArrowRight, ShoppingBag, Clock } from 'lucide-react';

// --- DATASET: KONVERTERINGSVARIABLER ---
const variablesData: Record<string, { label: string; tip: string; conv: string; aov: string }> = {
  // PLP Variables
  social_proof_badges: {
    label: 'Dynamiska Badges (Social Proof)',
    tip: 'Aktivera etiketter som "Bästsäljare" eller "I lager" direkt på produktkorten.',
    conv: '+5% CTR',
    aov: 'Neutral'
  },
  sticky_filter_mobile: {
    label: 'Sticky Visuell Filtrering',
    tip: 'I horisontell mobilvy (landscape) försvinner ofta filtermenyn. Att låsa en kompakt filterknapp i skärmkanten är kritiskt.',
    conv: '-12% Bounce Rate',
    aov: 'Neutral'
  },
  quick_add_cart: {
    label: 'Quick-Add to Cart',
    tip: 'Låt återkommande kunder köpa direkt från grid-vyn utan att besöka produktsidan.',
    conv: '+4% Totalkonvertering',
    aov: 'Neutral'
  },
  visual_price_hierarchy: {
    label: 'Visuell Prishierarki',
    tip: 'Tydlig skillnad mellan ordinarie pris och medlemspris/kampanjpris minskar kognitiv belastning.',
    conv: '+3% CTR',
    aov: '+5% AOV'
  },
  
  // PDP Variables
  shipping_urgency: {
    label: 'Fraktnedräkning (Urgency)',
    tip: '"Beställ inom 02:14:59 för leverans imorgon." Transformerar logistik till ett extremt starkt säljargument.',
    conv: '+12% Add-to-cart',
    aov: 'Neutral'
  },
  scarcity_indicator: {
    label: 'Lagersaldo (FOMO)',
    tip: '"Fåtal kvar i lager". Tvingar fram ett snabbare beslut via scarcity-principen.',
    conv: '+8% Konvertering',
    aov: 'Neutral'
  },
  installment_price: {
    label: 'Delbetalnings-psykologi',
    tip: 'Visa "Dela upp från 49 kr/mån" direkt under huvudpriset för att minska priskänsligheten.',
    conv: 'Neutral',
    aov: '+15% AOV'
  },

  // Cart Variables
  shipping_threshold: {
    label: 'Gamification av Fri Frakt',
    tip: 'Visuell progress-bar: "Köp för 49 kr till för fri frakt". Får kunden att leta efter en till produkt.',
    conv: 'Neutral',
    aov: '+18% AOV'
  },
  in_cart_upsell: {
    label: '1-Click In-Cart Upsell',
    tip: 'Erbjud små tilläggsprodukter (t.ex. impregnering, batterier) direkt i varukorgen.',
    conv: 'Neutral',
    aov: '+6% AOV'
  }
};

export function InteractiveCheckoutGuide() {
  const [device, setDevice] = useState<'desktop' | 'mobile-landscape'>('desktop');
  const [step, setStep] = useState<'PLP' | 'PDP' | 'CART'>('PLP');
  const [activeVar, setActiveVar] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);

  // --- INTERAKTIONSLOGIK ---
  const handleMouseEnter = (id: string) => {
    if (!isLocked) setActiveVar(id);
  };

  const handleMouseLeave = () => {
    if (!isLocked) setActiveVar(null);
  };

  const handleClick = (id: string) => {
    if (isLocked && activeVar === id) {
      setIsLocked(false);
    } else {
      setActiveVar(id);
      setIsLocked(true);
    }
  };

  // --- KOMPONENTER ---
  const Hotspot = ({ id, top, left }: { id: string; top: string; left: string }) => {
    const isActive = activeVar === id;
    return (
      <div 
        className="absolute z-20 group"
        style={{ top, left }}
        onMouseEnter={() => handleMouseEnter(id)}
        onMouseLeave={handleMouseLeave}
        onClick={() => handleClick(id)}
      >
        <div className="relative flex items-center justify-center cursor-pointer w-6 h-6 -ml-3 -mt-3">
          {/* Pulserande ring */}
          {!isLocked && !isActive && (
            <span className="absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75 animate-ping"></span>
          )}
          {/* Solid kärna */}
          <span className={`relative inline-flex rounded-full h-4 w-4 border-2 border-white transition-colors duration-200 ${
            isActive ? 'bg-emerald-500 scale-125' : 'bg-indigo-500'
          }`}></span>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 font-sans">
      
      {/* --- TOP NAVIGATION --- */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        
        {/* Steg-navigering (Tratten) */}
        <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-lg shadow-lg">
          {(['PLP', 'PDP', 'CART'] as const).map((s) => (
            <button
              key={s}
              onClick={() => { setStep(s); setActiveVar(null); setIsLocked(false); }}
              className={`px-6 py-2 rounded-md text-sm font-semibold transition-all ${
                step === s ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {s === 'PLP' ? '1. Kategorisida' : s === 'PDP' ? '2. Produktsida' : '3. Varukorg'}
            </button>
          ))}
        </div>

        {/* Device Toggle */}
        <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-lg shadow-lg">
          <button
            onClick={() => setDevice('desktop')}
            className={`px-4 py-2 rounded-md flex items-center gap-2 text-sm transition-all ${
              device === 'desktop' ? 'bg-slate-700 text-white font-medium' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor size={16} /> Desktop
          </button>
          <button
            onClick={() => setDevice('mobile-landscape')}
            className={`px-4 py-2 rounded-md flex items-center gap-2 text-sm transition-all ${
              device === 'mobile-landscape' ? 'bg-slate-700 text-white font-medium' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone size={16} className="rotate-90" /> Landscape
          </button>
        </div>
      </div>

      {/* --- MAIN WORKSPACE --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Vänster: Interaktiv Mockup Container */}
        <div className="lg:col-span-8 flex justify-center bg-slate-900/50 p-6 md:p-8 rounded-2xl border border-slate-800/50 min-h-[580px] overflow-hidden">
          
          <div className={`relative bg-white transition-all duration-700 ease-in-out shadow-2xl overflow-hidden ${
            device === 'mobile-landscape' 
              ? 'w-full max-w-[736px] h-[350px] rounded-[3rem] border-[12px] border-slate-800' 
              : 'w-full max-w-4xl h-[550px] rounded-xl border border-slate-200'
          }`}>
            
            {/* MOCKUP: PLP */}
            {step === 'PLP' && (
              <div className="h-full flex flex-col relative group">
                <div className="h-14 border-b bg-slate-50 flex items-center px-6 justify-between">
                  <div className="font-bold text-xl tracking-tighter text-slate-800">LOGO</div>
                  <div className="flex gap-4">
                    <span className="text-sm font-medium text-slate-600">Kategorier</span>
                    <ShoppingBag size={20} className="text-slate-800" />
                  </div>
                </div>
                
                {/* Mockup Grid */}
                <div className="flex-1 p-6 grid grid-cols-3 gap-4 overflow-y-auto bg-white">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="border border-slate-100 rounded-lg p-3 relative">
                      <div className="bg-slate-100 h-32 rounded mb-3 flex items-center justify-center text-xs text-slate-400">Produktbild</div>
                      <div className="w-2/3 h-4 bg-slate-200 rounded mb-2"></div>
                      <div className="w-1/3 h-4 bg-slate-300 rounded"></div>
                    </div>
                  ))}
                </div>

                {/* Hotspots PLP */}
                <Hotspot id="social_proof_badges" top="25%" left="22%" />
                <Hotspot id="quick_add_cart" top="55%" left="30%" />
                <Hotspot id="visual_price_hierarchy" top="65%" left="50%" />
                
                {device === 'mobile-landscape' && (
                  <Hotspot id="sticky_filter_mobile" top="85%" left="50%" />
                )}
              </div>
            )}

            {/* MOCKUP: PDP */}
            {step === 'PDP' && (
              <div className="h-full flex flex-row">
                <div className="w-1/2 bg-slate-100 p-8 flex items-center justify-center relative">
                  <div className="w-full h-full bg-slate-200 rounded-lg flex items-center justify-center text-slate-400 text-sm font-medium">Produkt Hero-bild</div>
                  {/* Hotspot: Scarcity / Badges */}
                  <Hotspot id="scarcity_indicator" top="10%" left="15%" />
                </div>
                <div className="w-1/2 p-8 relative bg-white">
                  <div className="h-6 w-3/4 bg-slate-800 rounded mb-4"></div>
                  <div className="h-8 w-1/3 bg-slate-800 rounded mb-2"></div>
                  
                  {/* Hotspot: Installment */}
                  <div className="h-4 w-1/2 bg-slate-200 rounded mb-8"></div>
                  <Hotspot id="installment_price" top="25%" left="30%" />

                  {/* Hotspot: Urgency */}
                  <div className="border border-orange-200 bg-orange-50 rounded-lg p-3 flex gap-3 mb-6 relative">
                    <Clock className="text-orange-500 shrink-0" size={20} />
                    <div className="h-4 w-3/4 bg-orange-200 rounded"></div>
                    <Hotspot id="shipping_urgency" top="50%" left="10%" />
                  </div>
                  
                  <div className="w-full bg-slate-800 h-12 rounded-lg flex items-center justify-center text-white text-sm font-semibold">Lägg i varukorg</div>
                </div>
              </div>
            )}

            {/* MOCKUP: CART */}
            {step === 'CART' && (
              <div className="h-full bg-black/20 flex justify-end relative">
                <div className="w-[400px] h-full bg-white shadow-2xl p-6 flex flex-col relative">
                  <h3 className="font-bold text-lg mb-4 text-slate-800">Din Varukorg</h3>
                  
                  {/* Hotspot: Shipping Threshold */}
                  <div className="mb-6 relative">
                    <div className="text-xs font-semibold text-slate-600 mb-2">Du har 49 kr kvar till fri frakt!</div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 w-[80%]"></div>
                    </div>
                    <Hotspot id="shipping_threshold" top="50%" left="85%" />
                  </div>

                  <div className="flex gap-4 mb-6 border-b pb-6">
                    <div className="w-20 h-20 bg-slate-100 rounded flex items-center justify-center text-xs text-slate-400">Produkt</div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-full bg-slate-200 rounded"></div>
                      <div className="h-4 w-1/2 bg-slate-200 rounded"></div>
                    </div>
                  </div>

                  {/* Hotspot: In-cart Upsell */}
                  <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 relative">
                    <div className="text-xs font-semibold text-slate-600 mb-2">Populära tillbehör</div>
                    <div className="flex gap-2">
                      <div className="w-12 h-12 bg-slate-200 rounded"></div>
                      <div className="flex-1 flex items-center justify-between">
                        <div className="h-3 w-1/2 bg-slate-200 rounded"></div>
                        <div className="h-6 w-6 bg-slate-800 rounded-full text-white text-xs flex items-center justify-center">+</div>
                      </div>
                    </div>
                    <Hotspot id="in_cart_upsell" top="50%" left="50%" />
                  </div>

                  <div className="w-full bg-emerald-500 h-12 rounded-lg mt-auto flex items-center justify-center text-white font-semibold shadow-md">Gå till kassan</div>
                </div>
              </div>
            )}

            {/* Dimmer overlay när musen är inne i rutan för att belysa hotspots */}
            <div className="absolute inset-0 bg-slate-900/5 pointer-events-none transition-opacity duration-300"></div>
          </div>
        </div>

        {/* --- HÖGER: INFO PANEL --- */}
        <div className="lg:col-span-4 sticky top-8">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl min-h-[400px] flex flex-col relative overflow-hidden">
            
            {/* Header info */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3 text-indigo-400">
                <Info size={24} />
                <h3 className="font-bold text-lg text-white">A/B-test Variabel</h3>
              </div>
              {isLocked && (
                <div className="flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded cursor-pointer hover:bg-emerald-400/20 transition-colors" onClick={() => setIsLocked(false)}>
                  <Lock size={12} /> Låst
                </div>
              )}
            </div>

            {/* Dynamiskt Innehåll */}
            {activeVar && variablesData[activeVar] ? (
              <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h4 className="text-2xl font-bold text-white mb-3">
                  {variablesData[activeVar].label}
                </h4>
                <p className="text-slate-400 leading-relaxed mb-8 flex-1">
                  {variablesData[activeVar].tip}
                </p>
                
                <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-6">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1 block">
                      Konvertering
                    </span>
                    <span className={`text-xl font-bold ${variablesData[activeVar].conv.includes('+') ? 'text-emerald-400' : variablesData[activeVar].conv.includes('-') ? 'text-red-400' : 'text-slate-300'}`}>
                      {variablesData[activeVar].conv}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1 block">
                      CLV / AOV
                    </span>
                    <span className={`text-xl font-bold ${variablesData[activeVar].aov.includes('+') ? 'text-emerald-400' : variablesData[activeVar].aov.includes('-') ? 'text-red-400' : 'text-slate-300'}`}>
                      {variablesData[activeVar].aov}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-70">
                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                  <ArrowRight size={24} className="text-slate-400" />
                </div>
                <h4 className="text-lg font-medium text-slate-300 mb-2">Upptäck variabler</h4>
                <p className="text-sm text-slate-500 max-w-[220px]">
                  Hovra över de pulserande markörerna i vyn till vänster. Klicka för att låsa fast insikten.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default InteractiveCheckoutGuide;
