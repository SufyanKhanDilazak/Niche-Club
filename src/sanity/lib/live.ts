// src/sanity/lib/live.ts
import "server-only";
import type { QueryParams } from "next-sanity";
import { client } from "./client";

type SanityFetchArgs = {
  query: string;
  params?: QueryParams;
};

/**
 * Correct Sanity v4 / next-sanity v11 fetch helper
 * Fully type-safe, no overload errors
 */
export async function sanityFetch<T = unknown>({
  query,
  params,
}: SanityFetchArgs): Promise<T> {
  if (params) {
    return client.fetch<T>(query, params);
  }

  return client.fetch<T>(query);
}

/**
 * No-op live component (safe for prod)
 */
export function SanityLive() {
  return null;
}
