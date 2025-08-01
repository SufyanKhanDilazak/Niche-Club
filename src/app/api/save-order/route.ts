import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { sendOrderNotification } from "@/lib/email"

export async function POST(req: NextRequest) {
  try {
    const orderData = await req.json()

    const orderNumber = `ORD-${Date.now()}`

    // Save order to database
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_email: orderData.email,
        customer_name: orderData.name,
        customer_phone: orderData.phone,
        shipping_address: {
          address: orderData.address,
          city: orderData.city,
          state: orderData.state,
          zip: orderData.zip,
        },
        items: orderData.items,
        subtotal: orderData.subtotal,
        tax: orderData.tax,
        shipping: orderData.shipping,
        total: orderData.total,
        status: "pending",
        payment_status: "pending",
      })
      .select()
      .single()

    if (orderError) {
      console.error("Error creating order:", orderError)
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
    }

    // Update or create customer
    await supabaseAdmin.from("customers").upsert(
      {
        email: orderData.email,
        name: orderData.name,
        phone: orderData.phone,
      },
      {
        onConflict: "email",
      },
    )

    // Send email notification
    if (order) {
      await sendOrderNotification(order)
    }

    return NextResponse.json({ success: true, orderNumber })
  } catch (error) {
    console.error("Error saving order:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
