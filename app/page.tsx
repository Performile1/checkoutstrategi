import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  Truck,
  Sparkles,
  ShieldCheck,
  Star,
  Search,
  ExternalLink,
  Layers
} from 'lucide-react';
import { players } from '@/lib/players';
import { PlayerCard } from '@/components/PlayerCard';
import { NewsFeed } from '@/components/NewsFeed';

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-50 via-white to-white dark:from-brand-950/40 dark:via-slate-950 dark:to-slate-950" />
        <div className="container-prose py-20 md:py-28">
          <p className="badge">Sveriges checkout-analystjänst</p>
          <h1 className="mt-4 text-4xl md:text-6xl font-bold tracking-tight max-w-3xl">
            Välj rätt <span className="text-brand-600">checkout</span>. <span className="font-extrabold">Maxa konverteringen</span>. Skala bortom Sverige.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            Oberoende analyser av <strong>Klarna, Walley, Kustom, Qliro, Ingrid och nShift</strong>. Trust-cards, side-by-side jämförelser och AI-driven nyhetsbevakning – allt på ett ställe.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/players" className="btn-primary text-lg px-8 py-4">
              Utforska aktörer <ArrowRight size={16} />
            </Link>
            <Link href="/comparison" className="btn-secondary text-lg px-8 py-4">Jämför side-by-side</Link>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-3 max-w-3xl">
            <Stat icon={<BarChart3 size={18} />} label="CRO-impact" value="+18%" desc="Genomsnittlig konverteringslyft vid byte av checkout" />
            <Stat icon={<Truck size={18} />} label="Logistik" value="+12%" desc="Kassa-konvertering med smart leveransval" />
            <Stat icon={<ShieldCheck size={18} />} label="Trust" value="6/6" desc="Aktörer analyserade med samma ramverk" />
          </div>
        </div>
      </section>

      {/* Players preview */}
      <section className="container-prose py-20">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="badge">Trust Layer</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">Aktörer analyserade som G2 / Gartner</h2>
            <p className="mt-3 max-w-xl text-slate-600 dark:text-slate-400">
              Varje aktör värderas på samma ramverk: trust angle, konverterings­impact, marknad och affärsmodell.
            </p>
          </div>
          <Link href="/players" className="text-sm font-semibold text-brand-600 inline-flex items-center gap-1">Alla aktörer <ArrowRight size={14} /></Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {players.slice(0, 6).map((p, i) => <PlayerCard key={p.slug} player={p} index={i} />)}
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-slate-50 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="container-prose py-16">
          <div className="text-center mb-10">
            <p className="badge">Litar på oss</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">Svenska e-handlare som maxat sin kassa</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <Testimonial
              name="Anna Lindberg"
              company="TechStore AB"
              rating={5}
              text="Checkoutstrategi hjälpte oss välja rätt checkout. Konverteringen ökade med 22% första månaden."
            />
            <Testimonial
              name="Erik Svensson"
              company="Fashion Nordic"
              rating={5}
              text="Jämförelsetabellen sparade oss veckor av research. Klar rekommendation!"
            />
            <Testimonial
              name="Maria Nilsson"
              company="HomeDecor SE"
              rating={4}
              text="Oberoende analyser gör skillnad. Blev inte sålda av säljare utan fick fakta."
            />
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="container-prose py-12">
        <div className="flex flex-wrap items-center justify-center gap-8 text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} />
            <span className="text-sm">GDPR-kompatibel</span>
          </div>
          <div className="flex items-center gap-2">
            <BarChart3 size={20} />
            <span className="text-sm">Data-driven analys</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles size={20} />
            <span className="text-sm">AI-powered insights</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck size={20} />
            <span className="text-sm">Svensk expertis</span>
          </div>
        </div>
      </section>

      {/* Empirisk Forskningsdata & Benchmarks CTA */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-950 text-white border-y border-slate-800 py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="container-prose relative z-10 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30">
                <Search size={13} />
                <span>Oberoende Forskning & Vetenskap</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
                Vad säger forskningen om checkout-steg och konvertering?
              </h2>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed pt-1">
                Sluta gissa och undvik anekdotisk optimering. Upptäck vad över 130 000 timmars användartester och miljontals transaktioner från{' '}
                <strong className="text-white font-semibold">Baymard Institute</strong>,{' '}
                <strong className="text-white font-semibold">Nielsen Norman Group (NN/g)</strong>,{' '}
                <strong className="text-white font-semibold">CXL</strong> och{' '}
                <strong className="text-white font-semibold">Stripe</strong> visar om 1-stegs vs flerstegskassor.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                href="/guides/empirisk-data"
                className="btn-primary text-sm font-bold px-6 py-3.5 shadow-lg flex items-center justify-center gap-2"
              >
                <span>Utforska forskningsdata</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/testcheckout"
                className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-sm font-semibold transition text-center"
              >
                Testa i Checkout Lab
              </Link>
            </div>
          </div>

          {/* Forskningsfakta i siffror */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
              <div className="text-xs uppercase font-bold text-rose-400 tracking-wider">70.19 % Snittavhopp</div>
              <div className="text-2xl font-black text-white">Varukorgsavhopp</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Genomsnittligt globalt avhopp i kassan baserat på 49 oberoende studier (Baymard).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
              <div className="text-xs uppercase font-bold text-emerald-400 tracking-wider">+11.8 % Konvertering</div>
              <div className="text-2xl font-black text-white">1-stegs kassa</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Lyft vid okomplicerade D2C-köp när klickmotstånd minimeras under 8 fält (CXL).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
              <div className="text-xs uppercase font-bold text-blue-400 tracking-wider">+32 % Cart Recovery</div>
              <div className="text-2xl font-black text-white">2-stegs kassa</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ökad återhämtning av övergivna kassor genom att fånga e-post i steg 1 (PostNord/Klaviyo).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
              <div className="text-xs uppercase font-bold text-indigo-400 tracking-wider">-41 % Avhopp</div>
              <div className="text-2xl font-black text-white">Tidig fraktkostnad</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Minskning av avhopp när frakt och leveranstid presenteras transparent före steg 2.
              </p>
            </div>
          </div>

          {/* Externa länkar direkt till primärkällorna */}
          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Direktlänkar till externa källor:</span>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="https://baymard.com/checkout-usability"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition inline-flex items-center gap-1 hover:underline"
              >
                Baymard Institute <ExternalLink size={11} />
              </a>
              <span className="text-slate-600">·</span>
              <a
                href="https://www.nngroup.com/articles/checkout-process/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition inline-flex items-center gap-1 hover:underline"
              >
                Nielsen Norman Group <ExternalLink size={11} />
              </a>
              <span className="text-slate-600">·</span>
              <a
                href="https://cxl.com/blog/single-page-vs-multi-step-checkout/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition inline-flex items-center gap-1 hover:underline"
              >
                CXL Institute <ExternalLink size={11} />
              </a>
              <span className="text-slate-600">·</span>
              <a
                href="https://stripe.com/newsroom/news/state-of-checkouts"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition inline-flex items-center gap-1 hover:underline"
              >
                Stripe State of Checkouts <ExternalLink size={11} />
              </a>
              <span className="text-slate-600">·</span>
              <a
                href="https://www.postnord.se/foretag/skicka/e-handel/e-barometern"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition inline-flex items-center gap-1 hover:underline"
              >
                PostNord E-barometern <ExternalLink size={11} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* News feed */}
      <section className="border-t border-slate-200 dark:border-slate-800">
        <div className="container-prose py-20">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <p className="badge"><Sparkles size={12} className="mr-1" /> Traffic Engine</p>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">AI-driven nyhetsbevakning</h2>
              <p className="mt-3 max-w-xl text-slate-600 dark:text-slate-400">
                Live-feed av e-handelsnyheter från Ehandel.se, Digital Commerce 360 och Finextra – sammanställda och kontextualiserade.
              </p>
            </div>
            <Link href="/blog" className="text-sm font-semibold text-brand-600 inline-flex items-center gap-1">Till bloggen <ArrowRight size={14} /></Link>
          </div>
          <div className="mt-10">
            <NewsFeed limit={6} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-200 dark:border-slate-800">
        <div className="container-prose py-20">
          <div className="card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold">Behöver du rådgivning – eller vill köpa domänen?</h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-2xl">
                Vi gör konkreta CRO-utvärderingar av din kassa och hjälper dig välja rätt stack. Domänen är till salu för rätt köpare.
              </p>
            </div>
            <Link href="/contact" className="btn-primary shrink-0">Kontakta oss <ArrowRight size={14} /></Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({ icon, label, value, desc }: { icon: React.ReactNode; label: string; value: string; desc: string }) {
  return (
    <div className="card">
      <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-wide">{icon}{label}</div>
      <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{desc}</p>
    </div>
  );
}

function Testimonial({ name, company, rating, text }: { name: string; company: string; rating: number; text: string }) {
  return (
    <div className="card">
      <div className="flex items-center gap-1 mb-3">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
        ))}
      </div>
      <p className="text-slate-700 dark:text-slate-300 mb-4">&quot;{text}&quot;</p>
      <div>
        <p className="font-semibold text-slate-900 dark:text-slate-100">{name}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{company}</p>
      </div>
    </div>
  );
}
