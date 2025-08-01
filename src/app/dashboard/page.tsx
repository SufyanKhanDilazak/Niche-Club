import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabaseAdmin, testSupabaseConnection } from "@/lib/supabase-admin"
import { DollarSign, ShoppingCart, Users, TrendingUp, AlertCircle } from "lucide-react"
import { RecentOrders } from "./components/recent-orders"
import { SalesChart } from "./components/sales-chart"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

async function getDashboardData() {
  try {
    // Test connection first
    const connectionTest = await testSupabaseConnection()
    if (!connectionTest) {
      throw new Error("Failed to connect to database")
    }

    // Fetch data with proper error handling
    const [ordersResult, customersResult] = await Promise.all([
      supabaseAdmin
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })
        .then((result) => {
          if (result.error) {
            console.error("Orders query error:", result.error)
            return { data: [], error: result.error }
          }
          return result
        }),
      supabaseAdmin
        .from("customers")
        .select("*")
        .then((result) => {
          if (result.error) {
            console.error("Customers query error:", result.error)
            return { data: [], error: result.error }
          }
          return result
        }),
    ])

    const orders = ordersResult.data || []
    const customers = customersResult.data || []

    // Calculate metrics
    const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.total) || 0), 0)
    const totalOrders = orders.length
    const totalCustomers = customers.length

    // Calculate this month's data
    const thisMonth = new Date()
    thisMonth.setDate(1)
    const thisMonthOrders = orders.filter((order) => {
      try {
        return new Date(order.created_at) >= thisMonth
      } catch {
        return false
      }
    })
    const thisMonthRevenue = thisMonthOrders.reduce((sum, order) => sum + (Number(order.total) || 0), 0)

    const recentOrders = orders.slice(0, 5)

    return {
      success: true,
      totalRevenue,
      totalOrders,
      totalCustomers,
      thisMonthRevenue,
      thisMonthOrders: thisMonthOrders.length,
      recentOrders,
      orders,
      error: null,
    }
  } catch (error) {
    console.error("Dashboard data error:", error)
    return {
      success: false,
      totalRevenue: 0,
      totalOrders: 0,
      totalCustomers: 0,
      thisMonthRevenue: 0,
      thisMonthOrders: 0,
      recentOrders: [],
      orders: [],
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export default async function DashboardPage() {
  const dashboardData = await getDashboardData()

  // Show error state if data fetch failed
  if (!dashboardData.success) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground">Welcome to your store dashboard.</p>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Database Connection Error</AlertTitle>
          <AlertDescription>
            Unable to connect to the database. Please check your environment variables:
            <ul className="mt-2 list-disc list-inside text-sm">
              <li>NEXT_PUBLIC_SUPABASE_URL</li>
              <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
              <li>SUPABASE_SERVICE_ROLE_KEY</li>
            </ul>
            <p className="mt-2 text-sm">Error: {dashboardData.error}</p>
          </AlertDescription>
        </Alert>

        {/* Show empty state cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Total Revenue", icon: DollarSign, value: "$0.00" },
            { title: "Total Orders", icon: ShoppingCart, value: "0" },
            { title: "Total Customers", icon: Users, value: "0" },
            { title: "Avg Order Value", icon: TrendingUp, value: "$0.00" },
          ].map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-muted-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground">Database connection required</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const { totalRevenue, totalOrders, totalCustomers, thisMonthRevenue, thisMonthOrders, recentOrders, orders } =
    dashboardData

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground">
        Welcome to your store dashboard. Here&apos;s what&apos;s happening with your business today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">${thisMonthRevenue.toFixed(2)} this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">{thisMonthOrders} this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              {totalCustomers > 0 && totalOrders > 0
                ? `${((thisMonthOrders / totalOrders) * 100).toFixed(1)}% active`
                : "No customers yet"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : "0.00"}
            </div>
            <p className="text-xs text-muted-foreground">Per order average</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>Your revenue performance over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <SalesChart orders={orders} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              {totalOrders > 0 ? `Latest ${Math.min(5, totalOrders)} orders` : "No orders yet"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentOrders orders={recentOrders} />
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
              <ShoppingCart className="h-8 w-8 text-blue-500" />
              <div>
                <h3 className="font-medium">View All Orders</h3>
                <p className="text-sm text-muted-foreground">Manage customer orders</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
              <Users className="h-8 w-8 text-green-500" />
              <div>
                <h3 className="font-medium">Customer Management</h3>
                <p className="text-sm text-muted-foreground">View customer details</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
              <TrendingUp className="h-8 w-8 text-purple-500" />
              <div>
                <h3 className="font-medium">Analytics</h3>
                <p className="text-sm text-muted-foreground">Detailed insights</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
