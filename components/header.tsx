"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu, ChevronDown, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { CurrencySelector } from "@/components/currency-selector"

const navigationItems = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Destinations",
    href: "/destinations",
    items: [
      {
        title: "Barbados",
        href: "/destinations/barbados",
        description: "Pristine beaches and British colonial charm",
      },
      {
        title: "St. Lucia",
        href: "/destinations/st-lucia",
        description: "Dramatic Pitons and lush rainforests",
      },
      {
        title: "Jamaica",
        href: "/destinations/jamaica",
        description: "Vibrant culture and stunning coastlines",
      },
      {
        title: "St. Barthélemy",
        href: "/destinations/st-barthelemy",
        description: "French sophistication in the Caribbean",
      },
      {
        title: "All Destinations",
        href: "/destinations",
        description: "Explore all our luxury Caribbean locations",
      },
    ],
  },
  {
    title: "Journal",
    href: "/journal",
    items: [
      {
        title: "All Articles",
        href: "/journal",
        description: "Stories and insights from Caribbean luxury travel",
      },
      {
        title: "For Property Owners",
        href: "/owners",
        description: "Partner with Valar Travel to maximize your villa's potential",
      },
    ],
  },
  {
    title: "Contact",
    href: "/contact",
  },
]

export function Header() {
  const pathname = usePathname()
  const [destinationsOpen, setDestinationsOpen] = useState(false)
  const [journalOpen, setJournalOpen] = useState(false)
  const [adminOpen, setAdminOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const destinationsTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const journalTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const adminTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (destinationsTimeoutRef.current) clearTimeout(destinationsTimeoutRef.current)
      if (journalTimeoutRef.current) clearTimeout(journalTimeoutRef.current)
      if (adminTimeoutRef.current) clearTimeout(adminTimeoutRef.current)
    }
  }, [])

  const handleDestinationsEnter = () => {
    if (destinationsTimeoutRef.current) clearTimeout(destinationsTimeoutRef.current)
    setDestinationsOpen(true)
  }

  const handleDestinationsLeave = () => {
    destinationsTimeoutRef.current = setTimeout(() => {
      setDestinationsOpen(false)
    }, 150)
  }

  const handleJournalEnter = () => {
    if (journalTimeoutRef.current) clearTimeout(journalTimeoutRef.current)
    setJournalOpen(true)
  }

  const handleJournalLeave = () => {
    journalTimeoutRef.current = setTimeout(() => {
      setJournalOpen(false)
    }, 150)
  }

  const handleAdminEnter = () => {
    if (adminTimeoutRef.current) clearTimeout(adminTimeoutRef.current)
    setAdminOpen(true)
  }

  const handleAdminLeave = () => {
    adminTimeoutRef.current = setTimeout(() => {
      setAdminOpen(false)
    }, 150)
  }

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <h1 className="text-lg lg:text-xl font-serif font-medium tracking-wide text-neutral-900">
              Valar <span className="font-semibold text-emerald-800">Travel</span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            {navigationItems.map((item) => (
              <div key={item.href} className="relative">
                {item.items ? (
                  <div className="relative">
                    <button
                      className={cn(
                        "flex items-center gap-1 px-4 py-2 text-sm font-medium tracking-wide text-neutral-900 hover:text-emerald-800 transition-colors uppercase",
                        (pathname === item.href || item.items?.some((subItem) => pathname === subItem.href)) &&
                          "text-emerald-800 font-semibold",
                      )}
                      onMouseEnter={() => {
                        if (item.title === "Destinations") handleDestinationsEnter()
                        if (item.title === "Journal") handleJournalEnter()
                      }}
                      onMouseLeave={() => {
                        if (item.title === "Destinations") handleDestinationsLeave()
                        if (item.title === "Journal") handleJournalLeave()
                      }}
                      onClick={() => {
                        if (item.title === "Destinations") setDestinationsOpen(!destinationsOpen)
                        if (item.title === "Journal") setJournalOpen(!journalOpen)
                      }}
                      aria-expanded={
                        (item.title === "Destinations" && destinationsOpen) || (item.title === "Journal" && journalOpen)
                      }
                      aria-haspopup="true"
                    >
                      {item.title}
                      <ChevronDown className="w-3 h-3" />
                    </button>

                    {((item.title === "Destinations" && destinationsOpen) ||
                      (item.title === "Journal" && journalOpen)) && (
                      <div
                        className="absolute top-full left-0 mt-2 w-80 bg-white border border-neutral-200 rounded shadow-xl"
                        onMouseEnter={() => {
                          if (item.title === "Destinations") handleDestinationsEnter()
                          if (item.title === "Journal") handleJournalEnter()
                        }}
                        onMouseLeave={() => {
                          if (item.title === "Destinations") handleDestinationsLeave()
                          if (item.title === "Journal") handleJournalLeave()
                        }}
                      >
                        <div className="p-2">
                          {item.items.map((subItem) => (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              className="block p-4 hover:bg-neutral-50 transition-colors group border-b border-neutral-100 last:border-0"
                              onClick={() => {
                                if (item.title === "Destinations") setDestinationsOpen(false)
                                if (item.title === "Journal") setJournalOpen(false)
                              }}
                            >
                              <div className="text-sm font-medium tracking-wide text-emerald-800 group-hover:text-emerald-900 uppercase">
                                {subItem.title}
                              </div>
                              <p className="text-xs text-neutral-600 mt-1 leading-relaxed font-light">
                                {subItem.description}
                              </p>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "px-4 py-2 text-sm font-medium tracking-wide text-neutral-900 hover:text-emerald-800 transition-colors uppercase",
                      pathname === item.href && "text-emerald-800 font-semibold",
                    )}
                  >
                    {item.title}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Auth Buttons - Desktop */}
          <div className="hidden lg:flex items-center gap-4">
            <CurrencySelector />
            <div className="relative">
              <button
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 text-sm font-medium tracking-wide text-neutral-900 hover:text-emerald-800 transition-colors uppercase rounded hover:bg-neutral-50",
                  pathname.startsWith("/admin") && "text-emerald-800 font-semibold bg-neutral-50",
                )}
                onMouseEnter={handleAdminEnter}
                onMouseLeave={handleAdminLeave}
                onClick={() => setAdminOpen(!adminOpen)}
                aria-expanded={adminOpen}
                aria-haspopup="true"
                aria-label="Admin menu"
              >
                <Settings className="w-4 h-4" />
                Admin
                <ChevronDown className="w-3 h-3" />
              </button>

              {adminOpen && (
                <div
                  className="absolute top-full right-0 mt-2 w-64 bg-white border border-neutral-200 rounded shadow-xl"
                  onMouseEnter={handleAdminEnter}
                  onMouseLeave={handleAdminLeave}
                >
                  <div className="p-2">
                    <Link
                      href="/admin/login"
                      className="block p-3 hover:bg-emerald-50 transition-colors group border-b-2 border-emerald-200 bg-emerald-50/50"
                      onClick={() => setAdminOpen(false)}
                    >
                      <div className="text-sm font-semibold tracking-wide text-emerald-900 uppercase">
                        🔐 Admin Login
                      </div>
                      <p className="text-xs text-emerald-700 mt-1 leading-relaxed font-medium">
                        Username & password access
                      </p>
                    </Link>

                    <Link
                      href="/admin"
                      className="block p-3 hover:bg-neutral-50 transition-colors group border-b border-neutral-100"
                      onClick={() => setAdminOpen(false)}
                    >
                      <div className="text-sm font-medium tracking-wide text-emerald-800 group-hover:text-emerald-900 uppercase">
                        Dashboard
                      </div>
                      <p className="text-xs text-neutral-600 mt-1 leading-relaxed font-light">
                        Admin overview and quick access
                      </p>
                    </Link>

                    <Link
                      href="/admin/properties"
                      className="block p-3 hover:bg-neutral-50 transition-colors group border-b border-neutral-100"
                      onClick={() => setAdminOpen(false)}
                    >
                      <div className="text-sm font-medium tracking-wide text-emerald-800 group-hover:text-emerald-900 uppercase">
                        Properties
                      </div>
                      <p className="text-xs text-neutral-600 mt-1 leading-relaxed font-light">
                        Manage villas and listings
                      </p>
                    </Link>

                    <Link
                      href="/admin/blog"
                      className="block p-3 hover:bg-neutral-50 transition-colors group border-b border-neutral-100"
                      onClick={() => setAdminOpen(false)}
                    >
                      <div className="text-sm font-medium tracking-wide text-emerald-800 group-hover:text-emerald-900 uppercase">
                        Blog
                      </div>
                      <p className="text-xs text-neutral-600 mt-1 leading-relaxed font-light">
                        Manage journal articles and posts
                      </p>
                    </Link>

                    <Link
                      href="/admin/api-status"
                      className="block p-3 hover:bg-neutral-50 transition-colors group border-b border-neutral-100"
                      onClick={() => setAdminOpen(false)}
                    >
                      <div className="text-sm font-medium tracking-wide text-emerald-800 group-hover:text-emerald-900 uppercase">
                        API Status
                      </div>
                      <p className="text-xs text-neutral-600 mt-1 leading-relaxed font-light">
                        Monitor API health and performance
                      </p>
                    </Link>

                    <Link
                      href="/admin/cleanup-database"
                      className="block p-3 hover:bg-neutral-50 transition-colors group"
                      onClick={() => setAdminOpen(false)}
                    >
                      <div className="text-sm font-medium tracking-wide text-emerald-800 group-hover:text-emerald-900 uppercase">
                        Database Cleanup
                      </div>
                      <p className="text-xs text-neutral-600 mt-1 leading-relaxed font-light">
                        Maintain and optimize database
                      </p>
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <Link href="/auth/login">
              <Button
                variant="ghost"
                className="text-neutral-900 hover:text-emerald-800 hover:bg-transparent font-medium tracking-wide uppercase text-sm"
                title="For travelers and property owners"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button className="bg-emerald-800 text-white hover:bg-emerald-900 font-medium tracking-wide uppercase text-sm px-6">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                className="text-neutral-900 hover:bg-neutral-100 h-10 w-10 p-0"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[320px] sm:w-[380px] overflow-y-auto">
              <SheetHeader className="text-left pb-6 border-b border-neutral-200">
                <SheetTitle className="text-xl font-serif font-medium text-neutral-900">
                  Valar <span className="font-semibold text-emerald-800">Travel</span>
                </SheetTitle>
                <SheetDescription className="text-neutral-600 font-light text-sm">
                  Exclusive Caribbean luxury villa rentals
                </SheetDescription>
              </SheetHeader>

              <div className="flex flex-col gap-6 mt-6">
                {/* Mobile Navigation Links */}
                <nav className="flex flex-col gap-1">
                  {navigationItems.map((item) => (
                    <div key={item.href} className="space-y-1">
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center justify-between px-4 py-3 text-sm font-medium tracking-wide transition-colors hover:bg-neutral-50 uppercase",
                          pathname === item.href ? "text-emerald-800 bg-neutral-50 font-semibold" : "text-neutral-900",
                        )}
                        onClick={() => !item.items && setMobileOpen(false)}
                      >
                        {item.title}
                      </Link>

                      {/* Mobile Sub-items */}
                      {item.items && (
                        <div className="ml-4 space-y-1 border-l-2 border-neutral-200 pl-4">
                          {item.items.map((subItem) => (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              className={cn(
                                "block px-3 py-2 text-xs font-medium text-neutral-800 hover:text-emerald-800 transition-colors",
                                pathname === subItem.href && "text-emerald-800 font-semibold",
                              )}
                              onClick={() => setMobileOpen(false)}
                            >
                              {subItem.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </nav>

                {/* Mobile Auth Buttons */}
                <div className="border-t border-neutral-200 pt-6 space-y-4">
                  <div className="pb-4 border-b border-neutral-200">
                    <div className="text-xs font-medium tracking-wide text-neutral-900 mb-3 uppercase">Currency</div>
                    <CurrencySelector />
                  </div>

                  <div className="pb-4 border-b border-neutral-200">
                    <div className="text-xs font-medium tracking-wide text-neutral-900 mb-3 uppercase flex items-center gap-2">
                      <Settings className="w-3 h-3" />
                      Admin
                    </div>
                    <div className="space-y-1">
                      <Link
                        href="/admin"
                        className="block px-3 py-2 text-sm font-medium text-neutral-800 hover:text-emerald-800 hover:bg-neutral-50 transition-colors"
                        onClick={() => setMobileOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/admin/properties"
                        className="block px-3 py-2 text-sm font-medium text-neutral-800 hover:text-emerald-800 hover:bg-neutral-50 transition-colors"
                        onClick={() => setMobileOpen(false)}
                      >
                        Properties
                      </Link>
                      <Link
                        href="/admin/blog"
                        className="block px-3 py-2 text-sm font-medium text-neutral-800 hover:text-emerald-800 hover:bg-neutral-50 transition-colors"
                        onClick={() => setMobileOpen(false)}
                      >
                        Blog
                      </Link>
                      <Link
                        href="/admin/api-status"
                        className="block px-3 py-2 text-sm font-medium text-neutral-800 hover:text-emerald-800 hover:bg-neutral-50 transition-colors"
                        onClick={() => setMobileOpen(false)}
                      >
                        API Status
                      </Link>
                      <Link
                        href="/admin/cleanup-database"
                        className="block px-3 py-2 text-sm font-medium text-neutral-800 hover:text-emerald-800 hover:bg-neutral-50 transition-colors"
                        onClick={() => setMobileOpen(false)}
                      >
                        Database Cleanup
                      </Link>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Link href="/auth/login" className="block" onClick={() => setMobileOpen(false)}>
                      <Button
                        variant="outline"
                        className="w-full border-neutral-300 text-neutral-900 hover:bg-neutral-50 font-medium tracking-wide uppercase text-sm bg-transparent"
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/sign-up" className="block" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full bg-emerald-800 hover:bg-emerald-900 font-medium tracking-wide uppercase text-sm">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
