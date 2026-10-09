'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Heart,
  DollarSign,
  Repeat,
  ArrowRight,
  ShoppingBag,
  CheckCircle,
  RotateCcw,
  AlertTriangle,
  Monitor,
  Tv,
  Volume2,
  VolumeX,
  Sparkles,
  Building2,
  Smartphone,
  ShieldCheck,
  Play,
  HelpCircle,
  Layers
} from 'lucide-react';

// --- LJUDEFFEKTER VIA WEB AUDIO API ---
function playRetroBeep(type: 'click' | 'success' | 'fail' | 'start') {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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

// --- FYRA DJUPA E-HANDELSCASE MED SCENARIER & FRÅGOR ---
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

const GAME_CASES: GameCase[] = [
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
        title: 'Leverans med Säkerhet',
        stage: 'Steg 3 av 3: Värdefull Frakt',
        scenario: 'Hur ska ett paket värt 22 500 kr nå fram till Henrik?',
        choices: [
          {
            text: 'Lämna paketet utanför ytterdörren i trapphuset utan signatur om ingen öppnar.',
            impact: { patience: -40, margin: -15, clv: -35 },
            feedback: 'Ångest! Henrik vågar inte riskera att en kaffemaskin för 22 000 kr blir stulen från trapphuset.'
          },
          {
            text: 'Försäkrad hemleverans med kvällsbud, ID-kontroll och legitimering med BankID vid överlämning.',
            impact: { patience: +30, margin: +10, clv: +35 },
            feedback: 'Tryggt och professionellt! Henrik känner att butiken tar ansvar hela vägen till hans hand.'
          }
        ]
      }
    ]
  },
  {
    id: 'd2c_beauty',
    badge: 'D2C • Kundklubb & Merförsäljning',
    title: 'Den lojala hudvårdskunden',
    difficulty: 'Lojalitet & AOV',
    persona: 'Elin, 29 år • Handlar hudvårdsrutin (459 kr i varukorgen)',
    context: 'Elin har lagt ett serum för 459 kr i varukorgen. Fri frakt-gränsen är 499 kr. Hon vill ha snabb leverans och överväger att bli medlem.',
    initialStats: { patience: 85, margin: 55, clv: 40 },
    scenes: [
      {
        id: 1,
        title: 'Varukorg & Fri frakt-mätare',
        stage: 'Steg 1 av 3: AOV & Tröskel',
        scenario: 'Elin är 40 kr ifrån fri frakt. Vad gör du i mini-cart och checkout-toppen?',
        choices: [
          {
            text: 'Dölj fraktgränsen och lägg automatiskt till 49 kr frakt i sista steget.',
            impact: { patience: -30, margin: +10, clv: -15 },
            feedback: 'Kunden blir irriterad över överraskningsavgiften och funderar på om hon ska köpa serumet på Lyko istället.'
          },
          {
            text: 'Visa en dynamisk mätare: "Bara 40 kr kvar till fri frakt!" med ett 1-klick tillval (läppbalsam 59 kr).',
            impact: { patience: +25, margin: +20, clv: +30 },
            feedback: 'Genialiskt! Elin klickar i läppbalsamet, känner att hon sparat pengar och ert snittordervärde (AOV) ökar med 13%!'
          }
        ]
      },
      {
        id: 2,
        title: 'Gäst vs Kundklubb (Soft Sign-in)',
        stage: 'Steg 2 av 3: Lojalitetskonvertering',
        scenario: 'Elin ska fylla i sina uppgifter. Hur lockar du in henne i kundklubben utan att skapa friktion?',
        choices: [
          {
            text: 'Tvinga henne att fylla i ett 8-siffrigt lösenord och bekräfta via ett aktiveringsmail innan köp.',
            impact: { patience: -50, margin: 0, clv: -25 },
            feedback: 'Kassan kraschar i konvertering! Forced account dödar 24% av alla köp enligt Baymard Institute.'
          },
          {
            text: 'Erbjud mjuk inloggning: "Fyll i din e-post så samlar du 50 bonuspoäng direkt + 10% rabatt i kassan".',
            impact: { patience: +35, margin: -5, clv: +45 },
            feedback: 'Högkonverterande! Elin sparar pengar direkt, kassan förifylls via telefonnummer och hon är nu bunden till er klubb.'
          }
        ]
      },
      {
        id: 3,
        title: 'Post-Purchase Upsell (Walley Engage-stil)',
        stage: 'Steg 3 av 3: Efterköps-magi',
        scenario: 'Elin har slutfört köpet. På tacksidan har du 100% av hennes uppmärksamhet. Hur agerar du?',
        choices: [
          {
            text: 'Visa en tom standardsida med "Tack för din order, kvitto har skickats till din e-post".',
            impact: { patience: 0, margin: 0, clv: 0 },
            feedback: 'En bortkastad möjlighet! Tacksidan är e-handelns mest underskattade intäktsdrivare.'
          },
          {
            text: 'Erbjud 1-klick tillägg: "Lägg till matchande nattkräm för 199 kr (30% rabatt) i samma paket – debiteras automatiskt".',
            impact: { patience: +20, margin: +25, clv: +40 },
            feedback: 'Katching! Eftersom kort/faktura redan är auktoriserad krävs inget nytt lösenord. 12% av kunderna nappar!'
          }
        ]
      }
    ]
  },
  {
    id: 'nordic_crossborder',
    badge: 'Cross-Border • Norden (NO & DK)',
    title: 'Den norska gränshandlaren',
    difficulty: 'Valuta & Tull',
    persona: 'Kari, 41 år • Bosatt i Oslo • Handlar från svensk e-butik',
    context: 'Kari vill köpa en friluftsjacka från din svenska butik. Norge står utanför EU och hon är livrädd för dolda tullavgifter och Posten Norges förtullningsavgift på 299 NOK.',
    initialStats: { patience: 70, margin: 60, clv: 30 },
    scenes: [
      {
        id: 1,
        title: 'Valuta & Moms (VOEC-avtalet)',
        stage: 'Steg 1 av 3: Gränstrygghet',
        scenario: 'Kari surfar in från en norsk IP-adress. Hur presenterar du priser och moms?',
        choices: [
          {
            text: 'Visa priser i SEK och en finstilt text: "Tull och lokal norsk MVA kan tillkomma vid gränsen".',
            impact: { patience: -45, margin: 0, clv: -30 },
            feedback: 'Köpet avbryts! Ingen norsk konsument köper med risk för oväntad tullchock från Posten Norge.'
          },
          {
            text: 'Växla automatiskt till NOK, visa "Alla priser inkl. norsk MVA (VOEC-registrerad) – Inga tullavgifter tillkommer".',
            impact: { patience: +35, margin: +10, clv: +35 },
            feedback: 'Full trygghet! Kari vet exakt vad hon betalar och slipper administrativ förtullningsavgift.'
          }
        ]
      },
      {
        id: 2,
        title: 'Norsk Betallösning',
        stage: 'Steg 2 av 3: Betalningsförtroende',
        scenario: 'Kari kommer till betalsteget. Vad erbjuder du för betalsätt?',
        choices: [
          {
            text: 'Erbjud endast svenskt Swish och manuell kortbetalning med 3D-Secure.',
            impact: { patience: -40, margin: 0, clv: -20 },
            feedback: 'Swish fungerar inte i Norge! Kari tvingas leta efter ett plastkort och avbryter när 3D-Secure krånglar.'
          },
          {
            text: 'Erbjud Vipps (Norges motsvarighet till Swish) samt Klarna/Walley faktura i NOK.',
            impact: { patience: +35, margin: +10, clv: +30 },
            feedback: 'Klockrent! Vipps är den dominerande mobillösningen i Norge med 95% marknadspenetration.'
          }
        ]
      },
      {
        id: 3,
        title: 'Lokal Norsk Logistik',
        stage: 'Steg 3 av 3: Sista Milen i Norge',
        scenario: 'Hur levererar du paketet hem till Karis bostad i Oslo?',
        choices: [
          {
            text: 'Skicka som standard svenskt utrikespaket utan lokal spårning.',
            impact: { patience: -35, margin: -10, clv: -25 },
            feedback: 'Paketet fastnar och tar 9 dagar. Kari ringer er support och kräver retur.'
          },
          {
            text: 'Erbjud Helthjem (levereras på dörrmattan före kl 07:00) eller Posten Norge Pakkebox.',
            impact: { patience: +30, margin: +15, clv: +35 },
            feedback: 'Superupplevelse! Helthjem levererar tyst på natten och jackan ligger utanför dörren till frukosten.'
          }
        ]
      }
    ]
  }
];

