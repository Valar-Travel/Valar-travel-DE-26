import { NextResponse } from "next/server"

const staticCities = [
  {
    id: 1,
    name: "Barbados",
    country: "Caribbean",
    image_url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
    starting_price: 850,
    description: "Pink sand beaches, world-class dining, and sophisticated island culture",
  },
  {
    id: 2,
    name: "St. Lucia",
    country: "Caribbean",
    image_url: "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=800&h=600&fit=crop",
    starting_price: 950,
    description: "Dramatic Pitons, lush rainforests, and secluded luxury hideaways",
  },
  {
    id: 3,
    name: "Jamaica",
    country: "Caribbean",
    image_url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
    starting_price: 750,
    description: "Vibrant culture, pristine beaches, and legendary hospitality",
  },
  {
    id: 4,
    name: "St. Barthélemy",
    country: "Caribbean",
    image_url: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&h=600&fit=crop",
    starting_price: 1500,
    description: "European sophistication with Caribbean charm and world-class luxury",
  },
]

const staticDeals = [
  {
    id: "1",
    name: "Luxury Barbados Villa",
    city: "Barbados",
    price: 850,
    normal_price: 1200,
    discount_type: "coupon",
    category: "villa",
  },
  {
    id: "2",
    name: "St. Lucia Pitons Resort",
    city: "St. Lucia",
    price: 950,
    normal_price: 1350,
    discount_type: "mobile",
    category: "villa",
  },
  {
    id: "3",
    name: "Jamaica Beachfront Villa",
    city: "Jamaica",
    price: 750,
    normal_price: 1100,
    discount_type: "last-minute",
    category: "villa",
  },
  {
    id: "4",
    name: "St. Barths Luxury Estate",
    city: "St. Barthélemy",
    price: 1500,
    normal_price: 2200,
    discount_type: "coupon",
    category: "villa",
  },
]

export async function GET() {
  try {
    const citiesWithDeals = staticCities.map((city) => ({
      ...city,
      deals: staticDeals.filter((deal) => deal.city === city.name),
    }))

    return NextResponse.json(citiesWithDeals)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
