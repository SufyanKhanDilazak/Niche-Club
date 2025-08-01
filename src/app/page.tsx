import { Suspense } from 'react'
import HeroCarousel from './components/HeroCarousel'
import MensCollection from './components/Mens-Collection'
import WomensCollection from './components/Women-Collection'


function HeroSkeleton() {
  return (
    <div className="relative w-full h-[60vh] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 animate-pulse">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#a90068] border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  )
}

function ProductsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg animate-pulse mx-auto w-48" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-lg animate-pulse">
            <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg mb-4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <div className="container mx-auto px-1 sm:px-1 lg:px-1 py-0 space-y-12 sm:space-y-8 relative z-10 mt-24 sm:mt-34">
      
        <section className="w-full">
          <Suspense fallback={<ProductsSkeleton />}>
          <HeroCarousel />
          </Suspense>
        </section>

        <section className="w-full">
          <Suspense fallback={<HeroSkeleton />}>
          <MensCollection />
          </Suspense>
        </section>
        <section className="w-full">
          <Suspense fallback={<HeroSkeleton />}>
          <WomensCollection />
          </Suspense>
        </section>
       
      </div>

      <div className="fixed inset-0 pointer-events-none z-[1] bg-gradient-to-b from-transparent via-transparent to-white/10 dark:to-black/10" />
    </div>
  )
}