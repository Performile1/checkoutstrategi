'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, ShoppingCart, Sun, Moon, ChevronDown } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useLanguage } from '@/lib/i18n/context';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

type NavItem = {
  href?: string;
  label: string;
  items?: { href: string; label: string }[];
};

export function Header() {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { t, domain, isEnglish } = useLanguage();
  const isDark = (theme === 'system' ? resolvedTheme : theme) === 'dark';

  const navItems: NavItem[] = [
    { href: '/players', label: t.nav.players },
    {
      label: t.nav.comparisons,
      items: [
        { href: '/comparison', label: t.nav.allComparisons },
        { href: '/compare/klarna-vs-walley', label: 'Klarna vs Walley' },
        { href: '/compare/klarna-vs-qliro', label: 'Klarna vs Qliro' },
        { href: '/compare/walley-vs-qliro', label: 'Walley vs Qliro' },
      ],
    },
    {
      label: t.nav.labAndTools,
      items: [
        { href: '/testcheckout', label: t.nav.checkoutLab },
        { href: '/tracking', label: t.nav.trackingCro },
        { href: '/spela', label: t.nav.winTheCustomer },
        { href: '/email-campaigns', label: t.nav.emailCampaigns },
      ],
    },
    { href: '/blog', label: t.nav.blog },
    { href: '/links', label: t.nav.resourcesAndLinks },
    {
      label: t.nav.strategyGuides,
      items: [
        { href: '/guides', label: t.nav.allGuides },
        { href: '/guides/empirisk-data', label: t.nav.empiricalData },
        { href: '/guides/cro-checkout', label: t.nav.croCheckout },
        { href: '/guides/delivery-experience', label: t.nav.deliveryExperience },
        { href: '/guides/checkout-analys-2026', label: t.nav.checkoutAnalysis },
      ],
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/70 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
      <div className="container-prose flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight shrink-0">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white shadow-sm">
            <ShoppingCart size={18} />
          </span>
          <div className="flex flex-col">
            <span className="text-lg leading-tight font-black">{t.brandName}</span>
            <span className="text-[10px] text-slate-400 font-mono hidden sm:inline leading-none">
              {domain}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-700 dark:text-slate-300">
          {navItems.map((item: NavItem) =>
            item.items ? (
              <div key={item.label} className="relative group">
                <button
                  type="button"
                  className="flex items-center gap-1 hover:text-brand-600 dark:hover:text-brand-400 transition py-1"
                  onClick={() => setDropdownOpen(dropdownOpen === item.label ? null : item.label)}
                >
                  <span>{item.label}</span>
                  <ChevronDown size={14} />
                </button>
                {dropdownOpen === item.label && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden z-50 py-1 animate-in fade-in slide-in-from-top-1">
                    {item.items.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className="block px-4 py-2 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-brand-600 transition"
                        onClick={() => setDropdownOpen(null)}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href!}
                className="hover:text-brand-600 dark:hover:text-brand-400 transition"
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        {/* Right Action Icons: Language Switcher, Theme Toggle, Contact */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Theme Toggle */}
          <button
            aria-label="Toggle theme"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="rounded-xl border border-slate-200 p-2 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition"
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Contact Us CTA */}
          <Link href="/contact" className="hidden sm:inline-flex btn-primary text-xs font-bold px-4 py-2">
            {t.nav.contactUs}
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden rounded-xl border border-slate-200 p-2 dark:border-slate-800"
            aria-label="Open menu"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur">
          <div className="container-prose flex flex-col py-4 gap-2">
            {/* Mobile Language Switcher row */}
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-500">
                {isEnglish ? 'Select Language / Domain:' : 'Välj Språk / Domän:'}
              </span>
              <LanguageSwitcher />
            </div>

            {navItems.map((item: NavItem) =>
              item.items ? (
                <div key={item.label} className="flex flex-col">
                  <button
                    type="button"
                    className="py-2 text-sm font-semibold text-left hover:text-brand-600 flex items-center justify-between"
                    onClick={() => setDropdownOpen(dropdownOpen === item.label ? null : item.label)}
                  >
                    <span>{item.label}</span>
                    <ChevronDown size={14} className={dropdownOpen === item.label ? 'rotate-180 transition' : 'transition'} />
                  </button>
                  {dropdownOpen === item.label && (
                    <div className="pl-4 flex flex-col gap-1 border-l-2 border-slate-200 dark:border-slate-800 ml-2 my-1">
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          onClick={() => {
                            setOpen(false);
                            setDropdownOpen(null);
                          }}
                          className="py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-brand-600"
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href!}
                  onClick={() => setOpen(false)}
                  className="py-2 text-sm font-semibold hover:text-brand-600"
                >
                  {item.label}
                </Link>
              )
            )}

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 mt-2">
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="btn-primary w-full text-center text-xs py-2.5 font-bold"
              >
                {t.nav.contactUs}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
