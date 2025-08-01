import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { OrdersTable } from "./components/order-table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

async function getOrders() {
  try {
    const { data: orders, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching orders:", error)
      throw error
    }

    return { success: true, orders: orders || [], error: null }
  } catch (error) {
    console.error("Unexpected error fetching orders:", error)
    return {
      success: false,
      orders: [],
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export default async function OrdersPage() {
  const result = await getOrders()

  if (!result.success) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Orders Management</h1>
          <p className="text-muted-foreground">Track and manage all customer orders from your store.</p>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Unable to Load Orders</AlertTitle>
          <AlertDescription>
            There was an error connecting to the database. Please check your Supabase configuration.
            <p className="mt-2 text-sm">Error: {result.error}</p>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const orders = result.orders
  const pendingOrders = orders.filter((order) => order.status === "pending").length
  const processingOrders = orders.filter((order) => order.status === "processing").length
  const completedOrders = orders.filter((order) => order.status === "delivered").length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Orders Management</h1>
        <p className="text-muted-foreground">Track and manage all customer orders from your store.</p>
      </div>

      {/* Order Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{pendingOrders}</div>
              <Badge variant="secondary">Pending</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{processingOrders}</div>
              <Badge variant="default">Processing</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{completedOrders}</div>
              <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Orders ({orders.length})</CardTitle>
          <CardDescription>
            {orders.length > 0
              ? "Complete list of all orders placed on your store."
              : "No orders yet. Orders will appear here once customers make purchases."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OrdersTable orders={orders} />
        </CardContent>
      </Card>
    </div>
  )
}
