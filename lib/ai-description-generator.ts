import { generateText } from "ai"

export async function generatePropertyDescription(propertyData: {
  name: string
  location?: string
  bedrooms?: number
  bathrooms?: number
  amenities?: string[]
  price_per_night?: number
  images?: string[]
  existing_description?: string
}): Promise<string> {
  const { name, location, bedrooms, bathrooms, amenities, price_per_night, existing_description } = propertyData

  // If there's already a good description (more than 200 characters), return it
  if (existing_description && existing_description.length > 200) {
    return existing_description
  }

  const prompt = `You are a luxury real estate copywriter specializing in Caribbean vacation rentals. Write a compelling, SEO-optimized property description for the following villa:

Property Name: ${name}
Location: ${location || "Caribbean"}
${bedrooms ? `Bedrooms: ${bedrooms}` : ""}
${bathrooms ? `Bathrooms: ${bathrooms}` : ""}
${amenities && amenities.length > 0 ? `Amenities: ${amenities.join(", ")}` : ""}
${price_per_night ? `Starting from $${price_per_night}/night` : ""}

${existing_description ? `Current description (enhance this): ${existing_description}` : ""}

Requirements:
1. Write 3-4 paragraphs (300-500 words total)
2. Start with an captivating opening sentence that highlights the villa's unique selling point
3. Include specific details about the location, views, and what makes this property special
4. Mention key amenities naturally within the narrative
5. Use evocative, luxurious language without being overly flowery
6. Include SEO keywords naturally: "${location} villa rental", "luxury Caribbean vacation", "private villa", "${location} accommodation"
7. End with a call-to-action about booking or contacting for more information
8. Write in an elegant, sophisticated tone that appeals to high-end travelers
9. Focus on the experience and lifestyle, not just features

Write ONLY the description text, no titles or labels.`

  try {
    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt,
      temperature: 0.7,
      maxTokens: 800,
    })

    return text.trim()
  } catch (error) {
    console.error("[v0] Error generating AI description:", error)
    // Fallback to enhanced version of existing description
    return (
      existing_description ||
      `Experience the pinnacle of Caribbean luxury at ${name}. This exceptional ${location || "Caribbean"} villa offers breathtaking views, world-class amenities, and refined island living. ${bedrooms ? `With ${bedrooms} spacious bedrooms, ` : ""}this property is perfect for discerning travelers seeking an unforgettable tropical retreat. Contact our concierge team to reserve your exclusive escape.`
    )
  }
}

export async function batchGenerateDescriptions(properties: any[]): Promise<Map<string, string>> {
  const descriptions = new Map<string, string>()

  // Process in batches of 5 to avoid rate limits
  const batchSize = 5
  for (let i = 0; i < properties.length; i += batchSize) {
    const batch = properties.slice(i, i + batchSize)

    const promises = batch.map(async (property) => {
      try {
        const description = await generatePropertyDescription({
          name: property.name,
          location: property.location,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          amenities: property.amenities,
          price_per_night: property.price_per_night,
          existing_description: property.description,
        })
        return { id: property.id, description }
      } catch (error) {
        console.error(`[v0] Error generating description for ${property.name}:`, error)
        return null
      }
    })

    const results = await Promise.all(promises)
    results.forEach((result) => {
      if (result) {
        descriptions.set(result.id, result.description)
      }
    })

    // Wait 1 second between batches to avoid rate limits
    if (i + batchSize < properties.length) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }

  return descriptions
}
