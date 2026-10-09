'use client';

import React from 'react';
import { Mail, Globe, Sparkles } from 'lucide-react';
import { siteConfig } from '@/lib/site';
import { useLanguage } from '@/lib/i18n/context';

export default function ContactPage() {
  const { isEnglish, domain, t } = useLanguage();
  const formspree = process.env.FORMSPREE_ENDPOINT;
  const isStatic = process.env.EXPORT === '1';
  const action = formspree || (isStatic ? null : '/api/contact');

  const contactEmail = isEnglish ? 'hello@checkoutstrategy.com' : siteConfig.contactEmail;

  return (
    <section className="container-prose py-16">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <p className="badge">{isEnglish ? 'Inquiries & Advisory' : 'Lead magnet'}</p>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
            {isEnglish ? 'Contact Us' : 'Kontakta oss'}
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            {isEnglish
              ? 'We offer two primary advisory conversations:'
              : 'Vi erbjuder två typer av samtal:'}
          </p>
          <ul className="mt-6 space-y-4 text-sm">
            <li className="card">
              <strong className="flex items-center gap-2">
                <Sparkles size={16} className="text-brand-500" />
                {isEnglish ? 'Checkout CRO Advisory' : 'Checkout-konsultation'}
              </strong>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                {isEnglish
                  ? '30-minute audit where we review your live checkout funnel and identify your top 3 conversion optimization levers.'
                  : '30 minuter där vi går igenom din nuvarande kassa och identifierar top-3 optimeringsfaktorer.'}
              </p>
            </li>
            <li className="card">
              <strong className="flex items-center gap-2">
                <Globe size={16} className="text-brand-500" />
                {isEnglish ? `Acquire domain portfolio (${domain})` : 'Köp domänen checkoutstrategi.se'}
              </strong>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                {isEnglish
                  ? 'Premium domain portfolio (.se & .com) with pre-built high-intent e-commerce traffic. Open to bids from fintech providers or agencies.'
                  : 'Domän + site + trafikkälla i "high-intent fintech"-segmentet. Öppet för bud från verksamma aktörer eller byråer.'}
              </p>
            </li>
          </ul>

          <p className="mt-6 text-sm text-slate-500 flex items-center gap-2">
            <Mail size={14} />{' '}
            {isEnglish ? 'Prefer direct email?' : 'Föredrar du mejl?'}{' '}
            <a href={`mailto:${contactEmail}`} className="text-brand-600 hover:underline">
              {contactEmail}
            </a>
          </p>
        </div>

        {action === null ? (
          <div className="card space-y-4">
            <p className="badge">{isEnglish ? 'Static Mode' : 'Statisk export'}</p>
            <h2 className="text-lg font-semibold">
              {isEnglish ? 'Form submission fallback' : 'Formulär är inte aktiverat på denna deploy'}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {isEnglish ? 'Email us directly:' : 'Mejla oss direkt:'}
            </p>
            <a
              href={`mailto:${contactEmail}?subject=Inquiry%20via%20${domain}`}
              className="btn-primary inline-flex"
            >
              <Mail size={14} /> {contactEmail}
            </a>
          </div>
        ) : (
          <form action={action as string} method="POST" className="card space-y-5">
            <div>
              <label className="text-sm font-medium">{isEnglish ? 'Full Name' : 'Namn'}</label>
              <input
                name="name"
                required
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
              />
            </div>
            <div>
              <label className="text-sm font-medium">{isEnglish ? 'Work Email' : 'E-post'}</label>
              <input
                type="email"
                name="email"
                required
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
              />
            </div>
            <div>
              <label className="text-sm font-medium">{isEnglish ? 'Company' : 'Företag'}</label>
              <input
                name="company"
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
              />
            </div>
            <div>
              <label className="text-sm font-medium">{isEnglish ? 'Inquiry Type' : 'Typ av förfrågan'}</label>
              <select
                name="intent"
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
              >
                <option value="consultation">
                  {isEnglish ? 'Checkout CRO Consultation' : 'Checkout-konsultation'}
                </option>
                <option value="domain">
                  {isEnglish ? 'Domain Acquisition' : 'Köp av domän'}
                </option>
                <option value="partnership">
                  {isEnglish ? 'Partnership / Affiliation' : 'Partnerskap / affiliate'}
                </option>
                <option value="other">
                  {isEnglish ? 'Other' : 'Annat'}
                </option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">{isEnglish ? 'Message' : 'Meddelande'}</label>
              <textarea
                name="message"
                rows={5}
                required
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
              />
            </div>
            <button type="submit" className="btn-primary w-full justify-center">
              {isEnglish ? 'Submit Inquiry' : 'Skicka förfrågan'}
            </button>
            <p className="text-xs text-slate-500">
              {isEnglish ? 'We respond within 1 business day.' : 'Vi svarar inom 1 arbetsdag.'}
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
