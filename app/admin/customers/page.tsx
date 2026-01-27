"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Search,
  Users,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Star,
  Loader2,
  Eye,
  MoreHorizontal,
  TrendingUp,
  UserCheck,
  UserX,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { useSearchParams } from "next/navigation"
import Loading from "./loading"

interface Customer {
  id: string
  email: string
  full_name?: string
  phone?: string
  country?: string
  customer_segment: string
  total_bookings: number
  total_booking_value: number
  engagement_score: number
  last_seen_at: string
  created_at: string
  preferred_destinations?: string[]
}

const segmentColors: Record<string, string> = {
  vip: "bg-purple-100 text-purple-800",
  loyal: "bg-emerald-100 text-emerald-800",
  returning: "bg-blue-100 text-blue-800",
  prospect: "bg-yellow-100 text-yellow-800",
  inactive: "bg-neutral-100 text-neutral-600",
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [segmentFilter, setSegmentFilter] = useState("all")
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    fetchCustomers()
  }, [segmentFilter])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/customers?segment=${segmentFilter}`, {
        headers: {
          "x-admin-auth": localStorage.getItem("valar_admin_auth") || "",
        },
      })
      if (response.ok) {
        const data = await response.json()
        setCustomers(data)
      }
    } catch (error) {
      console.error("Failed to fetch customers:", error)
      toast.error("Failed to load customers")
    } finally {
      setLoading(false)
    }
  }

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const stats = {
    total: customers.length,
    vip: customers.filter((c) => c.customer_segment === "vip").length,
    active: customers.filter((c) => {
      const lastSeen = new Date(c.last_seen_at)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return lastSeen >= thirtyDaysAgo
    }).length,
    totalRevenue: customers.reduce((sum, c) => sum + (c.total_booking_value || 0), 0),
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "Never"
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getEngagementLevel = (score: number) => {
    if (score >= 80) return { label: "High", color: "text-emerald-600" }
    if (score >= 50) return { label: "Medium", color: "text-yellow-600" }
    return { label: "Low", color: "text-red-600" }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Customers</h1>
        <p className="text-neutral-600 mt-1">Manage customer relationships and track engagement</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500">Total Customers</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-neutral-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500">VIP Customers</p>
                <p className="text-2xl font-bold text-purple-600">{stats.vip}</p>
              </div>
              <Star className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500">Active (30 days)</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.active}</p>
              </div>
              <UserCheck className="h-8 w-8 text-emerald-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500">Total Revenue</p>
                <p className="text-2xl font-bold text-emerald-600">
                  ${stats.totalRevenue.toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-emerald-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={segmentFilter} onValueChange={setSegmentFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by segment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Segments</SelectItem>
            <SelectItem value="vip">VIP</SelectItem>
            <SelectItem value="loyal">Loyal</SelectItem>
            <SelectItem value="returning">Returning</SelectItem>
            <SelectItem value="prospect">Prospect</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Customers Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-600">No customers found</p>
              <p className="text-sm text-neutral-400 mt-1">
                Customers will appear as they interact with your site
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Segment</TableHead>
                  <TableHead>Bookings</TableHead>
                  <TableHead>Total Value</TableHead>
                  <TableHead>Engagement</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => {
                  const engagement = getEngagementLevel(customer.engagement_score || 0)
                  return (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{customer.full_name || "Unknown"}</p>
                          <p className="text-sm text-neutral-500">{customer.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={segmentColors[customer.customer_segment] || segmentColors.prospect}>
                          {customer.customer_segment || "prospect"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{customer.total_bookings || 0}</p>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">
                          ${(customer.total_booking_value || 0).toLocaleString()}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-neutral-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full"
                              style={{ width: `${customer.engagement_score || 0}%` }}
                            />
                          </div>
                          <span className={`text-sm font-medium ${engagement.color}`}>
                            {customer.engagement_score || 0}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-neutral-500">
                          {formatDate(customer.last_seen_at)}
                        </p>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedCustomer(customer)
                                setDetailsOpen(true)
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                window.location.href = `mailto:${customer.email}`
                              }}
                            >
                              <Mail className="h-4 w-4 mr-2" />
                              Send Email
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Customer Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Customer Profile</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 pb-4 border-b">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                  <span className="text-2xl font-bold text-emerald-700">
                    {(selectedCustomer.full_name || selectedCustomer.email || "?")[0].toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    {selectedCustomer.full_name || "Unknown Customer"}
                  </h3>
                  <p className="text-neutral-500">{selectedCustomer.email}</p>
                  <Badge className={segmentColors[selectedCustomer.customer_segment] || segmentColors.prospect}>
                    {selectedCustomer.customer_segment || "prospect"}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {selectedCustomer.phone && (
                  <div className="space-y-1">
                    <p className="text-sm text-neutral-500 flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone
                    </p>
                    <p className="font-medium">{selectedCustomer.phone}</p>
                  </div>
                )}
                {selectedCustomer.country && (
                  <div className="space-y-1">
                    <p className="text-sm text-neutral-500 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Country
                    </p>
                    <p className="font-medium">{selectedCustomer.country}</p>
                  </div>
                )}
                <div className="space-y-1">
                  <p className="text-sm text-neutral-500 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Total Bookings
                  </p>
                  <p className="font-medium">{selectedCustomer.total_bookings || 0}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-neutral-500 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Total Value
                  </p>
                  <p className="font-medium text-emerald-600">
                    ${(selectedCustomer.total_booking_value || 0).toLocaleString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-neutral-500 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Engagement Score
                  </p>
                  <p className="font-medium">{selectedCustomer.engagement_score || 0}%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-neutral-500 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Member Since
                  </p>
                  <p className="font-medium">{formatDate(selectedCustomer.created_at)}</p>
                </div>
              </div>

              {selectedCustomer.preferred_destinations && selectedCustomer.preferred_destinations.length > 0 && (
                <div className="space-y-2 pt-4 border-t">
                  <p className="text-sm text-neutral-500">Preferred Destinations</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedCustomer.preferred_destinations.map((dest, i) => (
                      <Badge key={i} variant="secondary">{dest}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t">
                <Button
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => {
                    window.location.href = `mailto:${selectedCustomer.email}`
                  }}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
