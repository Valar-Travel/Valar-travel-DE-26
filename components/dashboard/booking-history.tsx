"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, Trash2 } from "lucide-react"
import { format } from "@/lib/date-utils"

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

export function BookingHistory({ userId }: { userId: string }) {
  const [trips, setTrips] = useState<SavedTrip[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchTrips()
  }, [userId])

  const fetchTrips = async () => {
    const { data, error } = await supabase
      .from("saved_trips")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (!error && data) {
      setTrips(data)
    }
    setLoading(false)
  }

  const deleteTrip = async (tripId: string) => {
    const { error } = await supabase.from("saved_trips").delete().eq("id", tripId)

    if (!error) {
      setTrips(trips.filter((trip) => trip.id !== tripId))
    }
  }

  if (loading) {
    return <div className="animate-pulse">Loading bookings...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Bookings</CardTitle>
      </CardHeader>
      <CardContent>
        {trips.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No bookings yet. Start exploring deals!</p>
        ) : (
          <div className="space-y-4">
            {trips.map((trip) => (
              <div key={trip.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium">{trip.trip_name}</h4>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
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
      </CardContent>
    </Card>
  )
}
