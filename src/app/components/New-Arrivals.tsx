'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState, useCallback, memo, useMemo } from 'react';
import type { Image as SanityImageSource } from 'sanity';
import imageUrlBuilder from '@sanity/image-url';
import { client } from '@/sanity/lib/client';
import { sanityLoader } from '@/lib/sanityImageLoader';
import { useTheme } from './theme-context';

/* =========================
   Types
   ========================= */

type SanityAssetMaybeUrl = (SanityImageSource & { url?: string }) | { _ref?: string; url?: string };
interface ProductImage {
  asset?: SanityAssetMaybeUrl;
  /** Explicit dereferenced URL (from GROQ). */
  url?: string;
  alt?: string;
}
interface IProduct {
  _id: string;
  name: string;
  price: number;
  images: ProductImage[];
  onSale: boolean;
  newArrival: boolean;
  outOfStock: boolean;
}

/* =========================
   Builder (fallback when url missing)
   ========================= */
const builder = imageUrlBuilder(client);
const buildUrl = (source: unknown, width = 800): string | undefined => {
  try {
    if (!source) return undefined;
    // direct string url
    if (typeof source === 'string' && source.startsWith('http')) return source;
    // asset/url on object directly
    const a = source as any;
    if (typeof a?.url === 'string') return a.url;
    // build from ref/object
    return builder.image(source as any).width(width).fit('max').auto('format').url();
  } catch {
    return undefined;
  }
};

/* ======= Banner with Image ======= */
const CategoryBanner = memo(function CategoryBanner({
  category = 'New Arrivals',
  title = 'New Arrivals',
  subtitle = 'Discover our latest premium collection featuring the newest additions to our store',
  className = '',
}: {
  readonly category?: string;
  readonly title?: string;
  readonly subtitle?: string;
  readonly className?: string;
}) {
  return (
    <div className={`category-banner-container ${className}`}>
      <div className="category-banner">
        <div className="image-wrapper">
          <Image
            src="/newarrivals.png"
            alt="New Arrivals Banner"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            priority
          />
        </div>
      </div>

      <style jsx>{`
        .category-banner-container { 
          width:100%; 
          position:relative; 
          overflow:hidden; 
          border-radius:16px; 
          margin:0 auto 1.5rem; 
        }
        .category-banner { 
          position:relative; 
          height:200px; 
          background:transparent; 
          overflow:hidden; 
         border: 1px solid hsl(var(--border));
          border-radius:16px;
        }
        
        .image-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          transform: scale(1);
          transition: transform 0.3s ease;
        }
        
        /* Tablet */
        @media (max-width:768px) { 
          .category-banner { height:140px; }
          .image-wrapper { transform: scale(1.5); }
        }
        
        /* Mobile */
        @media (max-width:480px) { 
          .category-banner { height:120px; }
          .image-wrapper { transform: scale(2); }
        }
      `}</style>
    </div>
  );
});
CategoryBanner.displayName = 'CategoryBanner';

