// app/product/[id]/not-found.tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md">
          The product you&apos;re looking for doesn&apos;t exist or has been removed
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/products"
            className="inline-block bg-gray-900 text-white px-6 py-3 rounded-md font-medium hover:bg-gray-700 transition-colors dark:bg-white dark:text-black dark:hover:bg-gray-200"
          >
            Browse All Products
          </Link>
          
          <div>
            <Link
              href="/"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}