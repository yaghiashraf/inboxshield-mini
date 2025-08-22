import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { DomainCheckResult } from '@/types';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottom: '2px solid #3B82F6',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 10,
  },
  scoreSection: {
    backgroundColor: '#F8FAFC',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1F2937',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 10,
    borderBottom: '1px solid #E5E7EB',
    paddingBottom: 5,
  },
  checkItem: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#F9FAFB',
    borderRadius: 5,
  },
  checkHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  checkTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  checkDescription: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 5,
  },
  issuesList: {
    marginLeft: 10,
  },
  issueItem: {
    fontSize: 10,
    color: '#DC2626',
    marginBottom: 2,
  },
  recommendationsList: {
    marginLeft: 10,
  },
  recommendationItem: {
    fontSize: 10,
    color: '#059669',
    marginBottom: 2,
  },
  dnsRecord: {
    backgroundColor: '#F3F4F6',
    padding: 8,
    marginTop: 5,
    borderRadius: 3,
    fontFamily: 'Courier',
    fontSize: 9,
    color: '#374151',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
    color: '#9CA3AF',
  },
});

interface PDFReportProps {
  reportData: any; // Extended report data with DNS fixes and recommendations
}

const getStatusIcon = (status: 'pass' | 'warn' | 'fail') => {
  switch (status) {
    case 'pass': return '✅';
    case 'warn': return '⚠️';
    case 'fail': return '❌';
  }
};

const getScoreColor = (score: number) => {
  if (score >= 80) return '#059669';
  if (score >= 60) return '#D97706';
  return '#DC2626';
};

export const PDFReport: React.FC<PDFReportProps> = ({ reportData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🛡️ InboxShield Mini Report</Text>
        <Text style={styles.subtitle}>Email Security Analysis for {reportData.domain}</Text>
        <Text style={styles.subtitle}>Generated on {new Date(reportData.timestamp).toLocaleDateString()}</Text>
      </View>

      {/* Overall Score */}
      <View style={styles.scoreSection}>
        <Text style={[styles.scoreText, { color: getScoreColor(reportData.overallScore) }]}>
          Overall Security Score: {reportData.overallScore}/100
        </Text>
      </View>

      {/* SPF Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>SPF (Sender Policy Framework)</Text>
        <View style={styles.checkItem}>
          <View style={styles.checkHeader}>
            <Text>{getStatusIcon(reportData.spf.status)}</Text>
            <Text style={styles.checkTitle}>SPF Record Analysis</Text>
          </View>
          <Text style={styles.checkDescription}>
            Controls which servers can send email on behalf of your domain
          </Text>
          
          {result.spf.record && (
            <View>
              <Text style={{ fontSize: 10, fontWeight: 'bold', marginTop: 5 }}>Current Record:</Text>
              <Text style={styles.dnsRecord}>{result.spf.record}</Text>
            </View>
          )}

          {result.spf.issues.length > 0 && (
            <View style={styles.issuesList}>
              <Text style={{ fontSize: 10, fontWeight: 'bold', marginTop: 5, color: '#DC2626' }}>Issues Found:</Text>
              {result.spf.issues.map((issue, index) => (
                <Text key={index} style={styles.issueItem}>• {issue}</Text>
              ))}
            </View>
          )}

          {result.spf.recommendations.length > 0 && (
            <View style={styles.recommendationsList}>
              <Text style={{ fontSize: 10, fontWeight: 'bold', marginTop: 5, color: '#059669' }}>Recommendations:</Text>
              {result.spf.recommendations.map((rec, index) => (
                <Text key={index} style={styles.recommendationItem}>• {rec}</Text>
              ))}
            </View>
          )}

          {result.spf.suggestedRecord && (
            <View>
              <Text style={{ fontSize: 10, fontWeight: 'bold', marginTop: 5 }}>Suggested Fix:</Text>
              <Text style={styles.dnsRecord}>{result.spf.suggestedRecord}</Text>
            </View>
          )}
        </View>
      </View>

      {/* DMARC Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DMARC (Domain-based Message Authentication)</Text>
        <View style={styles.checkItem}>
          <View style={styles.checkHeader}>
            <Text>{getStatusIcon(result.dmarc.status)}</Text>
            <Text style={styles.checkTitle}>DMARC Policy Analysis</Text>
          </View>
          <Text style={styles.checkDescription}>
            Protects your domain from email spoofing and phishing attacks
          </Text>
          
          {result.dmarc.record && (
            <View>
              <Text style={{ fontSize: 10, fontWeight: 'bold', marginTop: 5 }}>Current Record:</Text>
              <Text style={styles.dnsRecord}>{result.dmarc.record}</Text>
            </View>
          )}

          {result.dmarc.issues.length > 0 && (
            <View style={styles.issuesList}>
              <Text style={{ fontSize: 10, fontWeight: 'bold', marginTop: 5, color: '#DC2626' }}>Issues Found:</Text>
              {result.dmarc.issues.map((issue, index) => (
                <Text key={index} style={styles.issueItem}>• {issue}</Text>
              ))}
            </View>
          )}

          {result.dmarc.recommendations.length > 0 && (
            <View style={styles.recommendationsList}>
              <Text style={{ fontSize: 10, fontWeight: 'bold', marginTop: 5, color: '#059669' }}>Recommendations:</Text>
              {result.dmarc.recommendations.map((rec, index) => (
                <Text key={index} style={styles.recommendationItem}>• {rec}</Text>
              ))}
            </View>
          )}

          {result.dmarc.suggestedRecord && (
            <View>
              <Text style={{ fontSize: 10, fontWeight: 'bold', marginTop: 5 }}>Suggested Fix:</Text>
              <Text style={styles.dnsRecord}>{result.dmarc.suggestedRecord}</Text>
            </View>
          )}
        </View>
      </View>

      {/* DKIM Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DKIM (DomainKeys Identified Mail)</Text>
        <View style={styles.checkItem}>
          <View style={styles.checkHeader}>
            <Text>{getStatusIcon(result.dkim.status)}</Text>
            <Text style={styles.checkTitle}>DKIM Signature Analysis</Text>
          </View>
          <Text style={styles.checkDescription}>
            Ensures email content has not been tampered with during transit
          </Text>

          {result.dkim.issues.length > 0 && (
            <View style={styles.issuesList}>
              <Text style={{ fontSize: 10, fontWeight: 'bold', marginTop: 5, color: '#DC2626' }}>Issues Found:</Text>
              {result.dkim.issues.map((issue, index) => (
                <Text key={index} style={styles.issueItem}>• {issue}</Text>
              ))}
            </View>
          )}

          {result.dkim.recommendations.length > 0 && (
            <View style={styles.recommendationsList}>
              <Text style={{ fontSize: 10, fontWeight: 'bold', marginTop: 5, color: '#059669' }}>Recommendations:</Text>
              {result.dkim.recommendations.map((rec, index) => (
                <Text key={index} style={styles.recommendationItem}>• {rec}</Text>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* Footer */}
      <Text style={styles.footer}>
        Generated by InboxShield Mini • https://inboxshield.com • Report ID: {result.domain}_{new Date(result.timestamp).getTime()}
      </Text>
    </Page>
  </Document>
);