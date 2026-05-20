// app/page.tsx
// ✅ Polished, immersive, edge-to-edge fashion homepage
// ✅ Edge-to-edge accent borders without double bottom lines
// ✅ Square edges, no blur filters, no overflow clipping (smooth on iPhone/low-end)
// ✅ Keeps: premium backdrop, full-bleed bands, responsive rail, nav untouched
// ✅ UPDATED: reduced top gap + tightened section spacing (no design change)

import { Suspense } from "react";
import HeroCarousel from "./components/HeroCarousel";
import MensCollection from "./components/Mens-Collection";
import WomensCollection from "./components/Women-Collection";
import NewArrivals from "./components/New-Arrivals";
import TrendingProducts from "./components/Trending-Products";

/* ---------------- Skeletons ---------------- */
function HeroSkeleton() {
  return (
    <div className="relative w-full h-[56vh] sm:h-[64vh] bg-white dark:bg-black border border-black/10 dark:border-white/10 animate-pulse">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.04)_25%,rgba(0,0,0,0.08)_37%,rgba(0,0,0,0.04)_63%)] dark:bg-[linear-gradient(90deg,rgba(255,255,255,0.06)_25%,rgba(255,255,255,0.10)_37%,rgba(255,255,255,0.06)_63%)]" />
      <div className="absolute inset-0 grid place-items-center">
        <div className="h-12 w-12 border-[3px] border-[var(--accent-primary)] border-t-transparent animate-spin" />
      </div>
    </div>
  );
}

function ProductsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-7 w-64 mx-auto bg-black/5 dark:bg-white/10 animate-pulse" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="border border-black/10 dark:border-white/10 bg-white dark:bg-black p-4 animate-pulse"
          >
            <div className="aspect-[4/5] bg-black/5 dark:bg-white/10 mb-4" />
            <div className="h-4 bg-black/5 dark:bg-white/10 mb-2" />
            <div className="h-4 bg-black/5 dark:bg-white/10 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Backdrop (neutral + architectural) ---------------- */
function PremiumBackdrop() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <div className="absolute inset-0 bg-white dark:bg-black" />

      {/* soft top vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(1200px_800px_at_50%_12%,rgba(0,0,0,0.06),transparent_62%)] dark:bg-[radial-gradient(1200px_800px_at_50%_12%,rgba(255,255,255,0.06),transparent_62%)]" />

      {/* subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.06] dark:opacity-[0.08]
        [background-image:linear-gradient(to_right,rgba(0,0,0,0.22)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.22)_1px,transparent_1px)]
        dark:[background-image:linear-gradient(to_right,rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.18)_1px,transparent_1px)]
        [background-size:180px_180px]"
      />

      {/* micro grain */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]
        [background-image:radial-gradient(rgba(0,0,0,0.55)_1px,transparent_1px)]
        [background-size:28px_28px]"
      />
    </div>
  );
}

/* ---------------- Rail (premium width) ---------------- */
function Rail({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[1680px] 2xl:max-w-[1760px] px-4 sm:px-6 lg:px-10 2xl:px-12">
      {children}
    </div>
  );
}

/* ---------------- Full-bleed bands (tightened spacing) ---------------- */
function Band({
  children,
  density = "normal",
}: {
  children: React.ReactNode;
  density?: "tight" | "normal" | "loose";
}) {
  const pad =
    density === "tight"
      ? "py-4 sm:py-6"
      : density === "loose"
      ? "py-8 sm:py-10"
      : "py-6 sm:py-8";

  return (
    <section className="relative w-full">
      <div className="absolute inset-0 bg-black/[0.02] dark:bg-white/[0.03]" />
      <div className={`relative ${pad}`}>{children}</div>
    </section>
  );
}

