import type { Order } from "@/lib/supabase-admin"

interface TopProductsProps {
  orders: Order[]
}

export function TopProducts({ orders }: TopProductsProps) {
  // Calculate top products from orders
  const productStats = orders.reduce(
    (acc, order) => {
      order.items.forEach((item) => {
        const key = item.name || "Unknown Product"
        if (!acc[key]) {
          acc[key] = { name: key, quantity: 0, revenue: 0 }
        }
        acc[key].quantity += item.quantity
        acc[key].revenue += item.price * item.quantity
      })
      return acc
    },
    {} as Record<string, { name: string; quantity: number; revenue: number }>,
  )

  const topProducts = Object.values(productStats)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)

  if (topProducts.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No product data available yet.</p>
        <p className="text-sm">Products will appear here after orders are placed.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {topProducts.map((product, index) => (
        <div key={product.name} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium">
              {index + 1}
            </div>
            <div>
              <p className="font-medium text-sm">{product.name}</p>
              <p className="text-xs text-muted-foreground">{product.quantity} sold</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-medium text-sm">${product.revenue.toFixed(2)}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
