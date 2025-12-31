import { cn } from "@/lib/utils"
import { ExternalLink, Info } from "lucide-react"

interface AffiliateDisclosureProps {
  variant?: "default" | "inline" | "compact" | "footer"
  className?: string
}

export function AffiliateDisclosure({ variant = "default", className }: AffiliateDisclosureProps) {
  const baseClasses = "text-muted-foreground"

  if (variant === "inline") {
    return (
      <div className={cn("flex items-center gap-1 text-xs", baseClasses, className)}>
        <Info className="w-3 h-3" />
        <span>We earn from qualifying purchases</span>
      </div>
    )
  }

  if (variant === "compact") {
    return <p className={cn("text-xs", baseClasses, className)}>* Affiliate links - we may earn commission</p>
  }

  if (variant === "footer") {
    return (
      <div className={cn("space-y-2", className)}>
        <h4 className="font-semibold text-sm">Affiliate Disclosure</h4>
        <p className={cn("text-xs leading-relaxed", baseClasses)}>
          Valar Travel participates in affiliate programs with various travel partners. When you book through our links,
          we may earn a commission at no extra cost to you. This helps us maintain our free service and find you the
          best deals.
        </p>
      </div>
    )
  }

  return (
    <div className={cn("bg-muted/50 border rounded-lg p-4 space-y-2", className)}>
      <div className="flex items-center gap-2">
        <ExternalLink className="w-4 h-4 text-primary" />
        <h4 className="font-semibold text-sm">Affiliate Partnership Notice</h4>
      </div>
      <p className={cn("text-sm leading-relaxed", baseClasses)}>
        This page contains affiliate links to our trusted travel partners. When you book accommodations, flights, or
        activities through these links, we may receive a commission at no additional cost to you. These partnerships
        allow us to offer you competitive prices and maintain our free comparison service.
      </p>
    </div>
  )
}

// Default export for backward compatibility
export default AffiliateDisclosure
