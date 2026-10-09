export const siteConfig = {
  name: 'Checkoutstrategi',
  url: process.env.SITE_URL || 'https://checkoutstrategi.se',
  description:
    'Sveriges oberoende analystjänst för checkout-leverantörer. Djupgående jämförelser, konverteringsdata och AI-driven nyhetsbevakning för e-handel.',
  ogImage: '/og.png',
  nav: [
    { href: '/players', label: 'Aktörer' },
    { 
      label: 'Jämförelser', 
      items: [
        { href: '/comparison', label: 'Alla jämförelser' },
        { href: '/compare/klarna-vs-walley', label: 'Klarna vs Walley' },
        { href: '/compare/klarna-vs-qliro', label: 'Klarna vs Qliro' },
        { href: '/compare/walley-vs-qliro', label: 'Walley vs Qliro' },
      ]
    },
    { 
      label: 'Lab & Verktyg',
      items: [
        { href: '/testcheckout', label: 'Checkout Lab (Kassa-simulator)' },
        { href: '/tracking', label: 'CRO i Tracking & Retention' },
        { href: '/spela', label: 'Vinn Kunden! (Överlevnadsspel)' },
        { href: '/email-campaigns', label: 'Mailutskick & CRO' },
      ]
    },
    { href: '/blog', label: 'Blogg' },
    { href: '/links', label: 'Resurser & Länkar' },
    { 
      label: 'Strategiguider',
      items: [
        { href: '/guides', label: 'Alla strategiguider' },
        { href: '/guides/empirisk-data', label: 'Empirisk forskningsdata' },
        { href: '/guides/cro-checkout', label: 'CRO i kassan' },
        { href: '/guides/delivery-experience', label: 'Delivery Experience' },
        { href: '/guides/checkout-analys-2026', label: 'Checkoutanalys 2026' },
      ]
    },
  ],
  contactEmail: 'hej@checkoutstrategi.se',
};

export function getSiteConfig(locale: 'sv' | 'en' = 'sv') {
  if (locale === 'en') {
    return {
      name: 'Checkout Strategy',
      url: 'https://checkoutstrategy.com',
      description:
        'Independent checkout intelligence, CRO benchmarks, and post-purchase strategy for modern e-commerce leaders.',
      ogImage: '/og.png',
      contactEmail: 'hello@checkoutstrategy.com',
    };
  }
  return siteConfig;
}

export type SiteConfig = typeof siteConfig;
