import type { Metadata } from "next"
import type React from "react"
import { Suspense } from "react"
import { headers } from "next/headers"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CookieConsent } from "@/components/cookie-consent"
import { SpeedInsights } from "@vercel/speed-insights/next"

// Build deployment trigger - v0 deployment verification
export const metadata: Metadata = {
  metadataBase: new URL("https://valartravel.de"),
  title: {
    default: "Valar Travel - Luxury Caribbean Villa Rentals",
    template: "%s | Valar Travel",
  },
  description:
    "Discover exclusive luxury villa rentals in Barbados, St. Lucia, Jamaica, and St. Barthélemy. Handpicked Caribbean properties with personalized concierge service.",
  keywords: [
    "luxury villas",
    "Caribbean rentals",
    "Barbados villas",
    "St. Lucia villas",
    "Jamaica villas",
    "St. Barthélemy villas",
    "luxury vacation rentals",
    "Caribbean vacation homes",
  ],
  authors: [{ name: "Valar Travel" }],
  creator: "Valar Travel",
  publisher: "Valar Travel",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.ico",
    other: [
      { rel: "mask-icon", url: "/favicon.svg", color: "#059669" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "https://valartravel.de",
    siteName: "Valar Travel",
    title: "Valar Travel - Luxury Caribbean Villa Rentals",
    description: "Discover exclusive luxury villa rentals in Barbados, St. Lucia, Jamaica, and St. Barthélemy.",
  },
    generator: 'v0.app'
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check if current path is an auth or onboarding page (for minimal layout)
  const headersList = await headers()
  const pathname = headersList.get("x-pathname") || ""
  // Only apply minimal layout for specific auth routes, not dashboard
  const isMinimalLayoutPage = pathname.startsWith("/auth") || pathname === "/onboarding"
  
  // For auth/onboarding pages, render minimal layout (no header/footer)
  if (isMinimalLayoutPage) {
    return (
      <html lang="de" suppressHydrationWarning>
        <body className="min-h-screen bg-background font-sans antialiased" suppressHydrationWarning>
          {children}
          <SpeedInsights />
        </body>
      </html>
    )
  }
  
  return (
    <html lang="de" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased" suppressHydrationWarning>
        <div className="relative flex min-h-screen flex-col">
          <Suspense
            fallback={
              <header className="bg-green-700 text-white sticky top-0 z-50 border-b border-green-600/30 shadow-lg">
                <div className="container mx-auto px-4 lg:px-6">
                  <div className="flex items-center justify-between h-16">
                    <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-white">Valar Travel</h1>
                  </div>
                </div>
              </header>
            }
          >
            <Header />
          </Suspense>
          <main className="flex-1">{children}</main>
          <Footer />
          <CookieConsent />
        </div>
        <SpeedInsights />
      </body>
    </html>
  )
}
