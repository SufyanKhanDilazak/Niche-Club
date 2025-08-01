"use client"

import { BarChart3, ShoppingCart, Users, Settings, Home, SpaceIcon as Studio, Menu } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

import {
  Sidebar,
  SidebarContent as BaseSidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

const items = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Orders",
    url: "/dashboard/orders",
    icon: ShoppingCart,
  },
  {
    title: "Customers",
    url: "/dashboard/users",
    icon: Users,
  },
  {
    title: "Analytics",
    url: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "Studio",
    url: "/dashboard/studio",
    icon: Studio,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
]

function SidebarContent() {
  const pathname = usePathname()

  return (
    <>
      <SidebarHeader>
        <div className="px-4 py-2">
          <h2 className="text-lg font-semibold">Niche Club</h2>
          <p className="text-sm text-muted-foreground">Admin Dashboard</p>
        </div>
      </SidebarHeader>
      <BaseSidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </BaseSidebarContent>
      <SidebarFooter>
        <div className="px-4 py-2 text-xs text-muted-foreground">© 2024 Niche Club</div>
      </SidebarFooter>
    </>
  )
}

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent />
    </Sidebar>
  )
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-64">
        <div className="flex h-full flex-col">
          <SidebarContent />
        </div>
      </SheetContent>
    </Sheet>
  )
}
