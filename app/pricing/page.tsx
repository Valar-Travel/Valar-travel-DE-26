import { createClient } from "@/lib/supabase/server"
import { PricingCard } from "@/components/pricing-card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function PricingPage() {
  let plans = []

  if (process.env.NEXT_PHASE === "phase-production-build") {
    plans = []
  } else {
    try {
      const supabase = createClient()

      if (!supabase?.from || typeof supabase.from !== "function") {
        console.warn("Supabase client not available, using fallback plans")
        plans = []
      } else {
        // Get subscription plans from database
        const { data } = await supabase
          .from("subscription_plans")
          .select("*")
          .eq("active", true)
          .order("price", { ascending: true })

        plans = data || []
      }
    } catch (error) {
      console.error("Pricing page error:", error)
      // Use fallback plans if database is not available
      plans = []
    }
  }

  const features = [
    "24/7 customer support",
    "99.9% uptime guarantee",
    "Advanced analytics",
    "Custom integrations",
    "Priority feature requests",
    "Dedicated account manager",
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">Simple, transparent pricing</h1>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the perfect plan for your needs. Upgrade or downgrade at any time.
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <PricingCard
              key={plan.id}
              plan={{
                id: plan.id,
                name: plan.name,
                description: plan.description,
                price: Number.parseFloat(plan.price),
                interval: plan.interval,
                stripe_price_id: plan.stripe_price_id,
                features: plan.features || [],
              }}
              isPopular={index === 1} // Make middle plan popular
            />
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Everything you need to succeed</h2>
            <p className="mt-4 text-lg text-gray-600">All plans include these essential features</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Frequently asked questions</h2>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Can I change my plan at any time?</h3>
            <p className="text-gray-600">
              Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing
              cycle.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">What payment methods do you accept?</h3>
            <p className="text-gray-600">
              We accept all major credit cards, PayPal, and bank transfers for annual plans.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Is there a free trial?</h3>
            <p className="text-gray-600">
              Yes, all plans come with a 14-day free trial. No credit card required to get started.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-xl text-blue-100 mb-8">Join thousands of satisfied customers today</p>
          <Link href="/auth/sign-up">
            <Button size="lg" variant="secondary">
              Start Free Trial
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
