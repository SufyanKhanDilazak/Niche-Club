// app/product/[id]/ProductClient.tsx
'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { urlFor } from '@/sanity/lib/image';
import { CartItem } from '../../components/Interface';
import { useCart } from '../../components/CartContext';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { fbq } from '../../../lib/fbq';

import {
  Star,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  Headphones,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Check,
  ShoppingCart,
  Eye,
  Zap,
  ShoppingBag,
} from 'lucide-react';
import { toast } from 'sonner';

/* ✅ Reviews generator (make sure filename matches exactly: samplereviews.ts) */
import { generateSampleReviewsForProduct, type Review } from '../../../lib/reviews/samplereviews';

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
interface Props {
  product: Product;
  relatedProducts: RelatedProduct[];
}

/* ---------- Component ---------- */
export default function ProductClient({ product, relatedProducts }: Props) {
  useEffect(() => {
    fbq('track', 'ViewContent', {
      content_ids: [product._id],
      content_name: product.name,
      value: product.price,
      currency: 'USD',
    });
  }, [product]);

  const router = useRouter();
  const { addToCart, cartQuantity } = useCart();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  /* ✅ Reviews UI state */
  const [reviewFilter, setReviewFilter] = useState<'all' | 5 | 4 | 3 | 2 | 1>('all');
  const [showAllReviews, setShowAllReviews] = useState(false);

  const currentImage = useMemo(
    () => product.images[selectedImageIndex],
    [product.images, selectedImageIndex]
  );

  const firstImageUrl = useMemo(
    () => (product.images[0]?.asset ? urlFor(product.images[0]).url() : undefined),
    [product.images]
  );

  const subtotal = useMemo(() => product.price * quantity, [product.price, quantity]);
  const isSizeRequired = !!(product.sizes?.length);
  const isColorRequired = !!(product.colors?.length);
  const isSelectionComplete =
    !product.outOfStock &&
    (!isSizeRequired || !!selectedSize) &&
    (!isColorRequired || !!selectedColor);

  /* ✅ IMPORTANT CHANGE:
     - Do NOT generate 600 per product.
     - Use the pool-based generator: each product gets 11..30 reviews (varies by slug)
  */
  const sampleReviews = useMemo<Review[]>(() => {
    const productKey = product.slug?.current || product._id || product.name;

    return generateSampleReviewsForProduct({
      productKey,
      sizes: product.sizes ?? [],
      colors: product.colors ?? [],
    });
  }, [product.slug?.current, product._id, product.name, product.sizes, product.colors]);

  /* ✅ Stats (from whatever count the product gets) */
  const reviewStats = useMemo(() => {
    const total = sampleReviews.length;
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<1 | 2 | 3 | 4 | 5, number>;
    let sum = 0;

    for (const r of sampleReviews) {
      counts[r.rating] += 1;
      sum += r.rating;
    }

    const avg = total ? sum / total : 0;
    return { total, avg, counts };
  }, [sampleReviews]);

  const filteredReviews = useMemo(() => {
    if (reviewFilter === 'all') return sampleReviews;
    return sampleReviews.filter((r) => r.rating === reviewFilter);
  }, [sampleReviews, reviewFilter]);

  const visibleReviews = useMemo(() => {
    // show 10 by default, expand to all
    return showAllReviews ? filteredReviews : filteredReviews.slice(0, 10);
  }, [filteredReviews, showAllReviews]);

  const formatDate = useCallback((iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  }, []);

  /* ---------- Cart: Add ---------- */
  const buildCartItem = useCallback((): CartItem => {
    return {
      _id: product._id,
      name: product.name,
      price: product.price,
      selectedSize: selectedSize || undefined,
      selectedColor: selectedColor || undefined,
      quantity,
      imageUrl: firstImageUrl,
      timestamp: Date.now(),
      description: product.description,
      slug: product.slug,
    };
  }, [product, selectedSize, selectedColor, quantity, firstImageUrl]);

  const handleAddToCart = useCallback(async () => {
    fbq('track', 'AddToCart', {
      content_ids: [product._id],
      content_name: product.name,
      value: product.price,
      currency: 'USD',
    });

    if (!isSelectionComplete || product.outOfStock) return;
    setIsAddingToCart(true);
    try {
      addToCart(buildCartItem());
      toast.success(`Added ${quantity} item${quantity > 1 ? 's' : ''} to cart! 🛒`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  }, [isSelectionComplete, addToCart, buildCartItem, quantity, product]);

  /* ---------- Buy Now → View Cart (no Square here) ---------- */
  const handleBuyNow = useCallback(() => {
    if (!isSelectionComplete || product.outOfStock) {
      toast.error(product.outOfStock ? 'Product is out of stock' : 'Please select required options');
      return;
    }
    try {
      addToCart(buildCartItem());
      router.push('/cart');
    } catch (err) {
      console.error(err);
      toast.error('Could not proceed to cart. Please try again.');
    }
  }, [isSelectionComplete, addToCart, buildCartItem, router, product.outOfStock]);

  const handleShare = useCallback(async () => {
    const shareData = {
      title: product.name,
      text: `Check out this product: ${product.name}`,
      url: window.location.href,
    };
    try {
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
      }
      toast.success('Link copied!');
    } catch {
      toast.error('Share failed');
    }
  }, [product.name]);

  const adjustQuantity = useCallback((delta: number) => setQuantity((p) => Math.max(1, p + delta)), []);

  const handleImageNavigation = useCallback(
    (dir: 'prev' | 'next') => {
      setSelectedImageIndex((prev) =>
        dir === 'prev'
          ? (prev - 1 + product.images.length) % product.images.length
          : (prev + 1) % product.images.length
      );
    },
    [product.images.length]
  );

  const handleViewCart = useCallback(() => {
    router.push('/cart');
  }, [router]);

  /* ---------- Render ---------- */
  return (
    <div className="min-h-screen pt-32 pb-16 text-black dark:text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm font-medium">
            <Link href="/" className="text-black hover:text-blue-500 dark:text-white dark:hover:text-[#a90068]">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 text-black dark:text-white" />
            <Link href="/products" className="text-black hover:text-blue-500 dark:text-white dark:hover:text-[#a90068]">
              Products
            </Link>
            <ChevronRight className="h-4 w-4 text-black dark:text-white" />
            <span className="font-semibold text-black dark:text-white">{product.name}</span>
          </div>
        </nav>

        {/* Grid */}
        <div className="grid gap-12 lg:grid-cols-2 xl:gap-16">
          {/* Image column */}
          <div className="space-y-6">
            <div className="group relative aspect-square overflow-hidden rounded-2xl border border-black/10 shadow-lg dark:border-white/10">
              {currentImage?.asset ? (
                <Image
                  src={urlFor(currentImage).url()}
                  alt={currentImage.alt || product.name}
                  fill
                  priority
                  sizes="(max-width:1024px)100vw,50vw"
                  quality={85}
                  className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Eye className="h-10 w-10 text-black dark:text-white" />
                </div>
              )}

              {/* Flags */}
              <div className="absolute left-4 top-4 flex flex-col gap-2">
                {product.outOfStock && (
                  <Badge className="border-0 bg-gradient-to-r from-gray-600 to-gray-800 text-white shadow-lg">
                    Out of Stock
                  </Badge>
                )}
                {product.newArrival && (
                  <Badge className="border-0 bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg">
                    <Zap className="mr-1 h-3 w-3" />
                    New
                  </Badge>
                )}
                {product.onSale && (
                  <Badge className="border-0 bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg">
                    Sale
                  </Badge>
                )}
              </div>

              {/* Gallery controls */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => handleImageNavigation('prev')}
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/70 p-3 text-white opacity-0 transition-opacity hover:bg-black/80 group-hover:opacity-100"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleImageNavigation('next')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/70 p-3 text-white opacity-0 transition-opacity hover:bg-black/80 group-hover:opacity-100"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <div className="absolute bottom-4 right-4 rounded-full bg-black/70 px-3 py-1 text-sm font-medium text-white">
                    {selectedImageIndex + 1} / {product.images.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5">
                {product.images.map((img, idx) => (
                  <button
                    key={img._key}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                      selectedImageIndex === idx
                        ? 'border-blue-500 shadow-md dark:border-[#a90068]'
                        : 'border-black/20 hover:border-black/40 dark:border-white/20 dark:hover:border-white/40'
                    }`}
                    aria-label={`Select image ${idx + 1}`}
                  >
                    {img.asset ? (
                      <Image
                        src={urlFor(img).url()}
                        alt={img.alt || `${product.name} ${idx + 1}`}
                        fill
                        sizes="20vw"
                        className="object-contain p-1"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Eye className="h-6 w-6 text-black dark:text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details column */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <h1 className="text-3xl font-bold leading-tight text-black dark:text-white lg:text-4xl">
                    {product.name}
                  </h1>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.round(reviewStats.avg || 4)
                              ? 'fill-current text-yellow-400'
                              : 'text-black/30 dark:text-white/30'
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-black dark:text-white">
                        ({reviewStats.total.toLocaleString()} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="ml-4 flex items-center gap-2">
                  <Link href="/cart" aria-label="Open cart">
                    <Button
                      variant="outline"
                      size="icon"
                      className="relative rounded-full border-2 border-black/30 transition-all hover:scale-105 hover:border-blue-500 dark:border-white/30 dark:hover:border-[#a90068]"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      {cartQuantity > 0 && (
                        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white dark:bg-[#a90068]">
                          {cartQuantity}
                        </span>
                      )}
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleShare}
                    aria-label="Share product"
                    className="rounded-full border-2 border-black/30 transition-all hover:scale-105 hover:border-blue-500 dark:border-white/30 dark:hover:border-[#a90068]"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Price + categories */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-black dark:text-white">${product.price}</span>
                  {product.onSale && (
                    <span className="text-xl font-semibold text-black/60 line-through dark:text-white/60">
                      ${(product.price * 1.2).toFixed(2)}
                    </span>
                  )}
                </div>

                {!!product.categories?.length && (
                  <div className="flex flex-wrap gap-2">
                    {product.categories.map((category) => (
                      <Link
                        key={category._id}
                        href={`/category/${category.slug.current}`}
                        className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-[#3b82f6] transition-all hover:bg-blue-100 dark:bg-[#a90068]/20 dark:text-white dark:hover:bg-[#a90068]/30"
                      >
                        {category.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <Separator className="bg-black/20 dark:bg-white/20" />

            {/* Description */}
            {!!product.description && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-black dark:text-white">Description</h3>
                <div className="prose prose-gray max-w-none dark:prose-invert">
                  <p
                    className={`leading-relaxed text-black dark:text-white ${
                      !showFullDescription && product.description.length > 200 ? 'line-clamp-3' : ''
                    }`}
                  >
                    {product.description}
                  </p>
                  {product.description.length > 200 && (
                    <button
                      onClick={() => setShowFullDescription((v) => !v)}
                      className="mt-2 font-medium text-blue-600 transition-colors hover:underline dark:text-[#a90068]"
                    >
                      {showFullDescription ? 'Show Less' : 'Read More'}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Sizes */}
            {!!product.sizes?.length && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-black dark:text-white">Size</h3>
                <div className="grid grid-cols-6 gap-2">
                  {product.sizes.map((size) => {
                    const selected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`relative rounded-lg border-2 px-3 py-2 text-sm font-semibold transition-all ${
                          selected
                            ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-[#a90068] dark:bg-[#a90068]/20 dark:text-[#a90068]'
                            : 'border-black/30 text-black hover:border-black/50 dark:border-white/30 dark:text-white dark:hover:border-white/50'
                        }`}
                      >
                        {size}
                        {selected && (
                          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 dark:bg-[#a90068]">
                            <Check className="h-2 w-2 text-white" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Colors */}
            {!!product.colors?.length && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-black dark:text-white">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => {
                    const selected = selectedColor === color;
                    return (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`relative rounded-lg border-2 px-4 py-2 text-sm font-semibold capitalize transition-all ${
                          selected
                            ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-[#a90068] dark:bg-[#a90068]/20 dark:text-[#a90068]'
                            : 'border-black/30 text-black hover:border-black/50 dark:border-white/30 dark:text-white dark:hover:border-white/50'
                        }`}
                      >
                        {color}
                        {selected && (
                          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 dark:bg-[#a90068]">
                            <Check className="h-2 w-2 text-white" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-black dark:text-white">Quantity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center overflow-hidden rounded-lg border-2 border-black/30 dark:border-white/30">
                  <button
                    onClick={() => adjustQuantity(-1)}
                    className="px-3 py-2 text-black transition-colors hover:bg-black/10 dark:text-white dark:hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Decrease quantity"
                    disabled={quantity <= 1 || product.outOfStock}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="min-w-[3rem] border-x-2 border-black/30 px-4 py-2 text-center text-lg font-semibold text-black dark:border-white/30 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => adjustQuantity(1)}
                    className="px-3 py-2 text-black transition-colors hover:bg-black/10 dark:text-white dark:hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Increase quantity"
                    disabled={product.outOfStock}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <div className="text-sm text-black dark:text-white">
                  {product.outOfStock ? (
                    <>
                      <span className="font-medium text-red-600 dark:text-red-400">✗ Out of Stock</span>
                      <br />
                      Currently unavailable
                    </>
                  ) : (
                    <>
                      <span className="font-medium text-green-600 dark:text-green-400">✓ In Stock</span>
                      <br />
                      Ready to ship
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                onClick={handleAddToCart}
                disabled={!isSelectionComplete || isAddingToCart || product.outOfStock}
                className="..."
              >
                {isAddingToCart ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Adding...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Add to Cart - ${subtotal.toFixed(2)}
                  </span>
                )}
              </Button>

              {/* View Cart */}
              <Button
                onClick={handleViewCart}
                variant="outline"
                className="w-full rounded-lg border-2 border-blue-600 py-3 text-lg font-semibold transition-all hover:scale-105 hover:bg-blue-50 dark:border-[#a90068] dark:text-white dark:hover:bg-[#a90068]/10"
              >
                <span className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  View Cart ({cartQuantity})
                </span>
              </Button>

              {/* Buy Now -> go to Cart (then proceed to checkout from there) */}
              <Button onClick={handleBuyNow} disabled={!isSelectionComplete || product.outOfStock} className="...">
                <span className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  {product.outOfStock ? 'Out of Stock' : 'Buy Now'}
                </span>
              </Button>
            </div>

            {/* Why us */}
            <div className="rounded-lg border border-black/20 p-4 backdrop-blur-sm dark:border-white/20">
              <h3 className="text-lg font-semibold text-black dark:text-white">Why Choose Us?</h3>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {[
                  { icon: Truck, title: 'Free Shipping', desc: 'On orders over $50' },
                  { icon: RotateCcw, title: 'Easy Returns', desc: '30 day policy' },
                  { icon: Shield, title: 'Secure Payment', desc: 'Data protected' },
                  { icon: Headphones, title: '24/7 Support', desc: 'Always available' },
                ].map(({ icon: Icon, title, desc }) => (
                  <div
                    key={title}
                    className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <div className="rounded-lg bg-blue-100 p-2 dark:bg-[#a90068]/20">
                      <Icon className="h-4 w-4 text-blue-600 dark:text-[#a90068]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-black dark:text-white">{title}</p>
                      <p className="text-xs text-black dark:text-white">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Reviews Section (sample/demo) */}
        <div className="mt-16">
          <div className="rounded-2xl border border-black/20 p-6 backdrop-blur-sm dark:border-white/20">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-black dark:text-white">Reviews</h2>
                  {/* ✅ recommended label */}
                  <span className="rounded-full border border-black/15 px-2 py-1 text-xs font-semibold text-black/70 dark:border-white/15 dark:text-white/70">
                    Sample
                  </span>
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.round(reviewStats.avg || 0)
                            ? 'fill-current text-yellow-400'
                            : 'text-black/20 dark:text-white/20'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-black/70 dark:text-white/70">
                    {reviewStats.avg ? reviewStats.avg.toFixed(1) : '0.0'} · {reviewStats.total.toLocaleString()} total
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {(['all', 5, 4, 3, 2, 1] as const).map((k) => {
                  const active = reviewFilter === k;
                  const label = k === 'all' ? 'All' : `${k}★`;
                  return (
                    <button
                      key={String(k)}
                      onClick={() => {
                        setReviewFilter(k);
                        setShowAllReviews(false);
                      }}
                      className={`rounded-full border px-3 py-1 text-sm font-semibold transition-all ${
                        active
                          ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-[#a90068] dark:bg-[#a90068]/20 dark:text-white'
                          : 'border-black/20 text-black hover:border-black/40 dark:border-white/20 dark:text-white dark:hover:border-white/40'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <Separator className="my-6 bg-black/20 dark:bg-white/20" />

            <div className="grid gap-4 md:grid-cols-2">
              {visibleReviews.map((r) => {
                const metaParts = [
                  r.sizeBought ? `Size: ${r.sizeBought}` : null,
                  r.colorBought ? `Color: ${r.colorBought}` : null,
                  r.fit ? `Fit: ${r.fit}` : null,
                ].filter(Boolean);

                return (
                  <div key={r.id} className="rounded-xl border border-black/15 p-4 dark:border-white/15">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-black dark:text-white">{r.name}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < r.rating ? 'fill-current text-yellow-400' : 'text-black/20 dark:text-white/20'
                                }`}
                              />
                            ))}
                          </div>
                          {r.verified && (
                            <span className="text-xs font-semibold text-green-700 dark:text-green-400">✓ Verified</span>
                          )}
                        </div>
                      </div>

                      <span className="text-xs text-black/60 dark:text-white/60">{formatDate(r.createdAt)}</span>
                    </div>

                    <p className="mt-3 text-sm font-semibold text-black dark:text-white">{r.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-black/80 dark:text-white/80">{r.body}</p>

                    {metaParts.length > 0 && (
                      <p className="mt-3 text-xs text-black/60 dark:text-white/60">{metaParts.join(' · ')}</p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex items-center justify-center">
              {filteredReviews.length > 10 && (
                <Button
                  variant="outline"
                  onClick={() => setShowAllReviews((v) => !v)}
                  className="rounded-full border-2 border-black/20 px-6 dark:border-white/20"
                >
                  {showAllReviews ? 'Show Less' : `Show All (${filteredReviews.length.toLocaleString()})`}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="mb-8 text-center">
              <h2 className="mb-2 text-2xl font-bold text-black dark:text-white">You Might Also Like</h2>
              <p className="text-black dark:text-white">Discover more amazing products</p>
            </div>

            <div className="rounded-2xl border border-black/20 p-6 backdrop-blur-sm dark:border-white/20">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {relatedProducts.map((rp) => {
                  const rpImg = rp.images?.[0];
                  const rpUrl = rpImg?.asset ? urlFor(rpImg).url() : undefined;

                  return (
                    <Link
                      key={rp._id}
                      href={`/product/${rp.slug.current}`}
                      className="group transition duration-300 hover:scale-[1.02]"
                    >
                      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg border border-black/15 dark:border-white/15">
                        {rpUrl ? (
                          <Image
                            src={rpUrl}
                            alt={rpImg?.alt || rp.name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            quality={85}
                            className="object-cover transition-opacity duration-300 group-hover:opacity-90"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <Eye className="h-6 w-6 text-black dark:text-white" />
                          </div>
                        )}

                        <div className="absolute left-2 top-2 flex flex-col gap-1">
                          {rp.outOfStock && (
                            <span className="rounded-sm bg-gradient-to-r from-gray-600 to-gray-800 px-2 py-1 text-xs font-bold text-white shadow">
                              OUT OF STOCK
                            </span>
                          )}
                          {rp.newArrival && (
                            <span className="rounded-sm bg-gradient-to-r from-green-500 to-emerald-500 px-2 py-1 text-xs font-bold text-white shadow">
                              NEW
                            </span>
                          )}
                          {rp.onSale && (
                            <span className="rounded-sm bg-gradient-to-r from-red-500 to-pink-500 px-2 py-1 text-xs font-bold text-white shadow">
                              SALE
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="border border-blue-500 p-2 text-center transition-all duration-300 group-hover:border-opacity-80 dark:border-[#a90068]">
                          <div className="text-black dark:text-white">
                            <h4 className="mb-1 truncate text-sm font-light sm:text-base md:text-lg">{rp.name}</h4>
                            <p className="text-sm font-light sm:text-base md:text-lg">${rp.price.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
