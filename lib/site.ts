export const siteConfig = {
  name: 'Checkoutstrategi',
  url: process.env.SITE_URL || 'https://checkoutstrategi.se',
  description:
    'Sveriges oberoende analystjänst för checkout-leverantörer. Djupgående jämförelser, konverterings­data och AI-driven nyhetsbevakning för e-handel.',
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
    { href: '/testcheckout', label: 'Checkout Lab' },
    { href: '/blog', label: 'Blogg' },
    { href: '/guides', label: 'Strategiguider' },
  ],
  contactEmail: 'hej@checkoutstrategi.se',
};

export type SiteConfig = typeof siteConfig;
