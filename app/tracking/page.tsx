'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Truck,
  Package,
  MapPin,
  Clock,
  CheckCircle2,
  QrCode,
  KeyRound,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  ShoppingBag,
  Bell,
  Check
} from 'lucide-react';

interface TrackingOrder {
  trackingId: string;
  orderNumber: string;
  carrier: 'instabox' | 'budbee' | 'postnord' | 'earlybird';
  carrierName: string;
  carrierLogoColor: string;
  status: 'packed' | 'in_transit' | 'out_for_delivery' | 'delivered';
  estimatedDelivery: string;
  destination: string;
  recipientName: string;
  phoneMasked: string;
  pinCode?: string;
  lockerName?: string;
  courierNotes?: string;
  items: Array<{ name: string; qty: number; price: number; image: string }>;
  timeline: Array<{ title: string; time: string; done: boolean; description: string }>;
}

const DEMO_ORDERS: Record<string, TrackingOrder> = {
  'INSTA-4819': {
    trackingId: 'INSTA-4819',
    orderNumber: 'ORD-98214',
    carrier: 'instabox',
    carrierName: 'Instabox Paketbox',
    carrierLogoColor: 'bg-rose-500 text-white',
    status: 'out_for_delivery',
    estimatedDelivery: 'Idag, kl 16:30 – 17:15',
    destination: 'Hemköp City, Klarabergsgatan 50, Stockholm',
    recipientName: 'Johan Andersson',
    phoneMasked: '070-*** ** 89',
    pinCode: '7429',
    lockerName: 'Box 14 (Lucka öppnas via PIN)',
    items: [
      { name: 'Ergonomiskt Trådlöst Tangentbord', qty: 1, price: 899, image: '⌨️' },
      { name: 'USB-C Laddkabel 2m Flätad', qty: 1, price: 199, image: '🔌' }
    ],
    timeline: [
      { title: 'Order lagd & bekräftad', time: 'Igår 21:14', done: true, description: 'Betalning registrerad via Klarna.' },
      { title: 'Plockad & packad på centrallager', time: 'Idag 07:45', done: true, description: 'Skannad vid packstation #4 i Jönköping.' },
      { title: 'Sorterad vid distributionshubb', time: 'Idag 12:30', done: true, description: 'Ankommit till terminal Stockholm Väst.' },
      { title: 'Ute för leverans med bil', time: 'Idag 15:10', done: true, description: 'Chauffören kör nu rutt mot ditt utlämningsställe.' },
      { title: 'Levererad i paketskåp', time: 'Beräknat 16:45', done: false, description: 'SMS skickas med bekräftelse när skåpet är laddat.' }
    ]
  },
  'BUD-9912': {
    trackingId: 'BUD-9912',
    orderNumber: 'ORD-98255',
    carrier: 'budbee',
    carrierName: 'Budbee Hemleverans',
    carrierLogoColor: 'bg-emerald-500 text-white',
    status: 'in_transit',
    estimatedDelivery: 'Ikväll kl 18:00 – 21:00',
    destination: 'Vasagatan 12, lgh 1204, Stockholm',
    recipientName: 'Sara Lindqvist',
    phoneMasked: '073-*** ** 12',
    courierNotes: 'Ring på porttelefon (kod 4912) eller lämna utanför dörren.',
    items: [
      { name: 'Ekologiskt Kaffe Hela Bönor 1kg', qty: 2, price: 249, image: '☕' },
      { name: 'Kaffekvarn Rostfritt Stål', qty: 1, price: 699, image: '⚙️' }
    ],
    timeline: [
      { title: 'Order bekräftad', time: 'Igår 18:30', done: true, description: 'Order lagd med Budbee Grön Leverans.' },
      { title: 'Skickad från lager', time: 'Idag 08:15', done: true, description: 'Fossilfri transport från lager.' },
      { title: 'På väg till närområde', time: 'Idag 14:00', done: true, description: 'Paketet är nu på distributionscentralen.' },
      { title: 'Budet börjar köra', time: 'Beräknat 17:30', done: false, description: 'Live-karta aktiveras när budet är på väg.' },
      { title: 'Levererad till dörren', time: 'Beräknat 19:15', done: false, description: 'Foto tas vid dörren som kvitto.' }
    ]
  },
  'POST-1029': {
    trackingId: 'POST-1029',
    orderNumber: 'ORD-98102',
    carrier: 'postnord',
    carrierName: 'PostNord Ombud',
    carrierLogoColor: 'bg-sky-500 text-white',
    status: 'delivered',
    estimatedDelivery: 'Levererad igår kl 14:20',
    destination: 'ICA Kvantum, Malmö',
    recipientName: 'Erik Bergström',
    phoneMasked: '076-*** ** 55',
    items: [
      { name: 'Löparskor Trail Pro 42', qty: 1, price: 1490, image: '👟' }
    ],
    timeline: [
      { title: 'Order lagd', time: 'Mån 10:15', done: true, description: 'Bekräftad med Swish.' },
      { title: 'Skickad med PostNord', time: 'Tis 11:00', done: true, description: 'Kollinr registrerat.' },
      { title: 'Anlänt till ombud', time: 'Ons 14:20', done: true, description: 'Hämtas ut med legitimation eller BankID.' },
      { title: 'Uthämtat av kund', time: 'Ons 17:40', done: true, description: 'Signerat och klart.' }
    ]
  }
};

