'use client';

import React, { memo } from 'react';
import { useTheme } from '../../components/theme-context';

const ReturnExchangePage = memo(function ReturnExchangePage() {
  useTheme();

  return (
    <main
      className={[
        'min-h-[100dvh] w-full',
        'bg-black text-neutral-100',
        // More top padding so it never hides under header (tweak 128px if needed)
        'pt-[calc(128px+env(safe-area-inset-top))]',
        'pb-[calc(96px+env(safe-area-inset-bottom))]',
      ].join(' ')}
    >
      {/* HERO */}
      <section className="w-full px-4 sm:px-6 lg:px-10 xl:px-14">
        <div className="mx-auto max-w-4xl">
          <div
            className={[
              'rounded-2xl border-2 px-6 sm:px-10 py-10 text-center bg-transparent',
              'border-blue-500 dark:border-[#a90068]',
              'shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset]',
            ].join(' ')}
          >
            <p className="text-xs uppercase tracking-[0.25em] text-neutral-400">
              Niche Club Policy
            </p>
            <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold">
              7-Day Return &amp; Exchange Policy
            </h1>
            <p className="mt-3 text-sm sm:text-base text-neutral-300 max-w-2xl mx-auto">
              We want you to love your Niche Club experience. If you’re not completely satisfied, we’re here to help.
            </p>
          </div>
        </div>
      </section>

      {/* CONTENT (centered on all screens) */}
      <section className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 mt-8">
        <div className="mx-auto max-w-4xl space-y-8">

          {/* Block helper */}
          {[
            {
              title: 'Return & Exchange Window',
              prefix: '🛍️',
              body: (
                <p className="max-w-2xl mx-auto">
                  You have <strong>7 days from the delivery date</strong> to initiate a return or exchange.
                </p>
              ),
            },
            {
              title: 'Eligibility Criteria',
              body: (
                <ul className="list-disc list-inside space-y-2 max-w-2xl mx-auto text-left">
                  <li>
                    Items must be <strong>unused, unworn</strong>, and in <strong>original packaging</strong> with all tags attached.
                  </li>
                  <li>
                    <strong>Proof of purchase</strong> (receipt or order confirmation) is required.
                  </li>
                  <li>
                    Certain items are <strong>non-returnable</strong>: final sale products, gift cards, and personalized items.
                  </li>
                  <li className="text-neutral-400">
                    Items with signs of wear, odors, damage, or removed tags will not be accepted.
                  </li>
                </ul>
              ),
            },
            {
              title: 'How to Initiate a Return or Exchange',
              body: (
                <ol className="list-decimal list-inside space-y-3 max-w-2xl mx-auto text-left">
                  <li>
                    <strong>Contact Us:</strong> Email{' '}
                    <a
                      href="mailto:contact@nicheclub.us"
                      className="underline underline-offset-4 text-blue-400 dark:text-[#ff4da0] hover:opacity-90"
                    >
                      contact@nicheclub.us
                    </a>{' '}
                    with your <strong>order number</strong> and reason for return/exchange.
                  </li>
                  <li>
                    <strong>Receive Instructions:</strong> We’ll reply with return instructions and a return shipping label (if applicable).
                  </li>
                  <li>
                    <strong>Ship the Item:</strong> Send the item back using the provided label and instructions.
                  </li>
                </ol>
              ),
            },
            {
              title: 'Refunds',
              body: (
                <ul className="list-disc list-inside space-y-2 max-w-2xl mx-auto text-left">
                  <li>
                    After we receive and inspect your return, refunds are processed <strong>within 7 business days</strong>.
                  </li>
                  <li>Refunds go to the <strong>original payment method</strong>.</li>
                  <li><strong>Shipping charges are non-refundable.</strong></li>
                </ul>
              ),
            },
            {
              title: 'Exchanges',
              body: (
                <ul className="list-disc list-inside space-y-2 max-w-2xl mx-auto text-left">
                  <li>Replacement ships after we receive and approve the original item.</li>
                  <li>Exchanges are subject to product availability.</li>
                </ul>
              ),
            },
            {
              title: 'Need Assistance?',
              body: (
                <>
                  <p className="text-neutral-300 max-w-2xl mx-auto">
                    Our customer service team is here to help.
                  </p>
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 max-w-xl mx-auto">
                    <a
                      href="mailto:contact@nicheclub.us"
                      className="justify-self-center underline underline-offset-4 text-blue-400 dark:text-[#ff4da0] hover:opacity-90"
                    >
                      contact@nicheclub.us
                    </a>
                    <a
                      href="tel:+19347991588"
                      className="justify-self-center underline underline-offset-4 text-blue-400 dark:text-[#ff4da0] hover:opacity-90"
                    >
                      (934) 799-1588
                    </a>
                  </div>
                </>
              ),
            },
          ].map((s, i) => (
            <div
              key={i}
              className={[
                'rounded-xl border-2 bg-transparent text-center',
                'border-blue-500 dark:border-[#a90068]',
                'shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset]',
              ].join(' ')}
            >
              <div className="px-5 sm:px-8 py-6 border-b border-white/10">
                <h2 className="text-2xl sm:text-3xl font-semibold inline-flex items-center gap-2">
                  {s.prefix && <span aria-hidden>{s.prefix}</span>}
                  <span>{s.title}</span>
                </h2>
              </div>
              <div className="px-5 sm:px-8 py-6">
                {s.body}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
});

export default ReturnExchangePage;
