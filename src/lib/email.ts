import nodemailer from "nodemailer"
import type { Order } from "./supabase"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number.parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendOrderNotification(order: Order) {
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">New Order Received! 🎉</h2>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Order Details</h3>
        <p><strong>Order Number:</strong> ${order.order_number}</p>
        <p><strong>Customer:</strong> ${order.customer_name}</p>
        <p><strong>Email:</strong> ${order.customer_email}</p>
        <p><strong>Phone:</strong> ${order.customer_phone || "N/A"}</p>
        <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
      </div>

      <div style="background: #fff; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
        <h3>Items Ordered</h3>
        ${order.items
          .map(
            (item) => `
          <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
            <p><strong>${item.name}</strong></p>
            <p>Price: $${item.price.toFixed(2)} x ${item.quantity}</p>
            ${item.selectedSize ? `<p>Size: ${item.selectedSize}</p>` : ""}
            ${item.selectedColor ? `<p>Color: ${item.selectedColor}</p>` : ""}
          </div>
        `,
          )
          .join("")}
      </div>

      <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Shipping Address</h3>
        <p>${order.shipping_address.address}</p>
        <p>${order.shipping_address.city}, ${order.shipping_address.state} ${order.shipping_address.zip}</p>
      </div>

      <p style="color: #666; font-size: 14px;">
        Please log in to your dashboard to manage this order.
      </p>
    </div>
  `

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.ADMIN_EMAIL || "vaneezakhan2010@gmail.com",
      subject: `New Order #${order.order_number} - $${order.total.toFixed(2)}`,
      html: emailHtml,
    })
    console.log("Order notification email sent successfully")
  } catch (error) {
    console.error("Failed to send order notification email:", error)
  }
}
