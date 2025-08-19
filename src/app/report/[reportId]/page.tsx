'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { DomainCheckResult } from '@/types';
import { FullReportDisplay } from '@/components/FullReportDisplay';

export default function ReportPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [report, setReport] = useState<DomainCheckResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reportId = params?.reportId as string;
  const sessionId = searchParams?.get('session_id');

  useEffect(() => {
    if (!reportId) {
      setError('Invalid report ID');
      setIsLoading(false);
      return;
    }

    // Extract domain from reportId (format: report_domain_timestamp)
    const domainMatch = reportId.match(/^report_(.+)_\d+$/);
    if (!domainMatch) {
      setError('Invalid report ID format');
      setIsLoading(false);
      return;
    }

    const domain = domainMatch[1].replace(/_/g, '.');

    // If there's a session_id, verify payment first (in production)
    // For now, we'll just generate the report
    generateReport(domain);
  }, [reportId, sessionId]);

  const generateReport = async (domain: string) => {
    try {
      const response = await fetch('/api/check-full', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      const result = await response.json();
      setReport(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load report');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!report) return;

    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          domain: report.domain, 
          reportId 
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Generating Your Report</h2>
          <p className="text-gray-600">Please wait while we analyze your domain...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">❌</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Report Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="text-gray-400 text-5xl mb-4">📋</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Report Not Found</h2>
          <p className="text-gray-600">The requested report could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="text-green-500 text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-lg text-gray-600">
            Here&apos;s your complete email security report for <strong>{report.domain}</strong>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="text-center mb-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleDownloadPDF}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
            >
              📄 Download PDF Report
            </button>
            <button
              onClick={() => window.print()}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
            >
              🖨️ Print Report
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Bookmark this page to access your report anytime
          </p>
        </div>

        {/* Full Report Display */}
        <FullReportDisplay result={report} />
      </div>
    </div>
  );
}