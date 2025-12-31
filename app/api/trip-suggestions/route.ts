import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const destination = request.nextUrl.searchParams.get("destination") || ""

  const suggestions = generateSuggestions(destination)

  return NextResponse.json({
    suggestions,
    destination,
    generatedAt: new Date().toISOString(),
  })
}

function generateSuggestions(destination: string) {
  const baseActivities = [
    {
      id: "1",
      name: "Beach Day",
      type: "attraction" as const,
      time: "09:00",
      duration: 180,
      location: destination,
      cost: 0,
      notes: "Relax on pristine Caribbean beaches",
    },
    {
      id: "2",
      name: "Caribbean Cuisine",
      type: "restaurant" as const,
      time: "12:30",
      duration: 90,
      location: destination,
      cost: 45,
      notes: "Try authentic Caribbean dishes and fresh seafood",
    },
    {
      id: "3",
      name: "Water Sports",
      type: "attraction" as const,
      time: "14:30",
      duration: 120,
      location: destination,
      cost: 65,
      notes: "Snorkeling, diving, or sailing adventure",
    },
    {
      id: "4",
      name: "Sunset Cruise",
      type: "attraction" as const,
      time: "18:00",
      duration: 120,
      location: destination,
      cost: 85,
      notes: "Catamaran sunset cruise with drinks",
    },
  ]

  const destinationSpecific = getDestinationSpecificActivities(destination.toLowerCase())

  return [...baseActivities, ...destinationSpecific]
}

function getDestinationSpecificActivities(destination: string) {
  const activities: any[] = []

  if (destination.includes("barbados")) {
    activities.push(
      {
        id: "barbados-1",
        name: "Harrison's Cave Tour",
        type: "attraction",
        time: "10:00",
        duration: 120,
        location: "Central Barbados",
        cost: 40,
        notes: "Explore stunning limestone cave formations",
      },
      {
        id: "barbados-2",
        name: "Catamaran Cruise",
        type: "attraction",
        time: "14:00",
        duration: 240,
        location: "West Coast, Barbados",
        cost: 95,
        notes: "Sail with sea turtles and tropical fish",
      },
    )
  }

  if (destination.includes("jamaica")) {
    activities.push(
      {
        id: "jamaica-1",
        name: "Dunn's River Falls",
        type: "attraction",
        time: "09:00",
        duration: 180,
        location: "Ocho Rios, Jamaica",
        cost: 25,
        notes: "Climb the famous terraced waterfall",
      },
      {
        id: "jamaica-2",
        name: "Bob Marley Museum",
        type: "activity",
        time: "15:00",
        duration: 90,
        location: "Kingston, Jamaica",
        cost: 20,
        notes: "Learn about reggae legend's life and music",
      },
    )
  }

  if (destination.includes("st. lucia") || destination.includes("st lucia")) {
    activities.push(
      {
        id: "stlucia-1",
        name: "Pitons Hiking Tour",
        type: "attraction",
        time: "07:00",
        duration: 240,
        location: "Soufrière, St. Lucia",
        cost: 50,
        notes: "Hike the iconic Gros Piton mountain",
      },
      {
        id: "stlucia-2",
        name: "Sulphur Springs Visit",
        type: "attraction",
        time: "14:00",
        duration: 120,
        location: "Soufrière, St. Lucia",
        cost: 15,
        notes: "Drive-in volcano and therapeutic mud baths",
      },
    )
  }

  return activities
}
