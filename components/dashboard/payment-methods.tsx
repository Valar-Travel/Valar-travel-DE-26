"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Plus, Trash2 } from "lucide-react"

interface PaymentMethodsProps {
  userId: string
}

export function PaymentMethods({ userId }: PaymentMethodsProps) {
  // Mock payment methods - in a real app, this would come from Stripe
  const paymentMethods = [
    {
      id: "pm_001",
      type: "card",
      brand: "visa",
      last4: "4242",
      expMonth: 12,
      expYear: 2025,
      isDefault: true,
    },
  ]

  const handleAddPaymentMethod = () => {
    // In a real app, this would open Stripe Elements or redirect to Stripe
    console.log("Adding payment method")
  }

  const handleDeletePaymentMethod = (paymentMethodId: string) => {
    // In a real app, this would delete the payment method via Stripe API
    console.log("Deleting payment method:", paymentMethodId)
  }

  const getCardIcon = (brand: string) => {
    // You could return different icons based on card brand
    return <CreditCard className="h-5 w-5" />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Methods
        </CardTitle>
        <CardDescription>Manage your payment methods</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div key={method.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getCardIcon(method.brand)}
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900">•••• {method.last4}</p>
                    {method.isDefault && (
                      <Badge variant="secondary" className="text-xs">
                        Default
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    Expires {method.expMonth}/{method.expYear}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeletePaymentMethod(method.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <Button variant="outline" className="w-full bg-transparent" onClick={handleAddPaymentMethod}>
            <Plus className="h-4 w-4 mr-2" />
            Add Payment Method
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
