import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Luggage, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function PackingTipsPage() {
  const essentialItems = [
    "Passport and travel documents",
    "Travel insurance information",
    "Medications and prescriptions",
    "Phone charger and adapters",
    "Change of clothes in carry-on",
    "Toiletries (travel-sized)",
    "Comfortable walking shoes",
    "Weather-appropriate clothing",
  ]

  const packingHacks = [
    {
      title: "Roll, Don't Fold",
      description: "Rolling clothes saves 30% more space than folding and prevents wrinkles",
    },
    {
      title: "Use Packing Cubes",
      description: "Organize by category and compress items for maximum efficiency",
    },
    {
      title: "Wear Heavy Items",
      description: "Wear boots, coats, and heavy items on the plane to save luggage space",
    },
    {
      title: "Pack a Laundry Bag",
      description: "Separate dirty clothes and use it as extra packing space on return",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-background py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Luggage className="h-8 w-8 text-blue-600" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">Packing Essentials</h1>
            </div>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
              Master the art of efficient packing for luxury travel with our comprehensive guide
            </p>
            <Badge className="bg-blue-100 text-blue-800 border-blue-200">Expert Tips Inside</Badge>
          </div>
        </div>
      </section>

      {/* Essential Items Checklist */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Essential Items Checklist</h2>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  Never Leave Home Without These
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {essentialItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                      <div className="w-4 h-4 rounded border-2 border-primary" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Packing Hacks */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Pro Packing Hacks</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {packingHacks.map((hack, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2">{hack.title}</h3>
                    <p className="text-muted-foreground">{hack.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Luggage Recommendations */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Luggage Recommendations</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Carry-On</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Hard-shell for protection</li>
                    <li>• 4-wheel spinner design</li>
                    <li>• TSA-approved lock</li>
                    <li>• Expandable compartments</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Checked Luggage</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Lightweight but durable</li>
                    <li>• Multiple compartments</li>
                    <li>• Compression zippers</li>
                    <li>• Distinctive color/design</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Travel Accessories</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Packing cubes set</li>
                    <li>• Toiletry organizer</li>
                    <li>• Shoe bags</li>
                    <li>• Laundry bag</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Explore More Travel Tips</h2>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button variant="outline" asChild>
                <Link href="/tips">All Tips</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/tips/booking">Booking Strategy</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/tips/budget">Budget Management</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
