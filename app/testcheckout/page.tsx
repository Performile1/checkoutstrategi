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
  GripVertical
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
  conversionImpact: { se: number; no: number; dk: number; fi: number; };
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
  conversionImpact: { se: number; no: number; dk: number; fi: number; };
};

type Carrier = {
  id: string;
  name: string;
  logo: string;
  trustScore: number;
  marketImpact: { se: number; no: number; dk: number; fi: number; };
  shippingCosts: { pickup: number; locker: number; point: number; home: number; mailbox: number; express: number; };
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
  { id: 'customer', title: 'Kunduppgifter', icon: <User size={20} />, description: 'Namn, e-post, adress' },
  { id: 'guest', title: 'Gästutcheckning', icon: <User size={20} />, description: 'Köp utan konto' },
  { id: 'coupon', title: 'Rabattkod', icon: <DollarSign size={20} />, description: 'Ange rabattkod' },
  { id: 'shipping', title: 'Leveransval', icon: <Truck size={20} />, description: 'Fraktalternativ och ombud' },
  { id: 'crossSell', title: 'Korsförsäljning', icon: <TrendingUp size={20} />, description: 'Rekommenderade tillbehör' },
  { id: 'payment', title: 'Betalning', icon: <CreditCard size={20} />, description: 'Betalmetoder och kort' },
  { id: 'euReturn', title: 'EU-Ångerknapp', icon: <RefreshCw size={20} />, description: 'Ångra köp enligt EU-direktiv' },
  { id: 'review', title: 'Orderöversikt', icon: <Package size={20} />, description: 'Sammanfattning av köp' },
  { id: 'lowStock', title: 'Lagersaldovarning', icon: <AlertTriangle size={20} />, description: 'Endast X kvar i lager' },
  { id: 'cartTimer', title: 'Varukorgstimer', icon: <Clock size={20} />, description: 'Reserverad i X minuter' },
  { id: 'socialProof', title: 'Social Proof', icon: <Users size={20} />, description: 'X personer tittar nu' },
  { id: 'giftWrapping', title: 'Presentinslagning', icon: <Package size={20} />, description: 'Lägg till presentinslagning' },
  { id: 'insurance', title: 'Försäkring', icon: <Shield size={20} />, description: 'Lägg till försäkring' },
  { id: 'giftMessage', title: 'Presentkort', icon: <DollarSign size={20} />, description: 'Lägg till hälsning' },
];

