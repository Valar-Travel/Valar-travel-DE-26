import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Impressum - Valar Travel",
  description: "Impressum und rechtliche Informationen fur Valar Travel - Luxury Caribbean Villa Rentals",
}

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-emerald-50 to-white">
      {/* Hero Section */}
      <section className="bg-linear-to-r from-emerald-800 to-emerald-900 text-white py-16">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Impressum</h1>
          <p className="text-lg text-emerald-100">Legal Notice / Rechtliche Angaben</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="prose prose-lg max-w-none space-y-8">
          
          {/* Company Information */}
          <section className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Angaben gemaß § 5 TMG</h2>
            <div className="text-gray-700 space-y-2">
              <p className="font-semibold text-lg">Valar Travel Ltd.</p>
              <p>Luxury Villa Management & Concierge Services</p>
              <p>
                [Tacitusstr. 90]<br />
                [60439 Frankfurt]<br />
                Deutschland / Germany
              </p>
              <p className="mt-4">
                <strong>Sitz der Gesellschaft:</strong> Frankfurt, Germany<br />
                <strong>Registergericht:</strong> [Registergericht]<br />
                <strong>Registernummer:</strong> [841214134895001]
              </p>
            </div>
          </section>

          {/* Representatives */}
          <section className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Vertreten durch</h2>
            <p className="text-gray-700">
              Geschaftsfuhrer: [Sarah Kuhmichel]
            </p>
          </section>

          {/* Contact */}
          <section className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Kontakt</h2>
            <div className="text-gray-700 space-y-1">
              <p><strong>Telefon:</strong> +49 (0) [16092527436]</p>
              <p><strong>E-Mail:</strong> hello@valartravel.de</p>
              <p><strong>Website:</strong> www.valartravel.de</p>
            </div>
          </section>

          {/* VAT */}
          <section className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Umsatzsteuer-ID</h2>
            <p className="text-gray-700">
              Umsatzsteuer-Identifikationsnummer gemaß § 27a Umsatzsteuergesetz:<br />
              <strong>DE [346557770]</strong>
            </p>
          </section>

          {/* Responsible for Content */}
          <section className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Verantwortlich fur den Inhalt nach § 55 Abs. 2 RStV</h2>
            <div className="text-gray-700">
              <p>[Sarah Kuhmichel]</p>
              <p>[Tacitusstr. 90]</p>
              <p>[60439 Frankfurt]</p>
            </div>
          </section>

          {/* Data Protection Officer */}
          <section className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Datenschutzbeauftragter</h2>
            <div className="text-gray-700">
              <p>Bei Fragen zum Datenschutz wenden Sie sich bitte an:</p>
              <p className="mt-2">
                <strong>E-Mail:</strong> hallo@valartravel.de
              </p>
              <p className="mt-4">
                <Link href="/privacy" className="text-emerald-600 hover:underline">
                  Zur vollstandigen Datenschutzerklarung →
                </Link>
              </p>
            </div>
          </section>

          {/* EU Dispute Resolution */}
          <section className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">EU-Streitschlichtung</h2>
            <div className="text-gray-700 space-y-4">
              <p>
                Die Europaische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
              </p>
              <p>
                <a 
                  href="https://ec.europa.eu/consumers/odr/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:underline break-all"
                >
                  https://ec.europa.eu/consumers/odr/
                </a>
              </p>
              <p>
                Unsere E-Mail-Adresse finden Sie oben im Impressum.
              </p>
            </div>
          </section>

          {/* Consumer Dispute Resolution */}
          <section className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Verbraucherstreitbeilegung / Universalschlichtungsstelle</h2>
            <p className="text-gray-700">
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>

          {/* Liability Disclaimers */}
          <section className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Haftungsausschluss</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">Haftung fur Inhalte</h3>
            <p className="text-gray-700 mb-4">
              Als Diensteanbieter sind wir gemaß § 7 Abs.1 TMG fur eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, ubermittelte oder gespeicherte fremde Informationen zu uberwachen oder nach Umstanden zu forschen, die auf eine rechtswidrige Tatigkeit hinweisen.
            </p>
            <p className="text-gray-700 mb-4">
              Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberuhrt. Eine diesbezugliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung moglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">Haftung fur Links</h3>
            <p className="text-gray-700 mb-4">
              Unser Angebot enthalt Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb konnen wir fur diese fremden Inhalte auch keine Gewahr ubernehmen. Fur die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
            </p>
            <p className="text-gray-700">
              Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mogliche Rechtsverstoße uberpruft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
            </p>
          </section>

          {/* Copyright */}
          <section className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Urheberrecht</h2>
            <p className="text-gray-700 mb-4">
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfaltigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedurfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
            </p>
            <p className="text-gray-700">
              Downloads und Kopien dieser Seite sind nur fur den privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
            </p>
          </section>

          {/* Quick Links */}
          <section className="bg-emerald-50 p-6 rounded-lg border border-emerald-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Wichtige Links / Important Links</h2>
            <div className="flex flex-wrap gap-4">
              <Link href="/privacy" className="text-emerald-600 hover:underline">
                Datenschutzerklarung
              </Link>
              <Link href="/terms" className="text-emerald-600 hover:underline">
                AGB
              </Link>
              <Link href="/refund-policy" className="text-emerald-600 hover:underline">
                Widerrufsbelehrung
              </Link>
              <Link href="/data-deletion" className="text-emerald-600 hover:underline">
                Datenloschung
              </Link>
              <Link href="/contact" className="text-emerald-600 hover:underline">
                Kontakt
              </Link>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}
