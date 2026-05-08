'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { 
  ArrowUp, 
  ArrowDown, 
  Gauge, 
  CheckCircle2, 
  XCircle, 
  Info, 
  CreditCard, 
  Truck, 
  User, 
  Package,
  TrendingUp,
  Settings,
  ShoppingCart,
  Home,
  MapPin,
  Zap,
  DollarSign,
  RefreshCw,
  Globe,
  HelpCircle,
  AlertTriangle,
  Clock,
  Users,
  Shield,
  QrCode as QRCodeIcon
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
  conversionImpact: {
    se: number;
    no: number;
    dk: number;
    fi: number;
  };
};

const CARD_PROVIDERS: CardProvider[] = [
  { 
    id: 'visa', 
    name: 'Visa', 
    logo: '/logos/visa.svg',
    conversionImpact: { se: 3, no: 3, dk: 3, fi: 3 }
  },
  { 
    id: 'mastercard', 
    name: 'Mastercard', 
    logo: '/logos/mastercard.svg',
    conversionImpact: { se: 3, no: 3, dk: 3, fi: 3 }
  },
  { 
    id: 'amex', 
    name: 'American Express', 
    logo: '/logos/amex.svg',
    conversionImpact: { se: 1, no: 1, dk: 1, fi: 1 }
  },
];

type PaymentMethod = {
  id: string;
  name: string;
  icon: React.ReactNode;
  logo?: string;
  conversionImpact: {
    se: number;
    no: number;
    dk: number;
    fi: number;
  };
};

type Carrier = {
  id: string;
  name: string;
  logo: string;
  trustScore: number;
  marketImpact: {
    se: number;
    no: number;
    dk: number;
    fi: number;
  };
  shippingCosts: {
    pickup: number;
    locker: number;
    point: number;
    home: number;
    mailbox: number;
    express: number;
  };
};

const PAYMENT_METHODS: PaymentMethod[] = [
  { 
    id: 'klarna', 
    name: 'Klarna', 
    icon: <CreditCard size={18} />,
    logo: '/logos/klarna.png',
    conversionImpact: { se: 5, no: 5, dk: 4, fi: 4 }
  },
  { 
    id: 'card', 
    name: 'Kort', 
    icon: <CreditCard size={18} />,
    logo: undefined,
    conversionImpact: { se: 5, no: 5, dk: 5, fi: 5 }
  },
  { 
    id: 'swish', 
    name: 'Swish', 
    icon: <CreditCard size={18} />,
    logo: '/logos/swish.svg',
    conversionImpact: { se: 8, no: 0, dk: 0, fi: 0 }
  },
  { 
    id: 'vipps', 
    name: 'Vipps', 
    icon: <CreditCard size={18} />,
    logo: '/logos/vipps.svg',
    conversionImpact: { se: 0, no: 8, dk: 0, fi: 0 }
  },
  { 
    id: 'paypal', 
    name: 'PayPal', 
    icon: <CreditCard size={18} />,
    logo: '/logos/paypal.svg',
    conversionImpact: { se: 3, no: 3, dk: 3, fi: 3 }
  },
];

const CARRIERS: Carrier[] = [
  { 
    id: 'postnord', 
    name: 'PostNord', 
    logo: '/logos/postnord.svg',
    trustScore: 4.2,
    marketImpact: { se: 3, no: 2, dk: 3, fi: 3 },
    shippingCosts: { pickup: 0, locker: 39, point: 29, home: 79, mailbox: 19, express: 149 }
  },
  { 
    id: 'dhl', 
    name: 'DHL', 
    logo: '/logos/dhl.svg',
    trustScore: 1.4,
    marketImpact: { se: -8, no: -5, dk: -6, fi: -7 },
    shippingCosts: { pickup: 0, locker: 49, point: 39, home: 89, mailbox: 29, express: 169 }
  },
  { 
    id: 'bring', 
    name: 'Bring', 
    logo: '/logos/bring.svg',
    trustScore: 4.0,
    marketImpact: { se: 2, no: 5, dk: 4, fi: 3 },
    shippingCosts: { pickup: 0, locker: 45, point: 35, home: 85, mailbox: 25, express: 159 }
  },
  { 
    id: 'citymail', 
    name: 'CityMail', 
    logo: '/logos/citymail.svg',
    trustScore: 4.5,
    marketImpact: { se: 4, no: 2, dk: 3, fi: 2 },
    shippingCosts: { pickup: 0, locker: 35, point: 25, home: 75, mailbox: 15, express: 139 }
  },
  { 
    id: 'airmee', 
    name: 'Airmee', 
    logo: '/logos/airmee.svg',
    trustScore: 4.1,
    marketImpact: { se: 3, no: 2, dk: 2, fi: 2 },
    shippingCosts: { pickup: 0, locker: 0, point: 0, home: 49, mailbox: 0, express: 99 }
  },
  { 
    id: 'earlybird', 
    name: 'Earlybird', 
    logo: '/logos/earlybird.svg',
    trustScore: 3.8,
    marketImpact: { se: 2, no: 2, dk: 2, fi: 2 },
    shippingCosts: { pickup: 0, locker: 0, point: 0, home: 59, mailbox: 0, express: 119 }
  },
  { 
    id: 'budbee', 
    name: 'Budbee', 
    logo: '/logos/budbee.svg',
    trustScore: 4.6,
    marketImpact: { se: 4, no: 3, dk: 3, fi: 3 },
    shippingCosts: { pickup: 0, locker: 29, point: 0, home: 69, mailbox: 0, express: 129 }
  },
  { 
    id: 'instabox', 
    name: 'Instabox', 
    logo: '/logos/instabox.svg',
    trustScore: 4.4,
    marketImpact: { se: 4, no: 3, dk: 3, fi: 3 },
    shippingCosts: { pickup: 0, locker: 29, point: 0, home: 69, mailbox: 0, express: 129 }
  },
  { 
    id: 'helthjem', 
    name: 'Helthjem', 
    logo: '/logos/helthjem.svg',
    trustScore: 4.3,
    marketImpact: { se: 2, no: 6, dk: 3, fi: 2 },
    shippingCosts: { pickup: 0, locker: 0, point: 0, home: 79, mailbox: 0, express: 149 }
  },
];

