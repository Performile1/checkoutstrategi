'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Trophy, HelpCircle, BookOpen } from 'lucide-react';
import { WinTheCustomerGame } from '@/components/WinTheCustomer';
import { useLanguage } from '@/lib/i18n/context';

export default function SpelaPage() {
  const { isEnglish } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Navigation & breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/testcheckout"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition"
          >
            <ArrowLeft size={16} /> {isEnglish ? 'Back to Checkout Lab' : 'Tillbaka till CheckoutLab'}
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/guides/cro-checkout"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition bg-indigo-950/60 px-3 py-1.5 rounded-lg border border-indigo-800/50"
            >
              <BookOpen size={14} /> {isEnglish ? 'Read 12 Optimization Levers' : 'Läs 12 Optimeringsfaktorer'}
            </Link>
          </div>
        </div>

        {/* Hero header */}
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-3">
            <Sparkles size={14} /> {isEnglish ? 'Interactive Workstation Simulator • 6 Realistic Cases' : 'Interaktiv Dator-Simulator • 6 E-handelsfall'}
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {isEnglish ? 'Win The Customer!' : 'Vinn Kunden!'}
          </h1>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            {isEnglish
              ? 'An interactive decision game for E-commerce Directors. Play in modern 2026 Retina Pro mode or boot up the 1998 CRT Classic workstation with nostalgic scanlines and 8-bit sound effects!'
              : 'Ett interaktivt scenariobaserat överlevnadsspel för Head of E-commerce. Spela i en toppmodern 2026 Retina Pro-dator eller koppla på 1998 CRT Classic med nostalgiska scanlines och 8-bit ljud!'}
          </p>
        </div>

        {/* Game Container */}
        <div className="relative">
          <WinTheCustomerGame />
        </div>

        {/* Pedagogisk fotnot om LIFT-modellen */}
        <div className="mt-16 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-8 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 text-amber-400 mb-3">
            <HelpCircle size={20} />
            <h3 className="font-bold text-white text-base">
              {isEnglish ? 'Psychology Behind the Decisions: The LIFT Model' : 'Psykologin bakom besluten: LIFT-modellen'}
            </h3>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed mb-4">
            {isEnglish
              ? "Every dilemma in the game is anchored in Chris Goward's empirical LIFT Model:"
              : 'Varje scenario i spelet bygger på Chris Gowards empiriska LIFT-modell:'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50">
              <span className="font-bold text-emerald-400 block mb-1">
                {isEnglish ? 'Value & Relevance' : 'Värde & Relevans'}
              </span>
              {isEnglish
                ? 'Are you showing exactly what the shopper values (e.g. guaranteed delivery tomorrow rather than vague multi-day estimates)?'
                : 'Visar du exakt vad kunden söker (t.ex. leverans imorgon istället för vaga dagar)?'}
            </div>
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50">
              <span className="font-bold text-amber-400 block mb-1">
                {isEnglish ? 'Reduce Friction' : 'Minska Friktion (Friction)'}
              </span>
              {isEnglish
                ? 'Autofill and pre-validated postal codes save mobile shoppers 40 seconds and salvage the purchase.'
                : 'Autofill och förifyllt postnummer sparar mobilkunden 40 sekunder och räddar köpet.'}
            </div>
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50">
              <span className="font-bold text-rose-400 block mb-1">
                {isEnglish ? 'Eliminate Anxiety' : 'Radera Ångest (Anxiety)'}
              </span>
              {isEnglish
                ? 'Unexpected shipping costs sprung at the final step trigger acute anxiety and 48% cart abandonment.'
                : 'Dolda fraktkostnader i sista steget skapar akut ångest och 48% varukorgsavhopp.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
