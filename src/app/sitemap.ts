// app/sitemap.ts
import type { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import groq from "groq";

// Must be a literal, not 60*60*24
export const revalidate = 86400; // 24h

const SITE = "https://nicheclub.us";

// Adjust if your schema differs
const PRODUCTS_QUERY = groq/* groq */ `
  *[_type == "product" && defined(slug.current)]{
    "slug": slug.current,
    "_updatedAt"
  } | order(_updatedAt desc)[0...5000]
`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE}/`,             lastModified: now, changeFrequency: "daily",   priority: 1.0 },
    { url: `${SITE}/about`,        lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE}/contact`,      lastModified: now, changeFrequency: "yearly",  priority: 0.4 },
    { url: `${SITE}/cookiepolicy`, lastModified: now, changeFrequency: "yearly",  priority: 0.2 },
    { url: `${SITE}/privacypolicy`,lastModified: now, changeFrequency: "yearly",  priority: 0.2 },
    { url: `${SITE}/categories/men_denim`,        lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE}/categories/men_essentials`,   lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE}/categories/men_tees`,         lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE}/categories/women_essentials`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE}/categories/women_tees`,       lastModified: now, changeFrequency: "weekly", priority: 0.6 },
  ];

  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const products: { slug: string; _updatedAt?: string }[] = await client.fetch(PRODUCTS_QUERY);
    productRoutes = products.map((p) => ({
      url: `${SITE}/product/${p.slug}`,
      lastModified: p._updatedAt ? new Date(p._updatedAt) : now,
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  } catch {
    // If Sanity is unreachable at build/edge, we still return static routes
  }

  return [...staticRoutes, ...productRoutes];
}
