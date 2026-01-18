// app/page.tsx
// ✅ Polished, immersive, edge-to-edge fashion homepage
// ✅ REMOVED: extra gray overlay lines on banners / category images / product sections
// ✅ REMOVED: side pink/blue corner ticks (no overflowing L-shapes)
// ✅ UPDATED: each section container border = PINK in light, BLUE in dark (single clean border)
// ✅ Keeps: neutral premium backdrop, full-bleed bands, responsive rail, nav untouched

import { Suspense } from 'react';
import HeroCarousel from './components/HeroCarousel';
import MensCollection from './components/Mens-Collection';
import WomensCollection from './components/Women-Collection';
import NewArrivals from './components/New-Arrivals';
import TrendingProducts from './components/Trending-Products';

/* ---------------- Skeletons ---------------- */
function HeroSkeleton() {
  return (
    <div className="relative w-full h-[56vh] sm:h-[64vh] overflow-hidden rounded-[22px] sm:rounded-[34px] bg-white dark:bg-black border border-black/10 dark:border-white/10 animate-pulse">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.04)_25%,rgba(0,0,0,0.08)_37%,rgba(0,0,0,0.04)_63%)] dark:bg-[linear-gradient(90deg,rgba(255,255,255,0.06)_25%,rgba(255,255,255,0.10)_37%,rgba(255,255,255,0.06)_63%)]" />
      <div className="absolute inset-0 grid place-items-center">
        <div className="h-12 w-12 rounded-full border-[3px] border-[var(--accent-primary)] border-t-transparent animate-spin" />
      </div>
    </div>
  );
}

function ProductsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-7 w-64 mx-auto rounded-full bg-black/5 dark:bg-white/10 animate-pulse" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="rounded-[18px] border border-black/10 dark:border-white/10 bg-white dark:bg-black shadow-[0_22px_80px_rgba(0,0,0,0.08)] dark:shadow-[0_22px_80px_rgba(0,0,0,0.86)] p-4 animate-pulse"
          >
            <div className="aspect-[4/5] rounded-[14px] bg-black/5 dark:bg-white/10 mb-4" />
            <div className="h-4 rounded-full bg-black/5 dark:bg-white/10 mb-2" />
            <div className="h-4 rounded-full bg-black/5 dark:bg-white/10 w-3/4" />
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

      {/* soft top vignette (neutral) */}
      <div className="absolute inset-0 bg-[radial-gradient(1200px_800px_at_50%_12%,rgba(0,0,0,0.06),transparent_62%)] dark:bg-[radial-gradient(1200px_800px_at_50%_12%,rgba(255,255,255,0.06),transparent_62%)]" />

      {/* architectural grid (neutral, very subtle) */}
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

/* ---------------- Full-bleed bands (no extra lines) ---------------- */
function Band({
  children,
  density = 'normal',
}: {
  children: React.ReactNode;
  density?: 'tight' | 'normal' | 'loose';
}) {
  const pad =
    density === 'tight'
      ? 'py-8 sm:py-10'
      : density === 'loose'
        ? 'py-12 sm:py-14'
        : 'py-10 sm:py-12';

  return (
    <section className="relative w-full">
      {/* neutral band overlay (no hairlines) */}
      <div className="absolute inset-0 bg-black/[0.02] dark:bg-white/[0.03]" />
      <div className={`relative ${pad}`}>{children}</div>
    </section>
  );
}

/* ---------------- Ultra Header (embedded accents only, no side rails) ---------------- */
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
      {/* embedded chips (center only) */}
      <div className="mx-auto flex items-center justify-center gap-2">
        <span className="h-[2px] w-10 rounded-full bg-[var(--accent-primary)] opacity-85" />
        <span className="h-[2px] w-10 rounded-full bg-[var(--accent-secondary)] opacity-85" />
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

