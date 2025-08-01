"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  /** Override mobile‐first images (≤ 640 px). */
  mobileImages?: readonly string[];
  /** Override desktop images (> 640 px). */
  desktopImages?: readonly string[];
  /** Milliseconds between auto‑slides. */
  slideInterval?: number;
};

const DEFAULT_MOBILE_IMAGES = [
  "/10.png",
  "/11.png",
  "/12.png",
  "/13.png",
] as const;

const DEFAULT_DESKTOP_IMAGES = [
  "/10.png",
  "/11.png",
  "/12.png",
  "/13.png",
] as const;

export default function HeroCarousel({
  mobileImages = DEFAULT_MOBILE_IMAGES,
  desktopImages = DEFAULT_DESKTOP_IMAGES,
  slideInterval = 5_000,
}: Props) {
  const [current, setCurrent] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const images = isMobile ? mobileImages : desktopImages;

  /* ────────────────── viewport detection ────────────────── */
  const updateViewport = useCallback(() => {
    setIsMobile(window.innerWidth < 640);
  }, []);

  useEffect(() => {
    updateViewport(); // initial check
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, [updateViewport]);

  /* ────────────────── carousel helpers ────────────────── */
  const next = useCallback(
    () => setCurrent((p) => (p + 1) % images.length),
    [images.length],
  );

  const prev = useCallback(
    () => setCurrent((p) => (p === 0 ? images.length - 1 : p - 1)),
    [images.length],
  );

  /* ────────────────── auto‑slide logic ────────────────── */
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);


  useEffect(() => {
    // reset when breakpoints swap
    setCurrent(0);
  }, [isMobile]);

  const startAutoSlide = useCallback(() => {
    if (images.length <= 1) return;
    timerRef.current = setInterval(next, slideInterval);
  }, [images.length, next, slideInterval]);

  const stopAutoSlide = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    startAutoSlide();
    return stopAutoSlide;
  }, [startAutoSlide, stopAutoSlide]);

  /* ────────────────── image preload ────────────────── */
  useEffect(() => {
    [...mobileImages, ...desktopImages].forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, [mobileImages, desktopImages]);

  /* ────────────────── render ────────────────── */
  return (
    <section className="mx-auto mb-16 w-full select-none font-montserrat">
      <div
        id="hero-carousel"
        className="relative h-[60vh] max-h-[800px] overflow-hidden rounded-lg sm:h-[55vh] md:h-[65vh] xl:h-[70vh]"
        onMouseEnter={stopAutoSlide}
        onMouseLeave={startAutoSlide}
      >
        {/* slides */}
        <div
          className="flex h-full transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {images.map((src, idx) => (
            <div key={`${src}-${idx}`} className="relative min-w-full">
              <Image
                src={src}
                alt={`Hero slide ${idx + 1}`}
                fill
                priority={idx === 0}
                sizes="100vw"
                quality={85}
                className="object-cover"
              />
              {isMobile && (
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
              )}
            </div>
          ))}
        </div>

        {/* arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              aria-label="Previous slide"
              className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm hover:bg-black/70"
              onClick={prev}
            >
              <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
            </Button>
            <Button
              variant="ghost"
              aria-label="Next slide"
              className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm hover:bg-black/70"
              onClick={next}
            >
              <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
            </Button>
          </>
        )}

        {/* dots */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 space-x-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                aria-label={`Go to slide ${idx + 1}`}
                onClick={() => setCurrent(idx)}
                className={`h-2 w-2 rounded-full transition-all ${
                  idx === current
                    ? "scale-125 bg-white shadow-lg"
                    : "bg-white/60 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
