"use client";
import React, { useEffect, useRef, useState, memo } from "react";
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

async function waitForVideos(timeout = 3000) {
  const vids = Array.from(document.querySelectorAll("video"));
  if (!vids.length) return;
  const timeoutP = new Promise<void>((r) => setTimeout(r, timeout));
  const checks = vids.map(
    (v) =>
      new Promise<void>((r) => {
        if (v.readyState >= 3) return r();
        const done = () => { v.removeEventListener("canplaythrough", done); v.removeEventListener("loadeddata", done); r(); };
        v.addEventListener("canplaythrough", done, { once: true });
        v.addEventListener("loadeddata", done, { once: true });
      })
  );
  await Promise.race([Promise.all(checks), timeoutP]);
}

const Bg = memo(({ webglOk }: { webglOk: boolean }) => (
  <div className="hs-stage">{webglOk ? <Hyperspeed /> : <div className="hs-fallback" />}</div>
));

export default function HyperspeedLoaderOnce() {
  const [show, setShow] = useState(true);
  const [ready, setReady] = useState(false);
  const [fade, setFade] = useState(false);
  const [webglOk, setWebglOk] = useState(true);
  const ran = useRef(false);
  const readyLatch = useRef(false);

  useEffect(() => {
    const boot = document.getElementById("hs-boot");
    if (boot) boot.remove();
    if (ran.current) return;
    ran.current = true;

    if (localStorage.getItem("seenHyperspeedLoader") === "true") { setShow(false); return; }
    setWebglOk(hasWebGL());

    (async () => {
      if (document.readyState !== "complete")
        await new Promise<void>((res) => window.addEventListener("load", () => res(), { once: true }));
      await waitForVideos();
      setReady(true);
      readyLatch.current = true;
    })();
  }, []);

  if (!show) return null;
  const showReady = readyLatch.current || ready;

  const handleTap = () => {
    if (!showReady) return;
    try { sessionStorage.setItem("videoInteraction", "true"); } catch {}
    localStorage.setItem("seenHyperspeedLoader", "true");
    setFade(true);
    setTimeout(() => setShow(false), 450);
  };

  return (
    <div className={`hs-loader ${fade ? "hs-loader--hide" : ""}`} onClick={showReady ? handleTap : undefined}>
      <Bg webglOk={webglOk} />
      <div className="hs-overlay">
        <div className="hs-title">
          <span style={{ opacity: showReady ? 0 : 1, transition: "opacity .26s ease" }}>
            Loading Your Niche...
          </span>
          <span style={{ opacity: showReady ? 1 : 0, transition: "opacity .26s ease" }}>
            Tap to Enter <br /> Begin the Experience
          </span>
        </div>
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
          transition: opacity 0.45s ease;
        }
        .hs-loader--hide { opacity: 0; pointer-events: none; }
        .hs-stage {
          position: absolute; inset: 0; display: grid; place-items: center;
          overflow: hidden; contain: layout paint size; transform: translateZ(0);
        }
        .hs-stage > * { position: absolute; top:50%; left:50%; transform:translate(-50%,-50%);
          width:100vw; height:100vh; object-fit:cover; object-position:center; }
        .hs-overlay { position:absolute; inset:0; display:grid; place-items:center; text-align:center; pointer-events:none; }
        .hs-title { color:#fff; font-weight:600; letter-spacing:.02em; font-size:clamp(1rem,2.6vw,1.6rem); text-shadow:0 0 8px #fff8; display:inline-grid; }
        .hs-fallback { width:60px; height:60px; border:4px solid transparent; border-top-color:#fff; border-right-color:#fff; border-radius:50%; animation:spin .8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
