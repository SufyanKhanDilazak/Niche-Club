"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

// ✅ Load Hyperspeed only on the client (avoids Vercel SSR issues)
const Hyperspeed = dynamic(() => import("./Hyperspeed"), { ssr: false });

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
    );
  } catch {
    return false;
  }
}

// ✅ Wait for background videos (but don't freeze if slow)
async function waitForVideos(timeoutMs = 3000) {
  const videos = Array.from(document.querySelectorAll("video"));
  if (videos.length === 0) return;

  const timeout = new Promise<void>(resolve => setTimeout(resolve, timeoutMs));

  const checks = videos.map(
    v =>
      new Promise<void>(resolve => {
        if (v.readyState >= 3) return resolve();
        const done = () => {
          v.removeEventListener("canplaythrough", done);
          v.removeEventListener("loadeddata", done);
          resolve();
        };
        v.addEventListener("canplaythrough", done, { once: true });
        v.addEventListener("loadeddata", done, { once: true });
      })
  );

  await Promise.race([Promise.all(checks), timeout]);
}

export default function HyperspeedLoaderOnce() {
  const [show, setShow] = useState(true);
  const [fade, setFade] = useState(false);
  const [webglOk, setWebglOk] = useState(true);

  const start = useRef<number>(0);
  const MIN_TIME = 1200; // ✅ Mobile-safe delay

  useEffect(() => {
    // ✅ First-visit only
    if (localStorage.getItem("seenHyperspeedLoader") === "true") {
      setShow(false);
      return;
    }

    setWebglOk(hasWebGL());
    start.current = performance.now();

    const finish = () => {
      const elapsed = performance.now() - start.current;
      const wait = Math.max(MIN_TIME - elapsed, 0);

      setTimeout(() => {
        setFade(true);
        localStorage.setItem("seenHyperspeedLoader", "true");
        setTimeout(() => setShow(false), 900); // match fade timing
      }, wait);
    };

    const run = async () => {
      if (document.readyState !== "complete") {
        await new Promise<void>(resolve =>
          window.addEventListener("load", () => resolve(), { once: true })
        );
      }

      await waitForVideos(3000);
      finish();
    };

    run();
  }, []);

  if (!show) return null;

  return (
    <div className={`hs-loader ${fade ? "hs-loader--hide" : ""}`}>
      <div className="hs-stage">
        {webglOk ? <Hyperspeed /> : <div className="hs-fallback" />}
      </div>

      <div className="hs-overlay">
        <div className="hs-title">Loading your Niche…</div>
      </div>

      {/* ✅ Inline global CSS (BC: Safari priority / Vercel consistency) */}
      <style jsx global>{`
        .hs-loader {
          position: fixed;
          inset: 0;
          background: #000;
          display: grid;
          place-items: center;
          z-index: 9999999;
          opacity: 1;
          transition: opacity .9s ease;
        }
        .hs-loader--hide {
          opacity: 0;
          pointer-events: none;
        }
        .hs-stage {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        .hs-overlay {
          position: absolute;
          width: 100%;
          bottom: 10%;
          text-align: center;
        }
        .hs-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: #a90068;
          text-shadow: 0 0 10px #a9006888;
          font-family: inherit;
        }
        .hs-fallback {
          width: 72px;
          height: 72px;
          margin: auto;
          border-radius: 50%;
          border: 3px solid transparent;
          border-top-color: #a90068;
          border-right-color: #a90068;
          animation: hsSpin .85s linear infinite;
          filter: drop-shadow(0 0 10px #a90068);
        }
        @keyframes hsSpin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
