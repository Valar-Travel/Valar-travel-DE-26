import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy - Valar Travel",
  description: "Learn about Valar Travel's refund and cancellation policy for luxury villa rentals in the Caribbean.",
}

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 text-white py-16">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Refund & Cancellation Policy</h1>
            <p className="text-xl text-emerald-100">Understanding our booking terms for luxury villa rentals</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 lg:px-6 py-16">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <div className="bg-emerald-50 border-l-4 border-emerald-600 p-6 mb-8">
            <p className="text-emerald-800 font-medium mb-2">Last Updated: March 19, 2026</p>
            <p className="text-emerald-700">
              This Refund & Cancellation Policy applies to all bookings made through Valar Travel for luxury villa 
              rentals in the Caribbean. Please read carefully before making a reservation.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Overview</h2>
            <p className="text-gray-700 mb-4">
              Valar Travel is committed to providing exceptional service and flexibility for our guests. We understand 
              that plans can change, and we strive to accommodate our guests while also protecting property owners 
              and maintaining the high standards of our luxury villa collection.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Cancellation Timeframes</h2>
            <p className="text-gray-700 mb-4">
              Our cancellation policy is based on the number of days before your scheduled check-in date:
            </p>
            <div className="bg-gray-50 rounded-lg p-6 mb-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-3">
                  <span className="font-medium text-gray-900">60+ days before check-in</span>
                  <span className="text-emerald-600 font-semibold">100% refund (minus booking fee)</span>
                </div>
                <div className="flex justify-between items-center border-b pb-3">
                  <span className="font-medium text-gray-900">30-59 days before check-in</span>
                  <span className="text-amber-600 font-semibold">50% refund</span>
                </div>
                <div className="flex justify-between items-center border-b pb-3">
                  <span className="font-medium text-gray-900">14-29 days before check-in</span>
                  <span className="text-orange-600 font-semibold">25% refund</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">Less than 14 days before check-in</span>
                  <span className="text-red-600 font-semibold">No refund</span>
                </div>
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              * A non-refundable booking fee of 5% applies to all reservations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Booking Deposit</h2>
            <p className="text-gray-700 mb-4">
              A deposit of 30% of the total booking amount is required at the time of reservation to secure your villa. 
              The remaining balance is due 30 days before your check-in date.
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Deposits are applied toward your cancellation refund calculation</li>
              <li>For bookings made within 30 days of check-in, full payment is required at booking</li>
              <li>Deposits may be transferable to future bookings at our discretion</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. How to Request a Cancellation</h2>
            <p className="text-gray-700 mb-4">
              To cancel or modify your reservation, please contact our concierge team:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Email: <a href="mailto:bookings@valartravel.de" className="text-emerald-600 hover:underline">bookings@valartravel.de</a></li>
              <li>Phone: +49 (0) 30 1234 5678</li>
              <li>Through your account dashboard on our website</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Cancellation requests must be submitted in writing. The cancellation date is determined by when we 
              receive your written request, not when you decide to cancel.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Refund Processing</h2>
            <p className="text-gray-700 mb-4">
              Once your cancellation is confirmed:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Refunds are processed within 5-10 business days</li>
              <li>Refunds are issued to the original payment method</li>
              <li>Bank processing may take an additional 5-7 business days</li>
              <li>Currency exchange rate differences may apply for international transactions</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Modifications to Bookings</h2>
            <p className="text-gray-700 mb-4">
              We understand plans can change. Date modifications may be possible subject to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Villa availability for requested dates</li>
              <li>A modification fee of EUR 150 per change</li>
              <li>Any price difference between original and new dates</li>
              <li>Modifications must be requested at least 30 days before original check-in</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Force Majeure & Exceptional Circumstances</h2>
            <p className="text-gray-700 mb-4">
              In cases of extraordinary circumstances beyond our control, including but not limited to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Natural disasters (hurricanes, earthquakes, floods)</li>
              <li>Government travel restrictions or advisories</li>
              <li>Pandemic-related travel bans</li>
              <li>War, terrorism, or civil unrest</li>
            </ul>
            <p className="text-gray-700 mb-4">
              We will work with you to find a fair solution, which may include rebooking for alternative dates 
              or a travel credit for future use. Full refunds in force majeure situations are evaluated on a 
              case-by-case basis.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Travel Insurance</h2>
            <p className="text-gray-700 mb-4">
              We strongly recommend purchasing comprehensive travel insurance that covers trip cancellation, 
              interruption, and medical emergencies. Travel insurance can provide additional protection beyond 
              our cancellation policy, including coverage for:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Unexpected illness or injury</li>
              <li>Family emergencies</li>
              <li>Flight cancellations or delays</li>
              <li>Lost or stolen luggage</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Property Owner Cancellations</h2>
            <p className="text-gray-700 mb-4">
              In the rare event that a property owner must cancel your booking:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>You will receive a full refund of all amounts paid</li>
              <li>We will assist in finding comparable alternative accommodation</li>
              <li>A 10% discount code will be provided for future bookings</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Early Departure</h2>
            <p className="text-gray-700 mb-4">
              No refunds are provided for early departure or unused nights during your stay. If you need to leave 
              early, please contact our concierge team immediately so we can assist with any necessary arrangements.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Additional Services</h2>
            <p className="text-gray-700 mb-4">
              Cancellation terms for additional services (chef services, excursions, spa treatments, etc.) may 
              vary based on the service provider. Specific terms will be communicated at the time of booking 
              these services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about our refund and cancellation policy, please contact our team:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-2">
                <strong>Email:</strong> <a href="mailto:hello@valartravel.de" className="text-emerald-600 hover:underline">hello@valartravel.de</a>
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Bookings:</strong> <a href="mailto:bookings@valartravel.de" className="text-emerald-600 hover:underline">bookings@valartravel.de</a>
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Phone:</strong> +49 (0) 30 1234 5678
              </p>
              <p className="text-gray-700">
                <strong>Address:</strong> Valar Travel GmbH, Berlin, Germany
              </p>
            </div>
          </section>

          <section className="mb-8">
            <div className="bg-amber-50 border-l-4 border-amber-500 p-6">
              <h3 className="text-lg font-semibold text-amber-800 mb-2">Important Note</h3>
              <p className="text-amber-700">
                By making a booking with Valar Travel, you acknowledge that you have read, understood, and agree 
                to this Refund & Cancellation Policy. We recommend saving a copy of this policy for your records.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