/* ---------------- Section Header ---------------- */
function SectionHeader({
  title,
  note,
  kicker,
}: {
  title: string;
  note?: string;
  kicker?: string;
}) {
  return (
    <div className="relative text-center px-2 sm:px-0">
      <div className="mx-auto flex items-center justify-center gap-2">
        <span className="h-[2px] w-10 bg-[var(--accent-primary)] opacity-85" />
        <span className="h-[2px] w-10 bg-[var(--accent-secondary)] opacity-85" />
      </div>

      {kicker && (
        <p className="mt-4 text-[11px] sm:text-[12px] tracking-[0.36em] uppercase text-black/55 dark:text-white/55">
          {kicker}
        </p>
      )}

      <h2 className="mt-3 text-[13px] sm:text-[14px] tracking-[0.34em] uppercase text-black dark:text-white">
        {title}
      </h2>

      {note && (
        <p className="mt-2 text-sm sm:text-[15px] text-black/60 dark:text-white/60 leading-relaxed max-w-3xl mx-auto">
          {note}
        </p>
      )}
    </div>
  );
}

/* ---------------- Full-bleed Shell ----------------
   ✅ edge-to-edge
   ✅ NO bottom border (removes extra pink line under products)
   ✅ square
--------------------------------------------------------------------------- */
function FullBleedShell({
  children,
  tight = false,
}: {
  children: React.ReactNode;
  tight?: boolean;
}) {
  return (
    <div className="w-screen mx-[calc(50%-50vw)] border-l border-r border-t border-[var(--accent-primary)] bg-white dark:bg-black">
      <Rail>
        <div className={tight ? "py-3" : "py-6 sm:py-8"}>{children}</div>
      </Rail>
    </div>
  );
}

/* ---------------- Hero Shell (same rule: no bottom border) ---------------- */
function FullBleedHero({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-screen mx-[calc(50%-50vw)] border-l border-r border-t border-[var(--accent-primary)] bg-white dark:bg-black">
      <Rail>
        <div className="py-2 sm:py-3">{children}</div>
      </Rail>
    </div>
  );
}

/* ---------------- Page ---------------- */
export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white dark:bg-black">
      <PremiumBackdrop />

      {/* nav untouched — only layout below */}
      <main className="relative z-10 mt-14 sm:mt-16 lg:mt-20">
        {/* HERO */}
        <Band density="tight">
          <FullBleedHero>
            <Suspense fallback={<HeroSkeleton />}>
              <div className="bg-white dark:bg-black">
                <HeroCarousel />
              </div>
            </Suspense>
          </FullBleedHero>
        </Band>

        {/* NEW ARRIVALS */}
        <Band density="normal">
          <Rail>
            <SectionHeader
              kicker="Curated"
              title="New Arrivals"
              note="Fresh drops. Premium finishes. Clean silhouettes."
            />
          </Rail>
          <div className="mt-4 sm:mt-5">
            <FullBleedShell>
              <Suspense fallback={<ProductsSkeleton />}>
                <NewArrivals />
              </Suspense>
            </FullBleedShell>
          </div>
        </Band>

        {/* TRENDING */}
        <Band density="normal">
          <Rail>
            <SectionHeader
              kicker="Most Wanted"
              title="Trending"
              note="Best sellers and statement pieces — minimal design, maximum impact."
            />
          </Rail>
          <div className="mt-4 sm:mt-5">
            <FullBleedShell>
              <Suspense fallback={<ProductsSkeleton />}>
                <TrendingProducts />
              </Suspense>
            </FullBleedShell>
          </div>
        </Band>

        {/* MENS */}
        <Band density="loose">
          <Rail>
            <SectionHeader
              kicker="Mens"
              title="Mens Collection"
              note="Modern essentials — effortless and elevated."
            />
          </Rail>
          <div className="mt-4 sm:mt-5">
            <FullBleedShell>
              <Suspense fallback={<ProductsSkeleton />}>
                <MensCollection />
              </Suspense>
            </FullBleedShell>
          </div>
        </Band>

        {/* WOMENS */}
        <Band density="loose">
          <Rail>
            <SectionHeader
              kicker="Womens"
              title="Womens Collection"
              note="Refined streetwear — sharp details, clean fit."
            />
          </Rail>
          <div className="mt-4 sm:mt-5">
            <FullBleedShell>
              <Suspense fallback={<ProductsSkeleton />}>
                <WomensCollection />
              </Suspense>
            </FullBleedShell>
          </div>
        </Band>

        <div className="h-8 sm:h-10" />
      </main>
    </div>
  );
}
