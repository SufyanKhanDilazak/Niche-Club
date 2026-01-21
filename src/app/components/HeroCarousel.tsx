"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState, memo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { client } from "@/sanity/lib/client";
import imageUrlBuilder from "@sanity/image-url";
import { useTheme } from "./theme-context";

/* Types */
interface ProductImage {
  asset?: any;
  alt?: string;
}

interface CarouselProduct {
  _id: string;
  name: string;
  price: number;
  slug: { current: string };
  images: ProductImage[];
  onSale: boolean;
  newArrival: boolean;
  outOfStock: boolean;
}

/* Image Builder */
const builder = imageUrlBuilder(client);

const SLIDE_INTERVAL = 5000;

/* Navigation Button */
const NavigationButton = memo(
  ({
    direction,
    onClick,
  }: {
    direction: "left" | "right";
    onClick: () => void;
  }) => {
    const isLeft = direction === "left";
    const Icon = isLeft ? ChevronLeft : ChevronRight;

    return (
      <Button
        variant="ghost"
        size="icon"
        aria-label={`${isLeft ? "Previous" : "Next"} slide`}
        className={`absolute ${
          isLeft
            ? "left-2 sm:left-4 md:left-6 lg:left-8"
            : "right-2 sm:right-4 md:right-6 lg:right-8"
        } top-1/2 -translate-y-1/2 z-40 h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 rounded-full bg-black/70 text-white hover:bg-black/85 active:scale-95 transition-all duration-300 hover:scale-110 shadow-2xl`}
        style={{
          borderWidth: "1px",
          borderColor: "var(--accent-pink)",
        }}
        onClick={onClick}
      >
        <Icon className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8" />
      </Button>
    );
  }
);

NavigationButton.displayName = "NavigationButton";

