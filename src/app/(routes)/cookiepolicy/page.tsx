import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Cookie, Settings, BarChart3, ShieldCheck, Mail } from 'lucide-react';

export default function CookiePolicy() {
  const sections = [
    {
      icon: Cookie,
      title: '1. What Are Cookies?',
      content: 'Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our site.'
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
        'Provide personalized content and recommendations.'
      ]
    },
    {
      icon: BarChart3,
      title: '3. Types of Cookies We Use',
      items: [
        { label: 'Essential Cookies', desc: 'Required for the website to function properly. These cannot be disabled as they are necessary for core functionality like shopping carts and checkout.' },
        { label: 'Performance Cookies', desc: 'Help us understand how visitors use our website by collecting anonymous data about page visits and user interactions.' },
        { label: 'Functionality Cookies', desc: 'Remember your preferences and choices (like language, region, or login details) to provide enhanced features.' },
        { label: 'Marketing Cookies', desc: 'Track your browsing activity to show you relevant advertisements and measure the effectiveness of our marketing campaigns.' }
      ]
    },
    {
      icon: ShieldCheck,
      title: '4. Third-Party Cookies',
      content: 'We may use third-party services that set cookies on our website, including:',
      items: [
        { label: 'Google Analytics', desc: 'To analyze website traffic and user behavior.' },
        { label: 'Meta Pixel', desc: 'For advertising and retargeting campaigns.' },
        { label: 'Payment Processors', desc: 'Like Stripe or PayPal for secure payment processing.' }
      ],
      footer: 'These third parties have their own privacy policies governing the use of cookies.'
    },
    {
      icon: Settings,
      title: '5. Managing Your Cookie Preferences',
      content: 'You have control over the cookies we use. You can manage your preferences by:',
      items: [
        'Adjusting your browser settings to block or delete cookies.',
        'Using our cookie consent banner to opt-out of non-essential cookies.',
        'Visiting your browser\'s help section for detailed instructions on cookie management.',
        'Note: Disabling certain cookies may affect website functionality and your user experience.'
      ]
    },
    {
      icon: Cookie,
      title: '6. Cookie Duration',
      content: 'Cookies may be temporary or persistent:',
      items: [
        { label: 'Session Cookies', desc: 'Temporary cookies that expire when you close your browser.' },
        { label: 'Persistent Cookies', desc: 'Remain on your device for a set period or until manually deleted.' }
      ]
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
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 tracking-tight bg-gradient-to-r from-orange-600 to-amber-600 dark:from-orange-400 dark:to-amber-400 bg-clip-text text-transparent">
            Cookie Policy
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">
            Learn how we use cookies to improve your browsing experience and personalize our services.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-500">
            <span>Last Updated: October 30, 2025</span>
          </div>
        </div>

        {/* Introduction Card */}
        <Card className="mb-8 sm:mb-10 lg:mb-12 border-2 border-orange-500/20 dark:border-amber-500/20 shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center mb-4">
              <Cookie className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <CardTitle className="text-xl sm:text-2xl">Understanding Our Cookie Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm sm:text-base lg:text-lg text-center leading-relaxed text-gray-700 dark:text-gray-300">
              At <span className="font-semibold text-orange-600 dark:text-orange-400">Niche Club</span>, we use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and personalize content. This Cookie Policy explains what cookies are, how we use them, and how you can control them.
            </p>
          </CardContent>
        </Card>

        {/* Sections */}
        <div className="space-y-6 sm:space-y-8">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg sm:text-xl lg:text-2xl mb-2">
                        {section.title}
                      </CardTitle>
                      {section.content && (
                        <CardDescription className="text-sm sm:text-base">
                          {section.content}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {section.items && (
                    <ul className="space-y-3 sm:space-y-4">
                      {section.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-600 mt-2" />
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
        <Card className="mt-8 sm:mt-10 lg:mt-12 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-950/30 dark:via-amber-950/30 dark:to-yellow-950/30 border-2 border-orange-500/30 dark:border-amber-500/30 shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <CardTitle className="text-xl sm:text-2xl lg:text-3xl">Questions About Cookies?</CardTitle>
            <CardDescription className="text-sm sm:text-base mt-2">
              If you have questions about our Cookie Policy, please reach out to us.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4 sm:space-y-6">
            <div className="inline-block">
              <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 dark:from-orange-400 dark:to-amber-400 bg-clip-text text-transparent mb-4">
                Niche Club
              </h3>
              <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-gray-600 dark:text-gray-400">Email:</span>
                  <a 
                    href="mailto:contact@nicheclub.us" 
                    className="font-semibold text-orange-600 dark:text-orange-400 hover:underline transition-colors"
                  >
                    contact@nicheclub.us
                  </a>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                  <a 
                    href="tel:+19347991588" 
                    className="font-semibold text-orange-600 dark:text-orange-400 hover:underline transition-colors"
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
            By continuing to use our website, you consent to our use of cookies as described in this Cookie Policy. For more information about how we handle your data, please review our Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}