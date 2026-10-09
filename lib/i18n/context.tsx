'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Locale, SiteTranslations } from './types';
import { translations } from './translations';

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: SiteTranslations;
  isEnglish: boolean;
  domain: string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function getInitialLocale(defaultLocale: Locale = 'sv'): Locale {
  if (typeof window === 'undefined') return defaultLocale;

  // 1. URL search param: ?lang=en or ?lang=sv
  const urlParams = new URLSearchParams(window.location.search);
  const paramLang = urlParams.get('lang');
  if (paramLang === 'en' || paramLang === 'sv') {
    return paramLang;
  }

  // 2. Hostname check (.com vs .se)
  const host = window.location.hostname.toLowerCase();
  const isCom = host.includes('checkoutstrategy.com') || host.endsWith('.com');
  const isSe = host.includes('checkoutstrategi.se') || host.endsWith('.se');

  // 3. Cookie NEXT_LOCALE
  const match = document.cookie.match(/(?:^|;\s*)NEXT_LOCALE=([^;]+)/);
  if (match && (match[1] === 'en' || match[1] === 'sv')) {
    return match[1] as Locale;
  }

  if (isCom) return 'en';
  if (isSe) return 'sv';

  // 4. HTML lang attribute
  const htmlLang = document.documentElement.lang;
  if (htmlLang === 'en' || htmlLang === 'sv') {
    return htmlLang as Locale;
  }

  return defaultLocale;
}

export function LanguageProvider({
  children,
  initialLocale = 'sv',
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  // Sync with client-side detection on mount
  useEffect(() => {
    const detected = getInitialLocale(initialLocale);
    if (detected !== locale) {
      setLocaleState(detected);
    }
  }, [initialLocale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== 'undefined') {
      // Save cookie for 1 year
      document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000;SameSite=Lax`;
      document.documentElement.lang = newLocale;

      // Also support query param if user arrived with one
      const url = new URL(window.location.href);
      if (url.searchParams.has('lang')) {
        url.searchParams.set('lang', newLocale);
        window.history.replaceState({}, '', url.toString());
      }
    }
  };

  const domain = useMemo(() => {
    return locale === 'en' ? 'checkoutstrategy.com' : 'checkoutstrategi.se';
  }, [locale]);

  const value = useMemo<LanguageContextValue>(() => {
    return {
      locale,
      setLocale,
      t: translations[locale] || translations.sv,
      isEnglish: locale === 'en',
      domain,
    };
  }, [locale, domain]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback to Swedish if rendered outside provider
    return {
      locale: 'sv' as Locale,
      setLocale: () => {},
      t: translations.sv,
      isEnglish: false,
      domain: 'checkoutstrategi.se',
    };
  }
  return context;
}

export function useTranslation() {
  return useLanguage().t;
}
