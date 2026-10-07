/**
 * Next.js config for Vercel deployment with Supabase
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  async redirects() {
    return [
      {
        source: '/checkoutlab',
        destination: '/testcheckout',
        permanent: true,
      },
      {
        source: '/checkout-lab',
        destination: '/testcheckout',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
