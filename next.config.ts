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
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/indymower',
        has: [
          {
            type: 'host',
            value: 'indymower.top10websites.lol',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
