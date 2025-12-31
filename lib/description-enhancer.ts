// Utility to enhance property descriptions with luxurious language

// Words to upgrade to more luxurious alternatives
const luxuryWordMap: Record<string, string> = {
  nice: "exquisite",
  good: "exceptional",
  big: "spacious",
  large: "expansive",
  small: "intimate",
  pretty: "stunning",
  beautiful: "breathtaking",
  great: "magnificent",
  lovely: "enchanting",
  house: "residence",
  home: "estate",
  room: "suite",
  bedroom: "master suite",
  bathroom: "en-suite bathroom",
  pool: "infinity pool",
  garden: "manicured gardens",
  yard: "private grounds",
  view: "panoramic vista",
  beach: "pristine shoreline",
  ocean: "azure Caribbean waters",
  sea: "turquoise sea",
  sun: "tropical sun",
  kitchen: "gourmet kitchen",
  dining: "formal dining",
  living: "grand living",
  terrace: "sun-drenched terrace",
  patio: "private terrace",
  balcony: "wraparound balcony",
  furniture: "designer furnishings",
  decorated: "elegantly appointed",
  modern: "contemporary",
  new: "newly renovated",
  old: "timeless",
  quiet: "serene",
  peaceful: "tranquil",
  close: "moments from",
  near: "steps away from",
  walk: "stroll",
  drive: "scenic drive",
  area: "enclave",
  neighborhood: "prestigious neighborhood",
  location: "coveted location",
  place: "sanctuary",
  spot: "retreat",
  staff: "dedicated staff",
  service: "white-glove service",
  clean: "immaculate",
  comfortable: "sumptuous",
  cozy: "intimate",
  spacious: "generously proportioned",
  private: "ultra-private",
  exclusive: "world-class",
  luxury: "unparalleled luxury",
  luxurious: "opulent",
}

// Luxury phrases to potentially add
const luxuryPhrases = [
  "where elegance meets Caribbean charm",
  "designed for the most discerning travelers",
  "offering an unparalleled retreat",
  "where every detail has been thoughtfully curated",
  "a sanctuary of refined living",
]

// Opening sentences for enhanced descriptions
const luxuryOpenings = [
  "Welcome to an extraordinary Caribbean escape.",
  "Discover refined island living at its finest.",
  "Experience the pinnacle of Caribbean luxury.",
  "Indulge in an exceptional tropical retreat.",
  "Step into a world of sophisticated elegance.",
]

// Closing sentences
const luxuryClosings = [
  "This exceptional property awaits your arrival.",
  "Your Caribbean dream begins here.",
  "An unforgettable experience awaits.",
  "Reserve your exclusive retreat today.",
  "Where extraordinary memories are made.",
]

export function enhanceDescription(description: string | null | undefined): string {
  if (!description || description.trim().length < 20) {
    // Return a default luxurious description
    return `Experience the pinnacle of Caribbean luxury at this exceptional villa. Nestled in a coveted location, this stunning property offers breathtaking views, world-class amenities, and the ultimate in refined island living. Every detail has been thoughtfully curated to ensure an unforgettable retreat. From the moment you arrive, you'll be embraced by the warmth of the Caribbean sun and the unparalleled beauty of your surroundings. Contact our concierge team to begin planning your extraordinary escape.`
  }

  let enhanced = description

  // Upgrade common words to luxury alternatives (case-insensitive, whole words only)
  Object.entries(luxuryWordMap).forEach(([common, luxury]) => {
    const regex = new RegExp(`\\b${common}\\b`, "gi")
    enhanced = enhanced.replace(regex, (match) => {
      // Preserve original case
      if (match[0] === match[0].toUpperCase()) {
        return luxury.charAt(0).toUpperCase() + luxury.slice(1)
      }
      return luxury
    })
  })

  // Add an elegant opening if the description doesn't start with one
  const startsWithLuxury = luxuryOpenings.some((opening) =>
    enhanced.toLowerCase().startsWith(opening.toLowerCase().slice(0, 20)),
  )

  if (!startsWithLuxury && !enhanced.match(/^(welcome|discover|experience|indulge|step into)/i)) {
    const randomOpening = luxuryOpenings[Math.floor(Math.random() * luxuryOpenings.length)]
    enhanced = `${randomOpening}\n\n${enhanced}`
  }

  // Add a closing if the description doesn't end with a call to action
  const hasClosing = enhanced.match(/(contact|book|reserve|await|inquire|call)/i)
  if (!hasClosing) {
    const randomClosing = luxuryClosings[Math.floor(Math.random() * luxuryClosings.length)]
    enhanced = `${enhanced}\n\n${randomClosing}`
  }

  return enhanced
}

// Format description for display with proper paragraphs
export function formatDescriptionForDisplay(description: string): string[] {
  const enhanced = enhanceDescription(description)

  // Split by double newlines, single newlines, or periods followed by spaces for long blocks
  let paragraphs = enhanced.split(/\n\n+/)

  // If we only have one long paragraph, try to split it intelligently
  if (paragraphs.length === 1 && paragraphs[0].length > 500) {
    // Split at sentence boundaries after every ~200 characters
    const sentences = paragraphs[0].split(/(?<=[.!?])\s+/)
    const newParagraphs: string[] = []
    let currentParagraph = ""

    sentences.forEach((sentence) => {
      if (currentParagraph.length + sentence.length > 300 && currentParagraph.length > 0) {
        newParagraphs.push(currentParagraph.trim())
        currentParagraph = sentence
      } else {
        currentParagraph += (currentParagraph ? " " : "") + sentence
      }
    })

    if (currentParagraph.trim()) {
      newParagraphs.push(currentParagraph.trim())
    }

    paragraphs = newParagraphs
  }

  // Clean up and filter empty paragraphs
  return paragraphs.map((p) => p.trim()).filter((p) => p.length > 0)
}

// Generate a luxury summary (first 2-3 sentences) for cards/previews
export function generateLuxurySummary(description: string | null | undefined, maxLength = 200): string {
  const enhanced = enhanceDescription(description)
  const sentences = enhanced
    .split(/(?<=[.!?])\s+/)
    .slice(0, 3)
    .join(" ")

  if (sentences.length <= maxLength) {
    return sentences
  }

  return sentences.slice(0, maxLength - 3).trim() + "..."
}
