'use client';

import React, { useState, useEffect } from 'react';
import {
  Heart,
  DollarSign,
  Repeat,
  ArrowRight,
  CheckCircle,
  RotateCcw,
  AlertTriangle,
  Monitor,
  Tv,
  Volume2,
  VolumeX,
  Sparkles,
  Play,
  Scissors
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';

// --- LJUDEFFEKTER VIA WEB AUDIO API ---
function playRetroBeep(type: 'click' | 'success' | 'fail' | 'start') {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === 'click') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(800, now);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'success') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'fail') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.setValueAtTime(160, now + 0.12);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'start') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(880, now + 0.1);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    }
  } catch {
    // ignorera om audio är blockerat
  }
}

export interface GameChoice {
  text: string;
  impact: { patience: number; margin: number; clv: number };
  feedback: string;
}

export interface GameScene {
  id: number;
  title: string;
  stage: string;
  scenario: string;
  choices: GameChoice[];
}

export interface GameCase {
  id: string;
  badge: string;
  title: string;
  difficulty: string;
  persona: string;
  context: string;
  initialStats: { patience: number; margin: number; clv: number };
  scenes: GameScene[];
}

// 6 REALISTISKA E-HANDELSCASE (SVENSKA OCH ENGELSKA)
function getGameCases(isEnglish: boolean): GameCase[] {
  if (isEnglish) {
    return [
      {
        id: 'parent',
        badge: 'B2C • Express & Urgency',
        title: 'The Stressed Working Parent',
        difficulty: 'Medium',
        persona: 'Sarah, 34 • Commuting during rush hour',
        context: 'It is 2:30 PM on Thursday. Sarah is on the bus with 8% phone battery frantically searching for a birthday gift for tomorrow morning at 11:00 AM.',
        initialStats: { patience: 80, margin: 50, clv: 25 },
        scenes: [
          {
            id: 1,
            title: 'Product Page (PDP Urgency)',
            stage: 'Step 1 of 3: Purchase Intent',
            scenario: 'Sarah found the perfect toy for $35. The warehouse cut-off is approaching in 30 minutes. How do you convince her to add it to the cart immediately without hesitation?',
            choices: [
              {
                text: 'Display a large generic "Eco-Friendly Packaging" badge next to the price.',
                impact: { patience: -15, margin: 0, clv: 0 },
                feedback: 'Wrong priority! She is in a rush and urgently needs certainty on delivery date, not generic badges. Patience drops.'
              },
              {
                text: 'Add a live countdown: "Order within 28 mins for guaranteed arrival tomorrow Friday by 10:00 AM".',
                impact: { patience: +20, margin: -5, clv: +15 },
                feedback: 'Spot on! You eliminated her #1 anxiety (will it arrive in time?). Concrete delivery guarantees trigger immediate checkout.'
              }
            ]
          },
          {
            id: 2,
            title: 'Checkout Architecture (Friction)',
            stage: 'Step 2 of 3: Conversion',
            scenario: 'Sarah opens the checkout on her phone with 4% battery left. How do you structure the checkout to prevent cart abandonment?',
            choices: [
              {
                text: 'Require account creation with a password before proceeding, offering a 10% coupon.',
                impact: { patience: -45, margin: -10, clv: 0 },
                feedback: 'Disaster! Forced account creation is the #2 reason for cart abandonment according to Baymard Institute. She immediately leaves.'
              },
              {
                text: 'Hide shipping fees until the very last step to keep the initial form simple.',
                impact: { patience: -50, margin: +10, clv: -20 },
                feedback: 'Ouch! Surprise shipping fees at the final confirmation step trigger acute anxiety and immediate bounce.'
              },
              {
                text: 'Enable 1-Click Autofill, Apple Pay / Swish, and show Instabox / Parcel Locker nearby for $3.90.',
                impact: { patience: +25, margin: +10, clv: +20 },
                feedback: 'Masterclass! Speed and upfront pricing won the order. You saved 45 seconds of typing and secured a profitable order.'
              }
            ]
          },
          {
            id: 3,
            title: 'Post-Purchase & Returns (CLV)',
            stage: 'Step 3 of 3: Loyalty & Retention',
            scenario: 'The party went well, but one part of the toy was broken inside the box. She lands on your return page upset. How do you respond?',
            choices: [
              {
                text: 'Direct her to print a PDF return label on a home printer and post it for standard refund.',
                impact: { patience: -25, margin: -30, clv: -20 },
                feedback: 'She has no printer at home! Friction leads to a 1-star Trustpilot review and zero repeat purchases.'
              },
              {
                text: 'Offer "Instant Exchange": Dispatch a replacement today and issue a paperless QR code for locker drop-off.',
                impact: { patience: +40, margin: +15, clv: +40 },
                feedback: 'Brilliant! You turned a stressful return into a customer-for-life moment with zero printer friction.'
              }
            ]
          }
        ]
      },
      {
        id: 'b2b',
        badge: 'B2B • Corporate Checkout & Invoice',
        title: 'The Architecture Firm Corporate Buyer',
        difficulty: 'High Margin',
        persona: 'Frederic, Office Manager • Ordering 12 task chairs ($6,400)',
        context: 'It is 4:40 PM on Friday. The quarterly capital budget closes at 5:00 PM and Frederic must commit $6,400 before funds expire.',
        initialStats: { patience: 75, margin: 60, clv: 30 },
        scenes: [
          {
            id: 1,
            title: 'B2B Pricing & VAT Presentation',
            stage: 'Step 1 of 3: B2B Pricing Clarity',
            scenario: 'Frederic arrives at the cart with 12 chairs. How do you present the pricing?',
            choices: [
              {
                text: 'Show all prices inclusive of VAT and make him calculate net expenses manually.',
                impact: { patience: -20, margin: 0, clv: -5 },
                feedback: 'Friction! B2B purchasers budget strictly excluding VAT. Missing a clean VAT switch creates unnecessary mental effort.'
              },
              {
                text: 'Provide a crisp "Business (Excl. VAT)" toggle and auto-lookup company name via Corporate ID.',
                impact: { patience: +25, margin: +5, clv: +25 },
                feedback: 'Ergonomic B2B checkout! In one click, creditworthiness and official registered address are loaded instantly.'
              }
            ]
          },
          {
            id: 2,
            title: 'Payment Terms for Large Orders',
            stage: 'Step 2 of 3: High-Ticket Payment',
            scenario: 'Frederic must pay $6,400. His corporate debit card has a $2,000 daily limit and the CFO has left for the weekend. What payment method saves the sale?',
            choices: [
              {
                text: 'Require instant credit card checkout or wire transfer before shipment.',
                impact: { patience: -55, margin: 0, clv: -30 },
                feedback: 'Cart abandoned! Frederic cannot front $6,400 on his private card. He buys from a competitor offering 30-day corporate invoice.'
              },
              {
                text: 'Offer 30-Day B2B E-Invoice (Peppol / PDF) with instant digital company risk check.',
                impact: { patience: +35, margin: +15, clv: +35 },
                feedback: 'Win! The $6,400 order is authorized in 4 seconds. Frederic avoids personal expense and becomes a key recurring account.'
              }
            ]
          },
          {
            id: 3,
            title: 'B2B Freight & White-Glove Delivery',
            stage: 'Step 3 of 3: Last Mile Logistics',
            scenario: '12 chairs packed on two wooden Euro pallets must reach an office in a congested city center. How do you schedule delivery?',
            choices: [
              {
                text: 'Ship via standard courier drop-off to the nearest neighborhood convenience store parcel agent.',
                impact: { patience: -45, margin: -10, clv: -40 },
                feedback: 'Catastrophe! The corner store refuses two heavy wooden pallets. The freight is returned and customer support is overwhelmed.'
              },
              {
                text: 'Schedule dedicated B2B Business Freight with tail-lift, 30-min phone call alert, and carry-in to floor 3.',
                impact: { patience: +30, margin: +10, clv: +30 },
                feedback: 'Flawless execution! Delivery goes smoothly without disrupting office hours. They recommend you to neighboring firms.'
              }
            ]
          }
        ]
      },
      {
        id: 'genz',
        badge: 'Mobile First • Social Commerce',
        title: 'The Gen Z TikTok Trend Hunter',
        difficulty: 'Fast-Paced',
        persona: 'Liam, 20 • Clicked a viral streetwear video',
        context: 'Liam saw a viral limited-edition hoodie for $49. He is riding the metro with 3% phone battery remaining.',
        initialStats: { patience: 90, margin: 40, clv: 20 },
        scenes: [
          {
            id: 1,
            title: 'Social Traffic Landing Experience',
            stage: 'Step 1 of 3: Bounce Protection',
            scenario: 'Liam lands on your store from TikTok. How do you keep him from bouncing immediately?',
            choices: [
              {
                text: 'Cover the entire screen with an aggressive modal: "Join our newsletter for 10% off!".',
                impact: { patience: -40, margin: 0, clv: -10 },
                feedback: 'Immediate bounce! Gen Z mobile users despise intrusive popups blocking the screen. He exits in 1.2 seconds.'
              },
              {
                text: 'Display the hoodie with high-res imagery, quick size picker, and a sticky "Apple Pay / Express Buy" button.',
                impact: { patience: +20, margin: +5, clv: +15 },
                feedback: 'Clean experience! Zero distractions. Liam sees the item, chooses his size, and clicks directly to express checkout.'
              }
            ]
          },
          {
            id: 2,
            title: 'Mobile Checkout Flow',
            stage: 'Step 2 of 3: Express Checkout',
            scenario: 'The train is approaching an underground tunnel with zero cellular reception. How do you handle payment?',
            choices: [
              {
                text: 'Ask him to manually type his 16-digit plastic credit card, expiration date, and CVV code.',
                impact: { patience: -50, margin: 0, clv: -20 },
                feedback: 'Nobody pulls out a plastic credit card on a crowded subway train! Order abandoned.'
              },
              {
                text: 'Offer Apple Pay / Google Pay / Swish triggered in 1-click via FaceID biometric scan.',
                impact: { patience: +30, margin: +10, clv: +25 },
                feedback: 'Lightning conversion! The order was completed in under 5 seconds before the subway entered the tunnel.'
              }
            ]
          },
          {
            id: 3,
            title: 'Delivery for Urban Shoppers',
            stage: 'Step 3 of 3: Urban Pickup',
            scenario: 'Where does Liam want his package delivered?',
            choices: [
              {
                text: 'Post office counter open only 9:00 AM – 5:00 PM located 2.5 km away.',
                impact: { patience: -30, margin: 0, clv: -15 },
                feedback: 'He has no car and cannot make the post office opening hours. Collection is delayed a week.'
              },
              {
                text: '24/7 Smart locker in his metro station subway entrance opened via digital PIN code.',
                impact: { patience: +35, margin: +5, clv: +30 },
                feedback: 'Perfect fit! Liam grabs his parcel on his way home from the gym with zero waiting in line.'
              }
            ]
          }
        ]
      },
      {
        id: 'premium',
        badge: 'High-Ticket • Trust & Security',
        title: 'The Skeptical High-Ticket Buyer',
        difficulty: 'High Stakes',
        persona: 'Henry, 58 • Buying an Italian espresso machine ($2,250)',
        context: 'Henry was scammed by a fake webshop two years ago and is on high alert for any signal of insecurity or illegitimacy.',
        initialStats: { patience: 70, margin: 70, clv: 35 },
        scenes: [
          {
            id: 1,
            title: 'Trust Signals on the Product Page',
            stage: 'Step 1 of 3: Anxiety Reduction',
            scenario: 'Henry evaluates the $2,250 espresso machine. What builds the highest level of authentic trust?',
            choices: [
              {
                text: 'Flashing countdown banner: "Only 1 left in stock! 18 people looking right now! Hurry up!"',
                impact: { patience: -35, margin: 0, clv: -25 },
                feedback: 'Henry recognizes fabricated fake scarcity instantly. He suspects a scam and closes the tab.'
              },
              {
                text: 'Show verified Trustpilot score (4.9/5), "Authorized Distributor" badge, and 5-Year official warranty.',
                impact: { patience: +25, margin: +5, clv: +25 },
                feedback: 'LIFT Model in action: Anxiety is crushed by authentic authorized guarantees and verifiable third-party reviews.'
              }
            ]
          },
          {
            id: 2,
            title: 'Payment Security for High-Ticket Orders',
            stage: 'Step 2 of 3: Buyer Protection',
            scenario: 'Henry reaches the $2,250 checkout. How do you structure the payment options?',
            choices: [
              {
                text: 'Only offer direct wire transfer with an upfront 3% discount.',
                impact: { patience: -60, margin: 0, clv: -40 },
                feedback: 'Alarm bells! Demanding wire transfers on a $2,250 order is a classic scam pattern. Henry flees.'
              },
              {
                text: 'Offer "Receive First, Pay in 30 Days" invoice (Klarna / Walley) backed by comprehensive buyer protection.',
                impact: { patience: +35, margin: +15, clv: +30 },
                feedback: 'Ultimate reassurance! Henry knows he pays zero dollars until the machine is safely unboxed on his counter.'
              }
            ]
          },
          {
            id: 3,
            title: 'High-Value Fragile Logistics',
            stage: 'Step 3 of 3: Premium Handling',
            scenario: 'The espresso machine weighs 28 kg and has polished Italian mirror stainless steel. How do you deliver it?',
            choices: [
              {
                text: 'Economy parcel dropped over his garden fence without requiring a signature.',
                impact: { patience: -50, margin: -30, clv: -50 },
                feedback: 'A $2,250 machine left in the rain without signature? Customer is furious, damages occur, and brand reputation is destroyed.'
              },
              {
                text: 'Insured White-Glove delivery with evening time slot, ID verification, and scheduled doorstep delivery.',
                impact: { patience: +30, margin: +10, clv: +35 },
                feedback: 'Superb! Pristine delivery reinforces the premium purchase, yielding high CLV and word-of-mouth referrals.'
              }
            ]
          }
        ]
      },
      {
        id: 'nordic',
        badge: 'Cross-Border • Nordic Commerce',
        title: 'The Cross-Border Nordic Customer',
        difficulty: 'Tax & Currency',
        persona: 'Astrid, 41 • Shopping from Oslo, Norway in a Swedish shop',
        context: 'Astrid is buying Scandinavian design homeware ($180). Norway is outside the EU, and she has suffered surprise customs tax bills in the past.',
        initialStats: { patience: 75, margin: 55, clv: 30 },
        scenes: [
          {
            id: 1,
            title: 'Local Currency & Landed Cost',
            stage: 'Step 1 of 3: Currency Transparency',
            scenario: 'Astrid lands on the checkout from Oslo. How do you display prices and customs duties?',
            choices: [
              {
                text: 'Force prices in Swedish Kronor (SEK) and write a tiny note: "Recipient is responsible for import VAT & customs".',
                impact: { patience: -40, margin: 0, clv: -25 },
                feedback: 'Immediate bounce! Norwegian shoppers fear surprise Posten import fees ($40+). Vague customs notices kill cross-border conversion.'
              },
              {
                text: 'Display Norwegian Krone (NOK), VOEC-registered badge, and explicit text: "All Norwegian MVA included – No surprise fees".',
                impact: { patience: +30, margin: +10, clv: +25 },
                feedback: 'Flawless VOEC execution! Displaying fully landed costs in local currency crushes cross-border anxiety.'
              }
            ]
          },
          {
            id: 2,
            title: 'Nordic Payment Localization',
            stage: 'Step 2 of 3: Local Payment Trust',
            scenario: 'Astrid is ready to check out. Which payment methods do you prioritize?',
            choices: [
              {
                text: 'Only offer Swedish Swish and standard European SEPA wire transfer.',
                impact: { patience: -45, margin: 0, clv: -30 },
                feedback: 'Swish is unusable for Norwegian customers who use Vipps! Order cannot be completed.'
              },
              {
                text: 'Dynamically show Vipps (Norway), Klarna invoice in NOK, and local debit card verification.',
                impact: { patience: +30, margin: +10, clv: +25 },
                feedback: 'Conversion champion! Astrid completes payment in 4 seconds using Vipps on her phone.'
              }
            ]
          },
          {
            id: 3,
            title: 'Cross-Border Courier Selection',
            stage: 'Step 3 of 3: Regional Carrier Trust',
            scenario: 'Which shipping carrier delivers to Astrid in Oslo?',
            choices: [
              {
                text: 'Cheapest budget postal surface mail with untracked 7–14 day transit.',
                impact: { patience: -35, margin: -10, clv: -20 },
                feedback: 'WISMO overload! She contacts customer support three times wondering where her parcel is.'
              },
              {
                text: 'PostNord / Bring with 2-day transit, digital tracking, and pickup at Kiwi supermarket.',
                impact: { patience: +25, margin: +5, clv: +25 },
                feedback: 'Great regional delivery! Bring is the most trusted carrier in Norway, giving Astrid full confidence.'
              }
            ]
          }
        ]
      },
      {
        id: 'subscription',
        badge: 'D2C • Subscription & CLV',
        title: 'The Recurring Coffee Club Subscriber',
        difficulty: 'High CLV',
        persona: 'Marcus, 29 • Exploring specialty coffee beans',
        context: 'Marcus wants to purchase 1 kg of whole coffee beans. You want to turn this single $25 order into a $300 annual recurring subscription.',
        initialStats: { patience: 80, margin: 45, clv: 25 },
        scenes: [
          {
            id: 1,
            title: 'One-Time vs Subscription Architecture',
            stage: 'Step 1 of 3: Value Proposition',
            scenario: 'Marcus is on the product page. How do you present the subscription choice?',
            choices: [
              {
                text: 'Pre-select subscription by default with a hidden 12-month lock-in agreement.',
                impact: { patience: -50, margin: 0, clv: -40 },
                feedback: 'Dark pattern! Marcus feels manipulated when he spots the hidden trap. He leaves and reports the store to consumer groups.'
              },
              {
                text: 'Offer clear toggle: "One-time $25" vs "Subscribe & Save 15% ($21.25) • Pause, skip or cancel anytime in 1 click".',
                impact: { patience: +25, margin: +5, clv: +35 },
                feedback: 'Empirical CRO best practice! Transparency and self-service flexibility eliminate commitment anxiety, boosting subscription adoption by 40%.'
              }
            ]
          },
          {
            id: 2,
            title: 'Post-Purchase Membership Activation',
            stage: 'Step 2 of 3: Account Creation Timing',
            scenario: 'Marcus paid as a guest to avoid checkout friction. How do you convert him into a member on the tracking page?',
            choices: [
              {
                text: 'Send an email demanding a complex 12-character password before his order can ship.',
                impact: { patience: -30, margin: -10, clv: -15 },
                feedback: 'Forced friction post-purchase! He ignores the email and remains an unsegmented guest.'
              },
              {
                text: 'On the branded tracking page, offer 1-click "Save this order & unlock free shipping on next roast with 1 click".',
                impact: { patience: +30, margin: +10, clv: +30 },
                feedback: 'Effortless conversion! Because he is relaxed post-purchase, 35% of guests accept and join the loyalty club.'
              }
            ]
          },
          {
            id: 3,
            title: 'Retention & Unboxing Bounce-Back',
            stage: 'Step 3 of 3: Second Purchase Velocity',
            scenario: 'Marcus receives his package. How do you optimize the delivery moment for repeat purchase?',
            choices: [
              {
                text: 'Enclose a generic paper flyer advertising products he has no interest in.',
                impact: { patience: -10, margin: -5, clv: 0 },
                feedback: 'Straight to the recycling bin. Zero digital attribution and zero repeat sales.'
              },
              {
                text: 'Trigger delivery SMS with QR code for 20% off complementary bean grinder + AmbassadorFlow referral link ($15 store credit).',
                impact: { patience: +35, margin: +15, clv: +45 },
                feedback: 'Viral repeat loop! Marcus orders the grinder within 48 hours and shares his referral link with three colleagues.'
              }
            ]
          }
        ]
      }
    ];
  }

  // SVENSKA FALL
  return [
    {
      id: 'parent',
      badge: 'B2C • Express & Urgency',
      title: 'Den stressade småbarnsföräldern',
      difficulty: 'Normal',
      persona: 'Johanna, 34 år • På väg hem i rusningstrafik',
      context: 'Klockan är 14:30 på en torsdag. Kunden sitter på bussen med 8% batteri och letar frenetiskt efter en present till ett barnkalas imorgon kl 11:00.',
      initialStats: { patience: 80, margin: 50, clv: 25 },
      scenes: [
        {
          id: 1,
          title: 'Produktsidan (PDP)',
          stage: 'Steg 1 av 3: Köpintention',
          scenario: 'Kunden har hittat rätt leksak för 349 kr. Tiden tickar snabbt mot lagrets cut-off. Hur får du kunden att sluta tveka och trycka på "Lägg i varukorg"?',
          choices: [
            {
              text: 'Visa en stor grön "Eco-friendly"-badge bredvid priset.',
              impact: { patience: -15, margin: 0, clv: 0 },
              feedback: 'Fel fokus! Kunden har bråttom och letar efter trygghet kring exakt leveransdag, inte generella hållbarhetsmärken just nu. Tålamodet sjunker.'
            },
            {
              text: 'Lägg till en röd nedräkning: "Beställ inom 28 min för garanterad leverans imorgon fredag kl 10:00".',
              impact: { patience: +20, margin: -5, clv: +15 },
              feedback: 'Perfekt! Du raderar kundens största ångest (hinner paketet fram?). Exakt logistiklöfte driver add-to-cart direkt, även om expressleverans kostar lite marginal.'
            }
          ]
        },
        {
          id: 2,
          title: 'Kassan (Checkout Architecture)',
          stage: 'Steg 2 av 3: Konvertering',
          scenario: 'Kunden klickar sig till kassan på mobilen med 4% batteri kvar. Hur designar du kassaflödet för att undvika avhopp?',
          choices: [
            {
              text: 'Kräv att kunden skapar ett kundkonto med lösenord för att få 10% välkomstrabatt.',
              impact: { patience: -45, margin: -10, clv: 0 },
              feedback: 'Katastrof! Forced Account (tvingande konto) på en stressad mobilkund leder till omedelbart avhopp. Baymard Institute visar att detta är orsak #2 till att kunder lämnar kassan.'
            },
            {
              text: 'Dölj fraktkostnaden tills kunden skrivit in hela sin gatuadress för att "hålla kassan ren".',
              impact: { patience: -50, margin: +10, clv: -20 },
              feedback: 'Aj! Dolda fraktavgifter som dyker upp som en överraskning i sista steget dödar köpsuget direkt. Kunden känner sig lurad och studsar.'
            },
            {
              text: 'Aktivera 1-klick Autofill och visa direkt att Instabox Paketskåp vid förskolan kostar 39 kr.',
              impact: { patience: +25, margin: +10, clv: +20 },
              feedback: 'Mästarklass! Transparens och snabbhet (autofill) vinner alltid. Du sparar kunden 45 sekunders inmatningstid och tjänar pengar på frakten.'
            }
          ]
        },
        {
          id: 3,
          title: 'Efterköp & Retur (Post-Purchase CLV)',
          stage: 'Steg 3 av 3: Lojalitet & Retur',
          scenario: 'Kalaset är över, men en del i leksaken var defekt vid uppackning. Kunden besöker din returportal arg och besviken. Hur agerar du?',
          choices: [
            {
              text: 'Erbjud en standardsida: "Skriv ut retursedel på din skrivare och skicka tillbaka för återbetalning".',
              impact: { patience: -25, margin: -30, clv: -20 },
              feedback: 'Kunden har ingen skrivare! Friktionen gör att kunden lämnar en 1-stjärnig recension och handlar hos en konkurrent nästa gång.'
            },
            {
              text: 'Erbjud "Instant Exchange": Skicka en ny leksak direkt med bud, och ge kunden en QR-kod för retur utan papper.',
              impact: { patience: +40, margin: +15, clv: +40 },
              feedback: 'Briljant! Du räddade ordern, raderade skrivarfriktionen med en digital QR-kod och skapade en lojal ambassadör som köper igen till jul.'
            }
          ]
        }
      ]
    },
    {
      id: 'b2b',
      badge: 'B2B • Företagskassa & Faktura',
      title: 'B2B-Inköparen på arkitektbyrån',
      difficulty: 'Hög Marginal',
      persona: 'Fredrik, Kontorschef • Beställer 12 arbetsstolar (64 000 kr)',
      context: 'Klockan är 16:40 på fredag. Budgetåret stänger kl 17:00 och Fredrik måste beställa kontorsmöbler för 64 000 kr innan budgeten brinner inne.',
      initialStats: { patience: 75, margin: 60, clv: 30 },
      scenes: [
        {
          id: 1,
          title: 'Prissättning & Moms i B2B',
          stage: 'Steg 1 av 3: B2B-Presentation',
          scenario: 'Fredrik landar på varukorgen. Hur presenterar du prissättningen för en professionell inköpare?',
          choices: [
            {
              text: 'Visa endast priser inklusive moms och tvinga kunden att själv räkna baklänges.',
              impact: { patience: -20, margin: 0, clv: -5 },
              feedback: 'Störande friktion! B2B-inköpare budgeterar alltid exklusive moms. Att inte ha en tydlig B2B-moms-toggle skapar onödig kognitiv belastning.'
            },
            {
              text: 'Lägg till en tydlig switch: "Företag (Exkl. moms)" och slå upp företagsnamn automatiskt via Organisationsnummer.',
              impact: { patience: +25, margin: +5, clv: +25 },
              feedback: 'Perfekt B2B-ergonomi! Med ett klick slås bolagets kreditvärdighet och officiella leveransadress upp automatiskt.'
            }
          ]
        },
        {
          id: 2,
          title: 'B2B Betallösning',
          stage: 'Steg 2 av 3: Kassa & Betalvillkor',
          scenario: 'Fredrik ska betala ordern på 64 000 kr. Företagskortet har en limit på 25 000 kr och ligger hos VD:n som har gått för dagen. Vad gör du?',
          choices: [
            {
              text: 'Kräv direkt kortbetalning med BankID eller Swish Företag.',
              impact: { patience: -55, margin: 0, clv: -30 },
              feedback: 'KÖPET AVBRÖTS! Fredrik kan inte lägga ut 64 000 kr privat. Eftersom du saknar 30-dagars faktura tvingas han köpa från Kinnarps istället.'
            },
            {
              text: 'Erbjud 30 dagars E-faktura (Peppol / PDF) med automatisk kreditprövning via Svea/Walley B2B.',
              impact: { patience: +35, margin: +15, clv: +35 },
              feedback: 'Fullträff! Ordern godkändes på 4 sekunder. Fredrik slipper ligga ute med pengar och byrån blir en återkommande storkund.'
            }
          ]
        },
        {
          id: 3,
          title: 'Leverans till Kontoret',
          stage: 'Steg 3 av 3: Godsleverans',
          scenario: '12 kontorsstolar på två tunga EUR-pallar ska levereras till innerstaden. Hur schemalägger du leveransen?',
          choices: [
            {
              text: 'Boka standardpaket till närmsta Pressbyrån-ombud.',
              impact: { patience: -45, margin: -10, clv: -40 },
              feedback: 'Katastrof! Ombudet vägrar ta emot två fullstora träpallar. Godset returneras och Fredrik ringer arg till kundtjänst.'
            },
            {
              text: 'Erbjud Företagspaket med telefonavisering 30 min innan, bakgavellyft och inbärning till våningsplan 3.',
              impact: { patience: +30, margin: +10, clv: +30 },
              feedback: 'Proffsigt! B2B-leveransen flyter på utan avbrott för byråns verksamhet. Kunden rekommenderar er till andra bolag i huset.'
            }
          ]
        }
      ]
    },
    {
      id: 'genz',
      badge: 'Mobile First • Social Commerce',
      title: 'Gen Z-fyndjägaren på TikTok',
      difficulty: 'Snabbt & Rörligt',
      persona: 'Liam, 20 år • Klickade på en viral reel',
      context: 'Liam såg en viral video om en limiterad hoodie för 499 kr. Han sitter på tunnelbanan med 3% batteri kvar.',
      initialStats: { patience: 90, margin: 40, clv: 20 },
      scenes: [
        {
          id: 1,
          title: 'Landningssida från Sociala Medier',
          stage: 'Steg 1 av 3: Bounce Protection',
          scenario: 'Liam landar på din butik från TikTok. Hur maximerar du chansen att han stannar kvar på sajten?',
          choices: [
            {
              text: 'Täck hela skärmen med en aggressiv pop-up: "Prenumerera på vårt nyhetsbrev och få 15% rabatt".',
              impact: { patience: -40, margin: 0, clv: -10 },
              feedback: 'BAM! Liam klickar på bakåtknappen inom 1,5 sekund. Gen Z hatar popups som blockerar innehåll på mobilen.'
            },
            {
              text: 'Visa produkten direkt med stor bild, storlekssväljare och en sticky "Köp nu med Swish"-knapp längst ner.',
              impact: { patience: +20, margin: +5, clv: +15 },
              feedback: 'Klockrent! Noll distraktioner. Liam ser hoodien direkt och klickar vidare mot kassan.'
            }
          ]
        },
        {
          id: 2,
          title: 'Mobilkassans Friktion',
          stage: 'Steg 2 av 3: Express Checkout',
          scenario: 'Liam är i kassan. Tunnelbanan kör snart in i en tunnel utan mottagning. Hur hanterar du betalsteget?',
          choices: [
            {
              text: 'Be Liam knappa in sitt 16-siffriga Visa-kort, CVC-kod och giltighetsdatum manuellt.',
              impact: { patience: -50, margin: 0, clv: -20 },
              feedback: 'Ingen ung mobilkund tar fram plastkortet på tunnelbanan! Köpet avbryts direkt.'
            },
            {
              text: 'Erbjud Swish eller Apple Pay som öppnas direkt med FaceID utan manuella formulär.',
              impact: { patience: +30, margin: +10, clv: +25 },
              feedback: 'Sekundsnabb konvertering! Köpet genomfördes på 6 sekunder innan tåget nådde tunneln.'
            }
          ]
        },
        {
          id: 3,
          title: 'Leveransval för Unga',
          stage: 'Steg 3 av 3: Last Mile',
          scenario: 'Var vill Liam ha sitt paket levererat?',
          choices: [
            {
              text: 'Endast PostNord ombud som stänger kl 18:00 och ligger 2,5 km bort.',
              impact: { patience: -30, margin: 0, clv: -15 },
              feedback: 'Liam har varken bil eller tid att passa ombudets öppettider. Hämtningen dröjer en vecka.'
            },
            {
              text: 'Instabox eller Budbee paketbox i hans tunnelbaneuppgång som kan öppnas med PIN-kod dygnet runt.',
              impact: { patience: +35, margin: +5, clv: +30 },
              feedback: 'Bästa matchningen! Liam plockar upp paketet på vägen hem från gymmet utan köer.'
            }
          ]
        }
      ]
    },
    {
      id: 'premium',
      badge: 'High-Ticket • Förtroende & Säkerhet',
      title: 'Den skeptiska premiumköparen',
      difficulty: 'Hög Risk',
      persona: 'Henrik, 58 år • Köper espressomaskin för 22 500 kr',
      context: 'Henrik ska köpa en italiensk espressomaskin. Han blev lurad av en bluffbutik för två år sedan och är extremt vaksam mot minsta tecken på oseriositet.',
      initialStats: { patience: 70, margin: 70, clv: 35 },
      scenes: [
        {
          id: 1,
          title: 'Förtroendesignaler på Produktsidan',
          stage: 'Steg 1 av 3: Trygghet',
          scenario: 'Henrik granskar produkten för 22 500 kr. Vad bygger mest förtroende för att dämpa hans ångest?',
          choices: [
            {
              text: 'Blinkande röda skyltar: "Skynda dig! Endast 1 kvar i lager! 14 personer tittar just nu!"',
              impact: { patience: -35, margin: 0, clv: -25 },
              feedback: 'Henrik känner igen falsk scarcity från bluffbutiker. Han stänger fliken och googlar om ni är en scam.'
            },
            {
              text: 'Visa verifierade Trustpilot-recensioner (4.9/5), märke för "Auktoriserad Svensk Återförsäljare" och 5 års garanti.',
              impact: { patience: +25, margin: +5, clv: +25 },
              feedback: 'LIFT-modellen i praktiken: Anxiety (ångest) elimineras med transparenta garantier och officiella märken.'
            }
          ]
        },
        {
          id: 2,
          title: 'Betalmetod vid Stora Belopp',
          stage: 'Steg 2 av 3: Köparskydd',
          scenario: 'Henrik är i kassan med varukorgen på 22 500 kr. Hur säkrar du betalningen?',
          choices: [
            {
              text: 'Erbjud endast direkt banköverföring mot 3% rabatt.',
              impact: { patience: -60, margin: 0, clv: -40 },
              feedback: 'Larmklockorna ringer hos Henrik! Att be om direktöverföring vid 22 500 kr är ett klassiskt bedrägerimönster. Kunden avbryter.'
            },
            {
              text: 'Erbjud "Få först, betala om 30 dagar" (Walley/Klarna faktura) med komplett köparskydd.',
              impact: { patience: +35, margin: +15, clv: +30 },
              feedback: 'Perfekt trygghet! Henrik vet att han inte behöver betala en krona förrän maskinen står på köksbänken och är testkörd.'
            }
          ]
        },
        {
          id: 3,
          title: 'Exklusiv och Varsam Hemleverans',
          stage: 'Steg 3 av 3: Varsam Frakt',
          scenario: 'Maskinen väger 28 kg i spegelblankt rostfritt stål. Hur levererar du den?',
          choices: [
            {
              text: 'Kasta paketet över staketet i trädgården utan krav på kvittens.',
              impact: { patience: -50, margin: -30, clv: -50 },
              feedback: 'En maskin för 22 500 kr lämnas i regnet utan signatur? Henrik är rasande och kräver hävning av köpet.'
            },
            {
              text: 'Inburen hemleverans med tidsintervall, ID-kontroll och avisering 30 minuter innan ankomst.',
              impact: { patience: +30, margin: +10, clv: +35 },
              feedback: 'Lyxig leverans! Den personliga tryggheten matchar produktens premiumstatus. Henrik blir en stolt ambassadör.'
            }
          ]
        }
      ]
    },
    {
      id: 'nordic',
      badge: 'Cross-Border • Norden & Valuta',
      title: 'Den norska grannlandskunden',
      difficulty: 'Tull & Skatt',
      persona: 'Astrid, 41 år • Handlar från Oslo i svensk butik',
      context: 'Astrid ska köpa svensk inredningsdesign för 1 800 kr. Norge står utanför EU och hon har tidigare råkat ut för oväntade tullfakturor.',
      initialStats: { patience: 75, margin: 55, clv: 30 },
      scenes: [
        {
          id: 1,
          title: 'Valuta och VOEC / Tullklarering',
          stage: 'Steg 1 av 3: Prisgenomskinlighet',
          scenario: 'Astrid landar i din butik. Hur presenterar du prissättningen för en norsk kund?',
          choices: [
            {
              text: 'Tvinga kunden att handla i SEK och skriv i liten text: "Mottagaren ansvarar för eventuell importmoms och tull".',
              impact: { patience: -40, margin: 0, clv: -25 },
              feedback: 'Omedelbar bounce! Norska konsumenter hatar oväntade avgifter från Posten (ofta 350+ NOK i avgift). Vaga tullvillkor dödar köplusten direkt.'
            },
            {
              text: 'Visa priser i NOK och tydlig VOEC-märkning: "All norsk MVA ingår – Inga dolda tullavgifter vid gränsen".',
              impact: { patience: +30, margin: +10, clv: +25 },
              feedback: 'Perfekt VOEC-hantering! Genom att visa totalpris i lokal valuta raderar du all tulloro.'
            }
          ]
        },
        {
          id: 2,
          title: 'Lokala Nordiska Betalsätt',
          stage: 'Steg 2 av 3: Betalförtroende',
          scenario: 'Astrid ska betala i kassan. Vilka betalsätt prioriterar du?',
          choices: [
            {
              text: 'Erbjud endast svenskt Swish och SEPA-banköverföring i EUR.',
              impact: { patience: -45, margin: 0, clv: -30 },
              feedback: 'Astrid kan inte betala med Swish! I Norge är det Vipps som gäller. Köpet faller platt.'
            },
            {
              text: 'Erbjud Vipps (Norge) och Klarna Faktura i NOK direkt i mobilen.',
              impact: { patience: +30, margin: +10, clv: +25 },
              feedback: 'Konverteringssuccé! Astrid betalar på tre sekunder via Vipps-appen utan friktion.'
            }
          ]
        },
        {
          id: 3,
          title: 'Logistikval till Norge',
          stage: 'Steg 3 av 3: Spårbarhet & Bud',
          scenario: 'Vilken transportör anlitar du för leveransen till Oslo?',
          choices: [
            {
              text: 'Billigaste ospårbara brevförsändelse med 8–14 dagars leveranstid.',
              impact: { patience: -35, margin: -10, clv: -20 },
              feedback: 'WISMO-kaos! Astrid kontaktar kundservice tre gånger och undrar var paketet tagit vägen.'
            },
            {
              text: 'Bring eller PostNord med spårning hela vägen och uthämtning i hennes lokala Kiwi-butik.',
              impact: { patience: +25, margin: +5, clv: +25 },
              feedback: 'Trygg regional leverans! Bring är Norges mest välkända transportör och paketet anländer på 2 dagar.'
            }
          ]
        }
      ]
    },
    {
      id: 'subscription',
      badge: 'D2C • Prenumeration & CLV',
      title: 'Den återkommande kaffeprenumeranten',
      difficulty: 'Långsiktigt CLV',
      persona: 'Marcus, 29 år • Letar specialkaffe på nätet',
      context: 'Marcus ska beställa 1 kg kaffebönor (249 kr). Ditt mål är att konvertera detta engångsköp till en lönsam återkommande prenumeration värd 3 000 kr/år.',
      initialStats: { patience: 80, margin: 45, clv: 25 },
      scenes: [
        {
          id: 1,
          title: 'Engångsköp vs Prenumerationsval',
          stage: 'Steg 1 av 3: Värdeerbjudande',
          scenario: 'Marcus är på produktsidan. Hur presenterar du prenumerationsalternativet?',
          choices: [
            {
              text: 'Förkryssa "Prenumeration var 3:e vecka" med 12 månaders bindningstid i det dolda.',
              impact: { patience: -50, margin: 0, clv: -40 },
              feedback: 'Dark Pattern! Marcus upptäcker fällan och känner sig lurad. Han lämnar sajten och varnar andra på Reddit.'
            },
            {
              text: 'Erbjud tydligt val: "Engångsköp 249 kr" eller "Prenumerera & spara 15% (211 kr) • Pausa, ändra eller säg upp med 1 klick när du vill".',
              impact: { patience: +25, margin: +5, clv: +35 },
              feedback: 'Empirisk CRO-vinst! Total valfrihet och noll bindningstid eliminerar ångest och ökar prenumerationsgraden med 40%.'
            }
          ]
        },
        {
          id: 2,
          title: 'Konvertera Gäst till Klubbmedlem',
          stage: 'Steg 2 av 3: Kassa till Klubb',
          scenario: 'Marcus betalade som gäst för att spara tid. Hur får du honom att spara sina uppgifter?',
          choices: [
            {
              text: 'Skicka ett tvingande e-postmeddelande om att han måste skapa lösenord innan ordern skickas.',
              impact: { patience: -30, margin: -10, clv: -15 },
              feedback: 'Onödig efterköpsfriktion. Marcus ignorerar mailet och förblir en oidentifierad engångskund.'
            },
            {
              text: 'På den varumärkesägda trackingsidan: "Aktivera Kaffeklubben med 1 klick och få fri frakt på nästa rostning".',
              impact: { patience: +30, margin: +10, clv: +30 },
              feedback: 'Superb tajming! Eftersom kunden är avslappnad efter köpet tackar 35% av gästerna ja och blir medlemmar.'
            }
          ]
        },
        {
          id: 3,
          title: 'Bounce-Back & Ambassadör',
          stage: 'Steg 3 av 3: Återköpshastighet',
          scenario: 'Kaffet har levererats i brevlådan. Hur maximerar du nästa köp och CLV?',
          choices: [
            {
              text: 'Lägg i ett generiskt pappersflygblad med reklam för te och choklad.',
              impact: { patience: -10, margin: -5, clv: 0 },
              feedback: 'Åker direkt i pappersinsamlingen. Noll digital spårbarhet och noll återköp.'
            },
            {
              text: 'Skicka leverans-SMS med QR-kod: 20% på en kaffekvarn inom 7 dagar + personlig AmbassadorFlow-länk (150 kr butikskredit).',
              impact: { patience: +35, margin: +15, clv: +45 },
              feedback: 'Tillväxtmotor! Marcus köper kvarnen inom 48 timmar och delar sin ambassadörslänk med 3 kollegor på jobbet.'
            }
          ]
        }
      ]
    }
  ];
}

