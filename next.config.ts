import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
      }
    ],
  },
};

export default nextConfig;
