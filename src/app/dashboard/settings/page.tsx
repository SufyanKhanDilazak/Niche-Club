import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Settings, Mail, Shield, Database } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your dashboard and store settings.</p>
      </div>

      <div className="grid gap-6">
        {/* Store Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Store Settings
            </CardTitle>
            <CardDescription>Configure your store information and preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="store-name">Store Name</Label>
              <Input id="store-name" defaultValue="Niche Club" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="store-description">Store Description</Label>
              <Input id="store-description" defaultValue="Premium fashion and lifestyle products" />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Notifications
            </CardTitle>
            <CardDescription>Configure email notification settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="admin-email">Admin Email</Label>
              <Input id="admin-email" defaultValue="vaneezakhan2010@gmail.com" />
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="order-notifications" defaultChecked />
              <Label htmlFor="order-notifications">Send email notifications for new orders</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="daily-reports" />
              <Label htmlFor="daily-reports">Send daily sales reports</Label>
            </div>
            <Button>Update Email Settings</Button>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
            <CardDescription>Manage admin access and security settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Admin Users</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between p-2 bg-muted rounded">
                  <span>vaneezakhan2010@gmail.com</span>
                  <span className="text-green-600">Active</span>
                </div>
                <p className="text-muted-foreground text-xs">Add more admin emails in the middleware.ts file</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Database Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Status
            </CardTitle>
            <CardDescription>Current database connection and status.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Connected to Supabase</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">All database operations are functioning normally.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
