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
    '========================================================',
    '          INBOXSHIELD MINI - EMAIL SECURITY REPORT',
    '========================================================',
    '',
    `Domain: ${reportData.domain}`,
    `Report ID: ${reportData.reportId || 'N/A'}`,
    `Generated: ${new Date(reportData.timestamp).toLocaleString()}`,
    `Security Score: ${reportData.overallScore}/100`,
    '',
    // Add score interpretation
    `Status: ${reportData.overallScore >= 80 ? 'EXCELLENT - Minor improvements available' :
              reportData.overallScore >= 60 ? 'MODERATE - Action recommended within 24 hours' :
              'CRITICAL - Immediate action required'}`,
    '',
    '========================================================',
    '                BUSINESS IMPACT ANALYSIS',
    '========================================================',
    '',
    `Current Impact Level: ${reportData.businessImpact?.currentImpactLevel || 'MEDIUM'}`,
    `Estimated Deliverability: ${reportData.businessImpact?.estimatedDeliverabilityRate || '70-85%'}`,
    `Critical Issues Found: ${reportData.businessImpact?.criticalIssuesFound || 1}`,
    `Potential Improvement: ${reportData.businessImpact?.potentialImprovementRate || '95%+'}`,
    `Action Timeframe: ${reportData.businessImpact?.recommendedActionTimeframe || 'Within 48 hours'}`,
    '',
    '========================================================',
    '            DNS RECORD FIXES (COPY-PASTE READY)',
    '========================================================',
    ''
  ];

  // Add DNS fixes
  if (reportData.dnsFixesGenerated && reportData.dnsFixesGenerated.length > 0) {
    reportData.dnsFixesGenerated.forEach((fix: any, index: number) => {
      lines.push(`${index + 1}. ${fix.type} RECORD - ${fix.priority} PRIORITY`);
      lines.push(`   Description: ${fix.description}`);
      lines.push(`   Record Type: ${fix.recordType}`);
      lines.push(`   Name/Host: ${fix.name}`);
      lines.push(`   Value (copy exactly): ${fix.record}`);
      lines.push('   -----------------------------------------------');
      lines.push('');
    });
  } else {
    lines.push('No DNS fixes available - contact support');
    lines.push('');
  }

  // Add provider instructions
  lines.push('========================================================');
  lines.push('            DNS PROVIDER SETUP INSTRUCTIONS');
  lines.push('========================================================');
  lines.push('');

  if (reportData.providerInstructions) {
    const providers = [
      { key: 'godaddy', name: 'GODADDY' },
      { key: 'cloudflare', name: 'CLOUDFLARE' },
      { key: 'namecheap', name: 'NAMECHEAP' },
      { key: 'route53', name: 'AMAZON ROUTE 53' },
      { key: 'digitalocean', name: 'DIGITALOCEAN' },
      { key: 'hover', name: 'HOVER' },
      { key: 'networksolutions', name: 'NETWORK SOLUTIONS' },
      { key: 'bluehost', name: 'BLUEHOST' },
      { key: 'hostgator', name: 'HOSTGATOR' },
      { key: 'siteground', name: 'SITEGROUND' },
      { key: '1and1', name: '1&1 IONOS' }
    ];

    providers.forEach(provider => {
      if (reportData.providerInstructions[provider.key]?.steps) {
        lines.push(`--- ${provider.name} SETUP ---`);
        reportData.providerInstructions[provider.key].steps.forEach((step: string) => {
          lines.push(step);
        });
        lines.push('');
      }
    });
  } else {
    lines.push('Provider-specific instructions not available.');
    lines.push('Please refer to the DNS fixes section above for exact records to add.');
    lines.push('');
  }

  // Add email provider instructions
  lines.push('========================================================');
  lines.push('          EMAIL PROVIDER SETUP INSTRUCTIONS');
  lines.push('========================================================');
  lines.push('');
  
  lines.push('--- GOOGLE WORKSPACE SETUP ---');
  lines.push('1. Sign in to your Google Admin console (admin.google.com)');
  lines.push('2. Go to Apps > Google Workspace > Gmail');
  lines.push('3. Click "Authenticate email" and then "Advanced settings"');
  lines.push('4. Scroll down to "Email authentication"');
  lines.push('5. For SPF: Click "Set up email authentication" and follow the wizard');
  lines.push('6. For DKIM: Go to "Generate new record" and add the provided TXT record to your DNS');
  lines.push('7. For DMARC: Create a TXT record at _dmarc.yourdomain.com with the value from your DNS fixes');
  lines.push('8. Wait 24-48 hours for changes to propagate');
  lines.push('9. Verify setup using Gmail\'s email authentication checker');
  lines.push('');

  lines.push('--- MICROSOFT 365/OUTLOOK SETUP ---');
  lines.push('1. Sign in to Microsoft 365 Admin Center (admin.microsoft.com)');
  lines.push('2. Go to Settings > Domains and select your domain');
  lines.push('3. Click "DNS records" tab');
  lines.push('4. For SPF: Microsoft usually auto-configures, but verify the TXT record exists');
  lines.push('5. For DKIM: Go to Security > Email & collaboration > Exchange');
  lines.push('6. Under "Protection" go to "DKIM" and enable it for your domain');
  lines.push('7. Copy the CNAME records provided and add them to your DNS');
  lines.push('8. For DMARC: Add the TXT record from your DNS fixes to _dmarc.yourdomain.com');
  lines.push('9. Use Microsoft\'s Message Analyzer to verify your setup');
  lines.push('');

  // Add recommendations
  lines.push('========================================================');
  lines.push('              PRIORITY RECOMMENDATIONS');
  lines.push('========================================================');
  lines.push('');

  if (reportData.recommendations && reportData.recommendations.length > 0) {
    reportData.recommendations.forEach((rec: any, index: number) => {
      lines.push(`${index + 1}. ${rec.title} - ${rec.priority} PRIORITY`);
      lines.push(`   Description: ${rec.description}`);
      lines.push(`   Impact: ${rec.impact}`);
      lines.push(`   Time to implement: ${rec.timeToImplement}`);
      lines.push('   -----------------------------------------------');
      lines.push('');
    });
  } else {
    lines.push('No specific recommendations available');
    lines.push('');
  }

  // Add verification steps
  lines.push('========================================================');
  lines.push('              VERIFICATION & TESTING');
  lines.push('========================================================');
  lines.push('');

  if (reportData.verificationSteps && reportData.verificationSteps.length > 0) {
    reportData.verificationSteps.forEach((step: any) => {
      lines.push(`Step ${step.step}: ${step.title}`);
      lines.push(`   ${step.description}`);
      lines.push(`   Timeframe: ${step.timeFrame}`);
      lines.push('   -----------------------------------------------');
      lines.push('');
    });
  } else {
    lines.push('Step 1: DNS Propagation Check');
    lines.push('   Wait 24 hours and verify DNS records have propagated using online tools');
    lines.push('   Timeframe: 24 hours');
    lines.push('   -----------------------------------------------');
    lines.push('');
    lines.push('Step 2: Email Authentication Test');
    lines.push('   Send test emails and check authentication headers');
    lines.push('   Timeframe: 1 hour after DNS propagation');
    lines.push('   -----------------------------------------------');
    lines.push('');
    lines.push('Step 3: Monitor Reports');
    lines.push('   Check DMARC aggregate reports to ensure proper alignment');
    lines.push('   Timeframe: 7 days ongoing');
    lines.push('   -----------------------------------------------');
    lines.push('');
  }

  // Footer
  lines.push('========================================================');
  lines.push('');
  lines.push('                InboxShield Mini Professional Report');
  lines.push(`                Generated on ${new Date().toLocaleDateString()}`);
  lines.push('                Support: hello@inboxshield-mini.com');
  lines.push(`                Report ID: ${reportData.reportId || 'N/A'}`);
  lines.push('');
  lines.push('========================================================');

  return lines.join('\n');
}