"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  TrendingUp,
  Eye,
  CreditCard,
  Search,
  Filter,
  Download,
  RefreshCw,
  BarChart3,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Mail,
  UserCheck,
  UserX,
  Star,
  Crown,
} from "lucide-react"
import Link from "next/link"

interface Customer {
  id: string
  email: string
  first_name?: string
  last_name?: string
  engagement_score: number
  lifetime_value: number
  lead_score: number
  customer_segment: string
  acquisition_source?: string
  total_sessions: number
  total_page_views: number
  total_bookings: number
  total_booking_value: number
  last_seen_at: string
  email_subscribed: boolean
  preferred_destinations?: string[]
}

interface Segment {
  id: string
  name: string
  description?: string
  member_count: number
  is_active: boolean
}

interface Stats {
  totalCustomers: number
  segmentCounts: Record<string, number>
  eventCounts: Record<string, number>
  sourceCounts: Record<string, number>
  deviceCounts: Record<string, number>
  avgEngagement: number
  totalPageViews: number
  totalBookings: number
  totalRevenue: number
}

interface CRMDashboardProps {
  customers: Customer[]
  segments: Segment[]
  stats: Stats
}

const segmentColors: Record<string, string> = {
  prospect: "bg-gray-100 text-gray-800",
  engaged: "bg-blue-100 text-blue-800",
  loyal: "bg-green-100 text-green-800",
  vip: "bg-amber-100 text-amber-800",
  dormant: "bg-red-100 text-red-800",
}

const segmentIcons: Record<string, React.ReactNode> = {
  prospect: <Users className="h-4 w-4" />,
  engaged: <UserCheck className="h-4 w-4" />,
  loyal: <Star className="h-4 w-4" />,
  vip: <Crown className="h-4 w-4" />,
  dormant: <UserX className="h-4 w-4" />,
}

