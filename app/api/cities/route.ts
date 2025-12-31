import { NextResponse } from "next/server"

const staticCities = [
  {
    id: 1,
    name: "Barbados",
    country: "Caribbean",
    image_url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&crop=entropy&cs=tinysrgb&fit=max",
    starting_price: 850,
    description: "Pink sand beaches, world-class dining, and sophisticated island culture",
  },
  {
    id: 2,
    name: "St. Lucia",
    country: "Caribbean",
    image_url:
      "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=800&h=600&crop=entropy&cs=tinysrgb&fit=max",
    starting_price: 950,
    description: "Dramatic Pitons, lush rainforests, and secluded luxury hideaways",
  },
  {
    id: 3,
    name: "Jamaica",
    country: "Caribbean",
    image_url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&crop=entropy&cs=tinysrgb&fit=max",
    starting_price: 750,
    description: "Vibrant culture, pristine beaches, and legendary hospitality",
  },
  {
    id: 4,
    name: "St. Barthélemy",
    country: "Caribbean",
    image_url:
      "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&h=600&crop=entropy&cs=tinysrgb&fit=max",
    starting_price: 1500,
    description: "European sophistication with Caribbean charm and world-class luxury",
  },
]

export async function GET() {
  try {
    return NextResponse.json(staticCities)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
