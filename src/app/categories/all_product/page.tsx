'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState, useCallback, memo, useMemo, type ChangeEvent } from 'react'
import { client } from '@/sanity/lib/client'

interface ICategory {
  _id: string
  title: string
  slug: {
    current: string
  }
  bannerImage?: {
    asset: {
      _id: string
      url: string
    }
    alt?: string
  }
}

interface IProduct {
  _id: string
  name: string
  slug: {
    current: string
  }
  price: number
  images: {
    asset: {
      _id: string
      url: string
    }
    alt?: string
  }[]
  description?: string
  onSale: boolean
  newArrival: boolean
  sizes?: string[]
  colors?: string[]
  categories: ICategory[]
}

type SortType = 'price-low' | 'price-high' | 'name' | 'newest' | 'sale'

const ProductCard = memo(({ product, index }: { product: IProduct; index: number }) => {
  const [imageLoading, setImageLoading] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const firstImage = product.images?.[0]

  const handleImageLoad = useCallback(() => {
    setImageLoading(false)
  }, [])

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
  }, [])

  return (
    <Link
      href={`/product/${product.slug?.current || product._id}`}
      className="group block transform transition-all duration-500 ease-out hover:scale-[1.02] will-change-transform"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        animationDelay: `${index * 100}ms`,
        animation: 'fadeInUp 0.6s ease-out forwards'
      }}
    >
      <article className="relative">
        {/* Image Container */}
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
              className={`object-cover transition-all duration-700 ease-out ${
                imageLoading ? 'opacity-0 scale-110' : 'opacity-100 scale-100'
              } ${isHovered ? 'scale-105' : ''}`}
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              quality={90}
              onLoad={handleImageLoad}
              priority={index < 4}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-base font-light bg-gradient-to-br from-gray-50/50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/50">
              <div className="text-center space-y-2">
                <div className="w-8 h-8 mx-auto opacity-40">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                  </svg>
                </div>
                <span className="text-xs">No Image</span>
              </div>
            </div>
          )}

          {/* Enhanced Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {product.newArrival && (
              <span className="relative bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white px-3 py-1.5 text-xs font-bold shadow-xl rounded-full backdrop-blur-sm transform transition-all duration-300 hover:scale-105">
                <span className="relative z-10">NEW</span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </span>
            )}
            {product.onSale && (
              <span className="relative bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 text-white px-3 py-1.5 text-xs font-bold shadow-xl rounded-full backdrop-blur-sm transform transition-all duration-300 hover:scale-105">
                <span className="relative z-10">SALE</span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-rose-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </span>
            )}
          </div>

          {/* Hover Effect Overlay */}
          <div className={`absolute inset-0 transition-opacity duration-500 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
          </div>
        </div>

        {/* Enhanced Product Info */}
        <div className="mt-4 relative">
          <div className="border border-blue-500 dark:border-[#a90068] bg-transparent p-3 text-center transition-all duration-500 ease-out group-hover:border-opacity-80 group-hover:shadow-lg group-hover:shadow-blue-500/10 dark:group-hover:shadow-[#a90068]/10 relative overflow-hidden">
            {/* Animated background on hover */}
            <div className={`absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5 dark:from-[#a90068]/5 dark:to-purple-500/5 transition-opacity duration-500 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`} />
            
            <div className="relative z-10">
              <h4 className="text-sm sm:text-base font-light text-black dark:text-white truncate mb-2 transition-colors duration-300">
                {product.name}
              </h4>
              <div className="flex items-center justify-center gap-2 mb-2">
                <p className="text-sm sm:text-base font-medium text-black dark:text-white transition-all duration-300 group-hover:scale-105">
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
  )
})

ProductCard.displayName = 'ProductCard'

