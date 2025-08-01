import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { Order } from "@/lib/supabase-admin"

interface RecentOrdersProps {
  orders: Order[]
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No orders yet.</p>
        <p className="text-sm">Recent orders will appear here.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div key={order.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback>
              {order.customer_name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1 flex-1 min-w-0">
            <p className="text-sm font-medium leading-none truncate">{order.customer_name}</p>
            <p className="text-sm text-muted-foreground truncate">{order.customer_email}</p>
          </div>
          <div className="ml-auto space-y-1 text-right">
            <p className="text-sm font-medium">${order.total.toFixed(2)}</p>
            <Badge variant={order.status === "delivered" ? "default" : "secondary"} className="text-xs">
              {order.status}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  )
}
