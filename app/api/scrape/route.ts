import { NextResponse } from "next/server"
import * as cheerio from "cheerio"
import { createClient } from "@/lib/supabase/server"

// Function to detect destination from source URL domain
function getDestinationFromSourceUrl(sourceUrl: string): string {
  const url = sourceUrl.toLowerCase()

  // Barbados-specific websites
  if (
    url.includes("sunnyvillaholidays.com") ||
    url.includes("villasbarbados.com") ||
    url.includes("barbadosdreamvillas.com") ||
    url.includes("barbadosluxuryvillas.com") ||
    url.includes("realtorsbarbados.com")
  ) {
    return "Barbados"
  }

  // Jamaica-specific websites
  if (
    url.includes("jamaicavillas.com") ||
    url.includes("villasinjamaica.com") ||
    url.includes("jamaicaluxuryvillas.com")
  ) {
    return "Jamaica"
  }

  // St. Lucia-specific websites
  if (url.includes("stluciavillas.com") || url.includes("villasinstlucia.com")) {
    return "St. Lucia"
  }

  // St. Barth-specific websites
  if (url.includes("stbarthvillas.com") || url.includes("wimco.com") || url.includes("villasofstbarths.com")) {
    return "St. Barthélemy"
  }

  return ""
}

export async function POST(request: Request) {
  try {
    const { url, maxProperties = 50 } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    console.log("[v0] ========== SCRAPER STARTED ==========")
    console.log("[v0] URL:", url)
    console.log("[v0] Max properties:", maxProperties)

    const supabase = createClient()

    // Fetch the page with better headers to avoid being blocked
    console.log("[v0] Fetching page...")
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        "Sec-Ch-Ua": '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        "Sec-Ch-Ua-Mobile": "?0",
        "Sec-Ch-Ua-Platform": '"macOS"',
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        "Upgrade-Insecure-Requests": "1",
      },
    })

    console.log("[v0] Fetch response status:", response.status)

    if (!response.ok) {
      // Check if blocked by Cloudflare
      const text = await response.text()
      console.log("[v0] Error response text (first 500 chars):", text.substring(0, 500))
      if (text.includes("Cloudflare") || text.includes("security service") || response.status === 403) {
        return NextResponse.json(
          {
            error: `This website (${new URL(url).hostname}) is protected by Cloudflare and cannot be scraped automatically. Try these alternatives:\n\n• sunnyvillaholidays.com\n• villasbarbados.com\n• exceptionvillas.com`,
            blocked: true,
          },
          { status: 403 },
        )
      }
      return NextResponse.json({ error: `Failed to fetch: ${response.status}` }, { status: response.status })
    }

    const html = await response.text()
    console.log("[v0] HTML length:", html.length)
    const $ = cheerio.load(html)

    // Determine if this is a single property page or a listing page
    const urlPath = new URL(url).pathname
    console.log("[v0] URL path:", urlPath)

    const isSingleProperty =
      urlPath.includes("/properties/") ||
      urlPath.includes("/property/") ||
      urlPath.includes("/villa/") ||
      urlPath.includes("/listing/") ||
      $('[class*="single-property"]').length > 0 ||
      $("#listing_description").length > 0 ||
      $(".property-detail").length > 0

    console.log("[v0] Is single property:", isSingleProperty)

    let propertyLinks: string[] = []

    if (isSingleProperty) {
      // Single property page - scrape directly
      console.log("[v0] Detected single property page, scraping directly")
      propertyLinks = [url]
    } else {
      // Listing page - find property links
      console.log("[v0] Detected listing page, finding property links")

      const linkSelectors = [
        'a[href*="/properties/"]',
        'a[href*="/property/"]',
        'a[href*="/villa/"]',
        'a[href*="/listing/"]',
        ".property-item a",
        ".listing-item a",
        ".property-card a",
        '[class*="property"] a[href]',
        '[class*="listing"] a[href]',
      ]

      const foundLinks = new Set<string>()
      const baseUrl = new URL(url).origin

      for (const selector of linkSelectors) {
        const count = $(selector).length
        if (count > 0) {
          console.log(`[v0] Selector "${selector}" found ${count} elements`)
        }
        $(selector).each((_, el) => {
          let href = $(el).attr("href")
          if (href) {
            // Remove anchors and query params for deduplication
            href = href.split("#")[0].split("?")[0]

            if (href.startsWith("/")) {
              href = baseUrl + href
            }

            // Filter out non-property links
            if (
              href.includes("/properties/") ||
              href.includes("/property/") ||
              href.includes("/villa/") ||
              href.includes("/listing/")
            ) {
              // Exclude blog posts, category pages, etc.
              if (
                !href.includes("/blog/") &&
                !href.includes("/category/") &&
                !href.includes("/tag/") &&
                !href.includes("/city/") &&
                !href.includes("/area/") &&
                !href.includes("/listings/") &&
                !href.includes("/page/")
              ) {
                foundLinks.add(href)
              }
            }
          }
        })
      }

      propertyLinks = Array.from(foundLinks).slice(0, maxProperties)
      console.log("[v0] Found", propertyLinks.length, "unique property links")
      console.log("[v0] Property links:", propertyLinks.slice(0, 5))
    }

    if (propertyLinks.length === 0) {
      console.log("[v0] No property links found!")
      return NextResponse.json({
        error: "No properties found on this page. Try a direct property URL or a listing page.",
        properties: [],
        count: 0,
      })
    }

    // Scrape each property
    const properties = []

    for (let i = 0; i < propertyLinks.length; i++) {
      const propertyUrl = propertyLinks[i]
      console.log(`[v0] ---- Scraping property ${i + 1}/${propertyLinks.length} ----`)
      console.log(`[v0] URL: ${propertyUrl}`)

      try {
        const propertyResponse = await fetch(propertyUrl, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
          },
        })

        console.log(`[v0] Property fetch status: ${propertyResponse.status}`)
        if (!propertyResponse.ok) {
          console.log(`[v0] Failed to fetch property, skipping`)
          continue
        }

        const propertyHtml = await propertyResponse.text()
        console.log(`[v0] Property HTML length: ${propertyHtml.length}`)
        const property$ = cheerio.load(propertyHtml)

        // Look for property-specific elements that indicate this is a real property page
        const hasPropertySignals =
          property$("#listing_description").length > 0 ||
          property$("#listing_ammenities").length > 0 ||
          property$(".property-title").length > 0 ||
          property$(".listing-title").length > 0 ||
          property$('[class*="property-gallery"]').length > 0 ||
          property$('[class*="listing-gallery"]').length > 0 ||
          property$(".check-availability").length > 0 ||
          property$('a[href*=".jpg"]').length > 3 || // Multiple property images
          propertyUrl.includes("/properties/") ||
          propertyUrl.includes("/property/") ||
          propertyUrl.includes("/villa/")

        console.log(`[v0] Has property signals: ${hasPropertySignals}`)

        // Only skip if this is clearly a blog post AND doesn't have property signals
        const isBlogPost =
          (property$('article[class*="blog"]').length > 0 ||
            property$(".blog-post").length > 0 ||
            property$(".post-content").length > 0) &&
          !hasPropertySignals

        if (isBlogPost) {
          console.log("[v0] Skipping blog post page")
          continue
        }

        const propertyData = extractPropertyData(property$, propertyUrl)
        console.log(`[v0] Extracted name: "${propertyData.name}"`)
        console.log(`[v0] Extracted images: ${propertyData.images.length}`)
        console.log(`[v0] Extracted amenities: ${propertyData.amenities.length}`)
        console.log(`[v0] Extracted description length: ${propertyData.description.length}`)

        if (propertyData.name && propertyData.name.length > 2) {
          properties.push(propertyData)
          console.log(`[v0] SUCCESS: Added "${propertyData.name}" to results`)
        } else {
          console.log("[v0] Skipping - no valid name found")
        }

        // Small delay to be polite
        await new Promise((resolve) => setTimeout(resolve, 500))
      } catch (err) {
        console.error(`[v0] Error scraping ${propertyUrl}:`, err)
      }
    }

    console.log("[v0] ========== SCRAPING COMPLETE ==========")
    console.log("[v0] Total properties scraped:", properties.length)

    // Save to database
    const savedProperties = []

    for (const property of properties) {
      try {
        const { data: existing } = await supabase
          .from("scraped_luxury_properties")
          .select("id")
          .eq("source_url", property.source_url)
          .maybeSingle()

        if (existing) {
          const { data, error } = await supabase
            .from("scraped_luxury_properties")
            .update({
              name: property.name,
              description: property.description,
              images: property.images,
              amenities: property.amenities,
              price_per_night: property.price_per_night,
              location: property.location,
              updated_at: new Date().toISOString(),
            })
            .eq("source_url", property.source_url)
            .select()
            .single()

          if (error) {
            console.error("[v0] Error updating property:", error.message)
          } else {
            console.log("[v0] Updated property:", data?.name)
            savedProperties.push({
              ...data,
              bedrooms: property.bedrooms,
              bathrooms: property.bathrooms,
              max_guests: property.max_guests,
            })
          }
        } else {
          const { data, error } = await supabase
            .from("scraped_luxury_properties")
            .insert({
              name: property.name,
              location: property.location,
              rating: property.rating,
              price_per_night: property.price_per_night,
              currency: property.currency,
              description: property.description,
              amenities: property.amenities,
              images: property.images,
              affiliate_links: property.affiliate_links,
              source_url: property.source_url,
            })
            .select()
            .single()

          if (error) {
            console.error("[v0] Error inserting property:", error.message)
          } else {
            console.log("[v0] Inserted property:", data?.name, "- ID:", data?.id)
            savedProperties.push({
              ...data,
              bedrooms: property.bedrooms,
              bathrooms: property.bathrooms,
              max_guests: property.max_guests,
            })
          }
        }
      } catch (err) {
        console.error("[v0] Error saving property:", err)
      }
    }

    return NextResponse.json({
      success: true,
      count: savedProperties.length,
      properties: savedProperties,
    })
  } catch (error) {
    console.error("[v0] Scraper error:", error)
    return NextResponse.json({ error: "Failed to scrape properties" }, { status: 500 })
  }
}

