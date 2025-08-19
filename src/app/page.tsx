'use client';

import { useState } from 'react';
import { DomainInput } from '@/components/DomainInput';
import { PreviewResults } from '@/components/PreviewResults';
import { DomainCheckResult } from '@/types';

export default function Home() {
  const [checkResult, setCheckResult] = useState<DomainCheckResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDomainCheck = async (domain: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/check-preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain, isPreview: true }),
      });

      if (!response.ok) {
        throw new Error('Failed to check domain');
      }

      const result = await response.json();
      setCheckResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🛡️ InboxShield Mini
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get an instant email deliverability health check for your domain. 
              Fix SPF, DKIM, DMARC, BIMI, and MTA-STS issues with copy-paste DNS records.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Instant Analysis
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Copy-Paste Fixes
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              $12 One-Time
            </span>
          </div>
        </div>

        {/* Domain Input */}
        <div className="max-w-2xl mx-auto mb-8">
          <DomainInput 
            onSubmit={handleDomainCheck} 
            isLoading={isLoading}
            error={error}
          />
        </div>

        {/* Results */}
        {checkResult && (
          <div className="max-w-4xl mx-auto">
            <PreviewResults result={checkResult} />
          </div>
        )}

        {/* Features Section */}
        <div className="max-w-6xl mx-auto mt-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-2xl mb-4">⚡</div>
              <h3 className="font-semibold mb-2">Instant Analysis</h3>
              <p className="text-gray-600 text-sm">
                Get results in seconds. No waiting, no complex setup required.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-2xl mb-4">📋</div>
              <h3 className="font-semibold mb-2">Copy-Paste Fixes</h3>
              <p className="text-gray-600 text-sm">
                Exact DNS records you can copy and paste directly into your DNS provider.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-2xl mb-4">📊</div>
              <h3 className="font-semibold mb-2">Professional Report</h3>
              <p className="text-gray-600 text-sm">
                Branded PDF report with shareble link for your team or IT consultant.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-gray-500">
          <p>Built for small businesses who care about email deliverability</p>
        </footer>
      </div>
    </div>
  );
}
