'use client';

import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { 
  CheckCircle2, CreditCard, Truck, User, Package, TrendingUp, Settings,
  Home, MapPin, Zap, DollarSign, RefreshCw, HelpCircle, AlertTriangle,
  Clock, Users, Shield, Tag, QrCodeIcon, Download, GripVertical, Lock,
  Star, ShoppingCart, Map as MapIcon, Monitor, Shirt, Sofa, Coffee,
  Smartphone, Building2, Leaf, ShieldCheck, Timer, Wallet, Fingerprint,
  Share2, Printer, ArrowRightLeft, HeartHandshake, FileText, Award,
  UsersRound, PackageCheck, Info
} from 'lucide-react';

// --- TYPER OCH DATA ---
type CheckoutSection = { id: string; title: string; icon: React.ReactNode; description: string; };
type DeliveryOption = { id: string; name: string; icon: React.ReactNode; maxWeight: number; allowedSizes: string[] };

type Player = { slug: string; name: string; logoUrl: string; marketImpact: { se: number; no: number; dk: number; fi: number; }; isCompleteCheckout: boolean; };

const PLAYERS: Player[] = [
  { slug: 'klarna', name: 'Klarna Checkout', logoUrl: '/logos/klarna.png', marketImpact: { se: 5, no: 5, dk: 4, fi: 4 }, isCompleteCheckout: true },
  { slug: 'qliro', name: 'Qliro', logoUrl: '/logos/qliro.png', marketImpact: { se: 3, no: 2, dk: 1, fi: 2 }, isCompleteCheckout: true },
  { slug: 'svea', name: 'Svea Checkout', logoUrl: '/logos/svea.png', marketImpact: { se: 4, no: 3, dk: 1, fi: 2 }, isCompleteCheckout: true },
  { slug: 'walley', name: 'Walley Checkout', logoUrl: '/logos/walley.png', marketImpact: { se: 4, no: 3, dk: 1, fi: 2 }, isCompleteCheckout: true },
  { slug: 'kustom', name: 'Kustom (Egenbyggd)', logoUrl: '', marketImpact: { se: 2, no: 2, dk: 2, fi: 2 }, isCompleteCheckout: false },
  { slug: 'adyen', name: 'Adyen Checkout', logoUrl: '/logos/adyen.png', marketImpact: { se: 2, no: 2, dk: 2, fi: 2 }, isCompleteCheckout: false },
  { slug: 'stripe', name: 'Stripe', logoUrl: '/logos/stripe.png', marketImpact: { se: 1, no: 1, dk: 1, fi: 1 }, isCompleteCheckout: false },
];

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
  { id: 'postnord', name: 'PostNord', logo: '/logos/postnord.svg', trustScore: 4.2, marketImpact: { se: 3, no: 2, dk: 3, fi: 3 }, ruralAvailable: true },
  { id: 'dhl', name: 'DHL', logo: '/logos/dhl.svg', trustScore: 1.4, marketImpact: { se: -8, no: -5, dk: -6, fi: -7 }, ruralAvailable: true },
  { id: 'bring', name: 'Bring', logo: '/logos/bring.svg', trustScore: 4.0, marketImpact: { se: 2, no: 5, dk: 4, fi: 3 }, ruralAvailable: true },
  { id: 'instabox', name: 'Instabox', logo: '/logos/instabox.svg', trustScore: 4.4, marketImpact: { se: 4, no: 3, dk: 3, fi: 3 }, ruralAvailable: false },
  { id: 'airmee', name: 'Airmee', logo: '/logos/airmee.svg', trustScore: 4.1, marketImpact: { se: 3, no: 2, dk: 2, fi: 2 }, ruralAvailable: false },
];

const DELIVERY_OPTIONS: DeliveryOption[] = [
  { id: 'pickup', name: 'Hämtas i butik', icon: <Package size={18} />, maxWeight: 1000, allowedSizes: ['small', 'medium', 'bulky'] },
  { id: 'locker', name: 'Paketskåp', icon: <Home size={18} />, maxWeight: 20, allowedSizes: ['small', 'medium'] },
  { id: 'point', name: 'Paketombud', icon: <MapPin size={18} />, maxWeight: 20, allowedSizes: ['small', 'medium'] },
  { id: 'home', name: 'Hemleverans', icon: <Truck size={18} />, maxWeight: 1000, allowedSizes: ['small', 'medium', 'bulky'] },
  { id: 'mailbox', name: 'Brevlåda', icon: <Package size={18} />, maxWeight: 2, allowedSizes: ['small'] },
  { id: 'express', name: 'Expressleverans', icon: <Zap size={18} />, maxWeight: 20, allowedSizes: ['small', 'medium'] },
];

const PRODUCTS = [
  { id: 'tshirt', name: 'Basic T-shirt', price: 199, industry: 'kläder', weight: 0.2, size: 'small', icon: <Shirt size={24} /> },
  { id: 'sneakers', name: 'Premium Sneakers', price: 1299, industry: 'kläder', weight: 0.8, size: 'medium', icon: <Package size={24} /> },
  { id: 'tv', name: 'Smart TV 55"', price: 6999, industry: 'elektronik', weight: 15.0, size: 'bulky', icon: <Monitor size={24} /> },
  { id: 'sofa', name: 'Soffa 3-sits', price: 14999, industry: 'hem', weight: 65.0, size: 'bulky', icon: <Sofa size={24} /> },
  { id: 'coffee', name: 'Kaffebönor 2kg', price: 349, industry: 'mat', weight: 2.0, size: 'medium', icon: <Coffee size={24} />, consumable: true },
];

const SECTIONS: CheckoutSection[] = [
  { id: 'expressWallets', title: 'Expresskassor', icon: <Wallet size={18} />, description: 'Apple Pay / Google Pay' },
  { id: 'customer', title: 'Kunduppgifter', icon: <User size={18} />, description: 'Namn, e-post, adress' },
  { id: 'guest', title: 'Gästutcheckning', icon: <User size={18} />, description: 'Köp utan konto' },
  { id: 'coupon', title: 'Rabattkod', icon: <DollarSign size={18} />, description: 'Ange rabattkod' },
  { id: 'shipping', title: 'Leveransval', icon: <Truck size={18} />, description: 'Fraktalternativ och ombud' },
  { id: 'deliveryTimer', title: 'Leverans-nedräkning', icon: <Timer size={18} />, description: 'Beställ inom X timmar för snabb frakt' },
  { id: 'crossSell', title: 'Korsförsäljning', icon: <TrendingUp size={18} />, description: 'Rekommenderade tillbehör' },
  { id: 'payment', title: 'Betalning', icon: <CreditCard size={18} />, description: 'Betalmetoder och kort' },
  { id: 'euReturn', title: 'EU-Ångerknapp', icon: <RefreshCw size={18} />, description: 'Ångra köp enligt EU-direktiv' },
  { id: 'review', title: 'Orderöversikt', icon: <Package size={18} />, description: 'Sammanfattning av köp' },
  { id: 'lowStock', title: 'Lagersaldovarning', icon: <AlertTriangle size={18} />, description: 'Endast X kvar i lager' },
  { id: 'cartTimer', title: 'Varukorgstimer', icon: <Clock size={18} />, description: 'Reserverad i X minuter' },
  { id: 'socialProof', title: 'Social Proof', icon: <Users size={18} />, description: 'X personer tittar nu' },
  { id: 'trustBadge', title: 'Trustpilot & Omdömen', icon: <ShieldCheck size={18} />, description: 'Bygger förtroende' },
  { id: 'packaging', title: 'Förpackningsval', icon: <Leaf size={18} />, description: 'Klimatsmart / Diskret förpackning' },
  { id: 'giftWrapping', title: 'Presentinslagning', icon: <Package size={18} />, description: 'Lägg till presentinslagning' },
  { id: 'insurance', title: 'Försäkring', icon: <Shield size={18} />, description: 'Lägg till försäkring' },
  { id: 'giftMessage', title: 'Presentkort', icon: <DollarSign size={18} />, description: 'Lägg till hälsning' },
];

const FallbackImage = ({ src, alt, className }: { src?: string, alt: string, className?: string }) => {
  const [error, setError] = useState(false);
  if (!src || error) {
    return <div className={`flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[10px] px-2 py-1 rounded border border-slate-200 dark:border-slate-700 ${className}`}>{alt}</div>;
  }
  return <img src={src} alt={alt} className={className} onError={() => setError(true)} />;
};

