"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Hyperspeed = dynamic(() => import("./Hyperspeed"), { ssr: false });

function hasWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl") || c.getContext("experimental-webgl"));
  } catch {
    return false;
  }
}

async function waitForVideos(timeoutMs = 5000) {
  const videos = Array.from(document.querySelectorAll<HTMLVideoElement>("video"));
  if (videos.length === 0) return;

  const timeLimit = new Promise<void>((resolve) => setTimeout(resolve, timeoutMs));
  const readiness = videos.map(
    (v) =>
      new Promise<void>((resolve) => {
        if ((v.readyState ?? 0) >= 3 /* HAVE_FUTURE_DATA */) return resolve();
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
  const alreadyHidden =
    typeof document !== "undefined" &&
    document.documentElement.getAttribute("data-hyperspeed-hide") === "1";

  const [show, setShow] = useState(!alreadyHidden);
  const [fade, setFade] = useState(false);
  const [webglOk, setWebglOk] = useState(true);

  useEffect(() => {
    try {
      if (localStorage.getItem("seenHyperspeedLoader") === "true") {
        setShow(false);
        return;
      }
    } catch {}

    setWebglOk(hasWebGL());

    const finish = () => {
      setFade(true);
      try { localStorage.setItem("seenHyperspeedLoader", "true"); } catch {}
      const t = setTimeout(() => setShow(false), 800);
      return () => clearTimeout(t);
    };

    const run = async () => {
      if (document.readyState !== "complete") {
        await new Promise<void>((r) => window.addEventListener("load", () => r(), { once: true }));
      }
      await waitForVideos(5000); // ✅ wait for hero/product videos (with 5s cap)
      finish();
    };

    run();
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
          // Minimal fallback (rare devices without WebGL)
          <div style={{display:"grid",placeItems:"center",height:"100%",color:"#fff"}}>
            <div style={{
              width:72,height:72,borderRadius:"50%",
              border:"3px solid transparent",borderTopColor:"#a90068",borderRightColor:"#a90068",
              filter:"drop-shadow(0 0 10px #a90068)",animation:"hsSpin .8s linear infinite"
            }}/>
            <style>{`@keyframes hsSpin {to{transform:rotate(360deg)}}`}</style>
          </div>
        )}
      </div>

      <div className="hs-overlay">
        <div className="hs-title">Loading your Niche…</div>
      </div>
    </div>
  );
}