export function WinTheCustomerGame() {
  const { isEnglish } = useLanguage();
  const cases = getGameCases(isEnglish);

  const [computerTheme, setComputerTheme] = useState<'retro' | 'modern'>('retro');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showFoldMarker, setShowFoldMarker] = useState(true);

  const [activeCaseId, setActiveCaseId] = useState<string>('parent');
  const [gameState, setGameState] = useState<'start' | 'playing' | 'feedback' | 'gameover' | 'victory'>('start');
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [lastFeedback, setLastFeedback] = useState<string | null>(null);
  const [completedCases, setCompletedCases] = useState<string[]>([]);

  const activeCase = cases.find((c) => c.id === activeCaseId) || cases[0];
  const [stats, setStats] = useState(activeCase.initialStats);

  // Synka stats vid byte av case
  useEffect(() => {
    setStats(activeCase.initialStats);
  }, [activeCaseId, activeCase]);

  const triggerSound = (type: 'click' | 'success' | 'fail' | 'start') => {
    if (soundEnabled) {
      playRetroBeep(type);
    }
  };

  const handleStartCase = (caseId: string) => {
    setActiveCaseId(caseId);
    const selectedCase = cases.find((c) => c.id === caseId) || cases[0];
    setStats(selectedCase.initialStats);
    setCurrentSceneIndex(0);
    setLastFeedback(null);
    setGameState('playing');
    triggerSound('start');
  };

  const handleChoice = (choice: GameChoice) => {
    triggerSound('click');
    const newPatience = Math.max(0, Math.min(100, stats.patience + choice.impact.patience));
    const newMargin = Math.max(0, Math.min(100, stats.margin + choice.impact.margin));
    const newClv = Math.max(0, Math.min(100, stats.clv + choice.impact.clv));

    setStats({ patience: newPatience, margin: newMargin, clv: newClv });
    setLastFeedback(choice.feedback);

    if (newPatience <= 0) {
      setGameState('gameover');
      triggerSound('fail');
    } else {
      setGameState('feedback');
      if (choice.impact.patience > 0 || choice.impact.clv > 0) {
        triggerSound('success');
      } else {
        triggerSound('fail');
      }
    }
  };

  const handleNextScene = () => {
    triggerSound('click');
    if (currentSceneIndex + 1 < activeCase.scenes.length) {
      setCurrentSceneIndex((prev) => prev + 1);
      setGameState('playing');
    } else {
      setGameState('victory');
      setCompletedCases((prev) => (prev.includes(activeCase.id) ? prev : [...prev, activeCase.id]));
      triggerSound('success');
    }
  };

  const handleResetToStart = () => {
    triggerSound('click');
    setGameState('start');
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 font-sans select-none">
      {/* KONTROLLBAR: TEMA-VÄLJARE, LJUD & FOLD-MARKERING */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-slate-900/90 border border-slate-800 p-3 rounded-2xl shadow-xl">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Monitor size={15} className="text-indigo-400" />{' '}
            {isEnglish ? 'Workstation Mode:' : 'Dator-simulator:'}
          </span>
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => {
                setComputerTheme('retro');
                triggerSound('click');
              }}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition font-mono ${
                computerTheme === 'retro'
                  ? 'bg-amber-600 text-white font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Tv size={14} /> 1998 CRT Classic
            </button>
            <button
              type="button"
              onClick={() => {
                setComputerTheme('modern');
                triggerSound('click');
              }}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                computerTheme === 'modern'
                  ? 'bg-indigo-600 text-white font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor size={14} /> 2026 Retina Pro
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* FOLD MARKER TOGGLE */}
          <button
            type="button"
            onClick={() => {
              setShowFoldMarker(!showFoldMarker);
              triggerSound('click');
            }}
            className={`px-3 py-1.5 rounded-xl border text-xs flex items-center gap-1.5 transition ${
              showFoldMarker
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
            title={isEnglish ? 'Toggle Above/Below the Fold Marker' : 'Visa/dölj vikningslinje'}
          >
            <Scissors size={13} />
            <span>
              {isEnglish ? 'Fold Line:' : 'Vikningslinje:'}{' '}
              {showFoldMarker ? (isEnglish ? 'ON' : 'PÅ') : isEnglish ? 'OFF' : 'AV'}
            </span>
          </button>

          {/* AUDIO TOGGLE */}
          <button
            type="button"
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              if (!soundEnabled) playRetroBeep('click');
            }}
            className={`px-3 py-1.5 rounded-xl border text-xs flex items-center gap-1.5 transition ${
              soundEnabled
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
            title={isEnglish ? 'Toggle Retro 8-bit Audio' : 'Slå på/av retro 8-bit ljud'}
          >
            {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
            <span>
              {isEnglish ? 'Sound' : 'Ljud'} {soundEnabled ? (isEnglish ? 'ON' : 'PÅ') : isEnglish ? 'OFF' : 'AV'}
            </span>
          </button>
        </div>
      </div>

      {/* --- DET INTERAKTIVA DATOR-CHASSIT --- */}
      {computerTheme === 'retro' ? (
        /* ================= 1998 RETRO CRT MONITOR ================= */
        <div className="bg-[#dcd4c0] border-4 sm:border-[16px] border-[#c5ba9f] rounded-2xl sm:rounded-[2.5rem] p-3 sm:p-7 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] text-slate-800 relative">
          {/* Fysiskt ventilationsgaller och logotyp */}
          <div className="flex items-center justify-between pb-3 border-b-2 border-[#b3a88e] mb-3 text-[#7d725a] font-mono text-xs">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="font-black text-xs sm:text-sm tracking-widest text-[#5a523e]">
                {'CRO-TERMINAL // 386-DX'}
              </span>
              <span className="hidden sm:inline bg-[#b5aa90] px-2 py-0.5 rounded text-[10px]">
                66 MHz • 16MB RAM
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex gap-1">
                <span className="w-5 h-1 bg-[#a3977c] rounded-full inline-block" />
                <span className="w-5 h-1 bg-[#a3977c] rounded-full inline-block" />
                <span className="w-5 h-1 bg-[#a3977c] rounded-full inline-block" />
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-ping" />
                <span>POWER ON</span>
              </div>
            </div>
          </div>

          {/* Den böjda CRT-skärmen med scanlines */}
          <div className="bg-[#141d14] border-4 sm:border-[12px] border-[#2b352b] rounded-xl sm:rounded-[1.8rem] p-3 sm:p-7 shadow-inner relative overflow-hidden text-[#55ff55] font-mono min-h-[520px] flex flex-col justify-between">
            {/* Scanlines overlay effekt */}
            <div
              className="absolute inset-0 pointer-events-none opacity-20 z-30"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0px, rgba(0, 0, 0, 0.4) 2px, transparent 2px, transparent 4px)'
              }}
            />
            {/* CRT glasglans/reflektion */}
            <div className="absolute -top-32 -left-32 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none z-30" />

            {/* FOLD-LINJE MARKERING (STRECKAD LINJE) */}
            {showFoldMarker && (
              <div className="absolute left-0 right-0 top-[540px] z-35 pointer-events-none">
                <div className="relative w-full border-t-2 border-dashed border-rose-500/80">
                  <div className="absolute left-1/2 -translate-x-1/2 -top-3 bg-rose-950/90 border border-rose-500/50 text-rose-300 text-[9px] font-mono uppercase px-2 py-0.5 rounded-full shadow">
                    ✂ {isEnglish ? 'FOLD LINE • Above Fold (80% attention) / Below Fold (Scroll)' : 'VIKNINGSLINJE • Ovanför fold (80% fokus) / Under fold (Scroll)'}
                  </div>
                </div>
              </div>
            )}

            {/* Skärminnehåll */}
            <div className="relative z-20 flex-1 flex flex-col">
              <GameScreenContent
                theme="retro"
                isEnglish={isEnglish}
                gameState={gameState}
                activeCase={activeCase}
                allCases={cases}
                stats={stats}
                currentSceneIndex={currentSceneIndex}
                lastFeedback={lastFeedback}
                completedCases={completedCases}
                onStartCase={handleStartCase}
                onChoice={handleChoice}
                onNextScene={handleNextScene}
                onResetToStart={handleResetToStart}
                triggerSound={triggerSound}
              />
            </div>

            {/* Retro statusrad längst ner på CRT-skärmen */}
            <div className="relative z-20 pt-3 mt-5 border-t border-[#2d522d] flex flex-wrap items-center justify-between text-[10px] sm:text-[11px] text-[#44aa44]">
              <span>{'C:\\ECOMMERCE\\SURVIVAL.EXE [READY]'}</span>
              <span>LIFT-FRAMEWORK V26.4</span>
              <span className="hidden sm:inline">TERMINAL ID: #SE-1998</span>
            </div>
          </div>

          {/* Underdel på CRT: Diskettstation & kontrollknappar */}
          <div className="pt-3 mt-3 flex items-center justify-between text-xs text-[#7d725a] font-mono">
            <div className="flex items-center gap-3">
              <div className="w-24 sm:w-36 h-3 bg-[#b3a88e] border border-[#9b9075] rounded flex items-center justify-between px-2 shadow-inner">
                <span className="w-3 h-1 bg-[#55ff55] inline-block animate-pulse" />
                <span className="text-[9px] text-[#554d38] font-bold">3.5&quot; HD</span>
              </div>
              <span className="hidden sm:inline text-[10px]">FLOPPY READY</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shadow-sm" />
              <span className="text-[10px] font-bold text-[#554d38]">TURBO 66MHz</span>
            </div>
          </div>
        </div>
      ) : (
        /* ================= 2026 RETINA PRO WORKSTATION ================= */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl p-3 sm:p-7 shadow-2xl text-slate-100 relative overflow-hidden">
          {/* Toppram: Fönsterkontroller och status */}
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 mb-5 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block shadow-sm" />
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block shadow-sm" />
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block shadow-sm" />
              <span className="ml-2 font-semibold text-slate-300 truncate">
                Checkout Survival Lab OS 2026
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-xs font-mono text-slate-500">
              <span className="bg-indigo-950/60 text-indigo-400 border border-indigo-800/60 px-2.5 py-0.5 rounded-full hidden sm:inline">
                Neural CRO Engine
              </span>
              <span>120 Hz Retina Pro</span>
            </div>
          </div>

          {/* FOLD-LINJE MARKERING (STRECKAD LINJE) */}
          {showFoldMarker && (
            <div className="relative w-full mb-3 select-none pointer-events-none">
              <div className="w-full border-t-2 border-dashed border-rose-500/80 relative">
                <div className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-rose-600 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow">
                  ✂ {isEnglish ? 'FOLD LINE (The Fold)' : 'VIKNINGSLINJE (The Fold)'}
                </div>
              </div>
            </div>
          )}

          {/* Skärminnehåll */}
          <div className="min-h-[520px] flex flex-col justify-between">
            <GameScreenContent
              theme="modern"
              isEnglish={isEnglish}
              gameState={gameState}
              activeCase={activeCase}
              allCases={cases}
              stats={stats}
              currentSceneIndex={currentSceneIndex}
              lastFeedback={lastFeedback}
              completedCases={completedCases}
              onStartCase={handleStartCase}
              onChoice={handleChoice}
              onNextScene={handleNextScene}
              onResetToStart={handleResetToStart}
              triggerSound={triggerSound}
            />

            {/* Modern fotnot */}
            <div className="pt-3 mt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-500">
              <span>
                {isEnglish
                  ? 'Behavioral E-commerce Science • Baymard • NN/g • LIFT Model'
                  : 'Svensk E-handelspsykologi • Baymard • NN/g • LIFT-modellen'}
              </span>
              <span>{isEnglish ? 'CLV & Margin Simulator' : 'CLV & Marginal-simulator'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- SUB-KOMPONENT FÖR SKÄRMINNEHÅLLET (VÄXLAR MELLAN RETRO/MODERN STIL OCH SPRÅK) ---
interface GameScreenProps {
  theme: 'retro' | 'modern';
  isEnglish: boolean;
  gameState: 'start' | 'playing' | 'feedback' | 'gameover' | 'victory';
  activeCase: GameCase;
  allCases: GameCase[];
  stats: { patience: number; margin: number; clv: number };
  currentSceneIndex: number;
  lastFeedback: string | null;
  completedCases: string[];
  onStartCase: (id: string) => void;
  onChoice: (choice: GameChoice) => void;
  onNextScene: () => void;
  onResetToStart: () => void;
  triggerSound: (type: 'click' | 'success' | 'fail' | 'start') => void;
}

function GameScreenContent({
  theme,
  isEnglish,
  gameState,
  activeCase,
  allCases,
  stats,
  currentSceneIndex,
  lastFeedback,
  completedCases,
  onStartCase,
  onChoice,
  onNextScene,
  onResetToStart
}: GameScreenProps) {
  const isRetro = theme === 'retro';

  // HUD-MÄTARE
  const renderHUD = () => (
    <div
      className={`grid grid-cols-3 gap-2 sm:gap-4 mb-5 ${
        isRetro
          ? 'bg-[#0f170f] p-3 border border-[#2d522d] text-[#55ff55]'
          : 'bg-slate-950/80 p-3 sm:p-3.5 border border-slate-800 rounded-2xl'
      }`}
    >
      {/* Tålamod */}
      <div>
        <div className="flex justify-between items-center text-[11px] sm:text-xs mb-1 font-bold">
          <span className="flex items-center gap-1">
            <Heart size={13} className={isRetro ? 'text-[#ff5555]' : 'text-rose-500'} />
            <span className={isRetro ? 'text-[#aaffaa]' : 'text-slate-300'}>
              {isEnglish ? 'Patience (HP)' : 'Tålamod (HP)'}
            </span>
          </span>
          <span className={isRetro ? 'text-[#ffff55]' : 'text-white'}>{stats.patience}%</span>
        </div>
        <div
          className={`w-full h-1.5 sm:h-2 rounded-full overflow-hidden ${
            isRetro ? 'bg-[#223322]' : 'bg-slate-800'
          }`}
        >
          <div
            className={`h-full transition-all duration-300 ${isRetro ? 'bg-[#55ff55]' : 'bg-rose-500'}`}
            style={{ width: `${stats.patience}%` }}
          />
        </div>
      </div>

      {/* Vinstmarginal */}
      <div>
        <div className="flex justify-between items-center text-[11px] sm:text-xs mb-1 font-bold">
          <span className="flex items-center gap-1">
            <DollarSign size={13} className={isRetro ? 'text-[#55ff55]' : 'text-emerald-500'} />
            <span className={isRetro ? 'text-[#aaffaa]' : 'text-slate-300'}>
              {isEnglish ? 'Margin' : 'Marginal'}
            </span>
          </span>
          <span className={isRetro ? 'text-[#ffff55]' : 'text-white'}>{stats.margin}%</span>
        </div>
        <div
          className={`w-full h-1.5 sm:h-2 rounded-full overflow-hidden ${
            isRetro ? 'bg-[#223322]' : 'bg-slate-800'
          }`}
        >
          <div
            className={`h-full transition-all duration-300 ${isRetro ? 'bg-[#55ffff]' : 'bg-emerald-500'}`}
            style={{ width: `${stats.margin}%` }}
          />
        </div>
      </div>

      {/* CLV */}
      <div>
        <div className="flex justify-between items-center text-[11px] sm:text-xs mb-1 font-bold">
          <span className="flex items-center gap-1">
            <Repeat size={13} className={isRetro ? 'text-[#ffff55]' : 'text-indigo-400'} />
            <span className={isRetro ? 'text-[#aaffaa]' : 'text-slate-300'}>
              {isEnglish ? 'CLV / Loyalty' : 'CLV / Lojalitet'}
            </span>
          </span>
          <span className={isRetro ? 'text-[#ffff55]' : 'text-white'}>{stats.clv}%</span>
        </div>
        <div
          className={`w-full h-1.5 sm:h-2 rounded-full overflow-hidden ${
            isRetro ? 'bg-[#223322]' : 'bg-slate-800'
          }`}
        >
          <div
            className={`h-full transition-all duration-300 ${isRetro ? 'bg-[#ffff55]' : 'bg-indigo-500'}`}
            style={{ width: `${stats.clv}%` }}
          />
        </div>
      </div>
    </div>
  );

  /* --- START-SKÄRM MED VAL AV KUNDCASE --- */
  if (gameState === 'start') {
    return (
      <div className="space-y-5 animate-in fade-in">
        <div className="text-center max-w-2xl mx-auto py-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-2.5 border font-mono">
            {isRetro
              ? '>>> MISSIO: E-COMMERCE SURVIVAL <<<'
              : isEnglish
              ? '★ Choose Your Head of E-commerce Dilemma'
              : '★ Välj ditt Head of E-commerce scenario'}
          </div>
          <h2
            className={`text-xl sm:text-3xl font-black tracking-tight ${
              isRetro ? 'text-[#55ff55]' : 'text-white'
            }`}
          >
            {isRetro
              ? isEnglish
                ? 'WIN THE CUSTOMER: 1998 EDITION'
                : 'VINN KUNDEN: 1998 EDITION'
              : isEnglish
              ? 'Win The Customer!'
              : 'Vinn Kunden!'}
          </h2>
          <p
            className={`mt-2 text-xs sm:text-sm leading-relaxed ${
              isRetro ? 'text-[#aaffaa]' : 'text-slate-300'
            }`}
          >
            {isEnglish
              ? 'Guide each shopper through the checkout without exhausting their patience or sacrificing your gross profit margin. Select from 6 realistic e-commerce cases below:'
              : 'Guiden kunden genom kassan utan att tålamodet tar slut eller din vinstmarginal utplånas. Välj bland 6 verkliga e-handelsfall nedan:'}
          </p>
        </div>

        {/* KUNDCASE GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {allCases.map((c) => {
            const isCompleted = completedCases.includes(c.id);
            return (
              <div
                key={c.id}
                className={`p-3.5 sm:p-4 rounded-xl border text-left transition flex flex-col justify-between ${
                  isRetro
                    ? 'bg-[#182618] border-[#2d522d] hover:border-[#55ff55]'
                    : 'bg-slate-800/70 border-slate-700 hover:border-indigo-500 shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span
                      className={`font-mono text-[10px] uppercase tracking-wider ${
                        isRetro ? 'text-[#ffff55]' : 'text-indigo-400 font-bold'
                      }`}
                    >
                      {c.badge}
                    </span>
                    {isCompleted && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                        <CheckCircle size={10} /> {isEnglish ? 'PASSED' : 'KLARAD'}
                      </span>
                    )}
                  </div>
                  <h3
                    className={`text-sm sm:text-base font-bold ${
                      isRetro ? 'text-[#55ff55]' : 'text-white'
                    }`}
                  >
                    {c.title}
                  </h3>
                  <p
                    className={`text-xs mt-1 leading-relaxed ${
                      isRetro ? 'text-[#88cc88]' : 'text-slate-400'
                    }`}
                  >
                    {c.context}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-700/50 flex items-center justify-between">
                  <span
                    className={`text-[11px] ${isRetro ? 'text-[#aaffaa]' : 'text-slate-400'}`}
                  >
                    {c.scenes.length} {isEnglish ? 'decisions' : 'beslut'} • {c.difficulty}
                  </span>
                  <button
                    type="button"
                    onClick={() => onStartCase(c.id)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
                      isRetro
                        ? 'bg-[#2d522d] hover:bg-[#55ff55] hover:text-black text-[#55ff55] border border-[#55ff55]'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
                    }`}
                  >
                    <Play size={11} /> {isEnglish ? 'Play Case' : 'Spela case'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* --- SPELSKÄRM (SCENARIO) --- */
  if (gameState === 'playing') {
    const currentScene = activeCase.scenes[currentSceneIndex];
    return (
      <div className="space-y-5 animate-in fade-in">
        {renderHUD()}

        <div
          className={`p-4 sm:p-6 rounded-2xl border ${
            isRetro ? 'bg-[#182618] border-[#2d522d]' : 'bg-slate-800/80 border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-2">
            <span
              className={`font-mono text-[11px] uppercase tracking-wider ${
                isRetro ? 'text-[#ffff55]' : 'text-indigo-400 font-bold'
              }`}
            >
              {activeCase.title} &bull; {currentScene.stage}
            </span>
            <span className={`text-xs ${isRetro ? 'text-[#aaffaa]' : 'text-slate-400'}`}>
              {isEnglish ? 'Scenario' : 'Scenario'} #{currentScene.id}
            </span>
          </div>

          <h3
            className={`text-lg sm:text-xl font-bold mb-2.5 ${
              isRetro ? 'text-[#55ff55]' : 'text-white'
            }`}
          >
            {currentScene.title}
          </h3>

          <p
            className={`text-xs sm:text-sm md:text-base leading-relaxed mb-5 ${
              isRetro ? 'text-[#cceecc]' : 'text-slate-200'
            }`}
          >
            {currentScene.scenario}
          </p>

          {/* VALBARA ALTERNATIV - MED SÄKRA MOBIL-MARGINALER */}
          <div className="space-y-2.5">
            {currentScene.choices.map((choice, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onChoice(choice)}
                className={`w-full text-left p-3 sm:p-4 rounded-xl border transition flex items-start gap-3 min-h-[48px] ${
                  isRetro
                    ? 'bg-[#0f170f] border-[#2d522d] hover:border-[#55ff55] hover:bg-[#1a2d1a] text-[#55ff55]'
                    : 'bg-slate-900/90 border-slate-700 hover:border-indigo-500 hover:bg-slate-900 text-slate-200'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-md font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                    isRetro
                      ? 'bg-[#2d522d] text-[#55ff55] border border-[#55ff55]'
                      : 'bg-indigo-950 text-indigo-400 border border-indigo-800'
                  }`}
                >
                  {['A', 'B', 'C'][idx]}
                </span>
                <span className="text-xs sm:text-sm font-medium leading-relaxed break-words flex-1">
                  {choice.text}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* --- FEEDBACK-SKÄRM EFTER BESLUT --- */
  if (gameState === 'feedback') {
    return (
      <div className="space-y-5 animate-in slide-in-from-bottom-2">
        {renderHUD()}

        <div
          className={`p-5 sm:p-8 rounded-2xl border text-center ${
            isRetro
              ? 'bg-[#182618] border-[#2d522d]'
              : 'bg-slate-800/90 border-slate-700 shadow-xl'
          }`}
        >
          <div
            className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-3.5 ${
              isRetro
                ? 'bg-[#2d522d] text-[#55ff55]'
                : 'bg-indigo-950 text-indigo-400 border border-indigo-800'
            }`}
          >
            <Sparkles size={22} />
          </div>

          <h3
            className={`text-lg sm:text-2xl font-bold mb-2.5 ${
              isRetro ? 'text-[#ffff55]' : 'text-white'
            }`}
          >
            {isEnglish ? 'Insight & Consequence' : 'Insikt & Konsekvens'}
          </h3>

          <p
            className={`text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mb-6 ${
              isRetro ? 'text-[#cceecc]' : 'text-slate-300'
            }`}
          >
            {lastFeedback}
          </p>

          <button
            type="button"
            onClick={onNextScene}
            className={`px-6 sm:px-8 py-3 text-xs sm:text-sm font-bold rounded-xl transition inline-flex items-center gap-2 ${
              isRetro
                ? 'bg-[#55ff55] text-black hover:bg-[#88ff88] shadow-lg shadow-green-500/30'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
            }`}
          >
            <span>{isEnglish ? 'Proceed to next step' : 'Fortsätt till nästa steg'}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  /* --- GAME OVER (BOUNCE) --- */
  if (gameState === 'gameover') {
    return (
      <div
        className={`p-5 sm:p-9 rounded-2xl border text-center animate-in zoom-in-95 ${
          isRetro
            ? 'bg-[#261010] border-[#552222] text-[#ff5555]'
            : 'bg-rose-950/40 border-rose-900/60 text-rose-200'
        }`}
      >
        <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center mb-3 bg-rose-500/20 text-rose-500">
          <AlertTriangle size={32} />
        </div>

        <h3
          className={`text-2xl sm:text-3xl font-black mb-2 ${
            isRetro ? 'text-[#ff5555]' : 'text-white'
          }`}
        >
          {isEnglish ? 'Customer Bounced! (Abandonment)' : 'Kunden Studsade! (Bounce)'}
        </h3>

        <p className="text-xs sm:text-base max-w-xl mx-auto mb-5 leading-relaxed">
          {isEnglish
            ? 'Your decisions triggered excessive friction. Customer patience hit 0% and they abandoned their cart.'
            : 'Dina beslut skapade för mycket friktion. Kundens tålamod nådde 0 % och de övergav varukorgen (Cart Abandonment).'}
        </p>

        <p className="text-xs italic mb-6 opacity-80 max-w-lg mx-auto">
          &ldquo;{lastFeedback}&rdquo;
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2.5">
          <button
            type="button"
            onClick={() => onStartCase(activeCase.id)}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 ${
              isRetro
                ? 'bg-[#ff5555] text-black hover:bg-[#ff8888]'
                : 'bg-rose-600 hover:bg-rose-500 text-white'
            }`}
          >
            <RotateCcw size={15} />{' '}
            {isEnglish ? 'Retry this case' : 'Försök igen med detta case'}
          </button>
          <button
            type="button"
            onClick={onResetToStart}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition border ${
              isRetro
                ? 'border-[#ff5555] text-[#ff5555] hover:bg-[#ff5555]/10'
                : 'border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            {isEnglish ? 'Choose another case' : 'Välj annat case'}
          </button>
        </div>
      </div>
    );
  }

  /* --- VICTORY SCREEN --- */
  if (gameState === 'victory') {
    return (
      <div
        className={`p-5 sm:p-9 rounded-2xl border text-center animate-in zoom-in-95 ${
          isRetro
            ? 'bg-[#102610] border-[#225522] text-[#55ff55]'
            : 'bg-emerald-950/40 border-emerald-900/60 text-emerald-200'
        }`}
      >
        <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center mb-3 bg-emerald-500/20 text-emerald-400">
          <CheckCircle size={32} />
        </div>

        <h3
          className={`text-2xl sm:text-3xl font-black mb-2 ${
            isRetro ? 'text-[#55ff55]' : 'text-white'
          }`}
        >
          {isEnglish ? 'Victory! You Won the Customer.' : 'Grattis! Kunden är din.'}
        </h3>

        <p className="text-xs sm:text-base max-w-xl mx-auto mb-5 leading-relaxed">
          {isEnglish ? (
            <>
              You successfully guided <strong>{activeCase.title}</strong> through the entire funnel.
              Strategic optimization factors protected margin while maximizing long-term loyalty (CLV).
            </>
          ) : (
            <>
              Du guidade framgångsrikt <strong>{activeCase.title}</strong> genom hela tratten. Rätt
              psykologiska optimeringsfaktorer skyddade marginalen och maximerade lojaliteten (CLV).
            </>
          )}
        </p>

        {/* Slutbetyg */}
        <div
          className={`p-3.5 rounded-xl max-w-md mx-auto mb-6 border text-left text-xs space-y-2 ${
            isRetro ? 'bg-[#0f170f] border-[#2d522d]' : 'bg-slate-900 border-slate-800'
          }`}
        >
          <div className="font-bold border-b border-slate-700/50 pb-1 mb-1.5">
            {isEnglish ? 'FINAL METRICS:' : 'SLUTRESULTAT:'}
          </div>
          <div className="flex justify-between">
            <span>{isEnglish ? 'Patience preserved:' : 'Tålamod bevarat:'}</span>{' '}
            <strong className="text-rose-400">{stats.patience}%</strong>
          </div>
          <div className="flex justify-between">
            <span>{isEnglish ? 'Profit margin:' : 'Vinstmarginal:'}</span>{' '}
            <strong className="text-emerald-400">{stats.margin}%</strong>
          </div>
          <div className="flex justify-between">
            <span>{isEnglish ? 'Lifetime Value (CLV):' : 'Långsiktigt CLV:'}</span>{' '}
            <strong className="text-indigo-400">{stats.clv}%</strong>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onResetToStart}
            className={`px-6 sm:px-8 py-3 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 ${
              isRetro
                ? 'bg-[#55ff55] text-black hover:bg-[#88ff88]'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            <span>{isEnglish ? 'Play more cases' : 'Spela fler case'}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default WinTheCustomerGame;
