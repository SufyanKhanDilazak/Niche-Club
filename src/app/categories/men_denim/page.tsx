'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useCallback, memo, useMemo, type ChangeEvent } from 'react';
import { client } from '@/sanity/lib/client';

/* ========= Interfaces ========= */
interface ICategory {
  _id: string;
  title: string;
  slug: { current: string };
}

interface IProduct {
  _id: string;
  name: string;
  slug: { current: string };
  price: number;
  images: { asset?: { _id?: string; url?: string }; alt?: string }[];
  description?: string;
  onSale: boolean;
  newArrival: boolean;
  sizes?: string[];
  colors?: string[];
  categories: ICategory[];
}

type SortType = 'price-low' | 'price-high' | 'name';

/* ========= Banner Image ========= */
const BANNER_IMAGE = '/light1.png';

/* ========= Product Card ========= */
const ProductCard = memo(({ product, index }: { product: IProduct; index: number }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const firstImage = product.images?.[0];

  return (
    <Link
      href={`/product/${product.slug?.current || product._id}`}
      className="group block transform transition-all duration-500 ease-out hover:scale-[1.02]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ animationDelay: `${index * 100}ms`, animation: 'fadeInUp 0.6s ease-out forwards' }}
    >
      <article className="relative">
        {/* product image */}
        <div className="relative w-full aspect-[4/5] overflow-hidden bg-transparent rounded-sm">
          {imageLoading && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100/30 via-gray-200/20 to-gray-100/30 dark:from-gray-800/30 dark:via-gray-700/20 dark:to-gray-800/30">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/5 animate-shimmer" />
            </div>
          )}

          {firstImage?.asset?.url ? (
            <Image
              src={firstImage.asset.url}
              alt={firstImage.alt || product.name}
              fill
              priority={index < 4}
              quality={85}
              sizes="(max-width:640px)50vw,(max-width:768px)33vw,(max-width:1024px)25vw,20vw"
              className={`object-cover transition-all duration-700 ease-out ${
                imageLoading ? 'opacity-0 scale-110' : 'opacity-100 scale-100'
              } ${isHovered ? 'scale-105' : ''}`}
              onLoad={() => setImageLoading(false)}
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-gray-400 text-xs font-light bg-gradient-to-br from-gray-50/50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/50">
              No Image
            </div>
          )}

          {/* badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {product.newArrival && (
              <span className="relative bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white px-3 py-1.5 text-xs font-bold shadow-xl rounded-full backdrop-blur-sm transform transition-all duration-300 hover:scale-105">
                NEW
              </span>
            )}
            {product.onSale && (
              <span className="relative bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 text-white px-3 py-1.5 text-xs font-bold shadow-xl rounded-full backdrop-blur-sm transform transition-all duration-300 hover:scale-105">
                SALE
              </span>
            )}
          </div>

          {/* hover tint */}
          <div
            className={`absolute inset-0 transition-opacity duration-500 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
          </div>
        </div>

        {/* product info */}
        <div className="mt-4 relative">
          <div className="border border-blue-500 dark:border-[#a90068] bg-transparent p-3 text-center transition-all duration-500 ease-out group-hover:border-opacity-80 group-hover:shadow-lg group-hover:shadow-blue-500/10 dark:group-hover:shadow-[#a90068]/10 relative overflow-hidden rounded">
            <div
              className={`absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5 dark:from-[#a90068]/5 dark:to-purple-500/5 transition-opacity duration-500 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            />
            <div className="relative z-10">
              <h4 className="text-sm sm:text-base font-light text-black dark:text-white truncate mb-2">
                {product.name}
              </h4>
              <div className="flex items-center justify-center gap-2">
                <p className="text-sm sm:text-base font-medium text-black dark:text-white group-hover:scale-105 transition-transform">
                  ${product.price.toFixed(2)}
                </p>
                {(product.onSale || product.newArrival) && (
                  <div className="w-1 h-1 bg-blue-500 dark:bg-[#a90068] rounded-full opacity-60" />
                )}
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
});
ProductCard.displayName = 'ProductCard';

/* ========= Skeleton ========= */
const ProductSkeleton = memo(({ index }: { index: number }) => (
  <div
    className="animate-pulse"
    style={{ animationDelay: `${index * 100}ms`, animation: 'fadeInUp 0.6s ease-out forwards' }}
  >
    <div className="relative w-full aspect-[4/5] bg-gradient-to-br from-gray-200/20 via-gray-100/30 to-gray-200/20 dark:from-gray-700/20 dark:via-gray-800/30 dark:to-gray-700/20 rounded-sm">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/5 animate-shimmer" />
    </div>
    <div className="mt-4 border border-gray-300/30 dark:border-gray-600/30 p-3 rounded">
      <div className="h-4 bg-gray-300/30 dark:bg-gray-700/30 rounded mb-2" />
      <div className="h-4 bg-gray-300/30 dark:bg-gray-700/30 rounded w-20 mx-auto" />
    </div>
  </div>
));
ProductSkeleton.displayName = 'ProductSkeleton';

/* ========= Banner ========= */
const Banner = memo(() => (
  <div className="px-2 sm:px-6 mb-8">
    <div className="border border-blue-500 dark:border-[#a90068] bg-transparent backdrop-blur-md rounded-none sm:rounded-lg overflow-hidden mt-32">
      <div className="relative w-full h-[25vh] lg:h-[25vh] overflow-hidden">
        <Image
          src={BANNER_IMAGE}
          alt="Men Denim"
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover object-center scale-[2] sm:scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/10" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>
    </div>
  </div>
));
Banner.displayName = 'Banner';

/* ========= Page ========= */
export default function MenDenimPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortType>('price-low');

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const query = `*[_type == "product" && references(*[_type == "category" && title == "men-denim"]._id)] | order(_createdAt desc) {
        _id,
        name,
        slug,
        price,
        images[]{
          "url": asset->url,
          asset->{_id,url},
          alt
        },
        description,
        onSale,
        newArrival,
        sizes,
        colors,
        categories[]->{_id,title,slug}
      }`;

      const data = await client.fetch<IProduct[]>(query);
      setProducts(data);
    } catch (err) {
      console.error('Error fetching men denim:', err);
      setError('Failed to load men denim');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSortChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as SortType);
  }, []);

  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    if (sortBy === 'price-low') return sorted.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') return sorted.sort((a, b) => b.price - a.price);
    if (sortBy === 'name') return sorted.sort((a, b) => a.name.localeCompare(b.name));
    return sorted;
  }, [products, sortBy]);

  const memoizedProducts = useMemo(
    () => sortedProducts.map((p, i) => <ProductCard key={p._id} product={p} index={i} />),
    [sortedProducts]
  );

  const memoizedSkeletons = useMemo(
    () => Array.from({ length: 8 }, (_, i) => <ProductSkeleton key={`s-${i}`} index={i} />),
    []
  );

  return (
    <>
      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
        .animate-shimmer { animation: shimmer 2s infinite; }
      `}</style>

      <main className="min-h-screen font-montserrat bg-transparent sm:mt-28">
        <Banner />

        {/* product section */}
        <section className="text-center mb-16 bg-transparent">
          <div className="px-2 sm:px-6">
            <div className="border border-blue-500 dark:border-[#a90068] bg-transparent backdrop-blur-md rounded-none sm:rounded-lg p-4 sm:p-6">
              <div className="flex justify-between items-center mb-8">
                <div>
                  {!isLoading && products.length > 0 && (
                    <span className="text-blue-600 dark:text-[#a90068] text-sm font-medium">
                      {products.length} Products
                    </span>
                  )}
                </div>

                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  className="appearance-none bg-white/80 dark:bg-gray-900/80 border border-gray-200/50 dark:border-gray-700/50 rounded-full px-6 py-2 pr-10 text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-[#a90068]/50 transition-all cursor-pointer"
                >
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
                {isLoading
                  ? memoizedSkeletons
                  : error
                  ? <div className="col-span-full text-red-500">{error}</div>
                  : products.length === 0
                  ? <div className="col-span-full text-gray-500">No men denim found</div>
                  : memoizedProducts}
              </div>
            </div>
          </div>
        </section>

        {/* back button */}
        {products.length > 0 && (
          <div className="text-center mb-12">
            <Link
              href="/"
              className="inline-flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-blue-500 dark:from-[#a90068] dark:to-[#a90068] text-white rounded-full text-sm sm:text-base font-medium hover:shadow-2xl hover:shadow-blue-500/25 dark:hover:shadow-[#a90068]/25 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 group"
            >
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Home</span>
            </Link>
          </div>
        )}
      </main>
    </>
  );
}
