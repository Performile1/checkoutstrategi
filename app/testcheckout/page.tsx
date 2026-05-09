'use client';

import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { 
  CheckCircle2, 
  CreditCard, 
  Truck, 
  User, 
  Package,
  TrendingUp,
  Settings,
  Home,
  MapPin,
  Zap,
  DollarSign,
  RefreshCw,
  HelpCircle,
  AlertTriangle,
  Clock,
  Users,
  Shield,
  Tag,
  QrCode as QrCodeIcon,
  Download,
  GripVertical,
  Lock,
  Star,
  ShoppingCart,
  Map as MapIcon,
  Monitor,
  Shirt,
  Sofa,
  Coffee,
  Gauge
} from 'lucide-react';

// --- TYPER OCH DATA ---

type CheckoutSection = { id: string; title: string; icon: React.ReactNode; description: string; };
type DeliveryOption = { id: string; name: string; icon: React.ReactNode; maxWeight: number; allowedSizes: string[] };

const CARD_PROVIDERS = [
  { id: 'visa', name: 'Visa', logo: '/logos/visa.svg', conversionImpact: { se: 3, no: 3, dk: 3, fi: 3 } },
  { id: 'mastercard', name: 'Mastercard', logo: '/logos/mastercard.svg', conversionImpact: { se: 3, no: 3, dk: 3, fi: 3 } },
  { id: 'amex', name: 'American Express', logo: '/logos/amex.svg', conversionImpact: { se: 1, no: 1, dk: 1, fi: 1 } },
];

const PAYMENT_METHODS = [
  { id: 'klarna', name: 'Klarna', icon: <CreditCard size={18} />, logo: '/logos/klarna.png', conversionImpact: { se: 5, no: 5, dk: 4, fi: 4 } },
  { id: 'card', name: 'Kort', icon: <CreditCard size={18} />, logo: undefined, conversionImpact: { se: 5, no: 5, dk: 5, fi: 5 } },
  { id: 'swish', name: 'Swish', icon: <CreditCard size={18} />, logo: '/logos/swish.svg', conversionImpact: { se: 8, no: 0, dk: 0, fi: 0 } },
  { id: 'vipps', name: 'Vipps', icon: <CreditCard size={18} />, logo: '/logos/vipps.svg', conversionImpact: { se: 0, no: 8, dk: 0, fi: 0 } },
  { id: 'paypal', name: 'PayPal', icon: <CreditCard size={18} />, logo: '/logos/paypal.svg', conversionImpact: { se: 3, no: 3, dk: 3, fi: 3 } },
];

const CARRIERS = [
  { id: 'postnord', name: 'PostNord', logo: '/logos/postnord.svg', trustScore: 4.2, marketImpact: { se: 3, no: 2, dk: 3, fi: 3 } },
  { id: 'dhl', name: 'DHL', logo: '/logos/dhl.svg', trustScore: 1.4, marketImpact: { se: -8, no: -5, dk: -6, fi: -7 } },
  { id: 'bring', name: 'Bring', logo: '/logos/bring.svg', trustScore: 4.0, marketImpact: { se: 2, no: 5, dk: 4, fi: 3 } },
  { id: 'instabox', name: 'Instabox', logo: '/logos/instabox.svg', trustScore: 4.4, marketImpact: { se: 4, no: 3, dk: 3, fi: 3 } },
  { id: 'airmee', name: 'Airmee', logo: '/logos/airmee.svg', trustScore: 4.1, marketImpact: { se: 3, no: 2, dk: 2, fi: 2 } },
];

// Delivery options now have physical constraints
const DELIVERY_OPTIONS: DeliveryOption[] = [
  { id: 'pickup', name: 'Hämtas i butik', icon: <Package size={18} />, maxWeight: 1000, allowedSizes: ['small', 'medium', 'bulky'] },
  { id: 'locker', name: 'Paketskåp', icon: <Home size={18} />, maxWeight: 20, allowedSizes: ['small', 'medium'] },
  { id: 'point', name: 'Paketombud', icon: <MapPin size={18} />, maxWeight: 20, allowedSizes: ['small', 'medium'] },
  { id: 'home', name: 'Hemleverans', icon: <Truck size={18} />, maxWeight: 1000, allowedSizes: ['small', 'medium', 'bulky'] },
  { id: 'mailbox', name: 'Brevlåda', icon: <Package size={18} />, maxWeight: 2, allowedSizes: ['small'] },
];

const PRODUCTS = [
  { id: 'tshirt', name: 'Basic T-shirt', price: 199, industry: 'kläder', weight: 0.2, size: 'small', icon: <Shirt size={24} /> },
  { id: 'sneakers', name: 'Premium Sneakers', price: 1299, industry: 'kläder', weight: 0.8, size: 'medium', icon: <Package size={24} /> },
  { id: 'tv', name: 'Smart TV 55"', price: 6999, industry: 'elektronik', weight: 15.0, size: 'bulky', icon: <Monitor size={24} /> },
  { id: 'sofa', name: 'Soffa 3-sits', price: 14999, industry: 'hem', weight: 65.0, size: 'bulky', icon: <Sofa size={24} /> },
  { id: 'coffee', name: 'Kaffebönor 2kg', price: 349, industry: 'mat', weight: 2.0, size: 'medium', icon: <Coffee size={24} /> },
];

