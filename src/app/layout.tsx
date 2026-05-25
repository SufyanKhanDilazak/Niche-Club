import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import React from "react";
import Script from "next/script";

import "./globals.css";
import { Header } from "./components/header";
import Footer from "./components/footer";
import { FooterTheme } from "./components/footer-theme";
import { CartProvider } from "./components/CartContext";
import { ThemeProvider } from "./components/theme-context";
import { HeadlineStrip } from "./components/Headline";
import MetaPixel from "./components/MetaPixel";
import PixelPageView from "./components/PixelPageView";

// ─── Font ─────────────────────────────────────────────────────────────────────
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
});

// ─── Site Constants ───────────────────────────────────────────────────────────
const SITE_URL = "https://nicheclub.us";
const SITE_NAME = "Niche Club";
const SITE_HANDLE = "@nicheclubny";
const GOOGLE_ADS_ID = "AW-18163532720";

// ─── Metadata ─────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "Niche Club | Premium Affordable Streetwear — New York",
    template: "%s | Niche Club",
  },

  description:
    "Niche Club is a New York-based clothing brand delivering premium, affordable streetwear and fashion. Shop exclusive drops, hoodies, tees, and more — quality you can feel without the luxury price tag.",

  keywords: [
    "Niche Club",
    "NYC streetwear",
    "New York clothing brand",
    "premium affordable fashion",
    "affordable streetwear",
    "New York State fashion",
    "exclusive streetwear drops",
    "niche club hoodies",
    "niche club tees",
    "premium urban clothing",
    "NY fashion brand",
    "nicheclub.us",
    "affordable luxury streetwear",
    "New York apparel brand",
    "limited edition streetwear",
  ],

  verification: {
    google: "QPsn0RZT8E68Jd7na8Swp9BtzTUO7gqaNVLURzDyRUM",
  },

  authors: [{ name: "Niche Club", url: SITE_URL }],
  creator: "Niche Club",
  publisher: "Niche Club",

  alternates: {
    canonical: SITE_URL,
    languages: {
      "en-US": SITE_URL,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Niche Club | Premium Affordable Streetwear — New York",
    description:
      "Shop Niche Club — the New York streetwear brand bringing you premium quality at an affordable price. Explore exclusive drops, hoodies, tees & more.",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Niche Club – Premium Affordable Streetwear, New York",
        type: "image/png",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: SITE_HANDLE,
    creator: SITE_HANDLE,
    title: "Niche Club | Premium Affordable Streetwear — New York",
    description:
      "Shop Niche Club — the New York streetwear brand bringing you premium quality at an affordable price. Explore exclusive drops, hoodies, tees & more.",
    images: [`${SITE_URL}/og-image.png`],
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  applicationName: SITE_NAME,
  category: "Shopping",
  classification: "Clothing & Apparel",
  referrer: "origin-when-cross-origin",

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    other: [
      { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#000000" },
    ],
  },

  manifest: "/site.webmanifest",

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

// ─── Viewport ─────────────────────────────────────────────────────────────────
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0f23" },
  ],
};

// ─── JSON-LD Structured Data ──────────────────────────────────────────────────
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": ["ClothingStore", "OnlineStore", "Organization"],
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  alternateName: "Niche Club NY",
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/logo.png`,
    width: 512,
    height: 512,
  },
  image: `${SITE_URL}/og-image.png`,
  description:
    "Niche Club is a premium affordable clothing brand based in New York State, USA. We craft exclusive streetwear including hoodies, tees, and limited drops.",
  foundingLocation: {
    "@type": "Place",
    name: "New York State",
    address: {
      "@type": "PostalAddress",
      addressRegion: "NY",
      addressCountry: "US",
    },
  },
  address: {
    "@type": "PostalAddress",
    addressRegion: "NY",
    addressCountry: "US",
  },
  areaServed: {
    "@type": "Country",
    name: "United States",
  },
  priceRange: "$$",
  currenciesAccepted: "USD",
  paymentAccepted: "Credit Card, Debit Card",
  sameAs: [
    `https://www.instagram.com/${SITE_HANDLE.replace("@", "")}`,
    `https://www.twitter.com/${SITE_HANDLE.replace("@", "")}`,
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  description: "Premium affordable streetwear brand based in New York State.",
  publisher: { "@id": `${SITE_URL}/#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
  inLanguage: "en-US",
};

// ─── Root Layout ──────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={inter.variable}
      suppressHydrationWarning
    >
      <head>
        {/* ── Preconnects ──────────────────────────────────────────────────── */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://connect.facebook.net" />

        {/* ── JSON-LD Structured Data ───────────────────────────────────────
            Using native lowercase <script> (not Next.js Script component)
            so it renders synchronously in <head> for crawlers.            */}
        <script
          id="ld-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <script
          id="ld-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd),
          }}
        />
      </head>

      <body className="min-h-screen bg-background text-foreground">
        {/* ── Google Ads (gtag.js) ─────────────────────────────────────────
            Placed in <body> — Next.js Script with afterInteractive
            MUST NOT be inside <head> or it gets silently dropped.        */}
        <Script
          id="google-ads-gtag-src"
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-ads-gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GOOGLE_ADS_ID}');
          `}
        </Script>

        {/* ── Meta Pixel ───────────────────────────────────────────────────── */}
        <MetaPixel />
        <PixelPageView />

        {/* ── App Shell ────────────────────────────────────────────────────── */}
        <ClerkProvider>
          <NextThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ThemeProvider>
              <CartProvider>
                <div className="relative z-10 flex flex-col min-h-screen">
                  <Header />
                  <HeadlineStrip />
                  <main id="main-content" className="flex-1" role="main">
                    {children}
                  </main>
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