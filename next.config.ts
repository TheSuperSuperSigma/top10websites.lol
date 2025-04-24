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
  // Remove the redirects section since we want to keep content at /indymower
};

export default nextConfig;
