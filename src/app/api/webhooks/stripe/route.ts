import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { sendOrderNotification } from "@/lib/email"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent

    // Here you would typically have the order data stored somewhere
    // For now, we'll create a basic order record
    const orderNumber = `ORD-${Date.now()}`

    try {
      const { data: order, error } = await supabaseAdmin
        .from("orders")
        .insert({
          order_number: orderNumber,
          customer_email: paymentIntent.receipt_email || "unknown@example.com",
          customer_name: paymentIntent.shipping?.name || "Unknown Customer",
          customer_phone: paymentIntent.shipping?.phone || null,
          shipping_address: paymentIntent.shipping?.address || {},
          items: [], // This should come from your cart data
          subtotal: paymentIntent.amount / 100,
          tax: 0,
          shipping: 0,
          total: paymentIntent.amount / 100,
          status: "processing",
          payment_status: "paid",
          payment_intent_id: paymentIntent.id,
        })
        .select()
        .single()

      if (error) {
        console.error("Error creating order:", error)
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
      }

      // Send email notification
      if (order) {
        await sendOrderNotification(order)
      }

      // Update or create customer record
      await supabaseAdmin.from("customers").upsert(
        {
          email: paymentIntent.receipt_email || "unknown@example.com",
          name: paymentIntent.shipping?.name || "Unknown Customer",
          phone: paymentIntent.shipping?.phone || null,
        },
        {
          onConflict: "email",
        },
      )
    } catch (error) {
      console.error("Error processing payment success:", error)
      return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
