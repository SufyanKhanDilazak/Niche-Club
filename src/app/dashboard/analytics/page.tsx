import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { AnalyticsChart } from "./components/analytics-chart"
import { TopProducts } from "./components/top-products"
import { DollarSign, Users, TrendingUp, Calendar } from "lucide-react"

async function getAnalyticsData() {
  try {
    const [ordersResult, customersResult] = await Promise.all([
      supabaseAdmin.from("orders").select("*").order("created_at", { ascending: false }),
      supabaseAdmin.from("customers").select("*"),
    ])

    const orders = ordersResult.data || []
    const customers = customersResult.data || []

    // Calculate analytics
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const last30DaysOrders = orders.filter((order) => new Date(order.created_at) >= thirtyDaysAgo)
    const last7DaysOrders = orders.filter((order) => new Date(order.created_at) >= sevenDaysAgo)

    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0)
    const last30DaysRevenue = last30DaysOrders.reduce((sum, order) => sum + (order.total || 0), 0)
    const last7DaysRevenue = last7DaysOrders.reduce((sum, order) => sum + (order.total || 0), 0)

    // Calculate conversion rate (assuming 100 visitors per order for demo)
    const conversionRate = orders.length > 0 ? (orders.length / (orders.length * 10)) * 100 : 0

    return {
      totalRevenue,
      totalOrders: orders.length,
      totalCustomers: customers.length,
      last30DaysRevenue,
      last30DaysOrders: last30DaysOrders.length,
      last7DaysRevenue,
      last7DaysOrders: last7DaysOrders.length,
      avgOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0,
      conversionRate,
      orders,
    }
  } catch (error) {
    console.error("Error fetching analytics data:", error)
    return {
      totalRevenue: 0,
      totalOrders: 0,
      totalCustomers: 0,
      last30DaysRevenue: 0,
      last30DaysOrders: 0,
      last7DaysRevenue: 0,
      last7DaysOrders: 0,
      avgOrderValue: 0,
      conversionRate: 0,
      orders: [],
    }
  }
}

export default async function AnalyticsPage() {
  const analytics = await getAnalyticsData()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Analytics</h2>
        <p className="text-muted-foreground">Detailed insights into your store performance.</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">30-Day Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">${analytics.last30DaysRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">${analytics.last7DaysRevenue.toFixed(2)} last 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">${analytics.avgOrderValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Per order average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{analytics.conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Visitors to customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{analytics.last30DaysOrders}</div>
            <p className="text-xs text-muted-foreground">{analytics.last7DaysOrders} this week</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Daily revenue over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <AnalyticsChart orders={analytics.orders} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Best selling items this month</CardDescription>
          </CardHeader>
          <CardContent>
            <TopProducts orders={analytics.orders} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
