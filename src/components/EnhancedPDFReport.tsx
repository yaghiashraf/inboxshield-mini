import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

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
    textAlign: 'center',
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
  dnsFixBox: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    marginBottom: 10,
    borderRadius: 5,
    borderLeft: '4px solid #3B82F6',
  },
  dnsRecord: {
    fontFamily: 'Courier',
    fontSize: 10,
    color: '#374151',
    marginTop: 5,
    backgroundColor: '#E5E7EB',
    padding: 8,
    borderRadius: 3,
  },
  priorityHigh: {
    color: '#DC2626',
    fontWeight: 'bold',
  },
  priorityMedium: {
    color: '#D97706',
    fontWeight: 'bold',
  },
  recommendationItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#F0F9FF',
    borderRadius: 5,
    borderLeft: '3px solid #3B82F6',
  },
  providerSection: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#F9FAFB',
    borderRadius: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
    color: '#9CA3AF',
    borderTop: '1px solid #E5E7EB',
    paddingTop: 10,
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
    default: return { color: '#059669' };
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
          Security Score: {reportData.overallScore}/100
        </Text>
        <Text style={{ fontSize: 12, marginTop: 5, color: '#6B7280' }}>
          {reportData.businessImpact?.currentImpactLevel === 'HIGH' && 'CRITICAL: Immediate action required'}
          {reportData.businessImpact?.currentImpactLevel === 'MEDIUM' && 'MODERATE: Action recommended within 24 hours'}
          {reportData.businessImpact?.currentImpactLevel === 'LOW' && 'GOOD: Minor improvements available'}
        </Text>
      </View>

      {/* Business Impact */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Business Impact Analysis</Text>
        <View style={{ padding: 10, backgroundColor: '#FEF3C7', borderRadius: 5, borderLeft: '4px solid #F59E0B' }}>
          <Text style={{ fontSize: 12, marginBottom: 5, fontWeight: 'bold' }}>Current Email Deliverability:</Text>
          <Text style={{ fontSize: 10, marginBottom: 3 }}>
            - Estimated inbox delivery rate: {reportData.businessImpact?.estimatedDeliverabilityRate || 'Unknown'}
          </Text>
          <Text style={{ fontSize: 10, marginBottom: 3 }}>
            - Critical issues found: {reportData.businessImpact?.criticalIssuesFound || 0}
          </Text>
          <Text style={{ fontSize: 10, marginBottom: 3 }}>
            - Potential improvement: {reportData.businessImpact?.potentialImprovementRate || '95%+'}
          </Text>
          <Text style={{ fontSize: 10 }}>
            - Recommended action timeframe: {reportData.businessImpact?.recommendedActionTimeframe || 'Within 24 hours'}
          </Text>
        </View>
      </View>

      {/* DNS Fixes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DNS Record Fixes (Copy-Paste Ready)</Text>
        {reportData.dnsFixesGenerated?.map((fix: any, index: number) => (
          <View key={index} style={styles.dnsFixBox}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
              <Text style={{ fontSize: 12, fontWeight: 'bold', marginRight: 10 }}>{fix.type}</Text>
              <Text style={[{ fontSize: 10 }, getPriorityStyle(fix.priority)]}>
                {fix.priority} PRIORITY
              </Text>
            </View>
            <Text style={{ fontSize: 10, color: '#6B7280', marginBottom: 5 }}>{fix.description}</Text>
            <Text style={{ fontSize: 10, marginBottom: 3 }}>Record Type: {fix.recordType}</Text>
            <Text style={{ fontSize: 10, marginBottom: 3 }}>Name/Host: {fix.name}</Text>
            <Text style={{ fontSize: 10, marginBottom: 5 }}>Value:</Text>
            <Text style={styles.dnsRecord}>{fix.record}</Text>
          </View>
        ))}
      </View>

      {/* Provider Setup Instructions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DNS Provider Setup Instructions</Text>
        
        <View style={styles.providerSection}>
          <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 5 }}>GoDaddy Setup:</Text>
          {reportData.providerInstructions?.godaddy?.steps?.map((step: string, index: number) => (
            <Text key={index} style={{ fontSize: 10, marginBottom: 2 }}>{step}</Text>
          ))}
        </View>

        <View style={styles.providerSection}>
          <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 5 }}>Cloudflare Setup:</Text>
          {reportData.providerInstructions?.cloudflare?.steps?.map((step: string, index: number) => (
            <Text key={index} style={{ fontSize: 10, marginBottom: 2 }}>{step}</Text>
          ))}
        </View>

        <View style={styles.providerSection}>
          <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 5 }}>Namecheap Setup:</Text>
          {reportData.providerInstructions?.namecheap?.steps?.map((step: string, index: number) => (
            <Text key={index} style={{ fontSize: 10, marginBottom: 2 }}>{step}</Text>
          ))}
        </View>

        <View style={styles.providerSection}>
          <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 5 }}>Amazon Route 53 Setup:</Text>
          {reportData.providerInstructions?.route53?.steps?.map((step: string, index: number) => (
            <Text key={index} style={{ fontSize: 10, marginBottom: 2 }}>{step}</Text>
          ))}
        </View>

        <View style={styles.providerSection}>
          <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 5 }}>DigitalOcean Setup:</Text>
          {reportData.providerInstructions?.digitalocean?.steps?.map((step: string, index: number) => (
            <Text key={index} style={{ fontSize: 10, marginBottom: 2 }}>{step}</Text>
          ))}
        </View>

        <View style={styles.providerSection}>
          <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 5 }}>Hover Setup:</Text>
          {reportData.providerInstructions?.hover?.steps?.map((step: string, index: number) => (
            <Text key={index} style={{ fontSize: 10, marginBottom: 2 }}>{step}</Text>
          ))}
        </View>

        <View style={styles.providerSection}>
          <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 5 }}>Network Solutions Setup:</Text>
          {reportData.providerInstructions?.networksolutions?.steps?.map((step: string, index: number) => (
            <Text key={index} style={{ fontSize: 10, marginBottom: 2 }}>{step}</Text>
          ))}
        </View>

        <View style={styles.providerSection}>
          <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 5 }}>Bluehost Setup:</Text>
          {reportData.providerInstructions?.bluehost?.steps?.map((step: string, index: number) => (
            <Text key={index} style={{ fontSize: 10, marginBottom: 2 }}>{step}</Text>
          ))}
        </View>

        <View style={styles.providerSection}>
          <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 5 }}>HostGator Setup:</Text>
          {reportData.providerInstructions?.hostgator?.steps?.map((step: string, index: number) => (
            <Text key={index} style={{ fontSize: 10, marginBottom: 2 }}>{step}</Text>
          ))}
        </View>

        <View style={styles.providerSection}>
          <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 5 }}>SiteGround Setup:</Text>
          {reportData.providerInstructions?.siteground?.steps?.map((step: string, index: number) => (
            <Text key={index} style={{ fontSize: 10, marginBottom: 2 }}>{step}</Text>
          ))}
        </View>

        <View style={styles.providerSection}>
          <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 5 }}>1&1 IONOS Setup:</Text>
          {reportData.providerInstructions?.['1and1']?.steps?.map((step: string, index: number) => (
            <Text key={index} style={{ fontSize: 10, marginBottom: 2 }}>{step}</Text>
          ))}
        </View>
      </View>

      {/* Email Provider Setup Instructions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Email Provider Setup Instructions</Text>
        
        <View style={styles.providerSection}>
          <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 5 }}>Google Workspace Setup:</Text>
          <Text style={{ fontSize: 10, marginBottom: 2 }}>1. Sign in to your Google Admin console (admin.google.com)</Text>
          <Text style={{ fontSize: 10, marginBottom: 2 }}>2. Go to Apps > Google Workspace > Gmail</Text>
          <Text style={{ fontSize: 10, marginBottom: 2 }}>3. Click "Authenticate email" and then "Advanced settings"</Text>
          <Text style={{ fontSize: 10, marginBottom: 2 }}>4. Scroll down to "Email authentication"</Text>
          <Text style={{ fontSize: 10, marginBottom: 2 }}>5. For SPF: Click "Set up email authentication" and follow the wizard</Text>
          <Text style={{ fontSize: 10, marginBottom: 2 }}>6. For DKIM: Go to "Generate new record" and add the provided TXT record to your DNS</Text>
          <Text style={{ fontSize: 10, marginBottom: 2 }}>7. For DMARC: Create a TXT record at _dmarc.yourdomain.com with the value from your DNS fixes</Text>
          <Text style={{ fontSize: 10, marginBottom: 2 }}>8. Wait 24-48 hours for changes to propagate</Text>
          <Text style={{ fontSize: 10, marginBottom: 2 }}>9. Verify setup using Gmail's email authentication checker</Text>
        </View>

        <View style={styles.providerSection}>
          <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 5 }}>Microsoft 365/Outlook Setup:</Text>
          <Text style={{ fontSize: 10, marginBottom: 2 }}>1. Sign in to Microsoft 365 Admin Center (admin.microsoft.com)</Text>
          <Text style={{ fontSize: 10, marginBottom: 2 }}>2. Go to Settings > Domains and select your domain</Text>
          <Text style={{ fontSize: 10, marginBottom: 2 }}>3. Click "DNS records" tab</Text>
          <Text style={{ fontSize: 10, marginBottom: 2 }}>4. For SPF: Microsoft usually auto-configures, but verify the TXT record exists</Text>
          <Text style={{ fontSize: 10, marginBottom: 2 }}>5. For DKIM: Go to Security > Email & collaboration > Exchange</Text>
          <Text style={{ fontSize: 10, marginBottom: 2 }}>6. Under "Protection" go to "DKIM" and enable it for your domain</Text>
          <Text style={{ fontSize: 10, marginBottom: 2 }}>7. Copy the CNAME records provided and add them to your DNS</Text>
          <Text style={{ fontSize: 10, marginBottom: 2 }}>8. For DMARC: Add the TXT record from your DNS fixes to _dmarc.yourdomain.com</Text>
          <Text style={{ fontSize: 10, marginBottom: 2 }}>9. Use Microsoft's Message Analyzer to verify your setup</Text>
        </View>

        <View style={styles.providerSection}>
          <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 5 }}>General Email Provider Notes:</Text>
          <Text style={{ fontSize: 10, marginBottom: 2 }}>- Always add DNS records through your domain registrar or DNS hosting provider</Text>
          <Text style={{ fontSize: 10, marginBottom: 2 }}>- Changes can take 24-72 hours to fully propagate across the internet</Text>
          <Text style={{ fontSize: 10, marginBottom: 2 }}>- Test your setup using tools like MXToolbox, DMARC Analyzer, or Mail-Tester</Text>
          <Text style={{ fontSize: 10, marginBottom: 2 }}>- Start with a relaxed DMARC policy (p=none) and gradually tighten to p=quarantine or p=reject</Text>
          <Text style={{ fontSize: 10, marginBottom: 2 }}>- Monitor DMARC reports to ensure legitimate emails aren't being blocked</Text>
        </View>
      </View>

      {/* Recommendations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💡 Priority Recommendations</Text>
        {reportData.recommendations?.map((rec: any, index: number) => (
          <View key={index} style={styles.recommendationItem}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 3 }}>
              <Text style={[{ fontSize: 11, fontWeight: 'bold', marginRight: 10 }, getPriorityStyle(rec.priority)]}>
                {rec.priority}
              </Text>
              <Text style={{ fontSize: 11, fontWeight: 'bold' }}>{rec.title}</Text>
            </View>
            <Text style={{ fontSize: 10, marginBottom: 3 }}>{rec.description}</Text>
            <Text style={{ fontSize: 10, color: '#059669' }}>Impact: {rec.impact}</Text>
            <Text style={{ fontSize: 10, color: '#6B7280' }}>Time to implement: {rec.timeToImplement}</Text>
          </View>
        ))}
      </View>

      {/* Verification Steps */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>✅ Verification & Testing</Text>
        {reportData.verificationSteps?.map((step: any, index: number) => (
          <View key={index} style={{ marginBottom: 10 }}>
            <Text style={{ fontSize: 11, fontWeight: 'bold', marginBottom: 3 }}>
              Step {step.step}: {step.title}
            </Text>
            <Text style={{ fontSize: 10, marginBottom: 2 }}>{step.description}</Text>
            <Text style={{ fontSize: 9, color: '#6B7280' }}>Timeframe: {step.timeFrame}</Text>
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