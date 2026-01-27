"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Building2,
  CalendarCheck,
  Users,
  Mail,
  TrendingUp,
  DollarSign,
  ArrowRight,
  Loader2,
} from "lucide-react"

interface DashboardStats {
  totalProperties: number
  publishedProperties: number
  totalBookings: number
  pendingBookings: number
  totalCustomers: number
  newCustomersThisMonth: number
  totalSubscribers: number
  recentRevenue: number
}

export function AdminDashboardClient({ userName }: { userName: string }) {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/dashboard-stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: "Total Properties",
      value: stats?.totalProperties || 0,
      subtext: `${stats?.publishedProperties || 0} published`,
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      href: "/admin/properties",
    },
    {
      title: "Bookings",
      value: stats?.totalBookings || 0,
      subtext: `${stats?.pendingBookings || 0} pending`,
      icon: CalendarCheck,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      href: "/admin/bookings",
    },
    {
      title: "Customers",
      value: stats?.totalCustomers || 0,
      subtext: `+${stats?.newCustomersThisMonth || 0} this month`,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      href: "/admin/customers",
    },
    {
      title: "Newsletter Subscribers",
      value: stats?.totalSubscribers || 0,
      subtext: "Active subscribers",
      icon: Mail,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      href: "/admin/newsletter",
    },
  ]

  const quickActions = [
    {
      title: "Add New Property",
      description: "Manually add a new villa listing",
      href: "/admin/properties",
      icon: Building2,
    },
    {
      title: "View Pending Bookings",
      description: "Review and confirm reservations",
      href: "/admin/bookings?status=pending",
      icon: CalendarCheck,
    },
    {
      title: "Send Newsletter",
      description: "Create and send email campaigns",
      href: "/admin/newsletter",
      icon: Mail,
    },
    {
      title: "Customer Insights",
      description: "View customer analytics and trends",
      href: "/admin/customers",
      icon: TrendingUp,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Dashboard</h1>
        <p className="text-neutral-600 mt-1">
          Welcome back, {userName}. Here's an overview of your business.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <ArrowRight className="h-4 w-4 text-neutral-400" />
                  </div>
                  {loading ? (
                    <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
                  ) : (
                    <>
                      <p className="text-2xl font-bold text-neutral-900">{stat.value}</p>
                      <p className="text-sm text-neutral-500 mt-1">{stat.subtext}</p>
                    </>
                  )}
                  <p className="text-sm font-medium text-neutral-600 mt-2">{stat.title}</p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Revenue Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-emerald-600" />
            Revenue Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 bg-emerald-50 rounded-lg">
              <p className="text-sm text-emerald-700 font-medium">This Month</p>
              <p className="text-2xl font-bold text-emerald-800 mt-1">
                ${loading ? "..." : (stats?.recentRevenue || 0).toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-neutral-100 rounded-lg">
              <p className="text-sm text-neutral-600 font-medium">Avg. Booking Value</p>
              <p className="text-2xl font-bold text-neutral-900 mt-1">$4,250</p>
            </div>
            <div className="p-4 bg-neutral-100 rounded-lg">
              <p className="text-sm text-neutral-600 font-medium">Conversion Rate</p>
              <p className="text-2xl font-bold text-neutral-900 mt-1">3.2%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.title} href={action.href}>
                <Card className="hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer h-full">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-emerald-50 rounded-lg">
                        <Icon className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-neutral-900">{action.title}</h3>
                        <p className="text-sm text-neutral-500 mt-0.5">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
