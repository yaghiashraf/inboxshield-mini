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
      case 'pass': return 'text-green-600 bg-green-50 border-green-200';
      case 'warn': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'fail': return 'text-red-600 bg-red-50 border-red-200';
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
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Email Security Preview for {result.domain}
        </h2>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <span>Overall Score: </span>
          <span className={`font-bold text-lg ${
            result.overallScore >= 80 ? 'text-green-600' : 
            result.overallScore >= 60 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {result.overallScore}/100
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {/* SPF */}
        <div className={`p-4 rounded-lg border ${getStatusColor(result.spf.status)}`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{getStatusIcon(result.spf.status)}</span>
            <span className="font-semibold">SPF</span>
          </div>
          <p className="text-sm opacity-80">Sender Policy Framework</p>
          {result.spf.issues.length > 0 && (
            <p className="text-xs mt-1 font-medium">
              {result.spf.issues.length} issue{result.spf.issues.length > 1 ? 's' : ''} found
            </p>
          )}
        </div>

        {/* DMARC */}
        <div className={`p-4 rounded-lg border ${getStatusColor(result.dmarc.status)}`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{getStatusIcon(result.dmarc.status)}</span>
            <span className="font-semibold">DMARC</span>
          </div>
          <p className="text-sm opacity-80">Domain Authentication</p>
          {result.dmarc.issues.length > 0 && (
            <p className="text-xs mt-1 font-medium">
              {result.dmarc.issues.length} issue{result.dmarc.issues.length > 1 ? 's' : ''} found
            </p>
          )}
        </div>

        {/* DKIM */}
        <div className={`p-4 rounded-lg border ${getStatusColor(result.dkim.status)}`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{getStatusIcon(result.dkim.status)}</span>
            <span className="font-semibold">DKIM</span>
          </div>
          <p className="text-sm opacity-80">Email Signing</p>
          {result.dkim.issues.length > 0 && (
            <p className="text-xs mt-1 font-medium">
              {result.dkim.issues.length} issue{result.dkim.issues.length > 1 ? 's' : ''} found
            </p>
          )}
        </div>

        {/* BIMI */}
        <div className={`p-4 rounded-lg border ${getStatusColor(result.bimi.status)}`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{getStatusIcon(result.bimi.status)}</span>
            <span className="font-semibold">BIMI</span>
          </div>
          <p className="text-sm opacity-80">Brand Indicators</p>
          {result.bimi.issues.length > 0 && (
            <p className="text-xs mt-1 font-medium">
              {result.bimi.issues.length} issue{result.bimi.issues.length > 1 ? 's' : ''} found
            </p>
          )}
        </div>

        {/* MTA-STS */}
        <div className={`p-4 rounded-lg border ${getStatusColor(result.mtaSts.status)}`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{getStatusIcon(result.mtaSts.status)}</span>
            <span className="font-semibold">MTA-STS</span>
          </div>
          <p className="text-sm opacity-80">Transport Security</p>
          {result.mtaSts.issues.length > 0 && (
            <p className="text-xs mt-1 font-medium">
              {result.mtaSts.issues.length} issue{result.mtaSts.issues.length > 1 ? 's' : ''} found
            </p>
          )}
        </div>
      </div>

      {/* Preview Limitations */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-gray-900 mb-2">🔒 Preview Limitations</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Issue details and specific problems hidden</li>
          <li>• No copy-paste DNS fix records provided</li>
          <li>• No step-by-step implementation guide</li>
          <li>• No provider-specific instructions</li>
          <li>• No downloadable PDF report</li>
        </ul>
      </div>

      {/* Purchase CTA */}
      <div className="text-center">
        <button
          onClick={handlePurchaseReport}
          disabled={isLoading}
          className={`${
            isLoading 
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-105'
          } text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform`}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Processing...
            </span>
          ) : (
            '🚀 Get Full Report with Fixes - $12'
          )}
        </button>
        <p className="text-sm text-gray-500 mt-2">
          Instant access • Copy-paste DNS records • Professional PDF report
        </p>
      </div>
    </div>
  );
}