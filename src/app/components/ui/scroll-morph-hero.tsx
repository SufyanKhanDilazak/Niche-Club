"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, useTransform, useSpring, useMotionValue } from "framer-motion";

export type AnimationPhase = "scatter" | "line" | "circle" | "bottom-strip";

interface FlipCardProps {
  src: string;
  index: number;
  total: number;
  phase: AnimationPhase;
  target: {
    x: number;
    y: number;
    rotation: number;
    scale: number;
    opacity: number;
  };
}

const IMG_WIDTH = 58;
const IMG_HEIGHT = 80;

function FlipCard({ src, index, target }: FlipCardProps) {
  return (
    <motion.div
      animate={{
        x: target.x,
        y: target.y,
        rotate: target.rotation,
        scale: target.scale,
        opacity: target.opacity,
      }}
      transition={{ type: "spring", stiffness: 40, damping: 15 }}
      style={{
        position: "absolute",
        width: IMG_WIDTH,
        height: IMG_HEIGHT,
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      className="cursor-pointer group"
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ rotateY: 180 }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 h-full w-full overflow-hidden rounded-xl shadow-lg bg-zinc-800"
          style={{ backfaceVisibility: "hidden" }}
        >
          <img
            src={src}
            alt={`product-${index}`}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-transparent" />
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 h-full w-full overflow-hidden rounded-xl shadow-lg bg-black flex flex-col items-center justify-center p-3 border border-white/10"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <p className="text-[8px] font-bold text-white/50 uppercase tracking-widest mb-1">
            Niche
          </p>
          <p className="text-[10px] font-medium text-white">Club</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

const TOTAL_IMAGES = 20;
const MAX_SCROLL = 3000;

const IMAGES = [
  "https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=300&q=80",
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300&q=80",
  "https://images.unsplash.com/photo-1529391409740-59f2cea08bc6?w=300&q=80",
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=300&q=80",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&q=80",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&q=80",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80",
  "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=300&q=80",
  "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&q=80",
  "https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=300&q=80",
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=300&q=80",
  "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=300&q=80",
  "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=300&q=80",
  "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300&q=80",
  "https://images.unsplash.com/photo-1604644401890-0bd678c83788?w=300&q=80",
  "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=300&q=80",
  "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=300&q=80",
  "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300&q=80",
  "https://images.unsplash.com/photo-1550614000-4895a10e1bfd?w=300&q=80",
  "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=300&q=80",
];

const lerp = (start: number, end: number, t: number) =>
  start * (1 - t) + end * t;

export default function IntroAnimation() {
  const [introPhase, setIntroPhase] = useState<AnimationPhase>("scatter");
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [isComplete, setIsComplete] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const virtualScroll = useMotionValue(0);
  const scrollRef = useRef(0);
  const isCompleteRef = useRef(false);

  // ── Container size ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    observer.observe(containerRef.current);
    setContainerSize({
      width: containerRef.current.offsetWidth,
      height: containerRef.current.offsetHeight,
    });
    return () => observer.disconnect();
  }, []);

  // ── Virtual scroll — releases page when done ───────────────────────────────
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // If animation is complete, don't intercept — let page scroll freely
      if (isCompleteRef.current) return;

      const next = Math.min(
        Math.max(scrollRef.current + e.deltaY, 0),
        MAX_SCROLL
      );
      scrollRef.current = next;
      virtualScroll.set(next);

      // Mark complete when we hit the end
      if (next >= MAX_SCROLL) {
        isCompleteRef.current = true;
        setIsComplete(true);
      } else {
        // Still animating — block page scroll
        e.preventDefault();
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (isCompleteRef.current) return;
      const deltaY = touchStartY - e.touches[0].clientY;
      touchStartY = e.touches[0].clientY;
      const next = Math.min(
        Math.max(scrollRef.current + deltaY, 0),
        MAX_SCROLL
      );
      scrollRef.current = next;
      virtualScroll.set(next);
      if (next >= MAX_SCROLL) {
        isCompleteRef.current = true;
        setIsComplete(true);
      } else {
        e.preventDefault();
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
    };
  }, [virtualScroll]);

  // ── Springs ────────────────────────────────────────────────────────────────
  const morphProgress = useTransform(virtualScroll, [0, 600], [0, 1]);
  const smoothMorph = useSpring(morphProgress, { stiffness: 40, damping: 20 });

  const scrollRotate = useTransform(virtualScroll, [600, 3000], [0, 360]);
  const smoothScrollRotate = useSpring(scrollRotate, {
    stiffness: 40,
    damping: 20,
  });

  const mouseX = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 30, damping: 20 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const normalizedX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseX.set(normalizedX * 80);
    };
    container.addEventListener("mousemove", handleMouseMove);
    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX]);

  // ── Intro sequence ─────────────────────────────────────────────────────────
  useEffect(() => {
    const t1 = setTimeout(() => setIntroPhase("line"), 500);
    const t2 = setTimeout(() => setIntroPhase("circle"), 2500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // ── Scatter positions ──────────────────────────────────────────────────────
  const scatterPositions = useMemo(() => {
    return IMAGES.map(() => ({
      x: (Math.random() - 0.5) * 1400,
      y: (Math.random() - 0.5) * 900,
      rotation: (Math.random() - 0.5) * 180,
      scale: 0.6,
      opacity: 0,
    }));
  }, []);

  // ── Subscribed values for render ───────────────────────────────────────────
  const [morphValue, setMorphValue] = useState(0);
  const [rotateValue, setRotateValue] = useState(0);
  const [parallaxValue, setParallaxValue] = useState(0);

  useEffect(() => {
    const u1 = smoothMorph.on("change", setMorphValue);
    const u2 = smoothScrollRotate.on("change", setRotateValue);
    const u3 = smoothMouseX.on("change", setParallaxValue);
    return () => {
      u1();
      u2();
      u3();
    };
  }, [smoothMorph, smoothScrollRotate, smoothMouseX]);

  const contentOpacity = useTransform(smoothMorph, [0.8, 1], [0, 1]);
  const contentY = useTransform(smoothMorph, [0.8, 1], [20, 0]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-white dark:bg-black overflow-hidden"
    >
      {/* Scroll complete hint */}
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 pointer-events-none"
        >
          
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
            className="w-px h-5 bg-black/20 dark:bg-white/20"
          />
        </motion.div>
      )}

      {/* Scroll progress bar */}
      <div className="absolute top-0 left-0 right-0 h-px bg-black/5 dark:bg-white/5 z-20">
        <motion.div
          className="h-full bg-black/20 dark:bg-white/20"
          style={{
            scaleX: useTransform(
              virtualScroll,
              [0, MAX_SCROLL],
              [0, 1]
            ),
            transformOrigin: "left",
          }}
        />
      </div>

      <div className="flex h-full w-full flex-col items-center justify-center">
        {/* Intro text */}
        <div className="absolute z-0 flex flex-col items-center justify-center text-center pointer-events-none top-1/2 -translate-y-1/2 px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={
              introPhase === "circle" && morphValue < 0.5
                ? { opacity: 1 - morphValue * 2, y: 0, filter: "blur(0px)" }
                : { opacity: 0, filter: "blur(10px)" }
            }
            transition={{ duration: 1 }}
            className="text-2xl sm:text-4xl font-medium tracking-tight text-black dark:text-white"
          >
            Premium Streetwear.
            <br />
            <span className="text-black/40 dark:text-white/40">New York.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={
              introPhase === "circle" && morphValue < 0.5
                ? { opacity: 0.5 - morphValue }
                : { opacity: 0 }
            }
            transition={{ duration: 1, delay: 0.2 }}
            className="mt-4 text-[10px] font-bold tracking-[0.32em] uppercase text-black/35 dark:text-white/35"
          >
            Scroll to Explore
          </motion.p>
        </div>

        {/* Arc content */}
        <motion.div
          style={{ opacity: contentOpacity, y: contentY }}
          className="absolute top-[8%] sm:top-[10%] z-10 flex flex-col items-center justify-center text-center pointer-events-none px-4"
        >
          <p className="text-[10px] tracking-[0.4em] uppercase text-black/35 dark:text-white/35 mb-3">
            Niche Club — New York
          </p>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-semibold text-black dark:text-white tracking-tight mb-3">
            Shop the Collection
          </h2>
          <p className="text-xs sm:text-sm text-black/45 dark:text-white/45 max-w-xs sm:max-w-md leading-relaxed">
            Premium quality at an affordable price.
            <br className="hidden sm:block" />
            Exclusive drops, clean silhouettes, elevated basics.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="relative flex items-center justify-center w-full h-full">
          {IMAGES.slice(0, TOTAL_IMAGES).map((src, i) => {
            let target = {
              x: 0,
              y: 0,
              rotation: 0,
              scale: 1,
              opacity: 1,
            };

            if (introPhase === "scatter") {
              target = scatterPositions[i];
            } else if (introPhase === "line") {
              const lineSpacing = 68;
              const lineTotalWidth = TOTAL_IMAGES * lineSpacing;
              target = {
                x: i * lineSpacing - lineTotalWidth / 2,
                y: 0,
                rotation: 0,
                scale: 1,
                opacity: 1,
              };
            } else {
              const isMobile = containerSize.width < 768;
              const minDimension = Math.min(
                containerSize.width,
                containerSize.height
              );
              const circleRadius = Math.min(minDimension * 0.35, 300);
              const circleAngle = (i / TOTAL_IMAGES) * 360;
              const circleRad = (circleAngle * Math.PI) / 180;
              const circlePos = {
                x: Math.cos(circleRad) * circleRadius,
                y: Math.sin(circleRad) * circleRadius,
                rotation: circleAngle + 90,
              };

              const baseRadius = Math.min(
                containerSize.width,
                containerSize.height * 1.5
              );
              const arcRadius = baseRadius * (isMobile ? 1.4 : 1.1);
              const arcApexY =
                containerSize.height * (isMobile ? 0.35 : 0.25);
              const arcCenterY = arcApexY + arcRadius;
              const spreadAngle = isMobile ? 100 : 130;
              const startAngle = -90 - spreadAngle / 2;
              const step = spreadAngle / (TOTAL_IMAGES - 1);
              const scrollProgress = Math.min(
                Math.max(rotateValue / 360, 0),
                1
              );
              const boundedRotation = -scrollProgress * spreadAngle * 0.8;
              const currentArcAngle =
                startAngle + i * step + boundedRotation;
              const arcRad = (currentArcAngle * Math.PI) / 180;

              const arcPos = {
                x: Math.cos(arcRad) * arcRadius + parallaxValue,
                y: Math.sin(arcRad) * arcRadius + arcCenterY,
                rotation: currentArcAngle + 90,
                scale: isMobile ? 1.4 : 1.8,
              };

              target = {
                x: lerp(circlePos.x, arcPos.x, morphValue),
                y: lerp(circlePos.y, arcPos.y, morphValue),
                rotation: lerp(
                  circlePos.rotation,
                  arcPos.rotation,
                  morphValue
                ),
                scale: lerp(1, arcPos.scale, morphValue),
                opacity: 1,
              };
            }

            return (
              <FlipCard
                key={i}
                src={src}
                index={i}
                total={TOTAL_IMAGES}
                phase={introPhase}
                target={target}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}