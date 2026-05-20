"use client";

import dynamic from "next/dynamic";
import config from "../../../../sanity.config";

// Client-only Studio component
const NextStudio = dynamic(
  () => import("next-sanity/studio").then((m) => m.NextStudio),
  { ssr: false }
);

export default function StudioClient() {
  return (
    <div style={{ marginTop: "40px" }}>
      <NextStudio config={config} />
    </div>
  );
}
