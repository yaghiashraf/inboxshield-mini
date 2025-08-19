'use client';

import { useState } from 'react';
import { DomainCheckResult } from '@/types';

interface FullReportDisplayProps {
  result: DomainCheckResult;
}

export function FullReportDisplay({ result }: FullReportDisplayProps) {
  const [copiedRecord, setCopiedRecord] = useState<string | null>(null);

  const getStatusIcon = (status: 'pass' | 'warn' | 'fail') => {
    switch (status) {
      case 'pass': return '✅';
      case 'warn': return '⚠️';
      case 'fail': return '❌';
    }
  };


  const copyToClipboard = async (text: string, recordType: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedRecord(recordType);
      setTimeout(() => setCopiedRecord(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleRecheck = async () => {
    window.location.reload();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Overall Score */}
      <div className="bg-white rounded-lg shadow-lg p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Overall Email Security Score</h2>
        <div className={`text-6xl font-bold mb-4 ${
          result.overallScore >= 80 ? 'text-green-600' : 
          result.overallScore >= 60 ? 'text-yellow-600' : 'text-red-600'
        }`}>
          {result.overallScore}/100
        </div>
        <p className="text-gray-600">
          Generated on {new Date(result.timestamp).toLocaleDateString()} at{' '}
          {new Date(result.timestamp).toLocaleTimeString()}
        </p>
      </div>

      {/* SPF Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">{getStatusIcon(result.spf.status)}</span>
          <div>
            <h3 className="text-xl font-bold text-gray-900">SPF (Sender Policy Framework)</h3>
            <p className="text-gray-600">Controls which servers can send email on behalf of your domain</p>
          </div>
        </div>

        {result.spf.record && (
          <div className="mb-4">
            <h4 className="font-semibold text-gray-900 mb-2">Current Record:</h4>
            <div className="bg-gray-50 p-3 rounded-lg font-mono text-sm border">
              {result.spf.record}
            </div>
          </div>
        )}

        {result.spf.issues.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold text-red-600 mb-2">Issues Found:</h4>
            <ul className="list-disc list-inside space-y-1 text-red-600">
              {result.spf.issues.map((issue, index) => (
                <li key={index}>{issue}</li>
              ))}
            </ul>
          </div>
        )}

        {result.spf.recommendations.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold text-green-600 mb-2">Recommendations:</h4>
            <ul className="list-disc list-inside space-y-1 text-green-600">
              {result.spf.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        )}

        {result.spf.suggestedRecord && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Suggested DNS Record:</h4>
            <div className="bg-white p-3 rounded border font-mono text-sm relative">
              <div className="mb-2">
                <strong>Type:</strong> TXT<br />
                <strong>Name:</strong> @ (or your domain)<br />
                <strong>Value:</strong>
              </div>
              <div className="bg-gray-50 p-2 rounded">{result.spf.suggestedRecord}</div>
              <button
                onClick={() => copyToClipboard(result.spf.suggestedRecord!, 'spf')}
                className="absolute top-2 right-2 bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs"
              >
                {copiedRecord === 'spf' ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* DMARC Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">{getStatusIcon(result.dmarc.status)}</span>
          <div>
            <h3 className="text-xl font-bold text-gray-900">DMARC (Domain-based Message Authentication)</h3>
            <p className="text-gray-600">Protects your domain from email spoofing and phishing attacks</p>
          </div>
        </div>

        {result.dmarc.record && (
          <div className="mb-4">
            <h4 className="font-semibold text-gray-900 mb-2">Current Record:</h4>
            <div className="bg-gray-50 p-3 rounded-lg font-mono text-sm border">
              {result.dmarc.record}
            </div>
          </div>
        )}

        {result.dmarc.issues.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold text-red-600 mb-2">Issues Found:</h4>
            <ul className="list-disc list-inside space-y-1 text-red-600">
              {result.dmarc.issues.map((issue, index) => (
                <li key={index}>{issue}</li>
              ))}
            </ul>
          </div>
        )}

        {result.dmarc.recommendations.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold text-green-600 mb-2">Recommendations:</h4>
            <ul className="list-disc list-inside space-y-1 text-green-600">
              {result.dmarc.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        )}

        {result.dmarc.suggestedRecord && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Suggested DNS Record:</h4>
            <div className="bg-white p-3 rounded border font-mono text-sm relative">
              <div className="mb-2">
                <strong>Type:</strong> TXT<br />
                <strong>Name:</strong> _dmarc<br />
                <strong>Value:</strong>
              </div>
              <div className="bg-gray-50 p-2 rounded">{result.dmarc.suggestedRecord}</div>
              <button
                onClick={() => copyToClipboard(result.dmarc.suggestedRecord!, 'dmarc')}
                className="absolute top-2 right-2 bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs"
              >
                {copiedRecord === 'dmarc' ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* DKIM Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">{getStatusIcon(result.dkim.status)}</span>
          <div>
            <h3 className="text-xl font-bold text-gray-900">DKIM (DomainKeys Identified Mail)</h3>
            <p className="text-gray-600">Ensures email content hasn&apos;t been tampered with during transit</p>
          </div>
        </div>

        {result.dkim.issues.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold text-red-600 mb-2">Issues Found:</h4>
            <ul className="list-disc list-inside space-y-1 text-red-600">
              {result.dkim.issues.map((issue, index) => (
                <li key={index}>{issue}</li>
              ))}
            </ul>
          </div>
        )}

        {result.dkim.recommendations.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold text-green-600 mb-2">Recommendations:</h4>
            <ul className="list-disc list-inside space-y-1 text-green-600">
              {result.dkim.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        )}

        {result.dkim.providerGuidance && result.dkim.providerGuidance.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-900 mb-2">Provider Setup Instructions:</h4>
            <div className="space-y-3">
              {result.dkim.providerGuidance.map((guidance, index) => (
                <div key={index} className="bg-white p-3 rounded border">
                  <h5 className="font-medium text-gray-900">{guidance.provider}</h5>
                  <p className="text-sm text-gray-600 mt-1">{guidance.setupInstructions}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Common selectors: {guidance.commonSelectors.join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* BIMI Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">{getStatusIcon(result.bimi.status)}</span>
          <div>
            <h3 className="text-xl font-bold text-gray-900">BIMI (Brand Indicators for Message Identification)</h3>
            <p className="text-gray-600">Displays your brand logo in supported email clients</p>
          </div>
        </div>

        {result.bimi.record && (
          <div className="mb-4">
            <h4 className="font-semibold text-gray-900 mb-2">Current Record:</h4>
            <div className="bg-gray-50 p-3 rounded-lg font-mono text-sm border">
              {result.bimi.record}
            </div>
          </div>
        )}

        {result.bimi.issues.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold text-red-600 mb-2">Issues Found:</h4>
            <ul className="list-disc list-inside space-y-1 text-red-600">
              {result.bimi.issues.map((issue, index) => (
                <li key={index}>{issue}</li>
              ))}
            </ul>
          </div>
        )}

        {result.bimi.recommendations.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold text-green-600 mb-2">Note:</h4>
            <ul className="list-disc list-inside space-y-1 text-green-600">
              {result.bimi.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* MTA-STS Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">{getStatusIcon(result.mtaSts.status)}</span>
          <div>
            <h3 className="text-xl font-bold text-gray-900">MTA-STS (Mail Transfer Agent Strict Transport Security)</h3>
            <p className="text-gray-600">Enforces secure connections for incoming email</p>
          </div>
        </div>

        {result.mtaSts.record && (
          <div className="mb-4">
            <h4 className="font-semibold text-gray-900 mb-2">Current Record:</h4>
            <div className="bg-gray-50 p-3 rounded-lg font-mono text-sm border">
              {result.mtaSts.record}
            </div>
          </div>
        )}

        {result.mtaSts.issues.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold text-red-600 mb-2">Issues Found:</h4>
            <ul className="list-disc list-inside space-y-1 text-red-600">
              {result.mtaSts.issues.map((issue, index) => (
                <li key={index}>{issue}</li>
              ))}
            </ul>
          </div>
        )}

        {result.mtaSts.recommendations.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold text-green-600 mb-2">Note:</h4>
            <ul className="list-disc list-inside space-y-1 text-green-600">
              {result.mtaSts.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Re-check Button */}
      <div className="text-center">
        <button
          onClick={handleRecheck}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
        >
          🔄 Re-check After DNS Changes
        </button>
        <p className="text-sm text-gray-500 mt-2">
          Click this button after making DNS changes to verify your fixes
        </p>
      </div>
    </div>
  );
}