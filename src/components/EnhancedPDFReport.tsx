import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Create styles with improved design
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 12,
    lineHeight: 1.6,
  },
  header: {
    marginBottom: 30,
    borderBottom: '3px solid #3B82F6',
    paddingBottom: 15,
    backgroundColor: '#F8FAFC',
    padding: 20,
    borderRadius: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
    textAlign: 'center',
  },
  scoreSection: {
    backgroundColor: '#F0F9FF',
    padding: 25,
    borderRadius: 12,
    marginBottom: 30,
    textAlign: 'center',
    border: '2px solid #3B82F6',
  },
  scoreText: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1F2937',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  section: {
    marginBottom: 25,
    pageBreakInside: 'avoid',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 15,
    backgroundColor: '#F3F4F6',
    padding: 10,
    borderRadius: 6,
    borderLeft: '4px solid #3B82F6',
  },
  dnsFixBox: {
    backgroundColor: '#F8FAFC',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    border: '1px solid #E5E7EB',
    borderLeft: '4px solid #3B82F6',
  },
  dnsRecord: {
    fontFamily: 'Courier',
    fontSize: 9,
    color: '#374151',
    marginTop: 8,
    backgroundColor: '#F3F4F6',
    padding: 10,
    borderRadius: 4,
    border: '1px solid #D1D5DB',
  },
  priorityHigh: {
    color: '#DC2626',
    fontWeight: 'bold',
  },
  priorityMedium: {
    color: '#D97706',
    fontWeight: 'bold',
  },
  priorityLow: {
    color: '#059669',
    fontWeight: 'bold',
  },
  recommendationItem: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    borderLeft: '4px solid #3B82F6',
  },
  providerSection: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#FAFAFA',
    borderRadius: 6,
    border: '1px solid #E5E7EB',
  },
  providerTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#374151',
  },
  providerStep: {
    fontSize: 10,
    marginBottom: 3,
    paddingLeft: 5,
    color: '#4B5563',
  },
  impactBox: {
    backgroundColor: '#FEF3C7',
    padding: 15,
    borderRadius: 8,
    borderLeft: '4px solid #F59E0B',
    marginBottom: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 9,
    color: '#9CA3AF',
    borderTop: '1px solid #E5E7EB',
    paddingTop: 12,
  },
});

interface EnhancedPDFReportProps {
  reportData: any;
}

const getScoreColor = (score: number) => {
  if (score >= 80) return '#059669';
  if (score >= 60) return '#D97706';
  return '#DC2626';
};

const getPriorityStyle = (priority: string) => {
  switch (priority) {
    case 'HIGH': return styles.priorityHigh;
    case 'MEDIUM': return styles.priorityMedium;
    case 'LOW': return styles.priorityLow;
    default: return styles.priorityLow;
  }
};