/* ---------------- Premium Shell (single border: pink light, blue dark) ----------------
   ✅ No internal gray lines
   ✅ No corner ticks
   ✅ Everything clipped, clean, premium
--------------------------------------------------------------------------- */
function Shell({
  children,
  tight = false,
  kind = 'default',
}: {
  children: React.ReactNode;
  tight?: boolean;
  kind?: 'hero' | 'default';
}) {
  const radius = kind === 'hero' ? 'rounded-[26px] sm:rounded-[46px]' : 'rounded-[24px] sm:rounded-[42px]';

  return (
    <div className="relative">
      <div
        className={[
          'relative isolate overflow-hidden',
          radius,
          // ✅ Single accent border: light=pink, dark=blue (driven by your --accent-primary mapping)
          'border',
          'border-[var(--accent-primary)]',
          // surfaces
          'bg-white dark:bg-black',
          // premium depth
          'shadow-[0_32px_160px_rgba(0,0,0,0.10)] dark:shadow-[0_32px_160px_rgba(0,0,0,0.88)]',
        ].join(' ')}
      >
        {/* neutral inner gloss only (no lines) */}
        <div className="pointer-events-none absolute -top-52 left-1/2 -translate-x-1/2 h-80 w-[92%] rounded-full bg-black/[0.03] dark:bg-white/[0.05] blur-3xl" />

        {/* subtle side depth (neutral) */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 top-1/2 -translate-y-1/2 h-[520px] w-[520px] rounded-full bg-black/[0.015] dark:bg-white/[0.025] blur-3xl" />
          <div className="absolute -right-40 top-1/2 -translate-y-1/2 h-[520px] w-[520px] rounded-full bg-black/[0.015] dark:bg-white/[0.025] blur-3xl" />
        </div>

        <div className={`relative ${tight ? 'p-2 sm:p-3' : 'px-3 sm:px-6 pb-7 sm:pb-9 pt-6 sm:pt-8'}`}>
          {children}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Editorial Intro ---------------- */
function EditorialIntro() {
  return (
   <div></div>
  );
}

/* ---------------- Page ---------------- */
export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white dark:bg-black">
      <PremiumBackdrop />

      {/* nav untouched — only layout below */}
      <main className="relative z-10 mt-24 sm:mt-32 lg:mt-36">
        {/* TOP EDITORIAL BAND */}
        <Band density="tight">
          <Rail>
            <EditorialIntro />
          </Rail>
        </Band>

        {/* HERO */}
        <Band density="tight">
          <Rail>
            <Shell tight kind="hero">
              <Suspense fallback={<HeroSkeleton />}>
                {/* ✅ No extra gray lines on banner image: remove extra borders/hairlines */}
                <div className="overflow-hidden rounded-[18px] sm:rounded-[32px] bg-white dark:bg-black">
                  <HeroCarousel />
                </div>
              </Suspense>
            </Shell>
          </Rail>
        </Band>

        {/* NEW ARRIVALS */}
        <Band density="normal">
          <Rail>
            <SectionHeader kicker="Curated" title="New Arrivals" note="Fresh drops. Premium finishes. Clean silhouettes." />
            <div className="mt-7 sm:mt-8">
              <Shell>
                <Suspense fallback={<ProductsSkeleton />}>
                  <NewArrivals />
                </Suspense>
              </Shell>
            </div>
          </Rail>
        </Band>

        {/* TRENDING */}
        <Band density="normal">
          <Rail>
            <SectionHeader
              kicker="Most Wanted"
              title="Trending"
              note="Best sellers and statement pieces — minimal design, maximum impact."
            />
            <div className="mt-7 sm:mt-8">
              <Shell>
                <Suspense fallback={<ProductsSkeleton />}>
                  <TrendingProducts />
                </Suspense>
              </Shell>
            </div>
          </Rail>
        </Band>

        {/* MENS */}
        <Band density="loose">
          <Rail>
            <SectionHeader kicker="Mens" title="Mens Collection" note="Modern essentials — effortless and elevated." />
            <div className="mt-7 sm:mt-8">
              <Shell>
                <Suspense fallback={<ProductsSkeleton />}>
                  <MensCollection />
                </Suspense>
              </Shell>
            </div>
          </Rail>
        </Band>

        {/* WOMENS */}
        <Band density="loose">
          <Rail>
            <SectionHeader kicker="Womens" title="Womens Collection" note="Refined streetwear — sharp details, clean fit." />
            <div className="mt-7 sm:mt-8">
              <Shell>
                <Suspense fallback={<ProductsSkeleton />}>
                  <WomensCollection />
                </Suspense>
              </Shell>
            </div>
          </Rail>
        </Band>

        <div className="h-10 sm:h-14" />
      </main>
    </div>
  );
}
