import type { Metadata } from "next"
import type React from "react"
import { Suspense } from "react"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

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
      { url: "/favicon.png", type: "image/png" },
      { url: "/logo.png", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: "/favicon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://valartravel.de",
    siteName: "Valar Travel",
    title: "Valar Travel - Luxury Caribbean Villa Rentals",
    description: "Discover exclusive luxury villa rentals in Barbados, St. Lucia, Jamaica, and St. Barthélemy.",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
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
        </div>
      </body>
    </html>
  )
}
