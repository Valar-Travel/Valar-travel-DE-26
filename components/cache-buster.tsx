"use client"

import { useEffect } from "react"

const APP_VERSION = "1.0.0" // Version tracking for cache busting

export function CacheBuster() {
  useEffect(() => {
    try {
      const storedVersion = localStorage.getItem("app_version")

      if (storedVersion !== APP_VERSION) {
        // Clear all caches
        localStorage.clear()
        sessionStorage.clear()

        // Clear service workers if any
        if ("serviceWorker" in navigator) {
          navigator.serviceWorker.getRegistrations().then((registrations) => {
            registrations.forEach((registration) => registration.unregister())
          })
        }

        // Clear cache storage
        if ("caches" in window) {
          caches.keys().then((names) => {
            names.forEach((name) => caches.delete(name))
          })
        }

        // Store new version
        localStorage.setItem("app_version", APP_VERSION)

        // Force hard reload
        window.location.reload()
      }
    } catch {
      // localStorage may not be available in some contexts
    }
  }, [])

  return null
}
