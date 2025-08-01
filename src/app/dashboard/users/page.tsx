import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { CustomersTable } from "./components/customers-table"

async function getCustomers() {
  const { data: customers, error } = await supabaseAdmin
    .from("customers")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching customers:", error)
    return []
  }

  return customers || []
}

export default async function UsersPage() {
  const customers = await getCustomers()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
        <p className="text-muted-foreground">View and manage your customer base.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Customers</CardTitle>
          <CardDescription>A list of all customers who have made purchases.</CardDescription>
        </CardHeader>
        <CardContent>
          <CustomersTable customers={customers} />
        </CardContent>
      </Card>
    </div>
  )
}
