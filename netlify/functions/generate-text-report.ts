import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { reportData } = JSON.parse(event.body || '{}');

    if (!reportData) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Report data is required' }),
      };
    }

    console.log(`Generating text report for domain: ${reportData.domain}`);

    // Generate text report
    const textReport = generateTextReport(reportData);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/plain',
        'Content-Disposition': `attachment; filename="inboxshield-${reportData.domain}-report.txt"`,
      },
      body: textReport,
    };
  } catch (error) {
    console.error('Error generating text report:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: 'Failed to generate text report',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};

function generateTextReport(reportData: any): string {
  const lines = [
    '==================================================',
    '🛡️  INBOXSHIELD MINI - EMAIL SECURITY REPORT',
    '==================================================',
    '',
    `Domain: ${reportData.domain}`,
    `Report ID: ${reportData.reportId || 'N/A'}`,
    `Generated: ${new Date(reportData.timestamp).toLocaleString()}`,
    `Security Score: ${reportData.overallScore}/100`,
    '',
    '==================================================',
    '📊 BUSINESS IMPACT ANALYSIS',
    '==================================================',
    '',
    `Current Impact Level: ${reportData.businessImpact?.currentImpactLevel || 'UNKNOWN'}`,
    `Estimated Deliverability: ${reportData.businessImpact?.estimatedDeliverabilityRate || 'Unknown'}`,
    `Critical Issues Found: ${reportData.businessImpact?.criticalIssuesFound || 0}`,
    `Potential Improvement: ${reportData.businessImpact?.potentialImprovementRate || '95%+'}`,
    `Action Timeframe: ${reportData.businessImpact?.recommendedActionTimeframe || 'ASAP'}`,
    '',
    '==================================================',
    '🔧 DNS RECORD FIXES (COPY-PASTE READY)',
    '==================================================',
    ''
  ];

  // Add DNS fixes
  if (reportData.dnsFixesGenerated && reportData.dnsFixesGenerated.length > 0) {
    reportData.dnsFixesGenerated.forEach((fix: any, index: number) => {
      lines.push(`${index + 1}. ${fix.type} RECORD (${fix.priority} PRIORITY)`);
      lines.push(`   Description: ${fix.description}`);
      lines.push(`   Record Type: ${fix.recordType}`);
      lines.push(`   Name/Host: ${fix.name}`);
      lines.push(`   Value: ${fix.record}`);
      lines.push('');
    });
  } else {
    lines.push('No DNS fixes available - contact support');
    lines.push('');
  }

  // Add provider instructions
  lines.push('==================================================');
  lines.push('⚙️  PROVIDER SETUP INSTRUCTIONS');
  lines.push('==================================================');
  lines.push('');

  if (reportData.providerInstructions) {
    // GoDaddy
    lines.push('--- GODADDY SETUP ---');
    if (reportData.providerInstructions.godaddy?.steps) {
      reportData.providerInstructions.godaddy.steps.forEach((step: string) => {
        lines.push(step);
      });
    }
    lines.push('');

    // Cloudflare
    lines.push('--- CLOUDFLARE SETUP ---');
    if (reportData.providerInstructions.cloudflare?.steps) {
      reportData.providerInstructions.cloudflare.steps.forEach((step: string) => {
        lines.push(step);
      });
    }
    lines.push('');

    // Namecheap
    lines.push('--- NAMECHEAP SETUP ---');
    if (reportData.providerInstructions.namecheap?.steps) {
      reportData.providerInstructions.namecheap.steps.forEach((step: string) => {
        lines.push(step);
      });
    }
    lines.push('');
  } else {
    lines.push('Provider-specific instructions not available.');
    lines.push('Please refer to the DNS fixes section above for exact records to add.');
    lines.push('');
  }

  // Add recommendations
  lines.push('==================================================');
  lines.push('💡 PRIORITY RECOMMENDATIONS');
  lines.push('==================================================');
  lines.push('');

  if (reportData.recommendations && reportData.recommendations.length > 0) {
    reportData.recommendations.forEach((rec: any, index: number) => {
      lines.push(`${index + 1}. ${rec.title} (${rec.priority} PRIORITY)`);
      lines.push(`   ${rec.description}`);
      lines.push(`   Impact: ${rec.impact}`);
      lines.push(`   Time to implement: ${rec.timeToImplement}`);
      lines.push('');
    });
  } else {
    lines.push('No specific recommendations available');
    lines.push('');
  }

  // Add verification steps
  lines.push('==================================================');
  lines.push('✅ VERIFICATION & TESTING');
  lines.push('==================================================');
  lines.push('');

  if (reportData.verificationSteps && reportData.verificationSteps.length > 0) {
    reportData.verificationSteps.forEach((step: any) => {
      lines.push(`Step ${step.step}: ${step.title}`);
      lines.push(`${step.description}`);
      lines.push(`Timeframe: ${step.timeFrame}`);
      lines.push('');
    });
  } else {
    lines.push('1. Wait 24 hours for DNS propagation');
    lines.push('2. Test email authentication');
    lines.push('3. Monitor DMARC reports');
    lines.push('');
  }

  // Footer
  lines.push('==================================================');
  lines.push('InboxShield Mini Professional Report');
  lines.push(`Generated on ${new Date().toLocaleDateString()}`);
  lines.push('Support: hello@inboxshield-mini.com');
  lines.push(`Report ID: ${reportData.reportId || 'N/A'}`);
  lines.push('==================================================');

  return lines.join('\n');
}