const SECTIONS: CheckoutSection[] = [
  { id: 'customer', title: 'Kunduppgifter', icon: <User size={18} />, description: 'Namn, e-post, adress' },
  { id: 'guest', title: 'Gästutcheckning', icon: <User size={18} />, description: 'Köp utan konto' },
  { id: 'coupon', title: 'Rabattkod', icon: <DollarSign size={18} />, description: 'Ange rabattkod' },
  { id: 'shipping', title: 'Leveransval', icon: <Truck size={18} />, description: 'Fraktalternativ och ombud' },
  { id: 'crossSell', title: 'Korsförsäljning', icon: <TrendingUp size={18} />, description: 'Rekommenderade tillbehör' },
  { id: 'payment', title: 'Betalning', icon: <CreditCard size={18} />, description: 'Betalmetoder och kort' },
  { id: 'euReturn', title: 'EU-Ångerknapp', icon: <RefreshCw size={18} />, description: 'Ångra köp enligt EU-direktiv' },
  { id: 'review', title: 'Orderöversikt', icon: <Package size={18} />, description: 'Sammanfattning av köp' },
  { id: 'lowStock', title: 'Lagersaldovarning', icon: <AlertTriangle size={18} />, description: 'Endast X kvar i lager' },
  { id: 'cartTimer', title: 'Varukorgstimer', icon: <Clock size={18} />, description: 'Reserverad i X minuter' },
  { id: 'socialProof', title: 'Social Proof', icon: <Users size={18} />, description: 'X personer tittar nu' },
  { id: 'giftWrapping', title: 'Presentinslagning', icon: <Package size={18} />, description: 'Lägg till presentinslagning' },
  { id: 'insurance', title: 'Försäkring', icon: <Shield size={18} />, description: 'Lägg till försäkring' },
  { id: 'giftMessage', title: 'Presentkort', icon: <DollarSign size={18} />, description: 'Lägg till hälsning' },
];

// Helper för fallback bilder
const FallbackImage = ({ src, alt, className }: { src?: string, alt: string, className?: string }) => {
  const [error, setError] = useState(false);
  if (!src || error) {
    return <div className={`flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold text-[10px] rounded ${className}`}>{alt.substring(0, 3).toUpperCase()}</div>;
  }
  return <img src={src} alt={alt} className={className} onError={() => setError(true)} />;
};

