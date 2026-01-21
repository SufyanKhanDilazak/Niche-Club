// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // ✅ Add sanity packages here (keep your existing ones)
  transpilePackages: [
    "three",
    "postprocessing",
    "sanity",
    "next-sanity",
    "@sanity/ui",
    "@sanity/icons",
  ],

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

  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
