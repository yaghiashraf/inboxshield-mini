'use client';

import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Privacy <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Policy</span>
            </h1>
            <p className="text-gray-300 text-lg">
              Last updated: December 2024
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 space-y-8">
            
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  <strong className="text-white">Domain Information:</strong> When you use our service, we collect the domain name you enter for analysis. This is necessary to perform DNS lookups and generate your email authentication report.
                </p>
                <p>
                  <strong className="text-white">Payment Information:</strong> We use Stripe to process payments. We do not store your payment information on our servers. Stripe processes and secures all payment data according to PCI DSS standards.
                </p>
                <p>
                  <strong className="text-white">Technical Data:</strong> We automatically collect certain information when you visit our website, including:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>IP address and general location</li>
                  <li>Browser type and version</li>
                  <li>Device type and screen resolution</li>
                  <li>Pages visited and time spent on site</li>
                  <li>Referring website or search terms</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
              <div className="text-gray-300 space-y-4">
                <p>We use the information we collect for the following purposes:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><strong className="text-white">Service Delivery:</strong> To perform DNS analysis and generate your email authentication report</li>
                  <li><strong className="text-white">Payment Processing:</strong> To process your one-time payment through Stripe</li>
                  <li><strong className="text-white">Communication:</strong> To send you your report link and payment confirmations</li>
                  <li><strong className="text-white">Service Improvement:</strong> To understand how our service is used and make improvements</li>
                  <li><strong className="text-white">Legal Compliance:</strong> To comply with applicable laws and regulations</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Data Retention and Storage</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  <strong className="text-white">Reports:</strong> Your generated reports are accessible via shareable links indefinitely. You can request deletion of your report by contacting us.
                </p>
                <p>
                  <strong className="text-white">Domain Data:</strong> Domain names entered for analysis are not permanently stored in our databases. They are processed in real-time and may be temporarily cached for performance optimization.
                </p>
                <p>
                  <strong className="text-white">Analytics Data:</strong> Website usage data is retained for up to 24 months for analytics and service improvement purposes.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Data Sharing and Disclosure</h2>
              <div className="text-gray-300 space-y-4">
                <p>We do not sell, trade, or otherwise transfer your personal information to third parties, except in the following circumstances:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><strong className="text-white">Service Providers:</strong> We share data with trusted third parties who assist in operating our website and conducting our business (e.g., Stripe for payments, Netlify for hosting)</li>
                  <li><strong className="text-white">Legal Requirements:</strong> We may disclose information when required by law, regulation, legal process, or governmental request</li>
                  <li><strong className="text-white">Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, user information may be transferred to the new owner</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Security Measures</h2>
              <div className="text-gray-300 space-y-4">
                <p>We implement appropriate security measures to protect your information:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>All data transmission is encrypted using HTTPS/TLS</li>
                  <li>Payment processing is handled securely by Stripe (PCI DSS compliant)</li>
                  <li>Regular security updates and monitoring</li>
                  <li>Limited access to personal data on a need-to-know basis</li>
                  <li>No storage of sensitive payment information on our servers</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Your Rights and Choices</h2>
              <div className="text-gray-300 space-y-4">
                <p>Depending on your location, you may have the following rights:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><strong className="text-white">Access:</strong> Request a copy of the personal information we have about you</li>
                  <li><strong className="text-white">Correction:</strong> Request correction of inaccurate or incomplete information</li>
                  <li><strong className="text-white">Deletion:</strong> Request deletion of your personal information and reports</li>
                  <li><strong className="text-white">Portability:</strong> Request transfer of your data to another service</li>
                  <li><strong className="text-white">Objection:</strong> Object to certain processing activities</li>
                </ul>
                <p className="mt-4">
                  To exercise these rights, please contact us at privacy@inboxshield.com. We will respond to your request within 30 days.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Cookies and Tracking</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  We use essential cookies to ensure our website functions properly. We do not use tracking cookies for advertising purposes. Our analytics are privacy-focused and do not track individual users across websites.
                </p>
                <p>
                  You can control cookies through your browser settings, but disabling essential cookies may affect website functionality.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. International Data Transfers</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  Our service is hosted on Netlify's global CDN. Your data may be processed in countries other than your own. We ensure that appropriate safeguards are in place for international data transfers in compliance with applicable data protection laws.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">9. Children's Privacy</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  Our service is not intended for individuals under the age of 18. We do not knowingly collect personal information from children under 18. If we become aware that we have collected such information, we will take steps to delete it promptly.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">10. Changes to This Policy</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  We may update this privacy policy from time to time. We will notify users of significant changes by posting the new policy on this page with an updated "Last updated" date. Continued use of our service after changes constitutes acceptance of the updated policy.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">11. Contact Information</h2>
              <div className="text-gray-300 space-y-4">
                <p>If you have questions about this privacy policy or our data practices, please contact us:</p>
                <div className="bg-gray-700/50 rounded-lg p-4 mt-4">
                  <p><strong className="text-white">Email:</strong> privacy@inboxshield.com</p>
                  <p><strong className="text-white">Website:</strong> https://inboxshield.com</p>
                  <p><strong className="text-white">Response Time:</strong> We aim to respond within 48 hours</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">12. Compliance</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  This privacy policy is designed to comply with major privacy regulations including:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>European Union General Data Protection Regulation (GDPR)</li>
                  <li>California Consumer Privacy Act (CCPA)</li>
                  <li>Canadian Personal Information Protection and Electronic Documents Act (PIPEDA)</li>
                  <li>Other applicable local and national privacy laws</li>
                </ul>
              </div>
            </section>

          </div>

          {/* Back to Home */}
          <div className="text-center mt-12">
            <Link 
              href="/"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}