'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState, useCallback, memo, useMemo } from 'react'
import { client } from '@/sanity/lib/client'
import { useTheme } from './theme-context'

interface IProduct {
  _id: string
  name: string
  price: number
  images: {
    url: string
    alt?: string
  }[]
  onSale: boolean
  newArrival: boolean
}

interface CategoryBannerProps {
  readonly category?: string
  readonly title?: string
  readonly subtitle?: string
  readonly className?: string
}

const CategoryBanner = memo<CategoryBannerProps>(({
  category = "Premium Category",
  title = "Mens Collection",
  subtitle = "Discover our curated selection of premium menswear designed for the modern gentleman",
  className = ""
}) => {
  return (
    <div className={`category-banner-container ${className}`}>
      <div className="category-banner">
        <div className="banner-content">
          <div className="category-tag">
            {category}
          </div>
          <h1 className="banner-title">
            {title}
          </h1>
          <p className="banner-subtitle">
            {subtitle}
          </p>
        </div>
      </div>

      <style jsx>{`
        .category-banner-container {
          width: 100%;
          position: relative;
          overflow: hidden;
          border-radius: 16px;
          margin: 0 auto 1.5rem auto;
        }

        .category-banner {
          position: relative;
          height: 200px;
          background: transparent;
          backdrop-filter: blur(40px) saturate(180%);
          -webkit-backdrop-filter: blur(40px) saturate(180%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .category-banner::before {
          content: '';
          position: absolute;
          inset: 1px;
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 15px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          z-index: 1;
        }

        .banner-content {
          position: relative;
          z-index: 2;
          color: rgba(255, 255, 255, 0.9);
          text-align: center;
          max-width: 500px;
        }

        .category-tag {
          display: inline-block;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          padding: 6px 16px;
          border-radius: 50px;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          margin-bottom: 20px;
          color: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.15);
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif;
        }

        .banner-title {
          font-size: 2rem;
          font-weight: 600;
          margin-bottom: 12px;
          color: rgba(255, 255, 255, 0.95);
          line-height: 1.2;
          letter-spacing: -0.01em;
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif;
        }

        .banner-subtitle {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 400;
          line-height: 1.5;
          max-width: 350px;
          margin: 0 auto;
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif;
        }

        @media (max-width: 768px) {
          .category-banner-container {
            border-radius: 12px;
            margin-bottom: 1rem;
          }
          
          .category-banner {
            padding: 25px 15px;
            height: 140px;
          }
          
          .category-banner::before {
            border-radius: 11px;
          }
          
          .banner-title {
            font-size: 1.5rem;
            margin-bottom: 8px;
          }
          
          .banner-subtitle {
            font-size: 0.75rem;
            line-height: 1.4;
            max-width: 250px;
          }
          
          .category-tag {
            font-size: 7px;
            padding: 4px 12px;
            margin-bottom: 15px;
            letter-spacing: 1px;
          }
        }

        @media (max-width: 480px) {
          .category-banner-container {
            border-radius: 8px;
          }
          
          .category-banner {
            padding: 20px 12px;
            height: 120px;
          }
          
          .category-banner::before {
            border-radius: 7px;
          }
          
          .banner-title {
            font-size: 1.3rem;
            margin-bottom: 6px;
          }
          
          .banner-subtitle {
            font-size: 0.7rem;
            max-width: 200px;
          }
          
          .category-tag {
            font-size: 6px;
            padding: 3px 10px;
            margin-bottom: 12px;
          }
        }
      `}</style>
    </div>
  )
})

CategoryBanner.displayName = 'CategoryBanner'