export default function TestCheckoutPage() {
  const [layoutOrder, setLayoutOrder] = useState(['customer', 'guest', 'coupon', 'cartTimer', 'shipping', 'payment', 'socialProof', 'review']);
  const [hasAutofill, setHasAutofill] = useState(false);
  const [isGuestCheckout, setIsGuestCheckout] = useState(true);
  const [guestLoginText, setGuestLoginText] = useState('Välkommen in i värmen!');
  const [hasUpsell, setHasUpsell] = useState(false);
  const [hasCrossSell, setHasCrossSell] = useState(false);
  const [crossSellProductName, setCrossSellProductName] = useState('Premium Tillbehör');
  const [crossSellProductPrice, setCrossSellProductPrice] = useState(99);
  const [crossSellDiscount, setCrossSellDiscount] = useState(20);
  const [shippingDisplayedEarly, setShippingDisplayedEarly] = useState(true);
  const [hideHeaderFooter, setHideHeaderFooter] = useState(false);
  const [orderValue, setOrderValue] = useState(500);
  const [shippingCost, setShippingCost] = useState(49);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(0);
  const [selectedDeliveryOptions, setSelectedDeliveryOptions] = useState(['pickup', 'home']);
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>(['klarna', 'card', 'swish']);
  const [freeShipping, setFreeShipping] = useState(false);
  const [freeHomeDelivery, setFreeHomeDelivery] = useState(false);
  const [freeLockerDelivery, setFreeLockerDelivery] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState('klarna');
  const [customerCountry, setCustomerCountry] = useState('SE');

  const PROVIDER_TO_CARRIER: { [key: string]: string } = {
    'dhl': 'dhl', 'bring': 'bring', 'postnord': 'postnord', 'budbee': 'budbee',
    'instabox': 'instabox', 'airmee': 'airmee', 'earlybird': 'earlybird', 'citymail': 'citymail',
  };

  const handleProviderChange = (newPlayer: string) => {
    setSelectedPlayer(newPlayer);
    if (newPlayer in PROVIDER_TO_CARRIER) {
      const carrierId = PROVIDER_TO_CARRIER[newPlayer];
      setSelectedCarriers([carrierId]);
      setCarrierOrder([carrierId]);
    }
  };

  const [shippingTexts, setShippingTexts] = useState<{ [key: string]: string }>({
    pickup: 'Hämtas i butik',
    locker: 'Paketskåp - Hämtas när som helst',
    home: 'Hemleverans - Levereras Tis 29/6 mellan 08-17',
    point: 'Paketombud - Öppet 10-20',
    express: 'Expressleverans - Idag 10:00-11:30',
    mailbox: 'Brevlåda - Levereras 1-3 dagar',
  });

  const [activeTab, setActiveTab] = useState('settings');
  const [productName, setProductName] = useState('Premium Tröja');
  const [productPrice, setProductPrice] = useState(499);

  const PRODUCTS = [
    { id: 'low', name: 'Basic T-shirt', price: 199 },
    { id: 'medium', name: 'Premium Tröja', price: 499 },
    { id: 'high', name: 'Designer Jacka', price: 1299 },
    { id: 'premium', name: 'Lyx Klocka', price: 2999 },
  ];

  const handleProductSelect = (productId: string) => {
    const product = PRODUCTS.find(p => p.id === productId);
    if (product) {
      setProductName(product.name);
      setProductPrice(product.price);
      setOrderValue(product.price);
    }
  };

  const [shippingOrder, setShippingOrder] = useState<string[]>(['pickup', 'home']);
  const [paymentOrder, setPaymentOrder] = useState<string[]>(['klarna', 'card']);
  const [selectedCarriers, setSelectedCarriers] = useState<string[]>(['postnord']);
  const [carrierOrder, setCarrierOrder] = useState<string[]>(['postnord']);
  const [showEuReturnButton, setShowEuReturnButton] = useState(false);
  const [addGiftWrapping, setAddGiftWrapping] = useState(false);
  const [addInsurance, setAddInsurance] = useState(false);
  const [addGiftMessage, setAddGiftMessage] = useState(false);
  const [preselectShipping, setPreselectShipping] = useState(false);
  const [selectedCardProviders, setSelectedCardProviders] = useState<string[]>(['visa', 'mastercard']);
  const [ctaColor, setCtaColor] = useState<'green' | 'orange' | 'red' | 'low-contrast'>('green');
  const [ctaText, setCtaText] = useState<'complete' | 'pay' | 'confirm'>('complete');
  const [showLowStockWarning, setShowLowStockWarning] = useState(true);
  const [showCartTimer, setShowCartTimer] = useState(true);
  const [showSocialProof, setShowSocialProof] = useState(true);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnReason, setReturnReason] = useState('');
  const [showNextPurchaseDiscount, setShowNextPurchaseDiscount] = useState(false);
  const [showProductDiscount, setShowProductDiscount] = useState(false);
  const [discountRate, setDiscountRate] = useState(20);
  const [discountText, setDiscountText] = useState('Köp nu och spara');
  const [activeView, setActiveView] = useState<'checkout' | 'orderConfirmation' | 'return' | 'export'>('checkout');
  const [exportName, setExportName] = useState('');
  const [exportEmail, setExportEmail] = useState('');
  const [exportCompany, setExportCompany] = useState('');

  useEffect(() => {
    setLayoutOrder(prev => {
      const newOrder = [...prev];
      if (showCartTimer && !newOrder.includes('cartTimer')) newOrder.splice(3, 0, 'cartTimer');
      else if (!showCartTimer && newOrder.includes('cartTimer')) newOrder.splice(newOrder.indexOf('cartTimer'), 1);
      return newOrder;
    });
  }, [showCartTimer]);

  useEffect(() => {
    setLayoutOrder(prev => {
      const newOrder = [...prev];
      if (showSocialProof && !newOrder.includes('socialProof')) newOrder.push('socialProof');
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
      if (hasUpsell && !newOrder.includes('crossSell')) {
        const shippingIndex = newOrder.indexOf('shipping');
        if (shippingIndex > -1) newOrder.splice(shippingIndex + 1, 0, 'crossSell');
        else newOrder.push('crossSell');
      } else if (!hasUpsell && newOrder.includes('crossSell')) {
        newOrder.splice(newOrder.indexOf('crossSell'), 1);
      }
      return newOrder;
    });
  }, [hasUpsell]);

  const BASE_PERCENTAGES = {
    guestCheckout: 15, autofill: 8, shippingDisplayedEarly: 5, hideHeaderFooter: 3,
    upsell: 4, crossSell: 0, freeShipping: 8, freeHomeDelivery: 5, freeLockerDelivery: 4,
    preselectShipping: 3, euReturnButton: 7, giftWrapping: 2, insurance: 1, giftMessage: 1,
    lowStockWarning: 8, cartTimer: 5, socialProof: 3, productDiscount: 8,
  };

  const getPositionMultiplier = (index: number, total: number): number => {
    if (index < 3) return 1.0;
    if (index < 7) return 0.95;
    if (index < 11) return 0.90;
    return 0.85;
  };

  const getDynamicPercentage = (basePercentage: number, index: number, total: number): number => {
    return Math.round(basePercentage * getPositionMultiplier(index, total));
  };

  const SETTINGS_ORDER = [
    { id: 'guestCheckout', base: BASE_PERCENTAGES.guestCheckout },
    { id: 'autofill', base: BASE_PERCENTAGES.autofill },
    { id: 'shippingDisplayedEarly', base: BASE_PERCENTAGES.shippingDisplayedEarly },
    { id: 'hideHeaderFooter', base: BASE_PERCENTAGES.hideHeaderFooter },
    { id: 'upsell', base: BASE_PERCENTAGES.upsell },
    { id: 'crossSell', base: BASE_PERCENTAGES.crossSell },
    { id: 'freeShipping', base: BASE_PERCENTAGES.freeShipping },
    { id: 'freeHomeDelivery', base: BASE_PERCENTAGES.freeHomeDelivery },
    { id: 'freeLockerDelivery', base: BASE_PERCENTAGES.freeLockerDelivery },
    { id: 'preselectShipping', base: BASE_PERCENTAGES.preselectShipping },
    { id: 'euReturnButton', base: BASE_PERCENTAGES.euReturnButton },
    { id: 'giftWrapping', base: BASE_PERCENTAGES.giftWrapping },
    { id: 'insurance', base: BASE_PERCENTAGES.insurance },
    { id: 'giftMessage', base: BASE_PERCENTAGES.giftMessage },
  ];

  const calculateConversionScore = () => {
    let score = 20;
    let totalOrderValue = orderValue;
    if (addGiftWrapping) totalOrderValue += Math.round(orderValue * 0.10);
    if (addInsurance) totalOrderValue += Math.round(orderValue * 0.05);
    if (addGiftMessage) totalOrderValue += Math.round(orderValue * 0.02);

    if (!isGuestCheckout) score -= 35;
    else score += getDynamicPercentage(BASE_PERCENTAGES.guestCheckout, SETTINGS_ORDER.findIndex(s => s.id === 'guestCheckout'), SETTINGS_ORDER.length);
    if (hasAutofill) score += getDynamicPercentage(BASE_PERCENTAGES.autofill, SETTINGS_ORDER.findIndex(s => s.id === 'autofill'), SETTINGS_ORDER.length);
    if (!shippingDisplayedEarly) score -= 48;
    else score += getDynamicPercentage(BASE_PERCENTAGES.shippingDisplayedEarly, SETTINGS_ORDER.findIndex(s => s.id === 'shippingDisplayedEarly'), SETTINGS_ORDER.length);
    if (hideHeaderFooter) score += getDynamicPercentage(BASE_PERCENTAGES.hideHeaderFooter, SETTINGS_ORDER.findIndex(s => s.id === 'hideHeaderFooter'), SETTINGS_ORDER.length);
    if (hasUpsell) score += getDynamicPercentage(BASE_PERCENTAGES.upsell, SETTINGS_ORDER.findIndex(s => s.id === 'upsell'), SETTINGS_ORDER.length);
    if (freeShippingThreshold > 0) score += getDynamicPercentage(BASE_PERCENTAGES.freeShipping, SETTINGS_ORDER.findIndex(s => s.id === 'freeShipping'), SETTINGS_ORDER.length);
    if (freeShipping) score += getDynamicPercentage(BASE_PERCENTAGES.freeShipping, SETTINGS_ORDER.findIndex(s => s.id === 'freeShipping'), SETTINGS_ORDER.length);
    if (freeHomeDelivery) score += getDynamicPercentage(BASE_PERCENTAGES.freeHomeDelivery, SETTINGS_ORDER.findIndex(s => s.id === 'freeHomeDelivery'), SETTINGS_ORDER.length);
    if (freeLockerDelivery) score += getDynamicPercentage(BASE_PERCENTAGES.freeLockerDelivery, SETTINGS_ORDER.findIndex(s => s.id === 'freeLockerDelivery'), SETTINGS_ORDER.length);
    if (showEuReturnButton) score -= getDynamicPercentage(BASE_PERCENTAGES.euReturnButton, SETTINGS_ORDER.findIndex(s => s.id === 'euReturnButton'), SETTINGS_ORDER.length);
    if (addGiftWrapping) score += getDynamicPercentage(BASE_PERCENTAGES.giftWrapping, SETTINGS_ORDER.findIndex(s => s.id === 'giftWrapping'), SETTINGS_ORDER.length);
    if (addInsurance) score += getDynamicPercentage(BASE_PERCENTAGES.insurance, SETTINGS_ORDER.findIndex(s => s.id === 'insurance'), SETTINGS_ORDER.length);
    if (addGiftMessage) score += getDynamicPercentage(BASE_PERCENTAGES.giftMessage, SETTINGS_ORDER.findIndex(s => s.id === 'giftMessage'), SETTINGS_ORDER.length);
    if (preselectShipping) score += getDynamicPercentage(BASE_PERCENTAGES.preselectShipping, SETTINGS_ORDER.findIndex(s => s.id === 'preselectShipping'), SETTINGS_ORDER.length);

    if (ctaColor === 'green') score += 3;
    else if (ctaColor === 'orange' || ctaColor === 'red') score += (orderValue < 500) ? 2 : -2;
    else if (ctaColor === 'low-contrast') score -= 8;
    if (ctaText === 'pay') score -= 2;
    else if (ctaText === 'confirm') score += 1;

    if (showLowStockWarning) score += 8;
    if (showCartTimer) { score += 5; score -= 2; }
    if (showSocialProof) score += 3;
    if (showProductDiscount) score += Math.round(discountRate * 0.4);
    if (selectedDeliveryOptions.length >= 3) score += 5;
    else if (selectedDeliveryOptions.length >= 2) score += 2;

    const marketKey = customerCountry.toLowerCase() as keyof typeof CARD_PROVIDERS[0]['conversionImpact'];
    selectedCarriers.forEach((carrierId) => {
      const carrier = CARRIERS.find(c => c.id === carrierId);
      if (carrier && marketKey in carrier.marketImpact) score += carrier.marketImpact[marketKey];
    });
    paymentOrder.forEach((methodId) => {
      const method = PAYMENT_METHODS.find(m => m.id === methodId);
      if (method && marketKey in method.conversionImpact) score += method.conversionImpact[marketKey];
    });
    selectedCardProviders.forEach((providerId) => {
      const provider = CARD_PROVIDERS.find(c => c.id === providerId);
      if (provider && marketKey in provider.conversionImpact) score += provider.conversionImpact[marketKey];
    });

    const shippingRatio = shippingCost / totalOrderValue;
    if (shippingRatio > 0.2) score -= 15;
    else if (shippingRatio > 0.1) score -= 5;
    else if (shippingRatio < 0.05) score += 5;

    if (layoutOrder.indexOf('payment') < layoutOrder.indexOf('shipping')) score -= 8;
    if (layoutOrder.indexOf('customer') !== 0) score -= 3;

    const player = players.find(p => p.slug === selectedPlayer);
    if (player) score += player.marketImpact[marketKey as keyof typeof player.marketImpact];
    if (customerCountry === 'SE' && player?.countries.includes('SE')) score += 8;
    else if (!player?.countries.includes(customerCountry)) score -= 10;

    selectedDeliveryOptions.forEach((optId) => {
      const text = shippingTexts[optId] || '';
      if (/\d{1,2}:\d{2}-\d{1,2}:\d{2}/.test(text)) score += 12;
      else if (/(\d-\d\s*dag(ar)?|snart|inom kort)/i.test(text)) score -= 7;
    });

    return Math.min(Math.max(score, 0), 100);
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
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 mb-2">
            <Settings size={20} />
            <span className="text-sm font-semibold uppercase tracking-wide">Interactive Lab</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">Checkout Lab</h1>
          <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">Experimentera med din kassa och se hur konverteringen påverkas i realtid.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Live Preview</h2>
              <div className="flex gap-2">
                {(['checkout', 'orderConfirmation', 'return', 'export'] as const).map(view => (
                  <button
                    key={view}
                    onClick={() => setActiveView(view)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${activeView === view ? 'bg-brand-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'}`}
                  >
                    {view.charAt(0).toUpperCase() + view.slice(1).replace('orderConfirmation', 'Orderbekräftelse')}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
              {activeView === 'checkout' && (
                <>
                  {!hideHeaderFooter && (
                    <div className="bg-slate-900 dark:bg-slate-950 px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="text-white font-semibold">Checkout</div>
                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                          <div className="w-8 h-8 rounded-full bg-slate-700" />
                          <div className="w-24 h-2 rounded bg-slate-700" />
                        </div>
                      </div>
                    </div>
                  )}

                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="checkout-sections" type="SECTION">
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="p-6 space-y-4">
                          {layoutOrder.map((sectionId, index) => {
                            const section = SECTIONS.find(s => s.id === sectionId);
                            if (!section) return null;
                            return (
                              <Draggable key={section.id} draggableId={section.id} index={index}>
                                {(provided) => (
                                  <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 border-2 border-slate-200 dark:border-slate-600 hover:border-brand-500 dark:hover:border-brand-400 transition-colors cursor-move group relative">
                                    <div className="flex items-start gap-3">
                                      <div className="text-slate-400 mt-1"><Settings size={16} /></div>
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className="font-semibold text-slate-900 dark:text-slate-100">{section.title}</span>
                                          <HelpCircle size={14} className="text-slate-400 group-hover:text-brand-500 transition-colors" />
                                          <span className="text-xs text-slate-500 dark:text-slate-400">{section.description}</span>
                                        </div>
                                        <div className="space-y-2">
                                          {sectionId === 'customer' && (
                                            <div className="space-y-2">
                                              <select value={customerCountry} onChange={(e) => setCustomerCountry(e.target.value)} className="w-full h-8 bg-slate-200 dark:bg-slate-600 rounded px-2 text-sm text-slate-700 dark:text-slate-300 border-0">
                                                <option value="SE">Sverige</option>
                                                <option value="NO">Norge</option>
                                                <option value="DK">Danmark</option>
                                                <option value="FI">Finland</option>
                                              </select>
                                              <div className="h-8 bg-slate-200 dark:bg-slate-600 rounded" />
                                              <div className="h-8 bg-slate-200 dark:bg-slate-600 rounded" />
                                            </div>
                                          )}
                                          {sectionId === 'guest' && (
                                            <>
                                              <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                                <CheckCircle2 size={16} className="text-green-600 dark:text-green-400" />
                                                <span className="text-sm text-green-800 dark:text-green-300">{isGuestCheckout ? guestLoginText : 'Skapa konto för att handla'}</span>
                                              </div>
                                              {isGuestCheckout ? (
                                                <>
                                                  <div className="space-y-2 mt-3">
                                                    <div className="h-8 bg-slate-200 dark:bg-slate-600 rounded px-2 flex items-center"><span className="text-xs text-slate-500 dark:text-slate-400">E-post</span></div>
                                                    <div className="h-8 bg-slate-200 dark:bg-slate-600 rounded px-2 flex items-center"><span className="text-xs text-slate-500 dark:text-slate-400">Lösenord</span></div>
                                                  </div>
                                                  <div className="flex items-center gap-2 mt-2">
                                                    <div className="w-4 h-4 rounded border-2 border-slate-400" />
                                                    <span className="text-xs text-slate-600 dark:text-slate-400">Spara mina uppgifter för nästa köp</span>
                                                  </div>
                                                  {showNextPurchaseDiscount && (
                                                    <div className="mt-2 p-2 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded">
                                                      <div className="text-xs font-semibold text-green-800 dark:text-green-200">Rabatt på nästa köp (Aktiv)</div>
                                                      <div className="text-xs text-green-700 dark:text-green-300">10% rabatt för att öka kontoskapande</div>
                                                    </div>
                                                  )}
                                                </>
                                              ) : (
                                                <div className="flex items-center gap-2 mt-2">
                                                  <div className="w-4 h-4 rounded border-2 border-slate-400" />
                                                  <span className="text-xs text-slate-600 dark:text-slate-400">Jag har redan ett konto</span>
                                                </div>
                                              )}
                                            </>
                                          )}
                                          {sectionId === 'coupon' && (
                                            <div className="flex gap-2">
                                              <div className="flex-1 h-8 bg-slate-200 dark:bg-slate-600 rounded" />
                                              <div className="h-8 px-4 bg-brand-600 rounded text-white text-sm flex items-center">Använd</div>
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
                                                          {(provided) => (
                                                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-600 rounded border border-slate-200 dark:border-slate-500">
                                                              <div className="w-4 h-4 flex items-center justify-center"><GripVertical size={12} className="text-slate-400" /></div>
                                                              <div className="flex-1">
                                                                <div className="text-sm font-medium text-slate-700 dark:text-slate-300">{opt.name}</div>
                                                                <div className="text-xs text-slate-500 dark:text-slate-400">{cost} kr</div>
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
                                            </>
                                          )}
                                          {sectionId === 'crossSell' && hasCrossSell && (
                                            <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                              <div className="w-16 h-16 bg-slate-300 dark:bg-slate-500 rounded flex-shrink-0 flex items-center justify-center"><Package size={24} className="text-slate-400 dark:text-slate-400" /></div>
                                              <div className="flex-1">
                                                <div className="font-medium text-slate-700 dark:text-slate-300 text-sm">{crossSellProductName}</div>
                                                <div className="text-sm text-slate-600 dark:text-slate-400">
                                                  <span className="line-through text-xs">{crossSellProductPrice} kr</span>
                                                  <span className="ml-2 font-semibold">{Math.round(crossSellProductPrice * (1 - crossSellDiscount / 100))} kr</span>
                                                  <span className="ml-2 text-xs text-green-600 dark:text-green-400">-{crossSellDiscount}%</span>
                                                </div>
                                              </div>
                                            </div>
                                          )}
                                          {sectionId === 'payment' && (
                                            <Droppable droppableId="payment-methods" type="PAYMENT_METHOD">
                                              {(provided) => (
                                                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                                                  {paymentOrder.map((methodId, idx) => {
                                                    const method = PAYMENT_METHODS.find(m => m.id === methodId);
                                                    if (!method) return null;
                                                    return (
                                                      <Draggable key={method.id} draggableId={method.id} index={idx}>
                                                        {(provided) => (
                                                          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="h-8 bg-slate-200 dark:bg-slate-600 rounded flex items-center px-3 cursor-move">
                                                            <div className="w-4 h-4 rounded-full border-2 border-slate-400 mr-2" />
                                                            <span className="text-sm text-slate-600 dark:text-slate-300">{method.name}</span>
                                                          </div>
                                                        )}
                                                      </Draggable>
                                                    );
                                                  })}
                                                  {provided.placeholder}
                                                </div>
                                              )}
                                            </Droppable>
                                          )}
                                          {sectionId === 'euReturn' && (
                                            <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                              <RefreshCw size={20} className="text-blue-600 dark:text-blue-400" />
                                              <div className="flex-1">
                                                <div className="font-semibold text-blue-900 dark:text-blue-100">Ångra köp</div>
                                                <div className="text-sm text-blue-700 dark:text-blue-300">Du har rätt att ångra detta köp inom 14 dagar</div>
                                              </div>
                                            </div>
                                          )}
                                          {sectionId === 'review' && (
                                            <div className="flex items-start gap-3 p-3 bg-slate-100 dark:bg-slate-600 rounded">
                                              <div className="w-16 h-16 bg-slate-300 dark:bg-slate-500 rounded flex-shrink-0 flex items-center justify-center"><Package size={24} className="text-slate-400 dark:text-slate-400" /></div>
                                              <div className="flex-1">
                                                <div className="font-medium text-slate-700 dark:text-slate-300 text-sm">{productName}</div>
                                                <div className="text-sm text-slate-600 dark:text-slate-400">{productPrice} kr</div>
                                              </div>
                                            </div>
                                          )}
                                          {sectionId === 'lowStock' && showLowStockWarning && (
                                            <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                              <AlertTriangle size={20} className="text-red-600 dark:text-red-400 flex-shrink-0" />
                                              <div className="flex-1">
                                                <div className="font-semibold text-red-900 dark:text-red-100">Endast 2 kvar i lager!</div>
                                              </div>
                                            </div>
                                          )}
                                          {sectionId === 'cartTimer' && showCartTimer && (
                                            <div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                                              <Clock size={20} className="text-amber-600 dark:text-amber-400 flex-shrink-0" />
                                              <div className="flex-1">
                                                <div className="font-semibold text-amber-900 dark:text-amber-100">Varukorgen reserverad i 10:00</div>
                                              </div>
                                            </div>
                                          )}
                                          {sectionId === 'socialProof' && showSocialProof && (
                                            <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                              <Users size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                              <div className="flex-1">
                                                <div className="font-semibold text-blue-900 dark:text-blue-100">3 personer tittar på denna just nu</div>
                                              </div>
                                            </div>
                                          )}
                                          {sectionId === 'giftWrapping' && addGiftWrapping && (
                                            <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                                              <Package size={20} className="text-purple-600 dark:text-purple-400 flex-shrink-0" />
                                              <div className="flex-1"><div className="font-semibold text-purple-900 dark:text-purple-100">Presentinslagning (+49 kr)</div></div>
                                            </div>
                                          )}
                                          {sectionId === 'insurance' && addInsurance && (
                                            <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                                              <Shield size={20} className="text-green-600 dark:text-green-400 flex-shrink-0" />
                                              <div className="flex-1"><div className="font-semibold text-green-900 dark:text-green-100">Försäkring (+19 kr)</div></div>
                                            </div>
                                          )}
                                          {sectionId === 'giftMessage' && addGiftMessage && (
                                            <div className="flex items-center gap-3 p-3 bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800 rounded-lg">
                                              <DollarSign size={20} className="text-pink-600 dark:text-pink-400 flex-shrink-0" />
                                              <div className="flex-1"><div className="font-semibold text-pink-900 dark:text-pink-100">Presentkort</div></div>
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

                  <div className="p-6 border-t border-slate-200 dark:border-slate-700">
                    <button
                      onClick={() => setActiveView('orderConfirmation')}
                      className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all ${ctaColor === 'green' ? 'bg-green-600 hover:bg-green-700 text-white' : ctaColor === 'orange' ? 'bg-orange-500 hover:bg-orange-600 text-white' : ctaColor === 'red' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-slate-300 hover:bg-slate-400 text-slate-700'}`}
                    >
                      {ctaText === 'complete' && 'Slutför köp'}
                      {ctaText === 'pay' && 'Betala'}
                      {ctaText === 'confirm' && 'Bekräfta order'}
                    </button>
                  </div>
                </>
              )}

              {activeView === 'orderConfirmation' && (
                <div className="p-6">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mx-auto mb-4 flex items-center justify-center"><CheckCircle2 size={32} className="text-green-600 dark:text-green-400" /></div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Tack för din order!</h2>
                    <p className="text-slate-600 dark:text-slate-400">Din order har mottagits</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{calculateCLV()} kr</div>
                      <div className="text-xs text-blue-700 dark:text-blue-300">CLV</div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">{calculateReturningCustomer()}%</div>
                      <div className="text-xs text-green-700 dark:text-green-300">Återkommande</div>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{calculateSupportTickets()}</div>
                      <div className="text-xs text-purple-700 dark:text-purple-300">Support/100</div>
                    </div>
                  </div>
                </div>
              )}

              {activeView === 'return' && (
                <div className="p-6">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mx-auto mb-4 flex items-center justify-center"><RefreshCw size={32} className="text-blue-600 dark:text-blue-400" /></div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Returhantering</h2>
                  </div>
                  <select value={returnReason} onChange={(e) => setReturnReason(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg dark:border-slate-600 dark:bg-slate-700 text-sm mb-4">
                    <option value="">Välj en orsak</option>
                    <option value="wrong-size">Fel storlek</option>
                    <option value="changed-mind">Ångrat mig</option>
                  </select>
                  <div className="text-center"><QrCodeIcon size={64} className="text-slate-400 mx-auto" /></div>
                </div>
              )}

              {activeView === 'export' && (
                <div className="p-6">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900/30 rounded-full mx-auto mb-4 flex items-center justify-center"><Download size={32} className="text-brand-600 dark:text-brand-400" /></div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Ladda ned</h2>
                  </div>
                  <input type="text" value={exportName} onChange={(e) => setExportName(e.target.value)} placeholder="Namn" className="w-full p-2 border border-slate-300 rounded-lg dark:border-slate-600 dark:bg-slate-700 text-sm mb-2" />
                  <input type="email" value={exportEmail} onChange={(e) => setExportEmail(e.target.value)} placeholder="E-post" className="w-full p-2 border border-slate-300 rounded-lg dark:border-slate-600 dark:bg-slate-700 text-sm mb-2" />
                  <input type="text" value={exportCompany} onChange={(e) => setExportCompany(e.target.value)} placeholder="Företag" className="w-full p-2 border border-slate-300 rounded-lg dark:border-slate-600 dark:bg-slate-700 text-sm mb-2" />
                  <button disabled={!exportName || !exportEmail} className="w-full py-3 px-4 rounded-lg font-medium bg-brand-600 text-white">Ladda ned PDF</button>
                  <div className="mt-4 text-xs text-slate-600 dark:text-slate-400">
                    <div>Konvertering: {conversionScore}%</div>
                    <div>AOV: {calculateAOV()} kr</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Settings Panel */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">Inställningar</h2>
              <div className="flex gap-2 mb-4 border-b border-slate-200 dark:border-slate-700">
                {(['settings', 'shipping', 'product', 'provider'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition ${activeTab === tab ? 'text-brand-600 border-b-2 border-brand-600 bg-brand-50 dark:bg-brand-950' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'}`}
                  >
                    {tab === 'settings' ? 'Inställningar' : tab === 'shipping' ? 'Frakt' : tab === 'product' ? 'Produkt' : 'Provider'}
                  </button>
                ))}
              </div>

              <div className="p-4 max-h-[700px] overflow-y-auto">
                {activeTab === 'settings' && (
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={!hideHeaderFooter} onChange={(e) => setHideHeaderFooter(!e.target.checked)} className="w-4 h-4" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">Visa header/footer</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={isGuestCheckout} onChange={(e) => setIsGuestCheckout(e.target.checked)} className="w-4 h-4" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">Gästutcheckning</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={showEuReturnButton} onChange={(e) => setShowEuReturnButton(e.target.checked)} className="w-4 h-4" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">EU-Ångerknapp</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={showCartTimer} onChange={(e) => setShowCartTimer(e.target.checked)} className="w-4 h-4" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">Varukorgstimer</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={showLowStockWarning} onChange={(e) => setShowLowStockWarning(e.target.checked)} className="w-4 h-4" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">Lågt lager</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={showSocialProof} onChange={(e) => setShowSocialProof(e.target.checked)} className="w-4 h-4" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">Social proof</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={hasCrossSell} onChange={(e) => setHasCrossSell(e.target.checked)} className="w-4 h-4" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">Cross-sell</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={hasUpsell} onChange={(e) => setHasUpsell(e.target.checked)} className="w-4 h-4" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">Upsell</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={addGiftWrapping} onChange={(e) => setAddGiftWrapping(e.target.checked)} className="w-4 h-4" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">Presentinslagning</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={addInsurance} onChange={(e) => setAddInsurance(e.target.checked)} className="w-4 h-4" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">Försäkring</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={addGiftMessage} onChange={(e) => setAddGiftMessage(e.target.checked)} className="w-4 h-4" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">Presentkort</span>
                    </label>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">CTA-färg</label>
                      <select value={ctaColor} onChange={(e) => setCtaColor(e.target.value as any)} className="w-full p-2 border border-slate-300 rounded-lg dark:border-slate-600 dark:bg-slate-700 text-sm">
                        <option value="green">Grön</option>
                        <option value="orange">Orange</option>
                        <option value="red">Röd</option>
                        <option value="low-contrast">Låg kontrast</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">CTA-text</label>
                      <select value={ctaText} onChange={(e) => setCtaText(e.target.value as any)} className="w-full p-2 border border-slate-300 rounded-lg dark:border-slate-600 dark:bg-slate-700 text-sm">
                        <option value="complete">Slutför köp</option>
                        <option value="pay">Betala</option>
                        <option value="confirm">Bekräfta order</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeTab === 'shipping' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Fri frakt-gräns (kr)</label>
                      <input type="number" value={freeShippingThreshold} onChange={(e) => setFreeShippingThreshold(Number(e.target.value))} className="w-full p-2 border border-slate-300 rounded-lg dark:border-slate-600 dark:bg-slate-700 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Fraktalternativ</label>
                      {DELIVERY_OPTIONS.map((opt) => (
                        <label key={opt.id} className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={selectedDeliveryOptions.includes(opt.id)} onChange={(e) => {
                            if (e.target.checked) setSelectedDeliveryOptions([...selectedDeliveryOptions, opt.id]);
                            else setSelectedDeliveryOptions(selectedDeliveryOptions.filter(id => id !== opt.id));
                          }} className="w-4 h-4" />
                          <span className="text-sm text-slate-700 dark:text-slate-300">{opt.name} ({opt.cost} kr)</span>
                        </label>
                      ))}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Transportörer</label>
                      {CARRIERS.map((carrier) => (
                        <label key={carrier.id} className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={selectedCarriers.includes(carrier.id)} onChange={(e) => {
                            if (e.target.checked) setSelectedCarriers([...selectedCarriers, carrier.id]);
                            else setSelectedCarriers(selectedCarriers.filter(id => id !== carrier.id));
                          }} className="w-4 h-4" />
                          <span className="text-sm text-slate-700 dark:text-slate-300">{carrier.name} (★{carrier.trustScore})</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'product' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Produktnamn</label>
                      <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg dark:border-slate-600 dark:bg-slate-700 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Pris (kr)</label>
                      <input type="number" value={productPrice} onChange={(e) => { setProductPrice(Number(e.target.value)); setOrderValue(Number(e.target.value)); }} className="w-full p-2 border border-slate-300 rounded-lg dark:border-slate-600 dark:bg-slate-700 text-sm" />
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={showProductDiscount} onChange={(e) => setShowProductDiscount(e.target.checked)} className="w-4 h-4" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">Visa produktrabatt</span>
                    </label>
                    {showProductDiscount && (
                      <>
                        <input type="text" value={discountText} onChange={(e) => setDiscountText(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg dark:border-slate-600 dark:bg-slate-700 text-sm" />
                        <input type="number" value={discountRate} onChange={(e) => setDiscountRate(Number(e.target.value))} className="w-full p-2 border border-slate-300 rounded-lg dark:border-slate-600 dark:bg-slate-700 text-sm" />
                      </>
                    )}
                  </div>
                )}

                {activeTab === 'provider' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Provider</label>
                      <select value={selectedPlayer} onChange={(e) => handleProviderChange(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg dark:border-slate-600 dark:bg-slate-700 text-sm">
                        {players.map((player) => (
                          <option key={player.slug} value={player.slug}>{player.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Betalmetoder</label>
                      {PAYMENT_METHODS.map((method) => (
                        <label key={method.id} className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={selectedPaymentMethods.includes(method.id)} onChange={(e) => {
                            if (e.target.checked) setSelectedPaymentMethods([...selectedPaymentMethods, method.id]);
                            else setSelectedPaymentMethods(selectedPaymentMethods.filter(id => id !== method.id));
                          }} className="w-4 h-4" />
                          <span className="text-sm text-slate-700 dark:text-slate-300">{method.name}</span>
                        </label>
                      ))}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Kortutgivare</label>
                      {CARD_PROVIDERS.map((provider) => (
                        <label key={provider.id} className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={selectedCardProviders.includes(provider.id)} onChange={(e) => {
                            if (e.target.checked) setSelectedCardProviders([...selectedCardProviders, provider.id]);
                            else setSelectedCardProviders(selectedCardProviders.filter(id => id !== provider.id));
                          }} className="w-4 h-4" />
                          <span className="text-sm text-slate-700 dark:text-slate-300">{provider.name}</span>
                        </label>
                      ))}
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
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="font-medium text-slate-900 dark:text-slate-100">{label}</div>
        <div className="text-sm text-slate-600 dark:text-slate-400">{description}</div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-brand-600' : 'bg-slate-200 dark:bg-slate-600'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}
