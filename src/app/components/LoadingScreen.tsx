"use client";
import { useEffect, useState } from "react";

/**
 * Full-screen loading splash shown during initial load.
 * Fades out once window "load" event fires (after bg videos decode).
 */
export default function LoadingScreen() {
  const [loaded, setLoaded] = useState(false);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const handleFinish = () => {
      setLoaded(true);
      setTimeout(() => setShow(false), 700); // Match CSS fade
    };

    if (document.readyState === "complete") handleFinish();
    else window.addEventListener("load", handleFinish, { once: true });

    return () => window.removeEventListener("load", handleFinish);
  }, []);

  if (!show) return null;

  return (
    <div className={`niche-loader ${loaded ? "niche-loader--hide" : ""}`}>
      <div className="niche-loader-content">
        <div className="niche-spinner"></div>
        <p className="niche-text">Loading your Niche…</p>
      </div>
    </div>
  );
}
