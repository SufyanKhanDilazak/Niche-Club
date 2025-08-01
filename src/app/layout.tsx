// app/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider as NextThemeProvider } from 'next-themes';

import './globals.css';

import { Header } from './components/header';
import Footer from './components/footer';
import { FooterTheme } from './components/footer-theme';
import { CartProvider } from './components/CartContext';
import { ThemeProvider } from './components/theme-context';
import { HeadlineStrip } from './components/Headline';
import AuroraStarsBackground from './components/AuroraStarsBackground';
import LoadingScreen from './components/LoadingScreen';

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
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        {/* Prevent flash by blocking render until theme is determined */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme');
                const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const isDark = theme === 'dark' || (theme !== 'light' && systemDark);
                
                document.documentElement.classList.toggle('dark', isDark);
                document.documentElement.style.setProperty('--theme-primary', isDark ? '#a90068' : '#3b82f6');
                document.documentElement.style.setProperty('--theme-bg', isDark ? '#0f0f23' : '#ffffff');
                document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
              } catch (e) {}
            `,
          }}
        />
      </head>

      <body className="min-h-screen flex flex-col">
        <LoadingScreen />
        <ClerkProvider>
          <NextThemeProvider 
            attribute="class" 
            defaultTheme="system" 
            enableSystem={true}
            disableTransitionOnChange={false}
          >
            <ThemeProvider>
              <CartProvider>
                <AuroraStarsBackground />
                <div className="relative z-10 flex flex-col min-h-screen">
                  <Header />
                  <HeadlineStrip/>
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