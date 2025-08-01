"use client"

import type { Order } from "@/lib/supabase-admin"
import { useMemo } from "react"

interface SalesChartProps {
  orders: Order[]
}

export function SalesChart({ orders }: SalesChartProps) {
  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date.toISOString().split("T")[0]
    }).reverse()

    return last7Days.map((date) => {
      const dayOrders = orders.filter((order) => order.created_at.split("T")[0] === date)
      const revenue = dayOrders.reduce((sum, order) => sum + (order.total || 0), 0)

      return {
        date,
        revenue,
        orders: dayOrders.length,
      }
    })
  }, [orders])

  const maxRevenue = Math.max(...chartData.map((d) => d.revenue))

  if (orders.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No sales data available yet.</p>
        <p className="text-sm">Charts will appear here after orders are placed.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Last 7 Days</h3>
        <div className="text-sm text-muted-foreground">
          Total: ${chartData.reduce((sum, d) => sum + d.revenue, 0).toFixed(2)}
        </div>
      </div>

      <div className="space-y-2">
      {chartData.map((day) => (
          <div key={day.date} className="flex items-center space-x-4">
            <div className="w-12 md:w-16 text-xs text-muted-foreground">
              {new Date(day.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <div
                  className="bg-primary h-2 rounded transition-all duration-300"
                  style={{
                    width: `${maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0}%`,
                    minWidth: day.revenue > 0 ? "4px" : "0px",
                  }}
                />
                <span className="text-sm font-medium">${day.revenue.toFixed(2)}</span>
                <span className="text-xs text-muted-foreground">({day.orders} orders)</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
