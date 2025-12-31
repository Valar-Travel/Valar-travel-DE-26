"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, CreditCard, AlertCircle } from "lucide-react"
import { format } from "@/lib/date-utils"

interface SubscriptionCardProps {
  subscription: any
}

export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Subscription
          </CardTitle>
          <CardDescription>You don't have an active subscription</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <AlertCircle className="h-8 w-8 text-yellow-500" />
            <div>
              <p className="text-sm text-gray-600">Upgrade to a paid plan to unlock all features</p>
              <Button className="mt-2" size="sm">
                View Plans
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "canceled":
        return "bg-red-100 text-red-800"
      case "past_due":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Subscription
          </div>
          <Badge className={getStatusColor(subscription.status)}>{subscription.status}</Badge>
        </CardTitle>
        <CardDescription>{subscription.subscription_plans?.name} Plan</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-900">Current Period</p>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {format(new Date(subscription.current_period_start), "MMM d")} -{" "}
              {format(new Date(subscription.current_period_end), "MMM d, yyyy")}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Next Billing</p>
            <p className="text-sm text-gray-600">{format(new Date(subscription.current_period_end), "MMM d, yyyy")}</p>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Button variant="outline" size="sm">
            Manage Subscription
          </Button>
          <Button variant="outline" size="sm">
            View Invoices
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
