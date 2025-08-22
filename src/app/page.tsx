'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { DomainInput } from '@/components/DomainInput';
import { PreviewResults } from '@/components/PreviewResults';
import { ProviderLogos } from '@/components/ProviderLogos';
import { DomainCheckResult } from '@/types';

// Client-side cache for domain results
const domainCache = new Map<string, { result: DomainCheckResult; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export default function Home() {
  const [checkResult, setCheckResult] = useState<DomainCheckResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDomainCheck = async (domain: string) => {
    const normalizedDomain = domain.toLowerCase().trim();
    
    // Check client-side cache first
    const cached = domainCache.get(normalizedDomain);
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      setCheckResult(cached.result);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/.netlify/functions/check-preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain: normalizedDomain, isPreview: true }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const result = await response.json();
      
      // Cache the result
      domainCache.set(normalizedDomain, { result, timestamp: Date.now() });
      
      // Clean old cache entries occasionally
      if (Math.random() < 0.1) {
        const now = Date.now();
        for (const [key, value] of domainCache.entries()) {
          if (now - value.timestamp > CACHE_DURATION) {
            domainCache.delete(key);
          }
        }
      }
      
      setCheckResult(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while analyzing your domain';
      setError(errorMessage);
      console.error('Domain check error:', err);
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
                Stop Your Emails Going to
              </span>
              <br />
              <span className="bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                SPAM & JUNK
              </span>
            </h1>

            {/* Pain Points */}
            <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-6 max-w-4xl mx-auto mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-2xl">⚠️</span>
                <h3 className="text-xl font-bold text-red-300">Is This Happening to Your Business?</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4 text-red-200">
                <div className="flex items-center gap-2">
                  <span className="text-red-400">✗</span>
                  <span>Important emails ending up in spam folders</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-400">✗</span>
                  <span>Customers not receiving your invoices or updates</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-400">✗</span>
                  <span>Marketing emails blocked by major providers</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-400">✗</span>
                  <span>Lost sales due to poor email deliverability</span>
                </div>
              </div>
            </div>

            {/* Solution */}
            <div className="bg-gradient-to-r from-green-900/20 via-blue-900/20 to-purple-900/20 border border-green-500/30 rounded-2xl p-6 max-w-4xl mx-auto mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-2xl">🛡️</span>
                <h3 className="text-xl font-bold text-green-300">Fix Your Email Authentication in Minutes</h3>
              </div>
              <div className="text-gray-300 text-center text-lg leading-relaxed space-y-3">
                <p>Get instant analysis of your domain's email authentication:</p>
                <div className="flex flex-wrap justify-center gap-2 text-sm">
                  <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full border border-blue-500/30">SPF</span>
                  <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full border border-purple-500/30">DKIM</span>
                  <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full border border-green-500/30">DMARC</span>
                  <span className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full border border-yellow-500/30">BIMI</span>
                  <span className="bg-pink-500/20 text-pink-300 px-3 py-1 rounded-full border border-pink-500/30">MTA-STS</span>
                </div>
                <p><span className="text-blue-400 font-semibold">Copy-paste DNS fixes</span> that work with all major email providers.</p>
              </div>
              
              {/* Scrolling provider logos */}
              <div className="mt-6">
                <ProviderLogos />
              </div>
            </div>

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

          {/* Unified Security Analysis Box */}
          <div id="scan" className="scroll-mt-20">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-gray-700/50 shadow-2xl overflow-hidden">
                <div className="p-8">
                  <DomainInput 
                    onSubmit={handleDomainCheck} 
                    isLoading={isLoading}
                    error={error}
                  />
                  
                  {/* Results appear in same box with smooth transition */}
                  {checkResult && (
                    <div className="mt-8 pt-8 border-t border-gray-600/30 animate-in slide-in-from-bottom-4 fade-in duration-700">
                      <PreviewResults result={checkResult} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
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
            {/* Feature 1 - Pain Point */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-red-500/50 transition-all duration-300 h-80 flex flex-col">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                  📧
                </div>
                <h3 className="text-xl font-bold text-white mb-4">The Problem</h3>
                <div className="text-gray-300 leading-relaxed space-y-2 flex-1">
                  <p className="text-red-300 font-semibold mb-3">Your emails are failing because:</p>
                  <p className="text-sm">• No SPF record = high spam score</p>
                  <p className="text-sm">• Missing DKIM = deliverability issues</p>
                  <p className="text-sm">• No DMARC = phishing vulnerability</p>
                  <p className="text-sm">• Poor authentication = lost revenue</p>
                </div>
              </div>
            </div>

            {/* Feature 2 - Solution */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 h-80 flex flex-col">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                  ⚡
                </div>
                <h3 className="text-xl font-bold text-white mb-4">The Solution</h3>
                <div className="text-gray-300 leading-relaxed space-y-2 flex-1">
                  <p className="text-blue-300 font-semibold mb-3">We provide instant fixes:</p>
                  <p className="text-sm">• 10-second complete analysis</p>
                  <p className="text-sm">• Copy-paste DNS records</p>
                  <p className="text-sm">• Works with all providers</p>
                  <p className="text-sm">• Professional PDF reports</p>
                </div>
              </div>
            </div>

            {/* Feature 3 - Result */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-green-500/50 transition-all duration-300 h-80 flex flex-col">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                  📈
                </div>
                <h3 className="text-xl font-bold text-white mb-4">The Results</h3>
                <div className="text-gray-300 leading-relaxed space-y-2 flex-1">
                  <p className="text-green-300 font-semibold mb-3">What you'll achieve:</p>
                  <p className="text-sm">• 95%+ inbox delivery rate</p>
                  <p className="text-sm">• Zero emails in spam folders</p>
                  <p className="text-sm">• Enhanced brand credibility</p>
                  <p className="text-sm">• Increased email ROI</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-20 bg-gray-950/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              <span className="text-red-400">Don't Let Email Issues</span><br />
              <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">Kill Your Business</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-12">
              Every day your emails go to spam, you're losing money. Here's what poor email authentication costs you:
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16">
            <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6 text-center h-48 flex flex-col justify-center">
              <div className="text-4xl mb-4">💸</div>
              <h3 className="text-lg font-bold text-red-300 mb-2">Lost Sales</h3>
              <p className="text-sm text-red-200">Customers never see your invoices, order confirmations, or promotional emails</p>
            </div>
            <div className="bg-orange-900/20 border border-orange-500/30 rounded-xl p-6 text-center h-48 flex flex-col justify-center">
              <div className="text-4xl mb-4">📉</div>
              <h3 className="text-lg font-bold text-orange-300 mb-2">Brand Damage</h3>
              <p className="text-sm text-orange-200">Poor deliverability makes you look unprofessional and unreliable</p>
            </div>
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-6 text-center h-48 flex flex-col justify-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-lg font-bold text-yellow-300 mb-2">Phishing Risk</h3>
              <p className="text-sm text-yellow-200">Without DMARC, scammers can impersonate your domain and hurt your reputation</p>
            </div>
            <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-6 text-center h-48 flex flex-col justify-center">
              <div className="text-4xl mb-4">⏰</div>
              <h3 className="text-lg font-bold text-purple-300 mb-2">Wasted Time</h3>
              <p className="text-sm text-purple-200">Hours spent troubleshooting email issues instead of growing your business</p>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 border border-green-500/40 rounded-2xl p-8 max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">
                <span className="text-green-400">✓</span> Fix All These Issues in Under 10 Minutes
              </h3>
              <p className="text-gray-300 text-lg mb-6">
                Don't let another day go by with broken email authentication. 
                Get your professional analysis and copy-paste DNS fixes right now.
              </p>
              <div className="text-3xl font-bold text-green-400 mb-2">Only $11.99</div>
              <div className="text-sm text-gray-400">One-time payment • Instant results • Professional analysis</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              How <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">InboxShield</span> Works
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Stop your business emails from going to spam in three simple steps
            </p>
            <div className="inline-flex items-center space-x-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-green-300 text-sm font-medium">Takes less than 5 minutes</span>
            </div>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-12 left-12 right-12 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 hidden md:block rounded-full opacity-30"></div>
              
              <div className="grid md:grid-cols-3 gap-8">
                {/* Step 1 */}
                <div className="relative">
                  <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 h-full">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-6 relative z-10 shadow-lg shadow-blue-500/25">
                      1
                    </div>
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-white mb-4">🔍 Check Your Domain</h3>
                      <p className="text-gray-300 leading-relaxed mb-6">
                        Enter your business domain (like yourcompany.com) and we'll instantly scan your email security settings.
                      </p>
                      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                        <p className="text-blue-300 text-sm font-medium">
                          ⚡ Results in 10 seconds
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative">
                  <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-300 h-full">
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-6 relative z-10 shadow-lg shadow-purple-500/25">
                      2
                    </div>
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-white mb-4">💳 Get Your Fixes</h3>
                      <p className="text-gray-300 leading-relaxed mb-6">
                        Pay $11.99 once and receive exact DNS records to copy-paste, plus step-by-step instructions for your provider.
                      </p>
                      <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                        <p className="text-purple-300 text-sm font-medium">
                          💾 Copy-paste ready fixes
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative">
                  <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-green-500/50 transition-all duration-300 h-full">
                    <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-6 relative z-10 shadow-lg shadow-green-500/25">
                      3
                    </div>
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-white mb-4">📈 See Results</h3>
                      <p className="text-gray-300 leading-relaxed mb-6">
                        Paste the DNS records into your domain settings and watch your emails start reaching inboxes instead of spam.
                      </p>
                      <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                        <p className="text-green-300 text-sm font-medium">
                          ✅ 95%+ inbox delivery rate
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* What You Get */}
            <div className="mt-16 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white text-center mb-8">What You Get For $11.99</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-green-400 text-xl">✓</span>
                    <span className="text-gray-300">Complete email security analysis (SPF, DKIM, DMARC, BIMI, MTA-STS)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-green-400 text-xl">✓</span>
                    <span className="text-gray-300">Exact DNS records formatted for copy-paste</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-green-400 text-xl">✓</span>
                    <span className="text-gray-300">Professional PDF report you can share with your team</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-green-400 text-xl">✓</span>
                    <span className="text-gray-300">Step-by-step setup guides for GoDaddy, Cloudflare, Namecheap</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-green-400 text-xl">✓</span>
                    <span className="text-gray-300">Priority explanations of each issue and business impact</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-green-400 text-xl">✓</span>
                    <span className="text-gray-300">Verification steps to confirm your fixes are working</span>
                  </div>
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
                    $11.99
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
