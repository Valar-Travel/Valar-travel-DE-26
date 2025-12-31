import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface InternalLink {
  href: string
  label: string
  description?: string
}

interface InternalLinksProps {
  title?: string
  links: InternalLink[]
  variant?: "inline" | "cards" | "footer"
}

export function InternalLinks({ title, links, variant = "inline" }: InternalLinksProps) {
  if (variant === "inline") {
    return (
      <nav aria-label="Related pages" className="flex flex-wrap gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm text-emerald-700 hover:text-emerald-800 hover:underline inline-flex items-center gap-1"
          >
            {link.label}
            <ChevronRight className="w-3 h-3" />
          </Link>
        ))}
      </nav>
    )
  }

  if (variant === "cards") {
    return (
      <section className="py-8" aria-labelledby="related-links-title">
        {title && (
          <h3 id="related-links-title" className="text-lg font-semibold mb-4">
            {title}
          </h3>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="p-4 rounded-lg border bg-card hover:bg-accent hover:border-emerald-200 transition-colors group"
            >
              <span className="font-medium text-foreground group-hover:text-emerald-700 transition-colors">
                {link.label}
              </span>
              {link.description && <p className="text-sm text-muted-foreground mt-1">{link.description}</p>}
            </Link>
          ))}
        </div>
      </section>
    )
  }

  // Footer variant
  return (
    <nav aria-label="Site navigation" className="space-y-2">
      {title && <h4 className="font-semibold text-sm mb-3">{title}</h4>}
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}

// Pre-defined link sets for reuse
export const destinationLinks: InternalLink[] = [
  { href: "/destinations/barbados", label: "Barbados Villas", description: "Luxury beachfront properties" },
  { href: "/destinations/st-lucia", label: "St. Lucia Villas", description: "Piton views & rainforest retreats" },
  { href: "/destinations/jamaica", label: "Jamaica Villas", description: "Vibrant island escapes" },
  { href: "/destinations/st-barthelemy", label: "St. Barthélemy Villas", description: "Exclusive French Caribbean" },
]

export const serviceLinks: InternalLink[] = [
  { href: "/villas", label: "Browse All Villas" },
  { href: "/contact", label: "Contact Concierge" },
  { href: "/about", label: "About Valar Travel" },
  { href: "/owners", label: "List Your Property" },
]

export const popularVillaLinks: InternalLink[] = [
  { href: "/villas?location=barbados", label: "Barbados Luxury Villas" },
  { href: "/villas?bedrooms=5", label: "5+ Bedroom Estates" },
  { href: "/villas?amenities=pool", label: "Villas with Private Pool" },
  { href: "/villas?amenities=beach", label: "Beachfront Properties" },
]
