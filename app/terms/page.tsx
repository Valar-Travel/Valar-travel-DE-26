import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service - Valar Travel",
  description: "Terms of Service for Valar Travel - Your trusted partner for finding the best travel deals worldwide.",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
            <p className="text-xl text-blue-100">Please read these terms carefully before using our services</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 lg:px-6 py-16">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
            <p className="text-blue-800 font-medium mb-2">Last Updated: August 29, 2025</p>
            <p className="text-blue-700">
              These Terms of Service govern your use of Valar Travel's website and services. By using our platform, you
              agree to these terms.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-4">
              By accessing and using Valar Travel ("we," "our," or "us"), you accept and agree to be bound by the terms
              and provision of this agreement. If you do not agree to abide by the above, please do not use this
              service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Use of Service</h2>
            <p className="text-gray-700 mb-4">
              Valar Travel provides a platform for finding and comparing travel deals from various providers. You may
              use our service to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Search and browse travel deals</li>
              <li>Compare prices and offers</li>
              <li>Access affiliate partner websites for bookings</li>
              <li>Subscribe to our newsletter for deal alerts</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
            <p className="text-gray-700 mb-4">
              When you create an account with us, you must provide information that is accurate, complete, and current
              at all times. You are responsible for safeguarding the password and for all activities that occur under
              your account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Booking and Payments</h2>
            <p className="text-gray-700 mb-4">
              Valar Travel is a comparison and referral service. All bookings and payments are processed directly by our
              affiliate partners. We are not responsible for:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>The accuracy of pricing information</li>
              <li>Availability of deals or services</li>
              <li>Payment processing or refunds</li>
              <li>Travel service delivery or quality</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Affiliate Partnerships</h2>
            <p className="text-gray-700 mb-4">
              We may earn commissions from affiliate partners when you make bookings through our platform. This does not
              affect the price you pay and helps us maintain our free service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Intellectual Property</h2>
            <p className="text-gray-700 mb-4">
              The service and its original content, features, and functionality are and will remain the exclusive
              property of Valar Travel and its licensors. The service is protected by copyright, trademark, and other
              laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Prohibited Uses</h2>
            <p className="text-gray-700 mb-4">You may not use our service:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
              <li>
                To violate any international, federal, provincial, or state regulations, rules, laws, or local
                ordinances
              </li>
              <li>
                To infringe upon or violate our intellectual property rights or the intellectual property rights of
                others
              </li>
              <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
              <li>To submit false or misleading information</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              In no event shall Valar Travel, nor its directors, employees, partners, agents, suppliers, or affiliates,
              be liable for any indirect, incidental, special, consequential, or punitive damages, including without
              limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of
              the service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Termination</h2>
            <p className="text-gray-700 mb-4">
              We may terminate or suspend your account and bar access to the service immediately, without prior notice
              or liability, under our sole discretion, for any reason whatsoever and without limitation, including but
              not limited to a breach of the Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to Terms</h2>
            <p className="text-gray-700 mb-4">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision
              is material, we will provide at least 30 days notice prior to any new terms taking effect.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Governing Law</h2>
            <p className="text-gray-700 mb-4">
              These Terms shall be interpreted and governed by the laws of the State of New York, United States, without
              regard to its conflict of law provisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Information</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-2">
                <strong>Email:</strong> hello@valartravel.de
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Phone:</strong> +1 (555) 123-4567
              </p>
              <p className="text-gray-700">
                <strong>Address:</strong> Valar Travel, New York, NY
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
