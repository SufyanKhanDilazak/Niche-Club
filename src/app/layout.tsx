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
import HyperspeedLoaderOnce from "./components/HyperspeedLoaderOnce";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

export const metadata: Metadata = {
  title: { default: "Niche Club - Premium Streetwear & Fashion", template: "%s | Niche Club" },
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning data-hs-boot="1">
      <head>
        <Script id="hs-boot-skip" strategy="beforeInteractive">
          {`try{
            if(localStorage.getItem('seenHyperspeedLoader')==='true'){
              const d=document.documentElement;
              d.setAttribute('data-hs-skip','1');
              d.removeAttribute('data-hs-boot');
            }
          }catch(e){}`}
        </Script>

        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />

        {/* Single 3D poster preload */}
        <link rel="preload" as="image" href="/3d-poster.jpg" />

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

      {/* change: min-h-screen -> min-h-dvh */}
      <body className="min-h-dvh flex flex-col" style={{ backgroundColor: "var(--theme-bg)" }}>
        <div
          id="hs-boot"
          style={{
            position: "fixed", inset: 0, zIndex: 999999,
            background: "#000", display: "grid", placeItems: "center",
            opacity: 1, transition: "opacity .45s ease"
          }}
        >
          <div className="hs-stage" />
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center" }}>
            <div style={{
              color: "#fff", fontWeight: 600, letterSpacing: ".02em",
              fontSize: "clamp(1rem,2.6vw,1.6rem)", textShadow: "0 0 8px rgba(255,255,255,.53)"
            }}>
              Loading Your Niche...
            </div>
          </div>
        </div>

        <HyperspeedLoaderOnce />

        <ClerkProvider>
          <NextThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <ThemeProvider>
              <AuroraStarsBackground>
                <CartProvider>
                  {/* change: min-h-screen -> min-h-0 flex-1 */}
                  <div className="relative z-10 flex flex-col min-h-0 flex-1">
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

        <Script id="hs-boot-clean" strategy="afterInteractive">
          {`try{
            const d=document.documentElement;
            d.removeAttribute('data-hs-boot');
            const b=document.getElementById('hs-boot');
            if(b){b.classList.add('hide');setTimeout(()=>b.remove(),500);}
          }catch(e){}`}
        </Script>
      </body>
    </html>
  );
}
