'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { detectDNSProvider, getProviderInstructions, DNSProvider } from '@/lib/dns-utils';

function SetupContent() {
  const [activeTab, setActiveTab] = useState('overview');
  const [detectedProvider, setDetectedProvider] = useState<DNSProvider | null>(null);
  const [providerInstructions, setProviderInstructions] = useState<any>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [domain, setDomain] = useState<string>('');

  const searchParams = useSearchParams();

  useEffect(() => {
    // Try to get domain from URL params or localStorage
    const urlDomain = searchParams?.get('domain');
    const storedDomain = typeof window !== 'undefined' ? localStorage.getItem('lastAnalyzedDomain') : null;
    const targetDomain = urlDomain || storedDomain;

    if (targetDomain) {
      setDomain(targetDomain);
      detectProvider(targetDomain);
    }
  }, [searchParams]);

  const detectProvider = async (domainName: string) => {
    setIsDetecting(true);
    try {
      const provider = await detectDNSProvider(domainName);
      setDetectedProvider(provider);
      
      const instructions = getProviderInstructions(provider.code);
      setProviderInstructions(instructions);
      
      console.log(`Detected DNS provider: ${provider.name} (confidence: ${provider.confidence})`);
    } catch (error) {
      console.error('Failed to detect DNS provider:', error);
      
      // Fallback to generic provider
      const genericProvider = {
        name: 'Generic DNS Provider',
        code: 'generic',
        logo: '⚙️',
        confidence: 0
      };
      setDetectedProvider(genericProvider);
      setProviderInstructions(getProviderInstructions('generic'));
    } finally {
      setIsDetecting(false);
    }
  };

  const handleManualDomainSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const inputDomain = formData.get('domain') as string;
    
    if (inputDomain && inputDomain.trim()) {
      setDomain(inputDomain.trim());
      detectProvider(inputDomain.trim());
    }
  };

  const providers = [
    {
      name: 'GoDaddy',
      logo: '🟢',
      steps: [
        'Log in to your GoDaddy account and go to DNS Management',
        'Click "Add" to create a new DNS record',
        'Select "TXT" as the record type',
        'For SPF: Leave Host blank, paste your SPF record in the TXT Value field',
        'For DKIM: Enter your DKIM selector as Host, paste DKIM record as Value',
        'For DMARC: Enter "_dmarc" as Host, paste DMARC policy as Value',
        'Save changes (may take up to 24 hours to propagate)'
      ]
    },
    {
      name: 'Cloudflare',
      logo: '🟠',
      steps: [
        'Log in to Cloudflare and select your domain',
        'Go to DNS > Records section',
        'Click "Add record" button',
        'Choose "TXT" as the record type',
        'For SPF: Enter "@" as Name, paste SPF record as Content',
        'For DKIM: Enter your selector (e.g., "selector1._domainkey") as Name',
        'For DMARC: Enter "_dmarc" as Name, paste policy as Content',
        'Click Save (changes are usually instant)'
      ]
    },
    {
      name: 'Namecheap',
      logo: '🔴',
      steps: [
        'Login to Namecheap and go to Domain List',
        'Click "Manage" next to your domain',
        'Go to "Advanced DNS" tab',
        'Click "Add New Record"',
        'Select "TXT Record" from dropdown',
        'For SPF: Leave Host as "@", paste record in Value',
        'For DKIM: Enter selector._domainkey as Host',
        'For DMARC: Enter "_dmarc" as Host',
        'Save all changes'
      ]
    },
    {
      name: 'Other Providers',
      logo: '⚙️',
      steps: [
        'Access your domain\'s DNS management panel',
        'Look for "DNS Records," "DNS Management," or "Zone File" section',
        'Find option to add new TXT records',
        'Create three separate TXT records for SPF, DKIM, and DMARC',
        'Copy exact records from your InboxShield Mini report',
        'Save changes and wait for DNS propagation (up to 24 hours)',
        'Use DNS checker tools to verify records are live'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                📧 Email Security Setup Guide
              </span>
            </h1>
            <p className="text-xl text-gray-300">
              Step-by-step instructions to implement your DNS fixes and secure your email delivery
            </p>
          </div>

          {/* Domain Input & Provider Detection */}
          {!domain && (
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold text-blue-300 mb-4 text-center">Enter Your Domain to Get Personalized Instructions</h3>
              <form onSubmit={handleManualDomainSubmit} className="flex gap-4 max-w-md mx-auto">
                <input
                  type="text"
                  name="domain"
                  placeholder="yourcompany.com"
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isDetecting}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-lg transition-all duration-300 disabled:opacity-50"
                >
                  {isDetecting ? 'Detecting...' : 'Analyze'}
                </button>
              </form>
            </div>
          )}

          {/* Provider Detection Result */}
          {detectedProvider && (
            <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-500/30 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{detectedProvider.logo}</span>
                  <div>
                    <h3 className="text-xl font-bold text-green-300">
                      DNS Provider Detected: {detectedProvider.name}
                    </h3>
                    <p className="text-green-200 text-sm">
                      {domain && `For domain: ${domain}`}
                      {detectedProvider.confidence > 0 && ` (Confidence: ${detectedProvider.confidence > 1 ? 'High' : 'Medium'})`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <button
                    onClick={() => {
                      setDomain('');
                      setDetectedProvider(null);
                      setProviderInstructions(null);
                    }}
                    className="text-green-400 hover:text-green-300 text-sm underline"
                  >
                    Change Domain
                  </button>
                </div>
              </div>
              
              {detectedProvider.confidence === 0 && (
                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mt-4">
                  <p className="text-yellow-300 text-sm">
                    ⚠️ Could not automatically detect your DNS provider. Showing generic instructions that work with most providers.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {[
              { id: 'overview', label: '📋 Overview', icon: '📋' },
              { id: 'spf', label: '🛡️ SPF Setup', icon: '🛡️' },
              { id: 'dmarc', label: '🔒 DMARC Setup', icon: '🔒' },
              { id: 'dkim', label: '🔑 DKIM Setup', icon: '🔑' },
              { id: 'verification', label: '✅ Verification', icon: '✅' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
            
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">🎯 Quick Start Overview</h2>
                
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6 text-center">
                    <div className="text-4xl mb-4">🛡️</div>
                    <h3 className="text-lg font-bold text-blue-300 mb-2">1. SPF Record</h3>
                    <p className="text-sm text-blue-200">Authorizes which servers can send email from your domain</p>
                  </div>
                  
                  <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-6 text-center">
                    <div className="text-4xl mb-4">🔒</div>
                    <h3 className="text-lg font-bold text-purple-300 mb-2">2. DMARC Policy</h3>
                    <p className="text-sm text-purple-200">Protects your domain from spoofing and phishing attacks</p>
                  </div>
                  
                  <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-6 text-center">
                    <div className="text-4xl mb-4">🔑</div>
                    <h3 className="text-lg font-bold text-green-300 mb-2">3. DKIM Signature</h3>
                    <p className="text-sm text-green-200">Ensures email content hasn't been tampered with</p>
                  </div>
                </div>

                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-6 mb-6">
                  <h3 className="text-xl font-bold text-yellow-300 mb-4">⚡ Before You Start</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-yellow-200">
                    <div>
                      <h4 className="font-semibold mb-2">✅ What You Need:</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Your InboxShield Mini report with DNS records</li>
                        <li>• Access to your domain's DNS management panel</li>
                        <li>• Administrator permissions for DNS changes</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">⏱️ Time Required:</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Setup: 15-30 minutes</li>
                        <li>• DNS propagation: 1-24 hours</li>
                        <li>• Verification: 5 minutes</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-700/30 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">🚀 Quick Setup Process</h3>
                  <div className="grid md:grid-cols-4 gap-4">
                    {[
                      { step: '1', title: 'Get Your Report', desc: 'Purchase and download your DNS fixes' },
                      { step: '2', title: 'Access DNS Panel', desc: 'Login to your domain provider' },
                      { step: '3', title: 'Add TXT Records', desc: 'Copy-paste the provided records' },
                      { step: '4', title: 'Verify Setup', desc: 'Test your email authentication' }
                    ].map((item) => (
                      <div key={item.step} className="text-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">
                          {item.step}
                        </div>
                        <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                        <p className="text-sm text-gray-300">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SPF Tab */}
            {activeTab === 'spf' && (
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">🛡️ SPF Record Setup</h2>
                
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6 mb-6">
                  <h3 className="text-xl font-bold text-blue-300 mb-4">What is SPF?</h3>
                  <p className="text-blue-200 mb-4">
                    SPF (Sender Policy Framework) is a DNS record that specifies which mail servers are authorized to send emails on behalf of your domain. It prevents spammers from forging your domain in email headers.
                  </p>
                  <div className="bg-blue-800/30 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-300 mb-2">SPF Record Format:</h4>
                    <code className="text-blue-100 text-sm">
                      "v=spf1 include:_spf.google.com include:sendgrid.net -all"
                    </code>
                  </div>
                </div>

                {providerInstructions && detectedProvider && (
                  <div className="bg-gray-700/30 rounded-xl p-6">
                    <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <span>{detectedProvider.logo}</span>
                      SPF Setup for {detectedProvider.name}
                    </h4>
                    
                    {providerInstructions.setupSteps && (
                      <div className="mb-6">
                        <h5 className="font-semibold text-blue-300 mb-3">Step 1: Access Your DNS Management</h5>
                        <ol className="space-y-2">
                          {providerInstructions.setupSteps.map((step: string, index: number) => (
                            <li key={index} className="flex gap-3">
                              <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                {index + 1}
                              </span>
                              <span className="text-gray-300">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                    
                    {providerInstructions.spfSteps && (
                      <div>
                        <h5 className="font-semibold text-blue-300 mb-3">Step 2: Add SPF Record</h5>
                        <ol className="space-y-2">
                          {providerInstructions.spfSteps.map((step: string, index: number) => (
                            <li key={index} className="flex gap-3">
                              <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                {index + 1}
                              </span>
                              <span className="text-gray-300">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {providerInstructions.notes && (
                      <div className="mt-6 bg-blue-900/20 border border-blue-500/20 rounded-lg p-4">
                        <h5 className="font-semibold text-blue-300 mb-2">💡 {detectedProvider.name} Notes:</h5>
                        <ul className="space-y-1">
                          {providerInstructions.notes.map((note: string, index: number) => (
                            <li key={index} className="text-blue-200 text-sm">• {note}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* DMARC Tab */}
            {activeTab === 'dmarc' && (
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">🔒 DMARC Policy Setup</h2>
                
                <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-6 mb-6">
                  <h3 className="text-xl font-bold text-purple-300 mb-4">What is DMARC?</h3>
                  <p className="text-purple-200 mb-4">
                    DMARC (Domain-based Message Authentication) builds on SPF and DKIM to provide instruction on how to handle emails that fail authentication checks. It protects your domain from being used in phishing attacks.
                  </p>
                  <div className="bg-purple-800/30 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-300 mb-2">DMARC Record Format:</h4>
                    <code className="text-purple-100 text-sm">
                      "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com"
                    </code>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                    <h4 className="font-bold text-red-300 mb-2">p=none</h4>
                    <p className="text-sm text-red-200">Monitor mode - no action taken on failed emails</p>
                  </div>
                  <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                    <h4 className="font-bold text-yellow-300 mb-2">p=quarantine</h4>
                    <p className="text-sm text-yellow-200">Failed emails go to spam/junk folder</p>
                  </div>
                  <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                    <h4 className="font-bold text-red-300 mb-2">p=reject</h4>
                    <p className="text-sm text-red-200">Failed emails are completely rejected</p>
                  </div>
                </div>

                {providerInstructions && detectedProvider && (
                  <div className="bg-gray-700/30 rounded-xl p-6">
                    <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <span>{detectedProvider.logo}</span>
                      DMARC Setup for {detectedProvider.name}
                    </h4>
                    
                    {providerInstructions.dmarcSteps && (
                      <div>
                        <h5 className="font-semibold text-purple-300 mb-3">DMARC Record Implementation</h5>
                        <ol className="space-y-2">
                          {providerInstructions.dmarcSteps.map((step: string, index: number) => (
                            <li key={index} className="flex gap-3">
                              <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                {index + 1}
                              </span>
                              <span className="text-gray-300">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* DKIM Tab */}
            {activeTab === 'dkim' && (
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">🔑 DKIM Signature Setup</h2>
                
                <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-6 mb-6">
                  <h3 className="text-xl font-bold text-green-300 mb-4">What is DKIM?</h3>
                  <p className="text-green-200 mb-4">
                    DKIM (DomainKeys Identified Mail) adds a digital signature to your emails, proving they haven't been tampered with during transit. It uses cryptographic authentication to verify the sender's identity.
                  </p>
                  <div className="bg-green-800/30 rounded-lg p-4">
                    <h4 className="font-semibold text-green-300 mb-2">DKIM Record Example:</h4>
                    <code className="text-green-100 text-sm">
                      selector1._domainkey.yourdomain.com TXT "v=DKIM1; k=rsa; p=MIGfMA0G..."
                    </code>
                  </div>
                </div>

                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-6 mb-6">
                  <h3 className="text-xl font-bold text-yellow-300 mb-4">⚠️ Important DKIM Notes</h3>
                  <div className="space-y-3 text-yellow-200">
                    <p>• DKIM keys are generated by your email service provider (Google Workspace, Office 365, etc.)</p>
                    <p>• You need to get DKIM records from your email provider's admin panel</p>
                    <p>• Each email service has different selectors (e.g., "google", "selector1", "default")</p>
                    <p>• DKIM records are much longer than SPF or DMARC records</p>
                  </div>
                </div>

                {providerInstructions && detectedProvider && (
                  <div className="bg-gray-700/30 rounded-xl p-6 mb-6">
                    <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <span>{detectedProvider.logo}</span>
                      DKIM Setup for {detectedProvider.name}
                    </h4>
                    
                    {providerInstructions.dkimSteps && (
                      <div>
                        <h5 className="font-semibold text-green-300 mb-3">DKIM Record Implementation</h5>
                        <ol className="space-y-2">
                          {providerInstructions.dkimSteps.map((step: string, index: number) => (
                            <li key={index} className="flex gap-3">
                              <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                {index + 1}
                              </span>
                              <span className="text-gray-300">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-700/30 rounded-xl p-6">
                    <h4 className="text-lg font-bold text-white mb-4">🟢 Google Workspace</h4>
                    <ol className="space-y-2 text-sm text-gray-300">
                      <li>1. Go to Google Admin Console → Apps → Google Workspace → Gmail</li>
                      <li>2. Click "Authenticate email" → "Generate new record"</li>
                      <li>3. Copy the TXT record name and value</li>
                      <li>4. Add to your DNS with exact name and value provided</li>
                    </ol>
                  </div>
                  
                  <div className="bg-gray-700/30 rounded-xl p-6">
                    <h4 className="text-lg font-bold text-white mb-4">🔵 Microsoft 365</h4>
                    <ol className="space-y-2 text-sm text-gray-300">
                      <li>1. Go to Microsoft 365 Admin → Settings → Domains</li>
                      <li>2. Select your domain → DNS records</li>
                      <li>3. Find DKIM records in the list</li>
                      <li>4. Add both CNAME records to your DNS provider</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}


            {/* Verification Tab */}
            {activeTab === 'verification' && (
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">✅ Verify Your Setup</h2>
                
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6 text-center">
                    <div className="text-4xl mb-4">🔍</div>
                    <h3 className="text-lg font-bold text-blue-300 mb-2">DNS Lookup Tools</h3>
                    <p className="text-sm text-blue-200 mb-4">Check if your records are live</p>
                    <a 
                      href="https://mxtoolbox.com/spf.aspx" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline text-sm"
                    >
                      Check SPF Record
                    </a>
                  </div>
                  
                  <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-6 text-center">
                    <div className="text-4xl mb-4">📧</div>
                    <h3 className="text-lg font-bold text-purple-300 mb-2">Email Testing</h3>
                    <p className="text-sm text-purple-200 mb-4">Send test emails</p>
                    <a 
                      href="https://www.mail-tester.com/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 underline text-sm"
                    >
                      Test Email Score
                    </a>
                  </div>
                  
                  <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-6 text-center">
                    <div className="text-4xl mb-4">📊</div>
                    <h3 className="text-lg font-bold text-green-300 mb-2">Monitor Results</h3>
                    <p className="text-sm text-green-200 mb-4">Track improvements</p>
                    <span className="text-green-400 text-sm">Watch inbox delivery rates</span>
                  </div>
                </div>

                <div className="bg-gray-700/30 rounded-xl p-6 mb-6">
                  <h3 className="text-xl font-bold text-white mb-4">🔧 Verification Checklist</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-white mb-3">DNS Records Check:</h4>
                      <ul className="space-y-2 text-gray-300">
                        <li className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-gray-500 rounded"></span>
                          <span>SPF record returns correct policy</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-gray-500 rounded"></span>
                          <span>DMARC record shows your policy</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-gray-500 rounded"></span>
                          <span>DKIM signature validates</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-3">Email Testing:</h4>
                      <ul className="space-y-2 text-gray-300">
                        <li className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-gray-500 rounded"></span>
                          <span>Emails reach inbox (not spam)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-gray-500 rounded"></span>
                          <span>Authentication passes all checks</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-gray-500 rounded"></span>
                          <span>DMARC reports show alignment</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-green-300 mb-4">🎉 Success! What's Next?</h3>
                  <div className="text-green-200 space-y-3">
                    <p>✅ Your email authentication is now properly configured!</p>
                    <p>📈 You should see improved inbox delivery rates within 24-48 hours</p>
                    <p>📊 Monitor your email performance and DMARC reports regularly</p>
                    <p>🔄 Consider upgrading to stricter DMARC policies as your authentication improves</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Help Section */}
          <div className="mt-12 bg-blue-900/20 border border-blue-500/30 rounded-xl p-6 text-center">
            <h3 className="text-xl font-bold text-blue-300 mb-4">Need Help? We're Here for You!</h3>
            <p className="text-blue-200 mb-4">
              If you run into any issues implementing these DNS changes, don't hesitate to reach out.
            </p>
            <a 
              href="mailto:hello@inboxshield-mini.com"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg inline-block"
            >
              Get Setup Support
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function SetupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading setup guide...</p>
        </div>
      </div>
    }>
      <SetupContent />
    </Suspense>
  );
}