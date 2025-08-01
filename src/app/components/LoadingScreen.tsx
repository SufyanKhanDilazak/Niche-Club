'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';

const LoadingScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [showPermissionText, setShowPermissionText] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [resourcesLoaded, setResourcesLoaded] = useState(false);
  
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup function for timeouts
  const clearAllTimeouts = useCallback(() => {
    timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
    timeoutRefs.current = [];
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Detect Safari/iOS with better accuracy
  const isSafariOrIOS = useCallback((): boolean => {
    if (typeof navigator === 'undefined') return false;
    const ua = navigator.userAgent;
    const isSafari = /Safari/i.test(ua) && !/Chrome/i.test(ua) && !/Chromium/i.test(ua);
    const isIOS = /iPad|iPhone|iPod/i.test(ua);
    return isSafari || isIOS;
  }, []);

  // Enhanced resource preloading
  const preloadResources = useCallback(async (): Promise<boolean> => {
    try {
      // Preload all images
      const images = Array.from(document.images);
      const imagePromises = images.map((img) => {
        return new Promise<void>((resolve) => {
          if (img.complete && img.naturalHeight !== 0) {
            resolve();
          } else {
            const newImg = new Image();
            newImg.onload = () => resolve();
            newImg.onerror = () => resolve(); // Don't fail on error
            newImg.src = img.src || img.getAttribute('data-src') || '';
          }
        });
      });

      // Preload stylesheets
      const stylesheets = Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'));
      const stylesheetPromises = stylesheets.map((link) => {
        return new Promise<void>((resolve) => {
          if (link.sheet) {
            resolve();
          } else {
            link.onload = () => resolve();
            link.onerror = () => resolve(); // Don't fail on error
          }
        });
      });

      // Wait for critical resources
      await Promise.allSettled([...imagePromises, ...stylesheetPromises]);
      
      // Additional check for document readiness
      if (document.readyState !== 'complete') {
        await new Promise<void>((resolve) => {
          const handler = () => {
            document.removeEventListener('readystatechange', handler);
            resolve();
          };
          document.addEventListener('readystatechange', handler);
          
          // Fallback timeout
          const timeout = setTimeout(() => {
            document.removeEventListener('readystatechange', handler);
            resolve();
          }, 2000);
          timeoutRefs.current.push(timeout);
        });
      }

      return true;
    } catch (error) {
      console.warn('Resource preloading failed:', error);
      return true; // Continue anyway
    }
  }, []);

  // Check if page is fully loaded
  const checkPageLoad = useCallback((): boolean => {
    if (typeof window === 'undefined') return false;
    
    const isDocumentReady = document.readyState === 'complete';
    const images = Array.from(document.images);
    const visibleImages = images.filter(img => {
      const rect = img.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0;
    });
    const allVisibleImagesLoaded = visibleImages.every(img => 
      img.complete && (img.naturalHeight !== 0 || img.src === '')
    );

    return isDocumentReady && allVisibleImagesLoaded && resourcesLoaded;
  }, [resourcesLoaded]);

  // Exit animation handler
  const handleExit = useCallback(() => {
    setIsExiting(true);
    
    const exitTimeout1 = setTimeout(() => {
      setIsLoading(false);
      const exitTimeout2 = setTimeout(() => {
        setShouldRender(false);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('hasSeenLoading', 'true');
        }
      }, 500);
      timeoutRefs.current.push(exitTimeout2);
    }, 300);
    timeoutRefs.current.push(exitTimeout1);
  }, []);

  // Main effect for loading logic
  useEffect(() => {
    setIsClient(true);
    
    // Check if user has already seen the loading screen
    const hasSeenLoading = typeof window !== 'undefined' ? sessionStorage.getItem('hasSeenLoading') : null;
    const hasInteracted = typeof window !== 'undefined' ? sessionStorage.getItem('videoInteraction') === 'true' : false;
    
    if (hasSeenLoading) {
      setShouldRender(false);
      return;
    }

    // Start resource preloading immediately
    preloadResources().then(() => {
      setResourcesLoaded(true);
    });

    const isIOSDevice = isSafariOrIOS();

    // Show text after appropriate delay
    const textDelay = isIOSDevice && !hasInteracted ? 4000 : 3000;
    const textTimeout = setTimeout(() => {
      setShowPermissionText(true);
    }, textDelay);
    timeoutRefs.current.push(textTimeout);

    // For non-iOS devices, handle automatic progression
    if (!isIOSDevice) {
      setUserInteracted(true);
      
      let minTimeElapsed = false;
      let pageFullyLoaded = false;

      const checkAndHide = () => {
        if (minTimeElapsed && pageFullyLoaded) {
          handleExit();
        }
      };

      // Minimum display time
      const minTimeout = setTimeout(() => {
        minTimeElapsed = true;
        checkAndHide();
      }, 4000);
      timeoutRefs.current.push(minTimeout);

      const handleLoadCheck = () => {
        pageFullyLoaded = checkPageLoad();
        if (pageFullyLoaded) {
          checkAndHide();
        }
      };

      // Event listeners
      if (typeof window !== 'undefined') {
        window.addEventListener('load', handleLoadCheck);
        document.addEventListener('DOMContentLoaded', handleLoadCheck);
      }

      // Periodic check for page load
      intervalRef.current = setInterval(() => {
        if (checkPageLoad()) {
          pageFullyLoaded = true;
          checkAndHide();
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
      }, 200);

      // Maximum timeout fallback
      const maxTimeout = setTimeout(() => {
        handleExit();
      }, 10000);
      timeoutRefs.current.push(maxTimeout);

      // Cleanup function
      return () => {
        clearAllTimeouts();
        if (typeof window !== 'undefined') {
          window.removeEventListener('load', handleLoadCheck);
          document.removeEventListener('DOMContentLoaded', handleLoadCheck);
        }
      };
    }

    return clearAllTimeouts;
  }, [isSafariOrIOS, preloadResources, checkPageLoad, handleExit, clearAllTimeouts]);

  // Handle user interaction for iOS/Safari
  const handleUserInteraction = useCallback(() => {
    if (!userInteracted) {
      setUserInteracted(true);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('videoInteraction', 'true');
      }
      setShowPermissionText(false);
      
      const interactionTimeout = setTimeout(() => {
        handleExit();
      }, 800);
      timeoutRefs.current.push(interactionTimeout);
    }
  }, [userInteracted, handleExit]);

  // Set up interaction handlers for iOS devices
  useEffect(() => {
    if (!isClient || !isSafariOrIOS() || userInteracted) return;

    const handleClick = (e: Event) => {
      e.preventDefault();
      handleUserInteraction();
    };

    const handleTouch = (e: TouchEvent) => {
      e.preventDefault();
      handleUserInteraction();
    };

    if (typeof document !== 'undefined') {
      document.addEventListener('click', handleClick, { passive: false });
      document.addEventListener('touchstart', handleTouch, { passive: false });
    }

    return () => {
      if (typeof document !== 'undefined') {
        document.removeEventListener('click', handleClick);
        document.removeEventListener('touchstart', handleTouch);
      }
    };
  }, [isClient, isSafariOrIOS, userInteracted, handleUserInteraction]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAllTimeouts();
    };
  }, [clearAllTimeouts]);

  // Don't render if not on client side or if shouldn't render
  if (!isClient || !shouldRender) return null;

  return (
    <div 
      className={`fixed inset-0 bg-black z-50 flex flex-col items-center justify-center transition-opacity duration-500 ${
        isLoading ? 'opacity-100' : 'opacity-0'
      } ${isSafariOrIOS() && !userInteracted ? 'cursor-pointer' : ''}`}
      style={{ background: '#000000' }}
      role="dialog"
      aria-label="Loading screen"
      aria-live="polite"
    >
      {/* Permission text - positioned at top with perfect smooth glow */}
      <div className={`absolute top-16 text-center px-6 permission-text ${
        showPermissionText ? 'visible' : 'invisible'
      }`}>
        <p className="text-white text-xl font-medium mb-2 glow-text">Tap Anywhere To Enter</p>
        <p className="text-white/80 text-sm glow-text-subtle">Click anywhere or tap anywhere to enter in the store</p>
      </div>

      {/* Loading animation */}
      <div className={`loader ${isExiting ? 'exiting' : ''}`}>
        <div className="blackhole">
          <div className="blackhole-circle" />
          <div className="blackhole-disc" />
        </div>
        <div className="curve">
          <svg viewBox="0 0 500 500" aria-hidden="true">
            <path id="loading" d="M73.2,148.6c4-6.1,65.5-96.8,178.6-95.6c111.3,1.2,170.8,90.3,175.1,97" />
            <text width={500}>
              <textPath xlinkHref="#loading">
                Niche Club
              </textPath>
            </text>
          </svg>
        </div>
      </div>

      <style jsx>{`
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes fastRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(1440deg); }
        }
        
        @keyframes pulseAnimation {
          0%, 100% {
            box-shadow: 0px 0px 3rem #a90068;
            transform: scale(1);
          }
          50% {
            box-shadow: 0px 0px 5rem #a90068;
            transform: scale(1.09);
          }
        }
        
        @keyframes pulseAnimation2 {
          0%, 100% {
            box-shadow: 0px 0px 3rem #a90068;
            transform: rotate3d(1, 1, 1, 220deg) scale(1);
          }
          50% {
            box-shadow: 0px 0px 5rem #a90068;
            transform: rotate3d(1, 1, 1, 220deg) scale(0.95);
          }
        }
        
        @keyframes fadeOut {
          from { opacity: 1; transform: scale(1); }
          to { opacity: 0; transform: scale(0.8); }
        }

        @keyframes perfectGlow {
          0%, 100% {
            text-shadow: 
              0 0 2px rgba(255, 255, 255, 0.9),
              0 0 4px rgba(255, 255, 255, 0.8),
              0 0 8px rgba(255, 255, 255, 0.7),
              0 0 12px rgba(255, 255, 255, 0.6),
              0 0 16px rgba(255, 255, 255, 0.5),
              0 0 20px rgba(255, 255, 255, 0.4);
            filter: brightness(1);
          }
          25% {
            text-shadow: 
              0 0 4px rgba(255, 255, 255, 1),
              0 0 8px rgba(255, 255, 255, 0.9),
              0 0 12px rgba(255, 255, 255, 0.8),
              0 0 16px rgba(255, 255, 255, 0.7),
              0 0 24px rgba(255, 255, 255, 0.6),
              0 0 32px rgba(255, 255, 255, 0.5);
            filter: brightness(1.1);
          }
          50% {
            text-shadow: 
              0 0 6px rgba(255, 255, 255, 1),
              0 0 12px rgba(255, 255, 255, 0.95),
              0 0 18px rgba(255, 255, 255, 0.9),
              0 0 24px rgba(255, 255, 255, 0.8),
              0 0 32px rgba(255, 255, 255, 0.7),
              0 0 40px rgba(255, 255, 255, 0.6);
            filter: brightness(1.2);
          }
          75% {
            text-shadow: 
              0 0 4px rgba(255, 255, 255, 1),
              0 0 8px rgba(255, 255, 255, 0.9),
              0 0 12px rgba(255, 255, 255, 0.8),
              0 0 16px rgba(255, 255, 255, 0.7),
              0 0 24px rgba(255, 255, 255, 0.6),
              0 0 32px rgba(255, 255, 255, 0.5);
            filter: brightness(1.1);
          }
        }

        @keyframes perfectGlowSubtle {
          0%, 100% {
            text-shadow: 
              0 0 1px rgba(255, 255, 255, 0.8),
              0 0 3px rgba(255, 255, 255, 0.7),
              0 0 6px rgba(255, 255, 255, 0.6),
              0 0 9px rgba(255, 255, 255, 0.5);
            filter: brightness(1);
          }
          33% {
            text-shadow: 
              0 0 2px rgba(255, 255, 255, 0.9),
              0 0 4px rgba(255, 255, 255, 0.8),
              0 0 8px rgba(255, 255, 255, 0.7),
              0 0 12px rgba(255, 255, 255, 0.6);
            filter: brightness(1.05);
          }
          66% {
            text-shadow: 
              0 0 3px rgba(255, 255, 255, 1),
              0 0 6px rgba(255, 255, 255, 0.9),
              0 0 12px rgba(255, 255, 255, 0.8),
              0 0 18px rgba(255, 255, 255, 0.7);
            filter: brightness(1.1);
          }
        }
        
        .loader {
          display: flex;
          width: 8rem;
          height: 8rem;
          justify-content: center;
          align-items: center;
          position: relative;
          flex-direction: column;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          will-change: transform, opacity;
        }
        
        .loader.exiting {
          animation: fadeOut 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        .curve {
          width: 180%;
          height: 180%;
          position: absolute;
          animation: rotate 8s linear infinite;
          fill: transparent;
          will-change: transform;
        }
        
        .loader.exiting .curve {
          animation: fastRotate 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        
        .curve text {
          letter-spacing: 20px;
          text-transform: uppercase;
          font-family: 'Inter', 'Fira Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 1.5em;
          fill: white;
          filter: drop-shadow(0 2px 8px black);
        }
        
        .blackhole {
          z-index: -1;
          display: flex;
          position: absolute;
          width: 8rem;
          height: 8rem;
          align-items: center;
          justify-content: center;
          will-change: transform;
        }
        
        .blackhole-circle {
          z-index: 0;
          display: flex;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: radial-gradient(circle at center, black 25%, white 35%, white 100%);
          box-shadow: 0px 0px 2rem #a90068;
          align-items: center;
          justify-content: center;
          will-change: transform;
        }
        
        .blackhole-circle::after {
          z-index: 0;
          position: absolute;
          content: "";
          display: flex;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 4px solid white;
          background: radial-gradient(circle at center, black 35%, white 60%, white 100%);
          box-shadow: 0px 0px 5rem #a90068;
          align-items: center;
          justify-content: center;
          filter: blur(4px);
          animation: pulseAnimation linear infinite 2s alternate-reverse;
          will-change: transform, box-shadow;
        }
        
        .blackhole-circle::before {
          z-index: 1;
          content: "";
          display: flex;
          width: 4rem;
          height: 4rem;
          border: 2px solid #a90068;
          box-shadow: 3px 3px 10px #a90068, inset 0 0 1rem #a90068;
          border-radius: 50%;
          top: 5rem;
          filter: blur(0.5px);
          animation: rotate linear infinite 3s;
          will-change: transform;
        }
        
        .blackhole-disc {
          position: absolute;
          z-index: 0;
          display: flex;
          width: 5rem;
          height: 10rem;
          border-radius: 50%;
          background: radial-gradient(circle at center, #ffffff 80%, #a90068 90%, white 100%);
          filter: blur(1rem) brightness(130%);
          border: 1rem solid white;
          box-shadow: 0px 0px 3rem #a90068;
          transform: rotate3d(1, 1, 1, 220deg);
          animation: pulseAnimation2 linear infinite 2s alternate-reverse;
          justify-content: center;
          align-items: center;
          will-change: transform, box-shadow;
        }
        
        .blackhole-disc::before {
          content: "";
          position: absolute;
          z-index: 0;
          display: flex;
          width: 5rem;
          height: 10rem;
          border-radius: 50%;
          background: radial-gradient(circle at center, #ffffff 80%, #a90068 90%, white 100%);
          filter: blur(3rem);
          border: 1rem solid white;
          box-shadow: 0px 0px 6rem #a90068;
          animation: pulseAnimation2 linear infinite 2s alternate-reverse;
          will-change: transform, box-shadow;
        }

        .permission-text {
          transition: opacity 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
                      transform 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          transform: translateY(0);
          will-change: opacity, transform;
        }

        .permission-text.invisible {
          opacity: 0;
          transform: translateY(-15px);
        }

        .permission-text.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .glow-text {
          animation: perfectGlow 4s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
          will-change: text-shadow, filter;
        }

        .glow-text-subtle {
          animation: perfectGlowSubtle 4s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
          animation-delay: 0.5s;
          will-change: text-shadow, filter;
        }

        /* Performance optimizations */
        * {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          -moz-backface-visibility: hidden;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;