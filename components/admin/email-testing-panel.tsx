"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Mail, CheckCircle, XCircle, Send, Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface EmailResult {
  template: string
  success: boolean
  error?: string
}

interface TestResponse {
  success: boolean
  message: string
  summary?: {
    total: number
    successful: number
    failed: number
  }
  details?: EmailResult[]
  recipient?: string
  timestamp?: string
  note?: string
  error?: string
}

export function EmailTestingPanel() {
  const [email, setEmail] = useState("sarahkuhmichel5@gmail.com")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<TestResponse | null>(null)

  const handleSendTestEmails = async () => {
    if (!email) {
      setResult({
        success: false,
        message: "Please enter a valid email address",
        error: "Email address is required",
      })
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/test-all-emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        message: "Failed to send test emails",
        error: error instanceof Error ? error.message : "Unknown error occurred",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Email Template Testing</h1>
        <p className="text-gray-600 mt-2">Test all Resend email templates and verify they are working correctly</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-600" />
              Send Test Emails
            </CardTitle>
            <CardDescription>Send all 8 email templates to any email address for testing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Recipient Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="test@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <Button onClick={handleSendTestEmails} disabled={loading} className="w-full" size="lg">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending Emails...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send All Test Emails
                </>
              )}
            </Button>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                This will send approximately 10 emails total (Contact and Partnership templates send 2 emails each: one
                notification + one auto-reply).
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Available Templates</CardTitle>
            <CardDescription>8 email templates configured</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-600" />
                <span>Welcome Email</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-600" />
                <span>Contact Form (2 emails)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-600" />
                <span>Booking Inquiry</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-600" />
                <span>Destination Info</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-600" />
                <span>Pricing Information</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-600" />
                <span>Cancellation Policy</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-600" />
                <span>Villa Features</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-600" />
                <span>Partnership (2 emails)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {result && (
        <Card className={result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {result.success ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-green-900">Test Emails Sent Successfully!</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-red-600" />
                  <span className="text-red-900">Failed to Send Test Emails</span>
                </>
              )}
            </CardTitle>
            <CardDescription className={result.success ? "text-green-700" : "text-red-700"}>
              {result.message}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {result.summary && (
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 border">
                  <p className="text-sm text-gray-600">Total Templates</p>
                  <p className="text-2xl font-bold text-gray-900">{result.summary.total}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <p className="text-sm text-green-600">Successful</p>
                  <p className="text-2xl font-bold text-green-700">{result.summary.successful}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-red-200">
                  <p className="text-sm text-red-600">Failed</p>
                  <p className="text-2xl font-bold text-red-700">{result.summary.failed}</p>
                </div>
              </div>
            )}

            {result.recipient && (
              <div className="bg-white rounded-lg p-4 border">
                <p className="text-sm text-gray-600 mb-1">Sent to</p>
                <p className="font-mono text-sm font-medium text-gray-900">{result.recipient}</p>
                {result.timestamp && (
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(result.timestamp).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "medium",
                    })}
                  </p>
                )}
              </div>
            )}

            {result.note && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">{result.note}</AlertDescription>
              </Alert>
            )}

            {result.details && result.details.length > 0 && (
              <div className="bg-white rounded-lg border overflow-hidden">
                <div className="border-b bg-gray-50 px-4 py-2">
                  <h3 className="font-semibold text-gray-900">Detailed Results</h3>
                </div>
                <div className="divide-y">
                  {result.details.map((detail, index) => (
                    <div key={index} className="px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {detail.success ? (
                          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                        )}
                        <span className="font-medium text-gray-900">{detail.template}</span>
                      </div>
                      <Badge variant={detail.success ? "default" : "destructive"}>
                        {detail.success ? "Sent" : "Failed"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm font-mono">{result.error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
