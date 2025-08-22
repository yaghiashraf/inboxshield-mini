import { Handler } from '@netlify/functions';
import { checkDomain } from '../../src/lib/checkers';
import { DomainCheckResult } from '../../src/types';

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
    const { domain, paymentVerified = false } = JSON.parse(event.body || '{}');

    if (!domain) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Domain is required' }),
      };
    }

    console.log(`Generating full report for domain: ${domain}`);

    // Run comprehensive domain check
    const analysisResult = await checkDomain(domain, false); // Full analysis, not preview

    // Generate detailed DNS fixes
    const dnsfixes = generateDNSFixes(analysisResult);
    
    // Create comprehensive report data
    const fullReport = {
      ...analysisResult,
      timestamp: new Date().toISOString(),
      reportId: `report_${domain.replace(/[^a-z0-9]/g, '_')}_${Date.now()}`,
      dnsFixesGenerated: dnsFixesGenerated(analysisResult),
      recommendations: generateRecommendations(analysisResult),
      providerInstructions: generateProviderInstructions(analysisResult),
      verificationSteps: generateVerificationSteps(analysisResult),
      businessImpact: calculateBusinessImpact(analysisResult),
      paymentVerified,
    };

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        reportData: fullReport,
        message: 'Full report generated successfully'
      }),
    };
  } catch (error) {
    console.error('Error generating full report:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: 'Failed to generate report',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};

function generateDNSFixes(result: DomainCheckResult) {
  const fixes: Record<string, string> = {};
  
  // SPF Record Fix
  if (result.spf.status !== 'pass') {
    fixes.spf = generateSPFFix(result.domain);
  }
  
  // DMARC Record Fix
  if (result.dmarc.status !== 'pass') {
    fixes.dmarc = generateDMARCFix(result.domain);
  }
  
  // DKIM Setup Instructions
  if (result.dkim.status !== 'pass') {
    fixes.dkim = generateDKIMFix(result.domain);
  }
  
  // BIMI Record (if not present)
  if (result.bimi.status !== 'pass') {
    fixes.bimi = generateBIMIFix(result.domain);
  }
  
  // MTA-STS Record
  if (result.mtaSts.status !== 'pass') {
    fixes.mtaSts = generateMTASTSFix(result.domain);
  }
  
  return fixes;
}

function dnsFixesGenerated(result: DomainCheckResult) {
  const fixes = [];
  
  if (result.spf.status !== 'pass') {
    fixes.push({
      type: 'SPF',
      record: generateSPFFix(result.domain),
      recordType: 'TXT',
      name: '@',
      priority: 'HIGH',
      description: 'Authorizes mail servers to send emails on behalf of your domain'
    });
  }
  
  if (result.dmarc.status !== 'pass') {
    fixes.push({
      type: 'DMARC',
      record: generateDMARCFix(result.domain),
      recordType: 'TXT',
      name: '_dmarc',
      priority: 'HIGH',
      description: 'Protects against domain spoofing and provides email authentication policy'
    });
  }
  
  if (result.dkim.status !== 'pass') {
    fixes.push({
      type: 'DKIM',
      record: 'Setup required through your email provider',
      recordType: 'TXT',
      name: 'default._domainkey',
      priority: 'HIGH',
      description: 'Digital signature that proves email authenticity'
    });
  }
  
  if (result.bimi.status !== 'pass') {
    fixes.push({
      type: 'BIMI',
      record: generateBIMIFix(result.domain),
      recordType: 'TXT',
      name: 'default._bimi',
      priority: 'MEDIUM',
      description: 'Displays your company logo in supported email clients'
    });
  }
  
  if (result.mtaSts.status !== 'pass') {
    fixes.push({
      type: 'MTA-STS',
      record: generateMTASTSFix(result.domain),
      recordType: 'TXT',
      name: '_mta-sts',
      priority: 'MEDIUM',
      description: 'Enforces secure email transport and prevents downgrade attacks'
    });
  }
  
  return fixes;
}

function generateSPFFix(domain: string): string {
  return 'v=spf1 include:_spf.google.com include:spf.mailchimpapp.com ~all';
}

function generateDMARCFix(domain: string): string {
  return `v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@${domain}; ruf=mailto:dmarc-failures@${domain}; fo=1`;
}

function generateDKIMFix(domain: string): string {
  return 'Contact your email provider (Gmail, Outlook, etc.) to enable DKIM signing for your domain';
}

function generateBIMIFix(domain: string): string {
  return `v=BIMI1; l=https://${domain}/logo.svg; a=`;
}

function generateMTASTSFix(domain: string): string {
  return 'v=STSv1; id=1';
}

function generateRecommendations(result: DomainCheckResult) {
  const recommendations = [];
  
  if (result.spf.status !== 'pass') {
    recommendations.push({
      priority: 'HIGH',
      title: 'Implement SPF Record',
      description: 'Add an SPF record to authorize which servers can send emails for your domain',
      impact: 'Prevents emails from being marked as spam',
      timeToImplement: '5 minutes'
    });
  }
  
  if (result.dmarc.status !== 'pass') {
    recommendations.push({
      priority: 'HIGH',
      title: 'Configure DMARC Policy',
      description: 'Set up DMARC to protect against domain spoofing and get visibility into email usage',
      impact: 'Protects brand reputation and improves deliverability',
      timeToImplement: '10 minutes'
    });
  }
  
  if (result.dkim.status !== 'pass') {
    recommendations.push({
      priority: 'HIGH',
      title: 'Enable DKIM Signing',
      description: 'Configure DKIM through your email provider to digitally sign outgoing emails',
      impact: 'Proves email authenticity and improves inbox placement',
      timeToImplement: '15 minutes'
    });
  }
  
  return recommendations;
}

function generateProviderInstructions(result: DomainCheckResult) {
  return {
    // DNS Providers
    godaddy: {
      name: 'GoDaddy DNS',
      steps: [
        '1. Log into your GoDaddy account',
        '2. Go to Domain Manager',
        '3. Click DNS next to your domain',
        '4. Add new TXT records with the values provided',
        '5. Save changes and wait 24-48 hours for propagation'
      ]
    },
    cloudflare: {
      name: 'Cloudflare DNS',
      steps: [
        '1. Log into Cloudflare dashboard',
        '2. Select your domain',
        '3. Go to DNS tab',
        '4. Add new TXT records',
        '5. Click Save and changes will propagate within minutes'
      ]
    },
    namecheap: {
      name: 'Namecheap DNS',
      steps: [
        '1. Log into Namecheap account',
        '2. Go to Domain List',
        '3. Click Manage next to your domain',
        '4. Go to Advanced DNS tab',
        '5. Add new TXT records with provided values'
      ]
    },
    // Email Service Providers - DKIM Setup
    googleWorkspace: {
      name: 'Google Workspace DKIM',
      steps: [
        '1. Sign in to Google Admin Console',
        '2. Go to Apps > Gmail > Authenticate email',
        '3. Select your domain and click "Generate new record"',
        '4. Copy the DNS record and add it to your DNS provider',
        '5. Return to Google Admin and click "Start authentication"'
      ]
    },
    microsoft365: {
      name: 'Microsoft 365 DKIM',
      steps: [
        '1. Sign in to Microsoft 365 admin center',
        '2. Go to Exchange admin center',
        '3. Navigate to Protection > DKIM',
        '4. Select your domain and click "Enable"',
        '5. Add the provided CNAME records to your DNS'
      ]
    },
    sendgrid: {
      name: 'SendGrid Authentication',
      steps: [
        '1. Log into SendGrid dashboard',
        '2. Go to Settings > Sender Authentication',
        '3. Click "Authenticate Your Domain"',
        '4. Enter your domain and select DNS provider',
        '5. Add all provided DNS records (SPF, DKIM, CNAME)'
      ]
    },
    mailgun: {
      name: 'Mailgun Domain Setup',
      steps: [
        '1. Log into Mailgun dashboard',
        '2. Go to Domains section',
        '3. Click "Add New Domain"',
        '4. Follow the domain verification process',
        '5. Add all DNS records provided by Mailgun'
      ]
    },
    mailchimp: {
      name: 'Mailchimp Domain Authentication',
      steps: [
        '1. Log into Mailchimp account',
        '2. Go to Account > Settings > Domains',
        '3. Click "Authenticate a Domain"',
        '4. Enter your domain and verify ownership',
        '5. Add the DKIM DNS records to your domain'
      ]
    },
    hubspot: {
      name: 'HubSpot Email Authentication',
      steps: [
        '1. In HubSpot, go to Settings > Marketing > Email',
        '2. Click "Connect a domain"',
        '3. Enter your domain and click "Connect"',
        '4. Add the provided DNS records to your domain',
        '5. Return to HubSpot and verify the connection'
      ]
    },
    constantcontact: {
      name: 'Constant Contact Authentication',
      steps: [
        '1. Log into Constant Contact',
        '2. Go to Account Settings',
        '3. Click on "Email Authentication"',
        '4. Follow the domain setup wizard',
        '5. Add DNS records and verify authentication'
      ]
    },
    activecampaign: {
      name: 'ActiveCampaign Domain Setup',
      steps: [
        '1. In ActiveCampaign, go to Settings',
        '2. Click "Advanced" then "Domain Authentication"',
        '3. Enter your domain information',
        '4. Add the provided DNS records',
        '5. Complete the verification process'
      ]
    }
  };
}

function generateVerificationSteps(result: DomainCheckResult) {
  return [
    {
      step: 1,
      title: 'Wait for DNS Propagation',
      description: 'DNS changes can take 24-48 hours to fully propagate worldwide',
      timeFrame: '24-48 hours'
    },
    {
      step: 2,
      title: 'Test Your Records',
      description: 'Use online tools like MXToolbox or dig commands to verify your new DNS records',
      timeFrame: '5 minutes'
    },
    {
      step: 3,
      title: 'Send Test Emails',
      description: 'Send emails to Gmail, Outlook, and Yahoo to test deliverability improvements',
      timeFrame: '10 minutes'
    },
    {
      step: 4,
      title: 'Monitor Results',
      description: 'Check your email analytics for improved delivery rates over the next week',
      timeFrame: '1 week'
    }
  ];
}

function calculateBusinessImpact(result: DomainCheckResult) {
  const criticalIssues = [result.spf, result.dmarc, result.dkim].filter(item => item.status === 'fail').length;
  
  let impactLevel = 'LOW';
  let deliverabilityEstimate = '85-95%';
  
  if (criticalIssues >= 2) {
    impactLevel = 'HIGH';
    deliverabilityEstimate = '30-50%';
  } else if (criticalIssues === 1) {
    impactLevel = 'MEDIUM';
    deliverabilityEstimate = '60-75%';
  }
  
  return {
    currentImpactLevel: impactLevel,
    estimatedDeliverabilityRate: deliverabilityEstimate,
    potentialImprovementRate: '95%+',
    criticalIssuesFound: criticalIssues,
    recommendedActionTimeframe: criticalIssues > 0 ? 'Within 24 hours' : 'At your convenience'
  };
}