const ProductSkeleton = memo(({ index }: { index: number }) => (
  <div 
    className="animate-pulse"
    style={{
      animationDelay: `${index * 100}ms`,
      animation: 'fadeInUp 0.6s ease-out forwards'
    }}
  >
    <div className="relative w-full aspect-[4/5] bg-gradient-to-br from-gray-200/20 via-gray-100/30 to-gray-200/20 dark:from-gray-700/20 dark:via-gray-800/30 dark:to-gray-700/20 rounded-sm">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/5 animate-shimmer" />
    </div>
    <div className="mt-4 border border-gray-300/30 dark:border-gray-600/30 p-3">
      <div className="h-4 bg-gradient-to-r from-gray-300/40 to-gray-200/40 dark:from-gray-600/40 dark:to-gray-700/40 rounded mb-2" />
      <div className="h-4 bg-gradient-to-r from-gray-300/40 to-gray-200/40 dark:from-gray-600/40 dark:to-gray-700/40 rounded w-20 mx-auto mb-2" />
      <div className="h-3 bg-gradient-to-r from-gray-200/40 to-gray-100/40 dark:from-gray-700/40 dark:to-gray-600/40 rounded w-16 mx-auto" />
    </div>
  </div>
))

ProductSkeleton.displayName = 'ProductSkeleton'

