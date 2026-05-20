// app/product/[id]/loading.tsx
export default function Loading() {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Breadcrumb Skeleton */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 text-sm">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12 animate-pulse"></div>
              <span className="text-gray-400">/</span>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
              <span className="text-gray-400">/</span>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
            </div>
          </div>
  
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images Skeleton */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              
              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
  
            {/* Product Details Skeleton */}
            <div className="space-y-6">
              {/* Title and Price */}
              <div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2 animate-pulse"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
              </div>
  
              {/* Description */}
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                </div>
              </div>
  
              {/* Size Selection */}
              <div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-3 animate-pulse"></div>
                <div className="grid grid-cols-6 gap-2">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                    ></div>
                  ))}
                </div>
              </div>
  
              {/* Color Selection */}
              <div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-3 animate-pulse"></div>
                <div className="flex flex-wrap gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="h-10 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                    ></div>
                  ))}
                </div>
              </div>
  
              {/* Quantity */}
              <div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-3 animate-pulse"></div>
                <div className="w-32 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
  
              {/* Add to Cart Button */}
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
  
              {/* Additional Info */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex justify-between">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
  
          {/* Related Products Skeleton */}
          <div className="mt-16">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-8 animate-pulse"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }