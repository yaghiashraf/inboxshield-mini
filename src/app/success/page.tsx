'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function SuccessPage() {
  const [domain, setDomain] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportReady, setReportReady] = useState(false);
  const [reportData, setReportData] = useState<any>(null);

  useEffect(() => {
    // Get the domain from localStorage that was saved before payment
    const pendingDomain = localStorage.getItem('pendingDomain');
    if (pendingDomain) {
      setDomain(pendingDomain);
      // Clear it from localStorage
      localStorage.removeItem('pendingDomain');
      // Automatically generate the report
      generateReport(pendingDomain);
    }
  }, []);

  const generateReport = async (domainName: string) => {
    setIsGenerating(true);
    try {
      console.log('Generating full report for:', domainName);
      
      // Generate comprehensive report
      const response = await fetch('/.netlify/functions/generate-full-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          domain: domainName, 
          paymentVerified: true 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      const result = await response.json();
      setReportData(result.reportData);
      setReportReady(true);
      console.log('Report generated successfully');
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Error generating report: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadReport = async () => {
    if (!reportData) {
      alert('Report not ready yet. Please wait for generation to complete.');
      return;
    }

    try {
      console.log('Downloading PDF report...');
      
      // Generate and download PDF
      const response = await fetch('/.netlify/functions/generate-pdf-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reportData }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      // Create download link
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `inboxshield-${domain}-report.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      console.log('PDF downloaded successfully');
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Error downloading report: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
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
              <p className="text-lg text-blue-400 mb-4">
                Analysis for: <span className="font-bold">{domain}</span>
              </p>
            )}
            
            {/* Report Generation Status */}
            {isGenerating && (
              <div className="inline-flex items-center space-x-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-4 py-2 mb-8">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-yellow-400 border-t-transparent"></div>
                <span className="text-yellow-300 text-sm font-medium">Generating your comprehensive report...</span>
              </div>
            )}
            
            {reportReady && !isGenerating && (
              <div className="inline-flex items-center space-x-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 mb-8">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-green-300 text-sm font-medium">Report ready for download!</span>
              </div>
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
                disabled={!reportReady || isGenerating}
                className={`${
                  reportReady && !isGenerating
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 hover:scale-105'
                    : 'bg-gray-600 cursor-not-allowed'
                } text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform shadow-lg`}
              >
                <div className="flex items-center justify-center gap-2">
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Generating Report...</span>
                    </>
                  ) : reportReady ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>Download Your Report</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Preparing Report...</span>
                    </>
                  )}
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
                href="mailto:hello@inboxshield-mini.com"
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