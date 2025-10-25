// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // ✅ Required for Vercel/Turbopack with three + postprocessing
  transpilePackages: ['three', 'postprocessing'],
  experimental: {
    optimizePackageImports: ['three'], // optional but recommended
  },

  images: {
    unoptimized: false,
    formats: ['image/webp'],
    deviceSizes: [320, 420, 640, 828, 1080, 1200, 1920, 2048],
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io', pathname: '/images/**' },
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
    ],
  },

  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: false },

  // ⬇️ Uncomment ONLY if you set a strict CSP and the effect is blank in prod.
  // postprocessing needs data: images for SMAA assets.
  // async headers() {
  //   return [
  //     {
  //       source: '/:path*',
  //       headers: [
  //         {
  //           key: 'Content-Security-Policy',
  //           value: [
  //             "default-src 'self'",
  //             "img-src 'self' data: blob: https:",
  //             "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:",
  //             "style-src 'self' 'unsafe-inline' https:",
  //             "connect-src 'self' https:",
  //             "media-src 'self' https: blob:",
  //             "font-src 'self' https: data:",
  //           ].join('; ')
  //         }
  //       ]
  //     }
  //   ];
  // },
};

export default nextConfig;
