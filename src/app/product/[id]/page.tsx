import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import ProductClient from './ProductClient';

/* ---------- Types ---------- */
interface ProductImage {
  _key: string;
  asset: { _ref: string; _type: string } | null;
  alt?: string;
}
interface Category {
  _id: string;
  title: string;
  slug: { current: string };
}
interface Product {
  _id: string;
  name: string;
  slug: { current: string };
  price: number;
  images: ProductImage[];
  description?: string;
  onSale: boolean;
  newArrival: boolean;
  sizes?: string[];
  colors?: string[];
  categories?: Category[];
  outOfStock: boolean;
}
interface RelatedProduct {
  _id: string;
  name: string;
  slug: { current: string };
  price: number;
  images: ProductImage[];
  onSale: boolean;
  newArrival: boolean;
  outOfStock: boolean;
}

/* ---------- GROQ Queries ---------- */
const PRODUCT_QUERY = `*[_type=="product" && (_id==$id || slug.current==$id)][0]{_id,name,"slug":slug,price,"images":images[]{_key,asset,alt},description,onSale,newArrival,outOfStock,sizes,colors,"categories":categories[]->{_id,title,"slug":slug}}`;

const RELATED_PRODUCTS_QUERY = `*[_type=="product" && _id!=$id && count(categories[@._ref in $categoryRefs])>0][0...4]{_id,name,"slug":slug,price,"images":images[0...2]{_key,asset,alt},onSale,newArrival,outOfStock}`;

const STATIC_PARAMS_QUERY = `*[_type=="product" && defined(slug.current)]{_id,"slug":slug.current}`;

/* ---------- Fetch Helper with Timeout ---------- */
async function safeFetch<T>(query: string, params: any, timeoutMs = 8000): Promise<T | null> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const data = await client.fetch<T>(query, params, {
      next: { revalidate: 3600 },
      cache: 'force-cache',
      signal: controller.signal,
    });
    return data;
  } catch (err) {
    console.error('[Sanity Timeout or Fetch Error]:', err);
    return null;
  } finally {
    clearTimeout(id);
  }
}

/* ---------- Product Fetch ---------- */
async function getProduct(id: string): Promise<Product | null> {
  return await safeFetch<Product>(PRODUCT_QUERY, { id });
}

/* ---------- Related Fetch ---------- */
async function getRelatedProducts(id: string, categoryRefs: string[]): Promise<RelatedProduct[]> {
  if (!categoryRefs?.length) return [];
  const data = await safeFetch<RelatedProduct[]>(RELATED_PRODUCTS_QUERY, { id, categoryRefs }, 10000);
  return data ?? [];
}

/* ---------- Metadata ---------- */
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) {
    return { title: 'Product Not Found', description: 'This product is unavailable', robots: { index: false } };
  }

  const firstImage = product.images?.[0];
  const imageUrl = firstImage?.asset ? urlFor(firstImage).width(1200).height(630).url() : undefined;

  const desc = product.description?.slice(0, 150) ?? `Shop ${product.name} for $${product.price.toFixed(2)}.`;
  const title = `${product.name} | Niche Club`;

  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630 }] : [],
    },
    twitter: { card: 'summary_large_image', title, description: desc, images: imageUrl ? [imageUrl] : [] },
  };
}

/* ---------- Static Params ---------- */
export async function generateStaticParams() {
  try {
    const data = await safeFetch<Array<{ _id: string; slug: string }>>(STATIC_PARAMS_QUERY, {});
    if (!data) return [];
    const ids = new Set<string>();
    data.forEach((p) => {
      if (p._id) ids.add(p._id);
      if (p.slug) ids.add(p.slug);
    });
    return Array.from(ids).map((id) => ({ id }));
  } catch (err) {
    console.error('[generateStaticParams] Error:', err);
    return [];
  }
}

/* ---------- Page ---------- */
export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  const categoryRefs = product.categories?.map((c) => c._id).filter(Boolean) ?? [];
  const relatedProducts = await getRelatedProducts(product._id, categoryRefs);

  return (
    <div className="min-h-screen">
      <ProductClient product={product} relatedProducts={relatedProducts} />
    </div>
  );
}

/* ---------- Config ---------- */
export const dynamic = 'force-static';
export const revalidate = 3600;
