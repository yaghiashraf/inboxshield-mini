'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { DomainCheckResult } from '@/types';

interface PreviewResultsProps {
  result: DomainCheckResult;
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

export function PreviewResults({ result }: PreviewResultsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const getStatusIcon = (status: 'pass' | 'warn' | 'fail') => {
    switch (status) {
      case 'pass': return '✅';
      case 'warn': return '⚠️';
      case 'fail': return '❌';
    }
  };

  const getStatusColor = (status: 'pass' | 'warn' | 'fail') => {
    switch (status) {
      case 'pass': return 'text-green-400 bg-green-900/20 border-green-500/30';
      case 'warn': return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30';
      case 'fail': return 'text-red-400 bg-red-900/20 border-red-500/30';
    }
  };

  const handlePurchaseReport = async () => {
    setIsLoading(true);
    
    try {
      // Create checkout session
      const response = await fetch('/.netlify/functions/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain: result.domain }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { sessionId } = await response.json();
      const stripe = await stripePromise;

      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      // Redirect to Stripe checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) {
        console.error('Stripe checkout error:', error);
        alert('Sorry, there was an error redirecting to checkout. Please try again.');
      }
    } catch (error) {
      console.error('Error initiating payment:', error);
      alert('Sorry, there was an error processing your payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-4">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          <span className="text-blue-300 text-sm font-medium">Analysis Complete</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">
          Email Security Results for <span className="text-blue-400">{result.domain}</span>
        </h2>
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="text-gray-300">Overall Score:</span>
          <div className={`text-2xl font-bold px-4 py-2 rounded-lg ${
            result.overallScore >= 80 ? 'text-green-400 bg-green-900/20' : 
            result.overallScore >= 60 ? 'text-yellow-400 bg-yellow-900/20' : 'text-red-400 bg-red-900/20'
          }`}>
            {result.overallScore}/100
          </div>
        </div>
        
        {result.overallScore < 80 && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6 mb-6 text-left">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">⚠️</span>
              <h3 className="text-xl font-bold text-red-300">Your emails are going to spam!</h3>
            </div>
            <p className="text-red-200 text-base leading-relaxed">
              Your email setup scored {result.overallScore}/100, which means most of your important business emails 
              are likely ending up in spam folders instead of your customers' inboxes. This is costing you sales and damaging your reputation.
            </p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {/* SPF Section */}
        <div className={`p-6 rounded-xl border backdrop-blur-sm ${getStatusColor(result.spf.status)}`}>
          <div className="flex items-start gap-4">
            <span className="text-3xl flex-shrink-0">{getStatusIcon(result.spf.status)}</span>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-xl font-bold">Email Sender Verification (SPF)</h3>
                <span className="text-sm opacity-75 bg-black/20 px-2 py-1 rounded">
                  {result.spf.status === 'pass' ? 'WORKING' : result.spf.status === 'warn' ? 'NEEDS FIXING' : 'BROKEN'}
                </span>
              </div>
              
              <p className="text-sm opacity-90 mb-4 leading-relaxed">
                This tells Gmail, Yahoo, and other email providers that you're allowed to send emails from your domain. 
                When it's missing or broken, your emails look suspicious and get sent to spam automatically.
              </p>
              
              {result.spf.issues.length > 0 ? (
                <div className="space-y-2">
                  <div className="font-medium text-sm">Issues Found:</div>
                  {result.spf.issues.map((issue, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-red-400 mt-1">•</span>
                      <div>
                        <span>{issue}</span>
                        <div className="text-xs opacity-75 mt-1">
                          {issue.includes('not found') && 'Effect: Your emails will likely go to spam folders'}
                          {issue.includes('optimization') && 'Effect: Reduced email deliverability and trust'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm font-medium text-green-300">
                  ✓ SPF is properly configured
                </div>
              )}
            </div>
          </div>
        </div>

        {/* DMARC Section */}
        <div className={`p-6 rounded-xl border backdrop-blur-sm ${getStatusColor(result.dmarc.status)}`}>
          <div className="flex items-start gap-4">
            <span className="text-3xl flex-shrink-0">{getStatusIcon(result.dmarc.status)}</span>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-xl font-bold">Email Security Policy (DMARC)</h3>
                <span className="text-sm opacity-75 bg-black/20 px-2 py-1 rounded">
                  {result.dmarc.status === 'pass' ? 'WORKING' : result.dmarc.status === 'warn' ? 'NEEDS FIXING' : 'BROKEN'}
                </span>
              </div>
              
              <p className="text-sm opacity-90 mb-4 leading-relaxed">
                This protects your business from scammers who try to send fake emails using your company name. 
                It also tells email providers what to do when someone tries to impersonate you - without it, your real emails get blocked.
              </p>
              
              {result.dmarc.issues.length > 0 ? (
                <div className="space-y-2">
                  <div className="font-medium text-sm">Issues Found:</div>
                  {result.dmarc.issues.map((issue, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-red-400 mt-1">•</span>
                      <div>
                        <span>{issue}</span>
                        <div className="text-xs opacity-75 mt-1">
                          {issue.includes('not found') && 'Effect: No protection against domain spoofing, emails may be rejected'}
                          {issue.includes('monitoring') && 'Effect: Limited protection, some emails may still go to spam'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm font-medium text-green-300">
                  ✓ DMARC is properly configured
                </div>
              )}
            </div>
          </div>
        </div>

        {/* DKIM Section */}
        <div className={`p-6 rounded-xl border backdrop-blur-sm ${getStatusColor(result.dkim.status)}`}>
          <div className="flex items-start gap-4">
            <span className="text-3xl flex-shrink-0">{getStatusIcon(result.dkim.status)}</span>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-xl font-bold">Email Signature (DKIM)</h3>
                <span className="text-sm opacity-75 bg-black/20 px-2 py-1 rounded">
                  {result.dkim.status === 'pass' ? 'WORKING' : result.dkim.status === 'warn' ? 'NEEDS FIXING' : 'BROKEN'}
                </span>
              </div>
              
              <p className="text-sm opacity-90 mb-4 leading-relaxed">
                This adds an invisible "signature" to your emails that proves they're really from you and haven't been tampered with. 
                Gmail, Outlook, and other major email services require this signature to deliver your emails to the inbox.
              </p>
              
              {result.dkim.issues.length > 0 ? (
                <div className="space-y-2">
                  <div className="font-medium text-sm">Issues Found:</div>
                  {result.dkim.issues.map((issue, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-red-400 mt-1">•</span>
                      <div>
                        <span>{issue}</span>
                        <div className="text-xs opacity-75 mt-1">
                          {issue.includes('not found') && 'Effect: Emails appear untrustworthy, high spam folder rate'}
                          {issue.includes('selectors') && 'Effect: Some emails may not have proper authentication'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm font-medium text-green-300">
                  ✓ DKIM is properly configured
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BIMI Section */}
        <div className={`p-6 rounded-xl border backdrop-blur-sm ${getStatusColor(result.bimi.status)}`}>
          <div className="flex items-start gap-4">
            <span className="text-3xl flex-shrink-0">{getStatusIcon(result.bimi.status)}</span>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-xl font-bold">Company Logo Display (BIMI)</h3>
                <span className="text-sm opacity-75 bg-black/20 px-2 py-1 rounded">BONUS FEATURE</span>
              </div>
              
              <p className="text-sm opacity-90 mb-4 leading-relaxed">
                This shows your company logo next to your emails in Gmail and Yahoo Mail, making your emails instantly recognizable 
                and more trustworthy to customers. It's like having your business card appear with every email.
              </p>
              
              {result.bimi.issues.length > 0 ? (
                <div className="space-y-2">
                  <div className="font-medium text-sm">Status:</div>
                  {result.bimi.issues.map((issue, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-yellow-400 mt-1">•</span>
                      <div>
                        <span>{issue}</span>
                        <div className="text-xs opacity-75 mt-1">
                          Effect: No logo display in emails, missed branding opportunity
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm font-medium text-green-300">
                  ✓ BIMI is configured - your logo will appear in emails
                </div>
              )}
            </div>
          </div>
        </div>

        {/* MTA-STS Section */}
        <div className={`p-6 rounded-xl border backdrop-blur-sm ${getStatusColor(result.mtaSts.status)}`}>
          <div className="flex items-start gap-4">
            <span className="text-3xl flex-shrink-0">{getStatusIcon(result.mtaSts.status)}</span>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-xl font-bold">Secure Email Delivery (MTA-STS)</h3>
                <span className="text-sm opacity-75 bg-black/20 px-2 py-1 rounded">EXTRA SECURITY</span>
              </div>
              
              <p className="text-sm opacity-90 mb-4 leading-relaxed">
                This ensures that emails sent to your business are always encrypted and secure, protecting sensitive 
                customer information from hackers who might try to intercept them during delivery.
              </p>
              
              {result.mtaSts.issues.length > 0 ? (
                <div className="space-y-2">
                  <div className="font-medium text-sm">Status:</div>
                  {result.mtaSts.issues.map((issue, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-yellow-400 mt-1">•</span>
                      <div>
                        <span>{issue}</span>
                        <div className="text-xs opacity-75 mt-1">
                          Effect: Emails may be vulnerable to interception during delivery
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm font-medium text-green-300">
                  ✓ MTA-STS is configured - secure email transport enabled
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Summary and Next Steps */}
      <div className="mt-8 p-6 bg-gradient-to-r from-blue-900/30 via-purple-900/30 to-green-900/30 border border-gray-600/50 rounded-xl">
        <div className="text-center">
          <h3 className="text-xl font-bold text-white mb-4">
            Ready to Fix These Issues and Boost Your Email Deliverability?
          </h3>
          
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
            <p className="text-red-200 font-medium mb-2">
              ⚠️ This preview shows you have email authentication problems
            </p>
            <p className="text-red-200 text-sm">
              Without proper fixes, your emails will continue going to spam folders, 
              costing you customers and revenue every day.
            </p>
          </div>
          
          <div className="space-y-4 mb-6">
            <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-lg p-5">
              <h4 className="text-green-400 font-bold text-lg mb-3 flex items-center gap-2">
                <span>✓</span>
                Complete Email Fix Package - Instant Delivery
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="text-white font-medium mb-2">📋 Detailed Analysis Report:</h5>
                  <ul className="text-sm text-gray-300 space-y-1 pl-3">
                    <li>• Professional PDF with full security audit</li>
                    <li>• Shareable link for your team/consultants</li>
                    <li>• Priority level of each issue found</li>
                    <li>• Business impact explanation for each problem</li>
                  </ul>
                </div>
                <div>
                  <h5 className="text-white font-medium mb-2">🔧 Ready-to-Use Solutions:</h5>
                  <ul className="text-sm text-gray-300 space-y-1 pl-3">
                    <li>• Exact DNS records formatted for copy-paste</li>
                    <li>• Step-by-step instructions with screenshots</li>
                    <li>• Provider-specific guides (GoDaddy, Cloudflare, etc.)</li>
                    <li>• Verification steps to confirm fixes worked</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-lg p-5">
              <h4 className="text-blue-400 font-bold text-lg mb-3 flex items-center gap-2">
                <span>🚀</span>
                Expected Results Within 24-48 Hours
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="text-white font-medium mb-2">📈 Immediate Improvements:</h5>
                  <ul className="text-sm text-gray-300 space-y-1 pl-3">
                    <li>• 95%+ inbox delivery rate (vs current ~{Math.max(10, result.overallScore)}%)</li>
                    <li>• Zero important emails in spam folders</li>
                    <li>• Enhanced sender reputation with ISPs</li>
                    <li>• Protection against domain impersonation</li>
                  </ul>
                </div>
                <div>
                  <h5 className="text-white font-medium mb-2">💰 Business Impact:</h5>
                  <ul className="text-sm text-gray-300 space-y-1 pl-3">
                    <li>• Higher email marketing conversion rates</li>
                    <li>• Customers actually receive invoices & updates</li>
                    <li>• Professional brand image & trust</li>
                    <li>• Reduced customer support tickets</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-500/30 rounded-lg p-4">
              <h4 className="text-yellow-400 font-bold mb-2 flex items-center gap-2">
                <span>⚡</span>
                Bonus: 30-Day Money-Back Guarantee
              </h4>
              <p className="text-sm text-gray-300">
                If you follow our instructions and don't see significant improvement in your email deliverability within 30 days, 
                we'll refund your $11.99 - no questions asked.
              </p>
            </div>
          </div>
          
          <button
            onClick={handlePurchaseReport}
            disabled={isLoading}
            className={`relative overflow-hidden group w-full md:w-auto ${
              isLoading 
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 hover:scale-105'
            } text-white font-bold py-5 px-12 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 transform`}
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                  <span className="text-lg">Processing...</span>
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-xl">Get Complete Fix Guide - Only $11.99</span>
                </>
              )}
            </span>
            {!isLoading && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            )}
          </button>
          
          <div className="mt-4 text-sm text-gray-400">
            💡 <strong className="text-white">One-time payment</strong> • <strong className="text-green-400">Instant delivery</strong> • <strong className="text-blue-400">30-day money-back guarantee</strong>
          </div>
        </div>
      </div>
    </div>
  );
}