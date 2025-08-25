'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { DomainCheckResult } from '@/types';

export default function ReportPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [report, setReport] = useState<DomainCheckResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentVerified, setPaymentVerified] = useState(false);

  const reportId = params?.reportId as string;
  const sessionId = searchParams?.get('session_id');
  const isPaymentLink = searchParams?.get('payment_link') === 'true';

  useEffect(() => {
    if (!reportId) {
      setError('Invalid report ID');
      setIsLoading(false);
      return;
    }

    if (isPaymentLink) {
      // For payment link flow, skip payment verification and generate report directly
      generateReportFromPaymentLink();
    } else {
      // For checkout session flow, verify payment first
      verifyPaymentAndGetReport();
    }
  }, [reportId, sessionId, isPaymentLink]);

  const verifyPaymentAndGetReport = async () => {
    try {
      console.log('Fetching report for:', { reportId, sessionId });
      
      // If we don't have a sessionId, this is likely a saved report link
      if (!sessionId) {
        setError('This report link requires a valid payment session. Please complete a new scan and payment.');
        setIsLoading(false);
        return;
      }
      
      // Verify payment and get report data
      const response = await fetch('/.netlify/functions/get-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          reportId: reportId || '', // Pass reportId, will be overridden by session metadata
          sessionId 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Report fetch error:', errorData);
        
        // More specific error messages
        if (response.status === 403) {
          throw new Error('Payment verification failed. Please ensure you completed the payment process.');
        } else if (response.status === 400) {
          throw new Error('Invalid request. Please try scanning your domain again.');
        } else {
          throw new Error(errorData.error || 'Failed to fetch report');
        }
      }

      const data = await response.json();
      console.log('Report data received:', data);
      
      setReport(data.reportData);
      setPaymentVerified(data.paymentVerified);
    } catch (err) {
      console.error('Error fetching report:', err);
      setError(err instanceof Error ? err.message : 'Failed to load report');
    } finally {
      setIsLoading(false);
    }
  };

  const generateReportFromPaymentLink = async () => {
    try {
      console.log('Generating report from payment link for:', reportId);
      
      // Extract domain from reportId (format: report_domain_timestamp)
      const domainMatch = reportId.match(/^report_(.+?)_\d+$/);
      const domain = domainMatch ? domainMatch[1].replace(/_/g, '.') : null;
      
      if (!domain) {
        throw new Error('Could not extract domain from report ID');
      }
      
      console.log('Extracted domain:', domain);
      
      // Generate comprehensive report
      const response = await fetch('/.netlify/functions/generate-full-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          domain: domain, 
          paymentVerified: true // Trust that payment was completed via payment link
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      const result = await response.json();
      setReport(result.reportData);
      setPaymentVerified(true);
      console.log('Report generated successfully from payment link');
    } catch (err) {
      console.error('Error generating report from payment link:', err);
      setError(err instanceof Error ? err.message : 'Failed to load report');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!report) return;

    try {
      const response = await fetch('/.netlify/functions/generate-pdf-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          reportData: report
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `inboxshield-${report.domain}-report.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-400 border-t-transparent mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your email security report...</p>
        </div>
      </div>
    );
  }

  if (error || !paymentVerified) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-8">
              <div className="text-6xl mb-4">❌</div>
              <h1 className="text-2xl font-bold text-white mb-4">
                {error || 'Payment verification failed'}
              </h1>
              <p className="text-gray-300 mb-6">
                We couldn't verify your payment or load your report. Please contact support if you believe this is an error.
              </p>
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

  if (!report) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-8">
              <div className="text-6xl mb-4">📋</div>
              <h1 className="text-2xl font-bold text-white mb-4">Report Not Found</h1>
              <p className="text-gray-300">The requested report could not be found.</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        {/* Success Header */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-500/40 rounded-2xl p-8">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Payment Successful! Your Complete Report is Ready
            </h1>
            <p className="text-xl text-green-300 mb-6">
              Full email authentication analysis for <span className="font-bold">{report.domain}</span>
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>Payment processed securely by Stripe</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                <span>Complete DNS fixes included</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                <span>Professional PDF report available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <div className="grid md:grid-cols-3 gap-4">
              <button
                onClick={handleDownloadPDF}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Download PDF</span>
                </div>
              </button>
              <button
                onClick={() => navigator.clipboard.writeText(window.location.href)}
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  <span>Share Link</span>
                </div>
              </button>
              <button
                onClick={() => window.print()}
                className="bg-green-700 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  <span>Print</span>
                </div>
              </button>
            </div>
            <p className="text-sm text-gray-400 mt-4 text-center">
              💡 Bookmark this page! Your report will remain accessible with this link.
            </p>
          </div>
        </div>

        {/* Report Content - We'll display the detailed results here */}
        {/* This is a placeholder for now - in production you'd want a full report component */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Complete Report Ready</h2>
            <p className="text-gray-300 mb-6">
              Your detailed email authentication analysis for <strong>{report.domain}</strong> is complete.
              Use the actions above to download your PDF report or share this link with your team.
            </p>
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <div className={`text-4xl font-bold mb-2 ${
                  report.overallScore >= 80 ? 'text-green-400' : 
                  report.overallScore >= 60 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {report.overallScore}/100
                </div>
                <p className="text-gray-300">Security Score</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-red-400 mb-2">
                  {[report.spf, report.dmarc, report.dkim, report.bimi, report.mtaSts]
                    .filter(item => item.status === 'fail').length}
                </div>
                <p className="text-gray-300">Critical Issues</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-400 mb-2">5</div>
                <p className="text-gray-300">Protocols Checked</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-400 mb-2">
                  {[report.spf, report.dmarc, report.dkim, report.bimi, report.mtaSts]
                    .filter(item => item.status === 'pass').length}
                </div>
                <p className="text-gray-300">Correctly Configured</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}