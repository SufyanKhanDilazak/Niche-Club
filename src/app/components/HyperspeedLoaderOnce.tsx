"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Hyperspeed = dynamic(() => import("./Hyperspeed"), { ssr: false });

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
  } catch {
    return false;
  }
}

async function waitForVideos(timeoutMs: number = 3000): Promise<void> {
  const videos = Array.from(document.querySelectorAll("video"));
  if (videos.length === 0) return;
  const timeout = new Promise<void>((resolve) => setTimeout(resolve, timeoutMs));
  const checks = videos.map(
    (v) =>
      new Promise<void>((resolve) => {
        if (v.readyState >= 3) return resolve();
        const ready = () => {
          v.removeEventListener("canplaythrough", ready);
          v.removeEventListener("loadeddata", ready);
          resolve();
        };
        v.addEventListener("canplaythrough", ready, { once: true });
        v.addEventListener("loadeddata", ready, { once: true });
      })
  );
  await Promise.race([Promise.all(checks), timeout]);
}

export default function HyperspeedLoaderOnce() {
  const [show, setShow] = useState(true);
  const [ready, setReady] = useState(false);
  const [fade, setFade] = useState(false);
  const [webglOk, setWebglOk] = useState(true);

  useEffect(() => {
    if (localStorage.getItem("seenHyperspeedLoader") === "true") {
      setShow(false);
      return;
    }
    setWebglOk(hasWebGL());
    const run = async () => {
      if (document.readyState !== "complete") {
        await new Promise<void>((resolve) =>
          window.addEventListener("load", () => resolve(), { once: true })
        );
      }
      await waitForVideos(3000);
      setReady(true);
    };
    run();
  }, []);

  if (!show) return null;

  const handleTapToEnter = () => {
    if (!ready) return;
    try {
      sessionStorage.setItem("videoInteraction", "true");
    } catch {}
    setFade(true);
    localStorage.setItem("seenHyperspeedLoader", "true");
    setTimeout(() => setShow(false), 900);
  };

  return (
    <div
      className={`hs-loader ${fade ? "hs-loader--hide" : ""}`}
      onClick={ready ? handleTapToEnter : undefined}
    >
      <div className="hs-stage">{webglOk ? <Hyperspeed /> : <div className="hs-fallback" />}</div>

      <div className="hs-overlay">
        <div className="hs-title">{ready ? "Tap Anywhere to Enter" : "Loading Your Niche..."}</div>
      </div>

      <style jsx global>{`
  .hs-loader {
    position: fixed;
    inset: 0;
    background: #000;
    display: grid;
    place-items: center;
    z-index: 9999999;
    opacity: 1;
    /* faster, smoother fade; opacity only */
    transition: opacity 0.45s ease;
    will-change: opacity;
    backface-visibility: hidden;
  }
  .hs-loader--hide {
    opacity: 0;
    pointer-events: none;
  }

  /* Stage stays centered; no layout jank */
  .hs-stage {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: grid;
    place-items: center;
    will-change: transform, opacity;
    backface-visibility: hidden;
    transform: translateZ(0);
  }

  /* Force whatever Hyperspeed renders (video/canvas/img) to be center-cover */
  .hs-stage > *,
  .hs-stage video,
  .hs-stage canvas,
  .hs-stage img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%); /* center from first paint */
    width: 100vw;
    height: 100vh;
    max-width: none;
    max-height: none;
    object-fit: cover;
    object-position: center center;
  }
  @media (max-aspect-ratio: 9/16) {
    .hs-stage > *,
    .hs-stage video,
    .hs-stage canvas,
    .hs-stage img {
      min-width: 100vw;
      min-height: 100vh;
    }
  }

  /* Overlay text: locked dead-center from *first* paint */
  .hs-overlay {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    text-align: center;
    pointer-events: none;
    padding: 0 4vw;
  }

  .hs-title {
    color: #fff;
    font-family: inherit;
    font-weight: 600;
    /* prevent font metrics jump */
    line-height: 1;
    letter-spacing: 0.02em;
    font-size: clamp(1rem, 2.6vw, 1.6rem);
    text-shadow: 0 0 8px #ffffff88;
    /* IMPORTANT: no translateY on intro (removes snap/jump) */
    opacity: 0;
    will-change: opacity;
    animation: fadeInOnly 320ms ease-out forwards, softPulse 1600ms ease-in-out 260ms infinite;
  }

  @keyframes fadeInOnly {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  /* very light pulse using opacity only (no movement = no reflow) */
  @keyframes softPulse {
    0%, 100% { opacity: 0.94; }
    50%      { opacity: 1; }
  }

  .hs-fallback {
    width: 60px;
    height: 60px;
    border: 4px solid transparent;
    border-top-color: #ffffff;
    border-right-color: #ffffff;
    border-radius: 50%;
    animation: hsSpin 0.8s linear infinite;
    margin: auto;
  }
  @keyframes hsSpin { to { transform: rotate(360deg); } }
`}</style>


    </div>
  );
}
