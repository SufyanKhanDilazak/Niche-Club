"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, memo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Carousel images (excluding 2.png as it's the background)
const CAROUSEL_IMAGES = [
  "/models/1.png",
  "/models/3.png",
  "/models/4.png",
  "/models/5.png",
  "/models/6.png",
  "/models/7.png",
  "/models/8.png",
  "/models/9.png",
  "/models/10.png",
  "/models/11.png",
  "/models/12.png",
  "/models/13.png",
  "/models/14.png",
  "/models/15.png",
  "/models/16.png",
  "/models/17.png",
  "/models/18.png",
  "/models/19.png",
  "/models/20.png",
  "/models/21.png",
  "/models/22.png",
] as const;

const BACKGROUND_IMAGE = "/models/2.png";
const SLIDE_INTERVAL = 5000;

// Memoized navigation button component
const NavigationButton = memo(({ 
  direction, 
  onClick 
}: { 
  direction: "left" | "right"; 
  onClick: () => void;
}) => {
  const isLeft = direction === "left";
  const Icon = isLeft ? ChevronLeft : ChevronRight;
  
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={`${isLeft ? "Previous" : "Next"} slide`}
      className={`absolute ${isLeft ? "left-2 sm:left-4 md:left-6 lg:left-8" : "right-2 sm:right-4 md:right-6 lg:right-8"} top-1/2 -translate-y-1/2 z-40 h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 rounded-full bg-black/70 backdrop-blur-md text-white hover:bg-black/85 active:scale-95 transition-all duration-300 hover:scale-110 shadow-2xl border-2 border-white/60`}
      onClick={onClick}
    >
      <Icon className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8" />
    </Button>
  );
});

NavigationButton.displayName = "NavigationButton";

function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  // Navigation handlers with useCallback for optimization
  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
  }, []);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => 
      prev === 0 ? CAROUSEL_IMAGES.length - 1 : prev - 1
    );
  }, []);

  // Touch handlers for swipe functionality
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const onTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrev();
    }
  }, [touchStart, touchEnd, goToNext, goToPrev]);

  // Auto-slide management
  const startAutoSlide = useCallback(() => {
    if (CAROUSEL_IMAGES.length <= 1) return;
    timerRef.current = setInterval(goToNext, SLIDE_INTERVAL);
  }, [goToNext]);

  const stopAutoSlide = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Hydration-safe client detection
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize auto-slide
  useEffect(() => {
    if (!isClient) return;
    startAutoSlide();
    return () => stopAutoSlide();
  }, [isClient, startAutoSlide, stopAutoSlide]);

  // Preload images for optimal performance
  useEffect(() => {
    if (!isClient) return;
    
    const preloadImages = () => {
      CAROUSEL_IMAGES.forEach((src) => {
        const img = new window.Image();
        img.src = src;
      });
    };

    preloadImages();
  }, [isClient]);

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      {/* Background Image (2.png) - Crystal clear, no blur */}
      <div className="absolute inset-0 -z-30 h-[120%] sm:h-[115%] md:h-[112%] lg:h-[110%] -top-[10%] sm:-top-[7.5%] md:-top-[6%] lg:-top-[5%]">
        <Image
          src={BACKGROUND_IMAGE}
          alt="Background"
          fill
          priority
          quality={100}
          className="object-cover object-center"
          sizes="100vw"
          unoptimized={false}
        />
      </div>

      {/* Darker overlay - No blur here */}
      <div className="absolute inset-0 -z-20 bg-black/20" />

      {/* Main Carousel Container */}
      <div 
        className="relative w-full max-w-[90vw] sm:max-w-[86vw] md:max-w-[82vw] lg:max-w-[78vw] xl:max-w-[74vw] 2xl:max-w-[1600px] h-[58vh] sm:h-[65vh] md:h-[70vh] lg:h-[75vh] xl:h-[78vh] 2xl:h-[80vh] max-h-[900px]"
        onMouseEnter={stopAutoSlide}
        onMouseLeave={startAutoSlide}
        onTouchStart={(e) => {
          stopAutoSlide();
          onTouchStart(e);
        }}
        onTouchMove={onTouchMove}
        onTouchEnd={() => {
          onTouchEnd();
          startAutoSlide();
        }}
      >
        {/* Glass-morphism Container with subtle blur only on container */}
        <div className="relative w-full h-full overflow-hidden rounded-2xl sm:rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-[2px] border border-white/20">
          {/* Slides */}
          <div 
            className="flex h-full transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {CAROUSEL_IMAGES.map((src, idx) => (
              <div 
                key={`slide-${idx}`}
                className="relative min-w-full h-full flex-shrink-0 flex items-center justify-center p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={src}
                    alt={`Model image ${idx + 1}`}
                    fill
                    priority={idx === 0 || idx === 1}
                    quality={95}
                    sizes="(max-width: 640px) 90vw, (max-width: 768px) 86vw, (max-width: 1024px) 82vw, (max-width: 1280px) 78vw, (max-width: 1536px) 74vw, 1600px"
                    className="object-contain drop-shadow-2xl"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Inner glow effect */}
          <div className="absolute inset-0 rounded-2xl sm:rounded-3xl shadow-[inset_0_0_40px_rgba(255,255,255,0.05)] pointer-events-none" />
        </div>

        {/* Navigation Arrows - Inside container, fully visible */}
        <NavigationButton direction="left" onClick={goToPrev} />
        <NavigationButton direction="right" onClick={goToNext} />
      </div>
    </section>
  );
}

export default memo(HeroCarousel);