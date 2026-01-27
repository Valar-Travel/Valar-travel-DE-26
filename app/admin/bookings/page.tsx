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
  Calendar,
  DollarSign,
  User,
  Building2,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  Eye,
  MoreHorizontal,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import Loading from "./loading"

interface Booking {
  id: string
  property_id: string
  property_name: string
  guest_name: string
  guest_email: string
  guest_phone?: string
  check_in: string
  check_out: string
  guests: number
  total_price: number
  status: "pending" | "confirmed" | "cancelled" | "completed"
  notes?: string
  created_at: string
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  completed: "bg-blue-100 text-blue-800",
}

const statusIcons: Record<string, any> = {
  pending: Clock,
  confirmed: CheckCircle,
  cancelled: XCircle,
  completed: CheckCircle,
}

const BookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    fetchBookings()
  }, [statusFilter])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/bookings?status=${statusFilter}`, {
        headers: {
          "x-admin-auth": localStorage.getItem("valar_admin_auth") || "",
        },
      })
      if (response.ok) {
        const data = await response.json()
        setBookings(data)
      }
    } catch (error) {
      console.error("Failed to fetch bookings:", error)
      toast.error("Failed to load bookings")
    } finally {
      setLoading(false)
    }
  }

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-auth": localStorage.getItem("valar_admin_auth") || "",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        toast.success(`Booking ${newStatus}`)
        fetchBookings()
      } else {
        throw new Error("Failed to update booking")
      }
    } catch (error) {
      toast.error("Failed to update booking status")
    }
  }

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.guest_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.guest_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.property_name?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    revenue: bookings
      .filter((b) => b.status === "confirmed" || b.status === "completed")
      .reduce((sum, b) => sum + (b.total_price || 0), 0),
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <Suspense fallback={<Loading />}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Bookings</h1>
          <p className="text-neutral-600 mt-1">Manage reservations and booking inquiries</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500">Total Bookings</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Calendar className="h-8 w-8 text-neutral-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500">Confirmed</p>
                  <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500">Revenue</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    ${stats.revenue.toLocaleString()}
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
              placeholder="Search by guest name, email, or property..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bookings Table */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                <p className="text-neutral-600">No bookings found</p>
                <p className="text-sm text-neutral-400 mt-1">
                  Bookings will appear here when customers make reservations
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Guest</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking) => {
                    const StatusIcon = statusIcons[booking.status] || Clock
                    return (
                      <TableRow key={booking.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{booking.guest_name}</p>
                            <p className="text-sm text-neutral-500">{booking.guest_email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium truncate max-w-[200px]">
                            {booking.property_name}
                          </p>
                          <p className="text-sm text-neutral-500">{booking.guests} guests</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">
                            {formatDate(booking.check_in)} - {formatDate(booking.check_out)}
                          </p>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">${booking.total_price?.toLocaleString()}</p>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[booking.status]}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {booking.status}
                          </Badge>
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
                                  setSelectedBooking(booking)
                                  setDetailsOpen(true)
                                }}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              {booking.status === "pending" && (
                                <>
                                  <DropdownMenuItem
                                    onClick={() => updateBookingStatus(booking.id, "confirmed")}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                    Confirm Booking
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => updateBookingStatus(booking.id, "cancelled")}
                                  >
                                    <XCircle className="h-4 w-4 mr-2 text-red-600" />
                                    Cancel Booking
                                  </DropdownMenuItem>
                                </>
                              )}
                              {booking.status === "confirmed" && (
                                <DropdownMenuItem
                                  onClick={() => updateBookingStatus(booking.id, "completed")}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2 text-blue-600" />
                                  Mark Completed
                                </DropdownMenuItem>
                              )}
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

        {/* Booking Details Dialog */}
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Booking Details</DialogTitle>
            </DialogHeader>
            {selectedBooking && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-neutral-500 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Guest Name
                    </p>
                    <p className="font-medium">{selectedBooking.guest_name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-neutral-500 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </p>
                    <p className="font-medium">{selectedBooking.guest_email}</p>
                  </div>
                  {selectedBooking.guest_phone && (
                    <div className="space-y-1">
                      <p className="text-sm text-neutral-500 flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone
                      </p>
                      <p className="font-medium">{selectedBooking.guest_phone}</p>
                    </div>
                  )}
                  <div className="space-y-1">
                    <p className="text-sm text-neutral-500 flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Property
                    </p>
                    <p className="font-medium">{selectedBooking.property_name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-neutral-500 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Check-in
                    </p>
                    <p className="font-medium">{formatDate(selectedBooking.check_in)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-neutral-500 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Check-out
                    </p>
                    <p className="font-medium">{formatDate(selectedBooking.check_out)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-neutral-500">Guests</p>
                    <p className="font-medium">{selectedBooking.guests}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-neutral-500 flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Total Price
                    </p>
                    <p className="font-medium text-emerald-600">
                      ${selectedBooking.total_price?.toLocaleString()}
                    </p>
                  </div>
                </div>
                {selectedBooking.notes && (
                  <div className="space-y-1">
                    <p className="text-sm text-neutral-500">Notes</p>
                    <p className="text-sm bg-neutral-50 p-3 rounded-lg">{selectedBooking.notes}</p>
                  </div>
                )}
                <div className="flex gap-2 pt-4 border-t">
                  {selectedBooking.status === "pending" && (
                    <>
                      <Button
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => {
                          updateBookingStatus(selectedBooking.id, "confirmed")
                          setDetailsOpen(false)
                        }}
                      >
                        Confirm Booking
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 text-red-600 hover:bg-red-50 bg-transparent"
                        onClick={() => {
                          updateBookingStatus(selectedBooking.id, "cancelled")
                          setDetailsOpen(false)
                        }}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Suspense>
  )
}

export default BookingsPage
