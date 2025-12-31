// OpenAI utility for rewriting scraped content into luxury-focused copy
// Uses lazy loading to prevent build-time initialization errors

let openaiClient: any = null

async function getClient() {
  if (!openaiClient) {
    const { default: OpenAI } = await import("openai")
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }
  return openaiClient
}

export async function rewriteText(originalText: string, type: "description" | "title" | "amenity"): Promise<string> {
  try {
    const client = await getClient()

    const prompts = {
      description: `Rewrite this property description in a luxury, elegant tone that appeals to high-end travelers. 
Keep it concise (2-3 sentences) and highlight exclusivity, comfort, and premium experiences. 
Original: ${originalText}`,
      title: `Rewrite this property title to be more luxurious and appealing. Keep it under 8 words. 
Original: ${originalText}`,
      amenity: `Rewrite this amenity name to be more upscale and descriptive. Keep it brief (1-3 words). 
Original: ${originalText}`,
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a luxury travel copywriter. Your writing is elegant, sophisticated, and appeals to affluent travelers seeking premium experiences.",
        },
        {
          role: "user",
          content: prompts[type],
        },
      ],
      temperature: 0.7,
      max_tokens: 200,
    })

    return completion.choices[0]?.message?.content?.trim() || originalText
  } catch (error) {
    console.error("[v0] OpenAI rewrite error:", error)
    return originalText
  }
}
