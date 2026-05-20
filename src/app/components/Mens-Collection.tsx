"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useState, memo } from "react";
import type { Image as SanityImageSource } from "sanity";
import imageUrlBuilder from "@sanity/image-url";
import { client } from "@/sanity/lib/client";
import { sanityLoader } from "@/lib/sanityImageLoader";
import { useTheme } from "./theme-context";

/* =========================
   Types
   ========================= */
type SanityAssetMaybeUrl =
  | (SanityImageSource & { url?: string })
  | { _ref?: string; url?: string };

interface ProductImage {
  asset?: SanityAssetMaybeUrl;
  url?: string; // dereferenced from GROQ
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
   Builder fallback (when url missing)
   ========================= */
const builder = imageUrlBuilder(client);

const buildUrl = (source: unknown, width = 1200): string | undefined => {
  try {
    if (!source) return undefined;

    // direct string url
    if (typeof source === "string" && source.startsWith("http")) return source;

    const a = source as any;
    if (typeof a?.url === "string") return a.url;

    return builder.image(source as any).width(width).fit("max").auto("format").url();
  } catch {
    return undefined;
  }
};

/* =========================
   Banner (EXACT like original first code behavior)
   Desktop: 200px
   Tablet: 140px + scale(1.5)
   Mobile: 120px + scale(2)
   ========================= */
const CategoryBanner = memo(function CategoryBanner({
  className = "",
}: {
  readonly className?: string;
}) {
  return (
    <div className={`category-banner-container ${className}`}>
      <div className="category-banner">
        <div className="image-wrapper">
          <Image
            src="/mencollection.png"
            alt="Men's Category Banner"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </div>
      </div>

      <style jsx>{`
        .category-banner-container {
          width: 100%;
          position: relative;
          overflow: hidden;
          margin: 0 auto 1.5rem;
        }

        .category-banner {
          position: relative;
          height: 200px; /* desktop */
          background: transparent;
          overflow: hidden;
          border: 1px solid rgba(0, 0, 0, 0.12);
        }

        .image-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          transform: scale(1);
          transition: transform 0.3s ease;
        }

        /* Tablet */
        @media (max-width: 768px) {
          .category-banner {
            height: 140px;
          }
          .image-wrapper {
            transform: scale(1.5);
          }
        }

        /* Mobile */
        @media (max-width: 480px) {
          .category-banner {
            height: 120px;
          }
          .image-wrapper {
            transform: scale(2);
          }
        }

        :global(.dark) .category-banner {
          border: 1px solid rgba(255, 255, 255, 0.12);
        }
      `}</style>
    </div>
  );
});
CategoryBanner.displayName = "CategoryBanner";

/* =========================
   Card (Zara-like) — ONLY text alignment changed
   ========================= */
const ProductCard = memo(function ProductCard({
  product,
  index,
}: {
  product: IProduct;
  index: number;
}) {
  const [loaded, setLoaded] = useState(false);
  useTheme(); // keep your original behavior

  const first = useMemo(() => product.images?.[0], [product.images]);

  const imageUrl = useMemo<string | undefined>(() => {
    return (
      (typeof first?.url === "string" && first.url) ||
      (typeof (first?.asset as any)?.url === "string" && (first!.asset as any).url) ||
      buildUrl(first?.asset)
    );
  }, [first]);

  return (
    <Link
      href={`/product/${product._id}`}
      className="group block"
      aria-label={product.name}
    >
      {/* Image area (big, clean, square) */}
      <div className="relative w-full aspect-[3/4] border border-black/10 dark:border-white/10 overflow-hidden bg-white dark:bg-black">
        {!loaded && (
          <div className="absolute inset-0 animate-pulse bg-black/[0.03] dark:bg-white/[0.05]" />
        )}

        {imageUrl ? (
          <Image
            loader={sanityLoader}
            src={imageUrl}
            alt={first?.alt || product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover transition-opacity duration-200 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
            onLoadingComplete={() => setLoaded(true)}
            priority={index < 2}
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-black/50 dark:text-white/50">
            No Image
          </div>
        )}

        {(product.newArrival || product.onSale || product.outOfStock) && (
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.newArrival && (
              <span className="bg-black text-white px-2 py-1 text-[10px] tracking-wide">
                NEW
              </span>
            )}
            {product.onSale && (
              <span className="bg-[#a90068] text-white px-2 py-1 text-[10px] tracking-wide">
                SALE
              </span>
            )}
            {product.outOfStock && (
              <span className="bg-gray-700 text-white px-2 py-1 text-[10px] tracking-wide">
                OUT OF STOCK
              </span>
            )}
          </div>
        )}
      </div>

      {/* ✅ ONLY CHANGE: force centered name + price on all devices */}
      <div className="pt-2 text-center">
        <p className="mx-auto text-[13px] md:text-sm font-light text-foreground leading-snug line-clamp-1 text-center">
          {product.name}
        </p>
        <p className="mx-auto text-[13px] md:text-sm font-light text-foreground/90 text-center">
          ${product.price.toFixed(2)}
        </p>
      </div>
    </Link>
  );
});
ProductCard.displayName = "ProductCard";

/* =========================
   Skeleton (simple + light)
   ========================= */
const ProductSkeleton = memo(function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="w-full aspect-[3/4] border border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.05]" />
      <div className="pt-2 space-y-2">
        <div className="h-3 w-3/4 bg-black/[0.06] dark:bg-white/[0.07]" />
        <div className="h-3 w-1/4 bg-black/[0.06] dark:bg-white/[0.07]" />
      </div>
    </div>
  );
});
ProductSkeleton.displayName = "ProductSkeleton";

/* =========================
   Page
   ========================= */
const MensCollection = memo(function MensCollection() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // ✅ GROQ query kept STRICTLY same
      const query = `*[_type == "product" &&
  references(*[_type == "category" && title == "men-showcase"]._id) &&
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
      console.error("Error fetching products:", err);
      setError("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const grid = useMemo(() => {
    const shown = products.slice(0, 4);
    return shown.map((p, i) => <ProductCard key={p._id} product={p} index={i} />);
  }, [products]);

  const skeletons = useMemo(
    () => Array.from({ length: 4 }, (_, i) => <ProductSkeleton key={i} />),
    []
  );

  return (
    <section className="font-montserrat mb-12">
      {/* Banner (original behavior restored) */}
      <div className="px-2 sm:px-6 mb-4">
        <CategoryBanner />
      </div>

      {/* ✅ Edge-to-edge OUTER pink border (sticks to screen edges) */}
      <div className="w-screen mx-[calc(50%-50vw)] border border-[#a90068]">
        {/* inner padding only (border still edge-to-edge) */}
        <div className="px-2 sm:px-6 py-5">
          {/* Zara-like grid: bigger images, clean gaps */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {isLoading ? (
              skeletons
            ) : error ? (
              <div className="col-span-full text-center py-6">
                <p className="text-red-500 dark:text-red-400 mb-3 text-sm font-light">
                  {error}
                </p>
                <button
                  onClick={fetchProducts}
                  className="px-4 py-2 border border-[#a90068] text-[#a90068] hover:bg-[#a90068]/10 transition-colors font-light text-sm"
                >
                  Try Again
                </button>
              </div>
            ) : products.length === 0 ? (
              <div className="col-span-full text-center py-6">
                <p className="text-muted-foreground text-sm font-light">
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
  );
});
MensCollection.displayName = "MensCollection";

export default MensCollection;
