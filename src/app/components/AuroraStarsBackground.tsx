"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "./theme-context";

type ThemeKey = "light" | "dark";

interface AuroraStarsBackgroundProps {
  children?: React.ReactNode;
}

// === Your original assets (kept as-is; iOS behavior unchanged) ===
const VIDEO_ASSETS = {
  dark: {
    video: "https://res.cloudinary.com/dxtq1hdrz/video/upload/q_auto,f_auto/v1752020163/3d_ufmaf5",
    poster: "/3d-poster.jpg",
  },
  light: {
    video: "https://res.cloudinary.com/dxtq1hdrz/video/upload/q_auto,f_auto/v1752020150/sky_zbzkub",
    poster: "/sky-poster.jpg",
  },
} as const;

export default function AuroraStarsBackground({ children }: AuroraStarsBackgroundProps) {
  const { isDarkMode, isThemeLoaded } = useTheme();

  // --- state mirrors your original so semantics stay identical ---
  const [isClient, setIsClient] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [videoReady, setVideoReady] = useState<{ light: boolean; dark: boolean }>({
    light: false,
    dark: false,
  });
  const [activeVideo, setActiveVideo] = useState<ThemeKey>("light");
  const [initialThemeDetected, setInitialThemeDetected] = useState(false);
  const [clientTheme, setClientTheme] = useState<ThemeKey>("light");

  // extra perf/ux flags
  const [needsTap, setNeedsTap] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [saveData, setSaveData] = useState(false);

  const lightVideoRef = useRef<HTMLVideoElement>(null);
  const darkVideoRef = useRef<HTMLVideoElement>(null);
  const transitionTimeoutRef = useRef<number | null>(null);

  // ================= helpers =================
  const safePlay = useCallback(async (el?: HTMLVideoElement | null) => {
    if (!el) return false;
    try {
      const p = el.play();
      if (p) await p;
      return true;
    } catch {
      // single retry (Android WebView/older Chromium)
      await new Promise((r) => setTimeout(r, 120));
      try {
        const p2 = el.play();
        if (p2) await p2;
        return true;
      } catch {
        return false;
      }
    }
  }, []);

  const pauseEl = (el?: HTMLVideoElement | null) => {
    try {
      el?.pause();
    } catch {}
  };

  const isSafariOrIOS = useCallback(() => {
    if (typeof navigator === "undefined") return false;
    const ua = navigator.userAgent;
    return /iPad|iPhone|iPod|Safari/i.test(ua) && !/Chrome/i.test(ua);
  }, []);

  // Initial theme + environment (identical semantics to your original)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedTheme = localStorage.getItem("theme");
    const systemDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
    const initial: ThemeKey =
      storedTheme === "dark" || storedTheme === "light"
        ? (storedTheme as ThemeKey)
        : systemDark
        ? "dark"
        : "light";

    setClientTheme(initial);
    setActiveVideo(initial);
    setInitialThemeDetected(true);
    setIsClient(true);

    // perf policies
    setReducedMotion(window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true);
    // @ts-expect-error non-standard network info
    setSaveData(Boolean(navigator?.connection?.saveData));
  }, []);

  // Keep your iOS gating exact
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

  // Sync with theme context when it loads (no functional change)
  useEffect(() => {
    if (isThemeLoaded && initialThemeDetected) {
      const t: ThemeKey = isDarkMode ? "dark" : "light";
      if (t !== clientTheme) setClientTheme(t);
    }
  }, [isDarkMode, isThemeLoaded, initialThemeDetected, clientTheme]);

  // Attach a single loadeddata listener per element; no .load() (prevents buffer flush)
  useEffect(() => {
    if (!isClient) return;

    const attach = (el: HTMLVideoElement | null, key: ThemeKey) => {
      if (!el) return;
      const onLoaded = () => {
        setVideoReady((p) => (p[key] ? p : { ...p, [key]: true }));
      };
      el.addEventListener("loadeddata", onLoaded, { once: true });
      // If already buffered (bfcache/back nav)
      if (el.readyState >= 2) setVideoReady((p) => (p[key] ? p : { ...p, [key]: true }));
      return () => el.removeEventListener("loadeddata", onLoaded);
    };

    const c1 = attach(lightVideoRef.current, "light");
    const c2 = attach(darkVideoRef.current, "dark");
    return () => {
      c1 && c1();
      c2 && c2();
    };
  }, [isClient]);

  // === Resource hints (tiny but free wins) ===
  useEffect(() => {
    if (!isClient) return;
    // Preconnect to Cloudinary
    const pc = document.createElement("link");
    pc.rel = "preconnect";
    pc.href = "https://res.cloudinary.com";
    pc.crossOrigin = "";
    document.head.appendChild(pc);

    // Preload only the active theme video
    const href = VIDEO_ASSETS[clientTheme].video + ".mp4"; // Cloudinary serves mp4; explicit helps preloader
    const pl = document.createElement("link");
    pl.rel = "preload";
    pl.as = "video";
    pl.href = href;
    pl.crossOrigin = "anonymous";
    document.head.appendChild(pl);

    return () => {
      try {
        document.head.removeChild(pc);
        document.head.removeChild(pl);
      } catch {}
    };
  }, [isClient, clientTheme]);

  // Start the active theme when ready; pause the hidden one
  useEffect(() => {
    if (!isClient || !userInteracted || !initialThemeDetected) return;

    const activeRef = clientTheme === "light" ? lightVideoRef.current : darkVideoRef.current;
    const hiddenRef = clientTheme === "light" ? darkVideoRef.current : lightVideoRef.current;

    // never decode two streams
    pauseEl(hiddenRef);

    // policy: poster-only for reduced motion / data saver
    if (reducedMotion || saveData) {
      pauseEl(activeRef);
      setActiveVideo(clientTheme);
      setNeedsTap(false);
      return;
    }

    const startIfReady = async () => {
      if (videoReady[clientTheme] && activeRef) {
        const ok = await safePlay(activeRef);
        setNeedsTap(!ok);
        setActiveVideo(clientTheme);
      }
    };
    void startIfReady();
  }, [
    isClient,
    userInteracted,
    initialThemeDetected,
    clientTheme,
    videoReady.light,
    videoReady.dark,
    reducedMotion,
    saveData,
    safePlay,
  ]);

  // Theme switch crossfade — pause hidden, brief will-change for smoothness
  useEffect(() => {
    if (!initialThemeDetected || !userInteracted) return;
    const next: ThemeKey = clientTheme;
    if (next === activeVideo) return;

    if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);

    const currentRef = activeVideo === "light" ? lightVideoRef : darkVideoRef;
    const nextRef = next === "light" ? lightVideoRef : darkVideoRef;

    // pause hidden immediately
    pauseEl(currentRef.current);

    // add short will-change to help compositor
    if (currentRef.current) currentRef.current.style.willChange = "opacity";
    if (nextRef.current) nextRef.current.style.willChange = "opacity";

    if (currentRef.current) currentRef.current.style.opacity = "0";

    const run = async () => {
      if (nextRef.current && videoReady[next] && !(reducedMotion || saveData)) {
        nextRef.current.style.opacity = "1";
        nextRef.current.currentTime = 0;
        const ok = await safePlay(nextRef.current);
        setNeedsTap(!ok);
      }
    };
    void run();

    transitionTimeoutRef.current = window.setTimeout(() => {
      if (currentRef.current) currentRef.current.style.willChange = "";
      if (nextRef.current) nextRef.current.style.willChange = "";
      setActiveVideo(next);
    }, 300);

    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
        transitionTimeoutRef.current = null;
      }
    };
  }, [
    clientTheme,
    initialThemeDetected,
    userInteracted,
    activeVideo,
    videoReady,
    reducedMotion,
    saveData,
    safePlay,
  ]);

  // Pause on background; try resume on visible
  useEffect(() => {
    const onVis = () => {
      const visible = document.visibilityState === "visible";
      const activeRef = activeVideo === "light" ? lightVideoRef.current : darkVideoRef.current;
      const hiddenRef = activeVideo === "light" ? darkVideoRef.current : lightVideoRef.current;

      if (!visible) {
        pauseEl(activeRef);
        pauseEl(hiddenRef);
      } else if (!(reducedMotion || saveData) && videoReady[activeVideo] && activeRef) {
        void safePlay(activeRef);
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [activeVideo, videoReady, reducedMotion, saveData, safePlay]);

  // Common props; preload is dynamic: active="auto", inactive="metadata"
  const baseVideoProps = {
    muted: true,
    playsInline: true,
    loop: true,
    controls: false,
    tabIndex: -1,
    "aria-hidden": true,
    disablePictureInPicture: true as unknown as boolean,
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

  // SSR fallback — poster only (prevents flash)
  if (!isClient || !initialThemeDetected) {
    return (
      <>
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundImage: `url(${
              clientTheme === "dark" ? VIDEO_ASSETS.dark.poster : VIDEO_ASSETS.light.poster
            })`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            zIndex: -1,
          }}
        />
        {children}
      </>
    );
  }

  const showLight =
    clientTheme === "light" && videoReady.light && userInteracted && !(reducedMotion || saveData);
  const showDark =
    clientTheme === "dark" && videoReady.dark && userInteracted && !(reducedMotion || saveData);

  return (
    <>
      {/* Fixed background container */}
      <div style={{ position: "fixed", inset: 0, zIndex: -1, overflow: "hidden" }}>
        {/* Light video */}
        <video
          ref={lightVideoRef}
          src={VIDEO_ASSETS.light.video}
          poster={VIDEO_ASSETS.light.poster}
          preload={clientTheme === "light" ? "auto" : "metadata"}
          style={{ ...videoStyle, opacity: showLight ? 1 : 0 }}
          {...baseVideoProps}
          onLoadedData={() =>
            setVideoReady((prev) => (prev.light ? prev : { ...prev, light: true }))
          }
        />

        {/* Dark video */}
        <video
          ref={darkVideoRef}
          src={VIDEO_ASSETS.dark.video}
          poster={VIDEO_ASSETS.dark.poster}
          preload={clientTheme === "dark" ? "auto" : "metadata"}
          style={{ ...videoStyle, opacity: showDark ? 1 : 0 }}
          {...baseVideoProps}
          onLoadedData={() =>
            setVideoReady((prev) => (prev.dark ? prev : { ...prev, dark: true }))
          }
        />

        {/* Poster fallback stays until first decoded frame (or when policies require poster-only) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${
              clientTheme === "dark" ? VIDEO_ASSETS.dark.poster : VIDEO_ASSETS.light.poster
            })`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity:
              (!videoReady.light && clientTheme === "light") ||
              (!videoReady.dark && clientTheme === "dark") ||
              !userInteracted ||
              reducedMotion ||
              saveData
                ? 1
                : 0,
            transition: "opacity 0.3s ease-in-out",
            zIndex: -1,
          }}
        />

        {/* Tap-to-start only when autoplay is blocked (keeps iOS Safari flow unchanged) */}
        {needsTap && !(reducedMotion || saveData) && (
          <button
            onClick={async () => {
              const target =
                clientTheme === "light" ? lightVideoRef.current : darkVideoRef.current;
              const ok = await safePlay(target);
              setNeedsTap(!ok);
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
            }}
          />
        )}
      </div>

      {children}
    </>
  );
}
