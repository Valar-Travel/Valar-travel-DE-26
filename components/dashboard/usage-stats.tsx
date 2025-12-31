import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BarChart3, FileText, Zap } from "lucide-react"

interface UsageStatsProps {
  userId: string
}

export async function UsageStats({ userId }: UsageStatsProps) {
  const supabase = createClient()

  // Get usage statistics (example queries)
  const { data: savedTrips } = await supabase.from("saved_trips").select("id").eq("user_id", userId)

  const { data: searchHistory } = await supabase.from("search_history").select("id").eq("session_id", userId)

  const stats = [
    {
      title: "Saved Trips",
      value: savedTrips?.length || 0,
      limit: 10,
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: "Searches This Month",
      value: searchHistory?.length || 0,
      limit: 100,
      icon: BarChart3,
      color: "text-green-600",
    },
    {
      title: "Loyalty Points",
      value: 0,
      limit: 1000,
      icon: Zap,
      color: "text-yellow-600",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage Statistics</CardTitle>
        <CardDescription>Your current usage and limits</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            const percentage = (stat.value / stat.limit) * 100

            return (
              <div key={stat.title} className="flex items-center space-x-4">
                <Icon className={`h-5 w-5 ${stat.color}`} />
                <div className="flex-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{stat.title}</span>
                    <span className="text-gray-600">
                      {stat.value} / {stat.limit}
                    </span>
                  </div>
                  <Progress value={percentage} className="mt-1" />
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
