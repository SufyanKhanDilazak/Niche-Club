import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, Users, FileText, UserCheck, Baby, RefreshCw, Mail } from 'lucide-react';

export default function PrivacyPolicy() {
  const sections = [
    {
      icon: FileText,
      title: '1. Information We Collect',
      content: 'We may collect the following types of information when you visit our website or shop with us:',
      items: [
        { label: 'Personal Information', desc: 'Name, email address, phone number, shipping and billing addresses, payment information.' },
        { label: 'Order Information', desc: 'Details about the products you purchase.' },
        { label: 'Technical Information', desc: 'IP address, browser type, device information, and usage data collected through cookies or similar technologies.' },
        { label: 'Marketing Preferences', desc: 'Your subscription to our newsletter, SMS, or marketing campaigns.' }
      ]
    },
    {
      icon: Users,
      title: '2. How We Use Your Information',
      content: 'We use the information collected to:',
      items: [
        'Process and deliver your orders.',
        'Communicate with you about your purchases, returns, or support requests.',
        'Improve our website, shopping experience, and customer service.',
        'Send promotional emails, SMS, or marketing campaigns (only if you have opted in).',
        'Comply with legal and regulatory obligations.'
      ]
    },
    {
      icon: Shield,
      title: '3. Sharing Your Information',
      content: 'We respect your privacy and do not sell your personal information. However, we may share your data with trusted third parties for:',
      items: [
        { label: 'Payment Processing', desc: '(e.g., Stripe, PayPal)' },
        { label: 'Shipping & Delivery', desc: '(e.g., USPS, UPS, FedEx)' },
        { label: 'Website Analytics & Marketing', desc: '(e.g., Google Analytics, Meta Ads)' }
      ],
      footer: 'All third-party providers we use are required to safeguard your information.'
    },
    {
      icon: Lock,
      title: '4. Data Security',
      content: 'We take reasonable measures to protect your personal data from unauthorized access, disclosure, or misuse. However, no online transmission or storage system is 100% secure, and we cannot guarantee absolute security.'
    },
    {
      icon: UserCheck,
      title: '5. Your Rights',
      content: 'Depending on your location, you may have rights regarding your personal data, including:',
      items: [
        'Accessing the information we hold about you.',
        'Requesting corrections or updates.',
        'Requesting deletion of your data.',
        'Opting out of marketing communications at any time.'
      ],
      footer: 'To exercise these rights, please contact us at contact@nicheclub.us.'
    },
    {
      icon: Baby,
      title: '6. Children\'s Privacy',
      content: 'Our website and services are not intended for individuals under 13. We do not knowingly collect personal data from children.'
    },
    {
      icon: RefreshCw,
      title: '7. Changes to This Policy',
      content: 'We may update this Privacy Policy from time to time. Any changes will be posted on this page with a new effective date.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 max-w-5xl">
        {/* Hero Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <Badge variant="outline" className="mb-4 text-xs sm:text-sm">
            Legal Document
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">
            Your privacy matters to us. Learn how we protect and handle your personal information.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-500">
            <span>Last Updated: October 30, 2025</span>
          </div>
        </div>

        {/* Introduction Card */}
        <Card className="mb-8 sm:mb-10 lg:mb-12 border-2 border-blue-500/20 dark:border-purple-500/20 shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <CardTitle className="text-xl sm:text-2xl">Our Commitment to Your Privacy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm sm:text-base lg:text-lg text-center leading-relaxed text-gray-700 dark:text-gray-300">
              At <span className="font-semibold text-blue-600 dark:text-blue-400">Niche Club</span>, your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you interact with our website, make a purchase, or engage with our brand.
            </p>
          </CardContent>
        </Card>

        {/* Sections */}
        <div className="space-y-6 sm:space-y-8">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg sm:text-xl lg:text-2xl mb-2">
                        {section.title}
                      </CardTitle>
                      <CardDescription className="text-sm sm:text-base">
                        {section.content}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {section.items && (
                    <ul className="space-y-3 sm:space-y-4">
                      {section.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mt-2" />
                          <div className="flex-1 min-w-0">
                            {typeof item === 'string' ? (
                              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                                {item}
                              </p>
                            ) : (
                              <div>
                                <span className="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100">
                                  {item.label}:
                                </span>
                                <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300 ml-2">
                                  {item.desc}
                                </span>
                              </div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                  {section.footer && (
                    <>
                      <Separator className="my-4 sm:my-6" />
                      <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                        {section.footer}
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Contact Section */}
        <Card className="mt-8 sm:mt-10 lg:mt-12 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/30 dark:via-purple-950/30 dark:to-pink-950/30 border-2 border-blue-500/30 dark:border-purple-500/30 shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <CardTitle className="text-xl sm:text-2xl lg:text-3xl">8. Contact Us</CardTitle>
            <CardDescription className="text-sm sm:text-base mt-2">
              Have questions about this Privacy Policy or how we handle your information?
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4 sm:space-y-6">
            <div className="inline-block">
              <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
                Niche Club
              </h3>
              <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-gray-600 dark:text-gray-400">Email:</span>
                  <a 
                    href="mailto:contact@nicheclub.us" 
                    className="font-semibold text-blue-600 dark:text-blue-400 hover:underline transition-colors"
                  >
                    contact@nicheclub.us
                  </a>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                  <a 
                    href="tel:+19347991588" 
                    className="font-semibold text-blue-600 dark:text-blue-400 hover:underline transition-colors"
                  >
                    +1 934-799-1588
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-500 max-w-2xl mx-auto px-4">
            By using our website, you agree to this Privacy Policy and our Terms of Service. We are committed to protecting your privacy and ensuring a safe shopping experience. For information about cookies, please see our Cookie Policy.
          </p>
        </div>
      </div>
    </div>
  );
}