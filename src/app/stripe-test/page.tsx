'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

// Test card numbers from Stripe documentation
const TEST_CARDS = [
  {
    number: '4242424242424242',
    name: 'Visa - Success',
    description: 'This card will complete payment successfully',
    cvc: '123',
    expiry: '12/34',
    color: 'green'
  },
  {
    number: '4000000000000002',
    name: 'Visa - Declined',
    description: 'This card will be declined',
    cvc: '123', 
    expiry: '12/34',
    color: 'red'
  },
  {
    number: '4000000000009995',
    name: 'Visa - Insufficient Funds',
    description: 'This card will be declined for insufficient funds',
    cvc: '123',
    expiry: '12/34', 
    color: 'yellow'
  },
  {
    number: '4000000000000069',
    name: 'Visa - Expired Card',
    description: 'This card will be declined as expired',
    cvc: '123',
    expiry: '12/34',
    color: 'orange'
  }
];

export default function StripeTestPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState(TEST_CARDS[0]);
  
  const handleTestCheckout = async () => {
    setIsLoading(true);
    
    try {
      // Create checkout session with test domain
      const response = await fetch('/.netlify/functions/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain: 'example.com' }),
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
        alert('Error: ' + error.message);
      }
    } catch (error) {
      console.error('Error initiating test payment:', error);
      alert('Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-4 py-2 mb-8">
              <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
              <span className="text-yellow-300 text-sm font-medium">Stripe Testing Environment</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Stripe Payment Testing
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Test the payment flow with Stripe test cards. This page demonstrates how the checkout process works
              and lets you see what happens after a successful (or failed) payment.
            </p>
            
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6 text-left max-w-2xl mx-auto">
              <h3 className="text-blue-400 font-bold mb-3 flex items-center gap-2">
                <span>ℹ️</span>
                How This Test Works
              </h3>
              <ul className="text-sm text-blue-200 space-y-2">
                <li>• Click "Test Stripe Checkout" to initiate a test payment for example.com</li>
                <li>• You'll be redirected to Stripe's secure checkout page</li>
                <li>• Use one of the test card numbers below (never use real cards!)</li>
                <li>• Complete the payment to see the success page and report generation</li>
                <li>• All payments are in test mode - no real money will be charged</li>
              </ul>
            </div>
          </div>

          {/* Test Card Information */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Stripe Test Cards</h3>
              <div className="space-y-4">
                {TEST_CARDS.map((card, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                      selectedCard.number === card.number 
                        ? 'border-blue-500/50 bg-blue-900/20' 
                        : 'border-gray-700/50 bg-gray-800/30 hover:bg-gray-800/50'
                    }`}
                    onClick={() => setSelectedCard(card)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-3 h-3 rounded-full mt-1 ${
                        card.color === 'green' ? 'bg-green-400' :
                        card.color === 'red' ? 'bg-red-400' :
                        card.color === 'yellow' ? 'bg-yellow-400' :
                        'bg-orange-400'
                      }`}></div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-white font-bold">{card.number}</span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            card.color === 'green' ? 'bg-green-900/30 text-green-300' :
                            card.color === 'red' ? 'bg-red-900/30 text-red-300' :
                            card.color === 'yellow' ? 'bg-yellow-900/30 text-yellow-300' :
                            'bg-orange-900/30 text-orange-300'
                          }`}>
                            {card.name}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400">{card.description}</p>
                        <div className="text-xs text-gray-500 mt-2">
                          Expiry: {card.expiry} • CVC: {card.cvc}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white mb-6">What to Expect</h3>
              <div className="space-y-4">
                <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">✅</span>
                    <h4 className="text-green-400 font-bold">Successful Payment</h4>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Using the first test card (4242...) will complete the payment successfully. 
                    You'll be redirected to the report page where you can see:
                  </p>
                  <ul className="text-sm text-gray-400 mt-3 space-y-1 pl-4">
                    <li>• Payment confirmation message</li>
                    <li>• Complete email security report</li>
                    <li>• PDF download option</li>
                    <li>• Share link functionality</li>
                  </ul>
                </div>

                <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">❌</span>
                    <h4 className="text-red-400 font-bold">Failed Payment</h4>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Other test cards will simulate various failure scenarios. 
                    Stripe will show appropriate error messages and you'll return to the main site.
                  </p>
                </div>

                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">🔒</span>
                    <h4 className="text-yellow-400 font-bold">Security Note</h4>
                  </div>
                  <p className="text-yellow-200 text-sm">
                    This is a test environment. No real payments will be processed and no real 
                    credit card information should ever be entered.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Test Button */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-white mb-4">
                Ready to Test the Payment Flow?
              </h3>
              <p className="text-gray-300 mb-6">
                This will create a test checkout session for "example.com" with a price of $11.99. 
                Use the test cards above to see different payment outcomes.
              </p>
              
              <button
                onClick={handleTestCheckout}
                disabled={isLoading}
                className={`${
                  isLoading 
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 hover:scale-105'
                } text-white font-bold py-4 px-12 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 transform`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                    <span>Creating Checkout Session...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span className="text-lg">Test Stripe Checkout</span>
                  </div>
                )}
              </button>
              
              <div className="mt-4 text-sm text-gray-400">
                💡 <strong className="text-white">Test Mode</strong> • <strong className="text-blue-400">No real charges</strong> • <strong className="text-green-400">Safe to use</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}