export default function TestCheckoutPage() {
  const [layoutOrder, setLayoutOrder] = useState(['expressWallets', 'customer', 'guest', 'coupon', 'shipping', 'payment', 'review']);
  const [activeTab, setActiveTab] = useState('settings');
  const [activeView, setActiveView] = useState<'checkout' | 'orderConfirmation' | 'return' | 'export'>('checkout');
  const [deviceView, setDeviceView] = useState<'mobile' | 'desktop'>('desktop');

  // -- STATE UX & SETTINGS (Checkout) --
  const [customerCountry, setCustomerCountry] = useState('SE');
  const [checkoutType, setCheckoutType] = useState<'B2C' | 'B2B'>('B2C');
  const [isGuestCheckout, setIsGuestCheckout] = useState(true);
  const [hasAutofill, setHasAutofill] = useState(true);
  const [hasLightningAutofill, setHasLightningAutofill] = useState(false);
  const [addressAutocomplete, setAddressAutocomplete] = useState(false);
  const [hideHeaderFooter, setHideHeaderFooter] = useState(false);
  
  // -- STATE PRODUCT --
  const [selectedProductId, setSelectedProductId] = useState('sneakers');
  const selectedProduct = PRODUCTS.find(p => p.id === selectedProductId) || PRODUCTS[1];
  const [showProductDiscount, setShowProductDiscount] = useState(false);
  const [discountRate, setDiscountRate] = useState(20);
  const [enableSubscription, setEnableSubscription] = useState(false);
  const [hasCrossSell, setHasCrossSell] = useState(false);
  const [showProductTrustBadge, setShowProductTrustBadge] = useState(false);
  const [showProductReviews, setShowProductReviews] = useState(false);

  // -- STATE LOGISTICS --
  const [postalCode, setPostalCode] = useState('11122');
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(0);
  const [baseShippingCost, setBaseShippingCost] = useState(49); 
  const [allowMapSelection, setAllowMapSelection] = useState(true); 
  const [preselectShipping, setPreselectShipping] = useState(false);
  const [rememberShipping, setRememberShipping] = useState(false);
  const [showShippingReviews, setShowShippingReviews] = useState(false);
  
  // Eco Shipping States
  const [ecoSvanen, setEcoSvanen] = useState(false);
  const [ecoKompenserad, setEcoKompenserad] = useState(false);
  const [ecoGreen, setEcoGreen] = useState(false);

  const [selectedDeliveryOptions, setSelectedDeliveryOptions] = useState(['point', 'home', 'locker']);
  const [selectedCarriers, setSelectedCarriers] = useState(['postnord', 'instabox', 'airmee']);
  const [shippingOrder, setShippingOrder] = useState<string[]>(['point', 'home', 'locker', 'pickup', 'mailbox', 'express']);
  
  // -- STATE PAYMENT --
  const [selectedPlayer, setSelectedPlayer] = useState('klarna');
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>(['klarna', 'card', 'swish']);
  const [selectedCardProviders, setSelectedCardProviders] = useState<string[]>(['visa', 'mastercard']);
  const [paymentOrder, setPaymentOrder] = useState<string[]>(['klarna', 'card', 'swish', 'vipps', 'paypal', 'qliro', 'svea', 'walley']);
  const [showExpressWallets, setShowExpressWallets] = useState(true);
  
  // -- STATE FOMO & TILLÄGG --
  const [showLowStockWarning, setShowLowStockWarning] = useState(false);
  const [showCartTimer, setShowCartTimer] = useState(false);
  const [showSocialProof, setShowSocialProof] = useState(false);
  const [showDeliveryCountdown, setShowDeliveryCountdown] = useState(false);
  const [showTrustbadges, setShowTrustbadges] = useState(false);
  const [showPackagingOptions, setShowPackagingOptions] = useState(false);
  const [addGiftWrapping, setAddGiftWrapping] = useState(false);
  const [addInsurance, setAddInsurance] = useState(false);
  const [addGiftMessage, setAddGiftMessage] = useState(false);
  const [showEuReturnButton, setShowEuReturnButton] = useState(false);
  const [ctaColor, setCtaColor] = useState<'green' | 'orange' | 'red' | 'low-contrast'>('green');
  const [ctaText, setCtaText] = useState<'complete' | 'pay' | 'confirm'>('complete');

  // Interactive Live Preview States (För att användaren ska kunna klicka i preview)
  const [userAddedGiftWrap, setUserAddedGiftWrap] = useState(false);
  const [userAddedInsurance, setUserAddedInsurance] = useState(false);
  const [userAddedMessage, setUserAddedMessage] = useState(false);

  // -- STATE: ORDER CONFIRMATION --
  const [hasUpsell, setHasUpsell] = useState(true);
  const [ocShowAccountCreation, setOcShowAccountCreation] = useState(true);
  const [ocAccountCtaText, setOcAccountCtaText] = useState('Kom in i värmen');
  const [showNextPurchaseDiscount, setShowNextPurchaseDiscount] = useState(true);
  const [showSocialShare, setShowSocialShare] = useState(false);
  const [showReferralProgram, setShowReferralProgram] = useState(false);
  const [showOrderTracking, setShowOrderTracking] = useState(true);
  const [ocShowReturnButton, setOcShowReturnButton] = useState(false);

  // -- STATE: RETURN PAGE --
  const [returnWindow, setReturnWindow] = useState<'14' | '30' | '100' | '365'>('30');
  const [returnCost, setReturnCost] = useState<'free' | 'paid'>('free');
  const [returnMethod, setReturnMethod] = useState<'qr' | 'print' | 'both'>('both');
  const [allowExchange, setAllowExchange] = useState(true);
  const [returnReason, setReturnReason] = useState('');
  const [returnItemScope, setReturnItemScope] = useState<'all' | 'specific'>('all');
  
  // -- STATE: EXPORT --
  const [exportName, setExportName] = useState('');
  const [exportEmail, setExportEmail] = useState('');
  const [exportCompany, setExportCompany] = useState('');

  // Dynamisk valuta
  const currency = customerCountry === 'NO' ? 'NOK' : customerCountry === 'DK' ? 'DKK' : customerCountry === 'FI' ? '€' : 'kr';
  const isRuralPostalCode = postalCode.startsWith('8') || postalCode.startsWith('9');
  
  const availableCarriers = selectedCarriers.filter(carrierId => {
    const carrier = CARRIERS.find(c => c.id === carrierId);
    if (!carrier) return false;
    if (isRuralPostalCode && !carrier.ruralAvailable) return false; 
    return true;
  });

  const availableDeliveryOptions = selectedDeliveryOptions.filter(optId => {
    const opt = DELIVERY_OPTIONS.find(o => o.id === optId);
    if (!opt) return false;
    if (selectedProduct.weight > opt.maxWeight) return false;
    if (!opt.allowedSizes.includes(selectedProduct.size)) return false;
    if (isRuralPostalCode && optId === 'express') return false; 
    return true;
  });

  // Synkronisera sorteringen
  const finalShippingOrder = shippingOrder.filter(id => availableDeliveryOptions.includes(id));
  availableDeliveryOptions.forEach(id => { if (!finalShippingOrder.includes(id)) finalShippingOrder.push(id); });

  // Hantera Betalmetoder baserat på vald Kassa (Player)
  const activePlayer = PLAYERS.find(p => p.slug === selectedPlayer);
  let availablePaymentMethods = [...selectedPaymentMethods];
  
  if (activePlayer?.isCompleteCheckout) {
    availablePaymentMethods = availablePaymentMethods.filter(m => !PLAYERS.find(p => p.slug === m));
    availablePaymentMethods.unshift(activePlayer.slug); 
  }

  const finalPaymentOrder = paymentOrder.filter(id => availablePaymentMethods.includes(id));
  availablePaymentMethods.forEach(id => { if (!finalPaymentOrder.includes(id)) finalPaymentOrder.push(id); });


  const actualShippingCost = isRuralPostalCode ? baseShippingCost + 50 : baseShippingCost;

  // -- LOGIK & BERÄKNINGAR --
  const getIndustryBenchmark = (industry: string) => {
    switch(industry) { case 'elektronik': return 0.04; case 'kläder': return 0.07; case 'hem': return 0.12; case 'mat': return 0.18; default: return 0.10; }
  };

  const calculateAOV = () => {
    let aov = selectedProduct.price;
    if (showProductDiscount) aov = Math.round(aov * (1 - discountRate / 100));
    if (hasUpsell) aov += 199; 
    if (hasCrossSell) aov += 79; 
    
    if (userAddedGiftWrap && addGiftWrapping) aov += 49;
    if (userAddedInsurance && addInsurance) aov += 19;
    if (userAddedMessage && addGiftMessage) aov += 29;

    if (freeShippingThreshold > 0 && aov < freeShippingThreshold) {
      const missing = freeShippingThreshold - aov;
      if (missing < (freeShippingThreshold * 0.35)) {
        aov += missing * 1.15; 
      }
    }
    return Math.round(aov);
  };

  const calculateCLV = () => {
    let aov = calculateAOV();
    let purchasesPerYear = 1.5; 
    
    if (enableSubscription && selectedProduct.consumable) purchasesPerYear += 4; 
    else if (!isGuestCheckout) purchasesPerYear += 0.8; 
    
    if (rememberShipping) purchasesPerYear += 0.4; 
    if (showNextPurchaseDiscount) purchasesPerYear += 0.3;
    if (showReferralProgram) purchasesPerYear += 0.2;
    
    if (returnCost === 'free') purchasesPerYear += 0.2;
    if (returnMethod === 'qr' || returnMethod === 'both') purchasesPerYear += 0.1;
    if (returnWindow === '100' || returnWindow === '365') purchasesPerYear += 0.1;

    return Math.round(aov * purchasesPerYear);
  };

  const calculateCACReduction = () => {
    let reduction = 0;
    if (showReferralProgram) reduction += 12; 
    if (showSocialShare) reduction += 3; 
    return reduction;
  };

  // CHECKOUT METRICS
  const calculateConversionScore = () => {
    let score = 45; 

    const customerIdx = layoutOrder.indexOf('customer');
    const shippingIdx = layoutOrder.indexOf('shipping');
    const paymentIdx = layoutOrder.indexOf('payment');
    const guestIdx = layoutOrder.indexOf('guest');
    const expressIdx = layoutOrder.indexOf('expressWallets');

    if (customerIdx === 0 || customerIdx === 1) score += 3; else if (customerIdx > 3) score -= 8;
    if (paymentIdx !== -1 && shippingIdx !== -1 && paymentIdx < shippingIdx) score -= 15; 
    if (guestIdx !== -1 && guestIdx < 3) score += 3; else score -= 5;
    if (hideHeaderFooter) score += 4;

    if (showExpressWallets && expressIdx !== -1) {
      if (expressIdx === 0) score += deviceView === 'mobile' ? 8 : 4; 
      else score += 2; 
    }

    if (isGuestCheckout) score += 12; else score -= 18;
    if (hasLightningAutofill) score += 9;
    else if (hasAutofill) score += 5; 
    if (addressAutocomplete) score += 4;
    if (checkoutType === 'B2B') score += 2; 

    const isFreeShipping = (freeShippingThreshold > 0 && calculateAOV() >= freeShippingThreshold);
    const costToUse = isFreeShipping ? 0 : actualShippingCost;
    const shippingRatio = costToUse / calculateAOV();
    const benchmark = getIndustryBenchmark(selectedProduct.industry);

    if (costToUse === 0) score += 12; 
    else {
      if (shippingRatio > benchmark + 0.05) score -= 12; 
      else if (shippingRatio > benchmark) score -= 4;
      else score += 3; 
    }

    if (availableDeliveryOptions.length >= 3) score += 6;
    else if (availableDeliveryOptions.length === 1) score -= 6; 
    else if (availableDeliveryOptions.length === 0) score -= 30; 

    if (allowMapSelection && availableDeliveryOptions.includes('point')) score += 4; 
    if (preselectShipping) score += 2;
    if (rememberShipping) score += 4; 
    if (ecoSvanen || ecoKompenserad || ecoGreen) score += 2; 
    if (showShippingReviews) score += 2; 

    const marketKey = customerCountry.toLowerCase() as 'se' | 'no' | 'dk' | 'fi';
    let carrierTrustScore = 0;
    availableCarriers.forEach(cid => {
      const c = CARRIERS.find(x => x.id === cid);
      if (c && c.marketImpact[marketKey]) carrierTrustScore += c.marketImpact[marketKey];
    });
    score += Math.min(carrierTrustScore, 8); 

    let paymentTrustScore = 0;
    availablePaymentMethods.forEach(mid => {
      const m = PAYMENT_METHODS.find(x => x.id === mid);
      if (m && m.conversionImpact[marketKey]) paymentTrustScore += m.conversionImpact[marketKey];
    });
    if (activePlayer && activePlayer.marketImpact && activePlayer.marketImpact[marketKey]) {
        paymentTrustScore += activePlayer.marketImpact[marketKey];
    }
    score += Math.min(paymentTrustScore, 12); 

    if (showLowStockWarning) score += 3;
    if (showCartTimer) score += 1; 
    if (showSocialProof) score += 2;
    if (showDeliveryCountdown) score += 3;
    if (showTrustbadges) score += 3;
    if (showProductTrustBadge) score += 2;
    if (showProductReviews) score += 2;
    if (showProductDiscount) score += Math.min(Math.round(discountRate * 0.3), 8);

    if (hasCrossSell) score -= 2; 
    if (showEuReturnButton) score -= 5; 
    
    if (addInsurance) score -= 1; 
    if (addGiftWrapping) score -= 1;
    if (showPackagingOptions) score += 1; 

    if (ctaColor === 'green') score += 2;
    else if (ctaColor === 'low-contrast') score -= 8;
    if (ctaText === 'pay') score -= 3;
    else if (ctaText === 'complete' || ctaText === 'confirm') score += 1;

    return Math.min(Math.max(Math.round(score), 0), 100);
  };

  // RETURN METRICS
  const calculateReturnRate = () => {
    let rate = selectedProduct.industry === 'kläder' ? 25 : 8; 
    if (returnCost === 'free') rate += 4; 
    if (returnWindow === '100' || returnWindow === '365') rate += 2;
    if (allowExchange) rate -= 3; 
    return Math.max(rate, 2);
  };

  const calculateReturnRetention = () => {
    let retention = 40; 
    if (returnCost === 'free') retention += 15;
    if (returnMethod === 'qr' || returnMethod === 'both') retention += 10;
    if (allowExchange) retention += 20;
    return Math.min(retention, 95);
  };

  // NY HOVER-LOGIK FÖR TOOLTIPS (Returnerar ett objekt med desc, impact och source)
  const getSectionTooltipData = (sectionId: string) => {
    switch (sectionId) {
      case 'expressWallets': 
        return { desc: 'Expresskassor hoppar över formulär helt och hållet.', impact: '+8% på mobil om placerad först', source: 'Baymard Institute & Stripe' };
      case 'customer': 
        if (hasLightningAutofill) return { desc: 'Blixtsnabb autofill med endast E-post+Postnummer.', impact: '+9% konvertering', source: 'Klarna / Walley Insights' };
        if (addressAutocomplete) return { desc: 'Autofyll via Google Maps-sökning. Minskar friktion.', impact: '+4% konvertering', source: 'Google Maps Platform Data' };
        return { desc: 'Manuell inmatning av adress.', impact: '-5% konvertering (ökad friktion)', source: 'Baymard Institute' };
      case 'guest': 
        if (isGuestCheckout) return { desc: 'Gästutcheckning tillåter köp utan konto.', impact: '+12% konvertering', source: 'Baymard (Top 2 reason for abandonment)' };
        return { desc: 'Tvingat konto skapar extrem friktion.', impact: '-18% konvertering', source: 'Baymard Institute' };
      case 'shipping': 
        return { desc: rememberShipping ? 'Tidigare fraktval är redan ihågkommet!' : `${availableDeliveryOptions.length} tillgängliga alternativ för ${postalCode}.`, impact: 'Valfrihet ger upp till +10%', source: 'nShift / Ingrid Checkout Data' };
      case 'payment': 
        return { desc: `Visar betalningsalternativ för ${customerCountry}.`, impact: 'Lokala betalsätt ger upp till +12%', source: 'Svea / Klarna / Adyen Reports' };
      case 'review': 
        return { desc: 'Tydlig summering av kostnader och eventuella rabatter.', impact: 'Dolda avgifter sänker med -48%', source: 'Baymard Institute' };
      case 'deliveryTimer': 
        return { desc: 'Tydlig nytta: Beställ inom X tid för snabb frakt.', impact: '+3% konvertering', source: 'CXL / VWO Ecommerce Studies' };
      case 'trustBadge': 
        return { desc: 'Bygger förtroende och minskar tvekan hos nya kunder.', impact: '+3% konvertering', source: 'Trustpilot & Spiegel Research' };
      case 'packaging': 
        return { desc: 'Erbjud miljöval eller diskret förpackning.', impact: '+1% konv, ökad kundnöjdhet', source: 'PostNord E-handelsbarometern' };
      case 'crossSell': 
        return { desc: 'Rekommenderar tillbehör innan kassan slutförs.', impact: `+10% AOV, men -2% Konvertering`, source: 'Shopify / McKinsey' };
      case 'giftWrapping': 
        return { desc: 'Erbjuder lyxig inslagning för presenter.', impact: 'Ökar AOV under högtider', source: 'BigCommerce Data' };
      case 'giftMessage': 
        return { desc: 'Lägg till en personlig hälsning.', impact: 'Ökar AOV och emotionell koppling', source: 'Bain & Company' };
      case 'insurance':
        return { desc: 'Låter kunden teckna extra skydd för leveransen.', impact: '-1% Konv (friktion), men ökar marginal', source: 'Qliro / E-commerce trends' };
      case 'lowStock': 
        return { desc: 'Visar att produkten snart är slutsåld.', impact: '+3% konv (Brådska/Urgency)', source: 'CXL / Marcus Taylor' };
      case 'cartTimer': 
        return { desc: 'Visar att varukorgen är reserverad i X minuter.', impact: '+1% konv (Stress)', source: 'Baymard Institute' };
      case 'socialProof': 
        return { desc: 'Visar hur många som tittar eller har köpt nyligen.', impact: '+2% konvertering', source: 'Booking.com / Agoda UX Patterns' };
      case 'euReturn':
        return { desc: 'Lagenligt krav (EU 2026) att visa ångerrätt i kassan.', impact: '-5% konv (Skapar köp-tvekan)', source: 'EU Consumer Rights Directive' };
      default: 
        return { desc: 'En del av checkout-flödet.', impact: 'Neutral', source: 'Standard E-handel' };
    }
  };

  // AUTO-TOGGLES FÖR BLOCKS
  const toggleBlock = (blockId: string, isVisible: boolean, defaultIndex: number) => {
    setLayoutOrder(prev => {
      const newOrder = [...prev];
      if (isVisible && !newOrder.includes(blockId)) newOrder.splice(defaultIndex, 0, blockId);
      else if (!isVisible && newOrder.includes(blockId)) newOrder.splice(newOrder.indexOf(blockId), 1);
      return newOrder;
    });
  };

  useEffect(() => { toggleBlock('cartTimer', showCartTimer, 2); }, [showCartTimer]);
  useEffect(() => { toggleBlock('lowStock', showLowStockWarning, 2); }, [showLowStockWarning]);
  useEffect(() => { toggleBlock('socialProof', showSocialProof, 2); }, [showSocialProof]);
  useEffect(() => { toggleBlock('deliveryTimer', showDeliveryCountdown, layoutOrder.indexOf('shipping')); }, [showDeliveryCountdown]);
  useEffect(() => { toggleBlock('trustBadge', showTrustbadges, layoutOrder.length); }, [showTrustbadges]);
  useEffect(() => { toggleBlock('packaging', showPackagingOptions, layoutOrder.indexOf('review')); }, [showPackagingOptions]);
  useEffect(() => { toggleBlock('expressWallets', showExpressWallets, 0); }, [showExpressWallets]);
  useEffect(() => { toggleBlock('giftWrapping', addGiftWrapping, layoutOrder.length); }, [addGiftWrapping]);
  useEffect(() => { toggleBlock('insurance', addInsurance, layoutOrder.length); }, [addInsurance]);
  useEffect(() => { toggleBlock('giftMessage', addGiftMessage, layoutOrder.length); }, [addGiftMessage]);
  useEffect(() => { toggleBlock('euReturn', showEuReturnButton, layoutOrder.indexOf('review')); }, [showEuReturnButton]);
  useEffect(() => { toggleBlock('crossSell', hasCrossSell, layoutOrder.indexOf('shipping') + 1); }, [hasCrossSell]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    if (result.type === 'SECTION') {
      const items = Array.from(layoutOrder);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      setLayoutOrder(items);
    } else if (result.type === 'SHIPPING_OPTION') {
      const items = Array.from(finalShippingOrder);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      setShippingOrder(items);
    } else if (result.type === 'PAYMENT_METHOD') {
      const items = Array.from(finalPaymentOrder);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      setPaymentOrder(items);
    }
  };

  const conversionScore = calculateConversionScore();
  const currentAOV = calculateAOV();
  const currentCLV = calculateCLV();
  const currentReturnRate = calculateReturnRate();
  const currentReturnRetention = calculateReturnRetention();
  const currentCACReduction = calculateCACReduction();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 pb-20">
      <div className="container mx-auto px-4 py-8 max-w-[1400px]">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 mb-2">
            <Settings size={20} />
            <span className="text-sm font-semibold uppercase tracking-wide">Interactive Lab</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">Checkout Lab</h1>
          <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">Experimentera med e-handelspsykologi längs hela kundresan och se hur det påverkar dina nyckeltal.</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* VÄNSTER PANEL (Live Preview) */}
          <div className="space-y-6 lg:col-span-7">
            <div className="flex items-center justify-between mb-4 bg-white dark:bg-slate-800 p-2 pl-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-x-auto">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap hidden sm:block">Live Preview</h2>
              <div className="flex items-center gap-4 w-full sm:w-auto">
                
                <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-lg shrink-0">
                  <button onClick={() => setDeviceView('desktop')} className={`p-1.5 rounded-md transition-colors ${deviceView === 'desktop' ? 'bg-white dark:bg-slate-700 shadow-sm text-brand-600' : 'text-slate-400 hover:text-slate-600'}`}>
                    <Monitor size={18} />
                  </button>
                  <button onClick={() => setDeviceView('mobile')} className={`p-1.5 rounded-md transition-colors ${deviceView === 'mobile' ? 'bg-white dark:bg-slate-700 shadow-sm text-brand-600' : 'text-slate-400 hover:text-slate-600'}`}>
                    <Smartphone size={18} />
                  </button>
                </div>

                <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 hidden sm:block" />

                <div className="flex gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg w-full sm:w-auto overflow-x-auto hide-scrollbar">
                  {(['checkout', 'orderConfirmation', 'return', 'export'] as const).map(view => (
                    <button
                      key={view}
                      onClick={() => {
                        setActiveView(view);
                        if (view === 'checkout') setActiveTab('settings');
                      }}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 whitespace-nowrap ${
                        activeView === view ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                      }`}
                    >
                      {view === 'checkout' ? 'Kassa' : view === 'orderConfirmation' ? 'Tacksida' : view === 'return' ? 'Retur' : 'Exportera'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className={`transition-all duration-500 mx-auto bg-slate-950 ${deviceView === 'mobile' ? 'w-[375px] rounded-[3rem] border-[14px] border-slate-900 shadow-2xl overflow-hidden ring-1 ring-slate-800' : 'w-full rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden'}`}>
              <div className="bg-white dark:bg-slate-800 h-full w-full relative">
                
                {/* --- VY: CHECKOUT --- */}
                {activeView === 'checkout' && (
                  <>
                    {!hideHeaderFooter && (
                      <div className="bg-slate-900 dark:bg-slate-950 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
                        <div className="text-white font-semibold flex items-center gap-2"><ShoppingCart size={18} /> Kassa</div>
                        <div className="flex items-center gap-3 text-slate-400 text-sm">
                          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center"><User size={14} /></div>
                          {deviceView === 'desktop' && <div className="w-24 h-2 rounded bg-slate-800" />}
                        </div>
                      </div>
                    )}

                    <DragDropContext onDragEnd={handleDragEnd}>
                      <Droppable droppableId="checkout-sections" type="SECTION">
                        {(provided) => (
                          <div {...provided.droppableProps} ref={provided.innerRef} className={`p-4 ${deviceView === 'desktop' ? 'sm:p-6' : ''} space-y-4 sm:space-y-5 bg-slate-50/50 dark:bg-slate-900/20 overflow-visible min-h-[500px]`}>
                            {layoutOrder.map((sectionId, index) => {
                              const section = SECTIONS.find(s => s.id === sectionId);
                              if (!section) return null;
                              
                              const tooltipInfo = getSectionTooltipData(sectionId);

                              return (
                                <Draggable key={section.id} draggableId={section.id} index={index}>
                                  {(provided, snapshot) => (
                                    <div 
                                      ref={provided.innerRef} 
                                      {...provided.draggableProps} 
                                      className={`bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 hover:border-brand-400 dark:hover:border-brand-500 transition-all duration-200 shadow-sm relative group ${snapshot.isDragging ? 'shadow-xl ring-2 ring-brand-500 scale-[1.02] z-50' : 'z-10 hover:z-40'}`}
                                    >
                                      <div {...provided.dragHandleProps} className="absolute top-2 right-2 text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing hover:text-brand-500 p-2"><GripVertical size={16} /></div>

                                      <div className="flex items-start gap-3 sm:gap-4">
                                        <div className="text-brand-600 dark:text-brand-400 mt-0.5 p-2 bg-brand-50 dark:bg-brand-900/30 rounded-lg border border-brand-100 dark:border-brand-800/50 shrink-0">
                                          {section.icon}
                                        </div>
                                        
                                        <div className="flex-1 min-w-0 pr-6 relative">
                                          <div className="flex items-center gap-2 mb-3">
                                            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm sm:text-base">{section.title}</h3>
                                            
                                            {/* NY STRUKTURERAD TOOLTIP MED DATA! */}
                                            <div className="group/tooltip relative inline-flex items-center justify-center">
                                              <HelpCircle size={14} className="text-slate-400 hover:text-brand-500 transition-colors cursor-help" />
                                              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-3 bg-slate-900 text-white text-xs leading-relaxed rounded-lg shadow-2xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all text-left pointer-events-none z-[100] border border-slate-700">
                                                <div className="font-semibold text-brand-400 mb-1">{section.title}</div>
                                                <p className="mb-2 text-slate-300">{tooltipInfo.desc}</p>
                                                <div className="flex flex-col gap-1 mt-2 pt-2 border-t border-slate-700/50">
                                                  <span className={`font-bold ${tooltipInfo.impact.includes('-') && !tooltipInfo.impact.includes('+') ? 'text-red-400' : 'text-green-400'}`}>{tooltipInfo.impact}</span>
                                                  <span className="text-[10px] text-slate-500 italic">Källa: {tooltipInfo.source}</span>
                                                </div>
                                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                                              </div>
                                            </div>
                                          </div>
                                          
                                          {/* --- KASSA INNEHÅLL --- */}
                                          <div className="space-y-3">
                                            
                                            {sectionId === 'expressWallets' && showExpressWallets && (
                                              <div className="flex gap-2">
                                                <button className="flex-1 bg-black text-white h-12 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors">Apple Pay</button>
                                                <button className="flex-1 bg-white border border-slate-300 text-slate-800 h-12 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">Google Pay</button>
                                              </div>
                                            )}

                                            {sectionId === 'customer' && (
                                              <div className="space-y-3">
                                                {checkoutType === 'B2B' && (
                                                  <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-lg mb-4">
                                                    <div className="flex-1 text-center py-1.5 text-xs font-semibold text-slate-500">Privat</div>
                                                    <div className="flex-1 text-center py-1.5 text-xs font-semibold bg-white dark:bg-slate-700 rounded shadow-sm text-slate-900 dark:text-white flex items-center justify-center gap-2"><Building2 size={12}/> Företag</div>
                                                  </div>
                                                )}
                                                
                                                {hasLightningAutofill ? (
                                                  <div className="grid grid-cols-2 gap-3 relative">
                                                    <input type="email" placeholder="E-post" className="w-full h-10 bg-slate-50 dark:bg-slate-900 rounded-lg px-3 text-sm border border-brand-300 dark:border-brand-700 focus:ring-2 focus:ring-brand-500 outline-none" />
                                                    <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="Postnummer" className="w-full h-10 bg-slate-50 dark:bg-slate-900 rounded-lg px-3 text-sm border border-brand-300 dark:border-brand-700 focus:ring-2 focus:ring-brand-500 outline-none" />
                                                    <div className="absolute -bottom-6 left-0 right-0 text-center"><span className="text-[10px] font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30 px-2 py-0.5 rounded-full"><Fingerprint size={10} className="inline mr-1" />Blixt-autofill aktivt</span></div>
                                                  </div>
                                                ) : (
                                                  <div className="grid grid-cols-2 gap-3">
                                                    <select value={customerCountry} onChange={(e) => setCustomerCountry(e.target.value)} className="w-full h-10 bg-slate-50 dark:bg-slate-900 rounded-lg px-3 text-sm text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-brand-500 outline-none">
                                                      <option value="SE">Sverige</option><option value="NO">Norge</option><option value="DK">Danmark</option><option value="FI">Finland</option>
                                                    </select>
                                                    <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="Postnummer" className="w-full h-10 bg-slate-50 dark:bg-slate-900 rounded-lg px-3 text-sm text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-brand-500 outline-none" />
                                                  </div>
                                                )}

                                                {checkoutType === 'B2B' && !hasLightningAutofill && (
                                                  <div className="h-10 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 flex items-center"><span className="text-xs text-slate-400">Företagsnamn / Org.nr</span></div>
                                                )}

                                                {!hasLightningAutofill && (
                                                  addressAutocomplete ? (
                                                    <div className="relative mt-2">
                                                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><MapPin size={16} className="text-slate-400"/></div>
                                                      <input type="text" placeholder="Sök adress..." className="w-full h-10 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg pl-9 pr-3 text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
                                                    </div>
                                                  ) : hasAutofill ? (
                                                    <div className="h-10 mt-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-lg px-3 flex items-center"><span className="text-xs font-medium text-green-700 dark:text-green-400">Autofyllt via Klarna/Walley</span></div>
                                                  ) : (
                                                    <>
                                                      <div className="h-10 mt-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg" />
                                                      <div className="h-10 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg" />
                                                    </>
                                                  )
                                                )}
                                              </div>
                                            )}

                                            {sectionId === 'guest' && (
                                              <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800/50">
                                                <CheckCircle2 size={18} className="text-green-600 dark:text-green-500 shrink-0" />
                                                <span className="text-sm font-medium text-green-900 dark:text-green-300">{isGuestCheckout ? 'Snabbkassa aktiv' : 'Konto krävs för att handla'}</span>
                                              </div>
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
                                                ) : rememberShipping ? (
                                                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-lg flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 flex items-center justify-center shrink-0"><Home size={16} /></div>
                                                      <div>
                                                        <div className="text-sm font-bold text-blue-900 dark:text-blue-100">Ditt sparade ombud</div>
                                                        <div className="text-xs text-blue-700 dark:text-blue-300">ICA Supermarket, {postalCode}</div>
                                                      </div>
                                                    </div>
                                                    <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-800 px-2 py-1 rounded shadow-sm cursor-pointer hover:bg-slate-50 transition-colors">Ändra</div>
                                                  </div>
                                                ) : (
                                                  <div className="space-y-2">
                                                    {finalShippingOrder.map((optId, idx) => {
                                                      const opt = DELIVERY_OPTIONS.find(o => o.id === optId);
                                                      if (!opt) return null;
                                                      const isFree = freeShippingThreshold > 0 && currentAOV >= freeShippingThreshold;
                                                      return (
                                                        <Draggable key={opt.id} draggableId={opt.id} index={idx}>
                                                          {(provided, snapshot) => (
                                                            <div 
                                                              ref={provided.innerRef} 
                                                              {...provided.draggableProps} 
                                                              {...provided.dragHandleProps} 
                                                              className={`flex flex-col p-3 bg-white dark:bg-slate-800 rounded-lg border ${snapshot.isDragging ? 'border-brand-500 shadow-lg z-50' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'} transition-all group`}
                                                            >
                                                              <div className="flex items-center gap-3">
                                                                <div className="text-slate-300 dark:text-slate-600 group-hover:text-slate-500 transition-colors cursor-grab active:cursor-grabbing"><GripVertical size={16} /></div>
                                                                <div className="text-slate-400 dark:text-slate-500">{opt.icon}</div>
                                                                <div className="flex-1 flex justify-between items-center">
                                                                  <div className="flex items-center gap-2">
                                                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{opt.name}</span>
                                                                    {showShippingReviews && <span className="text-[10px] text-amber-500 flex items-center">★ 4.8</span>}
                                                                  </div>
                                                                  <span className="text-sm font-semibold text-slate-900 dark:text-white">{isFree ? '0 kr' : `${actualShippingCost} kr`}</span>
                                                                </div>
                                                              </div>
                                                              {(ecoSvanen || ecoKompenserad || ecoGreen) && (
                                                                <div className="flex gap-1.5 mt-2 ml-10">
                                                                  {ecoSvanen && <span className="text-[9px] font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-1.5 py-0.5 rounded flex items-center gap-1"><Leaf size={10}/> Svanenmärkt</span>}
                                                                  {ecoKompenserad && <span className="text-[9px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 px-1.5 py-0.5 rounded flex items-center gap-1"><Leaf size={10}/> Kompenserad</span>}
                                                                  {ecoGreen && <span className="text-[9px] font-semibold bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400 px-1.5 py-0.5 rounded flex items-center gap-1"><Truck size={10}/> Skicka Grönt</span>}
                                                                </div>
                                                              )}
                                                            </div>
                                                          )}
                                                        </Draggable>
                                                      );
                                                    })}
                                                  </div>
                                                )}
                                                
                                                {!rememberShipping && allowMapSelection && availableDeliveryOptions.includes('point') && (
                                                  <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 rounded-lg flex items-center justify-between cursor-pointer hover:bg-blue-100 transition-colors">
                                                    <div className="flex items-center gap-2">
                                                      <MapIcon size={16} className="text-blue-600 dark:text-blue-400" />
                                                      <span className="text-sm font-medium text-blue-900 dark:text-blue-200">Karta: Välj ombud</span>
                                                    </div>
                                                  </div>
                                                )}

                                                {!rememberShipping && availableCarriers.length > 0 && availableDeliveryOptions.length > 0 && (
                                                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                                                    <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">Möjliga speditörer i {postalCode}</div>
                                                    <div className="flex flex-wrap gap-2">
                                                      {availableCarriers.map((carrierId) => {
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
                                                    {isRuralPostalCode && <p className="text-[10px] text-amber-600 mt-2">Visar begränsat utbud pga glesbygd.</p>}
                                                  </div>
                                                )}
                                              </>
                                            )}

                                            {sectionId === 'crossSell' && hasCrossSell && (
                                              <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 rounded-xl">
                                                <div className="flex items-start gap-4">
                                                  <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 flex-shrink-0 flex items-center justify-center">
                                                    <Package size={28} className="text-slate-300 dark:text-slate-600" />
                                                  </div>
                                                  <div className="flex-1">
                                                    <div className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Premium Tillbehör</div>
                                                    <div className="mt-2 flex items-center justify-between">
                                                      <div className="flex items-center gap-2">
                                                        <span className="font-bold text-slate-900 dark:text-white">79 {currency}</span>
                                                      </div>
                                                      <button className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-md text-xs font-medium hover:border-brand-500 transition-colors shadow-sm">Lägg till</button>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            )}

                                            {sectionId === 'payment' && (
                                              <>
                                                <div className="flex items-center gap-3 mb-4 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                                                  <div className="w-12 h-8 flex items-center justify-center bg-white dark:bg-slate-800 rounded border border-slate-100 dark:border-slate-600 px-1 overflow-hidden shrink-0">
                                                    {(() => {
                                                      const player = PLAYERS.find(p => p.slug === selectedPlayer);
                                                      if (selectedPlayer === 'kustom') return <span className="text-[9px] font-bold text-slate-600">KUSTOM</span>;
                                                      if (selectedPlayer === 'stripe') return <span className="text-[10px] font-bold text-indigo-500">STRIPE</span>;
                                                      if (selectedPlayer === 'qliro') return <span className="text-[11px] font-bold text-slate-800">Qliro</span>;
                                                      if (selectedPlayer === 'svea') return <span className="text-[11px] font-bold text-blue-600">SVEA</span>;
                                                      if (selectedPlayer === 'walley') return <span className="text-[11px] font-bold text-slate-800">walley</span>;
                                                      return player?.logoUrl ? <img src={player.logoUrl} alt={player.name} className="h-4 object-contain" /> : <CreditCard size={14} className="text-slate-400" />;
                                                    })()}
                                                  </div>
                                                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                    Betalning via {PLAYERS.find(p => p.slug === selectedPlayer)?.name || 'Kassa'}
                                                  </span>
                                                </div>
                                                
                                                <Droppable droppableId="payment-methods" type="PAYMENT_METHOD">
                                                  {(provided) => (
                                                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                                                      {finalPaymentOrder.map((methodId, idx) => {
                                                        const method = PAYMENT_METHODS.find(m => m.id === methodId);
                                                        const isPlayerMethod = !method;
                                                        
                                                        const nameToDisplay = isPlayerMethod ? PLAYERS.find(p => p.slug === methodId)?.name : method?.name;
                                                        const logoToDisplay = isPlayerMethod ? PLAYERS.find(p => p.slug === methodId)?.logoUrl : method?.logo;
                                                        const iconToDisplay = isPlayerMethod ? <CreditCard size={18} /> : method?.icon;

                                                        if (!nameToDisplay) return null;

                                                        const marketKey = customerCountry.toLowerCase() as keyof typeof CARD_PROVIDERS[0]['conversionImpact'];
                                                        let impact = 0;
                                                        if (method) impact = method.conversionImpact[marketKey];

                                                        return (
                                                          <Draggable key={methodId} draggableId={methodId} index={idx}>
                                                            {(provided, snapshot) => (
                                                              <div 
                                                                ref={provided.innerRef} 
                                                                {...provided.draggableProps} 
                                                                {...provided.dragHandleProps} 
                                                                className={`flex items-center p-3 bg-white dark:bg-slate-800 rounded-lg border ${snapshot.isDragging ? 'border-brand-500 shadow-lg z-50' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'} transition-all group`}
                                                              >
                                                                <div className="mr-3 text-slate-300 dark:text-slate-600 group-hover:text-slate-500 cursor-grab active:cursor-grabbing"><GripVertical size={16} /></div>
                                                                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${idx === 0 ? 'border-brand-500' : 'border-slate-300 dark:border-slate-600'}`}>
                                                                  {idx === 0 && <div className="w-2.5 h-2.5 rounded-full bg-brand-500" />}
                                                                </div>
                                                                
                                                                {logoToDisplay ? (
                                                                  <FallbackImage src={logoToDisplay} alt={nameToDisplay} className="h-5 w-auto max-w-[40px] object-contain mr-3" />
                                                                ) : (
                                                                  <div className="w-8 flex justify-center text-slate-400 mr-3">{iconToDisplay}</div>
                                                                )}
                                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200 flex-1">{nameToDisplay}</span>
                                                                {impact !== 0 && (
                                                                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${impact > 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                                                    {impact > 0 ? '+' : ''}{impact}%
                                                                  </span>
                                                                )}
                                                              </div>
                                                            )}
                                                          </Draggable>
                                                        );
                                                      })}
                                                      {provided.placeholder}
                                                    </div>
                                                  )}
                                                </Droppable>
                                                
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

                                            {sectionId === 'euReturn' && showEuReturnButton && (
                                              <div className="flex items-center justify-center gap-2 p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                                                <RefreshCw size={16} className="text-slate-500" />
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Ångra köp (14 dagar)</span>
                                              </div>
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
                                                  <div className="flex items-start gap-4 mb-4">
                                                    <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 flex-shrink-0 flex items-center justify-center text-slate-400">
                                                      {selectedProduct.icon}
                                                    </div>
                                                    <div className="flex-1">
                                                      <div className="font-semibold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-2">
                                                        {selectedProduct.name}
                                                      </div>
                                                      {showProductReviews && <span className="text-[10px] text-amber-500 flex items-center mt-0.5">★★★★★ (124)</span>}
                                                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 capitalize">{selectedProduct.size} • {selectedProduct.weight}kg</div>
                                                      
                                                      <div className="mt-2 font-medium text-slate-900 dark:text-white">
                                                        {showProductDiscount ? (
                                                          <div className="flex items-center gap-2">
                                                            <span className="line-through text-slate-400 text-xs">{selectedProduct.price} {currency}</span>
                                                            <span className="text-red-600">{Math.round(selectedProduct.price * (1 - discountRate/100))} {currency}</span>
                                                          </div>
                                                        ) : (
                                                          <span>{selectedProduct.price} {currency}</span>
                                                        )}
                                                      </div>
                                                      
                                                      {showProductTrustBadge && (
                                                        <div className="flex gap-2 mt-3">
                                                          <span className="text-[9px] font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded flex items-center gap-1"><ShieldCheck size={10}/> Trygg E-handel</span>
                                                          <span className="text-[9px] font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded flex items-center gap-1"><Award size={10}/> Äkta vara</span>
                                                        </div>
                                                      )}
                                                    </div>
                                                  </div>
                                                  
                                                  {enableSubscription && selectedProduct.consumable && (
                                                    <div className="bg-brand-50 dark:bg-brand-900/20 p-3 rounded-lg border border-brand-200 dark:border-brand-800/50 mt-3 mb-4 flex gap-3">
                                                      <RefreshCw className="text-brand-600 dark:text-brand-400 shrink-0" size={18} />
                                                      <div>
                                                        <div className="text-sm font-semibold text-brand-900 dark:text-brand-100">Prenumerera & Spara 15%</div>
                                                        <div className="text-xs text-brand-700 dark:text-brand-300 mt-0.5">Få ny leverans varje månad. Avbryt när du vill.</div>
                                                      </div>
                                                    </div>
                                                  )}

                                                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
                                                    <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                                                      <span>Delsumma {checkoutType === 'B2B' ? '(exkl. moms)' : ''}</span>
                                                      <span>{checkoutType === 'B2B' ? Math.round(selectedProduct.price * 0.8) : selectedProduct.price} {currency}</span>
                                                    </div>
                                                    
                                                    {freeShippingThreshold > 0 && currentAOV < freeShippingThreshold && (
                                                      <div className="flex justify-between text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/10 p-1.5 -mx-1.5 rounded">
                                                        <span>Lägger till extraprodukt för fri frakt</span>
                                                        <span>+ {currentAOV - selectedProduct.price} {currency}</span>
                                                      </div>
                                                    )}

                                                    {/* User Interacted Totals (Giftwrap etc) */}
                                                    {userAddedGiftWrap && addGiftWrapping && (
                                                      <div className="flex justify-between text-sm text-purple-600 dark:text-purple-400">
                                                        <span>Presentinslagning</span>
                                                        <span>49 {currency}</span>
                                                      </div>
                                                    )}
                                                    {userAddedInsurance && addInsurance && (
                                                      <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                                                        <span>Försäkring</span>
                                                        <span>19 {currency}</span>
                                                      </div>
                                                    )}
                                                    {userAddedMessage && addGiftMessage && (
                                                      <div className="flex justify-between text-sm text-pink-600 dark:text-pink-400">
                                                        <span>Presentkort</span>
                                                        <span>29 {currency}</span>
                                                      </div>
                                                    )}

                                                    <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                                                      <span>Frakt</span>
                                                      <span>{(freeShippingThreshold > 0 && currentAOV >= freeShippingThreshold) ? `0 ${currency}` : `${actualShippingCost} ${currency}`}</span>
                                                    </div>
                                                    {checkoutType === 'B2B' && (
                                                      <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                                                        <span>Moms (25%)</span>
                                                        <span>{Math.round(currentAOV * 0.2)} {currency}</span>
                                                      </div>
                                                    )}
                                                    <div className="flex justify-between font-bold text-lg text-slate-900 dark:text-white mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                                                      <span>Att betala</span>
                                                      <span>{currentAOV + ((freeShippingThreshold > 0 && currentAOV >= freeShippingThreshold) ? 0 : actualShippingCost)} {currency}</span>
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
                                              <div onClick={() => setUserAddedInsurance(!userAddedInsurance)} className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${userAddedInsurance ? 'bg-slate-100 dark:bg-slate-800 border-slate-400 shadow-sm' : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 hover:bg-slate-100'}`}>
                                                <Shield size={20} className={userAddedInsurance ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400'} shrink-0 />
                                                <div className="flex-1"><div className={`text-sm font-semibold ${userAddedInsurance ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>Leveransförsäkring (+19 {currency})</div></div>
                                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${userAddedInsurance ? 'border-slate-800 bg-slate-800 dark:border-white dark:bg-white' : 'border-slate-300 dark:border-slate-600'}`}>
                                                  {userAddedInsurance && <CheckCircle2 size={14} className="text-white dark:text-slate-900" />}
                                                </div>
                                              </div>
                                            )}

                                            {sectionId === 'giftWrapping' && addGiftWrapping && (
                                              <div onClick={() => setUserAddedGiftWrap(!userAddedGiftWrap)} className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${userAddedGiftWrap ? 'bg-purple-50 dark:bg-purple-900/30 border-purple-400 shadow-sm' : 'bg-purple-50/50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-800/30 hover:bg-purple-50'}`}>
                                                <Package size={20} className={userAddedGiftWrap ? 'text-purple-600' : 'text-purple-400'} shrink-0 />
                                                <div className="flex-1"><div className={`text-sm font-semibold ${userAddedGiftWrap ? 'text-purple-900 dark:text-purple-100' : 'text-purple-800/70 dark:text-purple-300/70'}`}>Presentinslagning (+49 {currency})</div></div>
                                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${userAddedGiftWrap ? 'border-purple-600 bg-purple-600' : 'border-purple-300 dark:border-purple-700'}`}>
                                                  {userAddedGiftWrap && <CheckCircle2 size={14} className="text-white" />}
                                                </div>
                                              </div>
                                            )}
                                            
                                            {sectionId === 'giftMessage' && addGiftMessage && (
                                              <div onClick={() => setUserAddedMessage(!userAddedMessage)} className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${userAddedMessage ? 'bg-pink-50 dark:bg-pink-900/30 border-pink-400 shadow-sm' : 'bg-pink-50/50 dark:bg-pink-900/10 border-pink-200 dark:border-pink-800/30 hover:bg-pink-50'}`}>
                                                <DollarSign size={20} className={userAddedMessage ? 'text-pink-600' : 'text-pink-400'} shrink-0 />
                                                <div className="flex-1"><div className={`text-sm font-semibold ${userAddedMessage ? 'text-pink-900 dark:text-pink-100' : 'text-pink-800/70 dark:text-pink-300/70'}`}>Skriv ett presentkort (+29 {currency})</div></div>
                                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${userAddedMessage ? 'border-pink-600 bg-pink-600' : 'border-pink-300 dark:border-pink-700'}`}>
                                                  {userAddedMessage && <CheckCircle2 size={14} className="text-white" />}
                                                </div>
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

                    <div className="p-4 sm:p-6 bg-slate-50/50 dark:bg-slate-900/20 border-t border-slate-200 dark:border-slate-700 sticky bottom-0 z-50">
                      <button
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

                {/* --- VY: ORDER CONFIRMATION --- */}
                {activeView === 'orderConfirmation' && (
                  <div className="p-8 pb-20 overflow-y-auto h-full custom-scrollbar bg-slate-50 dark:bg-slate-900/50">
                    <div className="text-center mb-8">
                      <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mx-auto mb-5 flex items-center justify-center shadow-inner">
                        <CheckCircle2 size={40} className="text-green-600 dark:text-green-400" />
                      </div>
                      <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Tack för din order!</h2>
                      <p className="text-slate-600 dark:text-slate-400">Orderbekräftelse är skickad till din e-post.</p>
                    </div>

                    {showOrderTracking && (
                      <div className="bg-white dark:bg-slate-800 rounded-xl p-5 mb-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                          <PackageCheck className="text-brand-500" size={24} />
                          <div className="font-semibold text-slate-900 dark:text-slate-100">Följ din leverans</div>
                        </div>
                        <div className="relative pt-4">
                          <div className="absolute top-6 left-4 right-4 h-1 bg-slate-200 dark:bg-slate-700 rounded" />
                          <div className="absolute top-6 left-4 w-1/3 h-1 bg-brand-500 rounded" />
                          <div className="flex justify-between relative z-10">
                            <div className="flex flex-col items-center gap-2">
                              <div className="w-5 h-5 rounded-full bg-brand-500 text-white flex items-center justify-center"><CheckCircle2 size={12}/></div>
                              <span className="text-[10px] font-bold text-slate-900 dark:text-white">Packas</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                              <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-800" />
                              <span className="text-[10px] font-bold text-slate-400">På väg</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                              <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-800" />
                              <span className="text-[10px] font-bold text-slate-400">Framme</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {hasUpsell && (
                      <div className="mb-6 p-5 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/10 border border-amber-200 dark:border-amber-800/50 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-2 mb-3 text-amber-800 dark:text-amber-400 font-bold text-sm uppercase tracking-wide">
                          <Star size={16} /> Exklusivt erbjudande bara för dig!
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex-shrink-0 flex items-center justify-center">
                            <Package size={32} className="text-slate-300 dark:text-slate-600" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-slate-900 dark:text-slate-100">Mystery Box (Värde 500 {currency})</div>
                            <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Lägg till i din nuvarande order utan extra frakt.</div>
                            <div className="mt-3 flex items-center gap-3">
                              <span className="font-bold text-lg text-slate-900 dark:text-white">199 {currency}</span>
                              <button className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">Lägg till i order</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {isGuestCheckout && ocShowAccountCreation && (
                      <div className="bg-slate-900 dark:bg-slate-800 rounded-xl p-6 text-white shadow-xl mb-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-brand-500/20 rounded-full flex items-center justify-center"><User size={20} className="text-brand-400" /></div>
                          <div>
                            <div className="font-bold text-lg">{ocAccountCtaText}</div>
                            <div className="text-sm text-slate-300">Skapa konto med ett klick för smidigare köp.</div>
                          </div>
                        </div>
                        
                        {showNextPurchaseDiscount && (
                          <div className="bg-brand-500/20 border border-brand-500/30 rounded-lg p-3 mb-4 flex items-center gap-2">
                            <Tag size={16} className="text-brand-400 shrink-0" />
                            <span className="text-sm font-medium text-brand-100">Få 10% rabatt på nästa order om du skapar konto nu!</span>
                          </div>
                        )}
                        
                        <div className="flex gap-2">
                          <input type="password" placeholder="Välj ett lösenord" className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500" />
                          <button className="px-6 py-3 bg-brand-600 text-white rounded-lg text-sm font-bold hover:bg-brand-500 transition-colors">Spara</button>
                        </div>
                      </div>
                    )}

                    {showReferralProgram && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-xl p-5 mb-6 text-center">
                        <HeartHandshake size={32} className="mx-auto text-blue-600 dark:text-blue-400 mb-3" />
                        <h3 className="font-bold text-slate-900 dark:text-white mb-2">Tipsa en vän, få 100 {currency}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Ge din vän 100 {currency} rabatt. När de handlar får du också 100 {currency}.</p>
                        <div className="flex items-center bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-1">
                          <div className="flex-1 text-sm font-mono text-slate-500 truncate px-3">ref.store.com/anna123</div>
                          <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">Kopiera länk</button>
                        </div>
                      </div>
                    )}

                    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 mb-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                      <div className="font-semibold text-slate-900 dark:text-slate-100 mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">Orderöversikt</div>
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 flex-shrink-0 flex items-center justify-center">
                          {selectedProduct.icon}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-slate-800 dark:text-slate-200">{selectedProduct.name}</div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">{selectedProduct.price} {currency}</div>
                          <div className="text-xs text-slate-500 mt-1">Antal: 1</div>
                        </div>
                      </div>
                    </div>

                    {showSocialShare && (
                      <div className="text-center mb-6">
                        <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">Dela ditt köp</div>
                        <div className="flex justify-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-brand-100 hover:text-brand-600 cursor-pointer transition-colors"><Share2 size={18} /></div>
                        </div>
                      </div>
                    )}

                    {ocShowReturnButton && (
                       <div className="text-center">
                        <button onClick={() => setActiveView('return')} className="text-sm font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline underline-offset-4">
                          Vill du ångra/returnera ditt köp? Klicka här.
                        </button>
                       </div>
                    )}
                  </div>
                )}

                {/* --- VY: RETURN --- */}
                {activeView === 'return' && (
                  <div className="p-8 pb-20 overflow-y-auto h-full custom-scrollbar bg-slate-50 dark:bg-slate-900/50">
                    <div className="text-center mb-8">
                      <div className="w-20 h-20 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mb-5 flex items-center justify-center shadow-inner">
                        <RefreshCw size={36} className="text-slate-600 dark:text-slate-400" />
                      </div>
                      <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Retur & Byte</h2>
                      <p className="text-slate-600 dark:text-slate-400">Välj vilka produkter du vill returnera.</p>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 mb-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                      <div className="font-semibold text-slate-900 dark:text-slate-100 mb-4 border-b border-slate-200 dark:border-slate-700 pb-2 flex justify-between">
                        <span>Din order (#19482)</span>
                        <span className="text-sm font-normal text-brand-600">Välj {returnItemScope === 'specific' ? 'artiklar' : 'allt'}</span>
                      </div>
                      
                      <label className="flex items-start gap-4 cursor-pointer group">
                        <div className="pt-4">
                          <input type="checkbox" checked={true} readOnly className="w-5 h-5 text-brand-600 rounded border-slate-300" />
                        </div>
                        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 flex-shrink-0 flex items-center justify-center group-hover:border-brand-300 transition-colors">
                          {selectedProduct.icon}
                        </div>
                        <div className="flex-1 py-1">
                          <div className="font-medium text-slate-800 dark:text-slate-200">{selectedProduct.name}</div>
                          <div className="text-sm text-slate-500 mt-1">{selectedProduct.price} {currency}</div>
                        </div>
                      </label>

                      {returnItemScope === 'specific' && hasUpsell && (
                        <label className="flex items-start gap-4 cursor-pointer group mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                          <div className="pt-4">
                            <input type="checkbox" className="w-5 h-5 text-brand-600 rounded border-slate-300" />
                          </div>
                          <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 flex-shrink-0 flex items-center justify-center group-hover:border-brand-300 transition-colors">
                            <Package size={24} className="text-slate-400" />
                          </div>
                          <div className="flex-1 py-1">
                            <div className="font-medium text-slate-800 dark:text-slate-200">Mystery Box (Upsell)</div>
                            <div className="text-sm text-slate-500 mt-1">199 {currency}</div>
                          </div>
                        </label>
                      )}
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 mb-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Varför vill du returnera?</label>
                      <select value={returnReason} onChange={(e) => setReturnReason(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white shadow-sm focus:ring-2 focus:ring-brand-500 outline-none">
                        <option value="">Välj en orsak...</option>
                        <option value="wrong-size">Fel storlek</option>
                        <option value="wrong-item">Fel artikel skickad</option>
                        <option value="not-as-described">Motsvarade inte förväntningarna</option>
                        <option value="changed-mind">Ångrat mig</option>
                        <option value="damaged">Skadad vid leverans</option>
                      </select>
                    </div>

                    {allowExchange && (
                      <div className="bg-brand-50 dark:bg-brand-900/10 rounded-xl p-5 mb-6 border border-brand-200 dark:border-brand-800/50">
                        <div className="flex items-center gap-3 mb-2">
                          <ArrowRightLeft className="text-brand-600 dark:text-brand-400" size={20} />
                          <h3 className="font-bold text-brand-900 dark:text-brand-100">Byt till en annan produkt?</h3>
                        </div>
                        <p className="text-sm text-brand-700 dark:text-brand-300 mb-4">Byten är alltid helt gratis och vi skickar den nya varan direkt.</p>
                        <button className="w-full py-3 bg-brand-600 text-white rounded-lg font-semibold hover:bg-brand-500 transition-colors shadow-sm">Välj ny vara (Gratis retur)</button>
                      </div>
                    )}

                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 mb-6 border border-slate-200 dark:border-slate-700 text-center shadow-sm">
                      
                      {returnMethod === 'qr' || returnMethod === 'both' ? (
                        <>
                          <div className="inline-block p-2 bg-white rounded-xl border-2 border-slate-200 mb-3 shadow-sm">
                            <QrCodeIcon size={80} className="text-slate-800" />
                          </div>
                          <h3 className="font-bold text-slate-900 dark:text-white mb-1">Din digitala retursedel</h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto mb-4">Visa denna QR-kod hos ditt ombud. Du behöver inte skriva ut något.</p>
                        </>
                      ) : null}

                      {(returnMethod === 'print' || returnMethod === 'both') && (
                        <div className={`flex items-center justify-center gap-2 p-3 ${returnMethod === 'both' ? 'bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg' : ''}`}>
                          <Printer size={18} className="text-slate-500" />
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Skriv ut retursedel själv</span>
                        </div>
                      )}

                    </div>

                    <div className="bg-slate-100 dark:bg-slate-900 rounded-lg p-4 text-sm text-slate-600 dark:text-slate-400 mb-6 space-y-2 border border-slate-200 dark:border-slate-800">
                      <div className="flex justify-between">
                        <span>Returfönster</span>
                        <span className="font-semibold text-slate-900 dark:text-white">{returnWindow} dagar</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Returavgift (dras från återbetalning)</span>
                        <span className="font-semibold text-slate-900 dark:text-white">{returnCost === 'free' ? '0 kr' : '39 kr'}</span>
                      </div>
                    </div>

                    <button className="w-full py-4 px-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity shadow-lg">
                      Bekräfta och skapa retur
                    </button>
                  </div>
                )}

                {/* --- VY: EXPORT --- */}
                {activeView === 'export' && (
                  <div className="p-8 pb-20 overflow-y-auto h-full custom-scrollbar bg-slate-50 dark:bg-slate-900/50 flex flex-col justify-center">
                    <div className="text-center mb-8">
                      <div className="w-20 h-20 bg-brand-100 dark:bg-brand-900/30 rounded-full mx-auto mb-5 flex items-center justify-center shadow-inner">
                        <FileText size={36} className="text-brand-600 dark:text-brand-400" />
                      </div>
                      <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Exportera Bygge</h2>
                      <p className="text-slate-600 dark:text-slate-400">Spara dina inställningar och KPI-analyser som en PDF.</p>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                      <div className="space-y-4 mb-6">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Ditt namn *</label>
                          <input type="text" value={exportName} onChange={(e) => setExportName(e.target.value)} placeholder="Ex. Anna Andersson" className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm focus:ring-2 focus:ring-brand-500 outline-none" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">E-postadress *</label>
                          <input type="email" value={exportEmail} onChange={(e) => setExportEmail(e.target.value)} placeholder="anna@foretag.se" className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm focus:ring-2 focus:ring-brand-500 outline-none" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Företag</label>
                          <input type="text" value={exportCompany} onChange={(e) => setExportCompany(e.target.value)} placeholder="Företagsnamn AB" className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm focus:ring-2 focus:ring-brand-500 outline-none" />
                        </div>
                      </div>

                      <button disabled={!exportName || !exportEmail} className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all shadow-lg ${!exportName || !exportEmail ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none' : 'bg-brand-600 text-white hover:bg-brand-500 shadow-brand-500/25 hover:-translate-y-0.5'}`}>
                        {!exportName || !exportEmail ? 'Fyll i obligatoriska fält' : 'Generera och ladda ned PDF'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* HÖGER PANEL (Dynamic Settings & Engine) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* DYNAMISK HERO DASHBOARD BERONDE PÅ VY */}
            {activeView === 'checkout' && (
              <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden transition-all">
                <div className="absolute -right-4 -top-4 w-40 h-40 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                  <div className="md:col-span-3 border-b border-slate-800 pb-4 mb-2">
                    <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-2">
                      <TrendingUp size={16} className="text-brand-400" /> Estimerad Konvertering
                    </div>
                    <div className="text-5xl font-black text-brand-400 tracking-tight leading-none">
                      {conversionScore}<span className="text-2xl text-brand-500/70">%</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">AOV (Snittorder)</div>
                    <div className="text-2xl font-black text-white">{currentAOV}<span className="text-sm text-slate-500 ml-1">{currency}</span></div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">CLV (Livstidsvärde)</div>
                    <div className="text-2xl font-black text-white">{currentCLV}<span className="text-sm text-slate-500 ml-1">{currency}</span></div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Avhoppsrisk</div>
                    <div className="text-2xl font-black text-white">{100 - conversionScore}<span className="text-sm text-slate-500 ml-1">%</span></div>
                  </div>
                </div>
              </div>
            )}

            {activeView === 'orderConfirmation' && (
              <div className="bg-green-900 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden transition-all">
                <div className="absolute -right-4 -top-4 w-40 h-40 bg-green-500/20 rounded-full blur-3xl pointer-events-none" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                  <div className="md:col-span-3 border-b border-green-800 pb-4 mb-2">
                    <div className="text-xs font-bold uppercase tracking-widest text-green-300/70 mb-1 flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-green-400" /> Retention & Merförsäljning
                    </div>
                    <div className="text-5xl font-black text-green-400 tracking-tight leading-none">
                      {currentCLV}<span className="text-2xl text-green-500/70 ml-2">{currency}</span>
                    </div>
                    <div className="text-sm text-green-200/80 mt-2">Estimerat Livstidsvärde (CLV)</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-green-300/70 mb-1">Återköpsgrad</div>
                    <div className="text-2xl font-black text-white">{Math.round(25 + (showNextPurchaseDiscount ? 5 : 0) + (showReferralProgram ? 3 : 0) + (returnCost === 'free' ? 4 : 0))}<span className="text-sm text-green-400/80 ml-1">%</span></div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-green-300/70 mb-1">Sänkt CAC</div>
                    <div className="text-2xl font-black text-white">-{currentCACReduction}<span className="text-sm text-green-400/80 ml-1">%</span></div>
                  </div>
                </div>
              </div>
            )}

            {activeView === 'return' && (
              <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden transition-all">
                <div className="absolute -right-4 -top-4 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                  <div className="md:col-span-2 border-b border-slate-800 pb-4 mb-2">
                    <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-2">
                      <RefreshCw size={16} className="text-blue-400" /> Returanalys
                    </div>
                    <div className="text-5xl font-black text-blue-400 tracking-tight leading-none">
                      {currentReturnRetention}<span className="text-2xl text-blue-500/70">%</span>
                    </div>
                    <div className="text-sm text-slate-400 mt-2">Återköpsgrad efter genomförd retur</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Returgrad</div>
                    <div className="text-2xl font-black text-white">{currentReturnRate}<span className="text-sm text-slate-500 ml-1">%</span></div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Support / 100 ordrar</div>
                    <div className="text-2xl font-black text-white">{Math.round(5 + (returnCost === 'free' ? 3 : 0) + (returnWindow === '365' ? 2 : 0) + (allowExchange ? -1 : 0))}</div>
                  </div>
                </div>
              </div>
            )}

            {activeView === 'export' && (
              <div className="bg-brand-900 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden transition-all">
                <div className="absolute -right-4 -top-4 w-40 h-40 bg-brand-500/30 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 text-center py-6">
                  <div className="text-sm font-bold uppercase tracking-widest text-brand-300/70 mb-2">Sammanställning</div>
                  <div className="text-2xl font-black text-white">Redo för Export</div>
                </div>
              </div>
            )}

            {/* DYNAMISK SETTINGS PANEL BERONDE PÅ VY */}
            {activeView !== 'export' && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-[calc(100vh-20rem)] transition-all">
                
                {/* CHECKOUT SETTINGS */}
                {activeView === 'checkout' && (
                  <>
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

                    <div className="p-4 sm:p-6 overflow-y-auto flex-1 custom-scrollbar bg-white dark:bg-slate-800">
                      
                      {activeTab === 'settings' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                          
                          <div>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500" /> Affärsmodell & Målgrupp</h3>
                            <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-100 dark:border-slate-700/50">
                              <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-lg">
                                <button onClick={() => setCheckoutType('B2C')} className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${checkoutType === 'B2C' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500'}`}>Konsument (B2C)</button>
                                <button onClick={() => setCheckoutType('B2B')} className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${checkoutType === 'B2B' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500'}`}>Företag (B2B)</button>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo-500" /> Grundläggande UX</h3>
                            <div className="space-y-5 bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-100 dark:border-slate-700/50">
                              <Toggle label="Expresskassor (Wallets)" description="Snabbar upp mobilköp (Apple/Google Pay)" checked={showExpressWallets} onChange={setShowExpressWallets} />
                              <Toggle label="Gästutcheckning" description="Kräv ej inloggning/konto för att handla" checked={isGuestCheckout} onChange={setIsGuestCheckout} />
                              
                              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                                <Toggle label="Blixt-Autofill (E-post+Postnr)" description="Maxar konvertering. Inga långa formulär." checked={hasLightningAutofill} onChange={(v) => { setHasLightningAutofill(v); if(v){ setHasAutofill(false); setAddressAutocomplete(false); } }} />
                              </div>
                              {!hasLightningAutofill && (
                                <>
                                  <Toggle label="Autofill av uppgifter" description="Minskar friktion för kunden via Klarna/Cookie" checked={hasAutofill} onChange={(v) => { setHasAutofill(v); if(v) setAddressAutocomplete(false); }} />
                                  <Toggle label="Address Autocomplete" description="Autofyll via Google Maps (Sökfunktion)" checked={addressAutocomplete} onChange={(v) => { setAddressAutocomplete(v); if(v) setHasAutofill(false); }} />
                                </>
                              )}
                              
                              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                                <Toggle label="Dölj header/footer" description="Stäng in kassan för att minimera distraktioner" checked={hideHeaderFooter} onChange={setHideHeaderFooter} />
                                <div className="mt-4"><Toggle label="EU-Ångerknapp" description="Lagenligt krav 2026. Sänker konvertering." checked={showEuReturnButton} onChange={setShowEuReturnButton} /></div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500" /> Brådska & Trygghet (FOMO)</h3>
                            <div className="space-y-5 bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-100 dark:border-slate-700/50">
                              <Toggle label="Leverans-nedräkning" description="Tydlig nytta: Beställ inom X minuter" checked={showDeliveryCountdown} onChange={setShowDeliveryCountdown} />
                              <Toggle label="Trustbadges & Omdömen" description="Visa betyg från Trustpilot/Recensioner" checked={showTrustbadges} onChange={setShowTrustbadges} />
                              <Toggle label="Lågt lager-varning" description="Visa att produkten snart är slutsåld" checked={showLowStockWarning} onChange={setShowLowStockWarning} />
                              <Toggle label="Social proof" description="Visa hur många som tittar just nu" checked={showSocialProof} onChange={setShowSocialProof} />
                            </div>
                          </div>

                          <div>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-purple-500" /> Merförsäljning & Tillägg (Kassa)</h3>
                            <div className="space-y-5 bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-100 dark:border-slate-700/50">
                              <Toggle label="Cross-sell i varukorg" description="Rekommendera tillbehör innan betalning" checked={hasCrossSell} onChange={setHasCrossSell} />
                              <Toggle label="Presentinslagning" description="Låt kunden lägga till lyxig inslagning (+49 kr)" checked={addGiftWrapping} onChange={setAddGiftWrapping} />
                              <Toggle label="Presentkort / Hälsning" description="Låt kunden skriva en personlig hälsning (+29 kr)" checked={addGiftMessage} onChange={setAddGiftMessage} />
                            </div>
                          </div>

                          <div>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-brand-500" /> Köpknapp (CTA)</h3>
                            <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-100 dark:border-slate-700/50">
                              <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-2">Färgpsykologi</label>
                                <select value={ctaColor} onChange={(e) => setCtaColor(e.target.value as any)} className="w-full h-10 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm px-3 focus:ring-2 focus:ring-brand-500 outline-none">
                                  <option value="green">Grön (Trygghet/Go)</option>
                                  <option value="orange">Orange (Handling)</option>
                                  <option value="red">Röd (Brådskande)</option>
                                  <option value="low-contrast">Grå (Låg kontrast)</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-2">Uppmaning (Copy)</label>
                                <select value={ctaText} onChange={(e) => setCtaText(e.target.value as any)} className="w-full h-10 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm px-3 focus:ring-2 focus:ring-brand-500 outline-none">
                                  <option value="complete">Slutför köp</option>
                                  <option value="pay">Betala säkert</option>
                                  <option value="confirm">Bekräfta order</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === 'shipping' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                          
                          <div>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-800 dark:bg-white" /> Kundens Plats</h3>
                            <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-100 dark:border-slate-700/50">
                              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Simulera postnummer</label>
                              <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="Ex: 111 22" className="w-full h-10 px-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-mono tracking-widest focus:ring-2 focus:ring-brand-500 outline-none" />
                              <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                                Testa logiken! Postnummer som börjar på <strong>8</strong> eller <strong>9</strong> (Norrland) tar automatiskt bort storstadstjänster som Airmee och gör hemleverans dyrare.
                              </p>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Fraktstrategi & Prissättning</h3>
                            <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-100 dark:border-slate-700/50 space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Standardfrakt</label>
                                  <div className="relative">
                                    <input type="number" value={baseShippingCost} onChange={(e) => setBaseShippingCost(Number(e.target.value))} className="w-full h-10 px-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 text-xs">{currency}</div>
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Fri frakt över</label>
                                  <div className="relative">
                                    <input type="number" value={freeShippingThreshold} onChange={(e) => setFreeShippingThreshold(Number(e.target.value))} className="w-full h-10 px-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 text-xs">{currency}</div>
                                  </div>
                                </div>
                              </div>
                              <p className="text-xs text-brand-600 dark:text-brand-400 mt-2 font-medium">Ligger fri frakt nära produktens pris ökar AOV:n drastiskt i simuleringen!</p>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Leveranssätt & Checkout-Logik</h3>
                            <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-100 dark:border-slate-700/50 space-y-5">
                              <Toggle label="Förvälj billigaste frakt" description="Minskar kognitiv last om inget annat är valt" checked={preselectShipping} onChange={setPreselectShipping} />
                              <Toggle label="Kom ihåg fraktval" description="Återkommande kunder får sitt skåp förvalt (+ CLV/CVR)" checked={rememberShipping} onChange={setRememberShipping} />
                              <Toggle label="Visa omdömen för frakt" description="Stärker okända speditörer (ex. ★ 4.8)" checked={showShippingReviews} onChange={setShowShippingReviews} />
                              
                              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Tillåtna alternativ</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {DELIVERY_OPTIONS.map((opt) => (
                                    <label key={opt.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedDeliveryOptions.includes(opt.id) ? 'bg-brand-50 dark:bg-brand-900/20 border-brand-200 dark:border-brand-800' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}>
                                      <input type="checkbox" checked={selectedDeliveryOptions.includes(opt.id)} onChange={(e) => { if (e.target.checked) setSelectedDeliveryOptions([...selectedDeliveryOptions, opt.id]); else setSelectedDeliveryOptions(selectedDeliveryOptions.filter(id => id !== opt.id)); }} className="w-4 h-4 text-brand-600 rounded border-slate-300" />
                                      <div className="flex-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{opt.name}</div>
                                    </label>
                                  ))}
                                </div>
                              </div>
                              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                                <Toggle label="Tillåt kartvy för ombud" description="Låt kunden välja exakt skåp/ombud" checked={allowMapSelection} onChange={setAllowMapSelection} />
                              </div>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Speditörer</h3>
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
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Miljö & Tilläggstjänster (Logistik)</h3>
                            <div className="space-y-5 bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-100 dark:border-slate-700/50">
                              <Toggle label="Svanenmärkt e-handel" description="Visar eco-badge på frakten" checked={ecoSvanen} onChange={setEcoSvanen} />
                              <Toggle label="Miljökompenserad frakt" description="Visar badge för kompensation" checked={ecoKompenserad} onChange={setEcoKompenserad} />
                              <Toggle label="Skicka Grönt" description="PostNords fossilfria tillval" checked={ecoGreen} onChange={setEcoGreen} />
                              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                                <Toggle label="Erbjud Leveransförsäkring" description="Låter kunden teckna extra skydd för 19kr" checked={addInsurance} onChange={setAddInsurance} />
                                <div className="mt-4">
                                  <Toggle label="Förpackningsval (Eco / Diskret)" description="Låt kunden påverka hur paketet ser ut" checked={showPackagingOptions} onChange={setShowPackagingOptions} />
                                </div>
                              </div>
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
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Välj exempelfall (Produkt)</label>
                                <div className="grid grid-cols-1 gap-2">
                                  {PRODUCTS.map(p => (
                                    <button
                                      key={p.id}
                                      onClick={() => setSelectedProductId(p.id)}
                                      className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${selectedProductId === p.id ? 'border-brand-500 bg-white dark:bg-slate-800 shadow-md ring-1 ring-brand-500' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300'}`}
                                    >
                                      <div className={`p-2 rounded-lg ${selectedProductId === p.id ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400' : 'bg-slate-100 dark:bg-slate-900 text-slate-400'}`}>
                                        {p.icon}
                                      </div>
                                      <div className="flex-1">
                                        <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{p.name}</div>
                                        <div className="text-xs font-medium text-slate-500 mt-1 capitalize flex items-center gap-2">
                                          <span>{p.industry}</span>
                                          <span className="w-1 h-1 rounded-full bg-slate-300" />
                                          <span>{p.weight} kg</span>
                                          <span className="w-1 h-1 rounded-full bg-slate-300" />
                                          <span className="text-slate-700 dark:text-slate-300">{p.price} {currency}</span>
                                        </div>
                                      </div>
                                    </button>
                                  ))}
                                </div>
                                <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg mt-4 border border-blue-100 dark:border-blue-800/30">
                                  <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed font-medium">
                                    <Info size={14} className="inline mr-1 mb-0.5" /> 
                                    Frakten anpassas efter produkten. Väljer du <strong>{PRODUCTS[3].name} (65kg)</strong> försvinner paketskåp och brevlåda direkt. Motorn jämför också din inställda fraktkostnad mot vad som är standard för branschen.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Trust & Recensioner</h3>
                            <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-100 dark:border-slate-700/50 space-y-5">
                              <Toggle label="Visa produktrecensioner" description="Stjärnor under produkten (ex. ★★★★★ 124)" checked={showProductReviews} onChange={setShowProductReviews} />
                              <Toggle label="Visa produkt-trustbadges" description="Garanti, Äkthet, Trygg e-handel etc." checked={showProductTrustBadge} onChange={setShowProductTrustBadge} />
                            </div>
                          </div>

                          <div>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-purple-500" /> Retetion & Kampanj</h3>
                            <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-100 dark:border-slate-700/50 space-y-5">
                              <Toggle label="Erbjud Prenumeration" description="För förbrukningsvaror (Sänker AOV, höjer LTV max)" checked={enableSubscription} onChange={setEnableSubscription} />
                              
                              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                                <Toggle label="Visa produktrabatt i kassan" description="Visar ett överstruket pris och sparad summa" checked={showProductDiscount} onChange={setShowProductDiscount} />
                              </div>
                              
                              {showProductDiscount && (
                                <div className="grid grid-cols-2 gap-4 pt-2">
                                  <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-2">Rabatt-copy</label>
                                    <input type="text" value="Köp nu och spara" readOnly className="w-full h-10 px-3 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-2">Rabattsats (%)</label>
                                    <input type="number" value={discountRate} onChange={(e) => setDiscountRate(Number(e.target.value))} className="w-full h-10 px-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === 'provider' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                          <div>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Checkout Motor / Kassa</h3>
                            <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-100 dark:border-slate-700/50">
                              <select value={selectedPlayer} onChange={(e) => setSelectedPlayer(e.target.value)} className="w-full h-12 px-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-base font-medium focus:ring-2 focus:ring-brand-500 outline-none">
                                {PLAYERS.map(p => <option key={p.slug} value={p.slug}>{p.name}</option>)}
                              </select>
                              <p className="text-xs text-slate-500 mt-3">Om du väljer en "Complete Checkout" (ex. Klarna/Walley) agerar de primär betalmetod automatiskt.</p>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Lokala Betalsätt</h3>
                            <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-100 dark:border-slate-700/50 grid grid-cols-1 gap-3">
                              {PAYMENT_METHODS.map((method) => {
                                // Göm valbara metoder om de har samma namn som den kompletta checkout-motorn vi just valde
                                if (activePlayer?.isCompleteCheckout && activePlayer.slug === method.id) return null;
                                
                                return (
                                  <label key={method.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedPaymentMethods.includes(method.id) ? 'bg-white dark:bg-slate-800 border-brand-500 shadow-sm ring-1 ring-brand-500' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}>
                                    <input type="checkbox" checked={selectedPaymentMethods.includes(method.id)} onChange={(e) => { if (e.target.checked) setSelectedPaymentMethods([...selectedPaymentMethods, method.id]); else setSelectedPaymentMethods(selectedPaymentMethods.filter(id => id !== method.id)); }} className="w-4 h-4 text-brand-600 rounded border-slate-300" />
                                    {method.logo ? <FallbackImage src={method.logo} alt={method.name} className="h-6 w-12 object-contain" /> : <div className="w-12 flex justify-center text-slate-400">{method.icon}</div>}
                                    <div className="flex-1">
                                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{method.name}</span>
                                    </div>
                                  </label>
                                )
                              })}
                            </div>
                          </div>

                          <div>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Kortutgivare</h3>
                            <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-100 dark:border-slate-700/50 grid grid-cols-2 gap-3">
                              {CARD_PROVIDERS.map((provider) => (
                                <label key={provider.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedCardProviders.includes(provider.id) ? 'bg-white dark:bg-slate-800 border-brand-500 shadow-sm ring-1 ring-brand-500' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}>
                                  <input type="checkbox" checked={selectedCardProviders.includes(provider.id)} onChange={(e) => { if (e.target.checked) setSelectedCardProviders([...selectedCardProviders, provider.id]); else setSelectedCardProviders(selectedCardProviders.filter(id => id !== provider.id)); }} className="w-4 h-4 text-brand-600 rounded border-slate-300" />
                                  <FallbackImage src={provider.logo} alt={provider.name} className="h-5 w-10 object-contain" />
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* ORDER CONFIRMATION SETTINGS */}
                {activeView === 'orderConfirmation' && (
                  <div className="p-4 sm:p-6 overflow-y-auto flex-1 custom-scrollbar bg-white dark:bg-slate-800">
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500" /> Merförsäljning (AOV)</h3>
                        <div className="space-y-5 bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-100 dark:border-slate-700/50">
                          <Toggle label="Post-purchase Upsell" description="Erbjud extra produkt med 1-klick efter köpet" checked={hasUpsell} onChange={setHasUpsell} />
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500" /> Lojalitet & Kontoskapande (LTV)</h3>
                        <div className="space-y-5 bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-100 dark:border-slate-700/50">
                          <Toggle label="Erbjud konto (om gäst)" description="Låt gästkunder spara lösenord för att få ett konto" checked={ocShowAccountCreation} onChange={setOcShowAccountCreation} />
                          
                          {ocShowAccountCreation && (
                            <div className="pl-4 ml-2 border-l-2 border-slate-200 dark:border-slate-700 space-y-4">
                              <Toggle label="Rabatt vid kontoskapande" description="Ge incitament (ex 10%) att skapa konto direkt" checked={showNextPurchaseDiscount} onChange={setShowNextPurchaseDiscount} />
                              <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-2">Rubrik (Copy)</label>
                                <select value={ocAccountCtaText} onChange={(e) => setOcAccountCtaText(e.target.value)} className="w-full h-10 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm px-3 focus:ring-2 focus:ring-brand-500 outline-none">
                                  <option value="Spara dina uppgifter">Spara dina uppgifter (Klassisk)</option>
                                  <option value="Kom in i värmen">Kom in i värmen (Välkomnande)</option>
                                  <option value="Få rabatt som medlem">Få rabatt som medlem (Incitament)</option>
                                  <option value="Följ din order enkelt">Följ din order enkelt (Nytta)</option>
                                </select>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500" /> Trygghet & Tillväxt</h3>
                        <div className="space-y-5 bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-100 dark:border-slate-700/50">
                          <Toggle label="Order Tracking (Live)" description="Låt kunden se att ordern packas" checked={showOrderTracking} onChange={setShowOrderTracking} />
                          <Toggle label="Värvningsprogram (Referral)" description="Ge X kr - Få X kr när de bjuder in en vän" checked={showReferralProgram} onChange={setShowReferralProgram} />
                          <Toggle label="Social Sharing" description="Låt kunden dela sitt köp på sociala medier" checked={showSocialShare} onChange={setShowSocialShare} />
                          
                          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                             <Toggle label="Ångerrätt/Retur Länk" description="Lagenligt krav 2026 att ha en tydlig 'Ångra'-knapp." checked={ocShowReturnButton} onChange={setOcShowReturnButton} />
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* RETURN SETTINGS */}
                {activeView === 'return' && (
                  <div className="p-4 sm:p-6 overflow-y-auto flex-1 custom-scrollbar bg-white dark:bg-slate-800">
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-800 dark:bg-white" /> Returpolicy</h3>
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-100 dark:border-slate-700/50 space-y-5">
                          
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Vilka varor kan returneras?</label>
                            <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-lg">
                              <button onClick={() => setReturnItemScope('all')} className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${returnItemScope === 'all' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500'}`}>Hela ordern alltid</button>
                              <button onClick={() => setReturnItemScope('specific')} className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${returnItemScope === 'specific' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500'}`}>Välj specifika varor</button>
                            </div>
                          </div>

                          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Returfönster (Dagar)</label>
                            <select value={returnWindow} onChange={(e) => setReturnWindow(e.target.value as any)} className="w-full h-10 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm px-3 focus:ring-2 focus:ring-brand-500 outline-none">
                              <option value="14">14 Dagar (Lagkrav EU)</option>
                              <option value="30">30 Dagar (Standard e-handel)</option>
                              <option value="100">100 Dagar (Konkurrensfördel)</option>
                              <option value="365">365 Dagar (Maximal trygghet)</option>
                            </select>
                          </div>

                          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Kostnad för retur</label>
                            <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-lg">
                              <button onClick={() => setReturnCost('free')} className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${returnCost === 'free' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500'}`}>Gratis (0 kr)</button>
                              <button onClick={() => setReturnCost('paid')} className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${returnCost === 'paid' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500'}`}>Avgift (ex. 39 kr)</button>
                            </div>
                          </div>

                        </div>
                      </div>

                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500" /> Returlogistik & Byten</h3>
                        <div className="space-y-5 bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-100 dark:border-slate-700/50">
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Hur returnerar kunden?</label>
                            <select value={returnMethod} onChange={(e) => setReturnMethod(e.target.value as any)} className="w-full h-10 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm px-3 focus:ring-2 focus:ring-brand-500 outline-none">
                              <option value="qr">Endast QR-kod (Papperslöst)</option>
                              <option value="print">Endast Pappersutskrift</option>
                              <option value="both">Erbjud båda alternativen</option>
                            </select>
                          </div>
                          
                          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                            <Toggle label="Erbjud byte av produkt/storlek" description="Kunden kan byta istället för att få pengarna tillbaka. Räddar intäkten." checked={allowExchange} onChange={setAllowExchange} />
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

// PREMIUM TOGGLE COMPONENT
function Toggle({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4 group cursor-pointer" onClick={() => onChange(!checked)}>
      <div className="flex-1 pr-4">
        <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm leading-none mb-1.5">{label}</div>
        <div className="text-xs text-slate-500 dark:text-slate-400 leading-snug">{description}</div>
      </div>
      <button type="button" className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out ${checked ? 'bg-brand-600' : 'bg-slate-300 dark:bg-slate-600'}`}>
        <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    </div>
  );
}