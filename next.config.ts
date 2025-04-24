import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co'
      }
    ]
  },
  async redirects() {
    return [
      {
        source: '/indymower',
        destination: 'https://indymower.top10websites.lol',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
