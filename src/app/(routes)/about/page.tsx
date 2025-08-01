'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, Sparkles, Award, Globe, Zap, ArrowRight } from 'lucide-react';
import { useTheme } from '../../components/theme-context';
import { cn } from '@/lib/utils';

// Animated Counter Component
interface AnimatedCounterProps {
  end: number;
  label: string;
  isPercentage?: boolean;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ end, label, isPercentage = false }) => {
  const [count, setCount] = useState(0);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    let start = 0;
    const increment = end / 100;
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 30);
    return () => clearInterval(timer);
  }, [end]);

  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const gradientColor = isDarkMode ? 'from-[#a90068] to-[#a90068]' : 'from-blue-500 to-blue-600';

  return (
    <motion.div
      className="text-center p-4 sm:p-6 backdrop-blur-lg bg-white/5 dark:bg-gray-900/5 border border-white/10 dark:border-gray-800/10 rounded-2xl shadow-md"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.03 }}
    >
      <div className={`text-3xl sm:text-4xl font-bold bg-gradient-to-r ${gradientColor} bg-clip-text text-transparent mb-2`}>
        {isPercentage ? `${count}%` : count.toLocaleString()}
      </div>
      <div className={`text-base sm:text-lg ${textColor} font-medium`}>{label}</div>
    </motion.div>
  );
};

// Feature Interface
interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const AboutPage: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [isFontLoaded, setIsFontLoaded] = useState(false);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap';
    link.rel = 'stylesheet';
    link.onload = () => setIsFontLoaded(true);
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const features: Feature[] = [
    {
      icon: <Heart className="h-6 w-6" />,
      title: 'Passionate Curation',
      description: 'Handpicked pieces with unmatched attention to detail.',
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Community Driven',
      description: 'A vibrant community celebrating unique style.',
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: 'Unique Selection',
      description: 'Exclusive items for those who stand out.',
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: 'Premium Quality',
      description: 'Top-tier craftsmanship from trusted brands.',
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: 'Global Reach',
      description: 'Fashion delivered to your doorstep, worldwide.',
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Innovation First',
      description: 'Trends and classics in perfect harmony.',
    },
  ];

  const stats = [
    { end: 15000, label: 'Happy Customers' },
    { end: 98, label: 'Satisfaction Rate', isPercentage: true },
  ];

  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const accentColor = isDarkMode ? 'text-[#a90068]' : 'text-blue-500';
  const buttonGradient = isDarkMode ? 'from-[#a90068] to-[#a90068]' : 'from-blue-500 to-blue-600';
  const borderColor = isDarkMode ? 'border-gray-800/10' : 'border-white/10';

  return (
    <div
      className={cn(
        'min-h-screen bg-transparent relative',
        isFontLoaded ? 'font-montserrat font-normal' : 'font-sans',
        'text-lg sm:text-xl'
      )}
      style={{ textRendering: 'optimizeLegibility' }}
    >
      {/* Hero Section */}
      <motion.section
        className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-8"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="max-w-5xl mx-auto text-center">
          <motion.h1
            variants={fadeInUp}
            className={`text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r ${buttonGradient} bg-clip-text text-transparent mb-4`}
          >
            Niche Club
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className={`text-lg sm:text-xl ${textColor} max-w-2xl mx-auto mb-6 font-medium`}
          >
            Curating exclusive fashion for those who dare to be different.
          </motion.p>
          <motion.div variants={fadeInUp}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`bg-gradient-to-r ${buttonGradient} text-white px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 mx-auto group`}
            >
              Discover More
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={staggerContainer}
      >
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {stats.map((stat, index) => (
              <AnimatedCounter
                key={index}
                end={stat.end}
                label={stat.label}
                isPercentage={stat.isPercentage}
              />
            ))}
          </div>
        </div>
      </motion.section>

      {/* Story Section */}
      <motion.section
        className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={staggerContainer}
      >
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeInUp} className="text-center mb-6">
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold ${textColor} mb-3`}>
              Our Story
            </h2>
            <div className={`h-1 w-16 bg-gradient-to-r ${buttonGradient} mx-auto`} />
          </motion.div>
          <motion.div
            variants={fadeInUp}
            className={`backdrop-blur-lg bg-white/5 dark:bg-gray-900/5 p-6 sm:p-8 border ${borderColor} rounded-2xl shadow-md`}
          >
            <p className={`text-lg sm:text-xl ${textColor} leading-relaxed font-medium`}>
              Niche Club was founded to redefine fashion as a personal, powerful expression of individuality. We curate unique, high-quality pieces that empower you to tell your story through style.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Grid */}
      <motion.section
        className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={staggerContainer}
      >
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeInUp} className="text-center mb-6">
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold ${textColor} mb-3`}>
              Why Niche Club?
            </h2>
            <div className={`h-1 w-16 bg-gradient-to-r ${buttonGradient} mx-auto`} />
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className={`backdrop-blur-lg bg-white/5 dark:bg-gray-900/5 p-6 sm:p-8 border ${borderColor} rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 group`}
                whileHover={{ y: -6 }}
              >
                <div className={`p-2 bg-gradient-to-r ${buttonGradient} w-fit rounded-lg mb-3 group-hover:scale-105 transition-transform`}>
                  <div className="text-white">{feature.icon}</div>
                </div>
                <h3 className={`text-lg sm:text-xl font-bold ${textColor} mb-2 group-hover:${accentColor} transition-colors`}>{feature.title}</h3>
                <p className={`text-base sm:text-lg ${textColor} leading-relaxed font-medium`}>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section
        className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="max-w-5xl mx-auto text-center">
          <div className={`backdrop-blur-lg bg-white/5 dark:bg-gray-900/5 p-6 sm:p-8 border ${borderColor} rounded-2xl shadow-md`}>
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold ${textColor} mb-3`}>Join the Movement</h2>
            <p className={`text-lg sm:text-xl ${textColor} mb-6 max-w-2xl mx-auto font-medium`}>
              Connect with a community of style enthusiasts and discover fashion that defines you.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`bg-gradient-to-r ${buttonGradient} text-white px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 mx-auto group`}
            >
              Explore Collection
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default AboutPage;