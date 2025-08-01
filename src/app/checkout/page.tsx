// app/checkout/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useCart } from "../components/CartContext";
import { useTheme } from "../components/theme-context";
import { Button } from "@/components/ui/button";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { CartItem } from "../components/Interface";
import {
  CreditCard,
  ShieldCheck,
  Truck,
  AlertCircle,
  ArrowLeft,
  Lock,
  Package,
  MapPin,
  User,
  Mail,
  Phone,
  Minus,
  Plus,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
  const { cartItems, total } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);
  const [checkoutTotal, setCheckoutTotal] = useState(0);

  useEffect(() => {
    const isBuyNow = searchParams.get("buyNow") === "true";
    let itemsToProcess: CartItem[] = [];
    let totalToProcess = 0;

    if (isBuyNow) {
      const buyNowItemStr = sessionStorage.getItem("buyNowItem");
      if (buyNowItemStr) {
        const buyNowItem = JSON.parse(buyNowItemStr);
        itemsToProcess = [buyNowItem];
        const itemSubtotal = buyNowItem.price * buyNowItem.quantity;
        const itemShipping = itemSubtotal > 100 ? 0 : 10;
        const itemTax = itemSubtotal * 0.08;
        totalToProcess = itemSubtotal + itemShipping + itemTax;
      } else {
        router.push("/categories/all_product");
        return;
      }
    } else {
      if (cartItems.length === 0) {
        router.push("/cart");
        return;
      }
      itemsToProcess = cartItems;
      totalToProcess = total;
    }

    setCheckoutItems(itemsToProcess);
    setCheckoutTotal(totalToProcess);

    const fetchPaymentIntent = async () => {
      if (totalToProcess <= 0) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: Math.round(totalToProcess * 100) }),
        });

        if (!res.ok) throw new Error("Failed to create payment intent");

        const data = await res.json();
        setClientSecret(data.clientSecret);
      } catch (err) {
        console.error("Failed to create payment intent", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentIntent();
  }, [router, cartItems, total, searchParams]);

  const isBuyNow = searchParams.get("buyNow") === "true";

  if (!isBuyNow && cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="container mx-auto px-4 py-20 text-center pt-24">
          <div className="max-w-md mx-auto bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-8">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your cart is empty</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Add some items to your cart before checking out.</p>
            <Link href="/categories/all_product">
              <Button className="bg-blue-500 hover:bg-blue-600 dark:bg-[#a90068] dark:hover:bg-pink-800 text-white">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4 py-6 pt-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 dark:border-[#a90068] border-t-transparent"></div>
                </div>
              ) : clientSecret ? (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckoutForm clientSecret={clientSecret} total={checkoutTotal} items={checkoutItems} isBuyNow={isBuyNow} />
                </Elements>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <p className="text-red-600 dark:text-red-400">Failed to initialize payment. Please try again.</p>
                </div>
              )}
            </div>
            <div className="lg:col-span-1 sm:mt-20">
              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 sticky top-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                  <Package className="h-5 w-5 text-blue-500 dark:text-[#a90068]" />
                  Order Summary
                </h2>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {checkoutItems.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                  {checkoutItems.reduce((sum, item) => sum + item.quantity, 0) === 1 ? "item" : "items"}
                </div>
                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                  {checkoutItems.map((item, index) => (
                    <OrderItem
                      key={`${item._id}-${item.selectedSize || "default"}-${item.selectedColor || "default"}-${index}`}
                      item={item}
                      isBuyNow={isBuyNow}
                    />
                  ))}
                </div>
                <Separator className="my-4" />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Subtotal</span>
                    <span>${checkoutItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Truck className="h-4 w-4" />
                      Shipping
                    </span>
                    <span
                      className={
                        checkoutItems.reduce((sum, item) => sum + item.price * item.quantity, 0) > 100
                          ? "text-green-600 dark:text-green-400"
                          : ""
                      }
                    >
                      {checkoutItems.reduce((sum, item) => sum + item.price * item.quantity, 0) > 100 ? "Free" : "$10.00"}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Tax</span>
                    <span>
                      ${(checkoutItems.reduce((sum, item) => sum + item.price * item.quantity, 0) * 0.08).toFixed(2)}
                    </span>
                  </div>
                  <Separator className="my-3" />
                  <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span className="text-blue-600 dark:text-[#a90068]">${checkoutTotal.toFixed(2)}</span>
                  </div>
                </div>
                {checkoutItems.reduce((sum, item) => sum + item.price * item.quantity, 0) < 100 && (
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Add ${(100 - checkoutItems.reduce((sum, item) => sum + item.price * item.quantity, 0)).toFixed(2)}{" "}
                      more for free shipping!
                    </p>
                  </div>
                )}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" />
                      <span>Secure</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Lock className="h-3 w-3" />
                      <span>Encrypted</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormField({
  label,
  icon: Icon,
  error,
  className = "",
  ...props
}: {
  label: string;
  icon: React.ElementType;
  error?: string;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={props.id} className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
        <Icon className="h-4 w-4 text-blue-500 dark:text-[#a90068]" />
        {label}
      </Label>
      <Input
        {...props}
        className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 ${
          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
            : "border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-[#a90068] focus:ring-blue-500/20 dark:focus:ring-[#a90068]-500/20"
        }`}
      />
      {error && (
        <p className="text-red-500 text-xs flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  );
}

function OrderItem({ item, isBuyNow = false }: { item: CartItem; isBuyNow?: boolean }) {
  const { addToCart, removeFromCart } = useCart();

  const handleIncrement = () => {
    if (!isBuyNow) addToCart({ ...item, quantity: 1 });
  };

  const handleDecrement = () => {
    if (!isBuyNow) removeFromCart(item._id, item.selectedSize, item.selectedColor);
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
        <Image src={item.imageUrl || "/placeholder.svg"} alt={item.name || "Product"} fill className="object-cover" sizes="64px" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">{item.name}</h4>
        <div className="space-y-0.5">
          {item.selectedSize && <p className="text-xs text-gray-500 dark:text-gray-400">Size: {item.selectedSize}</p>}
          {item.selectedColor && <p className="text-xs text-gray-500 dark:text-gray-400">Color: {item.selectedColor}</p>}
          <p className="text-sm font-medium text-gray-900 dark:text-white">${item.price.toFixed(2)}</p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        {!isBuyNow ? (
          <div className="flex items-center gap-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md">
            <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={handleDecrement} disabled={item.quantity <= 1}>
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-sm font-medium text-gray-900 dark:text-white">{item.quantity}</span>
            <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={handleIncrement}>
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <span className="w-8 text-center text-sm font-medium text-gray-900 dark:text-white">{item.quantity}</span>
        )}
        <p className="font-semibold text-gray-900 dark:text-white text-sm">${(item.price * item.quantity).toFixed(2)}</p>
      </div>
    </div>
  );
}

function CheckoutForm({ clientSecret, total, items, isBuyNow = false }: { clientSecret: string; total: number; items: CartItem[]; isBuyNow?: boolean }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { clearCart } = useCart();
  const { isDarkMode } = useTheme();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    phone: "", 
    address: "", 
    city: "", 
    state: "", 
    zip: "" 
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (validationErrors[field]) setValidationErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Full name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Invalid email address";
    if (!formData.phone.trim()) errors.phone = "Phone number is required";
    if (!formData.address.trim()) errors.address = "Address is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.state.trim()) errors.state = "State is required";
    if (!formData.zip.trim()) errors.zip = "ZIP code is required";
    else if (!/^\d{5}(-\d{4})?$/.test(formData.zip)) errors.zip = "Invalid ZIP code";
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    if (!validateForm()) {
      setError("Please correct the errors above.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const itemsSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const itemsShipping = itemsSubtotal > 100 ? 0 : 10;
      const itemsTax = itemsSubtotal * 0.08;
      const itemsTotal = itemsSubtotal + itemsShipping + itemsTax;

      // Save order data without requiring authentication
      const orderData = {
        email: formData.email,
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        items: items.map((item) => ({
          id: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor,
          imageUrl: item.imageUrl,
        })),
        subtotal: itemsSubtotal,
        tax: itemsTax,
        shipping: itemsShipping,
        total: itemsTotal,
        // Remove any user-specific fields that required authentication
        guestCheckout: true, // Flag to indicate this is a guest checkout
      };

      const saveOrderResponse = await fetch("/api/save-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!saveOrderResponse.ok) {
        const errorData = await saveOrderResponse.json();
        throw new Error(errorData.error || "Failed to save order");
      }

      const { orderNumber } = await saveOrderResponse.json();

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: { 
              line1: formData.address, 
              city: formData.city, 
              state: formData.state, 
              postal_code: formData.zip, 
              country: "US" 
            },
          },
        },
      });

      if (stripeError) {
        setError(stripeError.message || "Payment failed.");
      } else if (paymentIntent?.status === "succeeded") {
        // Update order status after successful payment
        await fetch("/api/update-order-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            orderNumber, 
            paymentIntentId: paymentIntent.id, 
            status: "processing", 
            paymentStatus: "paid" 
          }),
        });

        // Clear cart and session data
        if (!isBuyNow) clearCart();
        sessionStorage.removeItem("buyNowItem");
        
        // Redirect to success page
        router.push(`/payment-success?orderNumber=${orderNumber}`);
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError("An error occurred during checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: isDarkMode ? "#ffffff" : "#1a1a1a",
        fontFamily: "system-ui, -apple-system, sans-serif",
        "::placeholder": { color: isDarkMode ? "#9ca3af" : "#6b7280" },
        iconColor: isDarkMode ? "#ec4899" : "#3b82f6",
      },
      invalid: { color: "#dc2626", iconColor: "#dc2626" },
      complete: { color: isDarkMode ? "#10b981" : "#a90068", iconColor: isDarkMode ? "#10b981" : "#a90068" },
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href={isBuyNow ? "/product" : "/cart"}>
          <Button variant="ghost" size="sm" className="gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            {isBuyNow ? "Back to Product" : "Back to Cart"}
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Secure Checkout</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
            <User className="h-5 w-5 text-blue-500 dark:text-[#a90068]" />
            Contact Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Full Name"
              icon={User}
              id="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              error={validationErrors.name}
            />
            <FormField
              label="Phone Number"
              icon={Phone}
              id="phone"
              type="tel"
              placeholder="(555) 123-4567"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              error={validationErrors.phone}
            />
          </div>
          <FormField
            label="Email Address"
            icon={Mail}
            id="email"
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            error={validationErrors.email}
            className="mt-4"
          />
        </div>

        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
            <MapPin className="h-5 w-5 text-blue-500 dark:text-[#a90068]" />
            Shipping Address
          </h2>
          <div className="space-y-4">
            <FormField
              label="Street Address"
              icon={MapPin}
              id="address"
              type="text"
              placeholder="123 Main Street"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              error={validationErrors.address}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormField
                label="City"
                icon={MapPin}
                id="city"
                type="text"
                placeholder="New York"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                error={validationErrors.city}
              />
              <FormField
                label="State"
                icon={MapPin}
                id="state"
                type="text"
                placeholder="NY"
                value={formData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                error={validationErrors.state}
              />
              <FormField
                label="ZIP Code"
                icon={MapPin}
                id="zip"
                type="text"
                placeholder="10001"
                value={formData.zip}
                onChange={(e) => handleInputChange("zip", e.target.value)}
                error={validationErrors.zip}
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
            <CreditCard className="h-5 w-5 text-blue-500 dark:text-[#a90068]" />
            Payment Method
          </h2>
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
            <CardElement options={cardElementOptions} />
          </div>
          <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" />
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center gap-1">
              <Lock className="h-3 w-3" />
              <span>256-bit Encryption</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">Payment Error</span>
            </div>
            <p className="text-red-600 dark:text-red-400 text-sm mt-1">{error}</p>
          </div>
        )}

        <Button
          type="submit"
          disabled={!stripe || loading}
          className="w-full h-12 text-base font-medium bg-blue-500 hover:bg-blue-600 dark:bg-[#a90068] dark:hover:bg-pink-800 text-white transition-colors disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Processing Payment...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Complete Payment - ${total.toFixed(2)}
            </div>
          )}
        </Button>
      </form>
    </div>
  );
}