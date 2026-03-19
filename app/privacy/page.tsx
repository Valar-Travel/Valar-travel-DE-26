import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Datenschutzerklarung / Privacy Policy - Valar Travel",
  description:
    "DSGVO/GDPR compliant privacy policy for Valar Travel. Learn how we protect your personal data.",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-800 to-emerald-900 text-white py-20">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Datenschutzerklarung</h1>
          <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
            Privacy Policy / DSGVO-konforme Datenschutzerklarung
          </p>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-6 max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-8">
              <strong>Stand / Last updated:</strong> {new Date().toLocaleDateString("de-DE")}
            </p>

            <div className="space-y-8">
              {/* Section 1: Controller */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Verantwortlicher / Data Controller</h2>
                <div className="text-gray-700 space-y-4 bg-gray-50 p-6 rounded-lg">
                  <p>
                    <strong>Valar Travel Ltd.</strong><br />
                    Luxury Villa Management & Concierge Services<br />
                    Bridgetown, Barbados
                  </p>
                  <p>
                    <strong>E-Mail:</strong> datenschutz@valartravel.de<br />
                    <strong>Telefon:</strong> +1 (246) 555-0100<br />
                    <strong>Website:</strong> www.valartravel.de
                  </p>
                </div>
              </div>

              {/* Section 2: Overview */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Ubersicht der Verarbeitungen / Overview of Processing</h2>
                <div className="text-gray-700 space-y-4">
                  <p>
                    Die nachfolgende Ubersicht fasst die Arten der verarbeiteten Daten und die Zwecke ihrer Verarbeitung zusammen.
                  </p>
                  <h3 className="text-lg font-semibold">Arten der verarbeiteten Daten / Types of Data Processed:</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Bestandsdaten (z.B. Namen, Adressen) / Contact data</li>
                    <li>Kontaktdaten (z.B. E-Mail, Telefon) / Contact details</li>
                    <li>Inhaltsdaten (z.B. Nachrichten, Anfragen) / Content data</li>
                    <li>Nutzungsdaten (z.B. besuchte Seiten, Interessen) / Usage data</li>
                    <li>Meta-/Kommunikationsdaten (z.B. IP-Adressen, Zugriffszeiten) / Metadata</li>
                  </ul>
                </div>
              </div>

              {/* Section 3: Legal Basis */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Rechtsgrundlagen / Legal Basis</h2>
                <div className="text-gray-700 space-y-4">
                  <p>Die Verarbeitung Ihrer personenbezogenen Daten erfolgt auf Grundlage von:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Art. 6 Abs. 1 lit. a DSGVO:</strong> Einwilligung / Consent</li>
                    <li><strong>Art. 6 Abs. 1 lit. b DSGVO:</strong> Vertragserfullung / Contract performance</li>
                    <li><strong>Art. 6 Abs. 1 lit. c DSGVO:</strong> Rechtliche Verpflichtung / Legal obligation</li>
                    <li><strong>Art. 6 Abs. 1 lit. f DSGVO:</strong> Berechtigte Interessen / Legitimate interests</li>
                  </ul>
                </div>
              </div>

              {/* Section 4: Your Rights */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Ihre Rechte / Your Rights (DSGVO Art. 15-21)</h2>
                <div className="text-gray-700 space-y-4">
                  <p>Sie haben folgende Rechte gegenuber uns bezuglich Ihrer personenbezogenen Daten:</p>
                  <ul className="list-disc pl-6 space-y-3">
                    <li>
                      <strong>Auskunftsrecht (Art. 15 DSGVO):</strong> Sie haben das Recht, Auskunft uber Ihre bei uns gespeicherten Daten zu erhalten.
                    </li>
                    <li>
                      <strong>Berichtigungsrecht (Art. 16 DSGVO):</strong> Sie haben das Recht, unrichtige Daten berichtigen zu lassen.
                    </li>
                    <li>
                      <strong>Loschungsrecht (Art. 17 DSGVO):</strong> Sie haben das Recht auf Loschung Ihrer Daten ("Recht auf Vergessenwerden").
                    </li>
                    <li>
                      <strong>Einschrankung der Verarbeitung (Art. 18 DSGVO):</strong> Sie haben das Recht, die Einschrankung der Verarbeitung zu verlangen.
                    </li>
                    <li>
                      <strong>Datenubertragbarkeit (Art. 20 DSGVO):</strong> Sie haben das Recht, Ihre Daten in einem strukturierten Format zu erhalten.
                    </li>
                    <li>
                      <strong>Widerspruchsrecht (Art. 21 DSGVO):</strong> Sie haben das Recht, der Verarbeitung Ihrer Daten zu widersprechen.
                    </li>
                    <li>
                      <strong>Widerruf der Einwilligung (Art. 7 Abs. 3 DSGVO):</strong> Sie haben das Recht, erteilte Einwilligungen jederzeit zu widerrufen.
                    </li>
                  </ul>
                  <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mt-4">
                    <p className="font-semibold">Datenloschung beantragen / Request Data Deletion:</p>
                    <p>Um Ihre Daten loschen zu lassen, nutzen Sie bitte unser <Link href="/data-deletion" className="text-emerald-600 hover:underline">Datenloschungsformular</Link> oder kontaktieren Sie uns unter datenschutz@valartravel.de</p>
                  </div>
                </div>
              </div>

              {/* Section 5: Supervisory Authority */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Beschwerderecht bei der Aufsichtsbehorde</h2>
                <div className="text-gray-700 space-y-4">
                  <p>
                    Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehorde uber unsere Verarbeitung personenbezogener Daten zu beschweren.
                  </p>
                  <p>
                    Fur Deutschland konnen Sie sich an den Bundesbeauftragten fur Datenschutz wenden oder an die Aufsichtsbehorde Ihres Bundeslandes.
                  </p>
                </div>
              </div>

              {/* Section 6: Cookies */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Cookies und Tracking</h2>
                <div className="text-gray-700 space-y-4">
                  <p>Wir verwenden Cookies und ahnliche Technologien auf unserer Website:</p>
                  
                  <h3 className="text-lg font-semibold mt-4">Notwendige Cookies (Art. 6 Abs. 1 lit. f DSGVO)</h3>
                  <p>Diese Cookies sind fur den Betrieb der Website erforderlich und konnen nicht deaktiviert werden.</p>
                  
                  <h3 className="text-lg font-semibold mt-4">Analyse-Cookies (Art. 6 Abs. 1 lit. a DSGVO)</h3>
                  <p>Mit Ihrer Einwilligung verwenden wir Google Analytics zur Analyse der Websitenutzung. IP-Anonymisierung ist aktiviert.</p>
                  
                  <h3 className="text-lg font-semibold mt-4">Marketing-Cookies (Art. 6 Abs. 1 lit. a DSGVO)</h3>
                  <p>Mit Ihrer Einwilligung verwenden wir Marketing-Cookies fur personalisierte Werbung.</p>
                  
                  <div className="bg-gray-50 p-4 rounded-lg mt-4">
                    <p><strong>Cookie-Einstellungen andern:</strong> Sie konnen Ihre Cookie-Einstellungen jederzeit uber den Button in der Fusszeile anpassen oder Cookies in Ihrem Browser verwalten.</p>
                  </div>
                </div>
              </div>

              {/* Section 7: Third-Party Services */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Drittanbieter-Dienste / Third-Party Services</h2>
                <div className="text-gray-700 space-y-4">
                  
                  <h3 className="text-lg font-semibold">Supabase (Datenbank/Authentifizierung)</h3>
                  <p>Anbieter: Supabase Inc., USA. Datenschutzinformationen: <a href="https://supabase.com/privacy" className="text-emerald-600 hover:underline" target="_blank" rel="noopener noreferrer">supabase.com/privacy</a></p>
                  
                  <h3 className="text-lg font-semibold mt-4">Vercel (Hosting)</h3>
                  <p>Anbieter: Vercel Inc., USA. Die Datenubertragung in die USA erfolgt auf Grundlage von Standardvertragsklauseln. Datenschutzinformationen: <a href="https://vercel.com/legal/privacy-policy" className="text-emerald-600 hover:underline" target="_blank" rel="noopener noreferrer">vercel.com/legal/privacy-policy</a></p>
                  
                  <h3 className="text-lg font-semibold mt-4">Stripe (Zahlungsabwicklung)</h3>
                  <p>Anbieter: Stripe Inc., USA. Fur die Zahlungsabwicklung werden Zahlungsdaten direkt an Stripe ubermittelt. Datenschutzinformationen: <a href="https://stripe.com/privacy" className="text-emerald-600 hover:underline" target="_blank" rel="noopener noreferrer">stripe.com/privacy</a></p>
                  
                  <h3 className="text-lg font-semibold mt-4">Google (Analytics, OAuth)</h3>
                  <p>Anbieter: Google Ireland Limited. Datenschutzinformationen: <a href="https://policies.google.com/privacy" className="text-emerald-600 hover:underline" target="_blank" rel="noopener noreferrer">policies.google.com/privacy</a></p>
                </div>
              </div>

              {/* Section 8: Data Retention */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Speicherdauer / Data Retention</h2>
                <div className="text-gray-700 space-y-4">
                  <p>Wir speichern Ihre Daten nur so lange, wie es fur die jeweiligen Zwecke erforderlich ist:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Kontodaten:</strong> Bis zur Loschung Ihres Kontos</li>
                    <li><strong>Buchungsdaten:</strong> 10 Jahre (gesetzliche Aufbewahrungspflichten)</li>
                    <li><strong>Newsletter-Daten:</strong> Bis zum Widerruf der Einwilligung</li>
                    <li><strong>Kontaktanfragen:</strong> 3 Jahre nach Abschluss der Anfrage</li>
                    <li><strong>Cookies:</strong> Gemaß Cookie-Einstellungen, maximal 12 Monate</li>
                  </ul>
                </div>
              </div>

              {/* Section 9: SSL/TLS */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Datensicherheit / Data Security</h2>
                <div className="text-gray-700 space-y-4">
                  <p>
                    Unsere Website verwendet SSL/TLS-Verschlusselung fur die sichere Ubertragung von Daten. Sie erkennen eine verschlusselte Verbindung am Schlosssymbol in der Browserleiste.
                  </p>
                  <p>
                    Wir setzen technische und organisatorische Sicherheitsmaßnahmen ein, um Ihre Daten gegen zufallige oder vorsatzliche Manipulation, Verlust oder Zugriff durch Unbefugte zu schutzen.
                  </p>
                </div>
              </div>

              {/* Section 10: Changes */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Anderungen dieser Datenschutzerklarung</h2>
                <div className="text-gray-700 space-y-4">
                  <p>
                    Wir behalten uns vor, diese Datenschutzerklarung anzupassen, um sie an geanderte Rechtslagen oder bei Anderungen unserer Dienste anzupassen. Die aktuelle Version finden Sie stets auf dieser Seite.
                  </p>
                </div>
              </div>

              {/* Contact Section */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Kontakt / Contact</h2>
                <div className="text-gray-700 space-y-4">
                  <p>Bei Fragen zum Datenschutz kontaktieren Sie uns:</p>
                  <div className="bg-emerald-50 p-6 rounded-lg">
                    <p><strong>E-Mail:</strong> datenschutz@valartravel.de</p>
                    <p><strong>Telefon:</strong> +1 (246) 555-0100</p>
                    <p><strong>Datenloschung:</strong> <Link href="/data-deletion" className="text-emerald-600 hover:underline">Online-Formular</Link></p>
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
