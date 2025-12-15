import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import Script from "next/script";
import React from "react";

import "./globals.css";
import { Header } from "./components/header";
import Footer from "./components/footer";
import { FooterTheme } from "./components/footer-theme";
import { CartProvider } from "./components/CartContext";
import { ThemeProvider } from "./components/theme-context";
import { HeadlineStrip } from "./components/Headline";
import AuroraStarsBackground from "./components/AuroraStarsBackground";

import MetaPixel from "./components/MetaPixel";
import PixelPageView from "./components/PixelPageView";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Niche Club - Premium Streetwear & Fashion",
    template: "%s | Niche Club",
  },
  description: "Discover exclusive streetwear and premium fashion at Niche Club.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0f23" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <link
          rel="preconnect"
          href="https://res.cloudinary.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link
          rel="preconnect"
          href="https://cdn.sanity.io"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />

        {/* Theme bootstrap */}
        <Script id="theme-bootstrap" strategy="beforeInteractive">
          {`try{
            const t=localStorage.getItem('theme');
            const sys=matchMedia('(prefers-color-scheme: dark)').matches;
            const dark=(t==='dark')||(t!=='light'&&sys);
            const d=document.documentElement;
            d.classList.toggle('dark',dark);
            d.style.colorScheme=dark?'dark':'light';
          }catch(e){}`}
        </Script>
      </head>

      <body
        className="min-h-dvh flex flex-col"
        style={{ backgroundColor: "var(--theme-bg)" }}
      >
        {/* ✅ META PIXEL (ONCE, SITE-WIDE) */}
        <MetaPixel />
        <PixelPageView />

        <ClerkProvider>
          <NextThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
          >
            <ThemeProvider>
              <CartProvider>
                {/* Background (site-wide) */}
                <AuroraStarsBackground
                  src="https://res.cloudinary.com/dxtq1hdrz/video/upload/q_auto,f_auto/v1752020163/3d_ufmaf5"
                  poster="/3d-poster.jpg"
                />

                {/* Foreground */}
                <div className="relative z-10 flex flex-col min-h-0 flex-1">
                  <Header />
                  <HeadlineStrip />
                  <main className="flex-1">{children}</main>
                  <Footer />
                  <FooterTheme />
                </div>
              </CartProvider>
            </ThemeProvider>
          </NextThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
