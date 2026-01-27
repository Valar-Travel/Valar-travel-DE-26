"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react"
import { useState } from "react"

export function Footer() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setMessage("")

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus("success")
        setMessage(data.message || "Successfully subscribed!")
        setEmail("")
      } else {
        setStatus("error")
        setMessage(data.error || "Failed to subscribe")
      }
    } catch {
      setStatus("error")
      setMessage("An error occurred. Please try again.")
    }

    setTimeout(() => {
      setStatus("idle")
      setMessage("")
    }, 5000)
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 lg:px-6 py-10 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-8">
          {/* Company Info - Full width on mobile */}
          <div className="col-span-2 md:col-span-2 lg:col-span-1 space-y-4">
            <h3 className="text-xl font-bold text-emerald-400">Valar Travel</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Curated luxury villa rentals in the Caribbean's most exclusive destinations.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a href="tel:+4916092527436" className="hover:text-emerald-400 transition-colors">
                  +49 160 92527436
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a href="mailto:hello@valartravel.de" className="hover:text-emerald-400 transition-colors break-all">
                  hello@valartravel.de
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>Caribbean Luxury Villas</span>
              </div>
              <div className="pt-2">
                <a
                  href="https://wa.me/4916092527436"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  WhatsApp Us
                </a>
              </div>
            </div>
          </div>

          {/* Caribbean Destinations */}
          <div className="space-y-4">
            <h4 className="text-base md:text-lg font-semibold text-white">Destinations</h4>
            <div className="space-y-2">
              <Link
                href="/destinations/barbados"
                className="block text-gray-300 hover:text-emerald-400 transition-colors text-sm"
              >
                Barbados
              </Link>
              <Link
                href="/destinations/st-lucia"
                className="block text-gray-300 hover:text-emerald-400 transition-colors text-sm"
              >
                St. Lucia
              </Link>
              <Link
                href="/destinations/jamaica"
                className="block text-gray-300 hover:text-emerald-400 transition-colors text-sm"
              >
                Jamaica
              </Link>
              <Link
                href="/destinations/st-barthelemy"
                className="block text-gray-300 hover:text-emerald-400 transition-colors text-sm"
              >
                St. Barthélemy
              </Link>
            </div>
          </div>

          {/* Villas & Services */}
          <div className="space-y-4">
            <h4 className="text-base md:text-lg font-semibold text-white">Villas</h4>
            <div className="space-y-2">
              <Link href="/villas" className="block text-gray-300 hover:text-emerald-400 transition-colors text-sm">
                Browse Villas
              </Link>
              <Link
                href="/property-prom"
                className="block text-gray-300 hover:text-emerald-400 transition-colors text-sm"
              >
                Property Prom
              </Link>
              <Link href="/owners" className="block text-gray-300 hover:text-emerald-400 transition-colors text-sm">
                For Owners
              </Link>
              <Link
                href="/collaborations"
                className="block text-gray-300 hover:text-emerald-400 transition-colors text-sm"
              >
                Partnerships
              </Link>
              <Link href="/contact" className="block text-gray-300 hover:text-emerald-400 transition-colors text-sm">
                Contact
              </Link>
            </div>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="text-base md:text-lg font-semibold text-white">Resources</h4>
            <div className="space-y-2">
              <Link href="/about" className="block text-gray-300 hover:text-emerald-400 transition-colors text-sm">
                About Us
              </Link>
              <Link href="/journal" className="block text-gray-300 hover:text-emerald-400 transition-colors text-sm">
                Journal
              </Link>
              <Link href="/affiliate" className="block text-gray-300 hover:text-emerald-400 transition-colors text-sm">
                Affiliates
              </Link>
              <Link
                href="/owner-portal"
                className="block text-gray-300 hover:text-emerald-400 transition-colors text-sm"
              >
                Owner Portal
              </Link>
            </div>
          </div>

          {/* Newsletter - Full width on mobile */}
          <div className="col-span-2 md:col-span-2 lg:col-span-1 space-y-4">
            <h4 className="text-base md:text-lg font-semibold text-white">Stay Connected</h4>
            <p className="text-gray-300 text-sm">Subscribe for exclusive offers and Caribbean travel inspiration.</p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "loading"}
                required
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 h-11"
                aria-label="Email address for newsletter"
              />
              <Button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white disabled:opacity-50 h-11"
              >
                {status === "loading" ? "Subscribing..." : "Subscribe"}
              </Button>
              {message && (
                <p className={`text-sm ${status === "success" ? "text-emerald-400" : "text-red-400"}`} role="alert">
                  {message}
                </p>
              )}
            </form>
            <div className="flex gap-3 pt-2">
              <Link
                href="https://facebook.com/valartravel"
                className="text-gray-400 hover:text-emerald-400 transition-colors p-2 -ml-2"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" aria-hidden="true" />
              </Link>
              <Link
                href="https://twitter.com/valartravel"
                className="text-gray-400 hover:text-emerald-400 transition-colors p-2"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" aria-hidden="true" />
              </Link>
              <Link
                href="https://instagram.com/valartravel"
                className="text-gray-400 hover:text-emerald-400 transition-colors p-2"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" aria-hidden="true" />
              </Link>
              <Link
                href="https://youtube.com/@valartravel"
                className="text-gray-400 hover:text-emerald-400 transition-colors p-2"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Better mobile stacking */}
        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <p className="text-gray-400 text-xs sm:text-sm">© 2025 Valar Travel. All rights reserved.</p>
            <span className="text-gray-600 hidden sm:inline">•</span>
            <p className="text-gray-400 text-xs sm:text-sm">Contact: Sarah Kuhmichel</p>
          </div>
          <div className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-6 text-xs sm:text-sm">
            <Link href="/privacy" className="text-gray-400 hover:text-emerald-400 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-emerald-400 transition-colors">
              Terms
            </Link>
            <Link href="/impressum" className="text-gray-400 hover:text-emerald-400 transition-colors">
              Impressum
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