/* ======= Card ======= */
const ProductCard = memo(function ProductCard({ product, index }: { product: IProduct; index: number }) {
  const [loaded, setLoaded] = useState(false);
  useTheme(); // keep your original behavior

  const first = useMemo(() => product.images?.[0], [product.images]);

  // Robust URL resolver:
  // 1) explicit 'url' from GROQ
  // 2) asset.url if present
  // 3) build from asset/ref
  const imageUrl = useMemo<string | undefined>(() => {
    return (
      (typeof first?.url === 'string' && first.url) ||
      (typeof (first?.asset as any)?.url === 'string' && (first!.asset as any).url) ||
      buildUrl(first?.asset)
    );
  }, [first]);

  return (
    <Link
      href={`/product/${product._id}`}
      className="group transform transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg dark:hover:shadow-pink-500/20"
      style={{ animationDelay: `${index * 50}ms`, animation: 'fadeInUp 0.4s ease-out forwards' }}
    >
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-transparent rounded-sm isolate">
        {!loaded && (
          <div
            className="absolute inset-0 animate-pulse"
            style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.12) 37%, rgba(255,255,255,0.06) 63%)' }}
          />
        )}

        {imageUrl ? (
          <Image
            loader={sanityLoader}
            src={imageUrl}                       // must be a string
            alt={first?.alt || product.name}
            fill
            className={`object-contain transition-opacity duration-200 group-hover:opacity-90 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            style={{ backgroundColor: 'transparent' }}
            sizes="(max-width:640px) 50vw, (max-width:768px) 33vw, (max-width:1024px) 25vw, 20vw"
            quality={80}
            onLoadingComplete={() => setLoaded(true)} // more reliable
            priority={index < 4}
            // TEMP: ensure nothing hits /_next/image while debugging
            unoptimized={true}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm font-light bg-transparent">
          No Image
        </div>
        )}

{(product.newArrival || product.onSale || product.outOfStock) && (
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.newArrival && <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-0.5 text-xs font-bold shadow-sm rounded-sm">NEW</span>}
            {product.onSale && <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-0.5 text-xs font-bold shadow-sm rounded-sm">SALE</span>}
            {product.outOfStock && <span className="bg-gradient-to-r from-gray-600 to-gray-800 text-white px-2 py-0.5 text-xs font-bold shadow-sm rounded-sm">OUT OF STOCK</span>}
          </div>
        )}
      </div>

      <div className="mt-2">
        <div className="border border-blue-500 dark:border-[#a90068] bg-transparent p-2 text-center transition-colors duration-200 group-hover:border-opacity-80">
        <h4 className="text-sm md:text-base text-foreground truncate font-light mb-1">
  {product.name}
</h4>
<p className="text-sm md:text-base text-foreground font-light">
  ${product.price.toFixed(2)}
</p>

        </div>
      </div>
    </Link>
  );
});
ProductCard.displayName = 'ProductCard';

/* ======= Skeleton ======= */
const ProductSkeleton = memo(function ProductSkeleton({ index }: { index: number }) {
  return (
    <div className="group animate-pulse" style={{ animationDelay: `${index * 50}ms`, animation: 'fadeInUp 0.4s ease-out forwards' }}>
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-transparent rounded-sm">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.12) 37%, rgba(255,255,255,0.06) 63%)' }} />
      </div>
      <div className="mt-2">
        <div className="border border-gray-300/50 dark:border-gray-600/50 bg-transparent p-2 text-center">
          <div className="h-4 bg-white/10 dark:bg-white/10 rounded mb-1" />
          <div className="h-4 bg-white/10 dark:bg-white/10 rounded w-16 mx-auto" />
        </div>
      </div>
    </div>
  );
});
ProductSkeleton.displayName = 'ProductSkeleton';

/* =========================
   Page
   ========================= */
const NewArrivals = memo(function NewArrivals() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Return BOTH the direct url and full asset so we can always resolve
      const query = `*[_type == "product" &&
  references(*[_type == "category" && title == "new-arrivals"]._id) &&
  defined(images[0].asset)
] | order(_createdAt desc)[0...8]{
  _id,
  name,
  price,
  onSale,
  newArrival,
  outOfStock,
  images[]{
    "url": asset->url,
    asset,
    alt
  }
}`;

      const data = await client.fetch<IProduct[]>(query);
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const grid = useMemo(
    () => products.slice(0, 4).map((p, i) => <ProductCard key={p._id} product={p} index={i} />),
    [products]
  );

  const skeletons = useMemo(() => Array.from({ length: 4 }, (_, i) => <ProductSkeleton key={i} index={i} />), []);

  return (
    <>
      <style jsx>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <section className="text-center mb-12 font-montserrat">
        <div className="px-2 sm:px-6 mb-4">
          <CategoryBanner />
        </div>

        <div className="px-2 sm:px-6">
          <div className="isolate border border-blue-500 dark:border-[#a90068] bg-transparent rounded-lg p-4 sm:p-6 will-change-transform">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {isLoading ? (
                skeletons
              ) : error ? (
                <div className="col-span-full text-center py-6">
                  <p className="text-red-500 dark:text-red-400 mb-3 text-sm sm:text-base font-light">{error}</p>
                  <button onClick={fetchProducts} className="px-4 py-2 border border-blue-500 dark:border-[#a90068] text-blue-500 dark:text-[#a90068] hover:bg-blue-500/10 dark:hover:bg-[#a90068]/10 transition-colors font-light rounded text-sm">
                    Try Again
                  </button>
                </div>
              ) : products.length === 0 ? (
                <div className="col-span-full text-center py-6">
                <p className="text-muted-foreground text-sm sm:text-base font-light">
  No products found
</p>

                </div>
              ) : (
                grid
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
});
NewArrivals.displayName = 'NewArrivals';

export default NewArrivals;