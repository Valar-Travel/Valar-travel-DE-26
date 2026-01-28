import { NextResponse } from "next/server"
import * as cheerio from "cheerio"
import { createClient } from "@/lib/supabase/server"
import type { NextRequest } from "next/server"

// Function to detect destination from source URL domain
function getDestinationFromSourceUrl(sourceUrl: string): string {
  const url = sourceUrl.toLowerCase()

  // Barbados-specific websites (most specific first)
  if (
    url.includes("villasbarbados.com") ||
    url.includes("barbadosdreamvillas.com") ||
    url.includes("barbadosluxuryvillas.com") ||
    url.includes("realtorsbarbados.com") ||
    url.includes("alleynescarbayproperties.com")
  ) {
    return "Barbados"
  }

  // Jamaica-specific websites
  if (
    url.includes("jamaicavillas.com") ||
    url.includes("villasinjamaica.com") ||
    url.includes("jamaicaluxuryvillas.com") ||
    url.includes("tryallclub.com") ||
    url.includes("villasatthetryall.com") ||
    url.includes("jamaicaoceanclifvilla.com") ||
    url.includes("jamaicavillasbylindalsmith.com") ||
    url.includes("thinkingofjamaica.com") ||
    url.includes("islandoutpost.com")
  ) {
    return "Jamaica"
  }

  // St. Maarten-specific websites
  if (
    url.includes("stmaartenvillarentals.com") ||
    url.includes("sxmvillas.com") ||
    url.includes("stmartinvillas.com") ||
    url.includes("islandproperties.com") ||
    url.includes("sintmaarten")
  ) {
    return "St. Maarten"
  }

  // Antigua-specific websites
  if (
    url.includes("antiguavillas.com") ||
    url.includes("villasofantigua.com") ||
    url.includes("bluewaterscharter.com") ||
    url.includes("luxuryvillasantigua.com")
  ) {
    return "Antigua"
  }

  // Anguilla-specific websites (NOT sunnyvillaholidays - that's multi-destination)
  if (url.includes("anguillavillas.com") || url.includes("anguilla-beaches.com")) {
    return "Anguilla"
  }

  // St. Lucia-specific websites
  if (url.includes("stluciavillas.com") || url.includes("villasinstlucia.com")) {
    return "St. Lucia"
  }

  // St. Barth-specific websites
  if (url.includes("stbarthvillas.com") || url.includes("wimco.com") || url.includes("villasofstbarths.com")) {
    return "St. Barthélemy"
  }

  // Turks and Caicos
  if (url.includes("tcivillarentals.com") || url.includes("gracebayrentals.com")) {
    return "Turks and Caicos"
  }

  // Generic keyword matching (only if no specific site matched)
  if (url.includes("barbados")) return "Barbados"
  if (url.includes("jamaica")) return "Jamaica"
  if (url.includes("stmaarten") || url.includes("st-maarten") || url.includes("sintmaarten") || url.includes("sxm"))
    return "St. Maarten"
  if (url.includes("antigua")) return "Antigua"
  if (url.includes("anguilla")) return "Anguilla"
  if (url.includes("stlucia") || url.includes("st-lucia") || url.includes("saintlucia")) return "St. Lucia"
  if (url.includes("stbarth") || url.includes("st-barth") || url.includes("stbarts")) return "St. Barthélemy"
  if (url.includes("turksandcaicos") || url.includes("providenciales")) return "Turks and Caicos"

  return ""
}

