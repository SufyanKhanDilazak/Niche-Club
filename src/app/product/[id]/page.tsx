// app/product/[id]/page.tsx
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import ProductClient from './ProductClient'

// ================== Types (match ProductClient) ==================
interface ProductImage {
  _key: string
  asset: { _ref: string; _type: string }
  alt: string
}

interface Category {
  _id: string
  title: string
  slug: { current: string }
}

interface Product {
  _id: string
  name: string
  slug: { current: string }
  price: number
  images: ProductImage[]
  description?: string
  onSale: boolean
  newArrival: boolean
  sizes?: string[]
  colors?: string[]
  categories?: Category[]
}

// ================== GROQ ==================
const productQuery = `*[_type == "product" && (_id == $id || slug.current == $id)][0]{
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

const relatedProductsQuery = `*[_type == "product"
  && _id != $id
  && slug.current != $slug
  && count(categories[@._ref in $categoryRefs]) > 0
] | order(_createdAt desc)[0...4]{
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

// ================== Data helpers ==================
async function getProduct(id: string): Promise<Product | null> {
  try {
    const product = await client.fetch<Product>(productQuery, { id })
    return product ?? null
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

async function getRelatedProducts(id: string, slug: string, categoryRefs: string[]) {
  if (!Array.isArray(categoryRefs) || categoryRefs.length === 0) return []
  try {
    return await client.fetch(relatedProductsQuery, { id, slug, categoryRefs })
  } catch (error) {
    console.error('Error fetching related products:', error)
    return []
  }
}

// ================== Metadata (await params + guard) ==================
export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.',
    }
  }

  const firstImage = product.images?.[0]
  const imageUrl = firstImage?.asset
    ? urlFor(firstImage).width(1200).height(630).fit('crop').url()
    : undefined

  const desc = product.description ?? `Shop ${product.name} for ${product.price}`

  return {
    title: `${product.name} | Your Store`,
    description: desc,
    openGraph: {
      title: product.name,
      description: desc,
      images: imageUrl ? [{ url: imageUrl, alt: product.name }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: desc,
      images: imageUrl ? [imageUrl] : [],
    },
  }
}

// ================== SSG params (unchanged) ==================
export async function generateStaticParams() {
  const products = await client.fetch<{ _id: string; slug?: { current?: string } }[]>(
    `*[_type == "product" && defined(slug.current)]{ _id, slug }`
  )

  const params: { id: string }[] = []
  for (const p of products) {
    if (p?._id) params.push({ id: p._id })
    const slug = p?.slug?.current
    if (slug) params.push({ id: slug })
  }
  return params
}

// ================== Page (await params) ==================
export default async function ProductPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const product = await getProduct(id)
  if (!product) {
    notFound()
  }

  const categoryRefs = product.categories?.map(cat => cat._id).filter(Boolean) ?? []
  const relatedProducts = await getRelatedProducts(
    product._id,
    product.slug.current,
    categoryRefs
  )

  return (
    <div className="min-h-screen">
      <ProductClient product={product} relatedProducts={relatedProducts} />
    </div>
  )
}
