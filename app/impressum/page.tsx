export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Impressum</h1>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Company Information</h2>
            <p>
              <strong>Valar Travel Ltd.</strong>
              <br />
              Luxury Villa Management & Concierge Services
              <br />
              Bridgetown, Barbados
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Contact</h2>
            <p>
              Email: info@valartravel.de
              <br />
              Phone: +1 (246) 555-0100
              <br />
              Website: www.valartravel.de
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Represented By</h2>
            <p>Managing Director: [Name]</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Registration</h2>
            <p>
              Company Registration Number: [Number]
              <br />
              VAT ID: [VAT Number]
              <br />
              Registered in Barbados
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Responsible for Content</h2>
            <p>
              According to § 55 Abs. 2 RStV:
              <br />
              [Name]
              <br />
              [Address]
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Disclaimer</h2>
            <h3 className="text-xl font-semibold mb-2">Liability for Content</h3>
            <p className="mb-4">
              The contents of our pages have been created with the utmost care. However, we cannot guarantee the
              contents' accuracy, completeness, or topicality. According to statutory provisions, we are furthermore
              responsible for our own content on these web pages.
            </p>

            <h3 className="text-xl font-semibold mb-2">Liability for Links</h3>
            <p className="mb-4">
              Our offer includes links to external third-party websites. We have no influence on the contents of those
              websites, therefore we cannot guarantee for those contents. Providers or administrators of linked websites
              are always responsible for their own contents.
            </p>

            <h3 className="text-xl font-semibold mb-2">Copyright</h3>
            <p>
              The content and works published on this website are governed by the copyright laws of Barbados. Any
              duplication, processing, distribution, or any form of commercialization beyond the scope of copyright law
              shall require the prior written consent of Valar Travel Ltd.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Dispute Resolution</h2>
            <p>
              The European Commission provides a platform for online dispute resolution (ODR):
              https://ec.europa.eu/consumers/odr. We are not willing or obliged to participate in dispute resolution
              proceedings before a consumer arbitration board.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
