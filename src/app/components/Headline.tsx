'use client';

import { memo, useState, useEffect, useCallback, useRef } from 'react';
import { useTheme } from './theme-context';

const messages = [
  'Free U.S. shipping on orders over $49',
  'Easy return and exchange policy'
] as const;

interface MessageProps {
  message: string;
  isActive: boolean;
  fadeColor: string;
  isDarkMode: boolean;
}

const FadeMessage = memo<MessageProps>(({ message, isActive, fadeColor, isDarkMode }) => (
  <div
    className="absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out"
    style={{
      opacity: isActive ? 1 : 0,
      transform: `translateY(${isActive ? '0px' : '8px'}) scale(${isActive ? 1 : 0.98})`,
      filter: isActive 
        ? `drop-shadow(0 0 8px ${fadeColor}50)` 
        : 'none',
    }}
  >
    <span 
      className="text-sm font-semibold uppercase tracking-wider whitespace-nowrap font-montserrat"
      style={{
        color: isDarkMode ? '#ffffff' : '#000000',
        textShadow: isActive 
          ? `0 0 12px ${fadeColor}40` 
          : 'none',
      }}
    >
      {message}
    </span>
  </div>
));

FadeMessage.displayName = 'FadeMessage';

export const HeadlineStrip = memo(() => {
  const { isThemeLoaded, isDarkMode } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cycleMessages = useCallback(() => {
    setIsVisible(false);
    
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
      setIsVisible(true);
    }, 350);
  }, []);

  useEffect(() => {
    if (!isThemeLoaded) return;

    intervalRef.current = setInterval(cycleMessages, 4500);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isThemeLoaded, cycleMessages]);

  if (!isThemeLoaded) {
    return (
      <div className="fixed top-[60px] left-0 w-full h-8 z-40 bg-gray-100" />
    );
  }

  const backgroundColor = isDarkMode ? '#000000' : '#ffffff';
  const textColor = isDarkMode ? '#ffffff' : '#000000';
  const fadeColor = isDarkMode ? '#a90068' : '#3b82f6';

  return (
    <div
     className="fixed top-[65px] left-0 w-full h-8 z-40 overflow-hidden shadow-sm"
      style={{
        backgroundColor,
        color: textColor,
        borderBottom: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
      }}
    >
      <div className="relative w-full h-full">
        <FadeMessage
          message={messages[currentIndex]}
          isActive={isVisible}
          fadeColor={fadeColor}
          isDarkMode={isDarkMode}
        />
      </div>

      {/* Ambient glow effect */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-700"
        style={{
          opacity: isVisible ? 0.6 : 0,
          background: `radial-gradient(ellipse at center, ${fadeColor}08 0%, transparent 70%)`,
        }}
      />

      <style jsx>{`
        .font-montserrat {
          font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
      `}</style>
    </div>
  );
});

HeadlineStrip.displayName = 'HeadlineStrip';