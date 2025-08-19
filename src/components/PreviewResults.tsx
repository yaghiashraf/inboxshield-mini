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
      const response = await fetch('/api/create-checkout-session', {
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
    <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 shadow-2xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-4">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          <span className="text-blue-300 text-sm font-medium">Analysis Complete</span>
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">
          Security Preview for <span className="text-blue-400">{result.domain}</span>
        </h2>
        <div className="flex items-center justify-center gap-3">
          <span className="text-gray-300">Overall Score:</span>
          <div className={`text-3xl font-bold px-4 py-2 rounded-lg ${
            result.overallScore >= 80 ? 'text-green-400 bg-green-900/20' : 
            result.overallScore >= 60 ? 'text-yellow-400 bg-yellow-900/20' : 'text-red-400 bg-red-900/20'
          }`}>
            {result.overallScore}/100
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {/* SPF */}
        <div className={`p-6 rounded-xl border backdrop-blur-sm ${getStatusColor(result.spf.status)}`}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{getStatusIcon(result.spf.status)}</span>
            <div>
              <span className="font-bold text-lg">SPF</span>
              <p className="text-sm opacity-80">Sender Policy Framework</p>
            </div>
          </div>
          {result.spf.issues.length > 0 && (
            <div className="flex items-center gap-2 text-xs font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{result.spf.issues.length} issue{result.spf.issues.length > 1 ? 's' : ''} found</span>
            </div>
          )}
        </div>

        {/* DMARC */}
        <div className={`p-6 rounded-xl border backdrop-blur-sm ${getStatusColor(result.dmarc.status)}`}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{getStatusIcon(result.dmarc.status)}</span>
            <div>
              <span className="font-bold text-lg">DMARC</span>
              <p className="text-sm opacity-80">Domain Authentication</p>
            </div>
          </div>
          {result.dmarc.issues.length > 0 && (
            <div className="flex items-center gap-2 text-xs font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{result.dmarc.issues.length} issue{result.dmarc.issues.length > 1 ? 's' : ''} found</span>
            </div>
          )}
        </div>

        {/* DKIM */}
        <div className={`p-6 rounded-xl border backdrop-blur-sm ${getStatusColor(result.dkim.status)}`}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{getStatusIcon(result.dkim.status)}</span>
            <div>
              <span className="font-bold text-lg">DKIM</span>
              <p className="text-sm opacity-80">Email Signing</p>
            </div>
          </div>
          {result.dkim.issues.length > 0 && (
            <div className="flex items-center gap-2 text-xs font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{result.dkim.issues.length} issue{result.dkim.issues.length > 1 ? 's' : ''} found</span>
            </div>
          )}
        </div>

        {/* BIMI */}
        <div className={`p-6 rounded-xl border backdrop-blur-sm ${getStatusColor(result.bimi.status)}`}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{getStatusIcon(result.bimi.status)}</span>
            <div>
              <span className="font-bold text-lg">BIMI</span>
              <p className="text-sm opacity-80">Brand Indicators</p>
            </div>
          </div>
          {result.bimi.issues.length > 0 && (
            <div className="flex items-center gap-2 text-xs font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{result.bimi.issues.length} issue{result.bimi.issues.length > 1 ? 's' : ''} found</span>
            </div>
          )}
        </div>

        {/* MTA-STS */}
        <div className={`p-6 rounded-xl border backdrop-blur-sm ${getStatusColor(result.mtaSts.status)}`}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{getStatusIcon(result.mtaSts.status)}</span>
            <div>
              <span className="font-bold text-lg">MTA-STS</span>
              <p className="text-sm opacity-80">Transport Security</p>
            </div>
          </div>
          {result.mtaSts.issues.length > 0 && (
            <div className="flex items-center gap-2 text-xs font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{result.mtaSts.issues.length} issue{result.mtaSts.issues.length > 1 ? 's' : ''} found</span>
            </div>
          )}
        </div>
      </div>

      {/* Preview Limitations */}
      <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="font-bold text-yellow-400 text-lg">Preview Limitations</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-yellow-300">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="text-sm">Issue details and specific problems hidden</span>
          </div>
          <div className="flex items-center gap-2 text-yellow-300">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="text-sm">No copy-paste DNS fix records provided</span>
          </div>
          <div className="flex items-center gap-2 text-yellow-300">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="text-sm">No step-by-step implementation guide</span>
          </div>
          <div className="flex items-center gap-2 text-yellow-300">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="text-sm">No downloadable PDF report</span>
          </div>
        </div>
      </div>

      {/* Purchase CTA */}
      <div className="text-center">
        <div className="mb-6">
          <div className="inline-flex items-center space-x-2 bg-green-900/20 border border-green-500/30 rounded-lg px-4 py-2 mb-4">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-green-400 font-medium">Upgrade to get full access</span>
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
                <span className="text-xl">Get Full Report with Fixes - $12</span>
              </>
            )}
          </span>
          {!isLoading && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          )}
        </button>
        
        <div className="mt-4 flex flex-wrap justify-center items-center gap-4 text-sm text-gray-300">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Instant access</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Professional PDF report</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span>Copy-paste DNS records</span>
          </div>
        </div>
      </div>
    </div>
  );
}