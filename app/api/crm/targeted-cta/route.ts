import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { checkCRMTablesExist } from "@/lib/crm-table-check"

interface CTAData {
  type: string
  headline: string
  description: string
  buttonText: string
  buttonLink: string
  icon: string
}

const defaultCTA: CTAData = {
  type: "default",
  headline: "Find Your Perfect Caribbean Escape",
  description: "Discover handpicked luxury villas across the Caribbean islands",
  buttonText: "Browse Villas",
  buttonLink: "/villas",
  icon: "plane",
}

export async function GET(req: NextRequest) {
  try {
    const crmEnabled = await checkCRMTablesExist()

    if (!crmEnabled) {
      return NextResponse.json({ cta: defaultCTA, crm_enabled: false })
    }

    const supabase = await createClient()

    // Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    let cta: CTAData = { ...defaultCTA }

    if (user?.email) {
      const { data: customer } = await supabase.from("customer_profiles").select("*").eq("email", user.email).single()

      if (customer) {
        // Target based on segment
        switch (customer.customer_segment) {
          case "prospect":
            cta = {
              type: "deal",
              headline: "First-Time Visitor Discount",
              description: "Get 10% off your first villa booking when you sign up today",
              buttonText: "Claim Offer",
              buttonLink: "/auth/sign-up?offer=first10",
              icon: "gift",
            }
            break

          case "engaged":
            if (customer.preferred_destinations?.length > 0) {
              const destination = customer.preferred_destinations[0]
              cta = {
                type: "destination",
                headline: `New Villas in ${destination}`,
                description: `We just added new properties in your favorite destination. Don't miss out!`,
                buttonText: "Explore Now",
                buttonLink: `/destinations/${destination.toLowerCase()}`,
                icon: "plane",
              }
            }
            break

          case "loyal":
            cta = {
              type: "upgrade",
              headline: "Upgrade to VIP Status",
              description: "Unlock exclusive deals, priority booking, and personal concierge service",
              buttonText: "Learn More",
              buttonLink: "/pricing",
              icon: "star",
            }
            break

          case "vip":
            cta = {
              type: "booking",
              headline: "Your VIP Experience Awaits",
              description: "As a VIP member, enjoy exclusive access to our most luxurious properties",
              buttonText: "Book Now",
              buttonLink: "/villas?tier=luxury",
              icon: "star",
            }
            break

          case "dormant":
            cta = {
              type: "deal",
              headline: "We Miss You! Here's 15% Off",
              description: "It's been a while. Come back and save on your next Caribbean getaway",
              buttonText: "Redeem Offer",
              buttonLink: "/villas?promo=COMEBACK15",
              icon: "gift",
            }
            break
        }
      }
    }

    return NextResponse.json({ cta, crm_enabled: true })
  } catch (error: any) {
    console.warn("Targeted-CTA API error:", error?.message)
    return NextResponse.json({ cta: defaultCTA, crm_enabled: false })
  }
}
