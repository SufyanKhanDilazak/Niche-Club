"use client";

import React, { useEffect, useRef } from "react";

type AuroraStarsBackgroundProps = {
  /** Your Cloudinary video URL (f_auto is fine). */
  src?: string;
  /** Poster image shown before/if the video plays. */
  poster?: string;
};

/**
 * Fullscreen background video that autoplays silently and loops.
 * iOS-safe: uses muted+playsInline and forces muted prior to play().
 * Also adds a one-time user-interaction fallback in case a browser blocks autoplay.
 */
export default function AuroraStarsBackground({
  src = "https://res.cloudinary.com/dxtq1hdrz/video/upload/q_auto,f_auto/v1752020163/3d_ufmaf5",
  poster = "/3d-poster.jpg",
}: AuroraStarsBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Build explicit WebM/MP4 sources for broader coverage in addition to f_auto.
  // (If src doesn't contain "f_auto", we still derive alternatives defensively.)
  const toFormat = (fmt: "mp4" | "webm") =>
    src.includes("f_auto") ? src.replace("f_auto", `f_${fmt}`) : `${src}.${fmt}`;
  const webmSrc = toFormat("webm");
  const mp4Src = toFormat("mp4");

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    // Ensure muted BEFORE play (required for autoplay on iOS/Chrome policies).
    v.muted = true;
    // Help some iOS builds:
    (v as any).playsInline = true;
    (v as any).webkitPlaysInline = true;

    // Try immediate playback; if blocked, retry on first user interaction.
    try {
      const p = v.play();
      if (p && typeof p.then === "function") {
        p.catch(() => {
          const resume = () => {
            v.play().finally(() => {
              document.removeEventListener("pointerdown", resume);
              document.removeEventListener("touchstart", resume);
            });
          };
          document.addEventListener("pointerdown", resume, { once: true });
          document.addEventListener("touchstart", resume, { once: true, passive: true });
        });
      }
    } catch {
      /* no-op */
    }
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ backgroundColor: "var(--theme-bg, #000)" }}
    >
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster={poster}
        controls={false}
        // Avoid accidental pausing/select on iOS
        style={{ userSelect: "none" }}
      >
        {/* Prefer explicit sources for codec coverage; f_auto remains a good fallback */}
        <source src={webmSrc} type="video/webm" />
        <source src={mp4Src} type="video/mp4" />
        {/* As an absolute fallback, browsers that can't play video will ignore this. */}
      </video>
      {/* Optional readability overlay (uncomment if you need contrast):
      <div className="absolute inset-0 bg-black/20" />
      */}
    </div>
  );
}
