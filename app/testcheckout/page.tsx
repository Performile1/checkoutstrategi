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
  ShoppingCart,
  Star,
  Lock,
} from 'lucide-react';
import { players } from '@/lib/players';

type CheckoutSection = {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
};

type DeliveryOption = {
  id: string;
  name: string;
  cost: number;
  icon: React.ReactNode;
};

type CardProvider = {
  id: string;
  name: string;
  logo?: string;
  conversionImpact: { se: number; no: number; dk: number; fi: number };
};

const CARD_PROVIDERS: CardProvider[] = [
  { id: 'visa', name: 'Visa', logo: '/logos/visa.svg', conversionImpact: { se: 3, no: 3, dk: 3, fi: 3 } },
  { id: 'mastercard', name: 'Mastercard', logo: '/logos/mastercard.svg', conversionImpact: { se: 3, no: 3, dk: 3, fi: 3 } },
  { id: 'amex', name: 'American Express', logo: '/logos/amex.svg', conversionImpact: { se: 1, no: 1, dk: 1, fi: 1 } },
];

type PaymentMethod = {
  id: string;
  name: string;
  icon: React.ReactNode;
  logo?: string;
  conversionImpact: { se: number; no: number; dk: number; fi: number };
};

type Carrier = {
  id: string;
  name: string;
  logo: string;
  trustScore: number;
  marketImpact: { se: number; no: number; dk: number; fi: number };
  shippingCosts: { pickup: number; locker: number; point: number; home: number; mailbox: number; express: number };
};

const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'klarna', name: 'Klarna', icon: <CreditCard size={18} />, logo: '/logos/klarna.png', conversionImpact: { se: 5, no: 5, dk: 4, fi: 4 } },
  { id: 'card', name: 'Kort', icon: <CreditCard size={18} />, logo: undefined, conversionImpact: { se: 5, no: 5, dk: 5, fi: 5 } },
  { id: 'swish', name: 'Swish', icon: <CreditCard size={18} />, logo: '/logos/swish.svg', conversionImpact: { se: 8, no: 0, dk: 0, fi: 0 } },
  { id: 'vipps', name: 'Vipps', icon: <CreditCard size={18} />, logo: '/logos/vipps.svg', conversionImpact: { se: 0, no: 8, dk: 0, fi: 0 } },
  { id: 'paypal', name: 'PayPal', icon: <CreditCard size={18} />, logo: '/logos/paypal.svg', conversionImpact: { se: 3, no: 3, dk: 3, fi: 3 } },
];

const CARRIERS: Carrier[] = [
  { id: 'postnord', name: 'PostNord', logo: '/logos/postnord.svg', trustScore: 4.2, marketImpact: { se: 3, no: 2, dk: 3, fi: 3 }, shippingCosts: { pickup: 0, locker: 39, point: 29, home: 79, mailbox: 19, express: 149 } },
  { id: 'dhl', name: 'DHL', logo: '/logos/dhl.svg', trustScore: 1.4, marketImpact: { se: -8, no: -5, dk: -6, fi: -7 }, shippingCosts: { pickup: 0, locker: 49, point: 39, home: 89, mailbox: 29, express: 169 } },
  { id: 'bring', name: 'Bring', logo: '/logos/bring.svg', trustScore: 4.0, marketImpact: { se: 2, no: 5, dk: 4, fi: 3 }, shippingCosts: { pickup: 0, locker: 45, point: 35, home: 85, mailbox: 25, express: 159 } },
  { id: 'citymail', name: 'CityMail', logo: '/logos/citymail.svg', trustScore: 4.5, marketImpact: { se: 4, no: 2, dk: 3, fi: 2 }, shippingCosts: { pickup: 0, locker: 35, point: 25, home: 75, mailbox: 15, express: 139 } },
  { id: 'airmee', name: 'Airmee', logo: '/logos/airmee.svg', trustScore: 4.1, marketImpact: { se: 3, no: 2, dk: 2, fi: 2 }, shippingCosts: { pickup: 0, locker: 0, point: 0, home: 49, mailbox: 0, express: 99 } },
  { id: 'earlybird', name: 'Earlybird', logo: '/logos/earlybird.svg', trustScore: 3.8, marketImpact: { se: 2, no: 2, dk: 2, fi: 2 }, shippingCosts: { pickup: 0, locker: 0, point: 0, home: 59, mailbox: 0, express: 119 } },
  { id: 'budbee', name: 'Budbee', logo: '/logos/budbee.svg', trustScore: 4.6, marketImpact: { se: 4, no: 3, dk: 3, fi: 3 }, shippingCosts: { pickup: 0, locker: 29, point: 0, home: 69, mailbox: 0, express: 129 } },
  { id: 'instabox', name: 'Instabox', logo: '/logos/instabox.svg', trustScore: 4.4, marketImpact: { se: 4, no: 3, dk: 3, fi: 3 }, shippingCosts: { pickup: 0, locker: 29, point: 0, home: 69, mailbox: 0, express: 129 } },
  { id: 'helthjem', name: 'Helthjem', logo: '/logos/helthjem.svg', trustScore: 4.3, marketImpact: { se: 2, no: 6, dk: 3, fi: 2 }, shippingCosts: { pickup: 0, locker: 0, point: 0, home: 79, mailbox: 0, express: 149 } },
];

