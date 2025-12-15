// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // ✅ Required for Turbopack/Vercel with three + postprocessing
  transpilePackages: ["three", "postprocessing"],

  experimental: {
    optimizePackageImports: ["three"],
  },

  images: {
    formats: ["image/webp"],
    deviceSizes: [320, 420, 640, 828, 1080, 1200, 1920, 2048],
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io", pathname: "/images/**" },
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
  },

  // Keep TS strict in build (recommended)
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
