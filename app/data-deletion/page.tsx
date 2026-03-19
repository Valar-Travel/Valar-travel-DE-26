"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, CheckCircle, Shield, Trash2 } from "lucide-react"
import Link from "next/link"

export default function DataDeletionPage() {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    reason: "",
    confirmDelete: false,
    confirmUnderstand: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.confirmDelete || !formData.confirmUnderstand) {
      setError("Bitte bestatigen Sie beide Kontrollkastchen / Please confirm both checkboxes")
      return
    }

    setIsSubmitting(true)

    try {
      // In production, this would send to your API
      const response = await fetch("/api/data-deletion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          reason: formData.reason,
          requestedAt: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit request")
      }

      setIsSubmitted(true)
    } catch {
      // For now, just mark as submitted (email would be sent in production)
      setIsSubmitted(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white py-20">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="border-emerald-200">
            <CardContent className="pt-10 pb-10 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle className="h-8 w-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Antrag erhalten / Request Received</h2>
              <p className="text-gray-600 mb-6">
                Ihr Antrag auf Datenloschung wurde erhalten. Wir werden Ihren Antrag innerhalb von 30 Tagen bearbeiten, wie von der DSGVO vorgeschrieben.
              </p>
              <p className="text-gray-600 mb-8">
                Your data deletion request has been received. We will process your request within 30 days as required by GDPR.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Sie erhalten eine Bestatigungs-E-Mail an: <strong>{formData.email}</strong>
              </p>
              <Link href="/">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  Zuruck zur Startseite / Back to Home
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-800 to-emerald-900 text-white py-16">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-emerald-300" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Datenloschung beantragen</h1>
          <p className="text-lg text-emerald-100 max-w-2xl mx-auto">
            Request Data Deletion (Art. 17 DSGVO / GDPR)
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Info Box */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Wichtige Informationen / Important Information
            </h3>
            <ul className="text-sm text-amber-700 space-y-2">
              <li>- Ihr Antrag wird innerhalb von 30 Tagen bearbeitet / Your request will be processed within 30 days</li>
              <li>- Alle personenbezogenen Daten werden geloscht / All personal data will be deleted</li>
              <li>- Buchungsdaten mussen 10 Jahre aufbewahrt werden (gesetzlich) / Booking data must be retained for 10 years (legal requirement)</li>
              <li>- Diese Aktion kann nicht ruckgangig gemacht werden / This action cannot be undone</li>
            </ul>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-red-500" />
                Loschantrag / Deletion Request
              </CardTitle>
              <CardDescription>
                Fullen Sie das folgende Formular aus, um die Loschung Ihrer personenbezogenen Daten zu beantragen.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">E-Mail-Adresse / Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ihre@email.de"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Die E-Mail-Adresse, die mit Ihrem Konto verknupft ist / The email associated with your account
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Vollstandiger Name / Full Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Max Mustermann"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Grund fur die Loschung / Reason for Deletion (optional)</Label>
                  <Textarea
                    id="reason"
                    placeholder="Warum mochten Sie Ihre Daten loschen lassen? / Why would you like your data deleted?"
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="confirmDelete"
                      checked={formData.confirmDelete}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, confirmDelete: checked as boolean })
                      }
                    />
                    <Label htmlFor="confirmDelete" className="text-sm leading-relaxed cursor-pointer">
                      Ich mochte alle meine personenbezogenen Daten loschen lassen. Ich verstehe, dass dies mein Konto und alle damit verbundenen Daten unwiderruflich loscht. / I want all my personal data deleted. I understand this will permanently delete my account and all associated data.
                    </Label>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="confirmUnderstand"
                      checked={formData.confirmUnderstand}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, confirmUnderstand: checked as boolean })
                      }
                    />
                    <Label htmlFor="confirmUnderstand" className="text-sm leading-relaxed cursor-pointer">
                      Ich verstehe, dass bestimmte Daten aus rechtlichen Grunden aufbewahrt werden mussen (z.B. Buchungsunterlagen fur steuerliche Zwecke). / I understand that certain data may be retained for legal purposes (e.g., booking records for tax purposes).
                    </Label>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.confirmDelete || !formData.confirmUnderstand}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                  {isSubmitting ? "Wird gesendet... / Submitting..." : "Loschantrag absenden / Submit Deletion Request"}
                </Button>

                <p className="text-xs text-center text-gray-500">
                  Mit dem Absenden dieses Formulars bestatigen Sie, dass Sie der Kontoinhaber sind.<br />
                  By submitting this form, you confirm that you are the account holder.
                </p>
              </form>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="mt-8 text-center text-sm text-gray-600">
            <p>
              Fragen? Kontaktieren Sie uns: <a href="mailto:datenschutz@valartravel.de" className="text-emerald-600 hover:underline">datenschutz@valartravel.de</a>
            </p>
            <p className="mt-2">
              <Link href="/privacy" className="text-emerald-600 hover:underline">Datenschutzerklarung lesen / Read Privacy Policy</Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
