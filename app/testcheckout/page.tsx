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
  Settings
} from 'lucide-react';

type CheckoutSection = {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
};

const SECTIONS: CheckoutSection[] = [
  { id: 'customer', title: 'Kunduppgifter', icon: <User size={20} />, description: 'Namn, e-post, adress' },
  { id: 'shipping', title: 'Leveransval', icon: <Truck size={20} />, description: 'Fraktalternativ och ombud' },
  { id: 'payment', title: 'Betalning', icon: <CreditCard size={20} />, description: 'Betalmetoder och kort' },
  { id: 'review', title: 'Orderöversikt', icon: <Package size={20} />, description: 'Sammanfattning av köp' },
];

export default function TestCheckoutPage() {
  const [layoutOrder, setLayoutOrder] = useState(['customer', 'shipping', 'payment', 'review']);
  const [hasAutofill, setHasAutofill] = useState(false);
  const [isGuestCheckout, setIsGuestCheckout] = useState(true);
  const [hasUpsell, setHasUpsell] = useState(false);
  const [shippingDisplayedEarly, setShippingDisplayedEarly] = useState(true);
  const [hideHeaderFooter, setHideHeaderFooter] = useState(false);

  const calculateConversionScore = () => {
    let score = 100; // Base score

    // Guest checkout impact (Baymard: forced account creation is top 3 reason for abandonment)
    if (!isGuestCheckout) {
      score -= 35;
    }

    // Autofill impact (reduces friction, especially on mobile)
    if (hasAutofill) {
      score += 12;
    }

    // Hidden shipping costs (biggest reason for cart abandonment)
    if (!shippingDisplayedEarly) {
      score -= 48;
    }

    // No header/footer (reduces distractions)
    if (hideHeaderFooter) {
      score += 10;
    }

    // Post-purchase upsell (increases AOV without hurting conversion)
    if (hasUpsell) {
      score += 5; // Small positive impact on conversion, +15% on AOV
    }

    // Layout order impact (payment before shipping = bad UX)
    const paymentIndex = layoutOrder.indexOf('payment');
    const shippingIndex = layoutOrder.indexOf('shipping');
    if (paymentIndex < shippingIndex) {
      score -= 5;
    }

    return Math.max(0, Math.min(100, score));
  };

  const getConversionMetrics = () => {
    const score = calculateConversionScore();
    const metrics = [];

    if (!isGuestCheckout) {
      metrics.push({ label: 'Tvingat konto', impact: -35, source: 'Baymard Institute' });
    }
    if (hasAutofill) {
      metrics.push({ label: 'Autofill', impact: 12, source: 'Nielsen Norman Group' });
    }
    if (!shippingDisplayedEarly) {
      metrics.push({ label: 'Dolda fraktkostnader', impact: -48, source: 'Baymard Institute' });
    }
    if (hideHeaderFooter) {
      metrics.push({ label: 'Minimal UI', impact: 10, source: 'CRO best practices' });
    }
    if (hasUpsell) {
      metrics.push({ label: 'Post-purchase upsell', impact: 5, source: 'E-commerce studies' });
    }

    const paymentIndex = layoutOrder.indexOf('payment');
    const shippingIndex = layoutOrder.indexOf('shipping');
    if (paymentIndex < shippingIndex) {
      metrics.push({ label: 'Betaling innan leverans', impact: -5, source: 'UX best practices' });
    }

    return metrics;
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(layoutOrder);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setLayoutOrder(items);
  };

  const conversionScore = calculateConversionScore();
  const metrics = getConversionMetrics();

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
                <Droppable droppableId="checkout-sections">
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
                                      {sectionId === 'shipping' && (
                                        <>
                                          <div className="h-8 bg-slate-200 dark:bg-slate-600 rounded flex items-center px-3">
                                            <div className="w-4 h-4 rounded-full border-2 border-slate-400 mr-2" />
                                            <span className="text-sm text-slate-600 dark:text-slate-300">PostNord - 49 kr</span>
                                          </div>
                                          <div className="h-8 bg-slate-200 dark:bg-slate-600 rounded flex items-center px-3">
                                            <div className="w-4 h-4 rounded-full border-2 border-slate-400 mr-2" />
                                            <span className="text-sm text-slate-600 dark:text-slate-300">DHL - 59 kr</span>
                                          </div>
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
                                          <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-3/4" />
                                          <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-1/2" />
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

          {/* Right: Control Panel */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Strategy Dashboard</h2>
            </div>

            {/* Conversion Score */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Gauge size={20} className="text-brand-600 dark:text-brand-400" />
                  <span className="font-semibold text-slate-900 dark:text-slate-100">Konverteringsscore</span>
                </div>
                <div className="text-4xl font-bold text-slate-900 dark:text-slate-100">{conversionScore}%</div>
              </div>

              {/* Gauge Chart */}
              <div className="relative h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${conversionScore}%` }}
                  transition={{ duration: 0.5 }}
                  className={`h-full rounded-full ${
                    conversionScore >= 70 ? 'bg-green-500' : conversionScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                />
              </div>

              <div className="text-sm text-slate-600 dark:text-slate-400">
                {conversionScore >= 70 ? 'Optimerad för hög konvertering' : conversionScore >= 40 ? 'Medel konvertering' : 'Låg konvertering - förbättringar behövs'}
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                <Info size={18} />
                Påverkansfaktorer
              </h3>
              <div className="space-y-3">
                <AnimatePresence>
                  {metrics.map((metric, index) => (
                    <motion.div
                      key={metric.label}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-slate-900 dark:text-slate-100">{metric.label}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{metric.source}</div>
                      </div>
                      <div className={`flex items-center gap-1 font-semibold ${
                        metric.impact > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {metric.impact > 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                        {Math.abs(metric.impact)}%
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Control Toggles */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Inställningar</h3>
              <div className="space-y-4">
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
