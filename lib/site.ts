export const siteConfig = {
  name: 'Checkoutstrategi',
  url: process.env.SITE_URL || 'https://checkoutstrategi.se',
  description:
    'Sveriges oberoende analystjänst för checkout-leverantörer. Djupgående jämförelser, konverterings­data och AI-driven nyhetsbevakning för e-handel.',
  ogImage: '/og.png',
  nav: [
    { href: '/players', label: 'Players' },
    { href: '/comparison', label: 'Jämförelse' },
    { href: '/testcheckout', label: 'Checkout Lab' },
    { href: '/blog', label: 'Blogg' },
    { href: '/guides', label: 'Strategiguider' },
  ],
  contactEmail: 'hej@checkoutstrategi.se',
};

export type SiteConfig = typeof siteConfig;