function getDestinationFromContent(html: string): string {
  const content = html.toLowerCase()

  // Check for location mentions in content (priority order - most specific keywords first)
  const locationKeywords = [
    {
      keywords: ["montego bay", "ocho rios", "negril", "port antonio", "kingston jamaica", "seven mile beach jamaica"],
      location: "Jamaica",
    },
    {
      keywords: ["meads bay", "shoal bay", "rendezvous bay anguilla", "anguilla beaches"],
      location: "Anguilla",
    },
    {
      keywords: ["bridgetown", "holetown", "speightstown", "platinum coast", "west coast barbados"],
      location: "Barbados",
    },
    { keywords: ["castries", "soufriere", "rodney bay", "pitons"], location: "St. Lucia" },
    { keywords: ["gustavia", "st. jean", "st jean beach"], location: "St. Barthélemy" },
    { keywords: ["grace bay", "providenciales", "turks and caicos"], location: "Turks and Caicos" },
    { keywords: ["jolly harbour", "english harbour antigua"], location: "Antigua" },
    {
      keywords: [
        "philipsburg",
        "simpson bay",
        "maho beach",
        "orient bay",
        "great bay",
        "cole bay",
        "dutch side",
        "french side",
      ],
      location: "St. Maarten",
    },
    {
      keywords: ["dickenson bay", "half moon bay", "shirley heights", "nelsons dockyard", "st johns antigua"],
      location: "Antigua",
    },
  ]

  for (const { keywords, location } of locationKeywords) {
    for (const keyword of keywords) {
      if (content.includes(keyword)) {
        return location
      }
    }
  }

  // Less specific - just country names (check after specific locations)
  if (content.includes("jamaica")) return "Jamaica"
  if (content.includes("barbados")) return "Barbados"
  if (content.includes("anguilla")) return "Anguilla"
  if (content.includes("st. maarten") || content.includes("st maarten") || content.includes("sint maarten"))
    return "St. Maarten"
  if (content.includes("antigua")) return "Antigua"

  return ""
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url, maxProperties = 50, destination } = body

    // Destination is required
    if (!destination) {
      return NextResponse.json(
        { error: "Destination is required. Please select a destination from the dropdown." },
        { status: 400 },
      )
    }

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    let cleanUrl = url.trim()

    // Check for corrupted URLs with multiple http/https
    const httpsCount = (cleanUrl.match(/https?:\/\//g) || []).length
    if (httpsCount > 1) {
      return NextResponse.json(
        {
          error:
            "Invalid URL: The URL appears to be corrupted (contains multiple http/https). Please provide a clean URL.",
        },
        { status: 400 },
      )
    }

    // Validate URL format
    try {
      const urlObj = new URL(cleanUrl)
      if (!urlObj.hostname || urlObj.hostname.length < 4) {
        throw new Error("Invalid hostname")
      }
      cleanUrl = urlObj.href
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format. Please provide a valid URL (e.g., https://example.com/properties)" },
        { status: 400 },
      )
    }

    console.log("[v0] ========== SCRAPER STARTED ==========")
    console.log("[v0] URL:", cleanUrl)
    console.log("[v0] Max properties:", maxProperties)
    console.log("[v0] User-specified destination:", destination)

    const supabase = await createClient()

    // Fetch the page with better headers to avoid being blocked
    console.log("[v0] Fetching page...")
    const response = await fetch(cleanUrl, {
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
            error: `This website (${new URL(cleanUrl).hostname}) is protected by Cloudflare and cannot be scraped automatically. Try these alternatives:\n\n• villasbarbados.com\n• jamaicavillas.com\n• exceptionvillas.com`,
            blocked: true,
          },
          { status: 403 },
        )
      }

      // Handle database errors from external sites
      if (text.includes("database connection") || text.includes("Database Error") || response.status === 500) {
        return NextResponse.json(
          {
            error: `The website (${new URL(cleanUrl).hostname}) is currently experiencing server issues (their database is down). Please try again later or use a different villa listing site.`,
            serverError: true,
          },
          { status: 503 },
        )
      }

      // Handle rate limiting
      if (response.status === 429) {
        return NextResponse.json(
          {
            error: `The website (${new URL(cleanUrl).hostname}) is rate limiting requests. Please wait a few minutes before trying again.`,
            rateLimited: true,
          },
          { status: 429 },
        )
      }

      return NextResponse.json({ error: `Failed to fetch: ${response.status}` }, { status: response.status })
    }

    const html = await response.text()
    console.log("[v0] HTML length:", html.length)
    const $ = cheerio.load(html)

    // Determine if this is a single property page or a listing page
    const urlPath = new URL(cleanUrl).pathname
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
      propertyLinks = [cleanUrl]
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
      const baseUrl = new URL(cleanUrl).origin

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

        const propertyData = extractPropertyData(property$, propertyUrl, destination)
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

