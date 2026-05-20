'use client';

import React, { memo } from 'react';
import { useTheme } from '../../components/theme-context';
import { FileText, Users, Shield, Lock, UserCheck, Baby, RefreshCw, Mail } from 'lucide-react';

const PrivacyPolicy = memo(function PrivacyPolicy() {
  useTheme(); // keep behavior consistent with your theme system

  const sections = [
    {
      icon: FileText,
      title: '1. Information We Collect',
      content:
        'We may collect the following types of information when you visit our website or shop with us:',
      items: [
        { label: 'Personal Information', desc: 'Name, email, phone number, billing/shipping address, payment details.' },
        { label: 'Order Information', desc: 'Details about items purchased.' },
        { label: 'Technical Data', desc: 'IP address, browser type, device, usage analytics.' },
        { label: 'Marketing Preferences', desc: 'Newsletter/SMS subscription choices.' },
      ],
    },
    {
      icon: Users,
      title: '2. How We Use Your Information',
      content: 'We use collected information to:',
      items: [
        'Process and deliver orders.',
        'Communicate about purchases, returns, or support.',
        'Improve website & shopping experience.',
        'Send marketing messages (only if opted-in).',
        'Comply with legal obligations.',
      ],
    },
    {
      icon: Shield,
      title: '3. Sharing Your Information',
      content: 'We do not sell your information. We may share it only with trusted service providers:',
      items: [
        { label: 'Payment Processors', desc: '(e.g., Stripe, PayPal)' },
        { label: 'Shipping Carriers', desc: '(e.g., USPS, UPS, FedEx)' },
        { label: 'Analytics & Advertising', desc: '(e.g., Google Analytics, Meta Ads)' },
      ],
      footer: 'These providers are required to protect your data.',
    },
    {
      icon: Lock,
      title: '4. Data Security',
      content:
        'We take reasonable measures to safeguard your information, but no system is 100% secure.',
    },
    {
      icon: UserCheck,
      title: '5. Your Rights',
      content: 'Depending on your region, you may request to:',
      items: [
        'Access your personal data.',
        'Request corrections.',
        'Request deletion.',
        'Opt-out of marketing communications.',
      ],
      footer: 'To request: email contact@nicheclub.us.',
    },
    {
      icon: Baby,
      title: "6. Children’s Privacy",
      content:
        'Our site is not intended for children under 13 and we do not knowingly collect data from minors.',
    },
    {
      icon: RefreshCw,
      title: '7. Changes to This Policy',
      content: 'We may update this policy and will post the revised date here.',
    },
  ];

  return (
    <main
      className={[
        'min-h-[100dvh] w-full',
        'bg-black text-neutral-100',
        'pt-[calc(128px+env(safe-area-inset-top))]',
        'pb-[calc(96px+env(safe-area-inset-bottom))]',
      ].join(' ')}
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">

        {/* HEADER */}
        <div
          className={[
            'rounded-2xl border-2 px-6 sm:px-10 py-8 sm:py-10 mb-10',
            'border-blue-500 dark:border-[#a90068]',
          ].join(' ')}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold">Privacy Policy</h1>
          <p className="mt-3 text-neutral-300 max-w-2xl mx-auto text-sm sm:text-base">
            Your privacy matters to us. Here’s how we protect your data.
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
                  <p className="text-neutral-300">{s.content}</p>

                  {s.items && (
                    <ul className="space-y-2">
                      {s.items.map((item, idx) => (
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
          <h2 className="text-2xl font-bold">Contact Us</h2>
          <p className="mt-3 text-sm text-neutral-300">Questions or requests?</p>
          <p className="mt-2 text-blue-400 dark:text-[#ff4da0]">
            <a href="mailto:contact@nicheclub.us" className="underline-offset-4 hover:underline">
              contact@nicheclub.us
            </a>
          </p>
        </div>

      </div>
    </main>
  );
});

export default PrivacyPolicy;
