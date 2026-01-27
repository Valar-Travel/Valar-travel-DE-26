import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// SEO optimize description
function seoOptimizeDescription(description: string, propertyName: string): string {
  if (!description || description.length < 50) {
    return `Experience luxury at ${propertyName}, an exquisite Barbados villa offering world-class amenities, stunning Caribbean views, and unparalleled comfort. This premium vacation rental features elegant interiors, private outdoor spaces, and easy access to pristine beaches. Perfect for families, couples, or groups seeking an unforgettable Caribbean getaway.`
  }

  // Clean up the description
  let optimized = description
    .replace(/\s+/g, " ")
    .replace(/\.{2,}/g, ".")
    .trim()

  // Add SEO keywords if not present
  const seoKeywords = ["Barbados", "luxury villa", "Caribbean", "vacation rental", "beachfront", "private pool"]

  const descLower = optimized.toLowerCase()
  const missingKeywords = seoKeywords.filter((kw) => !descLower.includes(kw.toLowerCase()))

  // Add location context if missing
  if (!descLower.includes("barbados")) {
    optimized = optimized.replace(/^(.+?[.!?])/, `$1 Located in beautiful Barbados,`)
  }

  // Ensure description ends properly
  if (!optimized.match(/[.!?]$/)) {
    optimized += "."
  }

  return optimized
}

// Extract amenities from description
function extractAmenities(description: string, existingAmenities: string[]): string[] {
  const amenityPatterns = [
    { pattern: /\b(private\s+)?pool\b/i, amenity: "Private Pool" },
    { pattern: /\bjacuzzi|hot\s+tub\b/i, amenity: "Jacuzzi/Hot Tub" },
    { pattern: /\bbeach\s*(access|front)?\b/i, amenity: "Beach Access" },
    { pattern: /\binfinity\s+pool\b/i, amenity: "Infinity Pool" },
    { pattern: /\b(air\s+condition|a\/c|ac)\b/i, amenity: "Air Conditioning" },
    { pattern: /\bceiling\s+fan/i, amenity: "Ceiling Fans" },
    { pattern: /\b(full|fully\s+equipped)\s+kitchen\b/i, amenity: "Full Kitchen" },
    { pattern: /\b(private\s+)?chef\b/i, amenity: "Private Chef Available" },
    { pattern: /\bbbq|grill|barbecue\b/i, amenity: "BBQ/Grill" },
    { pattern: /\bwi-?fi|wifi|internet\b/i, amenity: "High-Speed WiFi" },
    { pattern: /\b(smart\s+)?tv|television\b/i, amenity: "Smart TV" },
    { pattern: /\bocean\s+view|sea\s+view\b/i, amenity: "Ocean View" },
    { pattern: /\bgarden|tropical\s+garden\b/i, amenity: "Tropical Garden" },
    { pattern: /\bterrace|patio|deck\b/i, amenity: "Outdoor Terrace" },
    { pattern: /\bhousekeep|maid\s+service\b/i, amenity: "Daily Housekeeping" },
    { pattern: /\bconcierge\b/i, amenity: "Concierge Service" },
    { pattern: /\blaundry|washer|dryer\b/i, amenity: "Laundry Facilities" },
    { pattern: /\bgym|fitness\b/i, amenity: "Fitness Center" },
    { pattern: /\bsecurity|alarm\b/i, amenity: "Security System" },
    { pattern: /\bparking|garage\b/i, amenity: "Private Parking" },
  ]

  const foundAmenities = new Set<string>(existingAmenities || [])

  for (const { pattern, amenity } of amenityPatterns) {
    if (pattern.test(description)) {
      foundAmenities.add(amenity)
    }
  }

  return Array.from(foundAmenities)
    .filter((a) => a && a.trim().length > 0)
    .slice(0, 30)
}

// GET request - visit /api/admin/fix-properties to fix all properties
export async function GET() {
  try {
    const supabase = await createClient()

    // Get all properties
    const { data: properties, error: fetchError } = await supabase
      .from("scraped_luxury_properties")
      .select("*")
      .order("created_at", { ascending: false })

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    if (!properties || properties.length === 0) {
      return NextResponse.json({ message: "No properties found" })
    }

    let updatedCount = 0
    let locationFixed = 0
    let descriptionOptimized = 0
    let amenitiesEnhanced = 0

    for (const property of properties) {
      const updates: Record<string, any> = {}

      // 1. Fix location to Barbados
      if (property.location !== "Barbados") {
        updates.location = "Barbados"
        locationFixed++
      }

      // 2. SEO optimize description
      const optimizedDescription = seoOptimizeDescription(property.description || "", property.name || "Luxury Villa")
      if (optimizedDescription !== property.description) {
        updates.description = optimizedDescription
        descriptionOptimized++
      }

      // 3. Enhance amenities
      const currentAmenities = Array.isArray(property.amenities) ? property.amenities : []
      const enhancedAmenities = extractAmenities(property.description || "", currentAmenities)
      if (enhancedAmenities.length > currentAmenities.length) {
        updates.amenities = enhancedAmenities
        amenitiesEnhanced++
      }

      // Update if there are changes
      if (Object.keys(updates).length > 0) {
        updates.updated_at = new Date().toISOString()

        const { error: updateError } = await supabase
          .from("scraped_luxury_properties")
          .update(updates)
          .eq("id", property.id)

        if (!updateError) {
          updatedCount++
        }
      }
    }

    return NextResponse.json({
      success: true,
      totalProperties: properties.length,
      updatedCount,
      locationFixed,
      descriptionOptimized,
      amenitiesEnhanced,
      message: `Fixed ${updatedCount} properties: ${locationFixed} locations set to Barbados, ${descriptionOptimized} descriptions SEO optimized, ${amenitiesEnhanced} amenities enhanced`,
    })
  } catch (error) {
    console.error("[v0] Error fixing properties:", error)
    return NextResponse.json({ error: "Failed to fix properties" }, { status: 500 })
  }
}
