import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy - Valar Travel",
  description:
    "Learn how Valar Travel protects your privacy and handles your personal information when you use our travel deals platform.",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-20">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Your privacy is important to us. Learn how we collect, use, and protect your personal information.
          </p>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-6 max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-8">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
                <div className="text-gray-700 space-y-4">
                  <p>
                    We collect information you provide directly to us, such as when you create an account, subscribe to
                    our newsletter, contact us, or use our services.
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Personal Information:</strong> Name, email address, phone number
                    </li>
                    <li>
                      <strong>Travel Preferences:</strong> Destination preferences, travel dates, budget ranges
                    </li>
                    <li>
                      <strong>Communication Data:</strong> Messages you send us through contact forms
                    </li>
                    <li>
                      <strong>Usage Data:</strong> How you interact with our website and services
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
                <div className="text-gray-700 space-y-4">
                  <p>We use the information we collect to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Provide and improve our travel deals service</li>
                    <li>Send you personalized deal recommendations</li>
                    <li>Respond to your inquiries and provide customer support</li>
                    <li>Send newsletters and promotional communications (with your consent)</li>
                    <li>Analyze usage patterns to improve our website and services</li>
                    <li>Comply with legal obligations and protect our rights</li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Information Sharing</h2>
                <div className="text-gray-700 space-y-4">
                  <p>
                    We do not sell, trade, or otherwise transfer your personal information to third parties, except in
                    the following circumstances:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Travel Partners:</strong> When you book through our affiliate links, your information may
                      be shared with travel providers
                    </li>
                    <li>
                      <strong>Service Providers:</strong> Third-party companies that help us operate our website and
                      provide services
                    </li>
                    <li>
                      <strong>Legal Requirements:</strong> When required by law or to protect our rights and safety
                    </li>
                    <li>
                      <strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Cookies and Tracking</h2>
                <div className="text-gray-700 space-y-4">
                  <p>We use cookies and similar tracking technologies to enhance your experience on our website:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Essential Cookies:</strong> Required for basic website functionality
                    </li>
                    <li>
                      <strong>Analytics Cookies:</strong> Help us understand how visitors use our site
                    </li>
                    <li>
                      <strong>Marketing Cookies:</strong> Used to deliver relevant advertisements
                    </li>
                    <li>
                      <strong>Preference Cookies:</strong> Remember your settings and preferences
                    </li>
                  </ul>
                  <p>
                    You can control cookies through your browser settings, but disabling certain cookies may affect
                    website functionality.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security</h2>
                <div className="text-gray-700 space-y-4">
                  <p>
                    We implement appropriate security measures to protect your personal information against unauthorized
                    access, alteration, disclosure, or destruction. However, no method of transmission over the internet
                    is 100% secure.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights</h2>
                <div className="text-gray-700 space-y-4">
                  <p>You have the right to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Access and receive a copy of your personal information</li>
                    <li>Correct inaccurate or incomplete information</li>
                    <li>Delete your personal information (subject to certain exceptions)</li>
                    <li>Opt-out of marketing communications</li>
                    <li>Restrict or object to certain processing of your information</li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Children's Privacy</h2>
                <div className="text-gray-700 space-y-4">
                  <p>
                    Our services are not intended for children under 13 years of age. We do not knowingly collect
                    personal information from children under 13.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Changes to This Policy</h2>
                <div className="text-gray-700 space-y-4">
                  <p>
                    We may update this privacy policy from time to time. We will notify you of any changes by posting
                    the new policy on this page and updating the "Last updated" date.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact Us</h2>
                <div className="text-gray-700 space-y-4">
                  <p>
                    If you have any questions about this privacy policy or our privacy practices, please contact us:
                  </p>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <p>
                      <strong>Email:</strong> hello@valartravel.de
                    </p>
                    <p>
                      <strong>Phone:</strong> +1 (555) 123-4567
                    </p>
                    <p>
                      <strong>Address:</strong> Valar Travel, New York, NY
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
