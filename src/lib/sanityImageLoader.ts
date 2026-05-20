// ✅ Correct import
import type { ImageLoader } from 'next/image';

export const sanityLoader: ImageLoader = ({ src, width, quality }) => {
  const q = quality ?? 80;
  if (!src) return '';

  // Keep base and any existing query params separate
  const [base, existingQuery = ''] = src.split('?');
  const sep = existingQuery ? '&' : '?';

  // Ask Sanity CDN for the exact width & a transparent-safe, compressed format
  // (We keep any existing query params at the end just in case)
  return `${base}?w=${width}&q=${q}&fm=webp&fit=max&bg=transparent&auto=format${existingQuery ? `&${existingQuery}` : ''}`;
};