function extractPropertyData($: cheerio.CheerioAPI, sourceUrl: string) {
  // Extract name
  let name = ""
  const nameSelectors = [
    "h1.entry-title",
    "h1.property-title",
    "h1.listing-title",
    ".property-title h1",
    "h1",
    'meta[property="og:title"]',
  ]

  for (const selector of nameSelectors) {
    if (selector.startsWith("meta")) {
      name = $(selector).attr("content") || ""
    } else {
      name = $(selector).first().text().trim()
    }
    if (name && name.length > 2) break
  }

  // Clean up name
  name = name.replace(/\s*[-|].*$/, "").trim()

  // Extract location
  let location = ""
  const locationSelectors = [
    ".property-location",
    ".listing-location",
    '[class*="location"]',
    'a[href*="/city/"]',
    'a[href*="/area/"]',
    ".address",
  ]

  for (const selector of locationSelectors) {
    const text = $(selector).first().text().trim()
    if (text && text.length > 2 && text.length < 100) {
      location = text
      break
    }
  }

  // If no location found, try to detect from source URL
  if (!location || location === "Caribbean") {
    const detectedDestination = getDestinationFromSourceUrl(sourceUrl)
    if (detectedDestination) {
      location = detectedDestination
    } else {
      location = "Caribbean"
    }
  }

  // Extract price
  let price = 0
  const priceText = $("body").text()
  const priceMatch = priceText.match(/\$[\d,]+(?:\s*[-–]\s*(?:night|Night|per night|\/night))?/)
  if (priceMatch) {
    price = Number.parseInt(priceMatch[0].replace(/[$,]/g, "")) || 0
  }
  // Also try From $X pattern
  const fromPriceMatch = priceText.match(/From\s*\$\s*([\d,]+)/i)
  if (fromPriceMatch && !price) {
    price = Number.parseInt(fromPriceMatch[1].replace(/,/g, "")) || 0
  }

  let description = ""

  // Method 1: Look for listing description section
  const descSection = $("#listing_description, .listing-description, .property-description, #description")
  if (descSection.length > 0) {
    // Get all text content after the "Listing Description" header
    const descHtml = descSection.html() || ""
    const desc$ = cheerio.load(descHtml)
    // Remove the header itself
    desc$("h4, h3, h2, .section-title").remove()
    description = desc$.text().trim()
  }

  // Method 2: Find paragraphs in content area
  if (!description || description.length < 100) {
    const contentParagraphs: string[] = []
    $(".entry-content p, .property-content p, article p, .content p").each((_, el) => {
      const text = $(el).text().trim()
      if (text.length > 50 && !text.includes("SEASON DATES") && !text.includes("NIGHTLY RATE")) {
        contentParagraphs.push(text)
      }
    })
    if (contentParagraphs.length > 0) {
      description = contentParagraphs.join("\n\n")
    }
  }

  // Method 3: Meta description fallback
  if (!description || description.length < 50) {
    description = $('meta[name="description"]').attr("content") || ""
  }

  console.log("[v0] Extracted description length:", description.length)

  const amenities: string[] = []

  // Method 1: Look for amenities section text content
  const amenitySections = [
    "#listing_ammenities",
    "#collapseFour",
    ".amenities",
    '[class*="amenities"]',
    ".features-list",
    ".property-features",
  ]

  for (const selector of amenitySections) {
    const section = $(selector)
    if (section.length > 0) {
      // Get the raw text and split by newlines
      const sectionText = section.text()
      const lines = sectionText.split(/\n/)

      for (const line of lines) {
        const cleaned = line.trim().replace(/\s+/g, " ")
        // Filter valid amenity lines
        if (
          cleaned.length > 2 &&
          cleaned.length < 100 &&
          !cleaned.match(/^(AMENITIES|Features|Amenities|Details)$/i) &&
          !amenities.includes(cleaned)
        ) {
          amenities.push(cleaned)
        }
      }
    }
  }

  // Method 2: Try specific list items
  if (amenities.length === 0) {
    const listSelectors = [
      "#listing_ammenities li",
      "#collapseFour li",
      ".amenities li",
      ".features li",
      '[class*="amenity"] li',
      '[class*="feature"] li',
    ]

    for (const selector of listSelectors) {
      $(selector).each((_, el) => {
        const text = $(el).text().trim().replace(/\s+/g, " ")
        if (text.length > 2 && text.length < 100 && !amenities.includes(text)) {
          amenities.push(text)
        }
      })
    }
  }

  // Method 3: Parse from description text for common amenities
  if (amenities.length === 0 && description) {
    const commonAmenities = [
      "Pool",
      "Wi-Fi",
      "WiFi",
      "Air Conditioning",
      "A/C",
      "Beach Access",
      "Kitchen",
      "Dishwasher",
      "Washing Machine",
      "Television",
      "TV",
      "Cable",
      "Safe",
      "Garden",
      "Patio",
      "Balcony",
      "Parking",
      "Gym",
      "Spa",
      "Golf",
      "Tennis",
      "Jacuzzi",
      "Hot Tub",
      "BBQ",
      "Grill",
      "Outdoor Dining",
      "Ocean View",
      "Sea View",
      "Beachfront",
      "Staff",
      "Cook",
      "Maid",
      "Concierge",
      "Security",
    ]

    for (const amenity of commonAmenities) {
      if (description.toLowerCase().includes(amenity.toLowerCase())) {
        amenities.push(amenity)
      }
    }
  }

  console.log("[v0] Found amenities:", amenities.length, amenities.slice(0, 5).join(", "))

  let bedrooms = 0
  let bathrooms = 0
  let maxGuests = 2

  // Try to extract from title first (e.g., "4 BR (Villa)")
  const titleBedroomMatch = name.match(/(\d+)\s*BR/i)
  if (titleBedroomMatch) {
    bedrooms = Number.parseInt(titleBedroomMatch[1]) || 0
  }

  // Extract from page text
  const pageText = $("body").text()

  // Look for bedroom counts
  if (!bedrooms) {
    const bedroomPatterns = [/(\d+)\s*(?:bed)?rooms?/i, /(\d+)\s*BR/i, /(\d+)-bedroom/i, /Bedrooms?\s*[:\s]*(\d+)/i]
    for (const pattern of bedroomPatterns) {
      const match = pageText.match(pattern)
      if (match) {
        const num = Number.parseInt(match[1])
        if (num > 0 && num < 20) {
          bedrooms = num
          break
        }
      }
    }
  }

  // Look for bathroom counts
  const bathroomPatterns = [/(\d+)\s*bath(?:room)?s?/i, /Bathrooms?\s*[:\s]*(\d+)/i]
  for (const pattern of bathroomPatterns) {
    const match = pageText.match(pattern)
    if (match) {
      const num = Number.parseInt(match[1])
      if (num > 0 && num < 20) {
        bathrooms = num
        break
      }
    }
  }

  // Look for guest/occupancy counts
  const guestPatterns = [
    /(\d+)\s*(?:guests?|persons?|people)/i,
    /(?:sleeps?|accommodates?)\s*(\d+)/i,
    /Occupancy\s*[:\s]*(\d+)/i,
    /(\d+)\s*Persons?\s*Occupancy/i,
  ]
  for (const pattern of guestPatterns) {
    const match = pageText.match(pattern)
    if (match) {
      const num = Number.parseInt(match[1])
      if (num > 0 && num < 50) {
        maxGuests = num
        break
      }
    }
  }

  // Default guests based on bedrooms if not found
  if (maxGuests === 2 && bedrooms > 0) {
    maxGuests = bedrooms * 2
  }

  console.log("[v0] Property details - Beds:", bedrooms, "Baths:", bathrooms, "Guests:", maxGuests)

  // Extract images
  const images: string[] = []
  const seenUrls = new Set<string>()

  // Priority selectors for gallery images
  const imageSelectors = [
    // Lightbox/gallery links
    'a[href*=".jpg"]',
    'a[href*=".jpeg"]',
    'a[href*=".png"]',
    'a[href*=".webp"]',
    "a[data-fancybox] img",
    "a[data-lightbox] img",
    // Gallery containers
    ".gallery img",
    ".property-gallery img",
    ".slider img",
    ".carousel img",
    '[class*="gallery"] img',
    '[class*="slider"] img',
    // Featured images
    ".featured-image img",
    ".property-image img",
    "article img",
    ".entry-content img",
  ]

  // First, try to get high-res images from lightbox links
  $('a[href*=".jpg"], a[href*=".jpeg"], a[href*=".png"]').each((_, el) => {
    const href = $(el).attr("href")
    if (href && !seenUrls.has(href)) {
      // Filter out theme/icon images
      if (
        !href.includes("theme") &&
        !href.includes("icon") &&
        !href.includes("logo") &&
        !href.includes("avatar") &&
        !href.includes("placeholder") &&
        !href.includes("defaultimage")
      ) {
        seenUrls.add(href)
        images.push(href)
      }
    }
  })

  // Then get images from img tags if needed
  if (images.length < 5) {
    for (const selector of imageSelectors) {
      $(selector).each((_, el) => {
        const src = $(el).attr("src") || $(el).attr("data-src") || $(el).attr("data-lazy-src")
        if (src && !seenUrls.has(src)) {
          // Filter criteria
          const width = Number.parseInt($(el).attr("width") || "0")
          const height = Number.parseInt($(el).attr("height") || "0")
          const isLargeEnough = (width === 0 && height === 0) || (width >= 200 && height >= 150)

          if (
            isLargeEnough &&
            !src.includes("theme") &&
            !src.includes("icon") &&
            !src.includes("logo") &&
            !src.includes("avatar") &&
            !src.includes("placeholder") &&
            !src.includes("defaultimage") &&
            !src.includes("gravatar")
          ) {
            seenUrls.add(src)
            images.push(src)
          }
        }
      })
    }
  }

  console.log("[v0] Found", images.length, "images for:", name)

  return {
    name: name.slice(0, 500),
    location,
    rating: 4.5,
    price_per_night: price,
    currency: "USD",
    description: description.slice(0, 5000),
    amenities: [...new Set(amenities)].slice(0, 30),
    images: images.slice(0, 25),
    affiliate_links: {},
    source_url: sourceUrl,
    bedrooms,
    bathrooms,
    max_guests: maxGuests,
  }
}

export async function GET() {
  return NextResponse.json({ message: "Property scraper API. Use POST with {url} to scrape." })
}
