'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
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

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-gray-900 to-purple-900/20"></div>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            {/* Hero Badge */}
            <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-8">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-blue-300 text-sm font-medium">Live Email Security Scanner</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                Stop Email
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Delivery Issues
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-4 leading-relaxed">
              Get instant analysis of your domain&apos;s email authentication. Fix SPF, DKIM, DMARC, BIMI, and MTA-STS issues with 
              <span className="text-blue-400 font-semibold"> copy-paste DNS records</span>.
            </p>

            {/* Social Proof */}
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-400 mb-12">
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-2 border-gray-900"></div>
                  <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-full border-2 border-gray-900"></div>
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full border-2 border-gray-900"></div>
                </div>
                <span>2,500+ domains analyzed</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-yellow-400">★★★★★</span>
                <span>4.9/5 rating</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Instant results</span>
              </div>
            </div>
          </div>

          {/* Domain Input Section */}
          <DomainInput 
            onSubmit={handleDomainCheck} 
            isLoading={isLoading}
            error={error}
          />

          {/* Results */}
          {checkResult && (
            <div className="mt-16 max-w-6xl mx-auto">
              <PreviewResults result={checkResult} />
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Why Choose <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">InboxShield Mini</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Professional email security analysis that takes minutes, not hours. Built specifically for small businesses who need results fast.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                  ⚡
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Instant Analysis</h3>
                <p className="text-gray-300 leading-relaxed">
                  Get comprehensive results in under 10 seconds. No waiting, no complex setup, no technical expertise required.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-green-500/50 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                  📋
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Copy-Paste Fixes</h3>
                <p className="text-gray-300 leading-relaxed">
                  Get exact DNS records ready to copy and paste. Works with all major DNS providers including Cloudflare, GoDaddy, and Namecheap.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                  📊
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Professional Reports</h3>
                <p className="text-gray-300 leading-relaxed">
                  Branded PDF reports with shareable links. Perfect for teams, IT consultants, or keeping records for compliance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              How It <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Three simple steps to better email deliverability
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-8 left-8 right-8 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 hidden md:block"></div>
              
              <div className="grid md:grid-cols-3 gap-8">
                {/* Step 1 */}
                <div className="relative text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-6 relative z-10">
                    1
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Enter Domain</h3>
                  <p className="text-gray-300">
                    Simply enter your domain name and click scan. Our system instantly analyzes all email authentication records.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="relative text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-6 relative z-10">
                    2
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Get Report</h3>
                  <p className="text-gray-300">
                    Receive a comprehensive analysis with exact DNS records, explanations, and step-by-step fixing instructions.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="relative text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-6 relative z-10">
                    3
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Copy & Paste</h3>
                  <p className="text-gray-300">
                    Copy the provided DNS records and paste them into your DNS provider. Watch your email deliverability improve!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Simple <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Pricing</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              One-time payment. No subscriptions. No hidden fees. Just results.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur opacity-30 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative bg-gray-800/90 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8 text-center">
                <div className="mb-6">
                  <div className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                    $12
                  </div>
                  <p className="text-gray-300 text-lg">One-time payment</p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-center space-x-3">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">Complete email authentication analysis</span>
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">Copy-paste DNS fixes for all issues</span>
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">Professional PDF report</span>
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">Shareable report links</span>
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">Provider-specific instructions</span>
                  </div>
                </div>

                <button 
                  onClick={() => scrollToSection('scan')}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40"
                >
                  Start Your Scan Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
