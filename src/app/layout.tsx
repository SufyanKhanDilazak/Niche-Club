import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import React from "react";

import "./globals.css";
import { Header } from "./components/header";
import Footer from "./components/footer";
import { FooterTheme } from "./components/footer-theme";
import { CartProvider } from "./components/CartContext";
import { ThemeProvider } from "./components/theme-context";
import { HeadlineStrip } from "./components/Headline";

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
      <body className="min-h-screen bg-background text-foreground">
        {/* ✅ META PIXEL (ONCE, SITE-WIDE) */}
        <MetaPixel />
        <PixelPageView />

        <ClerkProvider>
          <NextThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <ThemeProvider>
              <CartProvider>
                <div className="relative z-10 flex flex-col min-h-screen">
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
