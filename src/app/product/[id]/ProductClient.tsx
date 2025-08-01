// app/product/[id]/ProductClient.tsx
"use client";
import ProductReviews from "../../components/ProductReviews";
import { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { urlFor } from "@/sanity/lib/image";
import { CartItem } from "../../components/Interface";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
} from "lucide-react";
import { useCart } from "../../components/CartContext";
import { toast } from "sonner";
import { useTheme } from "../../components/theme-context";

// Types (unchanged)
interface ProductImage {
  _key: string;
  asset: { _ref: string; _type: string };
  alt: string;
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
}

interface RelatedProduct {
  _id: string;
  name: string;
  slug: { current: string };
  price: number;
  images: ProductImage[];
  onSale: boolean;
  newArrival: boolean;
}

interface Props {
  product: Product;
  relatedProducts: RelatedProduct[];
}

export default function ProductClient({ product, relatedProducts }: Props) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const { addToCart, cartQuantity } = useCart();
  const router = useRouter();
  useTheme(); // Keep theme context

  const currentImage = useMemo(() => product.images[selectedImageIndex], [product.images, selectedImageIndex]);
  const subtotal = useMemo(() => product.price * quantity, [product.price, quantity]);

  const isSizeRequired = product.sizes && product.sizes.length > 0;
  const isColorRequired = product.colors && product.colors.length > 0;
  const isSelectionComplete = (!isSizeRequired || selectedSize) && (!isColorRequired || selectedColor);

  const handleAddToCart = useCallback(async () => {
    if (!isSelectionComplete) return;
    setIsAddingToCart(true);

    const cartItem: CartItem = {
      _id: product._id,
      name: product.name,
      price: product.price,
      selectedSize: selectedSize || undefined,
      selectedColor: selectedColor || undefined,
      quantity,
      imageUrl: product.images[0] ? urlFor(product.images[0]).url() : undefined,
      timestamp: Date.now(),
      description: product.description,
      slug: product.slug,
    };

    try {
      addToCart(cartItem);
      toast.success(`Added ${quantity} item${quantity > 1 ? "s" : ""} to cart successfully! 🛒`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    } finally {
      setIsAddingToCart(false);
    }
  }, [product, selectedSize, selectedColor, quantity, addToCart, isSelectionComplete]);

  const handleBuyNow = useCallback(() => {
    if (!isSelectionComplete) return;

    const buyNowItem: CartItem = {
      _id: product._id,
      name: product.name,
      price: product.price,
      selectedSize: selectedSize || undefined,
      selectedColor: selectedColor || undefined,
      quantity,
      imageUrl: product.images[0] ? urlFor(product.images[0]).url() : undefined,
      timestamp: Date.now(),
      description: product.description,
      slug: product.slug,
    };

    sessionStorage.setItem("buyNowItem", JSON.stringify(buyNowItem));
    router.push("/checkout?buyNow=true");
  }, [product, selectedSize, selectedColor, quantity, router, isSelectionComplete]);

  const handleShare = useCallback(async () => {
    const shareData = {
      title: product.name,
      text: `Check out this amazing product: ${product.name}`,
      url: window.location.href,
    };

    try {
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
        toast.success("Product shared successfully!");
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Product link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast.error("Failed to share product");
    }
  }, [product.name]);

  const handleViewCart = useCallback(() => {
    router.push("/cart");
  }, [router]);

  const handleImageNavigation = useCallback(
    (direction: "prev" | "next") => {
      setSelectedImageIndex((prev) =>
        direction === "prev"
          ? prev === 0
            ? product.images.length - 1
            : prev - 1
          : prev === product.images.length - 1
          ? 0
          : prev + 1
      );
    },
    [product.images.length]
  );

  const adjustQuantity = useCallback((delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  }, []);

  // JSX remains unchanged (omitted for brevity, no design changes)
  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="mb-8" aria-label="Breadcrumb">
          <div className="flex items-center space-x-2 text-sm font-medium">
            <Link href="/" className="text-black hover:text-blue-500 dark:text-white dark:hover:text-[#a90068] transition-colors">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 text-black dark:text-white" />
            <Link href="/products" className="text-black hover:text-blue-500 dark:text-white dark:hover:text-[#a90068] transition-colors">
              Products
            </Link>
            <ChevronRight className="h-4 w-4 text-black dark:text-white" />
            <span className="text-black dark:text-white font-semibold">{product.name}</span>
          </div>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 xl:gap-16">
          <div className="space-y-6">
            <div className="group relative aspect-square overflow-hidden rounded-2xl shadow-lg border border-black/10 dark:border-white/10">
              {currentImage?.asset ? (
                <Image
                  src={urlFor(currentImage).url()}
                  alt={currentImage.alt || product.name}
                  fill
                  className="object-contain transition-transform duration-500 group-hover:scale-105 p-4"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-white dark:bg-black">
                  <div className="text-center">
                    <Eye className="h-16 w-16 text-black dark:text-white mx-auto mb-4" />
                    <p className="text-black dark:text-white">No Image Available</p>
                  </div>
                </div>
              )}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.newArrival && (
                  <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 shadow-lg">
                    <Zap className="h-3 w-3 mr-1" />
                    New
                  </Badge>
                )}
                {product.onSale && (
                  <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-lg">
                    Sale
                  </Badge>
                )}
              </div>
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => handleImageNavigation("prev")}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-black/90 hover:bg-white dark:hover:bg-black rounded-full p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5 text-black dark:text-white" />
                  </button>
                  <button
                    onClick={() => handleImageNavigation("next")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-black/90 hover:bg-white dark:hover:bg-black rounded-full p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5 text-black dark:text-white" />
                  </button>
                  <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {selectedImageIndex + 1} / {product.images.length}
                  </div>
                </>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={image._key}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                      selectedImageIndex === index
                        ? "border-blue-500 dark:border-[#a90068] shadow-md"
                        : "border-black/20 dark:border-white/20 hover:border-black/40 dark:hover:border-white/40"
                    }`}
                  >
                    {image.asset ? (
                      <Image
                        src={urlFor(image).url()}
                        alt={image.alt || `${product.name} ${index + 1}`}
                        fill
                        className="object-contain p-1"
                        sizes="(max-width: 1024px) 20vw, 10vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-white dark:bg-black">
                        <Eye className="h-6 w-6 text-black dark:text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                  <h1 className="text-3xl lg:text-4xl font-bold text-black dark:text-white leading-tight">{product.name}</h1>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < 4 ? "text-yellow-400 fill-current" : "text-black/30 dark:text-white/30"}`}
                        />
                      ))}
                      <span className="text-sm text-black dark:text-white ml-2">(124 reviews)</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Link href="/cart">
                    <Button
                      variant="outline"
                      size="icon"
                      className="relative rounded-full border-2 border-black/30 dark:border-white/30 hover:border-blue-500 dark:hover:border-[#a90068] transition-all hover:scale-105"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      {cartQuantity > 0 && (
                        <span className="absolute -top-2 -right-2 bg-blue-500 dark:bg-[#a90068] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                          {cartQuantity}
                        </span>
                      )}
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleShare}
                    className="rounded-full border-2 border-black/30 dark:border-white/30 hover:border-blue-500 dark:hover:border-[#a90068] transition-all hover:scale-105"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-black dark:text-white">${product.price}</span>
                  {product.onSale && (
                    <span className="text-xl font-semibold text-black/60 dark:text-white/60 line-through">
                      ${(product.price * 1.2).toFixed(2)}
                    </span>
                  )}
                </div>
                {product.categories && product.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {product.categories.map((category) => (
                      <Link
                        key={category._id}
                        href={`/category/${category.slug.current}`}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-black hover:bg-blue-100 dark:bg-[#a90068]/20 dark:text-white dark:hover:bg-[#a90068]/30 transition-all"
                      >
                        {category.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <Separator className="bg-black/20 dark:bg-white/20" />
            {product.description && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-black dark:text-white">Description</h3>
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <p
                    className={`text-black dark:text-white leading-relaxed ${
                      !showFullDescription && product.description.length > 200 ? "line-clamp-3" : ""
                    }`}
                  >
                    {product.description}
                  </p>
                  {product.description.length > 200 && (
                    <button
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      className="text-blue-600 dark:text-[#a90068] hover:underline font-medium mt-2 transition-colors"
                    >
                      {showFullDescription ? "Show Less" : "Read More"}
                    </button>
                  )}
                </div>
              </div>
            )}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-black dark:text-white">Size</h3>
                <div className="grid grid-cols-6 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`relative py-2 px-3 text-sm font-semibold rounded-lg border-2 transition-all ${
                        selectedSize === size
                          ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-[#a90068] dark:bg-[#a90068]/20 dark:text-[#a90068]"
                          : "border-black/30 dark:border-white/30 hover:border-black/50 dark:hover:border-white/50 text-black dark:text-white"
                      }`}
                    >
                      {size}
                      {selectedSize === size && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 dark:bg-[#a90068] rounded-full flex items-center justify-center">
                          <Check className="h-2 w-2 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-black dark:text-white">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`relative py-2 px-4 text-sm font-semibold rounded-lg border-2 transition-all capitalize ${
                        selectedColor === color
                          ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-[#a90068] dark:bg-[#a90068]/20 dark:text-[#a90068]"
                          : "border-black/30 dark:border-white/30 hover:border-black/50 dark:hover:border-white/50 text-black dark:text-white"
                      }`}
                    >
                      {color}
                      {selectedColor === color && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 dark:bg-[#a90068] rounded-full flex items-center justify-center">
                          <Check className="h-2 w-2 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-black dark:text-white">Quantity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-black/30 dark:border-white/30 rounded-lg overflow-hidden">
                  <button
                    onClick={() => adjustQuantity(-1)}
                    className="px-3 py-2 text-black dark:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 text-lg font-semibold text-black dark:text-white border-x-2 border-black/30 dark:border-white/30 min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => adjustQuantity(1)}
                    className="px-3 py-2 text-black dark:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="text-sm text-black dark:text-white">
                  <span className="text-green-600 dark:text-green-400 font-medium">✓ In Stock</span>
                  <br />
                  Ready to ship
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <Button
                onClick={handleAddToCart}
                disabled={!isSelectionComplete || isAddingToCart}
                className="w-full py-3 text-lg font-semibold bg-blue-600 hover:bg-blue-700 dark:bg-[#a90068] dark:hover:bg-[#8a0055] text-white border-0 rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAddingToCart ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Adding...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Add to Cart - ${subtotal.toFixed(2)}
                  </div>
                )}
              </Button>
              <Button
                onClick={handleViewCart}
                variant="outline"
                className="w-full py-3 text-lg font-semibold border-2 border-blue-600 text-black hover:bg-blue-50 dark:border-[#a90068] dark:text-white dark:hover:bg-[#a90068]/10 rounded-lg transition-all hover:scale-105"
              >
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  View Cart ({cartQuantity})
                </div>
              </Button>
              <Button
                onClick={handleBuyNow}
                disabled={!isSelectionComplete}
                className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white border-0 rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Buy Now
                </div>
              </Button>
            </div>
            <div className="border border-black/20 dark:border-white/20 rounded-lg p-4 space-y-3 bg-white/50 dark:bg-black/50">
              <h3 className="text-lg font-semibold text-black dark:text-white">Why Choose Us?</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Truck, title: "Free Shipping", desc: "On orders over $50" },
                  { icon: RotateCcw, title: "Easy Returns", desc: "30 day policy" },
                  { icon: Shield, title: "Secure Payment", desc: "Data protected" },
                  { icon: Headphones, title: "24/7 Support", desc: "Always available" },
                ].map(({ icon: Icon, title, desc }) => (
                  <div
                    key={title}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white dark:hover:bg-black transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-[#a90068]/20">
                      <Icon className="h-4 w-4 text-blue-600 dark:text-[#a90068]" />
                    </div>
                    <div>
                      <p className="font-semibold text-black dark:text-white text-sm">{title}</p>
                      <p className="text-xs text-black dark:text-white">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-black dark:text-white mb-2">You Might Also Like</h2>
              <p className="text-black dark:text-white">Discover more amazing products</p>
            </div>
            <div className="bg-white/50 dark:bg-black/50 p-6 rounded-2xl border border-black/20 dark:border-white/20">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {relatedProducts.map((relatedProduct) => (
                  <Link
                    key={relatedProduct._id}
                    href={`/product/${relatedProduct.slug.current}`}
                    className="group transform transition duration-300 hover:scale-105 hover:shadow-lg dark:hover:shadow-pink-500/20"
                  >
                    <div className="relative w-full aspect-[4/5] overflow-hidden bg-white dark:bg-gray-900">
                      {relatedProduct.images?.[0]?.asset ? (
                        <Image
                          src={urlFor(relatedProduct.images[0]).url()}
                          alt={relatedProduct.images[0].alt || relatedProduct.name}
                          fill
                          className="object-cover transition-opacity duration-300 group-hover:opacity-90"
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-base font-light bg-gray-100 dark:bg-gray-800">
                          No Image Available
                        </div>
                      )}
                      <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 sm:gap-2">
                        {relatedProduct.newArrival && (
                          <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 sm:px-3 py-1 text-xs sm:text-sm font-bold shadow-lg rounded-sm">
                            NEW
                          </span>
                        )}
                        {relatedProduct.onSale && (
                          <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 sm:px-3 py-1 text-xs sm:text-sm font-bold shadow-lg rounded-sm">
                            SALE
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="border border-blue-500 dark:border-[#a90068] bg-transparent p-2 text-center transition-all duration-300 group-hover:border-opacity-80">
                        <h4 className="text-sm sm:text-base md:text-lg text-black dark:text-white truncate font-light mb-1">
                          {relatedProduct.name}
                        </h4>
                        <p className="text-sm sm:text-base md:text-lg text-black dark:text-white font-light">
                          ${relatedProduct.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          
        )}
        <ProductReviews productId={product._id} productName={product.name} />
      </div>
    </div>
  );
}