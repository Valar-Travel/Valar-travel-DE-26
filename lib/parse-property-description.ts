/**
 * Parses a property description to extract clean sections and remove duplicates.
 * Scraped descriptions often contain amenities, rates, bedroom info, and policies
 * all concatenated together. This utility separates them into clean sections.
 */

export interface ParsedPropertyDescription {
  /** The main narrative description of the property */
  description: string[]
  /** Bedroom configuration details */
  bedroomDetails: string[]
  /** Staff included with the property */
  staff: string[]
  /** House rules and policies */
  policies: string[]
  /** Any special offers mentioned */
  specialOffers: string[]
}

// Section headers that indicate the start of a new section (case insensitive)
const SECTION_HEADERS = [
  'AMENITIES',
  'BEDROOM DESCRIPTION',
  'BEDROOM DESCRIPTIONS',
  'BEDROOMS',
  'STAFF',
  'RATES',
  'SEASONAL RATES',
  'SPECIAL OFFERS',
  'POLICIES',
  'HOUSE RULES',
  'STANDARD HOUSE RULES',
  'N.B.',
  'PLEASE NOTE',
  'CHECK-IN',
  'CHECK-OUT',
]

// Patterns that indicate rate-related content to remove
const RATE_PATTERNS = [
  /^Season\s*$/i,
  /^Dates\s*$/i,
  /^Nightly Rate\s*$/i,
  /^Weekly Rate\s*$/i,
  /^(Summer|Winter|Spring|Fall|Christmas|Festive|Peak|High|Low)\s*$/i,
  /^\d{1,2}(st|nd|rd|th)?\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i,
  /^\$[\d,]+\s*(USD|EUR|GBP)?\s*$/i,
  /^[\d,]+\s*(USD|EUR|GBP)\s*$/i,
  /Government Accommodation Tax/i,
  /Service charge added/i,
  /security deposit/i,
  /Minimum Stay/i,
  /Tipping is not included/i,
]

// Patterns that indicate amenity-related content
const AMENITY_PATTERNS = [
  /^A\/C\s*[–-]/i,
  /^(Alarm System|BBQ|Beach|Cable|Ceiling|Dishwasher|Enclosed|Furnished|Gazebo|Hammock|Kitchen|Laundry|Media|Ocean|Outdoor|Patio|Pool|Safe|Study|Television|Washing|Wi-Fi|WiFi)\s*$/i,
]

/**
 * Parses a raw property description into structured sections
 */
export function parsePropertyDescription(rawDescription: string | null | undefined): ParsedPropertyDescription {
  if (!rawDescription) {
    return {
      description: [],
      bedroomDetails: [],
      staff: [],
      policies: [],
      specialOffers: [],
    }
  }

  const lines = rawDescription.split(/\n/).map(line => line.trim()).filter(Boolean)
  
  const result: ParsedPropertyDescription = {
    description: [],
    bedroomDetails: [],
    staff: [],
    policies: [],
    specialOffers: [],
  }

  let currentSection: 'description' | 'bedroom' | 'staff' | 'rates' | 'policies' | 'amenities' | 'offers' = 'description'

  for (const line of lines) {
    // Check if this is a section header
    const upperLine = line.toUpperCase().replace(/[:\s]+$/, '')
    
    if (SECTION_HEADERS.some(header => upperLine.includes(header) || upperLine === header)) {
      // Determine which section we're entering
      if (upperLine.includes('BEDROOM')) {
        currentSection = 'bedroom'
      } else if (upperLine.includes('STAFF')) {
        currentSection = 'staff'
      } else if (upperLine.includes('RATE') || upperLine.includes('SEASON')) {
        currentSection = 'rates'
      } else if (upperLine.includes('AMENITIES')) {
        currentSection = 'amenities'
      } else if (upperLine.includes('POLIC') || upperLine.includes('HOUSE RULES') || upperLine.includes('STANDARD HOUSE')) {
        currentSection = 'policies'
      } else if (upperLine.includes('OFFER')) {
        currentSection = 'offers'
      }
      continue // Skip the header line itself
    }

    // Check if this line matches rate patterns (skip these)
    if (RATE_PATTERNS.some(pattern => pattern.test(line))) {
      currentSection = 'rates' // Ensure we stay in rates section
      continue
    }

    // Check if this line matches amenity patterns (skip these, they're displayed separately)
    if (currentSection === 'amenities' || AMENITY_PATTERNS.some(pattern => pattern.test(line))) {
      continue
    }

    // Skip empty or very short lines
    if (line.length < 3) continue

    // Add content to appropriate section
    switch (currentSection) {
      case 'description':
        // Only add substantial paragraphs (more than just a few words)
        if (line.length > 20 && !RATE_PATTERNS.some(p => p.test(line))) {
          result.description.push(line)
        }
        break
      case 'bedroom':
        // Bedroom details like "Master Bedroom – King"
        if (line.includes('–') || line.includes('-') || line.toLowerCase().includes('bedroom')) {
          result.bedroomDetails.push(line)
        }
        break
      case 'staff':
        // Staff roles
        if (!line.toUpperCase().includes('STAFF')) {
          result.staff.push(line)
        }
        break
      case 'policies':
        // Policy rules
        result.policies.push(line)
        break
      case 'offers':
        result.specialOffers.push(line)
        break
      case 'rates':
        // Skip rate content entirely
        break
    }
  }

  // Deduplicate description paragraphs (sometimes the same text appears multiple times)
  result.description = deduplicateParagraphs(result.description)

  return result
}

/**
 * Removes duplicate or very similar paragraphs
 */
function deduplicateParagraphs(paragraphs: string[]): string[] {
  const seen = new Set<string>()
  const result: string[] = []

  for (const p of paragraphs) {
    // Normalize for comparison
    const normalized = p.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 100)
    
    // Check if we've seen something very similar
    let isDuplicate = false
    for (const s of seen) {
      if (s === normalized || s.includes(normalized) || normalized.includes(s)) {
        isDuplicate = true
        break
      }
    }

    if (!isDuplicate) {
      seen.add(normalized)
      result.push(p)
    }
  }

  return result
}

/**
 * Gets just the clean description paragraphs for display
 */
export function getCleanDescription(rawDescription: string | null | undefined): string[] {
  return parsePropertyDescription(rawDescription).description
}
