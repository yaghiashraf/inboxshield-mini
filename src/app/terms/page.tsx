'use client';

import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Terms of <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Service</span>
            </h1>
            <p className="text-gray-300 text-lg">
              Last updated: December 2024
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 space-y-8">
            
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  By accessing and using InboxShield Mini (&quot;Service&quot;), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
                <p>
                  These Terms of Service (&quot;Terms&quot;) govern your use of our email deliverability analysis service operated by InboxShield Mini (&quot;us&quot;, &quot;we&quot;, or &quot;our&quot;).
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  InboxShield Mini provides email authentication analysis services including:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>SPF (Sender Policy Framework) record analysis</li>
                  <li>DKIM (DomainKeys Identified Mail) configuration guidance</li>
                  <li>DMARC (Domain-based Message Authentication) policy evaluation</li>
                  <li>BIMI (Brand Indicators for Message Identification) setup analysis</li>
                  <li>MTA-STS (Mail Transfer Agent Strict Transport Security) configuration review</li>
                  <li>Professional PDF reports and shareable links</li>
                  <li>Copy-paste DNS record fixes</li>
                </ul>
                <p>
                  The service provides analysis and recommendations only. Implementation of suggested changes is the user&apos;s responsibility.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. User Eligibility and Registration</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  <strong className="text-white">Age Requirement:</strong> You must be at least 18 years old to use this service.
                </p>
                <p>
                  <strong className="text-white">Business Use:</strong> This service is intended for legitimate business purposes only. You may not use it for:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Illegal activities or violation of any laws</li>
                  <li>Spamming, phishing, or other malicious email practices</li>
                  <li>Analyzing domains you do not own or have authorization to analyze</li>
                  <li>Reverse engineering or attempting to compromise our service</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Payment Terms</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  <strong className="text-white">Pricing:</strong> Our service is offered as a one-time payment of $12 USD per domain analysis.
                </p>
                <p>
                  <strong className="text-white">Payment Processing:</strong> All payments are processed securely through Stripe. We do not store payment information.
                </p>
                <p>
                  <strong className="text-white">Refund Policy:</strong> Given the instant delivery nature of our digital service, we generally do not provide refunds. However, we may consider refunds in exceptional circumstances:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Technical failure preventing report generation</li>
                  <li>Duplicate charges due to payment processing errors</li>
                  <li>Service unavailability for extended periods</li>
                </ul>
                <p>
                  Refund requests must be submitted within 7 days of purchase. Contact us at support@inboxshield.com for refund requests.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Intellectual Property Rights</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  <strong className="text-white">Service Ownership:</strong> The Service and its original content, features, and functionality are and will remain the exclusive property of InboxShield Mini and its licensors.
                </p>
                <p>
                  <strong className="text-white">User Content:</strong> You retain ownership of domain names and DNS information you provide. By using our service, you grant us permission to analyze this information and generate reports.
                </p>
                <p>
                  <strong className="text-white">Reports:</strong> The reports we generate are provided to you for your use. You may share them internally or with consultants, but may not resell or redistribute them commercially.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. User Responsibilities</h2>
              <div className="text-gray-300 space-y-4">
                <p>You are responsible for:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><strong className="text-white">Accuracy:</strong> Providing accurate domain information for analysis</li>
                  <li><strong className="text-white">Authorization:</strong> Ensuring you have the right to analyze the domains you submit</li>
                  <li><strong className="text-white">Implementation:</strong> Properly implementing any DNS changes based on our recommendations</li>
                  <li><strong className="text-white">Testing:</strong> Testing changes in a safe environment before applying to production systems</li>
                  <li><strong className="text-white">Security:</strong> Keeping your report links secure if they contain sensitive information</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Service Limitations and Disclaimers</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  <strong className="text-white">Analysis Only:</strong> Our service provides analysis and recommendations only. We do not implement changes or guarantee specific results.
                </p>
                <p>
                  <strong className="text-white">No Warranty:</strong> The service is provided &quot;as is&quot; without any warranty of any kind. We do not guarantee:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Improved email deliverability (many factors affect deliverability)</li>
                  <li>100% accuracy of all recommendations</li>
                  <li>Compatibility with all email systems and providers</li>
                  <li>Resolution of all email-related issues</li>
                </ul>
                <p>
                  <strong className="text-white">Service Availability:</strong> We strive for 99.9% uptime but cannot guarantee uninterrupted service. Scheduled maintenance will be announced when possible.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Limitation of Liability</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  To the maximum extent permitted by applicable law, InboxShield Mini shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Loss of profits, data, or business opportunities</li>
                  <li>Email delivery failures or bounced emails</li>
                  <li>DNS configuration errors or downtime</li>
                  <li>Third-party service interruptions</li>
                </ul>
                <p>
                  Our total liability shall not exceed the amount you paid for the service ($12 USD).
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">9. Indemnification</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  You agree to defend, indemnify, and hold harmless InboxShield Mini from and against any and all claims, damages, obligations, losses, liabilities, costs, or debt, and expenses (including but not limited to attorney&apos;s fees) arising from:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Your use of the service</li>
                  <li>Your violation of these Terms</li>
                  <li>Your violation of any third-party right, including intellectual property rights</li>
                  <li>Any harm caused by your implementation of our recommendations</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">10. Privacy and Data Protection</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.
                </p>
                <p>
                  By using our service, you consent to the collection and use of information as described in our Privacy Policy.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">11. Termination</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  <strong className="text-white">By You:</strong> You may stop using our service at any time. Payments made are non-refundable except as specified in our refund policy.
                </p>
                <p>
                  <strong className="text-white">By Us:</strong> We may terminate or suspend your access immediately, without prior notice, if you breach these Terms.
                </p>
                <p>
                  <strong className="text-white">Effect of Termination:</strong> Upon termination, your right to use the service ceases immediately. Previously generated reports may remain accessible via their links unless requested to be removed.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">12. Governing Law and Disputes</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  These Terms shall be interpreted and governed by the laws of [Your Jurisdiction], without regard to its conflict of law provisions.
                </p>
                <p>
                  <strong className="text-white">Dispute Resolution:</strong> We prefer to resolve disputes amicably. Please contact us first at legal@inboxshield.com. If we cannot resolve a dispute informally, any legal disputes will be resolved through binding arbitration.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">13. Changes to Terms</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
                </p>
                <p>
                  Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">14. Severability</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law, and the remaining provisions will continue in full force and effect.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">15. Contact Information</h2>
              <div className="text-gray-300 space-y-4">
                <p>If you have any questions about these Terms of Service, please contact us:</p>
                <div className="bg-gray-700/50 rounded-lg p-4 mt-4">
                  <p><strong className="text-white">General Support:</strong> support@inboxshield.com</p>
                  <p><strong className="text-white">Legal Questions:</strong> legal@inboxshield.com</p>
                  <p><strong className="text-white">Refund Requests:</strong> support@inboxshield.com</p>
                  <p><strong className="text-white">Website:</strong> https://inboxshield.com</p>
                  <p><strong className="text-white">Response Time:</strong> We aim to respond within 48 hours</p>
                </div>
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