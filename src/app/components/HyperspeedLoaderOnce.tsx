"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

// Load heavy effect only on the client
const Hyperspeed = dynamic(() => import("./Hyperspeed"), { ssr: false });

function hasWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl") || c.getContext("experimental-webgl"));
  } catch {
    return false;
  }
}

// Optional: wait for visible videos to be ready (cap to avoid being stuck)
async function waitForVideos(timeoutMs = 4000) {
  const videos = Array.from(document.querySelectorAll<HTMLVideoElement>("video"));
  if (videos.length === 0) return;

  const timeLimit = new Promise<void>((resolve) => setTimeout(resolve, timeoutMs));
  const readiness = videos.map(
    (v) =>
      new Promise<void>((resolve) => {
        // HAVE_FUTURE_DATA = 3
        if ((v.readyState ?? 0) >= 3) return resolve();
        const onReady = () => {
          v.removeEventListener("canplaythrough", onReady);
          v.removeEventListener("loadeddata", onReady);
          resolve();
        };
        v.addEventListener("canplaythrough", onReady, { once: true });
        v.addEventListener("loadeddata", onReady, { once: true }); // Safari sometimes fires this first
      })
  );
  await Promise.race([Promise.all(readiness), timeLimit]);
}

export default function HyperspeedLoaderOnce() {
  // If pre-paint script set this, don't render (prevents reload flicker)
  const alreadyHidden =
    typeof document !== "undefined" &&
    document.documentElement.getAttribute("data-hyperspeed-hide") === "1";

  const [show, setShow] = useState(!alreadyHidden);
  const [fade, setFade] = useState(false);
  const [webglOk, setWebglOk] = useState(true);

  // Enforce a minimum visible time so mobiles don’t “blink black then vanish”
  const startedAtRef = useRef<number | null>(null);
  const MIN_SHOW_MS = 1000; // tweak 900–1200 for taste

  useEffect(() => {
    // First-visit only: if already seen, bail out
    try {
      if (localStorage.getItem("seenHyperspeedLoader") === "true") {
        setShow(false);
        return;
      }
    } catch {}

    // mark start time right away
    startedAtRef.current = performance.now();
    setWebglOk(hasWebGL());

    const finish = () => {
      // ensure a minimum visible duration
      const now = performance.now();
      const seenMs = startedAtRef.current ? now - startedAtRef.current : MIN_SHOW_MS;
      const waitMs = Math.max(MIN_SHOW_MS - seenMs, 0);

      setTimeout(() => {
        setFade(true);
        try { localStorage.setItem("seenHyperspeedLoader", "true"); } catch {}
        const t = setTimeout(() => setShow(false), 800); // match CSS fade transition
        return () => clearTimeout(t);
      }, waitMs);
    };

    const run = async () => {
      // If load already happened before mount, don’t insta-finish; still respect min show
      if (document.readyState !== "complete") {
        await new Promise<void>((r) => window.addEventListener("load", () => r(), { once: true }));
      }
      // Optional: wait for videos (with a cap)
      await waitForVideos(4000);
      finish();
    };

    run();

    // No listeners to clean up; all awaited promises are capped
  }, []);

  if (!show) return null;

  return (
    <div className={`hs-loader ${fade ? "hs-loader--hide" : ""}`}>
      <div className="hs-stage">
        {webglOk ? (
          <Hyperspeed
            effectOptions={{
              distortion: "turbulentDistortion",
              lanesPerRoad: 3,
              roadWidth: 10,
              islandWidth: 2,
              length: 400,
              fov: 90,
              fovSpeedUp: 150,
              speedUp: 2,
              carLightsFade: 0.4,
              totalSideLightSticks: 40,
              lightPairsPerRoadWay: 50,
              colors: {
                roadColor: 0x080808,
                islandColor: 0x0a0a0a,
                background: 0x000000,
                shoulderLines: 0x131318,
                brokenLines: 0x131318,
                leftCars: [0xd856bf, 0x6750a2, 0xc247ac],
                rightCars: [0x03b3c3, 0x0e5ea5, 0x324555],
                sticks: 0x03b3c3,
              },
            }}
          />
        ) : (
          // Fallback spinner if WebGL not available/blocked
          <div style={{display:"grid",placeItems:"center",height:"100%"}}>
            <div
              aria-label="Loading"
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                border: "3px solid transparent",
                borderTopColor: "var(--theme-primary, #a90068)",
                borderRightColor: "var(--theme-primary, #a90068)",
                filter: "drop-shadow(0 0 10px var(--theme-primary, #a90068))",
                animation: "hsSpin .8s linear infinite",
              }}
            />
            <style>{`@keyframes hsSpin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}
      </div>

      <div className="hs-overlay">
        <div className="hs-title">Loading your Niche…</div>
      </div>
    </div>
  );
}
