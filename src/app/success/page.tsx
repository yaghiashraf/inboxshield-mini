'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

function SuccessContent() {
  const [domain, setDomain] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const [reportReady, setReportReady] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [paymentVerified, setPaymentVerified] = useState(false);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams?.get('session_id');
  const reportId = searchParams?.get('report_id');

  useEffect(() => {
    if (sessionId && reportId) {
      verifyPaymentAndGenerateReport();
    } else {
      // Fallback to localStorage method
      const pendingDomain = localStorage.getItem('pendingDomain');
      if (pendingDomain) {
        setDomain(pendingDomain);
        localStorage.removeItem('pendingDomain');
        generateReport(pendingDomain);
      } else {
        setError('Missing payment information. Please contact support.');
        setIsGenerating(false);
      }
    }
  }, [sessionId, reportId]);

  const verifyPaymentAndGenerateReport = async () => {
    try {
      setIsGenerating(true);
      
      // First verify the payment and get report data
      const response = await fetch('/.netlify/functions/get-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          reportId,
          sessionId 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log('Payment verification error details:', errorData);
        
        // If we have debug info, log it for troubleshooting
        if (errorData.debug) {
          console.log('Debug info:', errorData.debug);
        }
        
        throw new Error(errorData.error || 'Failed to verify payment');
      }

      const data = await response.json();
      
      if (!data.paymentVerified) {
        throw new Error('Payment could not be verified');
      }

      setPaymentVerified(true);
      setReportData(data.reportData);
      setDomain(data.reportData?.domain);
      setReportReady(true);
      
      console.log('Payment verified and report generated successfully');
    } catch (err) {
      console.error('Error verifying payment:', err);
      setError(err instanceof Error ? err.message : 'Failed to process payment');
    } finally {
      setIsGenerating(false);
    }
  };

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

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-8">
              <div className="text-6xl mb-4">❌</div>
              <h1 className="text-2xl font-bold text-white mb-4">Payment Processing Error</h1>
              <p className="text-gray-300 mb-6">{error}</p>
              <a
                href="mailto:hello@inboxshield-mini.com"
                className="inline-flex items-center bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Redirect to report page when ready
  if (reportReady && reportId) {
    setTimeout(() => {
      router.push(`/report/${reportId}?session_id=${sessionId}`);
    }, 3000); // 3-second delay to show success message
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Processing Animation */}
          {isGenerating && (
            <div className="mb-12">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-500/20 rounded-full border-4 border-blue-500 mb-6 animate-pulse">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-400 border-t-transparent"></div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Processing Your Payment...
                </span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-4">
                Please wait while we verify your payment and generate your email security report.
              </p>
              
              {domain && (
                <p className="text-lg text-blue-400 mb-4">
                  Analysis for: <span className="font-bold">{domain}</span>
                </p>
              )}
              
              <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-8">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-400 border-t-transparent"></div>
                <span className="text-blue-300 text-sm font-medium">Analyzing DNS records and generating fixes...</span>
              </div>

              {/* Processing Steps */}
              <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                  <div className="text-2xl mb-2">✅</div>
                  <p className="text-green-300 text-sm font-medium">Payment Verified</p>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-400 border-t-transparent mx-auto mb-2"></div>
                  <p className="text-blue-300 text-sm font-medium">Analyzing DNS</p>
                </div>
                <div className="bg-gray-500/10 border border-gray-500/20 rounded-xl p-4">
                  <div className="text-2xl mb-2">⏳</div>
                  <p className="text-gray-400 text-sm font-medium">Generating Report</p>
                </div>
              </div>
            </div>
          )}

          {/* Success State */}
          {reportReady && !isGenerating && (
            <div className="mb-12">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-green-500/20 rounded-full border-4 border-green-500 mb-6">
                <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  Report Ready! 🎉
                </span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-4">
                Your comprehensive email security analysis is complete!
              </p>
              
              {domain && (
                <p className="text-lg text-blue-400 mb-4">
                  Analysis for: <span className="font-bold">{domain}</span>
                </p>
              )}
              
              <div className="inline-flex items-center space-x-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 mb-8">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-green-300 text-sm font-medium">Redirecting to your report in 3 seconds...</span>
              </div>

              {/* Success Steps */}
              <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                  <div className="text-2xl mb-2">✅</div>
                  <p className="text-green-300 text-sm font-medium">Payment Verified</p>
                </div>
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                  <div className="text-2xl mb-2">✅</div>
                  <p className="text-green-300 text-sm font-medium">DNS Analyzed</p>
                </div>
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                  <div className="text-2xl mb-2">✅</div>
                  <p className="text-green-300 text-sm font-medium">Report Generated</p>
                </div>
              </div>

              <div className="bg-blue-900/30 border border-blue-500/30 rounded-xl p-4 max-w-md mx-auto mb-6">
                <p className="text-blue-300 text-sm">
                  <strong>Next:</strong> View your detailed report with copy-paste DNS fixes!
                </p>
              </div>

              {/* Manual Continue Button */}
              <div className="flex justify-center">
                <button
                  onClick={() => router.push(`/report/${reportId}?session_id=${sessionId}`)}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>View Report Now</span>
                  </div>
                </button>
              </div>
            </div>
          )}

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

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-400 border-t-transparent mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}