import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "@/lib/date-utils"
import { Activity, Search, Heart, MapPin } from "lucide-react"

interface RecentActivityProps {
  userId: string
}

export async function RecentActivity({ userId }: RecentActivityProps) {
  const supabase = createClient()

  // Get recent activity (example queries)
  const { data: recentSearches } = await supabase
    .from("search_history")
    .select("*")
    .eq("session_id", userId)
    .order("created_at", { ascending: false })
    .limit(5)

  const { data: recentTrips } = await supabase
    .from("saved_trips")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(3)

  const activities = [
    ...(recentSearches?.map((search) => ({
      id: search.id,
      type: "search",
      title: `Searched for ${search.destination || "destinations"}`,
      description: `${search.results_count || 0} results found`,
      timestamp: search.created_at,
      icon: Search,
    })) || []),
    ...(recentTrips?.map((trip) => ({
      id: trip.id,
      type: "trip",
      title: `Saved trip to ${trip.destination}`,
      description: `${trip.guest_count} guests • ${trip.saved_deals?.length || 0} deals`,
      timestamp: trip.created_at,
      icon: Heart,
    })) || []),
  ]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 8)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activity
        </CardTitle>
        <CardDescription>Your latest actions and interactions</CardDescription>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-6">
            <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">No recent activity</p>
            <p className="text-xs text-gray-500">Start exploring to see your activity here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => {
              const Icon = activity.icon
              return (
                <div key={activity.id} className="flex items-start space-x-3">
                  <Icon className="h-4 w-4 text-gray-500 mt-1" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-600">{activity.description}</p>
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {activity.type}
                  </Badge>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
