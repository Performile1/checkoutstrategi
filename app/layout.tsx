import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';
import { LanguageProvider } from '@/lib/i18n/context';
import { siteConfig } from '@/lib/site';
import type { Locale } from '@/lib/i18n/types';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} – Sveriges checkout-analystjänst | Checkout Strategy`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'checkout', 'klarna', 'walley', 'qliro', 'kustom', 'ingrid', 'nshift',
    'konvertering', 'CRO', 'e-handel', 'one-click checkout', 'checkout strategy',
    'conversion rate optimization', 'post-purchase', 'ambassadorflow'
  ],
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: 'sv_SE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
  },
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': [{ url: '/rss.xml', title: `${siteConfig.name} RSS` }],
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const initialLocale: Locale = 'sv';

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    sameAs: [],
  };

  return (
    <html lang={initialLocale} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased">
        <LanguageProvider initialLocale={initialLocale}>
          <ThemeProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </ThemeProvider>
        </LanguageProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </body>
    </html>
  );
}