export const EnhancedPDFReport: React.FC<EnhancedPDFReportProps> = ({ reportData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>InboxShield Mini - Complete Email Security Report</Text>
        <Text style={styles.subtitle}>Domain: {reportData.domain}</Text>
        <Text style={styles.subtitle}>Generated: {new Date(reportData.timestamp).toLocaleDateString()}</Text>
        <Text style={styles.subtitle}>Report ID: {reportData.reportId}</Text>
      </View>

      {/* Executive Summary */}
      <View style={styles.scoreSection}>
        <Text style={[styles.scoreText, { color: getScoreColor(reportData.overallScore) }]}>
          {reportData.overallScore}/100
        </Text>
        <Text style={{ fontSize: 16, color: '#1F2937', marginBottom: 8 }}>
          Email Security Score
        </Text>
        <Text style={[styles.statusText, { color: getScoreColor(reportData.overallScore) }]}>
          {reportData.businessImpact?.currentImpactLevel === 'HIGH' && 'CRITICAL: Immediate action required'}
          {reportData.businessImpact?.currentImpactLevel === 'MEDIUM' && 'MODERATE: Action recommended within 24 hours'}
          {reportData.businessImpact?.currentImpactLevel === 'LOW' && 'GOOD: Minor improvements available'}
        </Text>
      </View>

      {/* Business Impact */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Business Impact Analysis</Text>
        <View style={styles.impactBox}>
          <Text style={{ fontSize: 13, marginBottom: 10, fontWeight: 'bold', color: '#92400E' }}>Current Email Deliverability Status:</Text>
          <Text style={{ fontSize: 11, marginBottom: 6, color: '#1F2937' }}>
            • Estimated inbox delivery rate: {reportData.businessImpact?.estimatedDeliverabilityRate || '70-85%'}
          </Text>
          <Text style={{ fontSize: 11, marginBottom: 6, color: '#1F2937' }}>
            • Critical issues found: {reportData.businessImpact?.criticalIssuesFound || 1}
          </Text>
          <Text style={{ fontSize: 11, marginBottom: 6, color: '#1F2937' }}>
            • Potential improvement: {reportData.businessImpact?.potentialImprovementRate || '95%+'}
          </Text>
          <Text style={{ fontSize: 11, color: '#1F2937' }}>
            • Recommended action timeframe: {reportData.businessImpact?.recommendedActionTimeframe || 'Within 48 hours'}
          </Text>
        </View>
      </View>

      {/* DNS Fixes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DNS Record Fixes (Copy-Paste Ready)</Text>
        {reportData.dnsFixesGenerated?.map((fix: any, index: number) => (
          <View key={index} style={styles.dnsFixBox}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: 'bold', marginRight: 15, color: '#1F2937' }}>{fix.type}</Text>
              <Text style={[{ fontSize: 11, padding: '4 8', borderRadius: 4, backgroundColor: '#FEF3C7' }, getPriorityStyle(fix.priority)]}>
                {fix.priority} PRIORITY
              </Text>
            </View>
            <Text style={{ fontSize: 11, color: '#4B5563', marginBottom: 10, fontStyle: 'italic' }}>{fix.description}</Text>
            
            <View style={{ marginBottom: 6 }}>
              <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#374151' }}>Record Type: </Text>
              <Text style={{ fontSize: 10, color: '#6B7280' }}>{fix.recordType}</Text>
            </View>
            
            <View style={{ marginBottom: 6 }}>
              <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#374151' }}>Name/Host: </Text>
              <Text style={{ fontSize: 10, color: '#6B7280' }}>{fix.name}</Text>
            </View>
            
            <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#374151', marginBottom: 4 }}>Value (copy this exactly):</Text>
            <Text style={styles.dnsRecord}>{fix.record}</Text>
          </View>
        ))}
      </View>

      {/* Provider Setup Instructions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DNS Provider Setup Instructions</Text>
        
        <View style={styles.providerSection}>
          <Text style={styles.providerTitle}>GoDaddy Setup:</Text>
          {reportData.providerInstructions?.godaddy?.steps?.map((step: string, index: number) => (
            <Text key={index} style={styles.providerStep}>{step}</Text>
          ))}
        </View>

        <View style={styles.providerSection}>
          <Text style={styles.providerTitle}>Cloudflare Setup:</Text>
          {reportData.providerInstructions?.cloudflare?.steps?.map((step: string, index: number) => (
            <Text key={index} style={styles.providerStep}>{step}</Text>
          ))}
        </View>

        <View style={styles.providerSection}>
          <Text style={styles.providerTitle}>Namecheap Setup:</Text>
          {reportData.providerInstructions?.namecheap?.steps?.map((step: string, index: number) => (
            <Text key={index} style={styles.providerStep}>{step}</Text>
          ))}
        </View>

        <View style={styles.providerSection}>
          <Text style={styles.providerTitle}>Amazon Route 53 Setup:</Text>
          {reportData.providerInstructions?.route53?.steps?.map((step: string, index: number) => (
            <Text key={index} style={styles.providerStep}>{step}</Text>
          ))}
        </View>

        <View style={styles.providerSection}>
          <Text style={styles.providerTitle}>DigitalOcean Setup:</Text>
          {reportData.providerInstructions?.digitalocean?.steps?.map((step: string, index: number) => (
            <Text key={index} style={styles.providerStep}>{step}</Text>
          ))}
        </View>

        <View style={styles.providerSection}>
          <Text style={styles.providerTitle}>Hover Setup:</Text>
          {reportData.providerInstructions?.hover?.steps?.map((step: string, index: number) => (
            <Text key={index} style={styles.providerStep}>{step}</Text>
          ))}
        </View>

        <View style={styles.providerSection}>
          <Text style={styles.providerTitle}>Network Solutions Setup:</Text>
          {reportData.providerInstructions?.networksolutions?.steps?.map((step: string, index: number) => (
            <Text key={index} style={styles.providerStep}>{step}</Text>
          ))}
        </View>

        <View style={styles.providerSection}>
          <Text style={styles.providerTitle}>Bluehost Setup:</Text>
          {reportData.providerInstructions?.bluehost?.steps?.map((step: string, index: number) => (
            <Text key={index} style={styles.providerStep}>{step}</Text>
          ))}
        </View>

        <View style={styles.providerSection}>
          <Text style={styles.providerTitle}>HostGator Setup:</Text>
          {reportData.providerInstructions?.hostgator?.steps?.map((step: string, index: number) => (
            <Text key={index} style={styles.providerStep}>{step}</Text>
          ))}
        </View>

        <View style={styles.providerSection}>
          <Text style={styles.providerTitle}>SiteGround Setup:</Text>
          {reportData.providerInstructions?.siteground?.steps?.map((step: string, index: number) => (
            <Text key={index} style={styles.providerStep}>{step}</Text>
          ))}
        </View>

        <View style={styles.providerSection}>
          <Text style={styles.providerTitle}>1&1 IONOS Setup:</Text>
          {reportData.providerInstructions?.['1and1']?.steps?.map((step: string, index: number) => (
            <Text key={index} style={styles.providerStep}>{step}</Text>
          ))}
        </View>
      </View>

      {/* Email Provider Setup Instructions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Email Provider Setup Instructions</Text>
        
        <View style={styles.providerSection}>
          <Text style={styles.providerTitle}>Google Workspace Setup:</Text>
          <Text style={{ fontSize: 10, marginBottom: 2 }}>1. Sign in to your Google Admin console (admin.google.com)</Text>
          <Text style={{ fontSize: 10, marginBottom: 2 }}>2. Go to Apps {'>'} Google Workspace {'>'} Gmail</Text>
          <Text style={{ fontSize: 10, marginBottom: 2 }}>3. Click "Authenticate email" and then "Advanced settings"</Text>
          <Text style={{ fontSize: 10, marginBottom: 2 }}>4. Scroll down to "Email authentication"</Text>
          <Text style={{ fontSize: 10, marginBottom: 2 }}>5. For SPF: Click "Set up email authentication" and follow the wizard</Text>
          <Text style={{ fontSize: 10, marginBottom: 2 }}>6. For DKIM: Go to "Generate new record" and add the provided TXT record to your DNS</Text>
          <Text style={{ fontSize: 10, marginBottom: 2 }}>7. For DMARC: Create a TXT record at _dmarc.yourdomain.com with the value from your DNS fixes</Text>
          <Text style={{ fontSize: 10, marginBottom: 2 }}>8. Wait 24-48 hours for changes to propagate</Text>
          <Text style={{ fontSize: 10, marginBottom: 2 }}>9. Verify setup using Gmail's email authentication checker</Text>
        </View>

        <View style={styles.providerSection}>
          <Text style={styles.providerTitle}>Microsoft 365/Outlook Setup:</Text>
          <Text style={{ fontSize: 10, marginBottom: 2 }}>1. Sign in to Microsoft 365 Admin Center (admin.microsoft.com)</Text>
          <Text style={{ fontSize: 10, marginBottom: 2 }}>2. Go to Settings {'>'} Domains and select your domain</Text>
          <Text style={{ fontSize: 10, marginBottom: 2 }}>3. Click "DNS records" tab</Text>
          <Text style={{ fontSize: 10, marginBottom: 2 }}>4. For SPF: Microsoft usually auto-configures, but verify the TXT record exists</Text>
          <Text style={{ fontSize: 10, marginBottom: 2 }}>5. For DKIM: Go to Security {'>'} Email & collaboration {'>'} Exchange</Text>
          <Text style={{ fontSize: 10, marginBottom: 2 }}>6. Under "Protection" go to "DKIM" and enable it for your domain</Text>
          <Text style={{ fontSize: 10, marginBottom: 2 }}>7. Copy the CNAME records provided and add them to your DNS</Text>
          <Text style={{ fontSize: 10, marginBottom: 2 }}>8. For DMARC: Add the TXT record from your DNS fixes to _dmarc.yourdomain.com</Text>
          <Text style={{ fontSize: 10, marginBottom: 2 }}>9. Use Microsoft's Message Analyzer to verify your setup</Text>
        </View>

        <View style={styles.providerSection}>
          <Text style={styles.providerTitle}>General Email Provider Notes:</Text>
          <Text style={{ fontSize: 10, marginBottom: 2 }}>- Always add DNS records through your domain registrar or DNS hosting provider</Text>
          <Text style={{ fontSize: 10, marginBottom: 2 }}>- Changes can take 24-72 hours to fully propagate across the internet</Text>
          <Text style={{ fontSize: 10, marginBottom: 2 }}>- Test your setup using tools like MXToolbox, DMARC Analyzer, or Mail-Tester</Text>
          <Text style={{ fontSize: 10, marginBottom: 2 }}>- Start with a relaxed DMARC policy (p=none) and gradually tighten to p=quarantine or p=reject</Text>
          <Text style={{ fontSize: 10, marginBottom: 2 }}>- Monitor DMARC reports to ensure legitimate emails aren't being blocked</Text>
        </View>
      </View>

      {/* Recommendations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Priority Recommendations</Text>
        {reportData.recommendations?.map((rec: any, index: number) => (
          <View key={index} style={styles.recommendationItem}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Text style={[{ fontSize: 11, fontWeight: 'bold', marginRight: 15, padding: '3 6', borderRadius: 3, backgroundColor: '#FEF3C7' }, getPriorityStyle(rec.priority)]}>
                {rec.priority}
              </Text>
              <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#1F2937' }}>{rec.title}</Text>
            </View>
            <Text style={{ fontSize: 11, marginBottom: 8, color: '#4B5563', lineHeight: 1.5 }}>{rec.description}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 10, color: '#059669', fontWeight: 'bold' }}>Impact: {rec.impact}</Text>
              <Text style={{ fontSize: 10, color: '#6B7280' }}>Time: {rec.timeToImplement}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Verification Steps */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Verification & Testing</Text>
        {reportData.verificationSteps?.map((step: any, index: number) => (
          <View key={index} style={{ marginBottom: 15, padding: 12, backgroundColor: '#F0F9FF', borderRadius: 6, borderLeft: '3px solid #3B82F6' }}>
            <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 6, color: '#1F2937' }}>
              Step {step.step}: {step.title}
            </Text>
            <Text style={{ fontSize: 11, marginBottom: 6, color: '#4B5563', lineHeight: 1.4 }}>{step.description}</Text>
            <Text style={{ fontSize: 10, color: '#6B7280', fontStyle: 'italic' }}>Timeframe: {step.timeFrame}</Text>
          </View>
        ))}
      </View>

      {/* Footer */}
      <Text style={styles.footer}>
        InboxShield Mini Professional Report | Generated on {new Date().toLocaleDateString()} | 
        Support: hello@inboxshield-mini.com | Report ID: {reportData.reportId}
      </Text>
    </Page>
  </Document>
);