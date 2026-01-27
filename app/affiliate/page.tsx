export default function AffiliateDisclosurePage() {
  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Affiliate Disclosure</h1>

        <div className="prose prose-lg max-w-none space-y-6">
          <p className="text-lg">
            <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
          </p>

          <section>
            <h2 className="text-2xl font-bold mb-4">Affiliate Relationships</h2>
            <p>
              Valar Travel ("we," "us," or "our") participates in various affiliate marketing programs. This means that
              we may earn commissions on purchases made through links on our website to partner companies and service
              providers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">What Are Affiliate Links?</h2>
            <p>
              Affiliate links are special tracking links that allow us to earn a commission when you click on them and
              make a purchase or booking. These links help support our platform and allow us to continue providing
              valuable content and services to our users.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Our Affiliate Partners</h2>
            <p>We may have affiliate relationships with, but are not limited to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Luxury hotel and resort booking platforms</li>
              <li>Villa rental services and property management companies</li>
              <li>Travel insurance providers</li>
              <li>Private aviation and transportation services</li>
              <li>Luxury brand partners and experience providers</li>
              <li>Travel gear and accessory retailers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">No Additional Cost to You</h2>
            <p>
              Using our affiliate links does not cost you anything extra. The price you pay is the same whether you use
              our affiliate link or go directly to the merchant's website. The commission we earn comes from the
              merchant, not from you.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Our Commitment to Transparency</h2>
            <p>We are committed to transparency and honesty in all our affiliate relationships:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                We only recommend products, services, and properties that we believe will provide value to our users
              </li>
              <li>Our reviews and recommendations are based on genuine experiences and research</li>
              <li>We clearly disclose when content contains affiliate links</li>
              <li>Our editorial content is not influenced by affiliate relationships</li>
              <li>We maintain editorial independence in all our recommendations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Property Owner Partnerships</h2>
            <p>
              In addition to affiliate marketing, we work directly with luxury villa owners and property managers. When
              you book a property through our platform, we may earn a commission from the property owner. This
              commission structure allows us to provide our concierge services and maintain our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Brand Collaborations</h2>
            <p>
              We partner with luxury brands to create exclusive experiences for our guests. These collaborations may
              include sponsored content, brand partnerships, or co-created experiences. We always disclose when content
              is sponsored or part of a brand collaboration.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Your Trust Matters</h2>
            <p>
              Your trust is important to us. We strive to provide honest, accurate, and valuable information regardless
              of whether we earn a commission. If you have any questions about our affiliate relationships or specific
              recommendations, please don't hesitate to contact us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">FTC Compliance</h2>
            <p>
              This disclosure is in accordance with the Federal Trade Commission's 16 CFR, Part 255: "Guides Concerning
              the Use of Endorsements and Testimonials in Advertising."
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <p>
              If you have any questions about our affiliate relationships or this disclosure, please contact us at:
              <br />
              <br />
              Email: hello@valartravel.de
              <br />
              Phone: +1 (246) 555-0100
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
