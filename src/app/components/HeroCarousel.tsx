"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, memo } from "react";
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

const BACKGROUND_IMAGE = "/models/2.png";
const SLIDE_INTERVAL = 5000;

/* Navigation Button */
const NavigationButton = memo(({ 
  direction, 
  onClick,
  isDarkMode
}: { 
  direction: "left" | "right"; 
  onClick: () => void;
  isDarkMode: boolean;
}) => {
  const isLeft = direction === "left";
  const Icon = isLeft ? ChevronLeft : ChevronRight;
  
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={`${isLeft ? "Previous" : "Next"} slide`}
      className={`absolute ${isLeft ? "left-2 sm:left-4 md:left-6 lg:left-8" : "right-2 sm:right-4 md:right-6 lg:right-8"} top-1/2 -translate-y-1/2 z-40 h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 rounded-full bg-black/70 backdrop-blur-md text-white hover:bg-black/85 active:scale-95 transition-all duration-300 hover:scale-110 shadow-2xl`}
      style={{
        borderWidth: '2px',
        borderColor: isDarkMode ? '#a90068' : '#3b82f6'
      }}
      onClick={onClick}
    >
      <Icon className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8" />
    </Button>
  );
});

NavigationButton.displayName = "NavigationButton";

/* Main Carousel */
function NicheExclusivesCarousel() {
  const { isDarkMode, isThemeLoaded } = useTheme();
  const [products, setProducts] = useState<CarouselProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const minSwipeDistance = 50;

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
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /* Navigation */
  const goToNext = useCallback(() => {
    if (products.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % products.length);
  }, [products.length]);

  const goToPrev = useCallback(() => {
    if (products.length === 0) return;
    setCurrentIndex((prev) => 
      prev === 0 ? products.length - 1 : prev - 1
    );
  }, [products.length]);

  /* Touch Handlers */
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const onTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrev();
    }
  }, [touchStart, touchEnd, goToNext, goToPrev]);

  /* Auto-slide */
  const startAutoSlide = useCallback(() => {
    if (products.length <= 1) return;
    timerRef.current = setInterval(goToNext, SLIDE_INTERVAL);
  }, [goToNext, products.length]);

  const stopAutoSlide = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || products.length === 0) return;
    startAutoSlide();
    return () => stopAutoSlide();
  }, [isClient, startAutoSlide, stopAutoSlide, products.length]);

  if (!isClient || !isThemeLoaded) return null;

  const themeBorderColor = isDarkMode ? '#a90068' : '#3b82f6';

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      {/* Background */}
      <div className="absolute inset-0 -z-30 h-[120%] sm:h-[115%] md:h-[112%] lg:h-[110%] -top-[10%] sm:-top-[7.5%] md:-top-[6%] lg:-top-[5%]">
        <Image
          src={BACKGROUND_IMAGE}
          alt="Background"
          fill
          priority
          quality={100}
          className="object-cover object-center"
          sizes="100vw"
          unoptimized={false}
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 -z-20 bg-black/20" />

      {/* Section Title */}
      <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-12">
        <h2 
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center tracking-tight"
          style={{
            textShadow: '0 4px 20px rgba(0,0,0,0.5)'
          }}
        >
          Niche Exclusives
        </h2>
      </div>

      {/* Carousel Container */}
      <div 
        className="relative w-full max-w-[90vw] sm:max-w-[86vw] md:max-w-[82vw] lg:max-w-[78vw] xl:max-w-[74vw] 2xl:max-w-[1600px] h-[58vh] sm:h-[65vh] md:h-[70vh] lg:h-[75vh] xl:h-[78vh] 2xl:h-[80vh] max-h-[900px]"
        onMouseEnter={stopAutoSlide}
        onMouseLeave={startAutoSlide}
        onTouchStart={(e) => {
          stopAutoSlide();
          onTouchStart(e);
        }}
        onTouchMove={onTouchMove}
        onTouchEnd={() => {
          onTouchEnd();
          startAutoSlide();
        }}
      >
        {/* Glass Container */}
        <div 
          className="relative w-full h-full overflow-hidden rounded-2xl sm:rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-[2px]"
          style={{
            borderWidth: '2px',
            borderColor: themeBorderColor,
            transition: 'border-color 0.3s ease'
          }}
        >
          {/* Slides */}
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <div 
                className="h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"
                style={{
                  borderColor: `${themeBorderColor} transparent transparent transparent`
                }}
              />
            </div>
          ) : products.length > 0 ? (
            <div 
              className="flex h-full transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {products.map((product, idx) => {
                const firstImage = product.images?.[0];

                const imageUrl = firstImage?.asset
                  ? builder
                      .image(firstImage.asset)
                      .width(1200)
                      .fit("max")
                      .auto("format")
                      .url()
                  : null;

                return (
                  <div 
                    key={product._id}
                    className="relative min-w-full h-full flex-shrink-0 flex items-center justify-center p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8"
                  >
                    <Link
                      href={`/product/${product.slug.current}`}
                      className="relative w-full h-full group flex items-center justify-center"
                    >
                      {/* Image Container */}
                      <div className="relative w-full h-full">
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
                          <div className="flex h-full w-full items-center justify-center text-white/50 text-sm">
                            No Image
                          </div>
                        )}

                        {/* Badges */}
                        {(product.newArrival || product.onSale || product.outOfStock) && (
                          <div className="absolute top-2 left-2 flex flex-col gap-1">
                            {product.newArrival && (
                              <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-0.5 text-xs font-bold shadow-sm rounded-sm">
                                NEW
                              </span>
                            )}
                            {product.onSale && (
                              <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-0.5 text-xs font-bold shadow-sm rounded-sm">
                                SALE
                              </span>
                            )}
                            {product.outOfStock && (
                              <span className="bg-gradient-to-r from-gray-600 to-gray-800 text-white px-2 py-0.5 text-xs font-bold shadow-sm rounded-sm">
                                OUT OF STOCK
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-white text-sm sm:text-base">No products found</p>
            </div>
          )}

          {/* Inner glow */}
          <div className="absolute inset-0 rounded-2xl sm:rounded-3xl shadow-[inset_0_0_40px_rgba(255,255,255,0.05)] pointer-events-none" />
        </div>

        {/* Navigation Arrows */}
        {!isLoading && products.length > 1 && (
          <>
            <NavigationButton direction="left" onClick={goToPrev} isDarkMode={isDarkMode} />
            <NavigationButton direction="right" onClick={goToNext} isDarkMode={isDarkMode} />
          </>
        )}
      </div>
    </section>
  );
}

export default memo(NicheExclusivesCarousel);