const ProductCard = memo<{ product: IProduct; index: number }>(({ product, index }) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  useTheme()
  
  const firstImage = useMemo(() => product.images?.[0], [product.images])

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true)
  }, [])

  const cardStyle = useMemo(() => ({
    animationDelay: `${index * 50}ms`,
    animation: 'fadeInUp 0.4s ease-out forwards'
  }), [index])

  return (
    <Link
      href={`/product/${product._id}`}
      className="group transform transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg dark:hover:shadow-pink-500/20"
      style={cardStyle}
    >
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-white dark:bg-gray-900 rounded-sm">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
        )}
        
        {firstImage?.url ? (
          <Image
            src={firstImage.url}
            alt={firstImage.alt || product.name}
            fill
            className={`object-cover transition-opacity duration-200 group-hover:opacity-90 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            quality={80}
            onLoad={handleImageLoad}
            priority={index < 4}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm font-light bg-gray-100 dark:bg-gray-800">
            No Image
          </div>
        )}

        {(product.newArrival || product.onSale) && (
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
          </div>
        )}
      </div>

      <div className="mt-2">
        <div className="border border-blue-500 dark:border-[#a90068] bg-transparent p-2 text-center transition-colors duration-200 group-hover:border-opacity-80">
          <h4 className="text-sm md:text-base text-black dark:text-white truncate font-light mb-1">
            {product.name}
          </h4>
          <p className="text-sm md:text-base text-black dark:text-white font-light">
            ${product.price.toFixed(2)}
          </p>
        </div>
      </div>
    </Link>
  )
})

ProductCard.displayName = 'ProductCard'

const ProductSkeleton = memo<{ index: number }>(({ index }) => {
  const skeletonStyle = useMemo(() => ({
    animationDelay: `${index * 50}ms`,
    animation: 'fadeInUp 0.4s ease-out forwards'
  }), [index])

  return (
    <div className="group animate-pulse" style={skeletonStyle}>
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-gray-200 dark:bg-gray-700 rounded-sm">
        <div className="w-full h-full bg-gray-300 dark:bg-gray-600" />
      </div>
      
      <div className="mt-2">
        <div className="border border-gray-300 dark:border-gray-600 bg-transparent p-2 text-center">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-1" />
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16 mx-auto" />
        </div>
      </div>
    </div>
  )
})

ProductSkeleton.displayName = 'ProductSkeleton'

const MensCollection = memo(() => {
  const [products, setProducts] = useState<IProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const query = `*[_type == "product" && references(*[_type == "category" && title == "men-showcase"]._id) && defined(images[0].asset->url)] | order(_createdAt desc)[0...8] {
        _id,
        name,
        price,
        onSale,
        newArrival,
        images[]{
          "url": asset->url,
          alt
        }
      }`

      const data = await client.fetch<IProduct[]>(query)
      setProducts(data)
    } catch (err) {
      console.error('Error fetching products:', err)
      setError('Failed to load products')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const displayProducts = useMemo(() => 
    products.slice(0, 4).map((product, index) => (
      <ProductCard key={product._id} product={product} index={index} />
    )), [products]
  )

  const skeletonItems = useMemo(() => 
    Array.from({ length: 4 }, (_, i) => (
      <ProductSkeleton key={i} index={i} />
    )), []
  )

  const handleRetry = useCallback(() => {
    fetchProducts()
  }, [fetchProducts])

  return (
    <>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      
      <section className="text-center mb-12 font-montserrat">
        <div className="px-2 sm:px-6 mb-4">
          <CategoryBanner 
            category="New Arrivals"
            title="Mens Collection"
            subtitle="Discover our latest premium menswear collection designed for the modern gentleman"
          />
        </div>

        <div className="px-2 sm:px-6">
          <div className="border border-blue-500 dark:border-[#a90068] bg-transparent backdrop-blur-sm rounded-lg p-4 sm:p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {isLoading ? (
                skeletonItems
              ) : error ? (
                <div className="col-span-full text-center py-6">
                  <p className="text-red-500 dark:text-red-400 mb-3 text-sm sm:text-base font-light">{error}</p>
                  <button
                    onClick={handleRetry}
                    className="px-4 py-2 border border-blue-500 dark:border-[#a90068] text-blue-500 dark:text-[#a90068] hover:bg-blue-500/10 dark:hover:bg-[#a90068]/10 transition-colors font-light rounded text-sm"
                  >
                    Try Again
                  </button>
                </div>
              ) : products.length === 0 ? (
                <div className="col-span-full text-center py-6">
                  <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base font-light">No products found</p>
                </div>
              ) : (
                displayProducts
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
})

MensCollection.displayName = 'MensCollection'

export default MensCollection