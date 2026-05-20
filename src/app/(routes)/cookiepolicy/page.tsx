'use client';

import React, { memo } from 'react';
import { useTheme } from '../../components/theme-context';
import { Cookie, Settings, BarChart3, ShieldCheck, Mail } from 'lucide-react';

const CookiePolicy = memo(function CookiePolicy() {
  useTheme(); // keep consistent with your theme system

  const sections = [
    {
      icon: Cookie,
      title: '1. What Are Cookies?',
      content:
        'Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our site.',
    },
    {
      icon: Settings,
      title: '2. How We Use Cookies',
      content: 'We use cookies and similar technologies to:',
      items: [
        'Enhance your browsing and shopping experience.',
        'Remember your preferences and saved carts.',
        'Measure site performance and marketing effectiveness.',
        'Understand how visitors interact with our website.',
        'Provide personalized content and recommendations.',
      ],
    },
    {
      icon: BarChart3,
      title: '3. Types of Cookies We Use',
      items: [
        {
          label: 'Essential Cookies',
          desc:
            'Required for the website to function properly. These cannot be disabled as they are necessary for core functionality like shopping carts and checkout.',
        },
        {
          label: 'Performance Cookies',
          desc:
            'Help us understand how visitors use our website by collecting anonymous data about page visits and user interactions.',
        },
        {
          label: 'Functionality Cookies',
          desc:
            'Remember your preferences and choices (like language, region, or login details) to provide enhanced features.',
        },
        {
          label: 'Marketing Cookies',
          desc:
            'Track your browsing activity to show you relevant advertisements and measure the effectiveness of our marketing campaigns.',
        },
      ],
    },
    {
      icon: ShieldCheck,
      title: '4. Third-Party Cookies',
      content: 'We may use third-party services that set cookies on our website, including:',
      items: [
        { label: 'Google Analytics', desc: 'To analyze website traffic and user behavior.' },
        { label: 'Meta Pixel', desc: 'For advertising and retargeting campaigns.' },
        { label: 'Payment Processors', desc: 'Like Stripe or PayPal for secure payment processing.' },
      ],
      footer: 'These third parties have their own privacy policies governing the use of cookies.',
    },
    {
      icon: Settings,
      title: '5. Managing Your Cookie Preferences',
      content: 'You have control over the cookies we use. You can manage your preferences by:',
      items: [
        'Adjusting your browser settings to block or delete cookies.',
        'Using our cookie consent banner to opt-out of non-essential cookies.',
        "Visiting your browser's help section for detailed instructions on cookie management.",
        'Note: Disabling certain cookies may affect website functionality and your user experience.',
      ],
    },
    {
      icon: Cookie,
      title: '6. Cookie Duration',
      content: 'Cookies may be temporary or persistent:',
      items: [
        { label: 'Session Cookies', desc: 'Temporary cookies that expire when you close your browser.' },
        { label: 'Persistent Cookies', desc: 'Remain on your device for a set period or until manually deleted.' },
      ],
    },
  ];

  return (
    <main
      className={[
        'min-h-[100dvh] w-full',
        'bg-black text-neutral-100',
        // extra padding so it never hides under sticky header/footer
        'pt-[calc(128px+env(safe-area-inset-top))]',
        'pb-[calc(96px+env(safe-area-inset-bottom))]',
      ].join(' ')}
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
        {/* HERO */}
        <div
          className={[
            'rounded-2xl border-2 px-6 sm:px-10 py-8 sm:py-10 mb-10',
            'border-blue-500 dark:border-[#a90068]',
          ].join(' ')}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold">Cookie Policy</h1>
          <p className="mt-3 text-neutral-300 max-w-2xl mx-auto text-sm sm:text-base">
            Learn how we use cookies to improve your browsing experience and personalize our services.
          </p>
          <p className="mt-4 text-xs text-neutral-500">Last Updated: October 30, 2025</p>
        </div>

        {/* SECTIONS */}
        <div className="space-y-8">
          {sections.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={i}
                className={[
                  'rounded-xl border-2 bg-transparent text-center',
                  'border-blue-500 dark:border-[#a90068]',
                ].join(' ')}
              >
                <div className="px-5 sm:px-8 py-6 border-b border-white/10">
                  <div className="mx-auto w-12 h-12 rounded-lg flex items-center justify-center bg-blue-600 dark:bg-[#a90068] mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-semibold">{s.title}</h2>
                </div>

                <div className="px-5 sm:px-8 py-6 space-y-4 text-sm sm:text-base max-w-2xl mx-auto text-left">
                  {s.content && <p className="text-neutral-300">{s.content}</p>}

                  {s.items && (
                    <ul className="space-y-2">
                      {s.items.map((item: any, idx: number) => (
                        <li key={idx} className="flex gap-3">
                          <div className="mt-2 w-2 h-2 rounded-full bg-blue-500 dark:bg-[#ff4da0]" />
                          <div>
                            {typeof item === 'string' ? (
                              <p className="text-neutral-300">{item}</p>
                            ) : (
                              <p className="text-neutral-300">
                                <span className="font-semibold text-neutral-100">{item.label}</span>: {item.desc}
                              </p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}

                  {s.footer && (
                    <p className="pt-4 text-neutral-400 text-center text-sm">{s.footer}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* CONTACT */}
        <div
          className={[
            'mt-10 rounded-xl border-2 py-8 bg-transparent text-center',
            'border-blue-500 dark:border-[#a90068]',
          ].join(' ')}
        >
          <div className="mx-auto w-12 h-12 rounded-full flex items-center justify-center bg-blue-600 dark:bg-[#a90068] mb-4">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold">Questions About Cookies?</h2>
          <p className="mt-3 text-sm text-neutral-300">If you have questions about our Cookie Policy, reach out:</p>
          <p className="mt-2 text-blue-400 dark:text-[#ff4da0]">
            <a href="mailto:contact@nicheclub.us" className="underline-offset-4 hover:underline">
              contact@nicheclub.us
            </a>
          </p>
        </div>

        {/* FOOTER NOTE */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-white/10">
          <p className="text-center text-xs sm:text-sm text-neutral-400 max-w-2xl mx-auto px-4">
            By continuing to use our website, you consent to our use of cookies as described in this Cookie Policy. For
            more information about how we handle your data, please review our Privacy Policy.
          </p>
        </div>
      </div>
    </main>
  );
});

export default CookiePolicy;
