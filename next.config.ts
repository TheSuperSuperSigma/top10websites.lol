import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['i.ibb.co']
  },
  async headers() {
    return [
      {
        source: '/game/:path*',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          }
        ],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/crazycattle3d',
        destination: 'https://crazycattle3d.top10websites.lol',
        permanent: true,
      },
    ]
  }
};

export default nextConfig;
