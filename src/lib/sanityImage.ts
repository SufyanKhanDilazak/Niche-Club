import imageUrlBuilder from '@sanity/image-url';
import { client } from '@/sanity/lib/client';
import type { Image as SanityImageSource } from 'sanity';

const builder = imageUrlBuilder(client);

/** Returns an absolute https://cdn.sanity.io/... URL */
export function urlFor(source: SanityImageSource | any): string {
  try {
    return builder.image(source).auto('format').fit('max').url();
  } catch {
    return '';
  }
}
