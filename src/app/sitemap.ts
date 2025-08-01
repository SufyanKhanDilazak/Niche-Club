// app/sitemap.ts
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://nicheclub.us'

  const staticRoutes = [
    '/',
    '/about',
    '/brands',
    '/cart',
    '/categories/all_product',
    '/categories/denim_club',
    '/categories/niche_essentials',
    '/checkout',
    '/contact',
    '/cookiepolicy',
    '/dashboard',
    '/dashboard/analytics',
    '/dashboard/orders',
    '/dashboard/settings',
    '/dashboard/users',
    '/new-arrivals',
    '/onsale',
    '/payment-success',
    '/privacypolicy',
    '/return&exchange',
    '/unauthorized',
  ]

  const productRoutes = [
    '/product/1298443e-f807-4ff5-be45-49887e7b2d33',
    '/product/trousers',
    '/product/5a4611ce-147f-413c-9cc5-84b5cfc1932d',
    '/product/another-product',
    '/product/123',
    // 👈 Just paste more product links here
  ]

  return [...staticRoutes, ...productRoutes].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '/' ? 'daily' : 'weekly',
    priority: route === '/' ? 1.0 : 0.7,
  }))
}