export function WinTheCustomerGame() {
  const [computerTheme, setComputerTheme] = useState<'retro' | 'modern'>('retro');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('parent');
  const [gameState, setGameState] = useState<'start' | 'playing' | 'feedback' | 'gameover' | 'victory'>('start');
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [stats, setStats] = useState({ patience: 80, margin: 50, clv: 25 });
  const [lastFeedback, setLastFeedback] = useState<string | null>(null);
  const [completedCases, setCompletedCases] = useState<string[]>([]);

  const activeCase = GAME_CASES.find(c => c.id === selectedCaseId) || GAME_CASES[0];

  const clamp = (val: number) => Math.min(Math.max(val, 0), 100);

  const triggerSound = (type: 'click' | 'success' | 'fail' | 'start') => {
    if (soundEnabled) {
      playRetroBeep(type);
    }
  };

  const handleStartCase = (caseId: string) => {
    const targetCase = GAME_CASES.find(c => c.id === caseId) || GAME_CASES[0];
    setSelectedCaseId(caseId);
    setStats({ ...targetCase.initialStats });
    setCurrentSceneIndex(0);
    setGameState('playing');
    triggerSound('start');
  };

  const handleChoice = (choice: GameChoice) => {
    const newPatience = clamp(stats.patience + choice.impact.patience);
    const newMargin = clamp(stats.margin + choice.impact.margin);
    const newClv = clamp(stats.clv + choice.impact.clv);

    const newStats = {
      patience: newPatience,
      margin: newMargin,
      clv: newClv
    };

    setStats(newStats);
    setLastFeedback(choice.feedback);

    if (newPatience <= 0) {
      setGameState('gameover');
      triggerSound('fail');
    } else {
      setGameState('feedback');
      if (choice.impact.patience > 0) {
        triggerSound('success');
      } else {
        triggerSound('fail');
      }
    }
  };

  const handleNextScene = () => {
    triggerSound('click');
    if (currentSceneIndex + 1 < activeCase.scenes.length) {
      setCurrentSceneIndex(prev => prev + 1);
      setGameState('playing');
    } else {
      setGameState('victory');
      setCompletedCases(prev => prev.includes(activeCase.id) ? prev : [...prev, activeCase.id]);
      triggerSound('success');
    }
  };

  const handleResetToStart = () => {
    triggerSound('click');
    setGameState('start');
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-2 sm:p-4 font-sans select-none">
      
      {/* KONTROLLBAR: TEMA-VÄLJARE & LJUD */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-slate-900/90 border border-slate-800 p-3 rounded-2xl shadow-xl">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Monitor size={15} className="text-indigo-400" /> Dator-simulator:
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

        <div className="flex items-center gap-3">
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
            title="Slå på/av retro 8-bit ljud"
          >
            {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
            <span>Ljud {soundEnabled ? 'PÅ' : 'AV'}</span>
          </button>
        </div>
      </div>

      {/* --- DET INTERAKTIVA DATOR-CHASSIT --- */}
      {computerTheme === 'retro' ? (
        /* ================= 1998 RETRO CRT MONITOR ================= */
        <div className="bg-[#dcd4c0] border-[14px] sm:border-[20px] border-[#c5ba9f] rounded-[2.5rem] p-4 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] text-slate-800 relative">
          
          {/* Fysiskt ventilationsgaller och logotyp */}
          <div className="flex items-center justify-between pb-3 border-b-2 border-[#b3a88e] mb-4 text-[#7d725a] font-mono text-xs">
            <div className="flex items-center gap-3">
              <span className="font-black text-sm tracking-widest text-[#5a523e]">{'CRO-TERMINAL // 386-DX'}</span>
              <span className="hidden sm:inline bg-[#b5aa90] px-2 py-0.5 rounded text-[10px]">66 MHz • 16MB RAM</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex gap-1">
                <span className="w-6 h-1 bg-[#a3977c] rounded-full inline-block" />
                <span className="w-6 h-1 bg-[#a3977c] rounded-full inline-block" />
                <span className="w-6 h-1 bg-[#a3977c] rounded-full inline-block" />
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-ping" />
                <span>POWER ON</span>
              </div>
            </div>
          </div>

          {/* Den böjda CRT-skärmen med scanlines */}
          <div className="bg-[#141d14] border-[10px] sm:border-[16px] border-[#2b352b] rounded-[1.8rem] p-4 sm:p-8 shadow-inner relative overflow-hidden text-[#55ff55] font-mono min-h-[560px] flex flex-col justify-between">
            {/* Scanlines overlay effekt */}
            <div
              className="absolute inset-0 pointer-events-none opacity-20 z-30"
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0px, rgba(0, 0, 0, 0.4) 2px, transparent 2px, transparent 4px)'
              }}
            />
            {/* CRT glasglans/reflektion */}
            <div className="absolute -top-32 -left-32 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none z-30" />

            {/* Skärminnehåll */}
            <div className="relative z-20 flex-1 flex flex-col">
              <GameScreenContent
                theme="retro"
                gameState={gameState}
                activeCase={activeCase}
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
            <div className="relative z-20 pt-4 mt-6 border-t border-[#2d522d] flex flex-wrap items-center justify-between text-[11px] text-[#44aa44]">
              <span>{'C:\\ECOMMERCE\\SURVIVAL.EXE [READY]'}</span>
              <span>LIFT-FRAMEWORK V26.4</span>
              <span>TERMINAL ID: #SE-1998</span>
            </div>
          </div>

          {/* Underdel på CRT: Diskettstation & kontrollknappar */}
          <div className="pt-4 mt-4 flex items-center justify-between text-xs text-[#7d725a] font-mono">
            <div className="flex items-center gap-3">
              {/* 3.5" Diskettstation */}
              <div className="w-28 sm:w-36 h-3 bg-[#b3a88e] border border-[#9b9075] rounded flex items-center justify-between px-2 shadow-inner">
                <span className="w-3 h-1 bg-[#55ff55] inline-block animate-pulse" />
                <span className="text-[9px] text-[#554d38] font-bold">3.5&quot; HD</span>
              </div>
              <span className="hidden sm:inline text-[10px]">FLOPPY READY</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block shadow-sm" />
              <span className="text-[10px] font-bold text-[#554d38]">TURBO MODE</span>
            </div>
          </div>
        </div>
      ) : (
        /* ================= 2026 RETINA PRO WORKSTATION ================= */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-8 shadow-2xl text-slate-100 relative overflow-hidden">
          {/* Toppram: Fönsterkontroller och status */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block shadow-sm" />
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block shadow-sm" />
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block shadow-sm" />
              <span className="ml-3 font-semibold text-slate-300">Checkout Survival Lab OS 2026</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono text-slate-500">
              <span className="bg-indigo-950/60 text-indigo-400 border border-indigo-800/60 px-2.5 py-0.5 rounded-full">
                Neural CRO Engine
              </span>
              <span>120 Hz Retina Pro</span>
            </div>
          </div>

          {/* Skärminnehåll */}
          <div className="min-h-[560px] flex flex-col justify-between">
            <GameScreenContent
              theme="modern"
              gameState={gameState}
              activeCase={activeCase}
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
            <div className="pt-4 mt-8 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-500">
              <span>Svensk E-handelspsykologi • Baymard • NN/g</span>
              <span>CLV &amp; Marginal-simulator</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- SUB-KOMPONENT FÖR SKÄRMINNEHÅLLET (VÄXLAR MELLAN RETRO/MODERN STIL) ---
interface GameScreenProps {
  theme: 'retro' | 'modern';
  gameState: 'start' | 'playing' | 'feedback' | 'gameover' | 'victory';
  activeCase: GameCase;
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
  gameState,
  activeCase,
  stats,
  currentSceneIndex,
  lastFeedback,
  completedCases,
  onStartCase,
  onChoice,
  onNextScene,
  onResetToStart,
  triggerSound
}: GameScreenProps) {
  const isRetro = theme === 'retro';

  // HUD-MÄTARE
  const renderHUD = () => (
    <div className={`grid grid-cols-3 gap-2 sm:gap-4 mb-6 ${isRetro ? 'bg-[#0f170f] p-3 border border-[#2d522d] text-[#55ff55]' : 'bg-slate-950/80 p-3.5 border border-slate-800 rounded-2xl'}`}>
      {/* Tålamod */}
      <div>
        <div className="flex justify-between items-center text-xs mb-1 font-bold">
          <span className="flex items-center gap-1">
            <Heart size={14} className={isRetro ? 'text-[#ff5555]' : 'text-rose-500'} />
            <span className={isRetro ? 'text-[#aaffaa]' : 'text-slate-300'}>Tålamod (HP)</span>
          </span>
          <span className={isRetro ? 'text-[#ffff55]' : 'text-white'}>{stats.patience}%</span>
        </div>
        <div className={`w-full h-2 rounded-full overflow-hidden ${isRetro ? 'bg-[#223322]' : 'bg-slate-800'}`}>
          <div
            className={`h-full transition-all duration-300 ${isRetro ? 'bg-[#55ff55]' : 'bg-rose-500'}`}
            style={{ width: `${stats.patience}%` }}
          />
        </div>
      </div>

      {/* Vinstmarginal */}
      <div>
        <div className="flex justify-between items-center text-xs mb-1 font-bold">
          <span className="flex items-center gap-1">
            <DollarSign size={14} className={isRetro ? 'text-[#55ff55]' : 'text-emerald-500'} />
            <span className={isRetro ? 'text-[#aaffaa]' : 'text-slate-300'}>Marginal</span>
          </span>
          <span className={isRetro ? 'text-[#ffff55]' : 'text-white'}>{stats.margin}%</span>
        </div>
        <div className={`w-full h-2 rounded-full overflow-hidden ${isRetro ? 'bg-[#223322]' : 'bg-slate-800'}`}>
          <div
            className={`h-full transition-all duration-300 ${isRetro ? 'bg-[#55ffff]' : 'bg-emerald-500'}`}
            style={{ width: `${stats.margin}%` }}
          />
        </div>
      </div>

      {/* CLV */}
      <div>
        <div className="flex justify-between items-center text-xs mb-1 font-bold">
          <span className="flex items-center gap-1">
            <Repeat size={14} className={isRetro ? 'text-[#ffff55]' : 'text-indigo-400'} />
            <span className={isRetro ? 'text-[#aaffaa]' : 'text-slate-300'}>CLV / Lojalitet</span>
          </span>
          <span className={isRetro ? 'text-[#ffff55]' : 'text-white'}>{stats.clv}%</span>
        </div>
        <div className={`w-full h-2 rounded-full overflow-hidden ${isRetro ? 'bg-[#223322]' : 'bg-slate-800'}`}>
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
      <div className="space-y-6 animate-in fade-in">
        <div className="text-center max-w-2xl mx-auto py-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3 border font-mono">
            {isRetro ? '>>> MISSIO: E-COMMERCE SURVIVAL <<<' : '★ Välj ditt Head of E-commerce scenario'}
          </div>
          <h2 className={`text-2xl sm:text-4xl font-black tracking-tight ${isRetro ? 'text-[#55ff55]' : 'text-white'}`}>
            {isRetro ? 'VINN KUNDEN: 1998 EDITION' : 'Vinn Kunden!'}
          </h2>
          <p className={`mt-2 text-xs sm:text-sm leading-relaxed ${isRetro ? 'text-[#aaffaa]' : 'text-slate-300'}`}>
            Guiden kunden genom kassan utan att tålamodet tar slut eller din vinstmarginal utplånas. Välj bland fyra verkliga e-handelsfall nedan:
          </p>
        </div>

        {/* KUNDCASE GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {GAME_CASES.map((c) => {
            const isCompleted = completedCases.includes(c.id);
            return (
              <div
                key={c.id}
                className={`p-4 rounded-xl border text-left transition flex flex-col justify-between ${
                  isRetro
                    ? 'bg-[#182618] border-[#2d522d] hover:border-[#55ff55]'
                    : 'bg-slate-800/70 border-slate-700 hover:border-indigo-500 shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className={`font-mono text-[10px] uppercase tracking-wider ${isRetro ? 'text-[#ffff55]' : 'text-indigo-400 font-bold'}`}>
                      {c.badge}
                    </span>
                    {isCompleted && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                        <CheckCircle size={10} /> KLARAD
                      </span>
                    )}
                  </div>
                  <h3 className={`text-base font-bold ${isRetro ? 'text-[#55ff55]' : 'text-white'}`}>
                    {c.title}
                  </h3>
                  <p className={`text-xs mt-1 leading-relaxed ${isRetro ? 'text-[#88cc88]' : 'text-slate-400'}`}>
                    {c.context}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center justify-between">
                  <span className={`text-[11px] ${isRetro ? 'text-[#aaffaa]' : 'text-slate-400'}`}>
                    {c.scenes.length} beslut • {c.difficulty}
                  </span>
                  <button
                    type="button"
                    onClick={() => onStartCase(c.id)}
                    className={`px-4 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
                      isRetro
                        ? 'bg-[#2d522d] hover:bg-[#55ff55] hover:text-black text-[#55ff55] border border-[#55ff55]'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
                    }`}
                  >
                    <Play size={12} /> Spela case
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
      <div className="space-y-6 animate-in fade-in">
        {renderHUD()}

        <div className={`p-4 sm:p-6 rounded-2xl border ${isRetro ? 'bg-[#182618] border-[#2d522d]' : 'bg-slate-800/80 border-slate-700'}`}>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className={`font-mono text-[11px] uppercase tracking-wider ${isRetro ? 'text-[#ffff55]' : 'text-indigo-400 font-bold'}`}>
              {activeCase.title} &bull; {currentScene.stage}
            </span>
            <span className={`text-xs ${isRetro ? 'text-[#aaffaa]' : 'text-slate-400'}`}>
              Scenario #{currentScene.id}
            </span>
          </div>

          <h3 className={`text-xl font-bold mb-3 ${isRetro ? 'text-[#55ff55]' : 'text-white'}`}>
            {currentScene.title}
          </h3>

          <p className={`text-sm sm:text-base leading-relaxed mb-6 ${isRetro ? 'text-[#cceecc]' : 'text-slate-200'}`}>
            {currentScene.scenario}
          </p>

          {/* VALBARA ALTERNATIV */}
          <div className="space-y-3">
            {currentScene.choices.map((choice, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onChoice(choice)}
                className={`w-full text-left p-4 rounded-xl border transition flex items-start gap-3.5 ${
                  isRetro
                    ? 'bg-[#0f170f] border-[#2d522d] hover:border-[#55ff55] hover:bg-[#1a2d1a] text-[#55ff55]'
                    : 'bg-slate-900/90 border-slate-700 hover:border-indigo-500 hover:bg-slate-900 text-slate-200'
                }`}
              >
                <span className={`w-6 h-6 rounded-md font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                  isRetro ? 'bg-[#2d522d] text-[#55ff55] border border-[#55ff55]' : 'bg-indigo-950 text-indigo-400 border border-indigo-800'
                }`}>
                  {['A', 'B', 'C'][idx]}
                </span>
                <span className="text-sm sm:text-base font-medium leading-snug">
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
      <div className="space-y-6 animate-in slide-in-from-bottom-2">
        {renderHUD()}

        <div className={`p-6 sm:p-8 rounded-2xl border text-center ${isRetro ? 'bg-[#182618] border-[#2d522d]' : 'bg-slate-800/90 border-slate-700 shadow-xl'}`}>
          <div className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-4 ${
            isRetro ? 'bg-[#2d522d] text-[#55ff55]' : 'bg-indigo-950 text-indigo-400 border border-indigo-800'
          }`}>
            <Sparkles size={24} />
          </div>

          <h3 className={`text-xl sm:text-2xl font-bold mb-3 ${isRetro ? 'text-[#ffff55]' : 'text-white'}`}>
            Insikt &amp; Konsekvens
          </h3>

          <p className={`text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-8 ${isRetro ? 'text-[#cceecc]' : 'text-slate-300'}`}>
            {lastFeedback}
          </p>

          <button
            type="button"
            onClick={onNextScene}
            className={`px-8 py-3 text-sm font-bold rounded-xl transition inline-flex items-center gap-2 ${
              isRetro
                ? 'bg-[#55ff55] text-black hover:bg-[#88ff88] shadow-lg shadow-green-500/30'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
            }`}
          >
            <span>Fortsätt till nästa steg</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  /* --- GAME OVER (BOUNCE) --- */
  if (gameState === 'gameover') {
    return (
      <div className={`p-6 sm:p-10 rounded-2xl border text-center animate-in zoom-in-95 ${
        isRetro ? 'bg-[#261010] border-[#552222] text-[#ff5555]' : 'bg-rose-950/40 border-rose-900/60 text-rose-200'
      }`}>
        <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 bg-rose-500/20 text-rose-500">
          <AlertTriangle size={36} />
        </div>

        <h3 className={`text-3xl font-black mb-3 ${isRetro ? 'text-[#ff5555]' : 'text-white'}`}>
          Kunden Studsade! (Bounce)
        </h3>

        <p className="text-base sm:text-lg max-w-xl mx-auto mb-6 leading-relaxed">
          Dina beslut skapade för mycket friktion. Kundens tålamod nådde 0 % och de övergav varukorgen (Cart Abandonment).
        </p>

        <p className="text-xs sm:text-sm italic mb-8 opacity-80 max-w-lg mx-auto">
          &ldquo;{lastFeedback}&rdquo;
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => onStartCase(activeCase.id)}
            className={`px-6 py-3 rounded-xl font-bold text-sm transition flex items-center gap-2 ${
              isRetro ? 'bg-[#ff5555] text-black hover:bg-[#ff8888]' : 'bg-rose-600 hover:bg-rose-500 text-white'
            }`}
          >
            <RotateCcw size={16} /> Försök igen med detta case
          </button>
          <button
            type="button"
            onClick={onResetToStart}
            className={`px-6 py-3 rounded-xl font-bold text-sm transition border ${
              isRetro ? 'border-[#ff5555] text-[#ff5555] hover:bg-[#ff5555]/10' : 'border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            Välj annat case
          </button>
        </div>
      </div>
    );
  }

  /* --- VICTORY SCREEN --- */
  if (gameState === 'victory') {
    return (
      <div className={`p-6 sm:p-10 rounded-2xl border text-center animate-in zoom-in-95 ${
        isRetro ? 'bg-[#102610] border-[#225522] text-[#55ff55]' : 'bg-emerald-950/40 border-emerald-900/60 text-emerald-200'
      }`}>
        <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 bg-emerald-500/20 text-emerald-400">
          <CheckCircle size={36} />
        </div>

        <h3 className={`text-3xl font-black mb-3 ${isRetro ? 'text-[#55ff55]' : 'text-white'}`}>
          Grattis! Kunden är din.
        </h3>

        <p className="text-base sm:text-lg max-w-xl mx-auto mb-6 leading-relaxed">
          Du guidade framgångsrikt <strong>{activeCase.title}</strong> genom hela tratten. Rätt psykologiska optimeringsfaktorer skyddade marginalen och maximerade lojaliteten (CLV).
        </p>

        {/* Slutbetyg */}
        <div className={`p-4 rounded-xl max-w-md mx-auto mb-8 border text-left text-xs space-y-2 ${
          isRetro ? 'bg-[#0f170f] border-[#2d522d]' : 'bg-slate-900 border-slate-800'
        }`}>
          <div className="font-bold border-b border-slate-700/50 pb-1 mb-2">SLUTRESULTAT:</div>
          <div className="flex justify-between"><span>Tålamod bevarat:</span> <strong className="text-rose-400">{stats.patience}%</strong></div>
          <div className="flex justify-between"><span>Vinstmarginal:</span> <strong className="text-emerald-400">{stats.margin}%</strong></div>
          <div className="flex justify-between"><span>Långsiktigt CLV:</span> <strong className="text-indigo-400">{stats.clv}%</strong></div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onResetToStart}
            className={`px-8 py-3.5 rounded-xl font-bold text-sm transition flex items-center gap-2 ${
              isRetro ? 'bg-[#55ff55] text-black hover:bg-[#88ff88]' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            <span>Spela fler case</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default WinTheCustomerGame;
