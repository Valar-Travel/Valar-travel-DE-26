import type { Metadata } from "next"
import type React from "react"
import { Suspense } from "react"
import Script from "next/script"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { OrganizationStructuredData } from "@/components/structured-data"
import "./globals.css"
import { SpeedInsightsClient } from "@/components/speed-insights-client"
import { CacheBuster } from "@/components/cache-buster"
import { AiChatWidget } from "@/components/ai-chat-widget"

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
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  verification: {
    google: "gYQdxaKthmGIFLzO2siTQJmAEO9uRbvbGFwPPKem22k",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://valartravel.de",
    siteName: "Valar Travel",
    title: "Valar Travel - Luxury Caribbean Villa Rentals",
    description: "Discover exclusive luxury villa rentals in Barbados, St. Lucia, Jamaica, and St. Barthélemy.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Valar Travel - Luxury Caribbean Villas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Valar Travel - Luxury Caribbean Villa Rentals",
    description: "Discover exclusive luxury villa rentals in Barbados, St. Lucia, Jamaica, and St. Barthélemy.",
    creator: "@valartravel",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
    generator: 'v0.app'
}

export const dynamic = "force-dynamic"
export const revalidate = 0

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-Z8TBX8M6X0" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-Z8TBX8M6X0');
          `}
        </Script>
        <OrganizationStructuredData />
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        <meta name="version" content={`1.0.0-${Date.now()}`} />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <CacheBuster />
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
        <AiChatWidget />
        <SpeedInsightsClient />
      </body>
    </html>
  )
}
