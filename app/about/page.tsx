import { Globe, Shield, Star, CheckCircle, Heart, Users, Award } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us - Luxury Caribbean Villa Experts",
  description:
    "Learn about Valar Travel's mission to curate unforgettable Caribbean villa experiences in Barbados, St. Lucia, Jamaica, and St. Barthélemy. Handpicked excellence meets personalized service.",
  openGraph: {
    title: "About Valar Travel - Caribbean Villa Experts",
    description:
      "Discover how we curate exceptional luxury villa experiences across the Caribbean's finest destinations.",
    url: "https://valartravel.de/about",
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-secondary text-primary-foreground py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/luxury-caribbean-villa-aerial-view.jpg"
            alt="Luxury Caribbean villa"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Heart className="w-12 h-12" />
            <h1 className="text-5xl font-bold text-balance">
              Valar Travel – Curating Unforgettable Caribbean Villa Experiences
            </h1>
          </div>
          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto text-pretty">
            We connect discerning travelers with handpicked luxury villas across the Caribbean's most stunning
            destinations — Barbados, St. Lucia, Jamaica, and St. Barthélemy.
          </p>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8 text-foreground">Our Mission</h2>
            <div className="bg-card p-8 rounded-lg shadow-lg border">
              <p className="text-xl leading-relaxed text-card-foreground mb-6">
                Our mission is to redefine luxury Caribbean travel by offering exclusive access to the finest private
                villas in Barbados, St. Lucia, Jamaica, and St. Barthélemy. We believe that every vacation should be an
                extraordinary experience — where pristine beaches meet world-class service, and every detail is crafted
                to perfection.
              </p>
              <p className="text-lg text-muted-foreground">
                Valar Travel is more than a booking platform. We're your trusted partner in creating bespoke Caribbean
                escapes that exceed expectations and create memories that last a lifetime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Our Story</h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-foreground">Born from a Love of the Caribbean</h3>
                <p className="text-muted-foreground mb-4">
                  Valar Travel was founded by passionate travelers who fell in love with the Caribbean's natural beauty,
                  vibrant culture, and warm hospitality. We recognized that finding truly exceptional luxury villas
                  required insider knowledge, personal connections, and countless hours of research.
                </p>
                <p className="text-muted-foreground">
                  Today, we partner with carefully vetted property owners across four premier Caribbean destinations to
                  bring you an exclusive collection of villas that represent the pinnacle of island luxury. Each
                  property is personally inspected and selected for its exceptional quality, stunning location, and
                  ability to deliver unforgettable experiences.
                </p>
              </div>
              <div className="flex justify-center">
                <img
                  src="/luxury-villa-ocean-view.jpg"
                  alt="Luxury villa with ocean view"
                  className="rounded-lg shadow-xl w-full max-w-md"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Valar Travel?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Handpicked Excellence</h3>
              <p className="text-muted-foreground">
                Every villa in our collection is personally vetted for exceptional quality, stunning design, and prime
                locations. We only partner with properties that meet our exacting standards.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Personalized Service</h3>
              <p className="text-muted-foreground">
                From the moment you inquire to the day you depart, our team provides white-glove service to ensure every
                aspect of your Caribbean escape is flawless.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Caribbean Expertise</h3>
              <p className="text-muted-foreground">
                With deep local knowledge and established relationships across Barbados, St. Lucia, Jamaica, and St.
                Barthélemy, we provide insider access and authentic experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">The Valar Travel Difference</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card p-6 rounded-lg text-center">
              <Star className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Exclusive Properties</h3>
              <p className="text-sm text-muted-foreground">
                Access to private luxury villas not available on mainstream booking platforms.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg text-center">
              <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Authentic Experiences</h3>
              <p className="text-sm text-muted-foreground">
                Immerse yourself in Caribbean culture with curated local experiences and insider recommendations.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg text-center">
              <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Trusted Partnerships</h3>
              <p className="text-sm text-muted-foreground">
                Direct relationships with property owners ensure transparency, quality, and exceptional value.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg text-center">
              <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Peace of Mind</h3>
              <p className="text-sm text-muted-foreground">
                Secure bookings, comprehensive support, and 24/7 concierge services throughout your stay.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-primary to-secondary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Discover Your Perfect Caribbean Villa?</h2>
          <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
            Let us help you find the luxury villa that perfectly matches your vision of paradise. From beachfront
            estates to hillside retreats, your dream Caribbean escape awaits.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/villas"
              className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Explore Villas
            </a>
            <a
              href="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors"
            >
              Contact Our Team
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