function extractPropertyData($: cheerio.CheerioAPI, sourceUrl: string, userDestination?: string) {
  console.log("[v0] extractPropertyData called with userDestination:", userDestination)

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

  let location = ""

  if (userDestination && userDestination.trim()) {
    location = userDestination.trim()
    console.log("[v0] USING USER DESTINATION:", location)
  } else {
    // Only try to extract location from page if no user destination
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

    if (!location || location === "Caribbean") {
      const detectedDestinationFromUrl = getDestinationFromSourceUrl(sourceUrl)
      const detectedDestinationFromContent = getDestinationFromContent($.html() || "")
      location = detectedDestinationFromUrl || detectedDestinationFromContent || "Caribbean"
      console.log("[v0] Auto-detected destination:", location)
    }
  }

  console.log("[v0] FINAL LOCATION for property:", location)

  // Extract price - improved logic with multiple strategies
  let price = 0
  
  // Strategy 1: Look for price in specific price containers first (most reliable)
  const priceSelectors = [
    '.price',
    '.property-price',
    '.listing-price',
    '[class*="price"]',
    '.rate',
    '.nightly-rate',
    '[class*="rate"]',
    '.cost',
    '[data-price]',
  ]
  
  for (const selector of priceSelectors) {
    const priceEl = $(selector).first()
    if (priceEl.length > 0) {
      const priceContent = priceEl.text()
      // Look for nightly rate pattern: $XXX /night or $XXX per night
      const nightlyMatch = priceContent.match(/\$\s*([\d,]+)\s*(?:\/\s*night|per\s*night|nightly)/i)
      if (nightlyMatch) {
        const parsedPrice = Number.parseInt(nightlyMatch[1].replace(/,/g, ""))
        if (parsedPrice >= 100 && parsedPrice <= 50000) {
          price = parsedPrice
          console.log("[v0] Found price in container:", price, "from selector:", selector)
          break
        }
      }
      // Look for "From $XXX" pattern
      const fromMatch = priceContent.match(/(?:from|starting)\s*\$\s*([\d,]+)/i)
      if (fromMatch) {
        const parsedPrice = Number.parseInt(fromMatch[1].replace(/,/g, ""))
        if (parsedPrice >= 100 && parsedPrice <= 50000) {
          price = parsedPrice
          console.log("[v0] Found 'from' price in container:", price)
          break
        }
      }
    }
  }
  
  // Strategy 2: Look for price tables or rate sections
  if (!price) {
    const rateTableText = $('table, .rates, .pricing, [class*="rate-table"]').text()
    const rateMatches = rateTableText.match(/\$\s*([\d,]+)\s*(?:\/\s*night|per\s*night|nightly)?/gi)
    if (rateMatches && rateMatches.length > 0) {
      // Find the lowest reasonable price (likely the starting rate)
      const prices = rateMatches
        .map(m => Number.parseInt(m.replace(/[$,\s]/g, "")))
        .filter(p => p >= 100 && p <= 50000)
        .sort((a, b) => a - b)
      if (prices.length > 0) {
        price = prices[0] // Use the lowest price as the "from" price
        console.log("[v0] Found price in rate table:", price)
      }
    }
  }
  
  // Strategy 3: Look for structured patterns in the body text
  if (!price) {
    const pageText = $("body").text()
    
    // Pattern priority: "From $X per night" > "$X / night" > "$X per night" > "From $X"
    const patterns = [
      /(?:from|starting\s+(?:at|from)?)\s*\$\s*([\d,]+)\s*(?:\/\s*night|per\s*night)/i,
      /\$\s*([\d,]+)\s*(?:\/\s*night|per\s*night|nightly|\/night)/i,
      /(?:nightly\s+rate|rate)\s*[:;]?\s*\$\s*([\d,]+)/i,
      /(?:from|starting)\s*\$\s*([\d,]+)/i,
    ]
    
    for (const pattern of patterns) {
      const match = pageText.match(pattern)
      if (match) {
        const parsedPrice = Number.parseInt(match[1].replace(/,/g, ""))
        // Validate the price is in a reasonable range for luxury villas ($100 - $50,000/night)
        if (parsedPrice >= 100 && parsedPrice <= 50000) {
          price = parsedPrice
          console.log("[v0] Found price via pattern:", price, "pattern:", pattern.toString().substring(0, 50))
          break
        }
      }
    }
  }
  
  // Strategy 4: If still no price, look for any dollar amounts and pick the most villa-like one
  if (!price) {
    const allPrices = $("body").text().match(/\$\s*([\d,]+)/g)
    if (allPrices) {
      const validPrices = allPrices
        .map(p => Number.parseInt(p.replace(/[$,\s]/g, "")))
        .filter(p => p >= 200 && p <= 25000) // Narrower range for this fallback
        .sort((a, b) => b - a) // Sort descending
      
      // Pick a price in the typical luxury villa range ($500-$5000/night is most common)
      const typicalPrice = validPrices.find(p => p >= 500 && p <= 5000)
      if (typicalPrice) {
        price = typicalPrice
        console.log("[v0] Found typical range price:", price)
      } else if (validPrices.length > 0) {
        // Fall back to median price if no typical range found
        price = validPrices[Math.floor(validPrices.length / 2)]
        console.log("[v0] Using median price:", price)
      }
    }
  }
  
  console.log("[v0] Final extracted price:", price)

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
