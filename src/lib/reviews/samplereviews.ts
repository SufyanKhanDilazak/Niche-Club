// lib/reviews/samplereviews.ts
// NOTE: These are DEMO/SAMPLE reviews for UI placeholders.
// Do NOT present as real customer reviews.

export type Review = {
    id: string;
    name: string;
    avatarSeed: string;
    rating: 1 | 2 | 3 | 4 | 5;
    title: string;
    body: string;
    fit: 'Runs Small' | 'True to Size' | 'Runs Large';
    sizeBought?: string;
    colorBought?: string;
    verified: boolean;
    createdAt: string;
    // ✅ add this so you can label them in UI
    isSample: true;
    // optional tag so you can group in UI
    tag?: 'late_delivery';
  };
  
  function hashString(str: string): number {
    // FNV-1a 32-bit
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }
  
  function mulberry32(seed: number) {
    return function () {
      let t = (seed += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  
  function pick<T>(rng: () => number, arr: readonly T[]): T {
    return arr[Math.floor(rng() * arr.length)];
  }
  
  function pickInt(rng: () => number, min: number, max: number) {
    return min + Math.floor(rng() * (max - min + 1));
  }
  
  const FIRST = [
    'Aiden','Noah','Liam','Mason','Ethan','Logan','Lucas','Leo','Owen','Jay',
    'Mila','Ava','Layla','Zoe','Nora','Ivy','Maya','Luna','Amelia','Sofia',
    'Eli','Kai','Zayn','Aria','Hana','Sami','Rayan','Adam','Sarah','Fatima',
  ] as const;
  
  const LAST = [
    'Carter','Reed','Hayes','Brooks','Morgan','Parker','Mitchell','Turner','Campbell',
    'Bennett','Coleman','Foster','Gray','Howard','Woods','Khan','Ahmed','Malik','Shah',
    'Ali','Hussain','Iqbal','Butt','Sheikh','Syed'
  ] as const;
  
  const TITLES_5 = [
    'Exactly what I wanted',
    'Clean fit & premium feel',
    'Staple piece',
    'Better than expected',
    'Fast shipping, great packaging',
    'Love the silhouette',
    'Great fabric',
    'Looks expensive in person',
    'Perfect everyday piece',
    'Instant favorite',
  ] as const;
  
  const TITLES_4 = [
    'Really solid',
    'Great fit',
    'Premium for the price',
    'Happy with it',
    'Nice details',
    'Good pickup',
    'Will order again',
  ] as const;
  
  // 3★ should ONLY be about shipping delay (NOT quality)
  const TITLES_LATE = [
    'Arrived late, but worth it',
    'Shipping delay, product is great',
    'Late delivery (everything else perfect)',
    'Took longer than expected',
  ] as const;
  
  const OPENERS_POS = [
    'Been looking for something like this for a while.',
    'The material feels premium straight out of the bag.',
    'The fit is clean and sits perfectly.',
    'This is now my go-to piece.',
    'Wore it once and got compliments immediately.',
    'The stitching and details are on point.',
    'Packaging was nice and the product looks even better in person.',
    'Honestly impressed with the overall finish.',
  ] as const;
  
  const DETAILS_POS = [
    'No loose threads, feels well made.',
    'The color is accurate and looks expensive.',
    'Breathable but still feels structured.',
    'Pairs well with cargos/denim easily.',
    'The cut is modern without being too loud.',
    'Feels like a higher-end brand piece.',
    'Fabric has a nice weight to it.',
    'Branding is clean and not cheap-looking.',
    'The drape is really nice—sits clean on body.',
  ] as const;
  
  const CLOSERS_POS = [
    'Would buy again.',
    'Definitely recommending to friends.',
    'Ordering another color next.',
    'Fits my style perfectly.',
    'This one is a keeper.',
    'Easy 5 stars from me.',
    'Solid quality for the price.',
  ] as const;
  
  const LATE_OPENERS = [
    'Delivery took longer than expected,',
    'Shipping was delayed,',
    'Carrier had a delay,',
    'It arrived late,',
  ] as const;
  
  const LATE_BODY = [
    'but the piece itself is clean and exactly as pictured.',
    'but the fit and material are still on point.',
    'but packaging was solid and it looks premium in hand.',
    'but once it arrived, it was worth the wait.',
  ] as const;
  
  const LATE_CLOSERS = [
    'Hope shipping is faster next time.',
    'Would still order again.',
    'Product is great—just watch delivery timing.',
    'Everything was perfect besides the delay.',
  ] as const;
  
  const FITS: Review['fit'][] = ['Runs Small', 'True to Size', 'Runs Large'];
  
  /* ---------------- GLOBAL POOL ----------------
     Total 650+ demo reviews, only 40 are 3★ late delivery.
  ------------------------------------------------ */
  const GLOBAL_POOL_SIZE = 650;
  const LATE_DELIVERY_COUNT = 40;
  const GLOBAL_SEED = 'NICHECLUB_DEMO_REVIEWS_POOL_V2';
  
  function buildGlobalPool(): Review[] {
    const rng = mulberry32(hashString(GLOBAL_SEED));
    const now = Date.now();
  
    const pool: Review[] = [];
  
    // 1) Late-delivery 3★ (exactly 40)
    for (let i = 0; i < LATE_DELIVERY_COUNT; i++) {
      const first = pick(rng, FIRST);
      const last = pick(rng, LAST);
      const name = `${first} ${last}`;
  
      const title = pick(rng, TITLES_LATE);
      const body = [
        pick(rng, LATE_OPENERS),
        pick(rng, LATE_BODY),
        pick(rng, LATE_CLOSERS),
      ].join(' ');
  
      const fit = pick(rng, FITS);
  
      // Spread dates across last 420 days
      const daysAgo = Math.floor(rng() * 420);
      const createdAt = new Date(now - daysAgo * 86400000).toISOString();
  
      pool.push({
        id: `pool-late-${i}`,
        name,
        avatarSeed: `${first}-${last}-late-${i}`,
        rating: 3,
        title,
        body,
        fit,
        verified: rng() < 0.45,
        createdAt,
        isSample: true,
        tag: 'late_delivery',
      });
    }
  
    // 2) Positive reviews (remaining)
    const positiveCount = GLOBAL_POOL_SIZE - LATE_DELIVERY_COUNT;
  
    for (let i = 0; i < positiveCount; i++) {
      const first = pick(rng, FIRST);
      const last = pick(rng, LAST);
      const name = `${first} ${last}`;
  
      // 5★ / 4★ distribution
      const roll = rng();
      const rating: 4 | 5 = roll < 0.72 ? 5 : 4;
  
      const title = rating === 5 ? pick(rng, TITLES_5) : pick(rng, TITLES_4);
  
      const body = [
        pick(rng, OPENERS_POS),
        pick(rng, DETAILS_POS),
        pick(rng, DETAILS_POS),
        pick(rng, CLOSERS_POS),
      ].join(' ');
  
      const fit = pick(rng, FITS);
  
      const daysAgo = Math.floor(rng() * 420);
      const createdAt = new Date(now - daysAgo * 86400000).toISOString();
  
      pool.push({
        id: `pool-pos-${i}`,
        name,
        avatarSeed: `${first}-${last}-pos-${i}`,
        rating,
        title,
        body,
        fit,
        verified: rng() < 0.60,
        createdAt,
        isSample: true,
      });
    }
  
    // Newest first
    pool.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  
    // Deterministic shuffle to avoid all late-delivery clustering at top:
    const shuf = mulberry32(hashString(GLOBAL_SEED + '_shuffle'));
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(shuf() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
  
    return pool;
  }
  
  const GLOBAL_POOL: Review[] = buildGlobalPool();
  
  /* ---------------- PER PRODUCT ----------------
     Each product gets a different count (11..30),
     plus optionally 0..2 late-delivery reviews,
     all deterministic by productKey.
  ------------------------------------------------ */
  export function generateSampleReviewsForProduct(params: {
    productKey: string;  // slug or _id
    sizes?: string[];
    colors?: string[];
  }): Review[] {
    const { productKey, sizes = [], colors = [] } = params;
  
    const seed = hashString(productKey);
    const rng = mulberry32(seed);
  
    // ✅ variable review counts per product
    // (some 11, 15, 30, etc.)
    const total = pickInt(rng, 11, 30);
  
    // ✅ sprinkle a small number of late delivery reviews (3★)
    // keep it rare and realistic:
    //  - most products: 0
    //  - some: 1
    //  - very few: 2
    const lateRoll = rng();
    const lateCount =
      total < 12 ? 0 :
      lateRoll < 0.70 ? 0 :
      lateRoll < 0.93 ? 1 : 2;
  
    // Split pools
    const latePool = GLOBAL_POOL.filter((r) => r.tag === 'late_delivery');
    const posPool = GLOBAL_POOL.filter((r) => r.tag !== 'late_delivery');
  
    // deterministic walk selection (no repeats inside one product)
    const used = new Set<string>();
    const out: Review[] = [];
  
    const pickFromPool = (pool: Review[], need: number) => {
      if (need <= 0) return;
  
      const start = (seed + hashString(pool === latePool ? 'late' : 'pos')) % pool.length;
      const step = 7 + (seed % 17); // 7..23
  
      let idx = start;
      while (out.length < total && need > 0) {
        const base = pool[idx % pool.length];
        idx += step;
  
        if (used.has(base.id)) continue;
        used.add(base.id);
  
        const sizeBought = sizes.length ? sizes[Math.floor(rng() * sizes.length)] : undefined;
        const colorBought = colors.length ? colors[Math.floor(rng() * colors.length)] : undefined;
  
        out.push({
          ...base,
          id: `${productKey}-${base.id}`,
          avatarSeed: `${base.avatarSeed}-${productKey}`,
          sizeBought,
          colorBought,
        });
  
        need--;
      }
    };
  
    // pick late first (so it’s guaranteed if requested)
    pickFromPool(latePool, lateCount);
    pickFromPool(posPool, total - out.length);
  
    // Make newest first for this product
    out.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    return out;
  }
  