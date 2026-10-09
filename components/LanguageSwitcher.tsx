'use client';

import React from 'react';
import { useLanguage } from '@/lib/i18n/context';

interface LanguageSwitcherProps {
  variant?: 'compact' | 'segmented';
  className?: string;
}

export function LanguageSwitcher({ variant = 'segmented', className = '' }: LanguageSwitcherProps) {
  const { locale, setLocale, domain } = useLanguage();

  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={() => setLocale(locale === 'sv' ? 'en' : 'sv')}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition ${
          locale === 'en'
            ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300'
            : 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300'
        } ${className}`}
        title={`Växla till ${locale === 'sv' ? 'English (checkoutstrategy.com)' : 'Svenska (checkoutstrategi.se)'}`}
      >
        <span className="text-sm">{locale === 'sv' ? '🇸🇪' : '🇬🇧'}</span>
        <span className="uppercase font-bold tracking-wider">{locale}</span>
      </button>
    );
  }

  return (
    <div
      className={`inline-flex items-center bg-slate-100 dark:bg-slate-900 p-0.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold ${className}`}
      role="group"
      aria-label="Language selection"
    >
      <button
        type="button"
        onClick={() => setLocale('sv')}
        className={`px-2 py-1 rounded-lg transition-all flex items-center gap-1 ${
          locale === 'sv'
            ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-bold'
            : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
        }`}
        title="Svenska (checkoutstrategi.se)"
      >
        <span>🇸🇪</span>
        <span>SV</span>
      </button>

      <button
        type="button"
        onClick={() => setLocale('en')}
        className={`px-2 py-1 rounded-lg transition-all flex items-center gap-1 ${
          locale === 'en'
            ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-bold'
            : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
        }`}
        title="English (checkoutstrategy.com)"
      >
        <span>🇬🇧</span>
        <span>EN</span>
      </button>
    </div>
  );
}
