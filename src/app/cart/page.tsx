// app/cart/page.tsx
"use client";

import { useCart } from "../components/CartContext";
import { useTheme } from "../components/theme-context";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import type { CartItem } from "../components/Interface";
import { toast } from "sonner";

export default function CartPage() {
  const { cartItems, cartQuantity, addToCart, removeFromCart, clearCart } = useCart();
  const { isDarkMode } = useTheme();

  const [isHydrated, setIsHydrated] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const taxRatePercent = 8; // keep your 8% rule
  const tax = subtotal * (taxRatePercent / 100);
  const total = subtotal + shipping + tax;

  // ====== Checkout: DIRECT to Square (no /checkout page, no auth) ======
  const toSquareLine = useCallback((item: CartItem) => {
    return {
      _id: item._id,
      name: item.name,
      price: Number(item.price),
      quantity: Math.max(1, Number(item.quantity || 1)),
      selectedSize: item.selectedSize,
      selectedColor: item.selectedColor,
      imageUrl: item.imageUrl,
    };
  }, []);

  const handleCheckout = useCallback(async () => {
    if (!cartItems || cartItems.length === 0 || isRedirecting) return;

    try {
      setIsRedirecting(true);
      const items = cartItems.map(toSquareLine);

      const res = await fetch("/api/square/create-payment-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // IMPORTANT: send ORDER-level tax & shipping so item count stays correct
        body: JSON.stringify({
          items,
          taxRatePercent, // "8" -> order-level tax (does not add an item)
          shipping,       // fixed amount via service_charge (does not add an item)
        }),
      });

      const data = await res.json().catch(() => ({} as any));
      const url = data?.payment_link?.url || data?.url || data?.checkoutUrl;

      if (!res.ok || !url) {
        toast.error(data?.error || "Failed to create Square checkout link");
        setIsRedirecting(false);
        return;
      }

      window.location.href = url;
    } catch (err) {
      console.error(err);
      toast.error("Failed to create Square checkout link");
      setIsRedirecting(false);
    }
  }, [cartItems, isRedirecting, toSquareLine, taxRatePercent, shipping]);

  const handleIncrement = (item: (typeof cartItems)[0]) => {
    addToCart({ ...item, quantity: 1 });
  };

  const handleDecrement = (item: (typeof cartItems)[0]) => {
    removeFromCart(item._id, item.selectedSize, item.selectedColor);
  };

  const bgPrimary = isHydrated && isDarkMode ? "bg-black/80" : "bg-white/80";
  const bgSecondary = isHydrated && isDarkMode ? "bg-white/5" : "bg-black/5";
  const bgHover = isHydrated && isDarkMode ? "hover:bg-black/90" : "hover:bg-white/90";
  const bgHoverButton = isHydrated && isDarkMode ? "hover:bg-white/10" : "hover:bg-black/10";
  const textPrimary = isHydrated && isDarkMode ? "text-white" : "text-black";
  const textSecondary = isHydrated && isDarkMode ? "text-white/60" : "text-black/60";
  const textMuted = isHydrated && isDarkMode ? "text-white/50" : "text-black/50";
  const textSubtle = isHydrated && isDarkMode ? "text-white/70" : "text-black/70";
  const border = isHydrated && isDarkMode ? "border-white/10" : "border-black/10";
  const borderStrong = isHydrated && isDarkMode ? "border-white/20" : "border-black/20";
  const separator = isHydrated && isDarkMode ? "bg-white/20" : "bg-black/20";
  const primaryButton = isHydrated && isDarkMode ? "bg-[#a90068] hover:bg-[#8a0055]" : "bg-blue-500 hover:bg-blue-600";
  const outlineButton = isHydrated && isDarkMode
    ? "border-[#a90068] text-[#a90068] hover:bg-[#a90068]/10 hover:text-[#8a0055] hover:border-[#8a0055]"
    : "border-blue-300 text-blue-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-400";
  const shippingNotice = isHydrated && isDarkMode
    ? "bg-[#a90068]/10 border-[#a90068]/30 text-[#a90068]"
    : "bg-blue-50/80 border-blue-200/50 text-blue-700";
  const iconColor = isHydrated && isDarkMode ? "text-white/40" : "text-black/40";

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-16 sm:pt-20 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto py-16 text-center">
          <div className={`${bgPrimary} backdrop-blur-md rounded-lg ${border} p-8 sm:p-12`}>
            <div className={`w-24 h-24 mx-auto mb-6 ${bgSecondary} rounded-full flex items-center justify-center`}>
              <ShoppingBag className={`w-12 h-12 ${iconColor}`} />
            </div>
            <h1 className={`text-2xl sm:text-3xl font-bold mb-4 ${textPrimary}`}>Your Cart is Empty</h1>
            <p className={`${textSecondary} mb-8 text-sm sm:text-base max-w-md mx-auto`}>
              Looks like you haven&apos;t added anything to your cart yet. Start shopping to fill it up!
            </p>
            <Link href="/">
              <Button className={`${primaryButton} text-white px-6 py-3 text-sm sm:text-base transition-all duration-300 hover:scale-105`}>
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-20 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm mt-20">
      <div className="max-w-7xl mx-auto py-6 sm:py-8">
        <div className={`${bgPrimary} backdrop-blur-md rounded-lg ${border} p-4 sm:p-6 mb-6`}>
          <h1 className={`text-2xl sm:text-3xl font-bold ${textPrimary}`}>
            Shopping Cart
            <span className={`text-lg sm:text-xl font-normal ${textSecondary} ml-2`}>
              ({cartQuantity} {cartQuantity === 1 ? "item" : "items"})
            </span>
          </h1>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
          <div className="xl:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={`${item._id}-${item.selectedSize || "default"}-${item.selectedColor || "default"}`}
                className={`${bgPrimary} backdrop-blur-md p-4 sm:p-6 rounded-lg ${border} transition-all duration-300 hover:shadow-lg ${bgHover}`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {item.imageUrl && (
                    <div className={`relative h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 overflow-hidden rounded-lg border ${borderStrong}`}>
                      <Image
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.name || "Product image"}
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-105"
                        sizes="(max-width: 640px) 80px, 96px"
                      />
                    </div>
                  )}
                  <div className="flex-grow min-w-0 w-full sm:w-auto">
                    <h3 className={`text-base sm:text-lg font-semibold ${textPrimary} truncate mb-1`}>{item.name}</h3>
                    <div className={`flex flex-wrap gap-x-4 gap-y-1 text-xs sm:text-sm ${textMuted} mb-2`}>
                      {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                      {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                    </div>
                    <p className={`text-base sm:text-lg font-semibold ${textPrimary}`}>${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-2 w-full sm:w-auto justify-between sm:justify-end">
                    <div className={`flex items-center gap-1 ${bgSecondary} backdrop-blur-sm rounded-lg border ${border}`}>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className={`h-8 w-8 p-0 ${bgHoverButton} ${textPrimary}`}
                        onClick={() => handleDecrement(item)}
                      >
                        <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                      <span className={`w-8 text-center text-sm font-medium ${textPrimary}`}>{item.quantity}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className={`h-8 w-8 p-0 ${bgHoverButton} ${textPrimary}`}
                        onClick={() => handleIncrement(item)}
                      >
                        <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                    <p className={`text-sm sm:text-base font-semibold ${textPrimary}`}>${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
            <div className={`${bgPrimary} backdrop-blur-md rounded-lg ${border} p-4 sm:p-6`}>
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <Button
                  onClick={clearCart}
                  variant="outline"
                  className={`flex items-center gap-2 text-red-600 hover:text-red-700 border-red-300 hover:border-red-400 ${
                    isHydrated && isDarkMode ? "dark:text-red-400 dark:hover:text-red-300 dark:border-red-600 dark:hover:border-red-500" : ""
                  } ${isHydrated && isDarkMode ? "bg-black/50" : "bg-white/50"} backdrop-blur-sm w-full sm:w-auto hover:bg-red-50 ${
                    isHydrated && isDarkMode ? "dark:hover:bg-red-950/20" : ""
                  } transition-all duration-300`}
                >
                  <Trash2 className="h-4 w-4" />
                  Clear Cart
                </Button>
                <Link href="/categories/all_products" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    className={`w-full ${isHydrated && isDarkMode ? "bg-black/50" : "bg-white/50"} backdrop-blur-sm ${outlineButton} transition-all duration-300`}
                  >
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className={`${bgPrimary} backdrop-blur-md p-4 sm:p-6 rounded-lg ${border} h-fit sticky top-24`}>
            <h2 className={`text-lg sm:text-xl font-semibold mb-4 ${textPrimary}`}>Order Summary</h2>
            <div className="space-y-3">
              <div className={`flex justify-between text-sm sm:text-base ${textSubtle}`}>
                <span>Subtotal ({cartQuantity} {cartQuantity === 1 ? "item" : "items"})</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className={`flex justify-between text-sm sm:text-base ${textSubtle}`}>
                <span>Shipping</span>
                <span className={shipping === 0 ? `${isHydrated && isDarkMode ? "text-green-400" : "text-green-600"} font-medium` : ""}>
                  {shipping === 0 ? "Free" : `${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className={`flex justify-between text-sm sm:text-base ${textSubtle}`}>
                <span>Tax ({taxRatePercent}%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <Separator className={`my-4 ${separator}`} />
              <div className={`flex justify-between text-lg sm:text-xl font-semibold ${textPrimary}`}>
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            {subtotal < 100 && (
              <div className={`mt-4 p-3 ${shippingNotice} backdrop-blur-sm rounded-lg border`}>
                <p className="text-xs sm:text-sm text-center">
                  💰 Add <span className="font-semibold">${(100 - subtotal).toFixed(2)}</span> more for free shipping!
                </p>
              </div>
            )}
            <Button
              onClick={handleCheckout}
              disabled={cartItems.length === 0 || isRedirecting}
              className={`w-full mt-6 ${primaryButton} text-white py-3 text-sm sm:text-base font-medium transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50`}
            >
              {isRedirecting ? "Redirecting…" : "Proceed to Checkout"}
            </Button>
            <div className="mt-4 text-center">
              <p className={`text-xs ${textMuted}`}>🔒 Secure checkout powered by SSL encryption</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
