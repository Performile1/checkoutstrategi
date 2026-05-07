'use client';

import { useState } from 'react';
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
  Globe
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
  { id: 'payment', title: 'Betalning', icon: <CreditCard size={20} />, description: 'Betalmetoder och kort' },
  { id: 'review', title: 'Orderöversikt', icon: <Package size={20} />, description: 'Sammanfattning av köp' },
];

export default function TestCheckoutPage() {
  const [layoutOrder, setLayoutOrder] = useState(['customer', 'guest', 'coupon', 'shipping', 'payment', 'review']);
  const [hasAutofill, setHasAutofill] = useState(false);
  const [isGuestCheckout, setIsGuestCheckout] = useState(true);
  const [hasUpsell, setHasUpsell] = useState(false);
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
  const [shippingOrder, setShippingOrder] = useState<string[]>(['pickup', 'home']);

  const calculateConversionScore = () => {
    let score = 40; // Base score (lowered to show impact more clearly)

    // Guest checkout impact (Baymard: forced account creation is top 3 reason for abandonment)
    if (!isGuestCheckout) {
      score -= 35;
    } else {
      score += 15; // Guest checkout helps conversion
    }

    // Autofill impact (reduces friction, especially on mobile)
    if (hasAutofill) {
      score += 12;
    }

    // Hidden shipping costs (biggest reason for cart abandonment)
    if (!shippingDisplayedEarly) {
      score -= 48;
    } else {
      score += 8;
    }

    // No header/footer (reduces distractions)
    if (hideHeaderFooter) {
      score += 10;
    }

    // Post-purchase upsell (increases AOV without hurting conversion)
    if (hasUpsell) {
      score += 5;
    }

    // Free shipping threshold (increases AOV and conversion)
    if (freeShippingThreshold > 0) {
      score += 8;
    }

    // Free shipping on all orders
    if (freeShipping) {
      score += 12;
    }

    // Free home delivery
    if (freeHomeDelivery) {
      score += 7;
    }

    // Free locker delivery
    if (freeLockerDelivery) {
      score += 5;
    }

    // Multiple delivery options (gives customers choice)
    if (selectedDeliveryOptions.length >= 3) {
      score += 6;
    } else if (selectedDeliveryOptions.length >= 2) {
      score += 3;
    }

    // Shipping cost vs order value (high shipping cost relative to order value hurts conversion)
    const shippingRatio = shippingCost / orderValue;
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

    // Player trust/conversion impact
    const player = players.find(p => p.slug === selectedPlayer);
    if (player) {
      score += (player.conversionImpact - 5) * 2; // Scale conversion impact (1-10) to score impact
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

    return Math.max(0, Math.min(100, score));
  };

  const calculateAOV = () => {
    let aov = orderValue;

    // Free shipping threshold increases AOV by 15-30% (customers add items to reach threshold)
    if (freeShippingThreshold > 0) {
      aov *= 1.2;
    }

    // Free shipping on all orders increases AOV by 10%
    if (freeShipping) {
      aov *= 1.1;
    }

    // Upsell increases AOV by 15%
    if (hasUpsell) {
      aov *= 1.15;
    }

    return Math.round(aov);
  };

  const calculateCLV = () => {
    let clvMultiplier = 1;

    // Guest checkout reduces CLV (no customer account for future marketing)
    if (isGuestCheckout) {
      clvMultiplier *= 0.6;
    }

    // Account creation enables future marketing, increases CLV
    if (!isGuestCheckout) {
      clvMultiplier *= 1.5;
    }

    // Multiple delivery options improves satisfaction, increases repeat purchases
    if (selectedDeliveryOptions.length >= 3) {
      clvMultiplier *= 1.2;
    }

    return Math.round(clvMultiplier * 1000); // Base CLV of 1000
  };

  const getConversionMetrics = () => {
    const score = calculateConversionScore();
    const metrics = [];

    if (!isGuestCheckout) {
      metrics.push({ label: 'Tvingat konto', impact: -35, source: 'Baymard Institute' });
    } else {
      metrics.push({ label: 'Gästutcheckning', impact: 15, source: 'Baymard Institute' });
    }
    if (hasAutofill) {
      metrics.push({ label: 'Autofill', impact: 12, source: 'Nielsen Norman Group' });
    }
    if (!shippingDisplayedEarly) {
      metrics.push({ label: 'Dolda fraktkostnader', impact: -48, source: 'Baymard Institute' });
    } else {
      metrics.push({ label: 'Visad frakt tidigt', impact: 8, source: 'CRO best practices' });
    }
    if (hideHeaderFooter) {
      metrics.push({ label: 'Minimal UI', impact: 10, source: 'CRO best practices' });
    }
    if (hasUpsell) {
      metrics.push({ label: 'Post-purchase upsell', impact: 5, source: 'E-commerce studies' });
    }
    if (freeShipping) {
      metrics.push({ label: 'Fri frakt alltid', impact: 12, source: 'E-commerce studies' });
    }
    if (freeHomeDelivery) {
      metrics.push({ label: 'Fri hemleverans', impact: 7, source: 'Delivery experience studies' });
    }
    if (freeLockerDelivery) {
      metrics.push({ label: 'Fri skåpsleverans', impact: 5, source: 'Delivery experience studies' });
    }
    if (selectedDeliveryOptions.length >= 3) {
      metrics.push({ label: 'Många leveransalternativ', impact: 6, source: 'Ingrid/nShift studies' });
    } else if (selectedDeliveryOptions.length >= 2) {
      metrics.push({ label: 'Flera leveransalternativ', impact: 3, source: 'Ingrid/nShift studies' });
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
    }

    const player = players.find(p => p.slug === selectedPlayer);
    if (player) {
      const playerImpact = (player.conversionImpact - 5) * 2;
      if (playerImpact > 0) {
        metrics.push({ label: `${player.name} trust score`, impact: playerImpact, source: 'Performile analysis' });
      } else if (playerImpact < 0) {
        metrics.push({ label: `${player.name} trust score`, impact: playerImpact, source: 'Performile analysis' });
      }
    }

    if (customerCountry === 'SE' && player?.countries.includes('SE')) {
      metrics.push({ label: 'Lokal provider (SE)', impact: 8, source: 'Trust studies' });
    } else if (!player?.countries.includes(customerCountry)) {
      metrics.push({ label: 'Provider ej tillgängligt', impact: -10, source: 'Availability check' });
    }

    // Micro-copy impact for shipping text
    selectedDeliveryOptions.forEach((optId) => {
      const text = shippingTexts[optId] || '';
      if (/\d{1,2}:\d{2}-\d{1,2}:\d{2}/.test(text)) {
        metrics.push({ label: 'Specifikt tidsfönster', impact: 12, source: 'Delivery experience studies' });
      } else if (/(\d-\d\s*dag(ar)?|snart|inom kort)/i.test(text)) {
        metrics.push({ label: 'Luddig leveranstext', impact: -7, source: 'Baymard Institute' });
      }
    });

    return metrics;
  };

  const getAOVMetrics = () => {
    const metrics = [];

    if (freeShippingThreshold > 0) {
      const aov = calculateAOV();
      const baseAov = orderValue;
      const increase = Math.round((aov / baseAov - 1) * 100);
      metrics.push({ label: 'Fri frakt-gräns', impact: increase, source: 'Shopify/Baymard' });
    }

    if (freeShipping) {
      metrics.push({ label: 'Fri frakt alltid', impact: 10, source: 'E-commerce studies' });
    }

    if (hasUpsell) {
      metrics.push({ label: 'Post-purchase upsell', impact: 15, source: 'E-commerce studies' });
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
                                className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 border-2 border-slate-200 dark:border-slate-600 hover:border-brand-500 dark:hover:border-brand-400 transition-colors cursor-move"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="text-slate-400 mt-1">
                                    <Settings size={16} />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-semibold text-slate-900 dark:text-slate-100">{section.title}</span>
                                      <span className="text-xs text-slate-500 dark:text-slate-400">{section.description}</span>
                                    </div>
                                    <div className="space-y-2">
                                      {sectionId === 'customer' && (
                                        <>
                                          <div className="h-8 bg-slate-200 dark:bg-slate-600 rounded" />
                                          <div className="h-8 bg-slate-200 dark:bg-slate-600 rounded" />
                                        </>
                                      )}
                                      {sectionId === 'guest' && (
                                        <>
                                          <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                            <CheckCircle2 size={16} className="text-green-600 dark:text-green-400" />
                                            <span className="text-sm text-green-800 dark:text-green-300">Fortsätt som gäst - Inget konto krävs</span>
                                          </div>
                                          <div className="flex items-center gap-2 mt-2">
                                            <div className="w-4 h-4 rounded border-2 border-slate-400" />
                                            <span className="text-xs text-slate-600 dark:text-slate-400">Spara mina uppgifter för nästa köp</span>
                                          </div>
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
                                                  return (
                                                    <Draggable key={opt.id} draggableId={opt.id} index={idx}>
                                                      {(provided) => (
                                                        <div
                                                          ref={provided.innerRef}
                                                          {...provided.draggableProps}
                                                          {...provided.dragHandleProps}
                                                          className="h-auto bg-slate-200 dark:bg-slate-600 rounded p-3 cursor-move"
                                                        >
                                                          <div className="flex items-center gap-2 mb-1">
                                                            <div className="w-4 h-4 rounded-full border-2 border-slate-400" />
                                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                              {opt.icon} {opt.name} - {opt.cost} kr
                                                            </span>
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
                                        </>
                                      )}
                                      {sectionId === 'payment' && (
                                        <>
                                          <div className="h-8 bg-slate-200 dark:bg-slate-600 rounded flex items-center px-3">
                                            <div className="w-4 h-4 rounded-full border-2 border-slate-400 mr-2" />
                                            <span className="text-sm text-slate-600 dark:text-slate-300">Klarna - Delbetalning</span>
                                          </div>
                                          <div className="h-8 bg-slate-200 dark:bg-slate-600 rounded flex items-center px-3">
                                            <div className="w-4 h-4 rounded-full border-2 border-slate-400 mr-2" />
                                            <span className="text-sm text-slate-600 dark:text-slate-300">Kort</span>
                                          </div>
                                        </>
                                      )}
                                      {sectionId === 'review' && (
                                        <>
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
            </div>
          </div>

          {/* Right: Control Panel with Tabs */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Control Panel</h2>
            </div>

            {/* Conversion Score - Always Visible */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-4">
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
                  <div className="text-xs text-slate-500 dark:text-slate-400">Beräknad AOV</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-slate-900 dark:text-slate-100">{calculateCLV()} kr</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Beräknad CLV</div>
                </div>
              </div>
            </div>

            {/* Combined Metrics - Conversion, AOV, CLV */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-4">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2 text-sm">
                <Info size={16} />
                Påverkansfaktorer (Konvertering)
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                <AnimatePresence>
                  {metrics.map((metric, index) => (
                    <motion.div
                      key={metric.label}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-700 text-xs"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-slate-900 dark:text-slate-100">{metric.label}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{metric.source}</div>
                      </div>
                      <div className={`flex items-center gap-1 font-semibold ${
                        metric.impact > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {metric.impact > 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                        {Math.abs(metric.impact)}%
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* AOV Metrics */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-4">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2 text-sm">
                <DollarSign size={16} />
                AOV-faktorer
              </h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                <AnimatePresence>
                  {aovMetrics.map((metric, index) => (
                    <motion.div
                      key={metric.label}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-xs"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-blue-900 dark:text-blue-100">{metric.label}</div>
                        <div className="text-xs text-blue-700 dark:text-blue-300">{metric.source}</div>
                      </div>
                      <div className={`flex items-center gap-1 font-semibold ${
                        metric.impact > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {metric.impact > 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                        {Math.abs(metric.impact)}%
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* CLV Metrics */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-4">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2 text-sm">
                <DollarSign size={16} />
                CLV-faktorer
              </h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                <AnimatePresence>
                  {clvMetrics.map((metric, index) => (
                    <motion.div
                      key={metric.label}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 text-xs"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-purple-900 dark:text-purple-100">{metric.label}</div>
                        <div className="text-xs text-purple-700 dark:text-purple-300">{metric.source}</div>
                      </div>
                      <div className={`flex items-center gap-1 font-semibold ${
                        metric.impact > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {metric.impact > 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                        {Math.abs(metric.impact)}%
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
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
              </div>

              <div className="p-4 max-h-[500px] overflow-y-auto">
                {activeTab === 'settings' && (
                  <div className="space-y-3">
                    <Toggle
                      label="Gästutcheckning"
                      description="Inget krav på att skapa konto"
                      checked={isGuestCheckout}
                      onChange={setIsGuestCheckout}
                    />
                    <Toggle
                      label="Adress-autofill"
                      description="Automatisk ifyllning av adresser"
                      checked={hasAutofill}
                      onChange={setHasAutofill}
                    />
                    <Toggle
                      label="Visa frakt tidigt"
                      description="Visa fraktkostnader direkt i kassan"
                      checked={shippingDisplayedEarly}
                      onChange={setShippingDisplayedEarly}
                    />
                    <Toggle
                      label="Post-purchase upsell"
                      description="Erbjud tilläggsprodukter efter köp"
                      checked={hasUpsell}
                      onChange={setHasUpsell}
                    />
                    <Toggle
                      label="Dölj header/footer"
                      description="Minimal UI för mindre distraktioner"
                      checked={hideHeaderFooter}
                      onChange={setHideHeaderFooter}
                    />
                    <Toggle
                      label="Fri frakt alltid"
                      description="Ingen fraktkostnad på alla order"
                      checked={freeShipping}
                      onChange={setFreeShipping}
                    />
                    <Toggle
                      label="Fri hemleverans"
                      description="Gratis hemleverans för kunder"
                      checked={freeHomeDelivery}
                      onChange={setFreeHomeDelivery}
                    />
                    <Toggle
                      label="Fri skåpsleverans"
                      description="Gratis leverans till paketskåp"
                      checked={freeLockerDelivery}
                      onChange={setFreeLockerDelivery}
                    />
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
                        onChange={(e) => setProductPrice(Number(e.target.value))}
                        className="w-full p-2 border border-slate-300 rounded-lg dark:border-slate-600 dark:bg-slate-700"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Checkout Provider
                      </label>
                      <select
                        value={selectedPlayer}
                        onChange={(e) => setSelectedPlayer(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg dark:border-slate-600 dark:bg-slate-700"
                      >
                        {players.map((p) => (
                          <option key={p.slug} value={p.slug}>
                            {p.name} (Trust: {p.conversionImpact}/10)
                          </option>
                        ))}
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