export default function TestCheckoutPage() {
  const [layoutOrder, setLayoutOrder] = useState(['customer', 'guest', 'coupon', 'shipping', 'payment', 'review']);
  const [activeTab, setActiveTab] = useState('settings');
  const [activeView, setActiveView] = useState<'checkout' | 'orderConfirmation' | 'return' | 'export'>('checkout');

  // -- STATE --
  const [customerCountry, setCustomerCountry] = useState('SE');
  const [isGuestCheckout, setIsGuestCheckout] = useState(true);
  const [hasAutofill, setHasAutofill] = useState(true);
  const [hideHeaderFooter, setHideHeaderFooter] = useState(false);
  
  const [selectedProductId, setSelectedProductId] = useState('sneakers');
  const selectedProduct = PRODUCTS.find(p => p.id === selectedProductId) || PRODUCTS[1];

  const [hasUpsell, setHasUpsell] = useState(false);
  const [hasCrossSell, setHasCrossSell] = useState(false);
  const [showProductDiscount, setShowProductDiscount] = useState(false);
  const [discountRate, setDiscountRate] = useState(20);
  
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(0);
  const [baseShippingCost, setBaseShippingCost] = useState(49); // Kundens standardfrakt
  const [allowMapSelection, setAllowMapSelection] = useState(true); // Välja specifikt ombud
  const [preselectShipping, setPreselectShipping] = useState(false);
  
  const [selectedDeliveryOptions, setSelectedDeliveryOptions] = useState(['point', 'home', 'locker']);
  const [selectedCarriers, setSelectedCarriers] = useState(['postnord', 'instabox', 'airmee']);
  
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>(['klarna', 'card', 'swish']);
  const [selectedCardProviders, setSelectedCardProviders] = useState<string[]>(['visa', 'mastercard']);
  
  const [showLowStockWarning, setShowLowStockWarning] = useState(false);
  const [showCartTimer, setShowCartTimer] = useState(false);
  const [showSocialProof, setShowSocialProof] = useState(false);
  
  const [addGiftWrapping, setAddGiftWrapping] = useState(false);
  const [addInsurance, setAddInsurance] = useState(false);
  const [addGiftMessage, setAddGiftMessage] = useState(false);
  const [showEuReturnButton, setShowEuReturnButton] = useState(false);
  
  const [ctaColor, setCtaColor] = useState<'green' | 'orange' | 'red' | 'low-contrast'>('green');
  const [ctaText, setCtaText] = useState<'complete' | 'pay' | 'confirm'>('complete');

  // Filtrera leveransalternativ baserat på produktens storlek/vikt
  const availableDeliveryOptions = selectedDeliveryOptions.filter(optId => {
    const opt = DELIVERY_OPTIONS.find(o => o.id === optId);
    if (!opt) return false;
    if (selectedProduct.weight > opt.maxWeight) return false;
    if (!opt.allowedSizes.includes(selectedProduct.size)) return false;
    return true;
  });

  // -- LOGIK & BERÄKNINGAR --
  const getIndustryBenchmark = (industry: string) => {
    switch(industry) {
      case 'elektronik': return 0.04; // Låg fraktacceptans
      case 'kläder': return 0.07;
      case 'hem': return 0.12; // Möbel/inredning högre
      case 'mat': return 0.18;
      default: return 0.10;
    }
  };

  const calculateConversionScore = () => {
    let score = 45; // Baseline Baymard

    // 1. Ordning och Layout
    const customerIdx = layoutOrder.indexOf('customer');
    const shippingIdx = layoutOrder.indexOf('shipping');
    const paymentIdx = layoutOrder.indexOf('payment');
    const guestIdx = layoutOrder.indexOf('guest');

    if (customerIdx === 0) score += 3; else if (customerIdx > 2) score -= 8;
    if (paymentIdx !== -1 && shippingIdx !== -1 && paymentIdx < shippingIdx) score -= 15; // Dödsynd
    if (guestIdx !== -1 && guestIdx < 3) score += 3; else score -= 5;
    if (hideHeaderFooter) score += 4;

    // 2. UX
    if (isGuestCheckout) score += 12; else score -= 18;
    if (hasAutofill) score += 6;

    // 3. Frakt & Logistik (Avancerad motor)
    let totalOrderValue = selectedProduct.price;
    if (addGiftWrapping) totalOrderValue += 49;
    if (addInsurance) totalOrderValue += 19;

    const actualShippingCost = (freeShippingThreshold > 0 && totalOrderValue >= freeShippingThreshold) ? 0 : baseShippingCost;
    const shippingRatio = actualShippingCost / totalOrderValue;
    const benchmark = getIndustryBenchmark(selectedProduct.industry);

    if (actualShippingCost === 0) {
      score += 12; // Fri frakt är extremt starkt
    } else {
      if (shippingRatio > benchmark + 0.05) score -= 12; // Straff: Frakten är för dyr för branschen
      else if (shippingRatio > benchmark) score -= 4;
      else score += 3; // Bra fraktpris!
    }

    if (availableDeliveryOptions.length >= 3) score += 6;
    else if (availableDeliveryOptions.length === 1) score -= 6; // Dåligt med alternativ
    else if (availableDeliveryOptions.length === 0) score -= 30; // STOR varning, kan ej leverera!

    if (allowMapSelection && availableDeliveryOptions.includes('point')) score += 4; // Karta ökar trygghet
    if (preselectShipping) score += 2;

    // Marknadslogik
    const marketKey = customerCountry.toLowerCase() as 'se' | 'no' | 'dk' | 'fi';
    let carrierTrustScore = 0;
    selectedCarriers.forEach(cid => {
      const c = CARRIERS.find(x => x.id === cid);
      if (c && c.marketImpact[marketKey]) carrierTrustScore += c.marketImpact[marketKey];
    });
    score += Math.min(carrierTrustScore, 8); // Max 8% boost från transportörer

    let paymentTrustScore = 0;
    selectedPaymentMethods.forEach(mid => {
      const m = PAYMENT_METHODS.find(x => x.id === mid);
      if (m && m.conversionImpact[marketKey]) paymentTrustScore += m.conversionImpact[marketKey];
    });
    score += Math.min(paymentTrustScore, 12); // Max 12% boost från betalmedel (ex Swish+Klarna i SE)

    // 4. Psykologi & FOMO
    if (showLowStockWarning) score += 3;
    if (showCartTimer) score += 1; // Timer ger stress (kan skrämma bort vissa)
    if (showSocialProof) score += 2;
    if (showProductDiscount) score += Math.min(Math.round(discountRate * 0.3), 8);

    // 5. Tilläggstjänster (Friktion)
    if (hasCrossSell) score -= 2; // Friktion i kassan
    if (showEuReturnButton) score -= 5; // Negativ trygghet
    if (addInsurance) score -= 1; // Får folk att undra om frakten är osäker
    
    // 6. Knapp (CTA)
    if (ctaColor === 'green') score += 2;
    else if (ctaColor === 'low-contrast') score -= 8;
    if (ctaText === 'pay') score -= 3;
    else if (ctaText === 'complete' || ctaText === 'confirm') score += 1;

    return Math.min(Math.max(Math.round(score), 0), 100);
  };

  const getSectionDescription = (sectionId: string) => {
    switch (sectionId) {
      case 'customer': return hasAutofill ? 'Autofill aktiverat. Minskar friktion.' : 'Ingen autofill. Användarna måste knappa in manuellt.';
      case 'guest': return isGuestCheckout ? 'Gästutcheckning. Minskar avhopp rejält.' : 'Konto krävs. Skapar enorm friktion men ökar LTV.';
      case 'shipping': return `${availableDeliveryOptions.length} tillgängliga alternativ för vald produktvikt (${selectedProduct.weight}kg).`;
      case 'payment': return 'Erbjuder du rätt betalsätt för din marknad?';
      case 'review': return `Ordervärde: ${selectedProduct.price} kr. Fraktkvot: ${Math.round((baseShippingCost/selectedProduct.price)*100)}% (Riktmärke: ${getIndustryBenchmark(selectedProduct.industry)*100}%).`;
      case 'lowStock': return 'Skapar urgens, men använd med måtta för att bygga genuint förtroende.';
      default: return 'En del av checkout-flödet.';
    }
  };

  // Auto-toggles för blocks
  useEffect(() => {
    setLayoutOrder(prev => {
      const newOrder = [...prev];
      if (showCartTimer && !newOrder.includes('cartTimer')) newOrder.splice(2, 0, 'cartTimer');
      else if (!showCartTimer && newOrder.includes('cartTimer')) newOrder.splice(newOrder.indexOf('cartTimer'), 1);
      return newOrder;
    });
  }, [showCartTimer]);

  useEffect(() => {
    setLayoutOrder(prev => {
      const newOrder = [...prev];
      if (showLowStockWarning && !newOrder.includes('lowStock')) newOrder.splice(2, 0, 'lowStock');
      else if (!showLowStockWarning && newOrder.includes('lowStock')) newOrder.splice(newOrder.indexOf('lowStock'), 1);
      return newOrder;
    });
  }, [showLowStockWarning]);

  useEffect(() => {
    setLayoutOrder(prev => {
      const newOrder = [...prev];
      if (showSocialProof && !newOrder.includes('socialProof')) newOrder.splice(2, 0, 'socialProof');
      else if (!showSocialProof && newOrder.includes('socialProof')) newOrder.splice(newOrder.indexOf('socialProof'), 1);
      return newOrder;
    });
  }, [showSocialProof]);

  useEffect(() => {
    setLayoutOrder(prev => {
      const newOrder = [...prev];
      if (addGiftWrapping && !newOrder.includes('giftWrapping')) newOrder.push('giftWrapping');
      else if (!addGiftWrapping && newOrder.includes('giftWrapping')) newOrder.splice(newOrder.indexOf('giftWrapping'), 1);
      return newOrder;
    });
  }, [addGiftWrapping]);

  useEffect(() => {
    setLayoutOrder(prev => {
      const newOrder = [...prev];
      if (addInsurance && !newOrder.includes('insurance')) newOrder.push('insurance');
      else if (!addInsurance && newOrder.includes('insurance')) newOrder.splice(newOrder.indexOf('insurance'), 1);
      return newOrder;
    });
  }, [addInsurance]);

  useEffect(() => {
    setLayoutOrder(prev => {
      const newOrder = [...prev];
      if (addGiftMessage && !newOrder.includes('giftMessage')) newOrder.push('giftMessage');
      else if (!addGiftMessage && newOrder.includes('giftMessage')) newOrder.splice(newOrder.indexOf('giftMessage'), 1);
      return newOrder;
    });
  }, [addGiftMessage]);

  useEffect(() => {
    setLayoutOrder(prev => {
      const newOrder = [...prev];
      if (showEuReturnButton && !newOrder.includes('euReturn')) {
        const reviewIndex = newOrder.indexOf('review');
        if (reviewIndex > -1) newOrder.splice(reviewIndex, 0, 'euReturn');
        else newOrder.push('euReturn');
      } else if (!showEuReturnButton && newOrder.includes('euReturn')) {
        newOrder.splice(newOrder.indexOf('euReturn'), 1);
      }
      return newOrder;
    });
  }, [showEuReturnButton]);

  useEffect(() => {
    setLayoutOrder(prev => {
      const newOrder = [...prev];
      if (hasCrossSell && !newOrder.includes('crossSell')) {
        const shippingIndex = newOrder.indexOf('shipping');
        if (shippingIndex > -1) newOrder.splice(shippingIndex + 1, 0, 'crossSell');
        else newOrder.push('crossSell');
      } else if (!hasCrossSell && newOrder.includes('crossSell')) {
        newOrder.splice(newOrder.indexOf('crossSell'), 1);
      }
      return newOrder;
    });
  }, [hasCrossSell]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    if (result.type === 'SECTION') {
      const items = Array.from(layoutOrder);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      setLayoutOrder(items);
    }
  };

  const conversionScore = calculateConversionScore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 pb-20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 mb-2">
            <Settings size={20} />
            <span className="text-sm font-semibold uppercase tracking-wide">Interactive Lab</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">Checkout Lab</h1>
          <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">Experimentera med e-handelspsykologi och se hur konverteringen påverkas i realtid baserat på riktig data.</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* VÄNSTER PANEL (Live Preview) */}
          <div className="space-y-6 lg:col-span-7">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Live Preview</h2>
              <div className="flex gap-2 bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-lg">
                {(['checkout', 'orderConfirmation'] as const).map(view => (
                  <button
                    key={view}
                    onClick={() => setActiveView(view)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                      activeView === view ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    {view.charAt(0).toUpperCase() + view.slice(1).replace('orderConfirmation', 'Orderbekräftelse')}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all">
              {activeView === 'checkout' && (
                <>
                  {!hideHeaderFooter && (
                    <div className="bg-slate-900 dark:bg-slate-950 px-6 py-4 flex items-center justify-between">
                      <div className="text-white font-semibold flex items-center gap-2"><ShoppingCart size={18} /> Kassa</div>
                      <div className="flex items-center gap-3 text-slate-400 text-sm">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center"><User size={14} /></div>
                        <div className="w-24 h-2 rounded bg-slate-800" />
                      </div>
                    </div>
                  )}

                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="checkout-sections" type="SECTION">
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="p-4 sm:p-6 space-y-4 sm:space-y-5 bg-slate-50/50 dark:bg-slate-900/20 overflow-visible">
                          {layoutOrder.map((sectionId, index) => {
                            const section = SECTIONS.find(s => s.id === sectionId);
                            if (!section) return null;
                            return (
                              <Draggable key={section.id} draggableId={section.id} index={index}>
                                {(provided, snapshot) => (
                                  <div 
                                    ref={provided.innerRef} 
                                    {...provided.draggableProps} 
                                    className={`bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 hover:border-brand-400 dark:hover:border-brand-500 transition-all duration-200 shadow-sm relative group ${snapshot.isDragging ? 'shadow-xl ring-2 ring-brand-500 scale-[1.02] z-50' : 'z-10 hover:z-40'}`}
                                  >
                                    <div {...provided.dragHandleProps} className="absolute top-4 right-4 text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing hover:text-brand-500 p-1"><GripVertical size={18} /></div>

                                    <div className="flex items-start gap-4">
                                      <div className="text-brand-600 dark:text-brand-400 mt-0.5 p-2 bg-brand-50 dark:bg-brand-900/30 rounded-lg border border-brand-100 dark:border-brand-800/50 shrink-0">
                                        {section.icon}
                                      </div>
                                      
                                      <div className="flex-1 min-w-0 pr-6 relative">
                                        <div className="flex items-center gap-2 mb-3">
                                          <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-base">{section.title}</h3>
                                          
                                          {/* Snyggare Tooltip med z-index fix */}
                                          <div className="group/tooltip relative inline-flex items-center justify-center">
                                            <HelpCircle size={14} className="text-slate-400 hover:text-brand-500 transition-colors cursor-help" />
                                            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-56 p-3 bg-slate-900 text-white text-xs leading-relaxed rounded-lg shadow-2xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all text-center pointer-events-none z-[100] border border-slate-700">
                                              {getSectionDescription(sectionId)}
                                              {/* Liten pil i botten av tooltipen */}
                                              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                                            </div>
                                          </div>
                                        </div>
                                        
                                        {/* INNEHÅLL */}
                                        <div className="space-y-3">
                                          {sectionId === 'customer' && (
                                            <div className="space-y-3">
                                              <select value={customerCountry} onChange={(e) => setCustomerCountry(e.target.value)} className="w-full h-10 bg-slate-50 dark:bg-slate-900 rounded-lg px-3 text-sm text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-brand-500 outline-none">
                                                <option value="SE">Sverige</option><option value="NO">Norge</option><option value="DK">Danmark</option><option value="FI">Finland</option>
                                              </select>
                                              {hasAutofill ? (
                                                <>
                                                  <div className="h-10 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-lg px-3 flex items-center"><span className="text-xs font-medium text-green-700 dark:text-green-400">Autofyllt via mobilnummer</span></div>
                                                </>
                                              ) : (
                                                <>
                                                  <div className="h-10 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg" />
                                                  <div className="h-10 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg" />
                                                </>
                                              )}
                                            </div>
                                          )}

                                          {sectionId === 'guest' && (
                                            <>
                                              <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800/50">
                                                <CheckCircle2 size={18} className="text-green-600 dark:text-green-500 shrink-0" />
                                                <span className="text-sm font-medium text-green-900 dark:text-green-300">{isGuestCheckout ? 'Snabbkassa aktiv (Gäst)' : 'Konto krävs för att handla'}</span>
                                              </div>
                                            </>
                                          )}

                                          {sectionId === 'coupon' && (
                                            <div className="flex gap-2">
                                              <input type="text" placeholder="Rabattkod" disabled className="flex-1 h-10 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 text-sm cursor-not-allowed" />
                                              <button disabled className="h-10 px-5 bg-slate-800 dark:bg-slate-700 rounded-lg text-white text-sm font-medium opacity-50 cursor-not-allowed transition-colors hover:bg-slate-700">Använd</button>
                                            </div>
                                          )}

                                          {sectionId === 'shipping' && (
                                            <>
                                              {availableDeliveryOptions.length === 0 ? (
                                                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
                                                  <AlertTriangle className="text-red-500 shrink-0" size={18} />
                                                  <div className="text-sm text-red-800 dark:text-red-300 font-medium">Inga fraktalternativ stöder produktens vikt eller storlek! Kassan är låst.</div>
                                                </div>
                                              ) : (
                                                <div className="space-y-2">
                                                  {availableDeliveryOptions.map((optId) => {
                                                    const opt = DELIVERY_OPTIONS.find(o => o.id === optId);
                                                    if (!opt) return null;
                                                    const isFree = freeShippingThreshold > 0 && selectedProduct.price >= freeShippingThreshold;
                                                    return (
                                                      <div key={opt.id} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                                                        <div className="text-slate-400 dark:text-slate-500">{opt.icon}</div>
                                                        <div className="flex-1 flex justify-between items-center">
                                                          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{opt.name}</span>
                                                          <span className="text-sm font-semibold text-slate-900 dark:text-white">{isFree ? '0 kr' : `${baseShippingCost} kr`}</span>
                                                        </div>
                                                      </div>
                                                    );
                                                  })}
                                                </div>
                                              )}
                                              
                                              {allowMapSelection && availableDeliveryOptions.includes('point') && (
                                                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 rounded-lg flex items-center justify-between cursor-pointer hover:bg-blue-100 transition-colors">
                                                  <div className="flex items-center gap-2">
                                                    <MapIcon size={16} className="text-blue-600 dark:text-blue-400" />
                                                    <span className="text-sm font-medium text-blue-900 dark:text-blue-200">Välj specifikt ombud på karta</span>
                                                  </div>
                                                  <span className="text-xs bg-white dark:bg-slate-800 px-2 py-1 rounded shadow-sm font-semibold text-slate-600">+4% Conv.</span>
                                                </div>
                                              )}

                                              {selectedCarriers.length > 0 && availableDeliveryOptions.length > 0 && (
                                                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                                                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">Möjliga transportörer</div>
                                                  <div className="flex flex-wrap gap-2">
                                                    {selectedCarriers.map((carrierId) => {
                                                      const carrier = CARRIERS.find(c => c.id === carrierId);
                                                      if (!carrier) return null;
                                                      return (
                                                        <div key={carrier.id} className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-700">
                                                          <FallbackImage src={carrier.logo} alt={carrier.name} className="w-auto h-4 object-contain" />
                                                          <span className="text-[10px] font-bold text-green-600 dark:text-green-500">★{carrier.trustScore}</span>
                                                        </div>
                                                      );
                                                    })}
                                                  </div>
                                                </div>
                                              )}
                                            </>
                                          )}

                                          {sectionId === 'payment' && (
                                            <>
                                              <div className="flex items-center gap-3 mb-4 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                                                <div className="w-12 h-6 flex items-center justify-center bg-white dark:bg-slate-800 rounded border border-slate-100 dark:border-slate-600">
                                                  <CreditCard size={14} className="text-slate-400" />
                                                </div>
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                  Betalning via standardkassa
                                                </span>
                                              </div>
                                              <div className="space-y-2">
                                                {selectedPaymentMethods.map((methodId) => {
                                                  const method = PAYMENT_METHODS.find(m => m.id === methodId);
                                                  if (!method) return null;
                                                  const marketKey = customerCountry.toLowerCase() as keyof typeof method.conversionImpact;
                                                  const impact = method.conversionImpact[marketKey];
                                                  return (
                                                    <div key={method.id} className="flex items-center p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                                                      <div className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-600 mr-3" />
                                                      {method.logo ? (
                                                        <FallbackImage src={method.logo} alt={method.name} className="h-5 w-auto max-w-[40px] object-contain mr-3" />
                                                      ) : (
                                                        <div className="w-8 flex justify-center text-slate-400 mr-3">{method.icon}</div>
                                                      )}
                                                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200 flex-1">{method.name}</span>
                                                      {impact !== 0 && (
                                                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${impact > 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                                          {impact > 0 ? '+' : ''}{impact}%
                                                        </span>
                                                      )}
                                                    </div>
                                                  );
                                                })}
                                              </div>
                                              {selectedCardProviders.length > 0 && (
                                                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50 flex flex-wrap gap-2 items-center">
                                                  <span className="text-xs font-medium text-slate-400 mr-2">Accepteras:</span>
                                                  {selectedCardProviders.map((providerId) => {
                                                    const provider = CARD_PROVIDERS.find(p => p.id === providerId);
                                                    if (!provider) return null;
                                                    return <div key={provider.id} className="bg-white dark:bg-slate-900 p-1 border border-slate-200 dark:border-slate-700 rounded"><FallbackImage src={provider.logo} alt={provider.name} className="h-4 w-auto object-contain" /></div>;
                                                  })}
                                                </div>
                                              )}
                                            </>
                                          )}

                                          {sectionId === 'review' && (
                                            <>
                                              {showProductDiscount && (
                                                <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/30 rounded-lg mb-4">
                                                  <Tag size={18} className="text-green-600 dark:text-green-500 shrink-0" />
                                                  <div>
                                                    <div className="text-sm font-semibold text-green-900 dark:text-green-100">Köp nu och spara</div>
                                                    <div className="text-xs text-green-700 dark:text-green-400 mt-0.5">Spara {discountRate}% på din beställning</div>
                                                  </div>
                                                </div>
                                              )}
                                              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                                                <div className="flex items-start gap-4">
                                                  <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 flex-shrink-0 flex items-center justify-center text-slate-400">
                                                    {selectedProduct.icon}
                                                  </div>
                                                  <div className="flex-1">
                                                    <div className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{selectedProduct.name}</div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 capitalize">{selectedProduct.size} • {selectedProduct.weight}kg</div>
                                                    <div className="mt-2 font-medium text-slate-900 dark:text-white">{selectedProduct.price} kr</div>
                                                  </div>
                                                </div>
                                                
                                                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
                                                  <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                                                    <span>Delsumma</span>
                                                    <span>{selectedProduct.price} kr</span>
                                                  </div>
                                                  <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                                                    <span>Frakt</span>
                                                    <span>{(freeShippingThreshold > 0 && selectedProduct.price >= freeShippingThreshold) ? '0 kr' : `${baseShippingCost} kr`}</span>
                                                  </div>
                                                  <div className="flex justify-between font-bold text-lg text-slate-900 dark:text-white mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                                                    <span>Totalt att betala</span>
                                                    <span>{(freeShippingThreshold > 0 && selectedProduct.price >= freeShippingThreshold) ? selectedProduct.price : selectedProduct.price + baseShippingCost} kr</span>
                                                  </div>
                                                </div>
                                              </div>
                                            </>
                                          )}

                                          {/* FOMO BLOCKS */}
                                          {sectionId === 'lowStock' && showLowStockWarning && (
                                            <div className="flex items-center gap-3 p-3.5 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 rounded-lg animate-pulse">
                                              <AlertTriangle size={18} className="text-red-600 dark:text-red-500 shrink-0" />
                                              <div className="flex-1">
                                                <div className="text-sm font-bold text-red-900 dark:text-red-100">Endast 2 kvar i lager!</div>
                                                <div className="text-xs text-red-700 dark:text-red-300 mt-0.5">Andra kunder tittar också på denna.</div>
                                              </div>
                                            </div>
                                          )}

                                          {sectionId === 'cartTimer' && showCartTimer && (
                                            <div className="flex items-center gap-3 p-3.5 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-lg">
                                              <Clock size={18} className="text-amber-600 dark:text-amber-500 shrink-0" />
                                              <div className="flex-1">
                                                <div className="text-sm font-bold text-amber-900 dark:text-amber-100">Varukorgen reserverad i 09:42</div>
                                              </div>
                                            </div>
                                          )}

                                          {sectionId === 'socialProof' && showSocialProof && (
                                            <div className="flex items-center gap-3 p-3.5 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 rounded-lg">
                                              <Users size={18} className="text-blue-600 dark:text-blue-500 shrink-0" />
                                              <div className="flex-1">
                                                <div className="text-sm font-bold text-blue-900 dark:text-blue-100">Mycket populär produkt!</div>
                                                <div className="text-xs text-blue-700 dark:text-blue-300 mt-0.5">3 andra köper just nu.</div>
                                              </div>
                                            </div>
                                          )}

                                          {/* INSURANCE/GIFT/RETURN BLOCKS */}
                                          {sectionId === 'insurance' && addInsurance && (
                                            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg">
                                              <Shield size={20} className="text-slate-500 shrink-0" />
                                              <div className="flex-1"><div className="text-sm font-semibold text-slate-800 dark:text-slate-200">Leveransförsäkring (+19 kr)</div></div>
                                              <div className="w-5 h-5 rounded border-2 border-slate-300 dark:border-slate-600" />
                                            </div>
                                          )}

                                          {sectionId === 'giftWrapping' && addGiftWrapping && (
                                            <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800/30 rounded-lg">
                                              <Package size={20} className="text-purple-600 shrink-0" />
                                              <div className="flex-1"><div className="text-sm font-semibold text-purple-900 dark:text-purple-100">Presentinslagning (+49 kr)</div></div>
                                              <div className="w-5 h-5 rounded border-2 border-purple-300 dark:border-purple-700" />
                                            </div>
                                          )}

                                          {sectionId === 'euReturn' && showEuReturnButton && (
                                            <div className="flex items-center justify-center gap-2 p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                                              <RefreshCw size={16} className="text-slate-500" />
                                              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Ångra köp (14 dagar)</span>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>

                  <div className="p-6 bg-slate-50/50 dark:bg-slate-900/20 border-t border-slate-200 dark:border-slate-700">
                    <button
                      onClick={() => setActiveView('orderConfirmation')}
                      className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all shadow-lg hover:-translate-y-0.5 ${
                        ctaColor === 'green' ? 'bg-green-600 hover:bg-green-500 text-white shadow-green-600/20' 
                        : ctaColor === 'orange' ? 'bg-orange-500 hover:bg-orange-400 text-white shadow-orange-500/20' 
                        : ctaColor === 'red' ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/20' 
                        : 'bg-slate-300 hover:bg-slate-400 text-slate-800 shadow-none'
                      }`}
                    >
                      {ctaText === 'complete' && 'Slutför köp'}
                      {ctaText === 'pay' && 'Betala säkert'}
                      {ctaText === 'confirm' && 'Bekräfta order'}
                    </button>
                    <div className="text-center text-xs font-medium text-slate-400 dark:text-slate-500 mt-4 flex items-center justify-center gap-2">
                      <Lock size={12} /> Säker krypterad betalning
                    </div>
                  </div>
                </>
              )}

              {activeView !== 'checkout' && (
                <div className="p-12 text-center text-slate-500">
                  Byt tillbaka till Checkout för att använda Drag & Drop editorn!
                </div>
              )}
            </div>
          </div>

          {/* HÖGER PANEL (Settings & Engine) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* HERO: Conversion Score Block */}
            <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-2xl flex items-center justify-between relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-32 h-32 bg-brand-500/20 rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10">
                <div className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-1">
                  <Gauge size={16} className="text-brand-400" /> Konvertering
                </div>
                <div className="text-xs text-slate-500">Uppskattad genomförandegrad baserat på UX & frakt.</div>
              </div>
              <div className="relative z-10 text-right">
                <div className="text-5xl font-black text-brand-400 tracking-tight leading-none flex items-baseline justify-end">
                  {conversionScore}<span className="text-2xl text-brand-500/70">%</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-[calc(100vh-14rem)]">
              <div className="flex gap-1 overflow-x-auto hide-scrollbar border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 px-2 pt-2">
                {(['settings', 'shipping', 'product', 'provider'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-3 text-sm font-semibold rounded-t-lg transition-colors whitespace-nowrap border-b-2 ${
                      activeTab === tab ? 'border-brand-500 text-brand-600 dark:text-brand-400 bg-white dark:bg-slate-800' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    {tab === 'settings' ? 'Upplevelse' : tab === 'shipping' ? 'Logistik' : tab === 'product' ? 'Produkt' : 'Betalning'}
                  </button>
                ))}
              </div>

              <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                
                {activeTab === 'settings' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500" /> Grundläggande UX</h3>
                      <div className="space-y-5 bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-100 dark:border-slate-700/50">
                        <Toggle label="Dölj header/footer" description="Ta bort navigering för maximalt fokus" checked={hideHeaderFooter} onChange={setHideHeaderFooter} />
                        <Toggle label="Autofill av uppgifter" description="Minskar friktion för kunden" checked={hasAutofill} onChange={setHasAutofill} />
                        <Toggle label="Gästutcheckning" description="Kräv ej konto för att handla" checked={isGuestCheckout} onChange={setIsGuestCheckout} />
                        <Toggle label="EU-Ångerknapp" description="Lagenligt krav 2026 (-5% conv.)" checked={showEuReturnButton} onChange={setShowEuReturnButton} />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500" /> Brådska & Bekräftelse</h3>
                      <div className="space-y-5 bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-100 dark:border-slate-700/50">
                        <Toggle label="Varukorgstimer" description="Skapa brådska med nedräkning" checked={showCartTimer} onChange={setShowCartTimer} />
                        <Toggle label="Lågt lager-varning" description="Visa att produkten snart är slutsåld" checked={showLowStockWarning} onChange={setShowLowStockWarning} />
                        <Toggle label="Social proof" description="Visa hur många som tittar just nu" checked={showSocialProof} onChange={setShowSocialProof} />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-brand-500" /> Köpknapp (CTA)</h3>
                      <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-100 dark:border-slate-700/50">
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-2">Knappfärg</label>
                          <select value={ctaColor} onChange={(e) => setCtaColor(e.target.value as any)} className="w-full h-10 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm px-3 focus:ring-2 focus:ring-brand-500 outline-none">
                            <option value="green">Grön (Säkerhet)</option><option value="orange">Orange (Handling)</option><option value="red">Röd (Brådskande)</option><option value="low-contrast">Grå (Låg kontrast)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-2">Knapptext</label>
                          <select value={ctaText} onChange={(e) => setCtaText(e.target.value as any)} className="w-full h-10 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm px-3 focus:ring-2 focus:ring-brand-500 outline-none">
                            <option value="complete">Slutför köp</option><option value="pay">Betala säkert</option><option value="confirm">Bekräfta order</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'shipping' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Fraktstrategi & Kostnad</h3>
                      <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-100 dark:border-slate-700/50 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Standard Fraktpris (kr)</label>
                          <input type="number" value={baseShippingCost} onChange={(e) => setBaseShippingCost(Number(e.target.value))} className="w-full h-10 px-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Gräns för fri frakt (kr)</label>
                          <input type="number" value={freeShippingThreshold} onChange={(e) => setFreeShippingThreshold(Number(e.target.value))} className="w-full h-10 px-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
                        </div>
                        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                           <Toggle label="Tillåt kartvy för ombud" description="Låt kunden välja exakt ombud (+4% Conv.)" checked={allowMapSelection} onChange={setAllowMapSelection} />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Tillgängliga Leveranssätt</h3>
                      <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-100 dark:border-slate-700/50 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {DELIVERY_OPTIONS.map((opt) => (
                          <label key={opt.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedDeliveryOptions.includes(opt.id) ? 'bg-brand-50 dark:bg-brand-900/20 border-brand-200 dark:border-brand-800' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}>
                            <input type="checkbox" checked={selectedDeliveryOptions.includes(opt.id)} onChange={(e) => { if (e.target.checked) setSelectedDeliveryOptions([...selectedDeliveryOptions, opt.id]); else setSelectedDeliveryOptions(selectedDeliveryOptions.filter(id => id !== opt.id)); }} className="w-4 h-4 text-brand-600 rounded border-slate-300" />
                            <div className="flex-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{opt.name}</div>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Aktiva Speditörer</h3>
                      <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-100 dark:border-slate-700/50 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {CARRIERS.map((carrier) => (
                          <label key={carrier.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedCarriers.includes(carrier.id) ? 'bg-white dark:bg-slate-800 border-brand-500 shadow-sm ring-1 ring-brand-500' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}>
                            <input type="checkbox" checked={selectedCarriers.includes(carrier.id)} onChange={(e) => { if (e.target.checked) setSelectedCarriers([...selectedCarriers, carrier.id]); else setSelectedCarriers(selectedCarriers.filter(id => id !== carrier.id)); }} className="w-4 h-4 text-brand-600 rounded border-slate-300" />
                            <FallbackImage src={carrier.logo} alt={carrier.name} className="h-4 w-12 object-contain" />
                            <div className="flex-1 text-right text-xs font-bold text-slate-700 dark:text-slate-300">{carrier.name}</div>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Tilläggstjänster (Logistik)</h3>
                      <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-100 dark:border-slate-700/50">
                        <Toggle label="Erbjud Leveransförsäkring" description="Låter kunden teckna extra försäkring mot stöld/skada" checked={addInsurance} onChange={setAddInsurance} />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'product' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Varukorgens innehåll</h3>
                      <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-100 dark:border-slate-700/50 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Välj exempelfall (Produkt)</label>
                          <div className="grid grid-cols-1 gap-2">
                            {PRODUCTS.map(p => (
                              <button
                                key={p.id}
                                onClick={() => setSelectedProductId(p.id)}
                                className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${selectedProductId === p.id ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 ring-1 ring-brand-500' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300'}`}
                              >
                                <div className="text-slate-400">{p.icon}</div>
                                <div className="flex-1">
                                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{p.name}</div>
                                  <div className="text-xs text-slate-500 capitalize">{p.industry} • {p.weight} kg • {p.price} kr</div>
                                </div>
                              </button>
                            ))}
                          </div>
                          <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                            <strong>Obs:</strong> Olika branscher har olika smärtgränser för frakt. Att lägga 49kr frakt på en tröja för 199kr sänker konverteringen mer än att lägga 49kr frakt på en TV för 6999kr. Om varan väger över 20kg försvinner postombud automatiskt.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'provider' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Marknad & Betalmetoder</h3>
                      <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-100 dark:border-slate-700/50 grid grid-cols-1 gap-3">
                        {PAYMENT_METHODS.map((method) => (
                          <label key={method.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedPaymentMethods.includes(method.id) ? 'bg-white dark:bg-slate-800 border-brand-500 shadow-sm ring-1 ring-brand-500' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}>
                            <input type="checkbox" checked={selectedPaymentMethods.includes(method.id)} onChange={(e) => { if (e.target.checked) setSelectedPaymentMethods([...selectedPaymentMethods, method.id]); else setSelectedPaymentMethods(selectedPaymentMethods.filter(id => id !== method.id)); }} className="w-4 h-4 text-brand-600 rounded border-slate-300" />
                            {method.logo ? <FallbackImage src={method.logo} alt={method.name} className="h-5 w-12 object-contain" /> : <div className="w-12 flex justify-center text-slate-400">{method.icon}</div>}
                            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{method.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Toggle({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4 group cursor-pointer" onClick={() => onChange(!checked)}>
      <div className="flex-1">
        <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm leading-none mb-1">{label}</div>
        <div className="text-xs text-slate-500 dark:text-slate-400 leading-snug">{description}</div>
      </div>
      <button type="button" className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out ${checked ? 'bg-brand-600' : 'bg-slate-300 dark:bg-slate-600'}`}>
        <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  );
}
