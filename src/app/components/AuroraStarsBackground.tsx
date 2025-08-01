"use client";

import { useTheme } from './theme-context';
import { useEffect, useState, useRef, useCallback } from 'react';
import React from 'react';

interface AuroraStarsBackgroundProps {
  children?: React.ReactNode;
}

// Pre-define video assets for better performance
const VIDEO_ASSETS = {
  dark: {
    video: 'https://res.cloudinary.com/dxtq1hdrz/video/upload/q_auto,f_auto/v1752020163/3d_ufmaf5',
    poster: '/3d-poster.jpg'
  },
  light: {
    video: 'https://res.cloudinary.com/dxtq1hdrz/video/upload/q_auto,f_auto/v1752020150/sky_zbzkub',
    poster: '/sky-poster.jpg'
  }
} as const;

export default function AuroraStarsBackground({ children }: AuroraStarsBackgroundProps) {
  const { isDarkMode, isThemeLoaded } = useTheme();
  const [isClient, setIsClient] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [videoReady, setVideoReady] = useState({ light: false, dark: false });
  const [activeVideo, setActiveVideo] = useState<'light' | 'dark'>('light');
  const [initialThemeDetected, setInitialThemeDetected] = useState(false);
  const [clientTheme, setClientTheme] = useState<'light' | 'dark'>('light');
  
  const lightVideoRef = useRef<HTMLVideoElement>(null);
  const darkVideoRef = useRef<HTMLVideoElement>(null);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Detect initial theme on client before hydration
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check stored theme or system preference
      const storedTheme = localStorage.getItem('theme');
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      let initialTheme: 'light' | 'dark';
      if (storedTheme === 'dark' || storedTheme === 'light') {
        initialTheme = storedTheme;
      } else {
        // If no stored theme, use system preference
        initialTheme = systemDark ? 'dark' : 'light';
      }
      
      setClientTheme(initialTheme);
      setActiveVideo(initialTheme);
      setInitialThemeDetected(true);
      setIsClient(true);
    }
  }, []);

  // Detect browser capabilities
  const isSafariOrIOS = useCallback(() => {
    if (typeof navigator === 'undefined') return false;
    const ua = navigator.userAgent;
    return /iPad|iPhone|iPod|Safari/i.test(ua) && !/Chrome/i.test(ua);
  }, []);

  // Client-side initialization with interaction detection
  useEffect(() => {
    if (!isClient) return;
    
    // Check if user already interacted
    const hasInteracted = sessionStorage.getItem('videoInteraction') === 'true';
    
    if (hasInteracted || !isSafariOrIOS()) {
      setUserInteracted(true);
    } else {
      // Set up interaction listeners for Safari/iOS
      const handleInteraction = () => {
        setUserInteracted(true);
        sessionStorage.setItem('videoInteraction', 'true');
        document.removeEventListener('touchstart', handleInteraction);
        document.removeEventListener('click', handleInteraction);
      };
      
      document.addEventListener('touchstart', handleInteraction, { passive: true });
      document.addEventListener('click', handleInteraction);
      
      return () => {
        document.removeEventListener('touchstart', handleInteraction);
        document.removeEventListener('click', handleInteraction);
      };
    }
  }, [isClient, isSafariOrIOS]);

  // Sync with theme context when it loads
  useEffect(() => {
    if (isThemeLoaded && initialThemeDetected) {
      const newTheme = isDarkMode ? 'dark' : 'light';
      if (newTheme !== clientTheme) {
        setClientTheme(newTheme);
        setActiveVideo(newTheme);
      }
    }
  }, [isDarkMode, isThemeLoaded, initialThemeDetected, clientTheme]);

  // Optimized video loading function
  const loadVideo = useCallback(async (videoRef: React.RefObject<HTMLVideoElement | null>, type: 'light' | 'dark') => {
    const video = videoRef.current;
    if (!video || !userInteracted) return;

    try {
      video.load();
      
      // Set up promise-based loading
      await new Promise<void>((resolve, reject) => {
        const onCanPlay = () => {
          video.removeEventListener('canplaythrough', onCanPlay);
          video.removeEventListener('error', onError);
          resolve();
        };
        
        const onError = () => {
          video.removeEventListener('canplaythrough', onCanPlay);
          video.removeEventListener('error', onError);
          reject();
        };
        
        video.addEventListener('canplaythrough', onCanPlay);
        video.addEventListener('error', onError);
        
        // Timeout fallback
        setTimeout(() => {
          video.removeEventListener('canplaythrough', onCanPlay);
          video.removeEventListener('error', onError);
          resolve();
        }, 3000);
      });

      // Play video with error handling
      const playPromise = video.play();
      if (playPromise) {
        await playPromise.catch(() => {
          // Retry once for Safari
          setTimeout(() => video.play().catch(() => {}), 100);
        });
      }

      setVideoReady(prev => ({ ...prev, [type]: true }));
    } catch {
      // Fallback to poster on error
      setVideoReady(prev => ({ ...prev, [type]: false }));
    }
  }, [userInteracted]);

  // Initialize both videos when user interacts
  useEffect(() => {
    if (!isClient || !userInteracted || !initialThemeDetected) return;

    const initializeVideos = async () => {
      // Load both videos in parallel
      await Promise.allSettled([
        loadVideo(lightVideoRef, 'light'),
        loadVideo(darkVideoRef, 'dark')
      ]);
    };

    initializeVideos();
  }, [isClient, userInteracted, initialThemeDetected, loadVideo]);

  // Handle theme switching with smooth transitions
  useEffect(() => {
    if (!initialThemeDetected || !userInteracted) return;

    const newActiveVideo = clientTheme;
    
    if (newActiveVideo !== activeVideo) {
      // Clear any pending transitions
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }

      // Smooth transition logic
      const currentRef = activeVideo === 'light' ? lightVideoRef : darkVideoRef;
      const nextRef = newActiveVideo === 'light' ? lightVideoRef : darkVideoRef;

      if (currentRef.current) {
        currentRef.current.style.opacity = '0';
      }

      if (nextRef.current && videoReady[newActiveVideo]) {
        nextRef.current.style.opacity = '1';
        nextRef.current.currentTime = 0;
        nextRef.current.play().catch(() => {});
      }

      // Update active video after transition
      transitionTimeoutRef.current = setTimeout(() => {
        setActiveVideo(newActiveVideo);
      }, 300);
    }
  }, [clientTheme, initialThemeDetected, userInteracted, activeVideo, videoReady]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  // Common video properties
  const videoProps = {
    muted: true,
    playsInline: true,
    loop: true,
    preload: 'auto' as const,
    controls: false,
  };

  const videoStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    pointerEvents: 'none',
    transition: 'opacity 0.3s ease-in-out',
  };

  // SSR fallback - show nothing to prevent flash
  if (!isClient || !initialThemeDetected) {
    return (
      <>
        {/* Invisible placeholder during SSR/hydration */}
        <div 
          style={{ 
            position: 'fixed', 
            inset: 0, 
            backgroundColor: 'transparent',
            zIndex: -1 
          }} 
        />
        {children}
      </>
    );
  }

  return (
    <>
      {/* Fixed video container - completely separate from content flow */}
      <div style={{ position: 'fixed', inset: 0, zIndex: -1, overflow: 'hidden' }}>
        {/* Light theme video */}
        <video
          ref={lightVideoRef}
          src={VIDEO_ASSETS.light.video}
          poster={VIDEO_ASSETS.light.poster}
          {...videoProps}
          style={{
            ...videoStyle,
            opacity: clientTheme === 'light' && videoReady.light && userInteracted ? 1 : 0,
          }}
        />
        
        {/* Dark theme video */}
        <video
          ref={darkVideoRef}
          src={VIDEO_ASSETS.dark.video}
          poster={VIDEO_ASSETS.dark.poster}
          {...videoProps}
          style={{
            ...videoStyle,
            opacity: clientTheme === 'dark' && videoReady.dark && userInteracted ? 1 : 0,
          }}
        />
        
        {/* Fallback background - shows correct theme poster immediately */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${clientTheme === 'dark' ? VIDEO_ASSETS.dark.poster : VIDEO_ASSETS.light.poster})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: (!videoReady.light && clientTheme === 'light') || (!videoReady.dark && clientTheme === 'dark') || !userInteracted ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
            zIndex: -1,
          }}
        />
      </div>

     

      {/* Content - no wrapper div, just pass through children */}
      {children}
    </>
  );
}