export default function TrackingPage() {
  const [searchInput, setSearchInput] = useState('INSTA-4819');
  const [activeTrackingId, setActiveTrackingId] = useState('INSTA-4819');
  const [returnRequested, setReturnRequested] = useState(false);
  const [smsNotificationActive, setSmsNotificationActive] = useState(true);

  const order = DEMO_ORDERS[activeTrackingId] || DEMO_ORDERS['INSTA-4819'];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchInput.trim().toUpperCase();
    if (DEMO_ORDERS[clean]) {
      setActiveTrackingId(clean);
    } else {
      setActiveTrackingId('INSTA-4819');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
              <Truck size={14} /> Live Paketspårning & Delivery Experience
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Spåra din leverans
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Följ paketet i realtid från lagerhylla till dörrmatta eller paketskåp.
            </p>
          </div>

          <Link
            href="/testcheckout"
            className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium bg-slate-900 px-3 py-2 rounded-lg border border-slate-800 transition"
          >
            ← Testa Kassan i CheckoutLab
          </Link>
        </div>

        {/* Sökfält & demo-knappar */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 mb-8 shadow-xl">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Package className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Skriv spårnings-ID (t.ex. INSTA-4819, BUD-9912)"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl text-sm transition shadow-md shadow-indigo-600/20 whitespace-nowrap"
            >
              Hämta status
            </button>
          </form>

          {/* Snabblänkar för demo */}
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-slate-800 text-xs">
            <span className="text-slate-500">Testa demo-paket:</span>
            {Object.keys(DEMO_ORDERS).map((id) => (
              <button
                key={id}
                onClick={() => {
                  setSearchInput(id);
                  setActiveTrackingId(id);
                }}
                className={`px-2.5 py-1 rounded-md border font-mono transition ${
                  activeTrackingId === id
                    ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/50'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                {id} ({DEMO_ORDERS[id].carrierName.split(' ')[0]})
              </button>
            ))}
          </div>
        </div>

        {/* Huvudkort: Leveransstatus */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl mb-8 relative overflow-hidden">
          {/* Status Badge & Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
            <div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${order.carrierLogoColor}`}>
                  {order.carrierName}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Kollinr: {order.trackingId}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white mt-2">
                {order.status === 'out_for_delivery' && 'Paketet är på väg till paketskåpet!'}
                {order.status === 'in_transit' && 'Paketet transporteras mot din stad'}
                {order.status === 'delivered' && 'Paketet är levererat och kvitterat'}
                {order.status === 'packed' && 'Paketet har packats och inväntar upphämtning'}
              </h2>
              <div className="flex items-center gap-2 text-sm text-emerald-400 font-medium mt-1">
                <Clock size={16} /> Beräknad tid: {order.estimatedDelivery}
              </div>
            </div>

            {/* PIN-kod ruta om paketskåp finns */}
            {order.pinCode && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl text-center sm:text-right shrink-0">
                <span className="text-xs text-emerald-300 block font-medium">Hämtkod till skåpet</span>
                <span className="text-3xl font-black font-mono text-emerald-400 tracking-widest block my-0.5">
                  {order.pinCode}
                </span>
                <span className="text-[11px] text-slate-400 block">{order.lockerName}</span>
              </div>
            )}
          </div>

          {/* Destinationsdetaljer & mottagare */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-5 border-b border-slate-800 text-xs text-slate-300">
            <div className="flex items-start gap-2.5">
              <MapPin className="text-rose-400 shrink-0 mt-0.5" size={16} />
              <div>
                <span className="text-slate-500 block uppercase tracking-wider font-semibold">Leveransadress</span>
                <span className="font-medium text-white text-sm">{order.destination}</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="text-indigo-400 shrink-0 mt-0.5" size={16} />
              <div>
                <span className="text-slate-500 block uppercase tracking-wider font-semibold">Mottagare & Kontakt</span>
                <span className="font-medium text-white text-sm">{order.recipientName} ({order.phoneMasked})</span>
              </div>
            </div>
          </div>

          {/* Tidslinje / Steg */}
          <div className="py-6">
            <h3 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-4">
              Leveransens händelselogg
            </h3>
            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
              {order.timeline.map((step, idx) => (
                <div key={idx} className="relative group">
                  <div
                    className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center transition ${
                      step.done
                        ? 'bg-emerald-500 border-emerald-400 text-white'
                        : 'bg-slate-900 border-slate-700'
                    }`}
                  >
                    {step.done && <Check size={10} strokeWidth={3} />}
                  </div>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className={`text-sm font-semibold ${step.done ? 'text-white' : 'text-slate-500'}`}>
                      {step.title}
                    </span>
                    <span className="text-xs font-mono text-slate-500 shrink-0">{step.time}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Varor i paketet */}
          <div className="pt-6 border-t border-slate-800">
            <h3 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-3">
              Innehåll i försändelsen ({order.orderNumber})
            </h3>
            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-2 bg-slate-900 rounded-lg">{item.image}</span>
                    <div>
                      <span className="text-sm font-semibold text-white block">{item.name}</span>
                      <span className="text-xs text-slate-500">Antal: {item.qty} st</span>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-white">{item.price * item.qty} kr</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Post-Purchase CRO & Returportal Modul */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Instant Retur / Byte */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 text-indigo-400 mb-3">
              <RotateCcw size={22} />
              <h3 className="text-lg font-bold text-white">Retur eller Instant Byte?</h3>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-5">
              Passade inte storleken eller var något trasigt? Byt vara med ett klick utan att behöva skriva ut retursedel.
            </p>

            {returnRequested ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center animate-in fade-in">
                <CheckCircle2 className="mx-auto text-emerald-400 mb-2" size={28} />
                <span className="text-sm font-bold text-white block">Digital returkod genererad!</span>
                <p className="text-xs text-emerald-200 mt-1">
                  Visa upp QR-kod #RET-992 hos ombudet eller välj &quot;Lämna retur i skåp&quot;. Ingen skrivare behövs.
                </p>
              </div>
            ) : (
              <button
                onClick={() => setReturnRequested(true)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 px-4 rounded-xl text-sm border border-slate-700 transition flex items-center justify-center gap-2"
              >
                <QrCode size={16} /> Starta retur utan skrivare (QR)
              </button>
            )}
          </div>

          {/* SMS & Notis-preferenser */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 text-amber-400 mb-3">
              <Bell size={22} />
              <h3 className="text-lg font-bold text-white">Aviseringar & Budinstruktion</h3>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Vill du ha SMS precis när paketet når skåpet eller ska budet ringa på dörren?
            </p>

            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2.5 p-2.5 bg-slate-950 rounded-lg border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={smsNotificationActive}
                  onChange={(e) => setSmsNotificationActive(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-slate-300">Skicka SMS-avisering med hämtkod till {order.phoneMasked}</span>
              </label>

              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-slate-400">
                <span className="text-slate-500 block text-[11px] font-semibold uppercase">Budmeddelande:</span>
                &ldquo;{order.courierNotes || 'Standardleverans till angiven destination'}&rdquo;
              </div>
            </div>
          </div>
        </div>

        {/* Pedagogisk CRO-insikt för e-handlaren */}
        <div className="bg-indigo-950/40 border border-indigo-800/40 rounded-2xl p-6 text-xs text-slate-300">
          <div className="flex items-center gap-2 text-indigo-400 font-bold mb-1">
            <Sparkles size={16} /> CRO-insikt: Tracking-sidan är din mest besökta e-postdestination
          </div>
          <p className="leading-relaxed">
            I genomsnitt besöker en svensk e-handelskund spårningssidan <strong>3,4 gånger</strong> per order. Genom att erbjuda en varumärkt trackingsida istället för att skicka kunden till en anonym transportörsida behåller du trafiken, sänker WISMO-samtal (Where Is My Order) med 42 % och skapar en naturlig arena för post-purchase lojalitet.
          </p>
        </div>
      </div>
    </div>
  );
}