/* Main Carousel */
function SimpleProductCarousel() {
  const { isDarkMode, isThemeLoaded } = useTheme();
  const [products, setProducts] = useState<CarouselProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* Fetch Products */
  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);

      const query = `*[_type == "product" &&
        references(*[_type == "category" && title == "preview"]._id) &&
        defined(images[0].asset)
      ] | order(_createdAt desc)[0...10]{
        _id,
        name,
        price,
        "slug": slug,
        onSale,
        newArrival,
        outOfStock,
        images[0...1]
      }`;

      const data = await client.fetch<CarouselProduct[]>(query);
      setProducts(data);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  /* Navigation */
  const goToNext = useCallback(() => {
    setCurrentIndex((i) => (products.length ? (i + 1) % products.length : 0));
  }, [products.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((i) =>
      products.length ? (i === 0 ? products.length - 1 : i - 1) : 0
    );
  }, [products.length]);

  /* Auto-slide */
  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (!isClient) return;
    if (products.length <= 1) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % products.length);
    }, SLIDE_INTERVAL);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isClient, products.length]);

  /* Keep index valid */
  useEffect(() => {
    if (products.length === 0) return;
    setCurrentIndex((i) => Math.min(i, products.length - 1));
  }, [products.length]);

  if (!isClient || !isThemeLoaded) return null;

  const trackStyle: React.CSSProperties = {
    width: `${products.length * 100}%`,
    transform: `translate3d(-${
      currentIndex * (100 / Math.max(products.length, 1))
    }%, 0, 0)`,
    willChange: "transform",
  };

  return (
    <section className="relative w-full min-h-[65vh] sm:min-h-[75vh] md:min-h-[85vh] lg:min-h-screen flex items-center justify-center overflow-hidden py-6 sm:py-8 px-4">
      {/* Base background */}
      <div
        className="absolute inset-0 -z-30"
        style={{ backgroundColor: isDarkMode ? "#000000" : "#ffffff" }}
      />

      {/* Overlay (no blur) */}
      <div
        className="absolute inset-0 -z-20"
        style={{
          backgroundColor: isDarkMode
            ? "rgba(0,0,0,0.85)"
            : "rgba(255,255,255,0.15)",
        }}
      />

      {/* Carousel Container */}
      <div
        className="relative w-full max-w-[90vw] sm:max-w-[86vw] md:max-w-[82vw] lg:max-w-[78vw] xl:max-w-[74vw] 2xl:max-w-[1600px]
        h-[48vh] sm:h-[58vh] md:h-[68vh] lg:h-[74vh] xl:h-[76vh] 2xl:h-[78vh]
        max-h-[880px]"
      >
        {/* Container (REMOVED backdrop blur) */}
        <div
          className="relative w-full h-full overflow-hidden rounded-2xl sm:rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]"
          style={{
            backgroundImage: "none",
            backgroundColor: isDarkMode ? "#000000" : "#ffffff",
            border: "none",
          }}
          onMouseEnter={() => {
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
          }}
          onMouseLeave={() => {
            if (products.length > 1 && !timerRef.current) {
              timerRef.current = setInterval(() => {
                setCurrentIndex((i) => (i + 1) % products.length);
              }, SLIDE_INTERVAL);
            }
          }}
        >
          {/* Slides */}
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <div
                className="h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"
                style={{
                  borderColor: `var(--accent-pink) transparent transparent transparent`,
                }}
              />
            </div>
          ) : products.length > 0 ? (
            <div
              className="flex h-full transition-transform duration-700 ease-in-out"
              style={trackStyle}
            >
              {products.map((product, idx) => {
                const firstImage = product.images?.[0];
                const imageUrl =
                  firstImage?.asset
                    ? builder
                        .image(firstImage.asset)
                        .width(1400)
                        .fit("max")
                        .auto("format")
                        .url()
                    : null;

                return (
                  <div
                    key={product._id}
                    className="relative h-full flex-shrink-0 w-full flex items-center justify-center p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8"
                    style={{ width: `${100 / products.length}%` }}
                  >
                    <Link
                      href={`/product/${product.slug.current}`}
                      className="relative w-full h-full group flex flex-col items-center justify-center"
                    >
                      {/* Image (unchanged settings) */}
                      <div className="relative w-full h-[85%] sm:h-[88%] md:h-[90%] mb-2 sm:mb-3">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={firstImage?.alt || product.name}
                            fill
                            priority={idx === 0}
                            quality={95}
                            sizes="(max-width: 640px) 90vw, (max-width: 768px) 86vw, (max-width: 1024px) 82vw, (max-width: 1280px) 78vw, (max-width: 1536px) 74vw, 1600px"
                            className="object-contain object-center drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
                            unoptimized={true}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-black/40 dark:text-white/50 text-sm">
                            No Image
                          </div>
                        )}
                      </div>

                      {/* Product Info (REMOVED supports/backdrop blur completely) */}
                      <div className="w-full max-w-[280px] sm:max-w-sm px-2">
                        <div
                          className={[
                            "border rounded-md shadow-xl text-center",
                            "bg-black/75",
                            "transition-all duration-300 group-hover:bg-black/70",
                            "px-3 py-2 sm:px-3.5 sm:py-2.5",
                          ].join(" ")}
                          style={{
                            borderColor: "var(--accent-pink)",
                            borderWidth: "1px",
                          }}
                        >
                          <h3 className="text-[13px] sm:text-base md:text-lg font-medium leading-tight truncate text-white">
                            {product.name}
                          </h3>
                          <p className="text-[15px] sm:text-lg md:text-xl font-bold leading-tight text-white">
                            ${product.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-black/60 dark:text-white text-sm sm:text-base">
                No products found
              </p>
            </div>
          )}

          {/* Navigation Arrows */}
          {!isLoading && products.length > 1 && (
            <>
              <NavigationButton direction="left" onClick={goToPrev} />
              <NavigationButton direction="right" onClick={goToNext} />
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default memo(SimpleProductCarousel);
