'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function SetupPage() {
  const [config, setConfig] = useState({
    stripePublicKey: '',
    stripeConfigured: false,
    appUrl: '',
  });

  useEffect(() => {
    // Check configuration
    const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || '';
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || '';
    
    setConfig({
      stripePublicKey,
      stripeConfigured: stripePublicKey && !stripePublicKey.includes('REPLACE'),
      appUrl,
    });
  }, []);

  const testStripeConnection = async () => {
    try {
      const response = await fetch('/.netlify/functions/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain: 'test.com' }),
      });

      if (response.ok) {
        alert('✅ Stripe connection successful!');
      } else {
        const error = await response.text();
        alert(`❌ Stripe connection failed: ${error}`);
      }
    } catch (error) {
      alert(`❌ Connection error: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Setup & Configuration
              </span>
            </h1>
            <p className="text-xl text-gray-300">
              Configure your InboxShield Mini for payments and functionality
            </p>
          </div>

          {/* Configuration Status */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className={`p-6 rounded-xl border ${
              config.stripeConfigured 
                ? 'bg-green-900/20 border-green-500/30' 
                : 'bg-red-900/20 border-red-500/30'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">
                  {config.stripeConfigured ? '✅' : '❌'}
                </span>
                <h3 className={`text-xl font-bold ${
                  config.stripeConfigured ? 'text-green-300' : 'text-red-300'
                }`}>
                  Stripe Configuration
                </h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className={config.stripeConfigured ? 'text-green-200' : 'text-red-200'}>
                  <strong>Public Key:</strong> {
                    config.stripeConfigured 
                      ? `${config.stripePublicKey.substring(0, 20)}...` 
                      : 'Not configured'
                  }
                </div>
                <div className={config.stripeConfigured ? 'text-green-200' : 'text-red-200'}>
                  <strong>Status:</strong> {
                    config.stripeConfigured 
                      ? 'Ready for payments' 
                      : 'Needs configuration'
                  }
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl border bg-gray-800/30 border-gray-700/50">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">🔗</span>
                <h3 className="text-xl font-bold text-blue-300">
                  App Configuration
                </h3>
              </div>
              <div className="space-y-2 text-sm text-gray-300">
                <div><strong>App URL:</strong> {config.appUrl || 'Not set'}</div>
                <div><strong>Report Price:</strong> $11.99</div>
              </div>
            </div>
          </div>

          {/* Setup Instructions */}
          {!config.stripeConfigured && (
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-8 mb-8">
              <h3 className="text-xl font-bold text-yellow-300 mb-4 flex items-center gap-2">
                <span>⚠️</span>
                Stripe Setup Required
              </h3>
              
              <div className="space-y-6 text-yellow-200">
                <div>
                  <h4 className="font-semibold mb-2">Step 1: Get your Stripe Test Keys</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm pl-4">
                    <li>Go to <a href="https://dashboard.stripe.com/test/apikeys" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Stripe Dashboard → API Keys</a></li>
                    <li>Copy your <strong>Publishable key</strong> (starts with pk_test_)</li>
                    <li>Copy your <strong>Secret key</strong> (starts with sk_test_)</li>
                    <li>Go to <a href="https://dashboard.stripe.com/test/webhooks" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Webhooks</a> and create a webhook to get the signing secret</li>
                  </ol>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Step 2: Update your .env.local file</h4>
                  <div className="bg-gray-800/50 rounded p-4 font-mono text-xs">
                    <div className="text-gray-400"># Replace these values with your actual Stripe test keys</div>
                    <div>NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_your_publishable_key_here</div>
                    <div>STRIPE_SECRET_KEY=sk_test_your_secret_key_here</div>
                    <div>STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Step 3: Restart your development server</h4>
                  <div className="bg-gray-800/50 rounded p-4 font-mono text-xs">
                    <div>npm run dev</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Test Connection */}
          {config.stripeConfigured && (
            <div className="text-center">
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8">
                <h3 className="text-xl font-bold text-white mb-4">
                  Test Your Configuration
                </h3>
                <p className="text-gray-300 mb-6">
                  Click below to test if your Stripe integration is working correctly
                </p>
                
                <button
                  onClick={testStripeConnection}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Test Stripe Connection
                </button>
              </div>
            </div>
          )}

          {/* Additional Resources */}
          <div className="mt-12 grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span>📚</span>
                Helpful Resources
              </h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="https://stripe.com/docs/keys" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">
                    Stripe API Keys Documentation
                  </a>
                </li>
                <li>
                  <a href="https://stripe.com/docs/webhooks" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">
                    Webhooks Setup Guide
                  </a>
                </li>
                <li>
                  <a href="https://stripe.com/docs/testing" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">
                    Testing with Stripe
                  </a>
                </li>
                <li>
                  <a href="/stripe-test" className="text-blue-400 hover:text-blue-300 underline">
                    Payment Testing Page
                  </a>
                </li>
              </ul>
            </div>

            <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span>🔧</span>
                Troubleshooting
              </h3>
              <div className="space-y-3 text-sm text-gray-300">
                <div>
                  <strong className="text-white">Payment button not working?</strong>
                  <p>Check browser console for detailed error messages</p>
                </div>
                <div>
                  <strong className="text-white">Environment variables not loading?</strong>
                  <p>Make sure to restart your development server after changing .env.local</p>
                </div>
                <div>
                  <strong className="text-white">Webhook errors?</strong>
                  <p>Webhooks are only needed for production, not for testing</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}