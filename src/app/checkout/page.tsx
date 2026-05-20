"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "../components/CartContext";
import type { CartItem } from "../components/Interface";

export default function CheckoutPage() {
  const { cartItems, total } = useCart();
  const [loading, setLoading] = useState(false);

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.08;
  const grandTotal = subtotal + shipping + tax;

  const handleSquareCheckout = async () => {
    try {
      setLoading(true);

      const payload = {
        items: cartItems.map((item: CartItem) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          selectedSize: item.selectedSize,
        })),
        redirectUrl: `${window.location.origin}/order-success`,
      };

      const res = await fetch("/api/square/create-payment-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Square API result:", data);

      const url = data?.payment_link?.url;
      if (url) {
        window.location.href = url;
      } else {
        alert("Failed to create Square checkout link");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0)
    return (
      <div className="flex h-screen items-center justify-center text-lg font-medium">
        Your cart is empty.
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Secure Checkout
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 w-full max-w-md">
        <div className="mb-4 text-sm text-gray-700 dark:text-gray-300">
          <p>Subtotal: ${subtotal.toFixed(2)}</p>
          <p>Shipping: {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</p>
          <p>Tax: ${tax.toFixed(2)}</p>
          <p className="mt-2 font-semibold text-gray-900 dark:text-white">
            Total: ${grandTotal.toFixed(2)}
          </p>
        </div>

        <Button
          onClick={handleSquareCheckout}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 rounded-md"
        >
          {loading ? "Redirecting..." : "Proceed to Square Checkout"}
        </Button>
      </div>
    </div>
  );
}
