'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function SuccessPage() {
  const [domain, setDomain] = useState<string | null>(null);

  useEffect(() => {
    // Get the domain from localStorage that was saved before payment
    const pendingDomain = localStorage.getItem('pendingDomain');
    if (pendingDomain) {
      setDomain(pendingDomain);
      // Clear it from localStorage
      localStorage.removeItem('pendingDomain');
    }
  }, []);

  const handleDownloadReport = () => {
    // For now, just show an alert. In production, this would generate the actual report
    alert('Report generation would happen here! Your domain: ' + (domain || 'unknown'));
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Success Animation */}
          <div className="mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-500/20 rounded-full border-4 border-green-500 mb-6">
              <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Payment Successful! 🎉
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-4">
              Thank you for your purchase! Your email security analysis is ready.
            </p>
            
            {domain && (
              <p className="text-lg text-blue-400 mb-8">
                Analysis for: <span className="font-bold">{domain}</span>
              </p>
            )}
          </div>

          {/* What happens next */}
          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/40 rounded-2xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">What Happens Next?</h2>
            
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                <div className="text-3xl mb-4">📧</div>
                <h3 className="text-lg font-bold text-blue-400 mb-3">1. Email Confirmation</h3>
                <p className="text-gray-300 text-sm">
                  You'll receive a confirmation email with your purchase details and next steps.
                </p>
              </div>
              
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                <div className="text-3xl mb-4">🔍</div>
                <h3 className="text-lg font-bold text-purple-400 mb-3">2. Analysis Complete</h3>
                <p className="text-gray-300 text-sm">
                  Your complete email authentication analysis has been generated with detailed fixes.
                </p>
              </div>
              
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                <div className="text-3xl mb-4">📋</div>
                <h3 className="text-lg font-bold text-green-400 mb-3">3. Download Report</h3>
                <p className="text-gray-300 text-sm">
                  Get your professional PDF report with copy-paste DNS fixes and setup instructions.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleDownloadReport}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Download Your Report</span>
                </div>
              </button>
              
              <Link 
                href="/"
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 inline-block"
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>Analyze Another Domain</span>
                </div>
              </Link>
            </div>
            
            {/* Support Info */}
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 max-w-2xl mx-auto">
              <h3 className="text-lg font-bold text-white mb-3">Need Help?</h3>
              <p className="text-gray-300 text-sm mb-4">
                If you have any questions about your report or need assistance implementing the fixes, 
                our support team is here to help.
              </p>
              <a 
                href="mailto:support@inboxshield.com"
                className="text-blue-400 hover:text-blue-300 underline text-sm font-medium"
              >
                Contact Support →
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}