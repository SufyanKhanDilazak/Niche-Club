"use client";

import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "./CartContext";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input"; // For input fields
import { Label } from "@/components/ui/label"; // For labels

export default function PaymentForm({ totalAmount }: { totalAmount: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { clearCart } = useCart();
  const router = useRouter();

  // State for additional fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setError("Stripe has not been properly initialized");
      return;
    }

    // Validate required fields
    if (!name || !email || !phone || !address || !city || !state || !zip) {
      setError("Please fill out all required fields.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Math.round(totalAmount * 100),
          name,
          email,
          phone,
          address,
          city,
          state,
          zip,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create payment intent");
      }

      const { clientSecret } = await response.json();

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement)!,
            billing_details: {
              name,
              email,
              phone,
              address: {
                line1: address,
                city,
                state,
                postal_code: zip,
                country: "US", // Set to the appropriate country code
              },
            },
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message || "Payment failed");
      } else if (paymentIntent.status === "succeeded") {
        clearCart();
        router.push('/payment-success');
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError(err instanceof Error ? err.message : "An error occurred during payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Customer Information Fields */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="johndoe@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1 234 567 890"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            type="text"
            placeholder="123 Main St"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            type="text"
            placeholder="New York"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            type="text"
            placeholder="NY"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="zip">ZIP Code</Label>
          <Input
            id="zip"
            type="text"
            placeholder="10001"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Stripe Card Element */}
      <div className="p-4 border rounded-md bg-white">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      {/* Submit Button */}
      <Button 
        type="submit" 
        disabled={!stripe || loading} 
        className="w-full bg-black hover:bg-gray-800"
      >
        {loading ? "Processing..." : `Pay $${totalAmount.toFixed(2)}`}
      </Button>
    </form>
  );
}