// Mapping of delivery options to carriers that support them
const DELIVERY_OPTION_CARRIERS: Record<string, string[]> = {
  pickup: ['postnord', 'dhl', 'bring', 'citymail'],
  locker: ['postnord', 'dhl', 'bring', 'citymail', 'budbee', 'instabox'],
  point: ['postnord', 'dhl', 'bring', 'citymail'],
  home: ['postnord', 'dhl', 'bring', 'citymail', 'airmee', 'earlybird', 'budbee', 'instabox', 'helthjem'],
  mailbox: ['postnord', 'dhl', 'bring', 'citymail'],
  express: ['postnord', 'dhl', 'bring', 'citymail', 'airmee', 'earlybird', 'budbee', 'instabox', 'helthjem'],
};

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

  // Guest login text options
  const GUEST_LOGIN_TEXTS = [
    'Välkommen in i värmen!',
    'Följ din order.',
    'Tjäna poäng som medlem.',
    'Enklare hantering av returer.',
  ];
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
  const [freeShipping, setFreeShipping] = useState(false);
  const [freeHomeDelivery, setFreeHomeDelivery] = useState(false);
  const [freeLockerDelivery, setFreeLockerDelivery] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState('klarna');
  const [customerCountry, setCustomerCountry] = useState('SE');

  // Mapping of provider slugs to carrier IDs (for providers that are also carriers)
  const PROVIDER_TO_CARRIER: { [key: string]: string } = {
    'dhl': 'dhl',
    'bring': 'bring',
    'postnord': 'postnord',
    'budbee': 'budbee',
    'instabox': 'instabox',
    'airmee': 'airmee',
    'earlybird': 'earlybird',
    'citymail': 'citymail',
  };

  // Handle provider change - lock carrier if provider is also a carrier
  const handleProviderChange = (newPlayer: string) => {
    setSelectedPlayer(newPlayer);
    
    // If provider is also a carrier, lock carrier selection to that provider
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

  // Predefined products for easy selection
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
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [showLowStockWarning, setShowLowStockWarning] = useState(true);
  const [showCartTimer, setShowCartTimer] = useState(true);
  const [showSocialProof, setShowSocialProof] = useState(true);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnReason, setReturnReason] = useState('');
  const [showNextPurchaseDiscount, setShowNextPurchaseDiscount] = useState(false);

  // Automatically add/remove blocks from layoutOrder when toggles change
  useEffect(() => {
    setLayoutOrder(prev => {
      const newOrder = [...prev];
      if (showCartTimer && !newOrder.includes('cartTimer')) {
        newOrder.splice(3, 0, 'cartTimer'); // Add after coupon
      } else if (!showCartTimer) {
        const index = newOrder.indexOf('cartTimer');
        if (index > -1) newOrder.splice(index, 1);
      }
      return newOrder;
    });
  }, [showCartTimer]);

  useEffect(() => {
    setLayoutOrder(prev => {
      const newOrder = [...prev];
      if (showSocialProof && !newOrder.includes('socialProof')) {
        if (!newOrder.includes('socialProof')) {
          newOrder.push('socialProof');
        }
      } else if (!showSocialProof) {
        const index = newOrder.indexOf('socialProof');
        if (index > -1) newOrder.splice(index, 1);
      }
      return newOrder;
    });
  }, [showSocialProof]);

  useEffect(() => {
    setLayoutOrder(prev => {
      const newOrder = [...prev];
      if (addGiftWrapping && !newOrder.includes('giftWrapping')) {
        newOrder.push('giftWrapping');
      } else if (!addGiftWrapping) {
        const index = newOrder.indexOf('giftWrapping');
        if (index > -1) newOrder.splice(index, 1);
      }
      return newOrder;
    });
  }, [addGiftWrapping]);

  useEffect(() => {
    setLayoutOrder(prev => {
      const newOrder = [...prev];
      if (addInsurance && !newOrder.includes('insurance')) {
        newOrder.push('insurance');
      } else if (!addInsurance) {
        const index = newOrder.indexOf('insurance');
        if (index > -1) newOrder.splice(index, 1);
      }
      return newOrder;
    });
  }, [addInsurance]);

  useEffect(() => {
    setLayoutOrder(prev => {
      const newOrder = [...prev];
      if (addGiftMessage && !newOrder.includes('giftMessage')) {
        newOrder.push('giftMessage');
      } else if (!addGiftMessage) {
        const index = newOrder.indexOf('giftMessage');
        if (index > -1) newOrder.splice(index, 1);
      }
      return newOrder;
    });
  }, [addGiftMessage]);

  useEffect(() => {
    setLayoutOrder(prev => {
      const newOrder = [...prev];
      if (showEuReturnButton && !newOrder.includes('euReturn')) {
        const reviewIndex = newOrder.indexOf('review');
        if (reviewIndex > -1) {
          newOrder.splice(reviewIndex, 0, 'euReturn');
        } else {
          newOrder.push('euReturn');
        }
      } else if (!showEuReturnButton) {
        const index = newOrder.indexOf('euReturn');
        if (index > -1) newOrder.splice(index, 1);
      }
      return newOrder;
    });
  }, [showEuReturnButton]);

  useEffect(() => {
    setLayoutOrder(prev => {
      const newOrder = [...prev];
      if (hasUpsell && !newOrder.includes('crossSell')) {
        const shippingIndex = newOrder.indexOf('shipping');
        if (shippingIndex > -1) {
          newOrder.splice(shippingIndex + 1, 0, 'crossSell');
        } else {
          newOrder.push('crossSell');
        }
      } else if (!hasUpsell) {
        const index = newOrder.indexOf('crossSell');
        if (index > -1) newOrder.splice(index, 1);
      }
      return newOrder;
    });
  }, [hasUpsell]);

  // Base percentages for each toggle setting
  const BASE_PERCENTAGES = {
    guestCheckout: 15,
    autofill: 8,
    shippingDisplayedEarly: 5,
    hideHeaderFooter: 3, // Updated from 6 to 3 based on product data
    upsell: 4,
    crossSell: 0, // AOV only, not conversion
    freeShipping: 8,
    freeHomeDelivery: 5,
    freeLockerDelivery: 4,
    preselectShipping: 3,
    euReturnButton: 7, // Updated to 7 based on product data (-7% conversion impact)
    giftWrapping: 2,
    insurance: 1,
    giftMessage: 1,
    lowStockWarning: 8,
    cartTimer: 5,
    socialProof: 3,
  };

  // Calculate position-based multiplier based on toggle order in settings
  const getPositionMultiplier = (index: number, total: number): number => {
    // First 3 toggles (prime position): 100%
    if (index < 3) return 1.0;
    // Toggles 4-7: 95%
    if (index < 7) return 0.95;
    // Toggles 8-11: 90%
    if (index < 11) return 0.90;
    // Toggles 12+: 85%
    return 0.85;
  };

  // Get dynamic percentage based on position
  const getDynamicPercentage = (basePercentage: number, index: number, total: number): number => {
    const multiplier = getPositionMultiplier(index, total);
    return Math.round(basePercentage * multiplier);
  };

  // Settings toggle order for position calculation
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
    let score = 20; // Base score (lowered to give more room for toggle settings)

    // Calculate total order value including extras
    let totalOrderValue = orderValue;
    if (addGiftWrapping) totalOrderValue += Math.round(orderValue * 0.10);
    if (addInsurance) totalOrderValue += Math.round(orderValue * 0.05);
    if (addGiftMessage) totalOrderValue += Math.round(orderValue * 0.02);

    // Guest checkout impact (Baymard: forced account creation is top 3 reason for abandonment)
    if (!isGuestCheckout) {
      score -= 35;
    } else {
      const guestIndex = SETTINGS_ORDER.findIndex(s => s.id === 'guestCheckout');
      const dynamicGuest = getDynamicPercentage(BASE_PERCENTAGES.guestCheckout, guestIndex, SETTINGS_ORDER.length);
      score += dynamicGuest;
    }

    // Autofill impact (reduces friction, especially on mobile)
    if (hasAutofill) {
      const autofillIndex = SETTINGS_ORDER.findIndex(s => s.id === 'autofill');
      const dynamicAutofill = getDynamicPercentage(BASE_PERCENTAGES.autofill, autofillIndex, SETTINGS_ORDER.length);
      score += dynamicAutofill;
    }

    // Hidden shipping costs (biggest reason for cart abandonment)
    if (!shippingDisplayedEarly) {
      score -= 48;
    } else {
      const shippingIndex = SETTINGS_ORDER.findIndex(s => s.id === 'shippingDisplayedEarly');
      const dynamicShipping = getDynamicPercentage(BASE_PERCENTAGES.shippingDisplayedEarly, shippingIndex, SETTINGS_ORDER.length);
      score += dynamicShipping;
    }

    // No header/footer (reduces distractions)
    if (hideHeaderFooter) {
      const headerIndex = SETTINGS_ORDER.findIndex(s => s.id === 'hideHeaderFooter');
      const dynamicHeader = getDynamicPercentage(BASE_PERCENTAGES.hideHeaderFooter, headerIndex, SETTINGS_ORDER.length);
      score += dynamicHeader;
    }

    // Post-purchase upsell (increases AOV without hurting conversion)
    if (hasUpsell) {
      const upsellIndex = SETTINGS_ORDER.findIndex(s => s.id === 'upsell');
      const dynamicUpsell = getDynamicPercentage(BASE_PERCENTAGES.upsell, upsellIndex, SETTINGS_ORDER.length);
      score += dynamicUpsell;
    }

    // Free shipping threshold (increases AOV and conversion)
    if (freeShippingThreshold > 0) {
      const thresholdIndex = SETTINGS_ORDER.findIndex(s => s.id === 'freeShipping');
      const dynamicThreshold = getDynamicPercentage(BASE_PERCENTAGES.freeShipping, thresholdIndex, SETTINGS_ORDER.length);
      score += dynamicThreshold;
    }

    // Free shipping on all orders
    if (freeShipping) {
      const freeShippingIndex = SETTINGS_ORDER.findIndex(s => s.id === 'freeShipping');
      const dynamicFreeShipping = getDynamicPercentage(BASE_PERCENTAGES.freeShipping, freeShippingIndex, SETTINGS_ORDER.length);
      score += dynamicFreeShipping;
    }

    // Free home delivery
    if (freeHomeDelivery) {
      const homeIndex = SETTINGS_ORDER.findIndex(s => s.id === 'freeHomeDelivery');
      const dynamicHome = getDynamicPercentage(BASE_PERCENTAGES.freeHomeDelivery, homeIndex, SETTINGS_ORDER.length);
      score += dynamicHome;
    }

    // Free locker delivery
    if (freeLockerDelivery) {
      const lockerIndex = SETTINGS_ORDER.findIndex(s => s.id === 'freeLockerDelivery');
      const dynamicLocker = getDynamicPercentage(BASE_PERCENTAGES.freeLockerDelivery, lockerIndex, SETTINGS_ORDER.length);
      score += dynamicLocker;
    }

    // EU return button (mandatory from June 2026)
    // From customer perspective, having an easy return option can reduce purchase urgency
    if (showEuReturnButton) {
      const euIndex = SETTINGS_ORDER.findIndex(s => s.id === 'euReturnButton');
      const dynamicEu = getDynamicPercentage(BASE_PERCENTAGES.euReturnButton, euIndex, SETTINGS_ORDER.length);
      score -= dynamicEu; // Negative impact: reduces purchase urgency
    }
    
    // Extra services impact
    if (addGiftWrapping) {
      const wrappingIndex = SETTINGS_ORDER.findIndex(s => s.id === 'giftWrapping');
      const dynamicWrapping = getDynamicPercentage(BASE_PERCENTAGES.giftWrapping, wrappingIndex, SETTINGS_ORDER.length);
      score += dynamicWrapping;
    }
    if (addInsurance) {
      const insuranceIndex = SETTINGS_ORDER.findIndex(s => s.id === 'insurance');
      const dynamicInsurance = getDynamicPercentage(BASE_PERCENTAGES.insurance, insuranceIndex, SETTINGS_ORDER.length);
      score += dynamicInsurance;
    }
    if (addGiftMessage) {
      const messageIndex = SETTINGS_ORDER.findIndex(s => s.id === 'giftMessage');
      const dynamicMessage = getDynamicPercentage(BASE_PERCENTAGES.giftMessage, messageIndex, SETTINGS_ORDER.length);
      score += dynamicMessage;
    }

    // Pre-selected shipping option impact
    if (preselectShipping) {
      const preselectIndex = SETTINGS_ORDER.findIndex(s => s.id === 'preselectShipping');
      const dynamicPreselect = getDynamicPercentage(BASE_PERCENTAGES.preselectShipping, preselectIndex, SETTINGS_ORDER.length);
      score += dynamicPreselect;
    }

    // CTA button color psychology impact
    if (ctaColor === 'green') {
      score += 3; // Confirming/safe: +3% conversion
    } else if (ctaColor === 'orange' || ctaColor === 'red') {
      // Urgent/action: +2% for low order values, but -2% for high values
      if (orderValue < 500) {
        score += 2;
      } else {
        score -= 2;
      }
    } else if (ctaColor === 'low-contrast') {
      score -= 8; // Low contrast: -8% conversion
    }

    // CTA button text impact
    if (ctaText === 'pay') {
      score -= 2; // "Betala" focuses on loss of money: -2%
    } else if (ctaText === 'confirm') {
      score += 1; // "Bekräfta order" is softer: +1%
    }

    // FOMO features impact
    if (showLowStockWarning) {
      score += 8; // Low stock warning creates urgency: +8%
    }
    if (showCartTimer) {
      score += 5; // Cart timer creates urgency: +5%
      // Cart timer slightly reduces trust
      score -= 2; // -2% trust impact
    }
    if (showSocialProof) {
      score += 3; // Social proof leverages herd behavior: +3%
    }

    // Multiple delivery options (gives customers choice)
    if (selectedDeliveryOptions.length >= 3) {
      score += 5; // Reduced from 6 to prevent exceeding 100
    } else if (selectedDeliveryOptions.length >= 2) {
      score += 2; // Reduced from 3 to prevent exceeding 100
    }

    // Carrier trust impact based on market
    const marketKey = customerCountry.toLowerCase() as keyof typeof CARD_PROVIDERS[0]['conversionImpact'];
    selectedCarriers.forEach((carrierId) => {
      const carrier = CARRIERS.find(c => c.id === carrierId);
      if (carrier && marketKey in carrier.marketImpact) {
        const impact = carrier.marketImpact[marketKey];
        score += impact;
      }
    });

    // Payment method conversion impact based on market
    paymentOrder.forEach((methodId) => {
      const method = PAYMENT_METHODS.find(m => m.id === methodId);
      if (method && marketKey in method.conversionImpact) {
        const impact = method.conversionImpact[marketKey];
        score += impact;
      }
    });

    // Card provider conversion impact based on market
    selectedCardProviders.forEach((providerId) => {
      const provider = CARD_PROVIDERS.find(c => c.id === providerId);
      if (provider && marketKey in provider.conversionImpact) {
        const impact = provider.conversionImpact[marketKey];
        score += impact;
      }
    });

    // Shipping cost vs order value (high shipping cost relative to order value hurts conversion)
    const shippingRatio = shippingCost / totalOrderValue;
    if (shippingRatio > 0.2) {
      score -= 15; // Shipping cost is >20% of order value
    } else if (shippingRatio > 0.1) {
      score -= 5; // Shipping cost is 10-20% of order value
    } else if (shippingRatio < 0.05) {
      score += 5; // Low shipping cost helps
    }

    // Layout order impact (payment before shipping = bad UX)
    const paymentIndex = layoutOrder.indexOf('payment');
    const shippingIndex = layoutOrder.indexOf('shipping');
    if (paymentIndex < shippingIndex) {
      score -= 8; // Payment before shipping is confusing
    }

    // Field order impact (customer info first is standard and expected)
    const customerIndex = layoutOrder.indexOf('customer');
    if (customerIndex !== 0) {
      score -= 3; // Starting with customer info is best practice
    }

    // Player trust/conversion impact based on market
    const player = players.find(p => p.slug === selectedPlayer);
    if (player) {
      const marketKey = customerCountry.toLowerCase() as keyof typeof player.marketImpact;
      const impact = player.marketImpact[marketKey];
      score += impact;
    }

    // Country impact (Swedish customers have higher trust in local players)
    if (customerCountry === 'SE' && player?.countries.includes('SE')) {
      score += 8;
    } else if (!player?.countries.includes(customerCountry)) {
      score -= 10; // Player not available in customer's country
    }

    // Micro-copy impact for shipping text
    selectedDeliveryOptions.forEach((optId) => {
      const text = shippingTexts[optId] || '';
      // Specific time window (e.g., "10:00-11:30") increases conversion
      if (/\d{1,2}:\d{2}-\d{1,2}:\d{2}/.test(text)) {
        score += 12;
      }
      // Vague text (e.g., "1-3 days", "snart") decreases conversion
      else if (/(\d-\d\s*dag(ar)?|snart|inom kort)/i.test(text)) {
        score -= 7;
      }
    });

    return Math.min(Math.max(score, 0), 100);
  };

  // Helper functions for summary
  const countActiveFeatures = () => {
    let count = 0;
    if (isGuestCheckout) count++;
    if (hasAutofill) count++;
    if (shippingDisplayedEarly) count++;
    if (hideHeaderFooter) count++;
    if (hasUpsell) count++;
    if (freeShipping) count++;
    if (freeHomeDelivery) count++;
    if (freeLockerDelivery) count++;
    if (preselectShipping) count++;
    if (showEuReturnButton) count++;
    if (addGiftWrapping) count++;
    if (addInsurance) count++;
    if (addGiftMessage) count++;
    if (showLowStockWarning) count++;
    if (showCartTimer) count++;
    if (showSocialProof) count++;
    if (showNextPurchaseDiscount) count++;
    return count;
  };

  const calculateAOV = () => {
    let aov = productPrice;
    if (hasUpsell) aov += crossSellProductPrice * (1 - crossSellDiscount / 100);
    if (addGiftWrapping) aov *= 1.1;
    if (addInsurance) aov *= 1.05;
    if (addGiftMessage) aov *= 1.02;
    if (freeShippingThreshold > 0 && productPrice < freeShippingThreshold) {
      aov += (freeShippingThreshold - productPrice) * 0.3; // Customers add items to reach threshold
    }
    return Math.round(aov);
  };

  const calculateCLV = () => {
    const aov = calculateAOV();
    const baseCLV = aov * 3; // Average 3 purchases per customer
    let clv = baseCLV;
    
    if (isGuestCheckout) {
      clv *= 0.6; // Guest checkout reduces CLV by 40%
    }
    if (showNextPurchaseDiscount) {
      clv *= 1.15; // Discount increases CLV by 15%
    }
    if (showSocialProof) {
      clv *= 1.05; // Social proof increases CLV by 5%
    }
    
    return Math.round(clv);
  };

  const calculateReturningCustomer = () => {
    let percentage = 25; // Base 25% returning customers
    
    if (!isGuestCheckout) {
      percentage += 15; // Account creation increases returning customers
    }
    if (showNextPurchaseDiscount) {
      percentage += 10; // Discount increases returning customers
    }
    if (showSocialProof) {
      percentage += 5; // Social proof increases returning customers
    }
    
    return Math.min(percentage, 90);
  };

  const calculateSupportTickets = () => {
    let tickets = 5; // Base 5 tickets per 100 orders
    
    if (showEuReturnButton) {
      tickets += 8; // EU return button increases returns
    }
    if (isGuestCheckout) {
      tickets += 3; // Guest checkout increases support needs
    }
    if (preselectShipping) {
      tickets -= 2; // Preselect shipping reduces issues
    }
    
    return Math.max(tickets, 1);
  };

  const getSectionDescription = (sectionId: string) => {
    switch (sectionId) {
      case 'customer':
        return hasAutofill ? 'Autofill aktiverat: +12% konvertering' : 'Autofill inaktiverat: Kan öka konvertering med 12%';
      case 'guest':
        return isGuestCheckout ? 'Gästutcheckning: +15% konvertering, -40% CLV' : 'Tvingat konto: -35% konvertering, +50% CLV';
      case 'coupon':
        return freeShippingThreshold > 0 ? `Fri frakt-gräns: ${freeShippingThreshold} kr` : 'Ingen fri frakt-gräns';
      case 'shipping':
        const shippingImpact = freeShipping ? 'Fri frakt alltid' : freeHomeDelivery ? 'Fri hemleverans' : freeLockerDelivery ? 'Fri skåpsleverans' : 'Standard frakt';
        return `${shippingImpact}, ${selectedDeliveryOptions.length} alternativ valda`;
      case 'crossSell':
        return hasCrossSell ? `${crossSellProductName} (${crossSellDiscount}% rabatt): +10% AOV` : 'Korsförsäljning inaktiverad';
      case 'payment':
        const player = players.find(p => p.slug === selectedPlayer);
        return player ? player.name : 'Ingen provider vald';
      case 'review':
        return hasUpsell ? 'Post-purchase upsell: +15% AOV' : 'Ingen upsell';
      default:
        return '';
    }
  };

  const getConversionMetrics = () => {
    const metrics: { label: string; impact: number; source: string }[] = [];
    
    // Guest checkout impact (Baymard: forced account creation is top 3 reason for abandonment)
    if (!isGuestCheckout) {
      metrics.push({ label: 'Tvingat konto', impact: -35, source: 'Baymard Institute' });
    } else {
      metrics.push({ label: 'Gästutcheckning', impact: 8, source: 'Baymard Institute' });
    }

    // Autofill impact (reduces friction, especially on mobile)
    if (hasAutofill) {
      metrics.push({ label: 'Autofill', impact: 8, source: 'Nielsen Norman Group' });
    }

    // Hidden shipping costs (biggest reason for cart abandonment)
    if (!shippingDisplayedEarly) {
      metrics.push({ label: 'Dolda fraktkostnader', impact: -48, source: 'Baymard Institute' });
    } else {
      metrics.push({ label: 'Visad frakt tidigt', impact: 6, source: 'CRO best practices' });
    }

    // No header/footer (reduces distractions)
    if (hideHeaderFooter) {
      metrics.push({ label: 'Dölj header/footer', impact: 6, source: 'UX best practices' });
    }

    // Post-purchase upsell (increases AOV without hurting conversion)
    if (hasUpsell) {
      metrics.push({ label: 'Post-purchase upsell', impact: 4, source: 'E-commerce studies' });
    }

    // Free shipping threshold (increases AOV and conversion)
    if (freeShippingThreshold > 0) {
      metrics.push({ label: 'Fri frakt-nedräkning', impact: 6, source: 'E-commerce studies' });
    }

    // Free shipping on all orders
    if (freeShipping) {
      metrics.push({ label: 'Fri frakt alltid', impact: 8, source: 'E-commerce studies' });
    }

    // Free home delivery
    if (freeHomeDelivery) {
      metrics.push({ label: 'Fri hemleverans', impact: 5, source: 'Delivery experience studies' });
    }

    // EU return button (mandatory from June 2026)
    if (showEuReturnButton) {
      // Position-based impact
      const euReturnIndex = layoutOrder.indexOf('euReturn');
      const paymentIndex = layoutOrder.indexOf('payment');
      let euReturnImpact = 6; // Base impact
      let euReturnLabel = 'EU-ångerknapp';
      
      if (euReturnIndex !== -1) {
        // If placed before payment, higher impact
        if (euReturnIndex < paymentIndex) {
          euReturnImpact = 8;
          euReturnLabel = 'EU-ångerknapp (före betalning)';
        }
        // If placed in first half of layout, slight bonus
        if (euReturnIndex < layoutOrder.length / 2) {
          euReturnImpact += 2;
          euReturnLabel = 'EU-ångerknapp (tidig i layout)';
        }
      }
      metrics.push({ label: euReturnLabel, impact: euReturnImpact, source: 'EU Consumer Rights Directive 2026' });
    }

    if (addGiftWrapping) {
      metrics.push({ label: 'Presentinslagning', impact: 2, source: 'Gift experience studies' });
    }
    if (addInsurance) {
      metrics.push({ label: 'Leveransförsäkring', impact: 1, source: 'Shipping trust studies' });
    }
    if (addGiftMessage) {
      metrics.push({ label: 'Gåvomeddelande', impact: 1, source: 'Personalization studies' });
    }
    if (preselectShipping) {
      metrics.push({ label: 'Förvalt fraktalternativ', impact: 3, source: 'UX best practices' });
    }
    
    // Carrier trust impact based on market
    const marketKey = customerCountry.toLowerCase() as keyof typeof CARD_PROVIDERS[0]['conversionImpact'];
    selectedCarriers.forEach((carrierId) => {
      const carrier = CARRIERS.find(c => c.id === carrierId);
      if (carrier && marketKey in carrier.marketImpact) {
        const impact = carrier.marketImpact[marketKey];
        if (impact !== 0) {
          metrics.push({ label: `${carrier.name} (${customerCountry})`, impact, source: 'Carrier trust studies' });
        }
      }
    });
    
    // Payment method conversion impact based on market
    paymentOrder.forEach((methodId) => {
      const method = PAYMENT_METHODS.find(m => m.id === methodId);
      if (method && marketKey in method.conversionImpact) {
        const impact = method.conversionImpact[marketKey];
        if (impact !== 0) {
          metrics.push({ label: `${method.name} (${customerCountry})`, impact, source: 'Payment trust studies' });
        }
      }
    });
    
    if (selectedDeliveryOptions.length >= 3) {
      metrics.push({ label: 'Många leveransalternativ', impact: 5, source: 'Ingrid/nShift studies' });
    } else if (selectedDeliveryOptions.length >= 2) {
      metrics.push({ label: 'Flera leveransalternativ', impact: 2, source: 'Ingrid/nShift studies' });
    }

    const shippingRatio = shippingCost / orderValue;
    if (shippingRatio > 0.2) {
      metrics.push({ label: 'Hög fraktkostnad (>20%)', impact: -15, source: 'Baymard Institute' });
    } else if (shippingRatio > 0.1) {
      metrics.push({ label: 'Fraktkostnad 10-20%', impact: -5, source: 'Baymard Institute' });
    } else if (shippingRatio < 0.05) {
      metrics.push({ label: 'Låg fraktkostnad (<5%)', impact: 5, source: 'Baymard Institute' });
    }

    const paymentIndex = layoutOrder.indexOf('payment');
    const shippingIndex = layoutOrder.indexOf('shipping');
    if (paymentIndex < shippingIndex) {
      metrics.push({ label: 'Betaling innan leverans', impact: -8, source: 'UX best practices' });
    }

    const customerIndex = layoutOrder.indexOf('customer');
    if (customerIndex !== 0) {
      metrics.push({ label: 'Kundinfo ej först', impact: -3, source: 'UX best practices' });
    } else {
      metrics.push({ label: 'Kundinfo först', impact: 5, source: 'UX best practices' });
    }

    // Provider trust score based on market
    const player = players.find(p => p.slug === selectedPlayer);
    if (player) {
      const marketKey = customerCountry.toLowerCase() as keyof typeof player.marketImpact;
      const impact = player.marketImpact[marketKey];
      metrics.push({ label: `${player.name} trust score (${customerCountry})`, impact, source: 'CRO analysis' });
    }

    // Local provider impact
    if (customerCountry === 'SE' && selectedPlayer === 'klarna') {
      metrics.push({ label: 'Lokal provider (SE)', impact: 5, source: 'Trust studies' });
    }

    // Payment should be last for optimal conversion
    const lastBlock = layoutOrder[layoutOrder.length - 1];
    if (lastBlock === 'payment') {
      metrics.push({ label: 'Betalning sist', impact: 5, source: 'QuickSprout' });
    }

    // Guest checkout early in layout increases conversion
    const guestIndex = layoutOrder.indexOf('guest');
    if (guestIndex !== -1 && guestIndex < layoutOrder.length / 2) {
      metrics.push({ label: 'Gästutcheckning tidigt', impact: 5, source: 'UX best practices' });
    }

    // Order summary visible increases conversion
    const summaryIndex = layoutOrder.indexOf('summary');
    if (summaryIndex !== -1) {
      metrics.push({ label: 'Orderöversikt synlig', impact: 3, source: 'E-commerce studies' });
    }

    return metrics;
  };

  const getAOVMetrics = () => {
    const metrics = [];

    if (freeShippingThreshold > 0) {
      const aov = calculateAOV();
      const baseAov = orderValue;
      const increase = Math.round((aov / baseAov - 1) * 100);
      if (increase > 0) {
        metrics.push({ label: 'Fri frakt-gräns', impact: increase, source: 'Shopify/Baymard' });
      }
    }

    if (freeShipping) {
      metrics.push({ label: 'Fri frakt alltid', impact: 10, source: 'E-commerce studies' });
    }

    if (hasUpsell) {
      metrics.push({ label: 'Post-purchase upsell', impact: 15, source: 'E-commerce studies' });
    }

    // Discount code before payment increases AOV
    const discountIndex = layoutOrder.indexOf('discount');
    const paymentIndex = layoutOrder.indexOf('payment');
    if (discountIndex !== -1 && paymentIndex !== -1 && discountIndex < paymentIndex) {
      metrics.push({ label: 'Rabattkod före betalning', impact: 8, source: 'E-commerce studies' });
    }

    // Order summary visible can increase AOV (people see total and add items)
    const summaryIndex = layoutOrder.indexOf('summary');
    if (summaryIndex !== -1) {
      metrics.push({ label: 'Orderöversikt synlig', impact: 5, source: 'E-commerce studies' });
    }

    return metrics;
  };

  const getCLVMetrics = () => {
    const metrics = [];

    if (isGuestCheckout) {
      metrics.push({ label: 'Gästutcheckning', impact: -40, source: 'E-commerce studies' });
    }

    if (!isGuestCheckout) {
      metrics.push({ label: 'Konto-creation', impact: 50, source: 'E-commerce studies' });
    }

    if (selectedDeliveryOptions.length >= 3) {
      metrics.push({ label: 'Många leveransalternativ', impact: 20, source: 'Delivery experience studies' });
    } else if (selectedDeliveryOptions.length >= 2) {
      metrics.push({ label: 'Flera leveransalternativ', impact: 10, source: 'Delivery experience studies' });
    }

    // Customer info first establishes trust which increases CLV
    const customerIndex = layoutOrder.indexOf('customer');
    if (customerIndex === 0) {
      metrics.push({ label: 'Kundinfo först (CLV)', impact: 10, source: 'E-commerce studies' });
    }

    // Order summary visible increases CLV (people see value and return)
    const summaryIndex = layoutOrder.indexOf('summary');
    if (summaryIndex !== -1) {
      metrics.push({ label: 'Orderöversikt synlig (CLV)', impact: 8, source: 'E-commerce studies' });
    }

    // Shipping options early in layout increases satisfaction and CLV
    const shippingIndex = layoutOrder.indexOf('shipping');
    if (shippingIndex !== -1 && shippingIndex < layoutOrder.length / 2) {
      metrics.push({ label: 'Leveransval tidigt (CLV)', impact: 5, source: 'Delivery experience studies' });
    }

    return metrics;
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    // Handle main section reordering
    if (result.type === 'SECTION') {
      const items = Array.from(layoutOrder);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      setLayoutOrder(items);
    }

    // Handle shipping option reordering within shipping section
    if (result.type === 'SHIPPING_OPTION') {
      const items = Array.from(shippingOrder);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      setShippingOrder(items);
    }

    // Handle payment method reordering within payment section
    if (result.type === 'PAYMENT_METHOD') {
      const items = Array.from(paymentOrder);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      setPaymentOrder(items);
    }

    // Handle carrier reordering within shipping section
    if (result.type === 'CARRIER') {
      const items = Array.from(carrierOrder);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      setCarrierOrder(items);
    }
  };

  const conversionScore = calculateConversionScore();
  const metrics = getConversionMetrics();
  const aovMetrics = getAOVMetrics();
  const clvMetrics = getCLVMetrics();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 mb-2">
            <Settings size={20} />
            <span className="text-sm font-semibold uppercase tracking-wide">Interactive Lab</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
            Checkout Lab
          </h1>
          <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
            Experimentera med din kassa och se hur konverteringen påverkas i realtid.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Live Preview */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Live Preview</h2>
              <span className="text-xs text-slate-500 dark:text-slate-400">Drag & drop för att ändra ordning</span>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
              {!showOrderConfirmation ? (
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
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 border-2 border-slate-200 dark:border-slate-600 hover:border-brand-500 dark:hover:border-brand-400 transition-colors cursor-move group relative"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="text-slate-400 mt-1">
                                    <Settings size={16} />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-semibold text-slate-900 dark:text-slate-100">{section.title}</span>
                                      <HelpCircle size={14} className="text-slate-400 group-hover:text-brand-500 transition-colors" />
                                      <span className="text-xs text-slate-500 dark:text-slate-400">{section.description}</span>
                                    </div>
                                    <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs p-2 rounded-lg max-w-xs shadow-lg pointer-events-none">
                                      {getSectionDescription(sectionId)}
                                    </div>
                                    <div className="space-y-2">
                                      {sectionId === 'customer' && (
                                        <>
                                          <div className="space-y-2">
                                            <select
                                              value={customerCountry}
                                              onChange={(e) => setCustomerCountry(e.target.value)}
                                              className="w-full h-8 bg-slate-200 dark:bg-slate-600 rounded px-2 text-sm text-slate-700 dark:text-slate-300 border-0"
                                            >
                                              <option value="SE">Sverige</option>
                                              <option value="NO">Norge</option>
                                              <option value="DK">Danmark</option>
                                              <option value="FI">Finland</option>
                                            </select>
                                            <div className="h-8 bg-slate-200 dark:bg-slate-600 rounded" />
                                            <div className="h-8 bg-slate-200 dark:bg-slate-600 rounded" />
                                          </div>
                                        </>
                                      )}
                                      {sectionId === 'guest' && (
                                        <>
                                          <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                            <CheckCircle2 size={16} className="text-green-600 dark:text-green-400" />
                                            <span className="text-sm text-green-800 dark:text-green-300">
                                              {isGuestCheckout ? guestLoginText : 'Skapa konto för att handla'}
                                            </span>
                                          </div>
                                          {isGuestCheckout && (
                                            <>
                                              <div className="space-y-2 mt-3">
                                                <div className="h-8 bg-slate-200 dark:bg-slate-600 rounded px-2 flex items-center">
                                                  <span className="text-xs text-slate-500 dark:text-slate-400">E-post</span>
                                                </div>
                                                <div className="h-8 bg-slate-200 dark:bg-slate-600 rounded px-2 flex items-center">
                                                  <span className="text-xs text-slate-500 dark:text-slate-400">Lösenord</span>
                                                </div>
                                              </div>
                                              <div className="flex items-center gap-2 mt-2">
                                                <div className="w-4 h-4 rounded border-2 border-slate-400" />
                                                <span className="text-xs text-slate-600 dark:text-slate-400">Spara mina uppgifter för nästa köp</span>
                                              </div>
                                              {showNextPurchaseDiscount && (
                                                <div className="mt-2 p-2 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded">
                                                  <div className="text-xs font-semibold text-green-800 dark:text-green-200">
                                                    Rabatt på nästa köp (Aktiv)
                                                  </div>
                                                  <div className="text-xs text-green-700 dark:text-green-300">
                                                    10% rabatt för att öka kontoskapande
                                                  </div>
                                                </div>
                                              )}
                                            </>
                                          )}
                                          {!isGuestCheckout && (
                                            <div className="flex items-center gap-2 mt-2">
                                              <div className="w-4 h-4 rounded border-2 border-slate-400" />
                                              <span className="text-xs text-slate-600 dark:text-slate-400">Jag har redan ett konto</span>
                                            </div>
                                          )}
                                        </>
                                      )}
                                      {sectionId === 'coupon' && (
                                        <>
                                          <div className="flex gap-2">
                                            <div className="flex-1 h-8 bg-slate-200 dark:bg-slate-600 rounded" />
                                            <div className="h-8 px-4 bg-brand-600 rounded text-white text-sm flex items-center">Använd</div>
                                          </div>
                                        </>
                                      )}
                                      {sectionId === 'shipping' && (
                                        <>
                                          <Droppable droppableId="shipping-options" type="SHIPPING_OPTION">
                                            {(provided) => (
                                              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                                                {shippingOrder.map((optId, idx) => {
                                                  const opt = DELIVERY_OPTIONS.find(o => o.id === optId);
                                                  if (!opt) return null;
                                                  
                                                  // Get cost based on selected carrier
                                                  let cost = opt.cost;
                                                  if (selectedCarriers.length > 0) {
                                                    const firstCarrier = CARRIERS.find(c => c.id === selectedCarriers[0]);
                                                    if (firstCarrier) {
                                                      cost = firstCarrier.shippingCosts[optId as keyof typeof firstCarrier.shippingCosts];
                                                    }
                                                  }
                                                  
                                                  // Check if this should be pre-selected
                                                  const isSelected = preselectShipping && idx === 0;
                                                  
                                                  return (
                                                    <Draggable key={opt.id} draggableId={opt.id} index={idx}>
                                                      {(provided) => (
                                                        <div
                                                          ref={provided.innerRef}
                                                          {...provided.draggableProps}
                                                          {...provided.dragHandleProps}
                                                          className={`h-auto bg-slate-200 dark:bg-slate-600 rounded p-3 cursor-move ${isSelected ? 'ring-2 ring-green-500' : ''}`}
                                                        >
                                                          <div className="flex items-center gap-2 mb-1">
                                                            <div className={`w-4 h-4 rounded-full border-2 ${isSelected ? 'border-green-500 bg-green-500' : 'border-slate-400'}`} />
                                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                              {opt.icon} {opt.name} - {cost} kr
                                                            </span>
                                                            {selectedCarriers.length > 0 && (
                                                              <span className="text-xs text-slate-500">
                                                                ({CARRIERS.find(c => c.id === selectedCarriers[0])?.name})
                                                              </span>
                                                            )}
                                                            {isSelected && (
                                                              <span className="text-xs text-green-600 dark:text-green-400 ml-2">Förvald</span>
                                                            )}
                                                          </div>
                                                          <div className="text-xs text-slate-600 dark:text-slate-400 pl-6">
                                                            {shippingTexts[optId] || ''}
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
                                            <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded text-xs text-green-800 dark:text-green-300">
                                              Köp för {freeShippingThreshold - orderValue} kr till för fri frakt!
                                            </div>
                                          )}
                                          {selectedCarriers.length > 0 && (
                                            <div className="mt-3 p-2 bg-slate-100 dark:bg-slate-600 rounded">
                                              <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">Levereras av:</div>
                                              <Droppable droppableId="carriers" type="CARRIER">
                                                {(provided) => (
                                                  <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-wrap gap-2">
                                                    {carrierOrder.map((carrierId, idx) => {
                                                      const carrier = CARRIERS.find(c => c.id === carrierId);
                                                      if (!carrier) return null;
                                                      return (
                                                        <Draggable key={carrier.id} draggableId={carrier.id} index={idx}>
                                                          {(provided) => (
                                                            <div
                                                              ref={provided.innerRef}
                                                              {...provided.draggableProps}
                                                              {...provided.dragHandleProps}
                                                              className="flex items-center gap-2 px-2 py-1 bg-white dark:bg-slate-500 rounded text-xs font-medium text-slate-700 dark:text-slate-300 cursor-move"
                                                            >
                                                              <img src={carrier.logo} alt={carrier.name} className="w-4 h-4" />
                                                              <span>{carrier.name}</span>
                                                              <span className="text-green-600 dark:text-green-400">★{carrier.trustScore}</span>
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
                                        <>
                                          <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                            <div className="w-16 h-16 bg-slate-300 dark:bg-slate-500 rounded flex-shrink-0 flex items-center justify-center">
                                              <Package size={24} className="text-slate-400 dark:text-slate-400" />
                                            </div>
                                            <div className="flex-1">
                                              <div className="font-medium text-slate-700 dark:text-slate-300 text-sm">{crossSellProductName}</div>
                                              <div className="text-sm text-slate-600 dark:text-slate-400">
                                                <span className="line-through text-xs">{crossSellProductPrice} kr</span>
                                                <span className="ml-2 font-semibold">{Math.round(crossSellProductPrice * (1 - crossSellDiscount / 100))} kr</span>
                                                <span className="ml-2 text-xs text-green-600 dark:text-green-400">-{crossSellDiscount}%</span>
                                              </div>
                                              <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">Perfekt till din produkt!</div>
                                            </div>
                                          </div>
                                          <div className="flex items-center gap-2 mt-2">
                                            <div className="w-4 h-4 rounded border-2 border-slate-400" />
                                            <span className="text-xs text-slate-600 dark:text-slate-400">Lägg till i kundvagn</span>
                                          </div>
                                        </>
                                      )}
                                      {sectionId === 'payment' && (
                                        <>
                                          <div className="flex items-center gap-3 mb-3 p-2 bg-slate-100 dark:bg-slate-600 rounded">
                                            {(() => {
                                              const player = players.find(p => p.slug === selectedPlayer);
                                              if (player?.logoUrl) {
                                                return <img src={player.logoUrl} alt={player.name} className="w-8 h-5" />;
                                              }
                                              return <CreditCard size={20} className="text-slate-400" />;
                                            })()}
                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                              {players.find(p => p.slug === selectedPlayer)?.name || 'Ingen provider'}
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
                                                      {(provided) => (
                                                        <div
                                                          ref={provided.innerRef}
                                                          {...provided.draggableProps}
                                                          {...provided.dragHandleProps}
                                                          className="h-8 bg-slate-200 dark:bg-slate-600 rounded flex items-center px-3 cursor-move"
                                                        >
                                                          <div className="w-4 h-4 rounded-full border-2 border-slate-400 mr-2" />
                                                          {method.logo && (
                                                            <img src={method.logo} alt={method.name} className="w-4 h-4 mr-2" />
                                                          )}
                                                          <span className="text-sm text-slate-600 dark:text-slate-300">
                                                            {method.name}
                                                          </span>
                                                          {impact !== 0 && (
                                                            <span className={`ml-2 text-xs ${impact > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
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
                                            <div className="mt-3 p-2 bg-slate-100 dark:bg-slate-600 rounded">
                                              <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">Kort som accepteras:</div>
                                              <div className="flex flex-wrap gap-2">
                                                {selectedCardProviders.map((providerId) => {
                                                  const provider = CARD_PROVIDERS.find(p => p.id === providerId);
                                                  if (!provider) return null;
                                                  return (
                                                    <img key={provider.id} src={provider.logo} alt={provider.name} className="w-8 h-5" title={provider.name} />
                                                  );
                                                })}
                                              </div>
                                            </div>
                                          )}
                                        </>
                                      )}
                                      {sectionId === 'euReturn' && (
                                        <>
                                          <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                            <RefreshCw size={20} className="text-blue-600 dark:text-blue-400" />
                                            <div className="flex-1">
                                              <div className="font-semibold text-blue-900 dark:text-blue-100">Ångra köp</div>
                                              <div className="text-sm text-blue-700 dark:text-blue-300">
                                                Du har rätt att ångra detta köp inom 14 dagar
                                              </div>
                                            </div>
                                          </div>
                                        </>
                                      )}
                                      {sectionId === 'review' && (
                                        <>
                                          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                                            {hasCrossSell ? 'Produkter i varukorgen' : 'Orderöversikt'}
                                          </div>
                                          {showCartTimer && (
                                            <div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg mb-3">
                                              <Clock size={20} className="text-amber-600 dark:text-amber-400 flex-shrink-0" />
                                              <div className="flex-1">
                                                <div className="font-semibold text-amber-900 dark:text-amber-100">Varukorgen reserverad i 10:00</div>
                                                <div className="text-sm text-amber-700 dark:text-amber-300">Slutför köpet innan varukorgen släpps</div>
                                              </div>
                                            </div>
                                          )}
                                          {showSocialProof && (
                                            <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg mb-3">
                                              <Users size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                              <div className="flex-1">
                                                <div className="font-semibold text-blue-900 dark:text-blue-100">3 personer tittar på denna just nu</div>
                                                <div className="text-sm text-blue-700 dark:text-blue-300">Populär produkt - köp nu</div>
                                              </div>
                                            </div>
                                          )}
                                          {showLowStockWarning && (
                                            <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg mb-3">
                                              <AlertTriangle size={20} className="text-red-600 dark:text-red-400 flex-shrink-0" />
                                              <div className="flex-1">
                                                <div className="font-semibold text-red-900 dark:text-red-100">Endast 2 kvar i lager!</div>
                                                <div className="text-sm text-red-700 dark:text-red-300">Sluta kö innan det är slut</div>
                                              </div>
                                            </div>
                                          )}
                                          <div className="flex items-start gap-3 p-3 bg-slate-100 dark:bg-slate-600 rounded">
                                            <div className="w-16 h-16 bg-slate-300 dark:bg-slate-500 rounded flex-shrink-0 flex items-center justify-center">
                                              <Package size={24} className="text-slate-400 dark:text-slate-400" />
                                            </div>
                                            <div className="flex-1">
                                              <div className="font-medium text-slate-700 dark:text-slate-300 text-sm">{productName}</div>
                                              <div className="text-sm text-slate-600 dark:text-slate-400">{productPrice} kr</div>
                                              <div className="text-xs text-slate-500 dark:text-slate-500">Antal: 1</div>
                                            </div>
                                          </div>
                                          <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-3/4 mt-2" />
                                          <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-1/2 mt-1" />
                                          <div className="flex items-center gap-2 mt-3 text-xs">
                                            <div className="w-4 h-4 rounded border-2 border-slate-400" />
                                            <span className="text-slate-600 dark:text-slate-400">Jag godkänner köpvillkoren</span>
                                          </div>
                                        </>
                                      )}
                                      {sectionId === 'lowStock' && showLowStockWarning && (
                                        <>
                                          <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                            <AlertTriangle size={20} className="text-red-600 dark:text-red-400 flex-shrink-0" />
                                            <div className="flex-1">
                                              <div className="font-semibold text-red-900 dark:text-red-100">Endast 2 kvar i lager!</div>
                                              <div className="text-sm text-red-700 dark:text-red-300">Sluta kö innan det är slut</div>
                                            </div>
                                          </div>
                                        </>
                                      )}
                                      {sectionId === 'cartTimer' && showCartTimer && (
                                        <>
                                          <div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                                            <Clock size={20} className="text-amber-600 dark:text-amber-400 flex-shrink-0" />
                                            <div className="flex-1">
                                              <div className="font-semibold text-amber-900 dark:text-amber-100">Varukorgen reserverad i 10:00</div>
                                              <div className="text-sm text-amber-700 dark:text-amber-300">Slutför köpet innan varukorgen släpps</div>
                                            </div>
                                          </div>
                                        </>
                                      )}
                                      {sectionId === 'socialProof' && showSocialProof && (
                                        <>
                                          <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                            <Users size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                            <div className="flex-1">
                                              <div className="font-semibold text-blue-900 dark:text-blue-100">3 personer tittar på denna just nu</div>
                                              <div className="text-sm text-blue-700 dark:text-blue-300">Populär produkt - köp nu</div>
                                            </div>
                                          </div>
                                        </>
                                      )}
                                      {sectionId === 'giftWrapping' && addGiftWrapping && (
                                        <>
                                          <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                                            <Package size={20} className="text-purple-600 dark:text-purple-400 flex-shrink-0" />
                                            <div className="flex-1">
                                              <div className="font-semibold text-purple-900 dark:text-purple-100">Presentinslagning (+49 kr)</div>
                                              <div className="text-sm text-purple-700 dark:text-purple-300">Lägg till vacker presentinslagning</div>
                                            </div>
                                            <div className="w-4 h-4 rounded border-2 border-purple-400" />
                                          </div>
                                        </>
                                      )}
                                      {sectionId === 'insurance' && addInsurance && (
                                        <>
                                          <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                                            <Shield size={20} className="text-green-600 dark:text-green-400 flex-shrink-0" />
                                            <div className="flex-1">
                                              <div className="font-semibold text-green-900 dark:text-green-100">Försäkring (+19 kr)</div>
                                              <div className="text-sm text-green-700 dark:text-green-300">Skydda ditt paket mot skador</div>
                                            </div>
                                            <div className="w-4 h-4 rounded border-2 border-green-400" />
                                          </div>
                                        </>
                                      )}
                                      {sectionId === 'giftMessage' && addGiftMessage && (
                                        <>
                                          <div className="flex items-center gap-3 p-3 bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800 rounded-lg">
                                            <DollarSign size={20} className="text-pink-600 dark:text-pink-400 flex-shrink-0" />
                                            <div className="flex-1">
                                              <div className="font-semibold text-pink-900 dark:text-pink-100">Presentkort</div>
                                              <div className="text-sm text-pink-700 dark:text-pink-300">Lägg till en personlig hälsning</div>
                                            </div>
                                          </div>
                                        </>
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

              {hasUpsell && (
                <div className="mx-6 mb-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <TrendingUp size={20} className="text-amber-600 dark:text-amber-400" />
                    <div>
                      <div className="font-semibold text-amber-900 dark:text-amber-100">Lägg till för 49 kr</div>
                      <div className="text-sm text-amber-700 dark:text-amber-300">Spara 20% på tillbehör</div>
                    </div>
                  </div>
                </div>
              )}

              {freeShippingThreshold > 0 && orderValue < freeShippingThreshold && (
                <div className="mx-6 mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Truck size={20} className="text-green-600 dark:text-green-400" />
                    <div className="flex-1">
                      <div className="font-semibold text-green-900 dark:text-green-100">Fri frakt inom kort!</div>
                      <div className="text-sm text-green-700 dark:text-green-300">
                        Köp för {freeShippingThreshold - orderValue} kr till för fri frakt
                        {selectedCarriers.length > 0 && (
                          <span className="text-xs ml-2">
                            (spara {CARRIERS.find(c => c.id === selectedCarriers[0])?.shippingCosts[shippingOrder[0] as keyof typeof CARRIERS[0]['shippingCosts']] || shippingCost} kr på frakten)
                          </span>
                        )}
                      </div>
                      <div className="mt-2 h-2 bg-green-200 dark:bg-green-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 transition-all"
                          style={{ width: `${(orderValue / freeShippingThreshold) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!hideHeaderFooter && (
                <div className="bg-slate-100 dark:bg-slate-900 px-6 py-4">
                  <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                    <span>Säker betalning</span>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-green-600" />
                      <span>SSL-krypterad</span>
                    </div>
                  </div>
                </div>
              )}

              {/* CTA Button */}
              <div className="p-6 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setShowOrderConfirmation(true)}
                  className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all ${
                    ctaColor === 'green' 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : ctaColor === 'orange' 
                      ? 'bg-orange-500 hover:bg-orange-600 text-white'
                      : ctaColor === 'red'
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-slate-300 hover:bg-slate-400 text-slate-700'
                  }`}
                >
                  {ctaText === 'complete' && 'Slutför köp'}
                  {ctaText === 'pay' && 'Betala'}
                  {ctaText === 'confirm' && 'Bekräfta order'}
                </button>
                <div className="text-center text-xs text-slate-500 dark:text-slate-400 mt-2">
                  {ctaColor === 'green' && 'Grön: +3% konvertering (bekräftande/säker)'}
                  {ctaColor === 'orange' && `Orange: ${orderValue < 500 ? '+2%' : '-2%'} konvertering (brådskande)`}
                  {ctaColor === 'red' && `Röd: ${orderValue < 500 ? '+2%' : '-2%'} konvertering (brådskande)`}
                  {ctaColor === 'low-contrast' && 'Låg kontrast: -8% konvertering'}
                </div>
              </div>
              </>
              ) : (
                /* Order Confirmation View */
                <div className="p-6">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 size={32} className="text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Tack för din beställning!</h2>
                    <p className="text-slate-600 dark:text-slate-400">Ordernummer: #ORD-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                  </div>

                  {/* Order Details */}
                  <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-16 h-16 bg-slate-300 dark:bg-slate-500 rounded flex-shrink-0 flex items-center justify-center">
                        <Package size={24} className="text-slate-400 dark:text-slate-400" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-slate-700 dark:text-slate-300">{productName}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">{productPrice} kr</div>
                        <div className="text-xs text-slate-500 dark:text-slate-500">Antal: 1</div>
                      </div>
                    </div>
                  </div>

                  {/* Simulated Tracking Timeline */}
                  <div className="mb-4">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Orderstatus</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle2 size={16} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-slate-900 dark:text-slate-100">Order mottagen</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">Just nu</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 opacity-50">
                        <div className="w-8 h-8 bg-slate-300 dark:bg-slate-600 rounded-full flex items-center justify-center">
                          <Package size={16} className="text-slate-600 dark:text-slate-400" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-slate-900 dark:text-slate-100">Packas</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">Beräknat: Imorgon</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 opacity-50">
                        <div className="w-8 h-8 bg-slate-300 dark:bg-slate-600 rounded-full flex items-center justify-center">
                          <Truck size={16} className="text-slate-600 dark:text-slate-400" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-slate-900 dark:text-slate-100">Skickas</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">Beräknat: 2-3 dagar</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* One-click Account Creation (if guest checkout) */}
                  {isGuestCheckout && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Spara dina uppgifter för nästa gång</h3>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                        Skapa ett konto med ett klick för snabbare checkout nästa gång.
                      </p>
                      {showNextPurchaseDiscount && (
                        <div className="bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg p-2 mb-3">
                          <div className="text-sm font-semibold text-green-800 dark:text-green-200">
                            🎉 Få 10% rabatt på nästa köp!
                          </div>
                          <div className="text-xs text-green-700 dark:text-green-300">
                            Skapa konto nu och spara koden
                          </div>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <input
                          type="password"
                          placeholder="Lösenord"
                          className="flex-1 px-3 py-2 border border-blue-300 dark:border-blue-700 rounded dark:bg-blue-900/30 text-sm"
                        />
                        <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700">
                          Skapa konto
                        </button>
                      </div>
                    </div>
                  )}

                  {/* EU Return Button */}
                  {showEuReturnButton && (
                    <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 mb-4">
                      <button 
                        onClick={() => setShowReturnModal(true)}
                        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                      >
                        <RefreshCw size={20} className="text-slate-600 dark:text-slate-400" />
                        <span className="font-medium text-slate-900 dark:text-slate-100">Ångra köp</span>
                      </button>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">
                        Du har rätt att ångra detta köp inom 14 dagar enligt EU-direktiv
                      </p>
                    </div>
                  )}

                  {/* Back to Checkout Button */}
                  <button
                    onClick={() => setShowOrderConfirmation(false)}
                    className="w-full py-3 px-4 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                  >
                    ← Tillbaka till checkout
                  </button>
                </div>
              )}
            </div>

            {/* Return Modal */}
            {showReturnModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Ångra köp</h3>
                    <button
                      onClick={() => setShowReturnModal(false)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      <XCircle size={24} />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Varför vill du returnera?
                      </label>
                      <select
                        value={returnReason}
                        onChange={(e) => setReturnReason(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg dark:border-slate-600 dark:bg-slate-700 text-sm"
                      >
                        <option value="">Välj en orsak</option>
                        <option value="wrong-size">Fel storlek</option>
                        <option value="wrong-item">Fel artikel</option>
                        <option value="not-as-described">Inte som beskrivet</option>
                        <option value="changed-mind">Ångrat mig</option>
                        <option value="damaged">Skadad vid leverans</option>
                        <option value="other">Annat</option>
                      </select>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                      <div className="text-center">
                        <div className="w-32 h-32 bg-white dark:bg-slate-600 rounded-lg mx-auto mb-2 flex items-center justify-center border-2 border-slate-300 dark:border-slate-500">
                          <div className="text-center">
                            <QRCodeIcon size={64} className="text-slate-400 dark:text-slate-400 mx-auto" />
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">QR-Kod</div>
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          Skanna denna kod vid returstation
                        </p>
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      <p>Returnera inom 14 dagar enligt EU-direktiv.</p>
                      <p className="mt-1">Returfrakten är kostnadsfri.</p>
                    </div>

                    <button
                      onClick={() => {
                        // Process return without creating new order
                        setShowReturnModal(false);
                      }}
                      className="w-full py-3 px-4 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors"
                    >
                      Skicka retur
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Control Panel with Tabs */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Control Panel</h2>
            </div>

            {/* Metrics - Always Visible */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-4">
              {!showOrderConfirmation ? (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Gauge size={18} className="text-brand-600 dark:text-brand-400" />
                      <span className="font-semibold text-slate-900 dark:text-slate-100">Konverteringsscore</span>
                    </div>
                    <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">{conversionScore}%</div>
                  </div>
                  <div className="relative h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${conversionScore}%` }}
                      transition={{ duration: 0.5 }}
                      className={`h-full rounded-full ${
                        conversionScore >= 70 ? 'bg-green-500' : conversionScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                    />
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                    {conversionScore >= 70 ? 'Optimerad för hög konvertering' : conversionScore >= 40 ? 'Medel konvertering' : 'Låg konvertering - förbättringar behövs'}
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                    <div className="text-center">
                      <div className="text-lg font-bold text-slate-900 dark:text-slate-100">{calculateAOV()} kr</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Beräknad AOV</div>
                      {aovMetrics.length > 0 && (
                        <>
                          <div className="relative h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(100, (calculateAOV() / orderValue) * 100)}%` }}
                              transition={{ duration: 0.5 }}
                              className="h-full rounded-full bg-blue-500"
                            />
                          </div>
                          <div className={`text-xs mt-1 ${aovMetrics[0]?.impact > 0 ? 'text-green-600 dark:text-green-400' : 'text-slate-500'}`}>
                            {aovMetrics[0]?.impact > 0 ? '+' : ''}{aovMetrics[0]?.impact}% från base
                          </div>
                        </>
                      )}
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-slate-900 dark:text-slate-100">{calculateCLV()} kr</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Beräknad CLV</div>
                      {clvMetrics.length > 0 && (
                    <>
                      <div className="relative h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, (calculateCLV() / 1000) * 100)}%` }}
                          transition={{ duration: 0.5 }}
                          className={`h-full rounded-full ${
                            clvMetrics[0]?.impact > 0 ? 'bg-purple-500' : 'bg-slate-400'
                          }`}
                        />
                      </div>
                      <div className={`text-xs mt-1 ${clvMetrics[0]?.impact > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {clvMetrics[0]?.impact > 0 ? '+' : ''}{clvMetrics[0]?.impact}% från base
                      </div>
                    </>
                  )}
                </div>
              </div>
                </>
              ) : (
                /* Order Confirmation Metrics */
                <>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp size={18} className="text-purple-600 dark:text-purple-400" />
                      <span className="font-semibold text-slate-900 dark:text-slate-100">Post-Purchase Metrics</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                      <div className="text-lg font-bold text-slate-900 dark:text-slate-100">{calculateCLV()} kr</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Beräknad CLV (Customer Lifetime Value)</div>
                      <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                        {isGuestCheckout ? '-40% CLV pga gästutcheckning' : 'Base CLV'}
                      </div>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                      <div className="text-lg font-bold text-slate-900 dark:text-slate-100">{isGuestCheckout ? '15%' : '45%'}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Återkommande Kunder</div>
                      <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        {isGuestCheckout ? 'Låg pga gästutcheckning' : 'Hög med konto'}
                      </div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                      <div className="text-lg font-bold text-slate-900 dark:text-slate-100">{selectedDeliveryOptions.length >= 3 ? 'Low' : 'Medium'}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Support Tickets (WISMO)</div>
                      <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                        Tracking minskar WISMO med 40%
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Tabs */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="flex border-b border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition ${
                    activeTab === 'settings'
                      ? 'text-brand-600 border-b-2 border-brand-600 bg-brand-50 dark:bg-brand-950'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  Inställningar
                </button>
                <button
                  onClick={() => setActiveTab('shipping')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition ${
                    activeTab === 'shipping'
                      ? 'text-brand-600 border-b-2 border-brand-600 bg-brand-50 dark:bg-brand-950'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  Frakt & Logistik
                </button>
                <button
                  onClick={() => setActiveTab('product')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition ${
                    activeTab === 'product'
                      ? 'text-brand-600 border-b-2 border-brand-600 bg-brand-50 dark:bg-brand-950'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  Produkt
                </button>
                <button
                  onClick={() => setActiveTab('provider')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition ${
                    activeTab === 'provider'
                      ? 'text-brand-600 border-b-2 border-brand-600 bg-brand-50 dark:bg-brand-950'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  Provider
                </button>
                <button
                  onClick={() => setActiveTab('export')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition ${
                    activeTab === 'export'
                      ? 'text-brand-600 border-b-2 border-brand-600 bg-brand-50 dark:bg-brand-950'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  Export & Sammanfattning
                </button>
              </div>

              <div className="p-4 max-h-[500px] overflow-y-auto">
                {activeTab === 'settings' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="group relative">
                        <Toggle
                          label={isGuestCheckout ? `+${getDynamicPercentage(BASE_PERCENTAGES.guestCheckout, 0, SETTINGS_ORDER.length)}% Gästutcheckning` : '-35% Tvingat konto'}
                          description="Inget krav på att skapa konto"
                          checked={isGuestCheckout}
                          onChange={setIsGuestCheckout}
                        />
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          Gästutcheckning ökar konvertering med {getDynamicPercentage(BASE_PERCENTAGES.guestCheckout, 0, SETTINGS_ORDER.length)}%, men sänker CLV med 40%
                        </div>
                      </div>
                      <div className="group relative">
                        <Toggle
                          label={hasAutofill ? `+${getDynamicPercentage(BASE_PERCENTAGES.autofill, 1, SETTINGS_ORDER.length)}% Adress-autofill` : 'Adress-autofill'}
                          description="Automatisk ifyllning av adresser"
                          checked={hasAutofill}
                          onChange={setHasAutofill}
                        />
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          Autofill = +{getDynamicPercentage(BASE_PERCENTAGES.autofill, 1, SETTINGS_ORDER.length)}%
                        </div>
                      </div>
                      <div className="group relative">
                        <Toggle
                          label={shippingDisplayedEarly ? `+${getDynamicPercentage(BASE_PERCENTAGES.shippingDisplayedEarly, 2, SETTINGS_ORDER.length)}% Visa frakt tidigt` : '-8% Dölj frakt'}
                          description="Visa fraktkostnader direkt i kassan"
                          checked={shippingDisplayedEarly}
                          onChange={setShippingDisplayedEarly}
                        />
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          Dold frakt = -8%, Visad frakt = +{getDynamicPercentage(BASE_PERCENTAGES.shippingDisplayedEarly, 2, SETTINGS_ORDER.length)}%
                        </div>
                      </div>
                      <div className="group relative">
                        <Toggle
                          label={hideHeaderFooter ? `+${getDynamicPercentage(BASE_PERCENTAGES.hideHeaderFooter, 3, SETTINGS_ORDER.length)}% Dölj header/footer` : 'Dölj header/footer'}
                          description="Minimal UI för mindre distraktioner"
                          checked={hideHeaderFooter}
                          onChange={setHideHeaderFooter}
                        />
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          Dölj header/footer = +{getDynamicPercentage(BASE_PERCENTAGES.hideHeaderFooter, 3, SETTINGS_ORDER.length)}%
                        </div>
                      </div>
                      <div className="group relative">
                        <Toggle
                          label={hasUpsell ? `+${getDynamicPercentage(BASE_PERCENTAGES.upsell, 4, SETTINGS_ORDER.length)}% Post-purchase upsell` : 'Post-purchase upsell'}
                          description="Erbjud tilläggsprodukter efter köp"
                          checked={hasUpsell}
                          onChange={setHasUpsell}
                        />
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          Upsell = +15% AOV, +{getDynamicPercentage(BASE_PERCENTAGES.upsell, 4, SETTINGS_ORDER.length)}% konvertering
                        </div>
                      </div>
                      <div className="group relative">
                        <Toggle
                          label={hasCrossSell ? '+10% AOV Korsförsäljning' : 'Korsförsäljning'}
                          description="Visa rekommenderade tillbehör i kassan"
                          checked={hasCrossSell}
                          onChange={(checked) => {
                            setHasCrossSell(checked);
                            if (checked && !layoutOrder.includes('crossSell')) {
                              const withoutReview = layoutOrder.filter(id => id !== 'review');
                              setLayoutOrder([...withoutReview, 'crossSell', 'review']);
                            } else if (!checked) {
                              setLayoutOrder(layoutOrder.filter(id => id !== 'crossSell'));
                            }
                          }}
                        />
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          Korsförsäljning = +10% AOV (ej konvertering)
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Gästinlogg text
                      </label>
                      <select
                        value={guestLoginText}
                        onChange={(e) => setGuestLoginText(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg dark:border-slate-600 dark:bg-slate-700 text-sm"
                      >
                        {GUEST_LOGIN_TEXTS.map((text) => (
                          <option key={text} value={text}>
                            {text}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        CTA-knapp färg
                      </label>
                      <select
                        value={ctaColor}
                        onChange={(e) => setCtaColor(e.target.value as 'green' | 'orange' | 'red' | 'low-contrast')}
                        className="w-full p-2 border border-slate-300 rounded-lg dark:border-slate-600 dark:bg-slate-700 text-sm"
                      >
                        <option value="green">Grön (+3% konvertering)</option>
                        <option value="orange">Orange (+2%/-2% beroende på ordervärde)</option>
                        <option value="red">Röd (+2%/-2% beroende på ordervärde)</option>
                        <option value="low-contrast">Låg kontrast (-8% konvertering)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        CTA-knapp text
                      </label>
                      <select
                        value={ctaText}
                        onChange={(e) => setCtaText(e.target.value as 'complete' | 'pay' | 'confirm')}
                        className="w-full p-2 border border-slate-300 rounded-lg dark:border-slate-600 dark:bg-slate-700 text-sm"
                      >
                        <option value="complete">Slutför köp (Standard)</option>
                        <option value="pay">Betala (-2% konvertering)</option>
                        <option value="confirm">Bekräfta order (+1% konvertering)</option>
                      </select>
                    </div>
                    <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4">
                      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Kontoskapande</h3>
                      <div className="group relative">
                        <Toggle
                          label={showNextPurchaseDiscount ? 'Rabatt på nästa köp (Aktiv)' : 'Rabatt på nästa köp'}
                          description="10% rabatt för att öka kontoskapande"
                          checked={showNextPurchaseDiscount}
                          onChange={setShowNextPurchaseDiscount}
                        />
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          Rabatt på nästa köp = +15% kontoskapande, +10% återkommande kunder
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4">
                      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">FOMO (Fear Of Missing Out)</h3>
                      <div className="group relative">
                        <Toggle
                          label={showLowStockWarning ? `+${BASE_PERCENTAGES.lowStockWarning}% Lagersaldovarning` : 'Lagersaldovarning'}
                          description="Endast 2 kvar i lager"
                          checked={showLowStockWarning}
                          onChange={setShowLowStockWarning}
                        />
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          Lagersaldovarning = +8% konvertering
                        </div>
                      </div>
                      <div className="group relative">
                        <Toggle
                          label={showCartTimer ? `+${BASE_PERCENTAGES.cartTimer}% Varukorgstimer` : 'Varukorgstimer'}
                          description="Varukorgen reserverad i 10 min"
                          checked={showCartTimer}
                          onChange={setShowCartTimer}
                        />
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          Varukorgstimer = +5% konvertering, -2% trust
                        </div>
                      </div>
                      <div className="group relative">
                        <Toggle
                          label={showSocialProof ? `+${BASE_PERCENTAGES.socialProof}% Social Proof` : 'Social Proof'}
                          description="3 personer tittar på denna just nu"
                          checked={showSocialProof}
                          onChange={setShowSocialProof}
                        />
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          Social Proof = +3% konvertering
                        </div>
                      </div>
                    </div>
                    {hasCrossSell && (
                      <div className="space-y-3 pl-4 border-l-2 border-slate-200 dark:border-slate-700">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Produktnamn
                          </label>
                          <input
                            type="text"
                            value={crossSellProductName}
                            onChange={(e) => setCrossSellProductName(e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded-lg dark:border-slate-600 dark:bg-slate-700 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Produktpris (kr)
                          </label>
                          <input
                            type="number"
                            value={crossSellProductPrice}
                            onChange={(e) => setCrossSellProductPrice(Number(e.target.value))}
                            className="w-full p-2 border border-slate-300 rounded-lg dark:border-slate-600 dark:bg-slate-700 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Rabatt (%)
                          </label>
                          <input
                            type="number"
                            value={crossSellDiscount}
                            onChange={(e) => setCrossSellDiscount(Number(e.target.value))}
                            className="w-full p-2 border border-slate-300 rounded-lg dark:border-slate-600 dark:bg-slate-700 text-sm"
                          />
                        </div>
                      </div>
                    )}
                    <div className="group relative">
                      <Toggle
                        label={`Dölj header/footer ${hideHeaderFooter ? '(+3%)' : ''}`}
                        description="Minimal UI för mindre distraktioner"
                        checked={hideHeaderFooter}
                        onChange={setHideHeaderFooter}
                      />
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        Minimal UI = +3%
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Fri frakt-alternativ (påverkar konvertering)
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={freeShipping}
                            onChange={(e) => setFreeShipping(e.target.checked)}
                            className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                          />
                          <div className="flex items-center gap-2 flex-1">
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Fri frakt alltid</span>
                          </div>
                          <div className="text-xs text-slate-500">+8%</div>
                        </label>
                        <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={freeHomeDelivery}
                            onChange={(e) => setFreeHomeDelivery(e.target.checked)}
                            className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                          />
                          <div className="flex items-center gap-2 flex-1">
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Fri hemleverans</span>
                          </div>
                          <div className="text-xs text-slate-500">+5%</div>
                        </label>
                        <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={freeLockerDelivery}
                            onChange={(e) => setFreeLockerDelivery(e.target.checked)}
                            className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                          />
                          <div className="flex items-center gap-2 flex-1">
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Fri skåpsleverans</span>
                          </div>
                          <div className="text-xs text-slate-500">+4%</div>
                        </label>
                      </div>
                    </div>
                    <div className="group relative">
                      <Toggle
                        label={preselectShipping ? `+${BASE_PERCENTAGES.preselectShipping}% Förvalt fraktalternativ` : 'Förvalt fraktalternativ'}
                        description="Välj automatiskt bästa fraktalternativ"
                        checked={preselectShipping}
                        onChange={setPreselectShipping}
                      />
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        Förvalt fraktalternativ = +3% konvertering
                      </div>
                    </div>
                    <div className="group relative">
                      <Toggle
                        label={`EU-ångerknapp (obligatorisk från juni 2026) ${showEuReturnButton ? '(+6-8%)' : ''}`}
                        description="Visa ångerknapp enligt EU:s nya regler"
                        checked={showEuReturnButton}
                        onChange={(checked) => {
                          setShowEuReturnButton(checked);
                          if (checked && !layoutOrder.includes('euReturn')) {
                            const withoutReview = layoutOrder.filter(id => id !== 'review');
                            setLayoutOrder([...withoutReview, 'euReturn', 'review']);
                          } else if (!checked) {
                            setLayoutOrder(layoutOrder.filter(id => id !== 'euReturn'));
                          }
                        }}
                      />
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        EU-återgång = +6-8% (beroende på position)
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700 mt-2">
                      <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">Extra tjänster</div>
                      <div className="group relative">
                        <Toggle
                          label={`Presentinslagning ${addGiftWrapping ? '(+2% AOV)' : ''}`}
                          description="Lägg till presentinslagning (+10% till ordervärde)"
                          checked={addGiftWrapping}
                          onChange={setAddGiftWrapping}
                        />
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          Presentinslagning = +2% konvertering
                        </div>
                      </div>
                      <div className="group relative">
                        <Toggle
                          label={`Leveransförsäkring ${addInsurance ? '(+1%)' : ''}`}
                          description="Lägg till leveransförsäkring (+5% till ordervärde)"
                          checked={addInsurance}
                          onChange={setAddInsurance}
                        />
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          Leveransförsäkring = +1%
                        </div>
                      </div>
                      <div className="group relative">
                        <Toggle
                          label={`Gåvomeddelande ${addGiftMessage ? '(+1%)' : ''}`}
                          description="Lägg till gåvomeddelande (+2% till ordervärde)"
                          checked={addGiftMessage}
                          onChange={setAddGiftMessage}
                        />
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          Gåvomeddelande = +1%
                        </div>
                      </div>
                      <div className="group relative">
                        <Toggle
                          label={`Förvalt fraktalternativ ${preselectShipping ? '(+3%)' : ''}`}
                          description="Välj automatiskt bästa fraktalternativ"
                          checked={preselectShipping}
                          onChange={setPreselectShipping}
                        />
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          Förvalt frakt = +3%
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'shipping' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Ordervärde (kr)
                      </label>
                      <input
                        type="range"
                        min="100"
                        max="5000"
                        step="50"
                        value={orderValue}
                        onChange={(e) => setOrderValue(Number(e.target.value))}
                        className="w-full"
                      />
                      <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">{orderValue} kr</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Fraktkostnad (kr)
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="500"
                        step="10"
                        value={shippingCost}
                        onChange={(e) => setShippingCost(Number(e.target.value))}
                        className="w-full"
                      />
                      <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">{shippingCost} kr ({((shippingCost / orderValue) * 100).toFixed(1)}% av ordervärde)</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Fri frakt-gräns (kr) - 0 = ingen gräns
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="2000"
                        step="100"
                        value={freeShippingThreshold}
                        onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                        className="w-full"
                      />
                      <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">{freeShippingThreshold === 0 ? 'Ingen gräns' : `${freeShippingThreshold} kr`}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Leveransalternativ
                      </label>
                      <div className="space-y-2">
                        {DELIVERY_OPTIONS.map((opt) => (
                          <label key={opt.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedDeliveryOptions.includes(opt.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  const newSelected = [...selectedDeliveryOptions, opt.id];
                                  setSelectedDeliveryOptions(newSelected);
                                  setShippingOrder([...shippingOrder, opt.id]);
                                } else {
                                  const newSelected = selectedDeliveryOptions.filter(id => id !== opt.id);
                                  setSelectedDeliveryOptions(newSelected);
                                  setShippingOrder(shippingOrder.filter(id => id !== opt.id));
                                }
                              }}
                              className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                            />
                            <div className="flex items-center gap-2 flex-1">
                              {opt.icon}
                              <span className="text-sm text-slate-700 dark:text-slate-300">{opt.name}</span>
                              <span className="text-xs text-slate-500">{opt.cost} kr</span>
                            </div>
                            <div className="text-xs text-slate-400">
                              {DELIVERY_OPTION_CARRIERS[opt.id]?.map(carrierId => {
                                const carrier = CARRIERS.find(c => c.id === carrierId);
                                return carrier ? carrier.name : carrierId;
                              }).join(', ') || 'Inga transportörer'}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Transportörer (påverkar konvertering per marknad)
                      </label>
                      {selectedPlayer in PROVIDER_TO_CARRIER && (
                        <div className="mb-2 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded text-xs text-blue-800 dark:text-blue-300">
                          Carrier låst till provider: {players.find(p => p.slug === selectedPlayer)?.name}
                        </div>
                      )}
                      <div className="space-y-2">
                        {CARRIERS.map((carrier) => {
                          const isLockedToProvider = selectedPlayer in PROVIDER_TO_CARRIER;
                          const isProviderCarrier = selectedPlayer === carrier.id;
                          const isDisabled = isLockedToProvider && !isProviderCarrier;
                          
                          return (
                            <label 
                              key={carrier.id} 
                              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${
                                isDisabled 
                                  ? 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-700' 
                                  : 'hover:bg-slate-50 dark:hover:bg-slate-700'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={selectedCarriers.includes(carrier.id)}
                                disabled={isDisabled}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    const newSelected = [...selectedCarriers, carrier.id];
                                    setSelectedCarriers(newSelected);
                                    setCarrierOrder([...carrierOrder, carrier.id]);
                                  } else {
                                    const newSelected = selectedCarriers.filter(id => id !== carrier.id);
                                    setSelectedCarriers(newSelected);
                                    setCarrierOrder(carrierOrder.filter(id => id !== carrier.id));
                                  }
                                }}
                                className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 disabled:opacity-50"
                              />
                              <div className="flex items-center gap-2 flex-1">
                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{carrier.name}</span>
                                <span className="text-xs text-slate-500">Trust: {carrier.trustScore}/5</span>
                              </div>
                              <div className="text-xs text-slate-500">
                              SE: {carrier.marketImpact.se > 0 ? '+' : ''}{carrier.marketImpact.se}%
                            </div>
                          </label>
                        );
                      })}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Kortleverantörer (påverkar konvertering per marknad)
                      </label>
                      <div className="space-y-2">
                        {CARD_PROVIDERS.map((provider) => (
                          <label key={provider.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedCardProviders.includes(provider.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedCardProviders([...selectedCardProviders, provider.id]);
                                } else {
                                  setSelectedCardProviders(selectedCardProviders.filter(id => id !== provider.id));
                                }
                              }}
                              className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                            />
                            <div className="flex items-center gap-2 flex-1">
                              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{provider.name}</span>
                            </div>
                            <div className="text-xs text-slate-500">
                              SE: {provider.conversionImpact.se > 0 ? '+' : ''}{provider.conversionImpact.se}%
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Leveranstext (påverkar konvertering)
                      </label>
                      <div className="space-y-2">
                        {selectedDeliveryOptions.map((optId) => {
                          const opt = DELIVERY_OPTIONS.find(o => o.id === optId);
                          if (!opt) return null;
                          return (
                            <div key={opt.id}>
                              <label className="text-xs text-slate-500 mb-1 block">{opt.name}</label>
                              <input
                                type="text"
                                value={shippingTexts[optId] || ''}
                                onChange={(e) => setShippingTexts({ ...shippingTexts, [optId]: e.target.value })}
                                className="w-full p-2 border border-slate-300 rounded-lg dark:border-slate-600 dark:bg-slate-700 text-sm"
                                placeholder="Ex: Tis 29/6 mellan 10:00-11:30"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'product' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Välj produkt (påverkar ordervärde och konvertering)
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {PRODUCTS.map((product) => (
                          <button
                            key={product.id}
                            onClick={() => handleProductSelect(product.id)}
                            className={`p-3 rounded-lg border text-left transition-colors ${
                              productPrice === product.price
                                ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                                : 'border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'
                            }`}
                          >
                            <div className="font-medium text-sm text-slate-700 dark:text-slate-300">{product.name}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">{product.price} kr</div>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Produktnamn
                      </label>
                      <input
                        type="text"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg dark:border-slate-600 dark:bg-slate-700"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Produktpris (kr)
                      </label>
                      <input
                        type="number"
                        value={productPrice}
                        onChange={(e) => {
                          const newPrice = Number(e.target.value);
                          setProductPrice(newPrice);
                          setOrderValue(newPrice);
                        }}
                        className="w-full p-2 border border-slate-300 rounded-lg dark:border-slate-600 dark:bg-slate-700"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'provider' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Checkout Provider
                      </label>
                      <select
                        value={selectedPlayer}
                        onChange={(e) => handleProviderChange(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg dark:border-slate-600 dark:bg-slate-700"
                      >
                        {players.map((p) => {
                          const marketKey = customerCountry.toLowerCase() as keyof typeof p.marketImpact;
                          const impact = p.marketImpact[marketKey];
                          return (
                            <option key={p.slug} value={p.slug}>
                              {p.name} ({customerCountry}: +{impact}%)
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Kundens land
                      </label>
                      <select
                        value={customerCountry}
                        onChange={(e) => setCustomerCountry(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg dark:border-slate-600 dark:bg-slate-700"
                      >
                        <option value="SE">Sverige</option>
                        <option value="NO">Norge</option>
                        <option value="DK">Danmark</option>
                        <option value="FI">Finland</option>
                        <option value="DE">Tyskland</option>
                        <option value="UK">Storbritannien</option>
                        <option value="US">USA</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeTab === 'export' && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Ladda ned PDF med checkout-konfiguration</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                        Fyll i dina uppgifter för att ladda ned en sammanfattning av din checkout-konfiguration med konverteringsdata.
                      </p>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Namn
                          </label>
                          <input
                            type="text"
                            placeholder="Ditt namn"
                            className="w-full p-2 border border-slate-300 rounded-lg dark:border-slate-600 dark:bg-slate-700 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            E-post
                          </label>
                          <input
                            type="email"
                            placeholder="din@email.se"
                            className="w-full p-2 border border-slate-300 rounded-lg dark:border-slate-600 dark:bg-slate-700 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Företag (valfritt)
                          </label>
                          <input
                            type="text"
                            placeholder="Företagsnamn"
                            className="w-full p-2 border border-slate-300 rounded-lg dark:border-slate-600 dark:bg-slate-700 text-sm"
                          />
                        </div>
                        <button
                          className="w-full py-2 px-4 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors"
                        >
                          Ladda ned PDF
                        </button>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Sammanfattning av alla vyer</h3>
                      <div className="space-y-4">
                        <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                          <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">Checkout</h4>
                          <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                            <div>• Konverteringsgrad: {conversionScore}%</div>
                            <div>• AOV: {calculateAOV()} kr</div>
                            <div>• Gästutcheckning: {isGuestCheckout ? 'Aktiv' : 'Inaktiv'}</div>
                            <div>• FOMO-element: {[showLowStockWarning, showCartTimer, showSocialProof].filter(Boolean).length} aktiva</div>
                          </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                          <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">Orderbekräftelse</h4>
                          <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                            <div>• CLV: {calculateCLV()} kr</div>
                            <div>• Återkommande kunder: {calculateReturningCustomer()}%</div>
                            <div>• Support tickets: {calculateSupportTickets()}</div>
                            <div>• One-click kontoskapande: {isGuestCheckout ? 'Tillgänglig' : 'Ej tillgänglig'}</div>
                          </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                          <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">Retursida</h4>
                          <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                            <div>• EU-Ångerknapp: {showEuReturnButton ? 'Aktiv' : 'Inaktiv'}</div>
                            <div>• Returmodal: {showReturnModal ? 'Öppen' : 'Stängd'}</div>
                            <div>• QR-kod för retur: Tillgänglig</div>
                            <div>• Returorsaker: 6 alternativ</div>
                          </div>
                        </div>

                        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                          <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Total sammanfattning</h4>
                          <div className="text-sm text-green-800 dark:text-green-300 space-y-1">
                            <div>• Beräknad konverteringsgrad: {conversionScore}%</div>
                            <div>• Beräknad AOV: {calculateAOV()} kr</div>
                            <div>• Beräknad CLV: {calculateCLV()} kr</div>
                            <div>• Aktiva funktioner: {countActiveFeatures()}</div>
                          </div>
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
