"use client"

import type { Order } from "@/lib/supabase-admin"
import { useMemo } from "react"

interface AnalyticsChartProps {
  orders: Order[]
}

export function AnalyticsChart({ orders }: AnalyticsChartProps) {
  const chartData = useMemo(() => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date.toISOString().split("T")[0]
    }).reverse()

    return last30Days.map((date) => {
      const dayOrders = orders.filter((order) => order.created_at.split("T")[0] === date)
      const revenue = dayOrders.reduce((sum, order) => sum + (order.total || 0), 0)

      return {
        date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        revenue,
        orders: dayOrders.length,
      }
    })
  }, [orders])

  const maxRevenue = Math.max(...chartData.map((d) => d.revenue), 1)

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
        <h3 className="text-lg font-medium">Revenue Trend (Last 30 Days)</h3>
        <div className="text-sm text-muted-foreground">
          Total: ${chartData.reduce((sum, d) => sum + d.revenue, 0).toFixed(2)}
        </div>
      </div>

      <div className="space-y-3">
        {chartData.map((day, index) => (
          <div key={`${day.date}-${index}`} className="flex items-center space-x-4">
            <div className="w-16 text-xs text-muted-foreground font-mono">{day.date}</div>
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <div className="flex-1 bg-gray-200 dark:bg-gray-800 rounded-full h-2 relative overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0}%`,
                      minWidth: day.revenue > 0 ? "2px" : "0px",
                    }}
                  />
                </div>
                <div className="flex items-center space-x-2 min-w-0">
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    ${day.revenue.toFixed(2)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({day.orders} {day.orders === 1 ? "order" : "orders"})
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
        <div className="text-center">
          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
            ${chartData.reduce((sum, d) => sum + d.revenue, 0).toFixed(2)}
          </div>
          <div className="text-xs text-muted-foreground">Total Revenue</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-green-600 dark:text-green-400">
            {chartData.reduce((sum, d) => sum + d.orders, 0)}
          </div>
          <div className="text-xs text-muted-foreground">Total Orders</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
            $
            {chartData.length > 0
              ? (chartData.reduce((sum, d) => sum + d.revenue, 0) / chartData.length).toFixed(2)
              : "0.00"}
          </div>
          <div className="text-xs text-muted-foreground">Daily Average</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
            {Math.max(...chartData.map((d) => d.orders))}
          </div>
          <div className="text-xs text-muted-foreground">Peak Orders</div>
        </div>
      </div>
    </div>
  )
}
