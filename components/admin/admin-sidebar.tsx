"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Building2,
  CalendarCheck,
  Users,
  Mail,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Map,
  Shield,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface AdminUser {
  id: string
  email: string
  name: string
  role: "super_admin" | "admin" | "editor"
}

const navItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    roles: ["super_admin", "admin", "editor"],
  },
  {
    title: "Properties",
    href: "/admin/properties",
    icon: Building2,
    roles: ["super_admin", "admin", "editor"],
  },
  {
    title: "Sitemap",
    href: "/admin/sitemap",
    icon: Map,
    roles: ["super_admin", "admin"],
  },
  {
    title: "Bookings",
    href: "/admin/bookings",
    icon: CalendarCheck,
    roles: ["super_admin", "admin", "editor"],
  },
  {
    title: "Customers",
    href: "/admin/customers",
    icon: Users,
    roles: ["super_admin", "admin"],
  },
  {
    title: "Newsletter",
    href: "/admin/newsletter",
    icon: Mail,
    roles: ["super_admin", "admin"],
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
    roles: ["super_admin"],
  },
]

const roleLabels = {
  super_admin: "Super Admin",
  admin: "Admin",
  editor: "Editor",
}

const roleColors = {
  super_admin: "bg-purple-100 text-purple-700",
  admin: "bg-emerald-100 text-emerald-700",
  editor: "bg-blue-100 text-blue-700",
}

export function AdminSidebar({ user }: { user: AdminUser }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" })
      router.push("/admin/login")
      router.refresh()
    } catch {
      router.push("/admin/login")
    }
  }

  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(user.role)
  )

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-neutral-200 z-40 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <span className="font-serif text-lg font-medium text-neutral-900">
            Valar <span className="text-emerald-700">Admin</span>
          </span>
        </div>
        <Badge className={cn("text-xs", roleColors[user.role])}>
          {roleLabels[user.role]}
        </Badge>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-white border-r border-neutral-200 z-40 transition-transform duration-300",
          "lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-neutral-200">
            <Link href="/admin" className="flex items-center gap-2">
              <span className="font-serif text-xl font-medium text-neutral-900">
                Valar <span className="text-emerald-700">Admin</span>
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-6 px-3 overflow-y-auto">
            <ul className="space-y-1">
              {filteredNavItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/admin" && pathname.startsWith(item.href))
                const Icon = item.icon

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                        isActive
                          ? "bg-emerald-50 text-emerald-700"
                          : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {item.title}
                      {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-neutral-200">
            <div className="flex items-center gap-3 px-3 py-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                <span className="text-sm font-medium text-emerald-700">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 truncate">
                  {user.name}
                </p>
                <div className="flex items-center gap-1.5">
                  <Shield className="h-3 w-3 text-neutral-400" />
                  <p className="text-xs text-neutral-500">{roleLabels[user.role]}</p>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start text-neutral-600 hover:text-red-600 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Log out
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
