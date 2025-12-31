import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, Phone, FileText, MapPin, Wifi } from "lucide-react"
import Link from "next/link"

const safetyCategories = [
  {
    icon: FileText,
    title: "Documentation",
    color: "bg-blue-50 border-blue-200 text-blue-800",
    tips: [
      "Keep digital copies of all important documents",
      "Store copies separately from originals",
      "Share itinerary with trusted contacts",
      "Register with your embassy if traveling abroad",
      "Check passport expiration dates (6+ months validity)",
    ],
  },
  {
    icon: Phone,
    title: "Emergency Preparedness",
    color: "bg-red-50 border-red-200 text-red-800",
    tips: [
      "Save local emergency numbers in your phone",
      "Know your embassy contact information",
      "Have emergency cash in local currency",
      "Keep emergency contacts easily accessible",
      "Download offline maps and translation apps",
    ],
  },
  {
    icon: Wifi,
    title: "Digital Security",
    color: "bg-green-50 border-green-200 text-green-800",
    tips: [
      "Use VPN on public Wi-Fi networks",
      "Enable two-factor authentication",
      "Avoid banking on public networks",
      "Keep devices updated with latest security patches",
      "Use hotel safes for valuable electronics",
    ],
  },
  {
    icon: MapPin,
    title: "Local Awareness",
    color: "bg-orange-50 border-orange-200 text-orange-800",
    tips: [
      "Research local customs and laws",
      "Know common scams in your destination",
      "Stay aware of your surroundings",
      "Trust your instincts about situations",
      "Avoid displaying expensive items publicly",
    ],
  },
]

const emergencyContacts = [
  { country: "United States", police: "911", medical: "911", fire: "911" },
  { country: "United Kingdom", police: "999", medical: "999", fire: "999" },
  { country: "European Union", police: "112", medical: "112", fire: "112" },
  { country: "Australia", police: "000", medical: "000", fire: "000" },
  { country: "Japan", police: "110", medical: "119", fire: "119" },
  { country: "Canada", police: "911", medical: "911", fire: "911" },
]

export default function SafetyTipsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-50 to-background py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Shield className="h-8 w-8 text-red-600" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">Travel Safety</h1>
            </div>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
              Stay safe and secure while exploring the world with confidence
            </p>
            <Badge className="bg-red-100 text-red-800 border-red-200">Essential safety guidelines</Badge>
          </div>
        </div>
      </section>

      {/* Safety Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Essential Safety Areas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {safetyCategories.map((category, index) => {
              const IconComponent = category.icon
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-red-100">
                        <IconComponent className="h-6 w-6 text-red-600" />
                      </div>
                      <CardTitle className="text-xl">{category.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {category.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-600 mt-2 flex-shrink-0" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Emergency Contacts */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">International Emergency Numbers</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {emergencyContacts.map((contact, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-3">{contact.country}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Police:</span>
                        <span className="font-mono font-semibold">{contact.police}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Medical:</span>
                        <span className="font-mono font-semibold">{contact.medical}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fire:</span>
                        <span className="font-mono font-semibold">{contact.fire}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Travel Insurance */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Travel Insurance Essentials</h2>
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">What to Look For</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                        <span>Medical coverage (minimum $100,000)</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                        <span>Emergency evacuation coverage</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                        <span>Trip cancellation/interruption</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                        <span>Baggage loss/delay coverage</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                        <span>24/7 emergency assistance</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">When to Buy</h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="font-medium text-green-800 mb-1">Best Time</div>
                        <div className="text-sm text-green-700">Within 14 days of booking your trip</div>
                      </div>
                      <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="font-medium text-yellow-800 mb-1">Good Time</div>
                        <div className="text-sm text-yellow-700">At least 2 weeks before departure</div>
                      </div>
                      <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                        <div className="font-medium text-red-800 mb-1">Too Late</div>
                        <div className="text-sm text-red-700">Less than 1 week before travel</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">More Travel Tips</h2>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button variant="outline" asChild>
                <Link href="/tips">All Tips</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/tips/packing">Packing Guide</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/tips/budget">Budget Tips</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
