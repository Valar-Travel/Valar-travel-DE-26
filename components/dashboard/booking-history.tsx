"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, Users, Trash2, CreditCard, Clock, CheckCircle, Building2, DollarSign } from "lucide-react"
import { format } from "@/lib/date-utils"
import Link from "next/link"

interface SavedTrip {
  id: string
  trip_name: string
  destination: string
  start_date: string
  end_date: string
  guest_count: number
  notes: string
  created_at: string
}

interface Booking {
  id: string
  villa_id: string
  villa_name: string
  check_in: string
  check_out: string
  nights: number
  guests: number
  total_amount: number
  deposit_amount: number
  deposit_percentage: number
  remaining_amount: number
  currency: string
  booking_status: string
  payment_status: string
  created_at: string
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  deposit_received: "bg-emerald-100 text-emerald-800",
  completed: "bg-blue-100 text-blue-800",
  cancelled: "bg-red-100 text-red-800",
}

const statusIcons: Record<string, any> = {
  pending: Clock,
  confirmed: CheckCircle,
  deposit_received: DollarSign,
  completed: CheckCircle,
}

export function BookingHistory({ userId }: { userId: string }) {
  const [trips, setTrips] = useState<SavedTrip[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("bookings")

  useEffect(() => {
    fetchData()
  }, [userId])

  const fetchData = async () => {
    const supabase = createClient()
    
    // Fetch actual bookings (from checkout)
    const { data: bookingsData } = await supabase
      .from("bookings")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
    
    if (bookingsData) {
      setBookings(bookingsData)
    }

    // Fetch saved trips
    const { data: tripsData } = await supabase
      .from("saved_trips")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (tripsData) {
      setTrips(tripsData)
    }
    
    setLoading(false)
  }

  const deleteTrip = async (tripId: string) => {
    const supabase = createClient()
    const { error } = await supabase.from("saved_trips").delete().eq("id", tripId)

    if (!error) {
      setTrips(trips.filter((trip) => trip.id !== tripId))
    }
  }

  const formatCurrency = (amount: number, currency: string) => {
    const symbol = currency === "USD" ? "$" : currency === "EUR" ? "€" : currency === "GBP" ? "£" : "$"
    return `${symbol}${(amount / 100).toLocaleString()}`
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-24 bg-gray-200 rounded-lg"></div>
            <div className="h-24 bg-gray-200 rounded-lg"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Bookings & Saved Trips</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="bookings" className="gap-2">
              <CreditCard className="w-4 h-4" />
              Confirmed Bookings ({bookings.length})
            </TabsTrigger>
            <TabsTrigger value="saved" className="gap-2">
              <Calendar className="w-4 h-4" />
              Saved Trips ({trips.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            {bookings.length === 0 ? (
              <div className="text-center py-8">
                <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No confirmed bookings yet.</p>
                <Button asChild className="mt-4" variant="outline">
                  <Link href="/villas">Browse Villas</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => {
                  const StatusIcon = statusIcons[booking.booking_status] || Clock
                  return (
                    <div key={booking.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-lg">{booking.villa_name}</h4>
                              <p className="text-sm text-gray-500">Booking #{booking.id.slice(0, 8)}</p>
                            </div>
                            <Badge className={statusColors[booking.booking_status] || "bg-gray-100"}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {booking.booking_status?.replace(/_/g, " ")}
                            </Badge>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1.5 text-emerald-600" />
                              {format(new Date(booking.check_in), "MMM d")} - {format(new Date(booking.check_out), "MMM d, yyyy")}
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1.5 text-emerald-600" />
                              {booking.nights} night{booking.nights > 1 ? "s" : ""}
                            </div>
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-1.5 text-emerald-600" />
                              {booking.guests} guest{booking.guests > 1 ? "s" : ""}
                            </div>
                          </div>
                        </div>

                        <div className="bg-emerald-50 rounded-lg p-3 md:min-w-[200px]">
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Total</span>
                              <span className="font-medium">{formatCurrency(booking.total_amount, booking.currency)}</span>
                            </div>
                            {booking.deposit_amount > 0 && (
                              <>
                                <div className="flex justify-between text-emerald-700">
                                  <span>Deposit paid ({booking.deposit_percentage}%)</span>
                                  <span className="font-semibold">{formatCurrency(booking.deposit_amount, booking.currency)}</span>
                                </div>
                                {booking.remaining_amount > 0 && (
                                  <div className="flex justify-between text-amber-700">
                                    <span>Remaining</span>
                                    <span className="font-medium">{formatCurrency(booking.remaining_amount, booking.currency)}</span>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t flex items-center justify-between">
                        <span className="text-xs text-gray-400">
                          Booked on {format(new Date(booking.created_at), "MMM d, yyyy")}
                        </span>
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/villas/${booking.villa_id}`}>View Property</Link>
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="saved">
            {trips.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No saved trips yet. Start exploring deals!</p>
                <Button asChild className="mt-4" variant="outline">
                  <Link href="/destinations">Explore Destinations</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {trips.map((trip) => (
                  <div key={trip.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium">{trip.trip_name}</h4>
                        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {trip.destination}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {format(new Date(trip.start_date), "MMM d")} - {format(new Date(trip.end_date), "MMM d")}
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {trip.guest_count} guests
                          </div>
                        </div>
                        {trip.notes && <p className="text-sm text-gray-500 mt-2">{trip.notes}</p>}
                        <Badge variant="outline" className="mt-2">
                          Saved {format(new Date(trip.created_at), "MMM d, yyyy")}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteTrip(trip.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
