"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

interface AuroraStarsBackgroundProps {
  children?: React.ReactNode;
}

// Single 3D video asset
const VIDEO_CONFIG = {
  video: "https://res.cloudinary.com/dxtq1hdrz/video/upload/q_auto,f_auto/v1752020163/3d_ufmaf5",
  poster: "/3d-poster.jpg",
} as const;

export default function AuroraStarsBackground({ children }: AuroraStarsBackgroundProps) {
  const [isClient, setIsClient] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [needsTap, setNeedsTap] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [saveData, setSaveData] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  const safePlay = useCallback(async (el?: HTMLVideoElement | null) => {
    if (!el) return false;
    try {
      const promise = el.play();
      if (promise) await promise;
      return true;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 120));
      try {
        const retryPromise = el.play();
        if (retryPromise) await retryPromise;
        return true;
      } catch {
        return false;
      }
    }
  }, []);

  const pauseVideo = useCallback((el?: HTMLVideoElement | null) => {
    try {
      el?.pause();
    } catch {}
  }, []);

  const isSafariOrIOS = useCallback(() => {
    if (typeof navigator === "undefined") return false;
    const ua = navigator.userAgent;
    return /iPad|iPhone|iPod|Safari/i.test(ua) && !/Chrome/i.test(ua);
  }, []);

  // Initialize environment and policies
  useEffect(() => {
    if (typeof window === "undefined") return;

    setIsClient(true);
    setReducedMotion(window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true);
    // @ts-expect-error non-standard network info
    setSaveData(Boolean(navigator?.connection?.saveData));
  }, []);

  // Handle iOS Safari interaction requirement
  useEffect(() => {
    if (!isClient) return;

    const hasInteracted = sessionStorage.getItem("videoInteraction") === "true";
    if (hasInteracted || !isSafariOrIOS()) {
      setUserInteracted(true);
    } else {
      const handleInteraction = () => {
        setUserInteracted(true);
        sessionStorage.setItem("videoInteraction", "true");
        document.removeEventListener("touchstart", handleInteraction);
        document.removeEventListener("click", handleInteraction);
      };
      document.addEventListener("touchstart", handleInteraction, { passive: true });
      document.addEventListener("click", handleInteraction);
      return () => {
        document.removeEventListener("touchstart", handleInteraction);
        document.removeEventListener("click", handleInteraction);
      };
    }
  }, [isClient, isSafariOrIOS]);

  // Video ready detection
  useEffect(() => {
    if (!isClient) return;

    const video = videoRef.current;
    if (!video) return;

    const onLoaded = () => {
      setVideoReady(true);
    };

    video.addEventListener("loadeddata", onLoaded, { once: true });
    if (video.readyState >= 2) setVideoReady(true);

    return () => video.removeEventListener("loadeddata", onLoaded);
  }, [isClient]);

  // Resource hints for performance
  useEffect(() => {
    if (!isClient) return;

    const preconnect = document.createElement("link");
    preconnect.rel = "preconnect";
    preconnect.href = "https://res.cloudinary.com";
    preconnect.crossOrigin = "";
    document.head.appendChild(preconnect);

    const preload = document.createElement("link");
    preload.rel = "preload";
    preload.as = "video";
    preload.href = VIDEO_CONFIG.video + ".mp4";
    preload.crossOrigin = "anonymous";
    document.head.appendChild(preload);

    return () => {
      try {
        document.head.removeChild(preconnect);
        document.head.removeChild(preload);
      } catch {}
    };
  }, [isClient]);

  // Start video playback when ready
  useEffect(() => {
    if (!isClient || !userInteracted || !videoReady) return;

    const video = videoRef.current;
    if (!video) return;

    if (reducedMotion || saveData) {
      pauseVideo(video);
      setNeedsTap(false);
      return;
    }

    const startPlayback = async () => {
      const success = await safePlay(video);
      setNeedsTap(!success);
    };

    void startPlayback();
  }, [isClient, userInteracted, videoReady, reducedMotion, saveData, safePlay, pauseVideo]);

  // Handle visibility changes
  useEffect(() => {
    if (!isClient) return;

    const handleVisibilityChange = () => {
      const video = videoRef.current;
      if (!video) return;

      if (document.visibilityState === "visible") {
        if (!(reducedMotion || saveData) && videoReady) {
          void safePlay(video);
        }
      } else {
        pauseVideo(video);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isClient, videoReady, reducedMotion, saveData, safePlay, pauseVideo]);

  const videoProps = {
    muted: true,
    playsInline: true,
    loop: true,
    controls: false,
    tabIndex: -1,
    "aria-hidden": true,
    disablePictureInPicture: true,
    controlsList: "nodownload noplaybackrate nofullscreen",
  } as const;

  const videoStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    pointerEvents: "none",
    transition: "opacity 0.3s ease-in-out",
  };

  // SSR fallback
  if (!isClient) {
    return (
      <>
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundImage: `url(${VIDEO_CONFIG.poster})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            zIndex: -1,
          }}
        />
        {children}
      </>
    );
  }

  const showVideo = videoReady && userInteracted && !(reducedMotion || saveData);

  return (
    <>
      <div style={{ position: "fixed", inset: 0, zIndex: -1, overflow: "hidden" }}>
        <video
          ref={videoRef}
          src={VIDEO_CONFIG.video}
          poster={VIDEO_CONFIG.poster}
          preload="auto"
          style={{ ...videoStyle, opacity: showVideo ? 1 : 0 }}
          {...videoProps}
          onLoadedData={() => setVideoReady(true)}
        />

        {/* Poster fallback */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${VIDEO_CONFIG.poster})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: !videoReady || !userInteracted || reducedMotion || saveData ? 1 : 0,
            transition: "opacity 0.3s ease-in-out",
            zIndex: -1,
          }}
        />

        {/* Tap to start for iOS Safari autoplay block */}
        {needsTap && !(reducedMotion || saveData) && (
          <button
            onClick={async () => {
              const success = await safePlay(videoRef.current);
              setNeedsTap(!success);
            }}
            aria-label="Start background animation"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              background: "transparent",
              border: 0,
              cursor: "pointer",
              zIndex: 1,
            }}
          />
        )}
      </div>

      {children}
    </>
  );
}