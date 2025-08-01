// app/product/[id]/page.tsx
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import ProductClient from './ProductClient'

// TypeScript interfaces
interface ProductImage {
  _key: string
  asset: {
    _ref: string
    _type: string
  }
  alt: string
}

interface Category {
  _id: string
  title: string
  slug: {
    current: string
  }
}

interface Product {
  _id: string
  name: string
  slug: {
    current: string
  }
  price: number
  images: ProductImage[]
  description?: string
  onSale: boolean
  newArrival: boolean
  sizes?: string[]
  colors?: string[]
  categories?: Category[]
}

// GROQ query to fetch product by ID or slug
const productQuery = `*[_type == "product" && (_id == $id || slug.current == $id)][0] {
  _id,
  name,
  slug,
  price,
  images[]{
    _key,
    asset,
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
    slug
  }
}`

// Fetch product data
async function getProduct(id: string): Promise<Product | null> {
  try {
    const product = await client.fetch<Product>(productQuery, { id })
    return product
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

// Related products query
const relatedProductsQuery = `*[_type == "product" && _id != $id && slug.current != $slug && count(categories[@._ref in $categoryRefs]) > 0] | order(_createdAt desc)[0...4] {
    _id,
    name,
    slug,
    price,
    images[]{
      _key,
      asset,
      alt
    },
    onSale,
    newArrival
  }`

async function getRelatedProducts(id: string, slug: string, categoryRefs: string[]) {
  if (!categoryRefs || categoryRefs.length === 0) return []
  
  try {
    return await client.fetch(relatedProductsQuery, { id, slug, categoryRefs })
  } catch (error) {
    console.error('Error fetching related products:', error)
    return []
  }
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const resolvedParams = await params
  const product = await getProduct(resolvedParams.id)

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.',
    }
  }

  const firstImage = product.images?.[0]
  const imageUrl = firstImage ? urlFor(firstImage.asset).url() : null

  return {
    title: `${product.name} | Your Store`,
    description: product.description || `Shop ${product.name} for ${product.price}`,
    openGraph: {
      title: product.name,
      description: product.description || `Shop ${product.name} for ${product.price}`,
      images: imageUrl ? [{ url: imageUrl, alt: product.name }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description || `Shop ${product.name} for ${product.price}`,
      images: imageUrl ? [imageUrl] : [],
    },
  }
}

// Static params generation for build optimization
export async function generateStaticParams() {
  const products = await client.fetch<{ _id: string; slug: { current: string } }[]>(
    `*[_type == "product" && defined(slug.current)]{_id, slug}`
  )

  // Generate params for both ID and slug routes
  const params = []
  
  for (const product of products) {
    // Add ID-based route
    params.push({ id: product._id })
    
    // Add slug-based route if slug exists
    if (product.slug?.current) {
      params.push({ id: product.slug.current })
    }
  }

  return params
}

// Main page component
export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params
  const product = await getProduct(resolvedParams.id)

  if (!product) {
    notFound()
  }

  // Get related products
  const categoryRefs = product.categories?.map(cat => cat._id) || []
  const relatedProducts = await getRelatedProducts(
    resolvedParams.id, 
    product.slug?.current || '', 
    categoryRefs
  )

  return (
    <div className="min-h-screen">
      <ProductClient 
        product={product} 
        relatedProducts={relatedProducts}
      />
    </div>
  )
}