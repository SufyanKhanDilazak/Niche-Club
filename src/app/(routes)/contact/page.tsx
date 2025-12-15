'use client';

import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Mail, Phone, Instagram, Facebook } from 'lucide-react';
import { useTheme } from '../../components/theme-context';
import { cn } from '@/lib/utils';
import { Montserrat } from 'next/font/google';
import { useEffect, useState } from 'react';

// Load Montserrat font with Next.js font optimization
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});

export default function Contact() {
  const { isDarkMode } = useTheme();
  const [isFontLoaded, setIsFontLoaded] = useState(false);

  // Simulate font loading state (for fallback)
  useEffect(() => {
    setIsFontLoaded(true); // Font is preloaded via next/font, so set to true
  }, []);

  // Animation variants (matched with About page)
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        // was: ease: 'easeOut'
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const bounceIn: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        // was: type: 'spring'
        type: 'spring' as const,
        stiffness: 100,
        damping: 12,
      },
    },
  };

  // Color scheme adjustments (matched with About page)
  const headerColor = isDarkMode ? 'from-[#a90068] to-[#a90068]' : 'from-blue-500 to-blue-600';
  const textColor = isDarkMode ? 'text-white' : 'text-white';
  const accentColor = isDarkMode ? 'text-[#a90068]' : 'text-blue-500';
  const accentHoverColor = isDarkMode ? 'hover:text-[#a90068]/80' : 'hover:text-blue-400';
  const buttonColor = isDarkMode ? 'from-[#a90068] to-[#a90068]' : 'from-blue-500 to-blue-600';
  const buttonBorderColor = isDarkMode ? 'border-gray-800/10' : 'border-white/10';
  const iconHighlight = isDarkMode
    ? 'drop-shadow-[0_0_6px_rgba(169,0,104,0.8)]'
    : 'drop-shadow-[0_0_6px_rgba(59,130,246,0.8)]';
  const cardBg = isDarkMode ? 'bg-gray-900/5' : 'bg-white/5';
  const cardBorder = isDarkMode ? 'border-gray-800/10' : 'border-white/10';

  return (
    <div
      className={cn(
        'min-h-screen bg-transparent relative',
        isFontLoaded ? montserrat.className : 'font-sans',
        'text-lg sm:text-xl'
      )}
      style={{ textRendering: 'optimizeLegibility' }}
    >
      {/* Header Section */}
      <motion.section
        className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-8"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="max-w-5xl mx-auto text-center">
          <motion.h1
            className={`text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r ${headerColor} bg-clip-text text-transparent mb-4`}
            variants={fadeInUp}
          >
            Let&apos;s Connect
          </motion.h1>
          <motion.p
            className={`text-lg sm:text-xl ${textColor} max-w-2xl mx-auto mb-6 font-medium`}
            variants={fadeInUp}
          >
            We&apos;re here to help and answer any questions you might have
          </motion.p>
        </div>
      </motion.section>

      {/* Contact Info & Social Section */}
      <motion.section
        className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
      >
        <div className="max-w-5xl mx-auto">
          <motion.h2
            className={`text-3xl sm:text-4xl md:text-5xl font-bold ${textColor} mb-3 text-center`}
            variants={fadeInUp}
          >
            Get in Touch
          </motion.h2>
          <div className={`h-1 w-16 bg-gradient-to-r ${headerColor} mx-auto mb-6`} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Phone */}
            <motion.div
              className={`backdrop-blur-lg ${cardBg} p-6 sm:p-8 border ${cardBorder} rounded-2xl shadow-md hover:shadow-lg transition-all duration-300`}
              variants={bounceIn}
              whileHover={{ scale: 1.02, y: -6 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex flex-col items-center text-center gap-4">
                <motion.div
                  className={`p-3 bg-gradient-to-r ${buttonColor} w-fit rounded-lg`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Phone size={24} className={`text-white ${iconHighlight}`} />
                </motion.div>
                <h3 className={`text-lg sm:text-xl font-bold ${textColor} mb-2`}>Phone</h3>
                <a
                  href="tel:+17189735867"
                  className={`text-base sm:text-lg ${accentColor} ${accentHoverColor} transition-colors underline underline-offset-4 decoration-2`}
                >
                  +1 718-973-5867
                </a>
              </div>
            </motion.div>

            {/* Email */}
            <motion.div
              className={`backdrop-blur-lg ${cardBg} p-6 sm:p-8 border ${cardBorder} rounded-2xl shadow-md hover:shadow-lg transition-all duration-300`}
              variants={bounceIn}
              whileHover={{ scale: 1.02, y: -6 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex flex-col items-center text-center gap-4">
                <motion.div
                  className={`p-3 bg-gradient-to-r ${buttonColor} w-fit rounded-lg`}
                  whileHover={{ scale: 1.1, rotate: -5 }}
                >
                  <Mail size={24} className={`text-white ${iconHighlight}`} />
                </motion.div>
                <h3 className={`text-lg sm:text-xl font-bold ${textColor} mb-2`}>Email</h3>
                <a
                  href="mailto:contact@nicheclub.us"
                  className={`text-base sm:text-lg ${accentColor} ${accentHoverColor} transition-colors underline underline-offset-4 decoration-2 break-words`}
                >
                  contact@nicheclub.us
                </a>
              </div>
            </motion.div>

            {/* Social Media */}
            <motion.div
              className={`backdrop-blur-lg ${cardBg} p-6 sm:p-8 border ${cardBorder} rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 md:col-span-2 lg:col-span-1`}
              variants={bounceIn}
              whileHover={{ scale: 1.02, y: -6 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex flex-col items-center text-center gap-4">
                <h3 className={`text-lg sm:text-xl font-bold ${textColor} mb-2`}>Follow Us</h3>
                <div className="flex gap-4 justify-center">
                  <motion.a
                    href="https://www.instagram.com/nicheclub.us?igsh=bDVhdDJ4ZHR0bjc4&utm_source=qr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 bg-gradient-to-r ${buttonColor} rounded-lg shadow-md hover:shadow-lg transition-all duration-300`}
                    whileHover={{ scale: 1.15, rotate: 10 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Instagram size={24} className={`text-white ${iconHighlight}`} />
                  </motion.a>
                  <motion.a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 bg-gradient-to-r ${buttonColor} rounded-lg shadow-md hover:shadow-lg transition-all duration-300`}
                    whileHover={{ scale: 1.15, rotate: -10 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Facebook size={24} className={`text-white ${iconHighlight}`} />
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Call to Action Section */}
      <motion.section
        className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={staggerContainer}
      >
        <div className="max-w-5xl mx-auto text-center">
          <div className={`backdrop-blur-lg ${cardBg} p-6 sm:p-8 border ${cardBorder} rounded-2xl shadow-md`}>
            <motion.h2
              className={`text-3xl sm:text-4xl md:text-5xl font-bold ${textColor} mb-3`}
              variants={fadeInUp}
            >
              Ready to Connect?
            </motion.h2>
            <motion.p
              className={`text-lg sm:text-xl ${textColor} mb-6 max-w-2xl mx-auto font-medium`}
              variants={fadeInUp}
            >
              Whether you have questions, feedback, or need assistance, we&apos;re here to help you every step of the way.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              variants={staggerContainer}
            >
              <motion.a
                href="mailto:contact@nicheclub.us"
                className={`inline-flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-lg shadow-md bg-gradient-to-r ${buttonColor} text-white hover:shadow-lg transition-all duration-300`}
                variants={bounceIn}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail size={20} />
                Send Email
              </motion.a>
              <motion.a
                href="tel:+17189735867"
                className={`inline-flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-lg shadow-md border-2 ${buttonBorderColor} ${accentColor} hover:bg-gradient-to-r ${buttonColor} hover:text-white hover:border-transparent transition-all duration-300`}
                variants={bounceIn}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Phone size={20} />
                Call Now
              </motion.a>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Footer Line */}
      <motion.div
        className={`w-full max-w-5xl h-1 bg-gradient-to-r ${headerColor} opacity-30 rounded-full mx-auto`}
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{
          duration: 1.2,
          // was: ease: 'easeInOut'
          ease: [0.42, 0, 0.58, 1],
        }}
      />
    </div>
  );
}
