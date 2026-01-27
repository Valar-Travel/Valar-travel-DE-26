import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import type { Metadata } from "next"
import { CheckoutClient } from "./checkout-client"

export async function generateMetadata({ params }: { params: Promise<{ villaId: string }> }): Promise<Metadata> {
  const { villaId } = await params
  const villa = await getVillaData(villaId)

  return {
    title: villa ? `Checkout - ${villa.name} | Valar Travel` : "Checkout | Valar Travel",
    description: villa
      ? `Complete your booking for ${villa.name} in ${villa.location}. Choose flexible payment options.`
      : "Complete your villa booking with flexible payment options.",
  }
}

async function getVillaData(id: string) {
  const supabase = await createClient()

  // Try to find by UUID in scraped_luxury_properties
  if (id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
    const { data: scrapedVilla } = await supabase
      .from("scraped_luxury_properties")
      .select("*")
      .eq("id", id)
      .maybeSingle()

    if (scrapedVilla) {
      return scrapedVilla
    }
  }

  // Try to find by slug
  const { data: villaBySlug } = await supabase
    .from("scraped_luxury_properties")
    .select("*")
    .ilike("name", `%${id.replace(/-/g, " ")}%`)
    .maybeSingle()

  if (villaBySlug) return villaBySlug

  // Try villas table
  const { data: villaFromVillas } = await supabase.from("villas").select("*").eq("slug", id).maybeSingle()

  if (villaFromVillas) return villaFromVillas

  if (!isNaN(Number(id))) {
    const { data: villaById } = await supabase.from("villas").select("*").eq("id", Number(id)).maybeSingle()
    if (villaById) return villaById
  }

  return null
}

export default async function CheckoutPage({ params }: { params: Promise<{ villaId: string }> }) {
  const { villaId } = await params
  const villa = await getVillaData(villaId)

  if (!villa) {
    notFound()
  }

  const villaData = {
    id: villa.id,
    name: villa.name,
    location: villa.location || "Caribbean",
    description: villa.description || "",
    pricePerNight: villa.price_per_night || villa.price || 0,
    currency: villa.currency || "USD",
    maxGuests: villa.max_guests || villa.guests || 10,
    bedrooms: villa.bedrooms || null,
    bathrooms: villa.bathrooms || null,
    amenities: villa.amenities || [],
    images: villa.images || [],
    rating: villa.rating || null,
  }

  return <CheckoutClient villa={villaData} />
}
