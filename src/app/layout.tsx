// app/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import React from 'react';

import './globals.css';

import { Header } from './components/header';
import Footer from './components/footer';
import { FooterTheme } from './components/footer-theme';
import { CartProvider } from './components/CartContext';
import { ThemeProvider } from './components/theme-context';
import { HeadlineStrip } from './components/Headline';
import AuroraStarsBackground from './components/AuroraStarsBackground';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'Niche Club - Premium Streetwear & Fashion',
    template: '%s | Niche Club',
  },
  description: 'Discover exclusive streetwear and premium fashion at Niche Club.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f0f23' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* Early networking for Cloudinary (videos/posters) + Sanity (product images) */}
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />

        {/* Preload posters to avoid a blank frame before video paints */}
        <link rel="preload" as="image" href="/sky-poster.jpg" media="(prefers-color-scheme: light)" />
        <link rel="preload" as="image" href="/3d-poster.jpg" media="(prefers-color-scheme: dark)" />

        {/* No-FOUC theme bootstrap: apply theme before first paint */}
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const t = localStorage.getItem('theme');
                const sys = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const dark = t === 'dark' || (t !== 'light' && sys);
                const dd = document.documentElement;
                dd.classList.toggle('dark', dark);
                dd.style.setProperty('--theme-primary', dark ? '#a90068' : '#3b82f6');
                dd.style.setProperty('--theme-bg', dark ? '#0f0f23' : '#ffffff');
                dd.style.colorScheme = dark ? 'dark' : 'light';
              } catch {}
            `,
          }}
        />
      </head>

      {/* Inline bg ensures the very first paint matches the chosen theme */}
      <body className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--theme-bg)' }}>
        <ClerkProvider>
          <NextThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <ThemeProvider>
              {/* Render content INSIDE the Aurora background (fewer layers & repaints) */}
              <AuroraStarsBackground>
                <CartProvider>
                  <div className="relative z-10 flex flex-col min-h-screen">
                    <Header />
                    <HeadlineStrip />
                    <main className="flex-1">{children}</main>
                    <Footer />
                    <FooterTheme />
                  </div>
                </CartProvider>
              </AuroraStarsBackground>
            </ThemeProvider>
          </NextThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
