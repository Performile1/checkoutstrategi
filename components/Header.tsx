'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, ShoppingCart, Sun, Moon, ChevronDown } from 'lucide-react';
import { useTheme } from 'next-themes';
import { siteConfig } from '@/lib/site';

type NavItem = {
  href?: string;
  label: string;
  items?: { href: string; label: string }[];
};

export function Header() {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const isDark = (theme === 'system' ? resolvedTheme : theme) === 'dark';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/70 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
      <div className="container-prose flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white">
            <ShoppingCart size={18} />
          </span>
          <span className="text-lg">{siteConfig.name}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-700 dark:text-slate-300">
          {siteConfig.nav.map((item: NavItem) => (
            item.items ? (
              <div key={item.label} className="relative group">
                <button
                  className="flex items-center gap-1 hover:text-brand-600 dark:hover:text-brand-400 transition"
                  onClick={() => setDropdownOpen(dropdownOpen === item.label ? null : item.label)}
                >
                  {item.label}
                  <ChevronDown size={14} />
                </button>
                {dropdownOpen === item.label && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg overflow-hidden z-50">
                    {item.items.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className="block px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                        onClick={() => setDropdownOpen(null)}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link key={item.href} href={item.href!} className="hover:text-brand-600 dark:hover:text-brand-400 transition">
                {item.label}
              </Link>
            )
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            aria-label="Toggle theme"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="rounded-lg border border-slate-200 p-2 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <Link href="/contact" className="hidden md:inline-flex btn-primary">
            Kontakta oss
          </Link>
          <button
            className="md:hidden rounded-lg border border-slate-200 p-2 dark:border-slate-800"
            aria-label="Open menu"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800">
          <div className="container-prose flex flex-col py-3 gap-2">
            {siteConfig.nav.map((item: NavItem) => (
              item.items ? (
                <div key={item.label} className="flex flex-col">
                  <button
                    className="py-2 text-sm font-medium text-left hover:text-brand-600 flex items-center justify-between"
                    onClick={() => setDropdownOpen(dropdownOpen === item.label ? null : item.label)}
                  >
                    {item.label}
                    <ChevronDown size={14} />
                  </button>
                  {dropdownOpen === item.label && (
                    <div className="pl-4 flex flex-col gap-1">
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          onClick={() => { setOpen(false); setDropdownOpen(null); }}
                          className="py-2 text-sm hover:text-brand-600"
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
                  className="py-2 text-sm font-medium hover:text-brand-600"
                >
                  {item.label}
                </Link>
              )
            ))}
            <Link href="/contact" onClick={() => setOpen(false)} className="btn-primary mt-2 justify-center">
              Kontakta oss
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
