'use client';

import { useState, useRef } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { DomainInput } from '@/components/DomainInput';
import { PreviewResults } from '@/components/PreviewResults';
import { ProviderLogos } from '@/components/ProviderLogos';
import { DomainCheckResult } from '@/types';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

// Client-side cache for domain results
const domainCache = new Map<string, { result: DomainCheckResult; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export default function Home() {
  const [checkResult, setCheckResult] = useState<DomainCheckResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const heroRef = useScrollAnimation({ triggerOnce: true });
  const painPointsRef = useScrollAnimation({ triggerOnce: true });
  const solutionRef = useScrollAnimation({ triggerOnce: true });
  const socialProofRef = useScrollAnimation({ triggerOnce: true });
  const featuresRef = useScrollAnimation({ triggerOnce: true });
  const painPointsSectionRef = useScrollAnimation({ triggerOnce: true });
  const howItWorksRef = useScrollAnimation({ triggerOnce: true });
  const pricingRef = useScrollAnimation({ triggerOnce: true });

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
          <div className="text-center mb-16" ref={heroRef as React.RefObject<HTMLDivElement>}>
            {/* Hero Badge */}
            <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-8 fade-in-up">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-blue-300 text-sm font-medium">Live Email Security Scanner</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 fade-in-up">
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                Are Your Emails Landing in
              </span>
              <br />
              <span className="bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                Spam Folders?
              </span>
            </h1>

            {/* Pain Points */}
            <div
              className="bg-red-900/20 border border-red-500/30 rounded-2xl p-6 max-w-4xl mx-auto mb-8 fade-in-up"
              ref={painPointsRef as React.RefObject<HTMLDivElement>}
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-2xl">⚠️</span>
                <h3 className="text-xl font-bold text-red-300">Are You Losing Business Due to Email Issues?</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4 text-red-200">
                <div className="flex items-center gap-2">
                  <span className="text-red-400">✗</span>
                  <span>Critical emails being marked as spam</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-400">✗</span>
                  <span>Customers missing your invoices and important updates</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-400">✗</span>
                  <span>Marketing campaigns being blocked by email providers</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-400">✗</span>
                  <span>Losing revenue because of poor email deliverability</span>
                </div>
              </div>
            </div>

            {/* Solution */}
            <div
              className="bg-gradient-to-r from-green-900/20 via-blue-900/20 to-purple-900/20 border border-green-500/30 rounded-2xl p-6 max-w-4xl mx-auto mb-8 fade-in-up"
              ref={solutionRef as React.RefObject<HTMLDivElement>}
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-2xl">🛡️</span>
                <h3 className="text-xl font-bold text-green-300">Resolve Your Email Authentication in Minutes</h3>
              </div>
              <div className="text-gray-300 text-center text-lg leading-relaxed space-y-3">
                <p>Receive an immediate analysis of your domain's email authentication:</p>
                <div className="flex flex-wrap justify-center gap-2 text-sm">
                  <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full border border-blue-500/30">SPF</span>
                  <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full border border-purple-500/30">DKIM</span>
                  <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full border border-green-500/30">DMARC</span>
                  <span className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full border border-yellow-500/30">BIMI</span>
                  <span className="bg-pink-500/20 text-pink-300 px-3 py-1 rounded-full border border-pink-500/30">MTA-STS</span>
                </div>
                <p><span className="text-blue-400 font-semibold">Get copy-paste DNS fixes</span> compatible with all major email providers.</p>
              </div>
              
              {/* Scrolling provider logos */}
              <div className="mt-6">
                <ProviderLogos />
              </div>
            </div>

            {/* Social Proof */}
            <div
              className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-400 mb-12 fade-in-up"
              ref={socialProofRef as React.RefObject<HTMLDivElement>}
            >
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
      <section id="features" className="py-20 bg-gray-800/50" ref={featuresRef as React.RefObject<HTMLElement>}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Why Choose <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">InboxShield Mini</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Get professional-grade email security analysis in minutes, not hours. Designed for small businesses that need immediate results.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 - Pain Point */}
            <div className="group relative fade-in-up">
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-red-500/50 transition-all duration-300 h-80 flex flex-col">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                  📧
                </div>
                <h3 className="text-xl font-bold text-white mb-4">The Issue</h3>
                <div className="text-gray-300 leading-relaxed space-y-2 flex-1">
                  <p className="text-red-300 font-semibold mb-3">Your emails are failing due to:</p>
                  <p className="text-sm">• No SPF record, leading to a high spam score</p>
                  <p className="text-sm">• Missing DKIM, causing deliverability problems</p>
                  <p className="text-sm">• No DMARC, leaving you open to phishing</p>
                  <p className="text-sm">• Weak authentication, resulting in lost revenue</p>
                </div>
              </div>
            </div>

            {/* Feature 2 - Solution */}
            <div className="group relative fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 h-80 flex flex-col">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                  ⚡
                </div>
                <h3 className="text-xl font-bold text-white mb-4">The Fix</h3>
                <div className="text-gray-300 leading-relaxed space-y-2 flex-1">
                  <p className="text-blue-300 font-semibold mb-3">We offer instant solutions:</p>
                  <p className="text-sm">• A complete analysis in just 10 seconds</p>
                  <p className="text-sm">• Simple copy-paste DNS records</p>
                  <p className="text-sm">• Compatibility with all email providers</p>
                  <p className="text-sm">• Detailed PDF reports</p>
                </div>
              </div>
            </div>

            {/* Feature 3 - Result */}
            <div className="group relative fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-green-500/50 transition-all duration-300 h-80 flex flex-col">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                  📈
                </div>
                <h3 className="text-xl font-bold text-white mb-4">The Outcome</h3>
                <div className="text-gray-300 leading-relaxed space-y-2 flex-1">
                  <p className="text-green-300 font-semibold mb-3">You will achieve:</p>
                  <p className="text-sm">• A 95%+ inbox delivery rate</p>
                  <p className="text-sm">• No more emails in spam folders</p>
                  <p className="text-sm">• Improved brand credibility</p>
                  <p className="text-sm">• A higher email ROI</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-20 bg-gray-950/50" ref={painPointsSectionRef as React.RefObject<HTMLElement>}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              <span className="text-red-400">Stop Letting Email Issues</span><br />
              <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">Harm Your Business</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-12">
              Every day your emails land in spam, you are losing money. Here is what poor email authentication is costing you:
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16">
            <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6 text-center h-48 flex flex-col justify-center fade-in-up">
              <div className="text-4xl mb-4">💸</div>
              <h3 className="text-lg font-bold text-red-300 mb-2">Lost Revenue</h3>
              <p className="text-sm text-red-200">Customers are not seeing your invoices, order confirmations, or promotional offers.</p>
            </div>
            <div className="bg-orange-900/20 border border-orange-500/30 rounded-xl p-6 text-center h-48 flex flex-col justify-center fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl mb-4">📉</div>
              <h3 className="text-lg font-bold text-orange-300 mb-2">Damaged Reputation</h3>
              <p className="text-sm text-orange-200">Poor deliverability makes your business appear unprofessional and untrustworthy.</p>
            </div>
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-6 text-center h-48 flex flex-col justify-center fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-lg font-bold text-yellow-300 mb-2">Phishing Vulnerability</h3>
              <p className="text-sm text-yellow-200">Without DMARC, scammers can exploit your domain, damaging your reputation.</p>
            </div>
            <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-6 text-center h-48 flex flex-col justify-center fade-in-up" style={{ animationDelay: '0.6s' }}>
              <div className="text-4xl mb-4">⏰</div>
              <h3 className="text-lg font-bold text-purple-300 mb-2">Wasted Hours</h3>
              <p className="text-sm text-purple-200">Time spent dealing with email problems is time not spent growing your business.</p>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 border border-green-500/40 rounded-2xl p-8 max-w-3xl mx-auto fade-in-up">
              <h3 className="text-2xl font-bold text-white mb-4">
                <span className="text-green-400">✓</span> Resolve All These Issues in Under 10 Minutes
              </h3>
              <p className="text-gray-300 text-lg mb-6">
                Do not let another day pass with flawed email authentication.
                Get your professional analysis and copy-paste DNS fixes now.
              </p>
              <div className="text-3xl font-bold text-green-400 mb-2">Only $11.99</div>
              <div className="text-sm text-gray-400">One-time payment • Instant results • Professional analysis</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20" ref={howItWorksRef as React.RefObject<HTMLElement>}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              How <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">InboxShield</span> Functions
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Prevent your business emails from being marked as spam in three easy steps:
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
                <div className="relative fade-in-up">
                  <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 flex flex-col h-full">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-6 relative z-10 shadow-lg shadow-blue-500/25">
                      1
                    </div>
                    <div className="text-center flex flex-col flex-1">
                      <h3 className="text-2xl font-bold text-white mb-4">🔍 Analyze Your Domain</h3>
                      <p className="text-gray-300 leading-relaxed mb-6 flex-1 min-h-[4.5rem]">
                        Enter your business domain (e.g., yourcompany.com), and we will instantly scan your email security configurations.
                      </p>
                      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mt-auto">
                        <p className="text-blue-300 text-sm font-medium">
                          ⚡ Get results in 10 seconds
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative fade-in-up" style={{ animationDelay: '0.2s' }}>
                  <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-300 flex flex-col h-full">
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-6 relative z-10 shadow-lg shadow-purple-500/25">
                      2
                    </div>
                    <div className="text-center flex flex-col flex-1">
                      <h3 className="text-2xl font-bold text-white mb-4">💳 Implement the Fixes</h3>
                      <p className="text-gray-300 leading-relaxed mb-6 flex-1 min-h-[4.5rem]">
                        For a one-time payment of $11.99, you will receive the exact DNS records to copy and paste, along with detailed instructions for your provider.
                      </p>
                      <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4 mt-auto">
                        <p className="text-purple-300 text-sm font-medium">
                          💾 Ready-to-use fixes
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative fade-in-up" style={{ animationDelay: '0.4s' }}>
                  <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-green-500/50 transition-all duration-300 flex flex-col h-full">
                    <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-6 relative z-10 shadow-lg shadow-green-500/25">
                      3
                    </div>
                    <div className="text-center flex flex-col flex-1">
                      <h3 className="text-2xl font-bold text-white mb-4">📈 Enjoy the Results</h3>
                      <p className="text-gray-300 leading-relaxed mb-6 flex-1 min-h-[4.5rem]">
                        Paste the DNS records into your domain settings and see your emails reach inboxes instead of spam folders.
                      </p>
                      <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 mt-auto">
                        <p className="text-green-300 text-sm font-medium">
                          ✅ Achieve a 95%+ inbox delivery rate
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* What You Get */}
            <div className="mt-16 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl p-8 fade-in-up">
              <h3 className="text-2xl font-bold text-white text-center mb-8">What You Get For $11.99</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-green-400 text-xl">✓</span>
                    <span className="text-gray-300">A complete email security analysis (SPF, DKIM, DMARC, BIMI, MTA-STS)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-green-400 text-xl">✓</span>
                    <span className="text-gray-300">Precise DNS records formatted for easy copy-pasting</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-green-400 text-xl">✓</span>
                    <span className="text-gray-300">A professional PDF report to share with your team</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-green-400 text-xl">✓</span>
                    <span className="text-gray-300">Step-by-step setup guides for GoDaddy, Cloudflare, and Namecheap</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-green-400 text-xl">✓</span>
                    <span className="text-gray-300">Clear explanations of each issue and its business impact</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-green-400 text-xl">✓</span>
                    <span className="text-gray-300">Verification steps to ensure your fixes are effective</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-800/50" ref={pricingRef as React.RefObject<HTMLElement>}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Straightforward <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Pricing</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              A single payment. No subscriptions. No hidden fees. Just tangible results.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="relative group fade-in-up">
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
                    <span className="text-gray-300">A complete email authentication analysis</span>
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">Copy-paste DNS fixes for all identified issues</span>
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">A professional-grade PDF report</span>
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">Shareable links to your report</span>
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">Instructions specific to your provider</span>
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
