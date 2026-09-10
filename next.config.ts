import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // Leftover URLs from the site's previous version, still receiving real traffic
    // (confirmed via GA4) — send visitors to the closest equivalent on the current site
    // instead of a dead page.
    return [
      { source: "/c%C3%B3pia-emm-manaus", destination: "/manaus", permanent: true },
      { source: "/cpia-emm-manaus", destination: "/manaus", permanent: true },
      { source: "/c%C3%B3pia-emm-bel%C3%A9m", destination: "/belem", permanent: true },
      { source: "/cpia-emm-belm", destination: "/belem", permanent: true },
      { source: "/sobre-o-evento", destination: "/", permanent: true },
      { source: "/o-evento", destination: "/", permanent: true },
      { source: "/c%C3%B3pia-sobre-o-evento", destination: "/", permanent: true },
      { source: "/cpia-sobre-o-evento", destination: "/", permanent: true },
      { source: "/contact", destination: "/", permanent: true },
      { source: "/lista-de-expositores", destination: "/", permanent: true },
      { source: "/fotos-feiras", destination: "/", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'www.expomultimix.com',
      },
      {
        protocol: 'https',
        hostname: 'www.expomultimix.com.br',
      },
      {
        protocol: 'https',
        hostname: '*.railway.app',
      },
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
};

export default nextConfig;