const DELIVERY_OPTIONS: DeliveryOption[] = [
  { id: 'pickup', name: 'Hämtas i butik', cost: 0, icon: <Package size={18} /> },
  { id: 'locker', name: 'Paketskåp', cost: 39, icon: <Home size={18} /> },
  { id: 'point', name: 'Paketombud', cost: 29, icon: <MapPin size={18} /> },
  { id: 'home', name: 'Hemleverans', cost: 79, icon: <Truck size={18} /> },
  { id: 'mailbox', name: 'Brevlåda', cost: 19, icon: <Package size={18} /> },
  { id: 'express', name: 'Expressleverans', cost: 149, icon: <Zap size={18} /> },
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

export default function TestCheckoutPage() {
  const [layoutOrder, setLayoutOrder] = useState(['customer', 'guest', 'coupon', 'shipping', 'payment', 'review']);
  const [activeTab, setActiveTab] = useState('settings');
  const [activeView, setActiveView] = useState<'checkout' | 'orderConfirmation' | 'return' | 'export'>('checkout');

  const [hasAutofill, setHasAutofill] = useState(false);
  const [isGuestCheckout, setIsGuestCheckout] = useState(true);
  const [showNextPurchaseDiscount, setShowNextPurchaseDiscount] = useState(false);
  const [guestLoginText] = useState('Välkommen in i värmen!');

  const [hasUpsell, setHasUpsell] = useState(false);
  const [hasCrossSell, setHasCrossSell] = useState(false);
  const [crossSellProductName] = useState('Premium Tillbehör');
  const [crossSellProductPrice] = useState(99);
  const [crossSellDiscount] = useState(20);

  const [shippingDisplayedEarly] = useState(true);
  const [hideHeaderFooter, setHideHeaderFooter] = useState(false);
  const [orderValue, setOrderValue] = useState(500);
  const [shippingCost] = useState(49);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(0);
  const [selectedDeliveryOptions, setSelectedDeliveryOptions] = useState(['pickup', 'home']);
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>(['klarna', 'card', 'swish']);

  const [freeShipping] = useState(false);
  const [freeHomeDelivery] = useState(false);
  const [freeLockerDelivery] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState('klarna');
  const [customerCountry, setCustomerCountry] = useState('SE');

  const [productName, setProductName] = useState('Premium Tröja');
  const [productPrice, setProductPrice] = useState(499);
  const [showProductDiscount, setShowProductDiscount] = useState(false);
  const [discountRate, setDiscountRate] = useState(20);
  const [discountText, setDiscountText] = useState('Köp nu och spara');

  const [shippingOrder, setShippingOrder] = useState<string[]>(['pickup', 'home']);
  const [paymentOrder, setPaymentOrder] = useState<string[]>(['klarna', 'card']);
  const [selectedCarriers, setSelectedCarriers] = useState<string[]>(['postnord']);
  const [carrierOrder, setCarrierOrder] = useState<string[]>(['postnord']);

  const [showEuReturnButton, setShowEuReturnButton] = useState(false);
  const [addGiftWrapping, setAddGiftWrapping] = useState(false);
  const [addInsurance, setAddInsurance] = useState(false);
  const [addGiftMessage, setAddGiftMessage] = useState(false);
  const [preselectShipping] = useState(false);
  const [selectedCardProviders, setSelectedCardProviders] = useState<string[]>(['visa', 'mastercard']);

  const [ctaColor, setCtaColor] = useState<'green' | 'orange' | 'red' | 'low-contrast'>('green');
  const [ctaText, setCtaText] = useState<'complete' | 'pay' | 'confirm'>('complete');

  const [showLowStockWarning, setShowLowStockWarning] = useState(false);
  const [showCartTimer, setShowCartTimer] = useState(false);
  const [showSocialProof, setShowSocialProof] = useState(false);
  const [returnReason, setReturnReason] = useState('');

  const [exportName, setExportName] = useState('');
  const [exportEmail, setExportEmail] = useState('');
  const [exportCompany, setExportCompany] = useState('');

  const PROVIDER_TO_CARRIER: { [key: string]: string } = {
    dhl: 'dhl', bring: 'bring', postnord: 'postnord', budbee: 'budbee',
    instabox: 'instabox', airmee: 'airmee', earlybird: 'earlybird', citymail: 'citymail',
  };

  const handleProviderChange = (newPlayer: string) => {
    setSelectedPlayer(newPlayer);
    if (newPlayer in PROVIDER_TO_CARRIER) {
      const carrierId = PROVIDER_TO_CARRIER[newPlayer];
      setSelectedCarriers([carrierId]);
      setCarrierOrder([carrierId]);
    }
  };

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

  const BASE_PERCENTAGES = {
    guestCheckout: 15, autofill: 8, shippingDisplayedEarly: 5, hideHeaderFooter: 3,
    upsell: 4, crossSell: 0, freeShipping: 8, freeHomeDelivery: 5, freeLockerDelivery: 4,
    preselectShipping: 3, euReturnButton: 7, giftWrapping: 2, insurance: 1, giftMessage: 1,
    lowStockWarning: 8, cartTimer: 5, socialProof: 3, productDiscount: 8,
  };

  const getDynamicPercentage = (basePercentage: number, index: number, total: number): number => {
    let multiplier = 0.85;
    if (index < 3) multiplier = 1.0;
    else if (index < 7) multiplier = 0.95;
    else if (index < 11) multiplier = 0.90;
    return Math.round(basePercentage * multiplier);
  };

  const calculateConversionScore = () => {
    // 1. BASELINE: En standard checkout (enligt Baymard Institute)
    let score = 45;

    // -- 2. ORDNING & LAYOUT (Drag and drop påverkan) --
    const customerIdx = layoutOrder.indexOf('customer');
    const shippingIdx = layoutOrder.indexOf('shipping');
    const paymentIdx = layoutOrder.indexOf('payment');
    const guestIdx = layoutOrder.indexOf('guest');
    const couponIdx = layoutOrder.indexOf('coupon');

    if (customerIdx === 0) score += 3;
    else if (customerIdx > 2) score -= 8;

    if (paymentIdx !== -1 && shippingIdx !== -1 && paymentIdx < shippingIdx) {
      score -= 15; // Betalning före frakt = UX katastrof
    }

    if (guestIdx !== -1 && guestIdx < 3) score += 2;
    else if (guestIdx > 4) score -= 3;

    if (couponIdx !== -1 && paymentIdx !== -1 && couponIdx < paymentIdx) score -= 3;

    // -- 3. GRUNDLÄGGANDE UX --
    if (isGuestCheckout) score += 12;
    else score -= 18;
    if (hasAutofill) score += 6;
    if (hideHeaderFooter) score += 4;

    // -- 4. FRAKT & LOGISTIK --
    let totalOrderValue = orderValue;
    if (addGiftWrapping) totalOrderValue += 49;
    if (addInsurance) totalOrderValue += 19;

    const shippingRatio = shippingCost / totalOrderValue;
    if (freeShipping || (freeShippingThreshold > 0 && totalOrderValue >= freeShippingThreshold)) {
      score += 10;
    } else if (shippingRatio > 0.2) {
      score -= 15;
    } else if (shippingRatio > 0.1) {
      score -= 5;
    } else {
      score += 2;
    }

    if (selectedDeliveryOptions.length >= 3) score += 5;
    else if (selectedDeliveryOptions.length === 1) score -= 4;

    const marketKey = customerCountry.toLowerCase() as keyof typeof CARD_PROVIDERS[0]['conversionImpact'];

    // Transportörernas lokala trust-impact (ex. PostNord i SE vs DHL)
    selectedCarriers.forEach((carrierId) => {
      const carrier = CARRIERS.find(c => c.id === carrierId);
      if (carrier && marketKey in carrier.marketImpact) {
        score += carrier.marketImpact[marketKey];
      }
    });

    // -- 5. TRUST & BETALNING --
    const player = players.find(p => p.slug === selectedPlayer);
    if (player && player.marketImpact && marketKey in player.marketImpact) {
      score += player.marketImpact[marketKey as keyof typeof player.marketImpact];
    } else {
      score -= 5;
    }

    // Specifika betalmetoder (ex. Swish ger extrem boost i SE, Vipps i NO)
    selectedPaymentMethods.forEach((methodId) => {
      const method = PAYMENT_METHODS.find(m => m.id === methodId);
      if (method && marketKey in method.conversionImpact) {
        score += method.conversionImpact[marketKey];
      }
    });

    // Kortutgivare
    selectedCardProviders.forEach((providerId) => {
      const provider = CARD_PROVIDERS.find(c => c.id === providerId);
      if (provider && marketKey in provider.conversionImpact) {
        score += provider.conversionImpact[marketKey];
      }
    });

    // -- 6. FOMO, URGENCY & KAMPANJ --
    if (showLowStockWarning) score += 3;
    if (showSocialProof) score += 2;
    if (showCartTimer) score += 2;
    if (showProductDiscount) score += Math.min(Math.round(discountRate * 0.3), 8);

    // -- 7. TILLÄGG (FRIKTION VS AOV) --
    // Cross-sell i varukorgen drar upp ordervärdet, men kan sänka konverteringen
    // genom att distrahera kunden (mikrofriktion).
    if (hasCrossSell) score -= 2;

    // (Post-purchase Upsell sker EFTER kassan, så den påverkar varken positivt
    // eller negativt på just checkout-konverteringen, bara på AOV).

    // -- 8. CTA & DESIGN --
    if (ctaColor === 'green') score += 2;
    else if (ctaColor === 'low-contrast') score -= 8;
    if (ctaText === 'pay') score -= 3;
    else if (ctaText === 'complete' || ctaText === 'confirm') score += 1;

    // -- 9. REGELVERK (FRIKTION) --
    if (showEuReturnButton) score -= 5; // Negativ effekt att belysa ångerrätt precis vid köp

    // Säkerställ att kalkylen landar mellan 0 och 100% oavsett extremvärden
    return Math.min(Math.max(Math.round(score), 0), 100);
  };

  const calculateAOV = () => {
    let aov = productPrice;
    if (hasUpsell) aov += crossSellProductPrice * (1 - crossSellDiscount / 100);
    if (addGiftWrapping) aov *= 1.1;
    if (addInsurance) aov *= 1.05;
    if (addGiftMessage) aov *= 1.02;
    if (freeShippingThreshold > 0 && productPrice < freeShippingThreshold) {
      aov += (freeShippingThreshold - productPrice) * 0.3;
    }
    return Math.round(aov);
  };

  const calculateCLV = () => {
    let clv = calculateAOV() * 3;
    if (isGuestCheckout) clv *= 0.6;
    if (showNextPurchaseDiscount) clv *= 1.15;
    if (showSocialProof) clv *= 1.05;
    return Math.round(clv);
  };

  const calculateReturningCustomer = () => {
    let percentage = 25;
    if (!isGuestCheckout) percentage += 15;
    if (showNextPurchaseDiscount) percentage += 10;
    if (showSocialProof) percentage += 5;
    return Math.min(percentage, 90);
  };

  const calculateSupportTickets = () => {
    let tickets = 5;
    if (showEuReturnButton) tickets += 8;
    if (isGuestCheckout) tickets += 3;
    if (preselectShipping) tickets -= 2;
    return Math.max(tickets, 1);
  };

  const getSectionDescription = (sectionId: string) => {
    switch (sectionId) {
      case 'customer': return hasAutofill ? 'Autofill aktiverat: +12% konvertering' : 'Autofill inaktiverat: Kan öka konvertering med 12%';
      case 'guest': return isGuestCheckout ? 'Gästutcheckning: +15% konvertering, -40% CLV' : 'Tvingat konto: -35% konvertering, +50% CLV';
      case 'coupon': return freeShippingThreshold > 0 ? `Fri frakt-gräns: ${freeShippingThreshold} kr` : 'Ingen fri frakt-gräns';
      case 'shipping': return `${freeShipping ? 'Fri frakt alltid' : freeHomeDelivery ? 'Fri hemleverans' : freeLockerDelivery ? 'Fri skåpsleverans' : 'Standard frakt'}, ${selectedDeliveryOptions.length} alternativ valda`;
      case 'crossSell': return hasCrossSell ? `${crossSellProductName} (${crossSellDiscount}% rabatt): +10% AOV` : 'Korsförsäljning inaktiverad';
      case 'payment': return players.find(p => p.slug === selectedPlayer)?.name || 'Ingen provider vald';
      case 'review': return hasUpsell ? 'Post-purchase upsell: +15% AOV' : 'Ingen upsell';
      default: return '';
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    if (result.type === 'SECTION') {
      const items = Array.from(layoutOrder);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      setLayoutOrder(items);
    }
    if (result.type === 'SHIPPING_OPTION') {
      const items = Array.from(shippingOrder);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      setShippingOrder(items);
    }
    if (result.type === 'PAYMENT_METHOD') {
      const items = Array.from(paymentOrder);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      setPaymentOrder(items);
    }
    if (result.type === 'CARRIER') {
      const items = Array.from(carrierOrder);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      setCarrierOrder(items);
    }
  };

  const conversionScore = calculateConversionScore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 mb-2">
            <Settings size={20} />
            <span className="text-sm font-semibold uppercase tracking-wide">Interactive Lab</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">Checkout Lab</h1>
          <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">Experimentera med din kassa och se hur konverteringen påverkas i realtid.</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left: Live Preview */}
          <div className="space-y-6 lg:col-span-7">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Live Preview</h2>
              <div className="flex gap-2 bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-lg">
                {(['checkout', 'orderConfirmation', 'return', 'export'] as const).map(view => (
                  <button
                    key={view}
                    onClick={() => setActiveView(view)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                      activeView === view
                        ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
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
                    <div className="bg-slate-900 dark:bg-slate-950 px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="text-white font-semibold flex items-center gap-2">
                          <ShoppingCart size={18} /> Checkout
                        </div>
                        <div className="flex items-center gap-3 text-slate-400 text-sm">
                          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center"><User size={14} /></div>
                          <div className="w-24 h-2 rounded bg-slate-800" />
                        </div>
                      </div>
                    </div>
                  )}

                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="checkout-sections" type="SECTION">
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="p-6 space-y-5 bg-slate-50/50 dark:bg-slate-900/20">
                          {layoutOrder.map((sectionId, index) => {
                            const section = SECTIONS.find(s => s.id === sectionId);
                            if (!section) return null;
                            return (
                              <Draggable key={section.id} draggableId={section.id} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className={`bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 hover:border-brand-400 dark:hover:border-brand-500 transition-all duration-200 shadow-sm relative group ${snapshot.isDragging ? 'shadow-xl ring-2 ring-brand-500 scale-[1.02] z-50' : ''}`}
                                  >
                                    <div
                                      {...provided.dragHandleProps}
                                      className="absolute top-4 right-4 text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing hover:text-brand-500 p-1"
                                    >
                                      <GripVertical size={18} />
                                    </div>
                                    <div className="flex items-start gap-4">
                                      <div className="text-brand-600 dark:text-brand-400 mt-0.5 p-2 bg-brand-50 dark:bg-brand-900/30 rounded-lg border border-brand-100 dark:border-brand-800/50 shrink-0">
                                        {section.icon}
                                      </div>
                                      <div className="flex-1 min-w-0 pr-6">
                                        <div className="flex items-center gap-2 mb-3">
                                          <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-base">{section.title}</h3>
                                          <div className="group/tooltip relative">
                                            <HelpCircle size={14} className="text-slate-400 hover:text-brand-500 transition-colors cursor-help" />
                                            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 p-2 bg-slate-900 text-white text-xs rounded-lg shadow-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all text-center z-10 pointer-events-none">
                                              {getSectionDescription(sectionId)}
                                            </div>
                                          </div>
                                        </div>
                                        <div className="space-y-3">
                                          {sectionId === 'customer' && (
                                            <div className="space-y-3">
                                              <select value={customerCountry} onChange={(e) => setCustomerCountry(e.target.value)} className="w-full h-10 bg-slate-50 dark:bg-slate-900 rounded-lg px-3 text-sm text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-brand-500 outline-none transition-all">
                                                <option value="SE">Sverige</option>
                                                <option value="NO">Norge</option>
                                                <option value="DK">Danmark</option>
                                                <option value="FI">Finland</option>
                                              </select>
                                              <div className="h-10 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg" />
                                              <div className="h-10 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg" />
                                            </div>
                                          )}
                                          {sectionId === 'guest' && (
                                            <>
                                              <div className="flex items-center gap-3 p-3.5 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800/50">
                                                <CheckCircle2 size={18} className="text-green-600 dark:text-green-500 shrink-0" />
                                                <span className="text-sm font-medium text-green-900 dark:text-green-300">
                                                  {isGuestCheckout ? guestLoginText : 'Skapa konto för att handla'}
                                                </span>
                                              </div>
                                              {isGuestCheckout ? (
                                                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                                                  <div className="space-y-3">
                                                    <div className="h-10 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 flex items-center"><span className="text-xs font-medium text-slate-400">E-post</span></div>
                                                    <div className="h-10 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 flex items-center"><span className="text-xs font-medium text-slate-400">Lösenord (valfritt)</span></div>
                                                  </div>
                                                  <label className="flex items-center gap-2 mt-3 cursor-pointer group">
                                                    <div className="w-4 h-4 rounded border-2 border-slate-300 dark:border-slate-600 group-hover:border-brand-500 transition-colors" />
                                                    <span className="text-sm text-slate-600 dark:text-slate-400 select-none">Spara uppgifter för nästa köp</span>
                                                  </label>
                                                  {showNextPurchaseDiscount && (
                                                    <div className="mt-3 p-3 bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800/50 rounded-lg flex items-start gap-2">
                                                      <Tag size={16} className="text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
                                                      <div>
                                                        <div className="text-xs font-semibold text-brand-900 dark:text-brand-100">Spara 10% på nästa order!</div>
                                                        <div className="text-xs text-brand-700 dark:text-brand-300 mt-0.5">Skapa konto nu för att få din rabattkod.</div>
                                                      </div>
                                                    </div>
                                                  )}
                                                </div>
                                              ) : (
                                                <label className="flex items-center gap-2 mt-3 cursor-pointer group">
                                                  <div className="w-4 h-4 rounded border-2 border-slate-300 dark:border-slate-600 group-hover:border-brand-500 transition-colors" />
                                                  <span className="text-sm text-slate-600 dark:text-slate-400 select-none">Jag har redan ett konto</span>
                                                </label>
                                              )}
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
                                              <Droppable droppableId="shipping-options" type="SHIPPING_OPTION">
                                                {(provided) => (
                                                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                                                    {shippingOrder.map((optId, idx) => {
                                                      const opt = DELIVERY_OPTIONS.find(o => o.id === optId);
                                                      if (!opt) return null;
                                                      let cost = opt.cost;
                                                      if (selectedCarriers.length > 0) {
                                                        const firstCarrier = CARRIERS.find(c => c.id === selectedCarriers[0]);
                                                        if (firstCarrier) cost = firstCarrier.shippingCosts[optId as keyof typeof firstCarrier.shippingCosts];
                                                      }
                                                      return (
                                                        <Draggable key={opt.id} draggableId={opt.id} index={idx}>
                                                          {(provided, snapshot) => (
                                                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className={`flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg border ${snapshot.isDragging ? 'border-brand-500 shadow-lg' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'} transition-all group`}>
                                                              <div className="text-slate-300 dark:text-slate-600 group-hover:text-slate-500 transition-colors cursor-grab active:cursor-grabbing"><GripVertical size={16} /></div>
                                                              <div className="text-slate-400 dark:text-slate-500">{opt.icon}</div>
                                                              <div className="flex-1 flex justify-between items-center">
                                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{opt.name}</span>
                                                                <span className="text-sm font-semibold text-slate-900 dark:text-white">{cost} kr</span>
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
                                              {freeShippingThreshold > 0 && orderValue < freeShippingThreshold && (
                                                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-lg">
                                                  <div className="text-xs font-semibold text-green-800 dark:text-green-300 mb-1">Köp för {freeShippingThreshold - orderValue} kr till för fri frakt!</div>
                                                  <div className="h-1.5 w-full bg-green-200 dark:bg-green-900/50 rounded-full overflow-hidden">
                                                    <div className="h-full bg-green-500" style={{ width: `${(orderValue / freeShippingThreshold) * 100}%` }} />
                                                  </div>
                                                </div>
                                              )}
                                              {selectedCarriers.length > 0 && (
                                                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                                                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">Levereras av</div>
                                                  <Droppable droppableId="carriers" type="CARRIER" direction="horizontal">
                                                    {(provided) => (
                                                      <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-wrap gap-2">
                                                        {carrierOrder.map((carrierId, idx) => {
                                                          const carrier = CARRIERS.find(c => c.id === carrierId);
                                                          if (!carrier) return null;
                                                          return (
                                                            <Draggable key={carrier.id} draggableId={carrier.id} index={idx}>
                                                              {(provided) => (
                                                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-700 cursor-grab hover:border-brand-400 transition-colors">
                                                                  <img src={carrier.logo} alt={carrier.name} className="w-5 h-5 object-contain" />
                                                                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{carrier.name}</span>
                                                                  <span className="text-[10px] font-bold text-green-600 dark:text-green-500">★{carrier.trustScore}</span>
                                                                </div>
                                                              )}
                                                            </Draggable>
                                                          );
                                                        })}
                                                        {provided.placeholder}
                                                      </div>
                                                    )}
                                                  </Droppable>
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
                                                  <div className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{crossSellProductName}</div>
                                                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Perfekt komplement till din order!</div>
                                                  <div className="mt-2 flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                      <span className="font-bold text-slate-900 dark:text-white">{Math.round(crossSellProductPrice * (1 - crossSellDiscount / 100))} kr</span>
                                                      <span className="line-through text-xs text-slate-400">{crossSellProductPrice} kr</span>
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
                                                <div className="w-10 h-6 flex items-center justify-center bg-white dark:bg-slate-800 rounded border border-slate-100 dark:border-slate-600">
                                                  {(() => {
                                                    const player = players.find(p => p.slug === selectedPlayer);
                                                    return player?.logoUrl ? <img src={player.logoUrl} alt={player.name} className="h-4 object-contain" /> : <CreditCard size={14} className="text-slate-400" />;
                                                  })()}
                                                </div>
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                  Betalning via {players.find(p => p.slug === selectedPlayer)?.name || 'Ingen'}
                                                </span>
                                              </div>
                                              <Droppable droppableId="payment-methods" type="PAYMENT_METHOD">
                                                {(provided) => (
                                                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                                                    {paymentOrder.map((methodId, idx) => {
                                                      const method = PAYMENT_METHODS.find(m => m.id === methodId);
                                                      if (!method) return null;
                                                      const marketKey = customerCountry.toLowerCase() as keyof typeof method.conversionImpact;
                                                      const impact = method.conversionImpact[marketKey];
                                                      return (
                                                        <Draggable key={method.id} draggableId={method.id} index={idx}>
                                                          {(provided, snapshot) => (
                                                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className={`flex items-center p-3 bg-white dark:bg-slate-800 rounded-lg border ${snapshot.isDragging ? 'border-brand-500 shadow-lg z-50' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'} transition-all group`}>
                                                              <div className="mr-3 text-slate-300 dark:text-slate-600 group-hover:text-slate-500 cursor-grab active:cursor-grabbing"><GripVertical size={14} /></div>
                                                              <div className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-600 mr-3" />
                                                              {method.logo ? (
                                                                <img src={method.logo} alt={method.name} className="h-5 w-10 object-contain mr-3" />
                                                              ) : (
                                                                <div className="mr-3 text-slate-500">{method.icon}</div>
                                                              )}
                                                              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex-1">{method.name}</span>
                                                              {impact !== 0 && (
                                                                <span className={`text-xs font-semibold ${impact > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
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
                                                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50 flex items-center gap-2 flex-wrap">
                                                  <span className="text-xs font-medium text-slate-400 mr-2">Accepteras:</span>
                                                  {selectedCardProviders.map((providerId) => {
                                                    const provider = CARD_PROVIDERS.find(p => p.id === providerId);
                                                    if (!provider) return null;
                                                    return (
                                                      <div key={provider.id} className="bg-white dark:bg-slate-900 p-1 border border-slate-200 dark:border-slate-700 rounded">
                                                        <img src={provider.logo} alt={provider.name} className="h-4 w-auto object-contain" title={provider.name} />
                                                      </div>
                                                    );
                                                  })}
                                                </div>
                                              )}
                                            </>
                                          )}
                                          {sectionId === 'euReturn' && (
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
                                                    <div className="text-sm font-semibold text-green-900 dark:text-green-100">{discountText}</div>
                                                    <div className="text-xs text-green-700 dark:text-green-400 mt-0.5">Spara {discountRate}% på din beställning</div>
                                                  </div>
                                                </div>
                                              )}
                                              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                                                <div className="flex items-start gap-4">
                                                  <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 flex-shrink-0 flex items-center justify-center">
                                                    <Package size={24} className="text-slate-300 dark:text-slate-600" />
                                                  </div>
                                                  <div className="flex-1">
                                                    <div className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{productName}</div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Antal: 1</div>
                                                    <div className="mt-2 font-medium text-slate-900 dark:text-white">{productPrice} kr</div>
                                                  </div>
                                                </div>
                                                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
                                                  <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                                                    <span>Delsumma</span>
                                                    <span>{productPrice} kr</span>
                                                  </div>
                                                  <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                                                    <span>Frakt</span>
                                                    <span>{freeShipping ? '0 kr' : `${shippingCost} kr`}</span>
                                                  </div>
                                                  <div className="flex justify-between font-bold text-lg text-slate-900 dark:text-white mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                                                    <span>Totalt att betala</span>
                                                    <span>{freeShipping ? productPrice : productPrice + shippingCost} kr</span>
                                                  </div>
                                                </div>
                                              </div>
                                            </>
                                          )}
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
                                                <div className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">Slutför ditt köp innan tiden går ut.</div>
                                              </div>
                                            </div>
                                          )}
                                          {sectionId === 'socialProof' && showSocialProof && (
                                            <div className="flex items-center gap-3 p-3.5 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 rounded-lg">
                                              <Users size={18} className="text-blue-600 dark:text-blue-500 shrink-0" />
                                              <div className="flex-1">
                                                <div className="text-sm font-bold text-blue-900 dark:text-blue-100">Mycket populär produkt!</div>
                                                <div className="text-xs text-blue-700 dark:text-blue-300 mt-0.5">3 andra personer genomför köp just nu.</div>
                                              </div>
                                            </div>
                                          )}
                                          {sectionId === 'giftWrapping' && addGiftWrapping && (
                                            <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800/30 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors">
                                              <Package size={20} className="text-purple-600 dark:text-purple-400 shrink-0" />
                                              <div className="flex-1">
                                                <div className="text-sm font-semibold text-purple-900 dark:text-purple-100">Presentinslagning (+49 kr)</div>
                                                <div className="text-xs text-purple-700 dark:text-purple-300 mt-0.5">Få ordern levererad i ett vackert paket.</div>
                                              </div>
                                              <div className="w-5 h-5 rounded border-2 border-purple-300 dark:border-purple-700" />
                                            </div>
                                          )}
                                          {sectionId === 'insurance' && addInsurance && (
                                            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                                              <Shield size={20} className="text-slate-500 dark:text-slate-400 shrink-0" />
                                              <div className="flex-1">
                                                <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">Leveransförsäkring (+19 kr)</div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Skydda paketet mot stöld och skador.</div>
                                              </div>
                                              <div className="w-5 h-5 rounded border-2 border-slate-300 dark:border-slate-600" />
                                            </div>
                                          )}
                                          {sectionId === 'giftMessage' && addGiftMessage && (
                                            <div className="flex items-center gap-3 p-3 bg-pink-50 dark:bg-pink-900/10 border border-pink-200 dark:border-pink-800/30 rounded-lg cursor-pointer hover:bg-pink-100 transition-colors">
                                              <DollarSign size={20} className="text-pink-600 dark:text-pink-400 shrink-0" />
                                              <div className="flex-1">
                                                <div className="text-sm font-semibold text-pink-900 dark:text-pink-100">Lägg till presentkort/hälsning</div>
                                                <div className="text-xs text-pink-700 dark:text-pink-300 mt-0.5">Överraska mottagaren med ett kort.</div>
                                              </div>
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

              {activeView === 'orderConfirmation' && (
                <div className="p-8">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mx-auto mb-5 flex items-center justify-center shadow-inner">
                      <CheckCircle2 size={40} className="text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Tack för din order!</h2>
                    <p className="text-slate-600 dark:text-slate-400">Orderbekräftelse är skickad till din e-post.</p>
                  </div>
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
                          <div className="font-semibold text-slate-900 dark:text-slate-100">Mystery Box (Värde 500 kr)</div>
                          <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Lägg till i din nuvarande order utan extra frakt.</div>
                          <div className="mt-3 flex items-center gap-3">
                            <span className="font-bold text-lg text-slate-900 dark:text-white">199 kr</span>
                            <button className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">Lägg till i order</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-5 mb-6 border border-slate-100 dark:border-slate-800">
                    <div className="font-semibold text-slate-900 dark:text-slate-100 mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">Orderöversikt</div>
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex-shrink-0 flex items-center justify-center">
                        <Package size={24} className="text-slate-400 dark:text-slate-500" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-slate-800 dark:text-slate-200">{productName}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">{productPrice} kr</div>
                        <div className="text-xs text-slate-500 mt-1">Antal: 1</div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-4 border border-blue-100 dark:border-blue-800/30 text-center">
                      <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mb-1">{calculateCLV()} kr</div>
                      <div className="text-xs font-semibold text-blue-800 dark:text-blue-300 uppercase tracking-wide">CLV (Livstidsvärde)</div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/10 rounded-xl p-4 border border-green-100 dark:border-green-800/30 text-center">
                      <div className="text-2xl font-black text-green-600 dark:text-green-400 mb-1">{calculateReturningCustomer()}%</div>
                      <div className="text-xs font-semibold text-green-800 dark:text-green-300 uppercase tracking-wide">Återkommande Kunder</div>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/10 rounded-xl p-4 border border-purple-100 dark:border-purple-800/30 text-center">
                      <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mb-1">{calculateSupportTickets()}</div>
                      <div className="text-xs font-semibold text-purple-800 dark:text-purple-300 uppercase tracking-wide">Supportärenden/100</div>
                    </div>
                  </div>
                  {isGuestCheckout && (
                    <div className="bg-slate-900 dark:bg-slate-800 rounded-xl p-6 text-white shadow-xl">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-brand-500/20 rounded-full flex items-center justify-center"><User size={20} className="text-brand-400" /></div>
                        <div>
                          <div className="font-bold text-lg">Spara dina uppgifter</div>
                          <div className="text-sm text-slate-300">Skapa konto med ett klick för smidigare köp.</div>
                        </div>
                      </div>
                      {showNextPurchaseDiscount && (
                        <div className="bg-brand-500/20 border border-brand-500/30 rounded-lg p-3 mb-4 flex items-center gap-2">
                          <Tag size={16} className="text-brand-400" />
                          <span className="text-sm font-medium text-brand-100">Få 10% rabatt på nästa order om du skapar konto nu!</span>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <input type="password" placeholder="Välj ett lösenord" className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500" />
                        <button className="px-6 py-3 bg-brand-600 text-white rounded-lg text-sm font-bold hover:bg-brand-500 transition-colors">Skapa konto</button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeView === 'return' && (
                <div className="p-8">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full mx-auto mb-5 flex items-center justify-center shadow-inner">
                      <RefreshCw size={36} className="text-slate-600 dark:text-slate-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Retur & Byte</h2>
                    <p className="text-slate-600 dark:text-slate-400">Hantera din retur enkelt och smidigt helt digitalt.</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-5 mb-6 border border-slate-200 dark:border-slate-800">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Varför vill du returnera produkten?</label>
                    <select value={returnReason} onChange={(e) => setReturnReason(e.target.value)} className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white shadow-sm focus:ring-2 focus:ring-brand-500 outline-none">
                      <option value="">Välj en orsak...</option>
                      <option value="wrong-size">Fel storlek</option>
                      <option value="wrong-item">Fel artikel skickad</option>
                      <option value="not-as-described">Motsvarade inte förväntningarna</option>
                      <option value="changed-mind">Ångrat mig (EU-Direktiv)</option>
                      <option value="damaged">Skadad vid leverans</option>
                    </select>
                  </div>
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-6 mb-6 border border-slate-200 dark:border-slate-700 text-center shadow-sm">
                    <div className="inline-block p-2 bg-white rounded-xl border-2 border-slate-200 mb-3 shadow-sm">
                      <QrCodeIcon size={80} className="text-slate-800" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1">Din digitala retursedel</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto">Visa denna QR-kod hos ditt ombud. Du behöver inte skriva ut något.</p>
                  </div>
                  <button className="w-full py-4 px-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity shadow-lg">
                    Bekräfta och skapa retur
                  </button>
                </div>
              )}

              {activeView === 'export' && (
                <div className="p-8">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-brand-100 dark:bg-brand-900/30 rounded-full mx-auto mb-5 flex items-center justify-center shadow-inner">
                      <Download size={36} className="text-brand-600 dark:text-brand-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Exportera Analys</h2>
                    <p className="text-slate-600 dark:text-slate-400">Få en komplett sammanfattning av din konfiguration skickad som PDF.</p>
                  </div>
                  <div className="space-y-5 mb-8">
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
                  <button disabled={!exportName || !exportEmail} className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all shadow-lg ${!exportName || !exportEmail ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none' : 'bg-brand-600 text-white hover:bg-brand-500 shadow-brand-500/25 hover:-translate-y-0.5'}`}>
                    {!exportName || !exportEmail ? 'Fyll i obligatoriska fält' : 'Generera och ladda ned PDF'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right: Settings Panel */}
          <div className="lg:col-span-5">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden sticky top-8 flex flex-col h-[calc(100vh-4rem)]">
              <div className="p-6 pb-0 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Settings size={20} className="text-brand-500" /> Checkout Motor
                  </h2>
                  <div className="flex flex-col items-end">
                    <div className="text-3xl font-black text-brand-600 dark:text-brand-400 tracking-tight leading-none">{conversionScore}<span className="text-lg text-brand-500/70">%</span></div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-1">Konvertering</div>
                  </div>
                </div>
                <div className="flex gap-1 overflow-x-auto -mx-2 px-2 pb-px">
                  {(['settings', 'shipping', 'product', 'provider'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-colors whitespace-nowrap border-b-2 ${
                        activeTab === tab
                          ? 'border-brand-500 text-brand-600 dark:text-brand-400 bg-white dark:bg-slate-800'
                          : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                      }`}
                    >
                      {tab === 'settings' ? 'Upplevelse' : tab === 'shipping' ? 'Logistik' : tab === 'product' ? 'Kundkorg' : 'Betalning'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 overflow-y-auto flex-1 bg-white dark:bg-slate-800">
                {activeTab === 'settings' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500" /> Grundläggande UX
                      </h3>
                      <div className="space-y-5 bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-100 dark:border-slate-700/50">
                        <Toggle label="Dölj header/footer" description="Ta bort navigering för maximalt fokus" checked={hideHeaderFooter} onChange={setHideHeaderFooter} />
                        <Toggle label="Autofill av uppgifter" description="Minskar friktion för kunden vid inmatning" checked={hasAutofill} onChange={setHasAutofill} />
                        <Toggle label="Gästutcheckning" description="Tillåt köp utan att tvinga kontoskapande" checked={isGuestCheckout} onChange={setIsGuestCheckout} />
                        <Toggle label="EU-Ångerknapp" description="Lagenligt krav 2026 (sänker konvertering)" checked={showEuReturnButton} onChange={setShowEuReturnButton} />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500" /> Brådska & Bekräftelse
                      </h3>
                      <div className="space-y-5 bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-100 dark:border-slate-700/50">
                        <Toggle label="Varukorgstimer" description="Skapa brådska med visuell nedräkning" checked={showCartTimer} onChange={setShowCartTimer} />
                        <Toggle label="Lågt lager-varning" description="Visa att produkten snart är slutsåld" checked={showLowStockWarning} onChange={setShowLowStockWarning} />
                        <Toggle label="Social proof" description="Visa hur många som tittar/köper just nu" checked={showSocialProof} onChange={setShowSocialProof} />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-500" /> Merförsäljning (AOV)
                      </h3>
                      <div className="space-y-5 bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-100 dark:border-slate-700/50">
                        <Toggle label="Cross-sell i varukorg" description="Rekommendera komplementära produkter" checked={hasCrossSell} onChange={setHasCrossSell} />
                        <Toggle label="Post-purchase Upsell" description="Erbjud mer efter genomfört köp (1-click)" checked={hasUpsell} onChange={setHasUpsell} />
                        <Toggle label="Rabatt vid kontoskapande" description="Erbjud -10% för att öka inloggningar" checked={showNextPurchaseDiscount} onChange={setShowNextPurchaseDiscount} />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500" /> Extra Tjänster
                      </h3>
                      <div className="space-y-5 bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-100 dark:border-slate-700/50">
                        <Toggle label="Presentinslagning" description="Låt kunden lägga till lyxig inslagning" checked={addGiftWrapping} onChange={setAddGiftWrapping} />
                        <Toggle label="Leveransförsäkring" description="Erbjud extra trygghet mot skador" checked={addInsurance} onChange={setAddInsurance} />
                        <Toggle label="Presentkort" description="Låt kunden skriva en personlig hälsning" checked={addGiftMessage} onChange={setAddGiftMessage} />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-brand-500" /> Köpknapp (CTA)
                      </h3>
                      <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-100 dark:border-slate-700/50">
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-2">Knappfärg</label>
                          <select value={ctaColor} onChange={(e) => setCtaColor(e.target.value as any)} className="w-full h-10 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm px-3 focus:ring-2 focus:ring-brand-500 outline-none">
                            <option value="green">Grön (Säkerhet)</option>
                            <option value="orange">Orange (Handling)</option>
                            <option value="red">Röd (Brådskande)</option>
                            <option value="low-contrast">Grå (Låg kontrast)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-2">Knapptext</label>
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
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Fraktstrategi</h3>
                      <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-100 dark:border-slate-700/50 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Gräns för fri frakt (kr)</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">kr</div>
                            <input type="number" value={freeShippingThreshold} onChange={(e) => setFreeShippingThreshold(Number(e.target.value))} className="w-full h-10 pl-9 pr-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
                          </div>
                          <p className="text-xs text-slate-500 mt-2">Sätt till 0 för att avaktivera gränsen.</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Leveranssätt</h3>
                      <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-100 dark:border-slate-700/50">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {DELIVERY_OPTIONS.map((opt) => (
                            <label key={opt.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedDeliveryOptions.includes(opt.id) ? 'bg-brand-50 dark:bg-brand-900/20 border-brand-200 dark:border-brand-800' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}>
                              <input
                                type="checkbox"
                                checked={selectedDeliveryOptions.includes(opt.id)}
                                onChange={(e) => {
                                  if (e.target.checked) setSelectedDeliveryOptions([...selectedDeliveryOptions, opt.id]);
                                  else setSelectedDeliveryOptions(selectedDeliveryOptions.filter(id => id !== opt.id));
                                }}
                                className="w-4 h-4 text-brand-600 focus:ring-brand-500 rounded border-slate-300"
                              />
                              <div className="flex-1">
                                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{opt.name}</div>
                                <div className="text-xs text-slate-500">{opt.cost} kr</div>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Speditörer</h3>
                      <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-100 dark:border-slate-700/50">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {CARRIERS.map((carrier) => (
                            <label key={carrier.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedCarriers.includes(carrier.id) ? 'bg-white dark:bg-slate-800 border-brand-500 shadow-sm ring-1 ring-brand-500' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}>
                              <input
                                type="checkbox"
                                checked={selectedCarriers.includes(carrier.id)}
                                onChange={(e) => {
                                  if (e.target.checked) setSelectedCarriers([...selectedCarriers, carrier.id]);
                                  else setSelectedCarriers(selectedCarriers.filter(id => id !== carrier.id));
                                }}
                                className="w-4 h-4 text-brand-600 focus:ring-brand-500 rounded border-slate-300"
                              />
                              <img src={carrier.logo} alt={carrier.name} className="h-4 w-12 object-contain" />
                              <div className="flex-1 text-right">
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{carrier.name}</span>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'product' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Varukorgens innehåll</h3>
                      <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-100 dark:border-slate-700/50 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Produktnamn</label>
                          <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} className="w-full h-10 px-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Pris (kr)</label>
                          <input type="number" value={productPrice} onChange={(e) => { setProductPrice(Number(e.target.value)); setOrderValue(Number(e.target.value)); }} className="w-full h-10 px-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Rabatter & Kampanjer</h3>
                      <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-100 dark:border-slate-700/50 space-y-5">
                        <Toggle label="Visa produktrabatt i kassan" description="Visar ett överstruket pris och sparad summa" checked={showProductDiscount} onChange={setShowProductDiscount} />
                        {showProductDiscount && (
                          <div className="pl-4 ml-2 border-l-2 border-brand-200 dark:border-brand-800 space-y-4">
                            <div>
                              <label className="block text-xs font-medium text-slate-500 mb-1">Marknadsföringstext</label>
                              <input type="text" value={discountText} onChange={(e) => setDiscountText(e.target.value)} className="w-full h-9 px-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-slate-500 mb-1">Rabattsats (%)</label>
                              <input type="number" value={discountRate} onChange={(e) => setDiscountRate(Number(e.target.value))} className="w-full h-9 px-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'provider' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Checkout Provider</h3>
                      <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-100 dark:border-slate-700/50">
                        <select value={selectedPlayer} onChange={(e) => handleProviderChange(e.target.value)} className="w-full h-12 px-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-base font-medium focus:ring-2 focus:ring-brand-500 outline-none">
                          {players.map((player) => (
                            <option key={player.slug} value={player.slug}>{player.name}</option>
                          ))}
                        </select>
                        <p className="text-xs text-slate-500 mt-3">Att byta provider låser automatiskt upp de fraktbolag och betalsätt som stöds by default.</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Lokala Betalsätt</h3>
                      <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-100 dark:border-slate-700/50">
                        <div className="grid grid-cols-1 gap-3">
                          {PAYMENT_METHODS.map((method) => (
                            <label key={method.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedPaymentMethods.includes(method.id) ? 'bg-white dark:bg-slate-800 border-brand-500 shadow-sm ring-1 ring-brand-500' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}>
                              <input
                                type="checkbox"
                                checked={selectedPaymentMethods.includes(method.id)}
                                onChange={(e) => {
                                  if (e.target.checked) setSelectedPaymentMethods([...selectedPaymentMethods, method.id]);
                                  else setSelectedPaymentMethods(selectedPaymentMethods.filter(id => id !== method.id));
                                }}
                                className="w-4 h-4 text-brand-600 focus:ring-brand-500 rounded border-slate-300"
                              />
                              {method.logo ? (
                                <img src={method.logo} alt={method.name} className="h-5 w-12 object-contain" />
                              ) : (
                                <div className="w-12 flex justify-center text-slate-400">{method.icon}</div>
                              )}
                              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{method.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Kortutgivare</h3>
                      <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-100 dark:border-slate-700/50">
                        <div className="grid grid-cols-2 gap-3">
                          {CARD_PROVIDERS.map((provider) => (
                            <label key={provider.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedCardProviders.includes(provider.id) ? 'bg-white dark:bg-slate-800 border-brand-500 shadow-sm ring-1 ring-brand-500' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}>
                              <input
                                type="checkbox"
                                checked={selectedCardProviders.includes(provider.id)}
                                onChange={(e) => {
                                  if (e.target.checked) setSelectedCardProviders([...selectedCardProviders, provider.id]);
                                  else setSelectedCardProviders(selectedCardProviders.filter(id => id !== provider.id));
                                }}
                                className="w-4 h-4 text-brand-600 focus:ring-brand-500 rounded border-slate-300"
                              />
                              <img src={provider.logo} alt={provider.name} className="h-5 w-10 object-contain" />
                            </label>
                          ))}
                        </div>
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
    <div className="flex items-center justify-between gap-4 group">
      <div className="flex-1">
        <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm leading-none mb-1">{label}</div>
        <div className="text-xs text-slate-500 dark:text-slate-400 leading-snug">{description}</div>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-600 focus:ring-offset-2 ${
          checked ? 'bg-brand-600' : 'bg-slate-300 dark:bg-slate-600'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
