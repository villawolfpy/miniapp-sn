import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
