import type { Metadata } from 'next';
import { Mail, Globe, Sparkles } from 'lucide-react';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Kontakt & Köp domän – Konsultation om checkout',
  description: 'Få en CRO-utvärdering av din kassa eller lämna ett bud på domänen checkoutstrategi.se.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  const formspree = process.env.FORMSPREE_ENDPOINT;
  const isStatic = process.env.EXPORT === '1';
  // In static export there is no /api/contact. Only render the form if we can
  // post somewhere real; otherwise we show a clean mailto fallback.
  const action = formspree || (isStatic ? null : '/api/contact');

  return (
    <section className="container-prose py-16">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <p className="badge">Lead magnet</p>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">Kontakta oss</h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Vi erbjuder två typer av samtal:
          </p>
          <ul className="mt-6 space-y-4 text-sm">
            <li className="card"><strong className="flex items-center gap-2"><Sparkles size={16} className="text-brand-500" /> Checkout-konsultation</strong><p className="mt-2 text-slate-600 dark:text-slate-400">30 minuter där vi går igenom din nuvarande kassa och identifierar top-3 konverteringsspakar.</p></li>
            <li className="card"><strong className="flex items-center gap-2"><Globe size={16} className="text-brand-500" /> Köp domänen checkoutstrategi.se</strong><p className="mt-2 text-slate-600 dark:text-slate-400">Domän + site + trafikkälla i "high-intent fintech"-segmentet. Öppet för bud från verksamma aktörer eller byråer.</p></li>
          </ul>

          <p className="mt-6 text-sm text-slate-500 flex items-center gap-2">
            <Mail size={14} /> Föredrar du mejl? <a href={`mailto:${siteConfig.contactEmail}`} className="text-brand-600 hover:underline">{siteConfig.contactEmail}</a>
          </p>
        </div>

        {action === null ? (
          <div className="card space-y-4">
            <p className="badge">Statisk export</p>
            <h2 className="text-lg font-semibold">Formulär är inte aktiverat på denna deploy</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Sajten körs i statiskt läge utan formulär-backend. Sätt <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">FORMSPREE_ENDPOINT</code> i
              {' '}<code className="rounded bg-slate-100 px-1 dark:bg-slate-800">.env</code> innan du kör <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">npm run build:static</code>,
              eller mejla oss direkt:
            </p>
            <a
              href={`mailto:${siteConfig.contactEmail}?subject=F%C3%B6rfr%C3%A5gan%20via%20checkoutstrategi.se`}
              className="btn-primary inline-flex"
            >
              <Mail size={14} /> {siteConfig.contactEmail}
            </a>
          </div>
        ) : (
        <form action={action as string} method="POST" className="card space-y-5">
          <div>
            <label className="text-sm font-medium">Namn</label>
            <input name="name" required className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" />
          </div>
          <div>
            <label className="text-sm font-medium">E-post</label>
            <input type="email" name="email" required className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" />
          </div>
          <div>
            <label className="text-sm font-medium">Företag</label>
            <input name="company" className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" />
          </div>
          <div>
            <label className="text-sm font-medium">Typ av förfrågan</label>
            <select name="intent" className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950">
              <option value="consultation">Checkout-konsultation</option>
              <option value="domain">Köp av domän</option>
              <option value="partnership">Partnerskap / affiliate</option>
              <option value="other">Annat</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Meddelande</label>
            <textarea name="message" rows={5} required className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" />
          </div>
          <button type="submit" className="btn-primary w-full justify-center">Skicka förfrågan</button>
          <p className="text-xs text-slate-500">Vi svarar inom 1 arbetsdag.</p>
        </form>
        )}
      </div>
    </section>
  );
}