export function CRMDashboard({ customers, segments, stats }: CRMDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [segmentFilter, setSegmentFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("last_seen")

  const filteredCustomers = customers
    .filter((c) => {
      const matchesSearch =
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.last_name?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesSegment = segmentFilter === "all" || c.customer_segment === segmentFilter
      return matchesSearch && matchesSegment
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "engagement":
          return b.engagement_score - a.engagement_score
        case "value":
          return b.lifetime_value - a.lifetime_value
        case "bookings":
          return b.total_bookings - a.total_bookings
        default:
          return new Date(b.last_seen_at).getTime() - new Date(a.last_seen_at).getTime()
      }
    })

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const topEvents = Object.entries(stats.eventCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  const topSources = Object.entries(stats.sourceCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">CRM Dashboard</h1>
          <p className="text-gray-600 mt-1">Customer insights, segmentation, and journey analytics</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Link href="/admin">
            <Button variant="ghost" size="sm">
              Back to Admin
            </Button>
          </Link>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Customers</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalCustomers.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Avg. Engagement</p>
                <p className="text-3xl font-bold text-gray-900">{stats.avgEngagement.toFixed(0)}%</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Page Views</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalPageViews.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Eye className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
              </div>
              <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="customers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="segments">Segments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="journeys">User Journeys</TabsTrigger>
        </TabsList>

        {/* Customers Tab */}
        <TabsContent value="customers" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search customers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={segmentFilter} onValueChange={setSegmentFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Segment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Segments</SelectItem>
                    <SelectItem value="prospect">Prospects</SelectItem>
                    <SelectItem value="engaged">Engaged</SelectItem>
                    <SelectItem value="loyal">Loyal</SelectItem>
                    <SelectItem value="vip">VIP</SelectItem>
                    <SelectItem value="dormant">Dormant</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last_seen">Last Seen</SelectItem>
                    <SelectItem value="engagement">Engagement</SelectItem>
                    <SelectItem value="value">Lifetime Value</SelectItem>
                    <SelectItem value="bookings">Bookings</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Customers Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Segment</TableHead>
                    <TableHead className="text-center">Engagement</TableHead>
                    <TableHead className="text-center">Sessions</TableHead>
                    <TableHead className="text-center">Bookings</TableHead>
                    <TableHead className="text-right">Lifetime Value</TableHead>
                    <TableHead>Last Seen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.slice(0, 20).map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">
                            {customer.first_name || customer.last_name
                              ? `${customer.first_name || ""} ${customer.last_name || ""}`.trim()
                              : "Anonymous"}
                          </p>
                          <p className="text-sm text-gray-500">{customer.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={segmentColors[customer.customer_segment] || "bg-gray-100"}>
                          <span className="flex items-center gap-1">
                            {segmentIcons[customer.customer_segment]}
                            {customer.customer_segment}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-emerald-500 h-2 rounded-full"
                              style={{ width: `${customer.engagement_score}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">{customer.engagement_score}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{customer.total_sessions}</TableCell>
                      <TableCell className="text-center">{customer.total_bookings}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(customer.lifetime_value)}
                      </TableCell>
                      <TableCell className="text-gray-500 text-sm">{formatDate(customer.last_seen_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Segments Tab */}
        <TabsContent value="segments" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Segment Overview Cards */}
            {Object.entries(stats.segmentCounts).map(([segment, count]) => (
              <Card key={segment}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div
                      className={`h-12 w-12 rounded-full flex items-center justify-center ${segmentColors[segment]}`}
                    >
                      {segmentIcons[segment]}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 capitalize">{segment}</p>
                      <p className="text-2xl font-bold text-gray-900">{count}</p>
                      <p className="text-xs text-gray-400">
                        {((count / stats.totalCustomers) * 100).toFixed(1)}% of total
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Custom Segments */}
          <Card>
            <CardHeader>
              <CardTitle>Audience Segments</CardTitle>
              <CardDescription>Custom segments for targeted marketing</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Segment Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-center">Members</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {segments.map((segment) => (
                    <TableRow key={segment.id}>
                      <TableCell className="font-medium">{segment.name}</TableCell>
                      <TableCell className="text-gray-500">{segment.description}</TableCell>
                      <TableCell className="text-center">{segment.member_count}</TableCell>
                      <TableCell>
                        <Badge variant={segment.is_active ? "default" : "secondary"}>
                          {segment.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Top Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Top Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topEvents.map(([event, count], index) => (
                    <div key={event} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-400">#{index + 1}</span>
                        <span className="font-medium">{event.replace(/_/g, " ")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-emerald-500 h-2 rounded-full"
                            style={{ width: `${(count / topEvents[0][1]) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Traffic Sources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Traffic Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topSources.map(([source, count], index) => (
                    <div key={source} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-400">#{index + 1}</span>
                        <span className="font-medium capitalize">{source}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${(count / topSources[0][1]) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Device Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Device Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-around py-4">
                  {Object.entries(stats.deviceCounts).map(([device, count]) => {
                    const total = Object.values(stats.deviceCounts).reduce((a, b) => a + b, 0)
                    const percentage = ((count / total) * 100).toFixed(1)
                    const Icon = device === "mobile" ? Smartphone : device === "tablet" ? Tablet : Monitor

                    return (
                      <div key={device} className="text-center">
                        <div className="h-16 w-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-2">
                          <Icon className="h-8 w-8 text-gray-600" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{percentage}%</p>
                        <p className="text-sm text-gray-500 capitalize">{device}</p>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Email Engagement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Subscribers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <p className="text-5xl font-bold text-emerald-600">
                      {customers.filter((c) => c.email_subscribed).length}
                    </p>
                    <p className="text-gray-500 mt-2">
                      {((customers.filter((c) => c.email_subscribed).length / customers.length) * 100).toFixed(1)}%
                      subscription rate
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* User Journeys Tab */}
        <TabsContent value="journeys" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Journey Insights</CardTitle>
              <CardDescription>
                Track how users navigate through your site and identify conversion paths
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Journey visualization coming soon</p>
                <p className="text-sm mt-2">
                  Data is being collected. Check back later for detailed user journey analysis.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
