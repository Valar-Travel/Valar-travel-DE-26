"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, Settings, Shield } from "lucide-react"
import Link from "next/link"

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
    functional: false,
  })

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent")
    if (!consent) {
      setShowBanner(true)
    }
  }, [])

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    }
    localStorage.setItem("cookie-consent", JSON.stringify(allAccepted))
    setShowBanner(false)
    setShowSettings(false)
  }

  const handleAcceptSelected = () => {
    localStorage.setItem("cookie-consent", JSON.stringify(preferences))
    setShowBanner(false)
    setShowSettings(false)
  }

  const handleRejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
    }
    localStorage.setItem("cookie-consent", JSON.stringify(onlyNecessary))
    setShowBanner(false)
    setShowSettings(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center p-4">
      <Card className="w-full max-w-2xl bg-white shadow-2xl">
        <CardContent className="p-6">
          {!showSettings ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Shield className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">We Value Your Privacy</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    We use cookies to enhance your browsing experience, provide personalized content, analyze our
                    traffic, and improve our services. By clicking "Accept All", you consent to our use of cookies. You
                    can customize your preferences or learn more in our{" "}
                    <Link href="/privacy-policy" className="text-blue-600 hover:underline">
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button onClick={handleAcceptAll} className="bg-blue-600 hover:bg-blue-700 text-white flex-1">
                  Accept All Cookies
                </Button>
                <Button onClick={() => setShowSettings(true)} variant="outline" className="flex-1">
                  <Settings className="h-4 w-4 mr-2" />
                  Customize
                </Button>
                <Button onClick={handleRejectAll} variant="ghost" className="flex-1">
                  Reject All
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg text-gray-900">Cookie Preferences</h3>
                <Button onClick={() => setShowSettings(false)} variant="ghost" size="sm">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Necessary Cookies</h4>
                    <p className="text-sm text-gray-600">Required for basic site functionality and security.</p>
                  </div>
                  <div className="text-sm text-gray-500 font-medium">Always Active</div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Analytics Cookies</h4>
                    <p className="text-sm text-gray-600">Help us understand how visitors interact with our website.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) => setPreferences((prev) => ({ ...prev, analytics: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Marketing Cookies</h4>
                    <p className="text-sm text-gray-600">
                      Used to deliver personalized advertisements and track campaign performance.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={(e) => setPreferences((prev) => ({ ...prev, marketing: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Functional Cookies</h4>
                    <p className="text-sm text-gray-600">
                      Enable enhanced functionality like chat support and personalization.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.functional}
                      onChange={(e) => setPreferences((prev) => ({ ...prev, functional: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button onClick={handleAcceptSelected} className="bg-blue-600 hover:bg-blue-700 text-white flex-1">
                  Save Preferences
                </Button>
                <Button onClick={handleAcceptAll} variant="outline" className="flex-1 bg-transparent">
                  Accept All
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
