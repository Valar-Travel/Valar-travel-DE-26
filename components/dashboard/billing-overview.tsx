"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, CreditCard, DollarSign, AlertTriangle } from "lucide-react"
import { format } from "@/lib/date-utils"

interface BillingOverviewProps {
  subscription: any
}

export function BillingOverview({ subscription }: BillingOverviewProps) {
  const handleManageSubscription = async () => {
    // In a real app, this would redirect to Stripe Customer Portal
    window.open("https://billing.stripe.com/p/login/test_example", "_blank")
  }

  const handleUpgrade = () => {
    window.location.href = "/pricing"
  }

  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            No Active Subscription
          </CardTitle>
          <CardDescription>You don't have an active subscription</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-gray-600 mb-4">Upgrade to a paid plan to unlock all features and remove limitations.</p>
            <Button onClick={handleUpgrade}>View Pricing Plans</Button>
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
    <div className="space-y-6">
      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Current Plan
            </div>
            <Badge className={getStatusColor(subscription.status)}>{subscription.status}</Badge>
          </CardTitle>
          <CardDescription>{subscription.subscription_plans?.name} Plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">${subscription.subscription_plans?.price}</p>
              <p className="text-sm text-gray-600">per {subscription.subscription_plans?.interval}</p>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Next Billing</p>
              <p className="text-sm text-gray-600">
                {format(new Date(subscription.current_period_end), "MMM d, yyyy")}
              </p>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <CreditCard className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Payment Method</p>
              <p className="text-sm text-gray-600">•••• 4242</p>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button onClick={handleManageSubscription}>Manage Subscription</Button>
            <Button variant="outline" onClick={handleUpgrade}>
              Upgrade Plan
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Usage & Limits */}
      <Card>
        <CardHeader>
          <CardTitle>Usage & Limits</CardTitle>
          <CardDescription>Your current usage for this billing period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">API Calls</span>
              <span className="text-sm text-gray-600">1,247 / 10,000</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: "12.47%" }}></div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Storage Used</span>
              <span className="text-sm text-gray-600">2.3 GB / 10 GB</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: "23%" }}></div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Team Members</span>
              <span className="text-sm text-gray-600">3 / 5</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: "60%" }}></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
