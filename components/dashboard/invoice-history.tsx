"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, FileText } from "lucide-react"
import { format } from "@/lib/date-utils"

interface InvoiceHistoryProps {
  userId: string
}

export function InvoiceHistory({ userId }: InvoiceHistoryProps) {
  // Mock invoice data - in a real app, this would come from Stripe or your database
  const invoices = [
    {
      id: "inv_001",
      date: new Date("2024-01-01"),
      amount: 29.99,
      status: "paid",
      description: "Pro Plan - January 2024",
    },
    {
      id: "inv_002",
      date: new Date("2023-12-01"),
      amount: 29.99,
      status: "paid",
      description: "Pro Plan - December 2023",
    },
    {
      id: "inv_003",
      date: new Date("2023-11-01"),
      amount: 29.99,
      status: "paid",
      description: "Pro Plan - November 2023",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleDownload = (invoiceId: string) => {
    // In a real app, this would download the invoice PDF
    console.log("Downloading invoice:", invoiceId)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Invoice History
        </CardTitle>
        <CardDescription>Download and view your past invoices</CardDescription>
      </CardHeader>
      <CardContent>
        {invoices.length === 0 ? (
          <div className="text-center py-6">
            <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">No invoices found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <p className="font-medium text-gray-900">{invoice.description}</p>
                    <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    {format(invoice.date, "MMM d, yyyy")} • ${invoice.amount}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleDownload(invoice.id)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
