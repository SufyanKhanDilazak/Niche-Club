import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function POST(req: NextRequest) {
  try {
    const { orderNumber, paymentIntentId, status, paymentStatus } = await req.json()

    const { error } = await supabaseAdmin
      .from("orders")
      .update({
        payment_intent_id: paymentIntentId,
        status: status,
        payment_status: paymentStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("order_number", orderNumber)

    if (error) {
      console.error("Error updating order:", error)
      return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating order status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
