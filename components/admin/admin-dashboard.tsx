"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, CreditCard, TrendingUp, DollarSign } from "lucide-react"

interface AdminDashboardProps {
  user: any
  userStats: any[]
  subscriptionStats: any[]
}

export function AdminDashboard({ user, userStats, subscriptionStats }: AdminDashboardProps) {
  const totalUsers = userStats.length
  const activeSubscriptions = subscriptionStats.filter((s) => s.status === "active").length
  const monthlyRevenue = activeSubscriptions * 29.99 // Simplified calculation

  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Active Subscriptions",
      value: activeSubscriptions,
      icon: CreditCard,
      color: "text-green-600",
    },
    {
      title: "Monthly Revenue",
      value: `$${monthlyRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "text-purple-600",
    },
    {
      title: "Growth Rate",
      value: "+12%",
      icon: TrendingUp,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of your SaaS metrics and user management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>Latest user registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userStats.slice(0, 5).map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">User {user.id.slice(0, 8)}</p>
                    <p className="text-sm text-gray-600">{new Date(user.created_at).toLocaleDateString()}</p>
                  </div>
                  <Badge variant="secondary">{user.membership_tier || "Free"}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscription Breakdown</CardTitle>
            <CardDescription>Current subscription distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(
                subscriptionStats.reduce(
                  (acc, sub) => {
                    const plan = sub.subscription_plans?.name || "Unknown"
                    acc[plan] = (acc[plan] || 0) + 1
                    return acc
                  },
                  {} as Record<string, number>,
                ),
              ).map(([plan, count]) => (
                <div key={plan} className="flex items-center justify-between">
                  <span className="font-medium">{plan}</span>
                  <Badge>{count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
