import type { Metadata } from "next"
import type React from "react"
import { DashboardHeader } from "./components/dashboard-header"

export const metadata: Metadata = {
  title: "Admin Dashboard | Niche Club",
  description: "Manage your e-commerce store with comprehensive analytics and order management.",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-12 max-w-7xl">{children}</main>
    </div>
  )
}