export default function AllProductsPage() {
  const [products, setProducts] = useState<IProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortType>('price-low')

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const orderByMap: Record<SortType, string> = {
        'price-low': 'order(price asc)',
        'price-high': 'order(price desc)',
        'name': 'order(name asc)',
        'newest': 'order(_createdAt desc)',
        'sale': 'order(onSale desc, price asc)'
      }
      
      const orderBy = orderByMap[sortBy]
      
      const query = `*[_type == "product"] | ${orderBy} {
        _id,
        name,
        slug,
        price,
        images[]{
          asset->{
            _id,
            url
          },
          alt
        },
        description,
        onSale,
        newArrival,
        sizes,
        colors,
        categories[]->{
          _id,
          title,
          slug,
          bannerImage{
            asset->{
              _id,
              url
            },
            alt
          }
        }
      }`

      const data = await client.fetch<IProduct[]>(query)
      setProducts(data)
    } catch (error) {
      console.error('Error fetching all products:', error)
      setError('Failed to load products')
    } finally {
      setIsLoading(false)
    }
  }, [sortBy])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleSortChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as SortType)
  }, [])

  const memoizedProducts = useMemo(() => 
    products.map((product, index) => (
      <ProductCard key={product._id} product={product} index={index} />
    )), [products]
  )

  const memoizedSkeletons = useMemo(() => 
    Array.from({ length: 12 }, (_, i) => (
      <ProductSkeleton key={`skeleton-${i}`} index={i} />
    )), []
  )

  const productStats = useMemo(() => {
    const totalProducts = products.length
    const onSaleCount = products.filter(p => p.onSale).length
    const newArrivalsCount = products.filter(p => p.newArrival).length
    const uniqueCategories = new Set(products.flatMap(p => p.categories?.map(c => c.title) || [])).size
    
    return { totalProducts, onSaleCount, newArrivalsCount, uniqueCategories }
  }, [products])

  const features = useMemo(() => [
    {
      icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
      title: "Complete Collection",
      description: "Discover our entire range of premium products across all categories",
      gradient: "from-blue-500 to-purple-500 dark:from-[#a90068] dark:to-purple-500",
      count: productStats.totalProducts
    },
    {
      icon: "M13 10V3L4 14h7v7l9-11h-7z",
      title: "New Arrivals",
      description: "Fresh additions to keep your style current and on-trend",
      gradient: "from-green-500 to-emerald-500",
      count: productStats.newArrivalsCount
    },
    {
      icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      title: "Sale Items",
      description: "Unbeatable deals on premium products with exceptional value",
      gradient: "from-red-500 to-pink-500",
      count: productStats.onSaleCount
    }
  ], [productStats])

  return (
    <>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateX(100%);
            opacity: 0;
          }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        .will-change-transform {
          will-change: transform;
        }
      `}</style>
      
      <main className="min-h-screen font-montserrat bg-transparent">
        {/* Enhanced Hero Banner */}
        <section className="mt-20 sm:mt-24 mb-16 relative">
          <div className="relative h-[40vh] sm:h-[60vh] w-full overflow-hidden">
            <Image
              src="/denim1.jpg"
              alt="All Products Collection"
              fill
              priority
              quality={95}
              sizes="100vw"
              className="object-cover"
            />
            
            <div className="absolute inset-0 flex items-center justify-center text-center px-6">
              <div className="space-y-4 sm:space-y-6 animate-[fadeInUp_1s_ease-out]">
                <div className="space-y-1 sm:space-y-2">
                  <h1 className="text-3xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tight drop-shadow-2xl">
                    ALL
                  </h1>
                  <h2 className="text-xl sm:text-4xl md:text-5xl lg:text-6xl font-thin text-white/90 tracking-[0.2em] drop-shadow-xl">
                    PRODUCTS
                  </h2>
                </div>
                <p className="text-white/80 text-xs sm:text-base lg:text-lg max-w-2xl mx-auto font-light leading-relaxed drop-shadow-lg">
                  Explore our complete collection of premium lifestyle products
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section with Background Style */}
        <section className="text-center mb-16 space-y-0 font-montserrat bg-transparent">
          <div className="px-2 sm:px-6 mb-3">
            <div className="relative h-24 sm:h-28 md:h-32 overflow-hidden rounded-lg border border-blue-500 dark:border-[#a90068] bg-transparent">
              <Image
                src="/denim1.jpg"
                alt="All Products Banner"
                fill
                priority
                quality={100}
                sizes="100vw"
                className="object-cover object-center"
              />
              
              <div className="absolute inset-0 flex flex-col items-center justify-center px-6 sm:px-8 z-10">
                <div className="w-16 sm:w-20 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-[#a90068] dark:to-purple-500 mb-3 rounded-full" />
                
                <div className="flex items-center gap-4">
                  <h3 className="text-white font-medium text-sm sm:text-base">
                    ALL PRODUCTS
                  </h3>
                  {!isLoading && products.length > 0 && (
                    <span className="text-white/80 text-xs sm:text-sm">
                      {products.length} Products
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="px-2 sm:px-6">
            <div className="border border-blue-500 dark:border-[#a90068] bg-transparent backdrop-blur-md rounded-none sm:rounded-lg p-4 sm:p-6">
              {/* Sort Dropdown */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={handleSortChange}
                    className="appearance-none bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 rounded-full px-6 py-2 pr-10 text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-[#a90068]/50 focus:border-transparent transition-all duration-300 cursor-pointer"
                  >
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name: A to Z</option>
                    <option value="newest">Newest First</option>
                    <option value="sale">Sale Items First</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-6">
                {isLoading ? (
                  memoizedSkeletons
                ) : error ? (
                  <div className="col-span-full text-center py-8">
                    <p className="text-red-500 dark:text-red-400 mb-4 text-base sm:text-lg font-light">{error}</p>
                    <button
                      onClick={fetchProducts}
                      className="px-6 py-2 border border-blue-500 dark:border-[#a90068] text-blue-500 dark:text-[#a90068] hover:bg-blue-500/10 dark:hover:bg-[#a90068]/10 transition-colors font-light rounded"
                    >
                      Try Again
                    </button>
                  </div>
                ) : products.length === 0 ? (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg font-light">No products found</p>
                  </div>
                ) : (
                  memoizedProducts
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Back to Home Button */}
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

        {/* Enhanced Feature Section with Dynamic Stats */}
        <section className="px-4 sm:px-6 py-20 bg-gradient-to-r from-transparent via-transparent to-transparent">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h4 className="text-2xl sm:text-3xl font-light text-gray-900 dark:text-white mb-6">
                Complete Product Collection
              </h4>
              <div className="w-24 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-[#a90068] dark:to-purple-500 mx-auto rounded-full" />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-8">
              {features.map((feature, index) => (
                <div 
                  key={feature.title}
                  className="text-center group cursor-pointer"
                  style={{
                    animationDelay: `${index * 200}ms`,
                    animation: 'fadeInUp 0.8s ease-out forwards'
                  }}
                >
                  <div className={`w-18 h-18 mx-auto mb-6 bg-gradient-to-br ${feature.gradient} rounded-3xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl group-hover:shadow-2xl relative`}>
                    <svg className="w-8 h-8 text-white transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                    </svg>
                    {/* Count Badge */}
                    {!isLoading && feature.count > 0 && (
                      <span className="absolute -top-2 -right-2 bg-white text-gray-900 text-xs font-bold px-2 py-1 rounded-full shadow-lg min-w-[1.5rem] h-6 flex items-center justify-center">
                        {feature.count}
                      </span>
                    )}
                  </div>
                  <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-[#a90068] transition-colors duration-300">
                    {feature.title}
                  </h5>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}