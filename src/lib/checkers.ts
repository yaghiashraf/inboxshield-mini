import { 
  SPFResult, 
  DMARCResult, 
  DKIMResult, 
  BIMIResult, 
  MTASTSResult,
  ProviderGuidance,
  DomainCheckResult 
} from '@/types';
import { 
  lookupTxtRecords, 
  fetchHttpContent, 
  parseSPFRecord, 
  parseDMARCRecord,
  generateSPFFix,
  generateDMARCFix
} from './dns-utils';

export async function checkSPF(domain: string, isPreview: boolean = false): Promise<SPFResult> {
  // Always perform real DNS analysis - no more simulation

  const result = await lookupTxtRecords(domain);
  
  const spfRecord = result.records.find(record => 
    record.toLowerCase().startsWith('v=spf1')
  );

  if (!spfRecord) {
    return {
      status: 'fail',
      issues: ['No SPF record found for domain'],
      recommendations: [
        'Add an SPF record to authorize email senders',
        'Include your email service provider in the SPF record'
      ],
      suggestedRecord: generateSPFFix(domain)
    };
  }

  const parsed = parseSPFRecord(spfRecord);
  const issues: string[] = [];
  const recommendations: string[] = [];

  if (parsed.lookupCount > 10) {
    issues.push('SPF record exceeds 10 DNS lookup limit');
    recommendations.push('Flatten SPF record by replacing includes with IP addresses');
  }

  if (parsed.hasSoftFail && !parsed.hasHardFail) {
    issues.push('SPF uses soft fail (~all) instead of hard fail (-all)');
    recommendations.push('Change ~all to -all for stronger protection');
  }

  if (!parsed.hasHardFail && !parsed.hasSoftFail) {
    issues.push('SPF record missing fail policy (all mechanism)');
    recommendations.push('Add -all at the end of your SPF record');
  }

  const status = issues.length === 0 ? 'pass' : (issues.length <= 2 ? 'warn' : 'fail');

  return {
    status,
    record: spfRecord,
    issues,
    recommendations,
    dnsLookupCount: parsed.lookupCount,
    mechanisms: parsed.mechanisms,
    suggestedRecord: generateSPFFix(domain, spfRecord)
  };
}

export async function checkDMARC(domain: string, isPreview: boolean = false): Promise<DMARCResult> {
  // Always perform real DNS analysis - no more simulation

  const result = await lookupTxtRecords(`_dmarc.${domain}`);
  
  const dmarcRecord = result.records.find(record => 
    record.toLowerCase().startsWith('v=dmarc1')
  );

  if (!dmarcRecord) {
    return {
      status: 'fail',
      issues: ['No DMARC record found for domain'],
      recommendations: [
        'Add a DMARC record to protect against email spoofing',
        'Start with p=none for monitoring, then move to p=quarantine or p=reject'
      ],
      suggestedRecord: generateDMARCFix(domain)
    };
  }

  const parsed = parseDMARCRecord(dmarcRecord);
  const issues: string[] = [];
  const recommendations: string[] = [];

  if (parsed.policy === 'none') {
    issues.push('DMARC policy is set to none (monitoring only)');
    recommendations.push('Upgrade to p=quarantine or p=reject for active protection');
  }

  if (parsed.reportingAddresses.length === 0) {
    issues.push('No DMARC reporting addresses configured');
    recommendations.push('Add rua and ruf tags for DMARC reports');
  }

  const status = issues.length === 0 ? 'pass' : (parsed.policy === 'none' ? 'warn' : 'fail');

  return {
    status,
    record: dmarcRecord,
    policy: parsed.policy,
    issues,
    recommendations,
    suggestedRecord: generateDMARCFix(domain, dmarcRecord)
  };
}

export async function checkDKIM(domain: string, isPreview: boolean = false): Promise<DKIMResult> {
  const commonSelectors = [
    'default',
    'google',
    'gmail',
    'k1',
    'dkim',
    'selector1',
    'selector2',
    'mail',
    'email'
  ];

  const providerGuidance: ProviderGuidance[] = [
    {
      provider: 'Google Workspace',
      commonSelectors: ['google', 'gmail'],
      setupInstructions: 'Admin Console > Apps > Gmail > Authenticate Email'
    },
    {
      provider: 'Microsoft 365',
      commonSelectors: ['selector1', 'selector2'],
      setupInstructions: 'Microsoft 365 Admin Center > Exchange > Mail Flow > Rules'
    },
    {
      provider: 'SendGrid',
      commonSelectors: ['s1', 's2'],
      setupInstructions: 'SendGrid Dashboard > Settings > Sender Authentication'
    }
  ];

  const validatedSelectors: string[] = [];
  
  // Always perform real DKIM analysis - no more simulation

  // Check common DKIM selectors
  for (const selector of commonSelectors) {
    try {
      const result = await lookupTxtRecords(`${selector}._domainkey.${domain}`);
      if (result.records.some(record => record.includes('k=rsa') || record.includes('p='))) {
        validatedSelectors.push(selector);
      }
    } catch {
      // Selector not found, continue
    }
  }

  const issues: string[] = [];
  const recommendations: string[] = [];

  if (validatedSelectors.length === 0) {
    issues.push('No DKIM records found for common selectors');
    recommendations.push('Set up DKIM signing with your email service provider');
    recommendations.push('Check your email provider\'s documentation for DKIM setup');
  }

  const status = validatedSelectors.length > 0 ? 'pass' : 'fail';

  return {
    status,
    commonSelectors,
    validatedSelectors,
    issues,
    recommendations,
    providerGuidance
  };
}

export async function checkBIMI(domain: string, isPreview: boolean = false): Promise<BIMIResult> {
  const result = await lookupTxtRecords(`default._bimi.${domain}`);
  
  const bimiRecord = result.records.find(record => 
    record.toLowerCase().startsWith('v=bimi1')
  );

  if (!bimiRecord) {
    return {
      status: 'warn',
      issues: ['No BIMI record found (optional for brand logos)'],
      recommendations: [
        'BIMI is optional but helps display your logo in supported email clients',
        'Requires DMARC with p=quarantine or p=reject policy'
      ]
    };
  }

  const issues: string[] = [];
  const recommendations: string[] = [];

  // Parse BIMI record for logo URL
  const logoUrlMatch = bimiRecord.match(/l=([^;]+)/);
  const logoUrl = logoUrlMatch ? logoUrlMatch[1].trim() : undefined;

  if (logoUrl) {
    // Validate logo URL
    const logoResponse = await fetchHttpContent(logoUrl);
    if (logoResponse.error) {
      issues.push('BIMI logo URL is not accessible');
      recommendations.push('Ensure your logo URL is publicly accessible via HTTPS');
    }
  }

  const status = issues.length === 0 ? 'pass' : 'warn';

  return {
    status,
    record: bimiRecord,
    logoUrl: logoUrl,
    issues,
    recommendations
  };
}

export async function checkMTASTS(domain: string, isPreview: boolean = false): Promise<MTASTSResult> {
  const result = await lookupTxtRecords(`_mta-sts.${domain}`);
  
  const mtaStsRecord = result.records.find(record => 
    record.toLowerCase().startsWith('v=sts1')
  );

  if (!mtaStsRecord) {
    return {
      status: 'warn',
      issues: ['No MTA-STS record found (optional security enhancement)'],
      recommendations: [
        'MTA-STS is optional but provides additional email security',
        'Requires hosting a policy file at https://mta-sts.yourdomain.com/.well-known/mta-sts.txt'
      ]
    };
  }

  const issues: string[] = [];
  const recommendations: string[] = [];

  // Try to fetch the MTA-STS policy file
  const policyUrl = `https://mta-sts.${domain}/.well-known/mta-sts.txt`;
  const policyResponse = await fetchHttpContent(policyUrl);
  
  if (policyResponse.error) {
    issues.push('MTA-STS policy file is not accessible');
    recommendations.push('Host your MTA-STS policy file at the required location');
  } else {
    // Basic policy validation
    if (!policyResponse.content.includes('version: STSv1')) {
      issues.push('MTA-STS policy file format is invalid');
      recommendations.push('Ensure your policy file follows the correct format');
    }
  }

  const status = issues.length === 0 ? 'pass' : 'warn';

  return {
    status,
    record: mtaStsRecord,
    policyContent: policyResponse.error ? undefined : policyResponse.content,
    issues,
    recommendations
  };
}

// Main function to check all email authentication protocols for a domain
export async function checkDomain(domain: string, isPreview: boolean = false): Promise<DomainCheckResult> {
  try {
    // Run all checks in parallel
    const [spf, dmarc, dkim, bimi, mtaSts] = await Promise.all([
      checkSPF(domain, isPreview),
      checkDMARC(domain, isPreview),
      checkDKIM(domain, isPreview),
      checkBIMI(domain, isPreview),
      checkMTASTS(domain, isPreview)
    ]);

    // Calculate overall security score
    let score = 0;
    const weights = { spf: 30, dmarc: 30, dkim: 25, bimi: 10, mtaSts: 5 };

    if (spf.status === 'pass') score += weights.spf;
    else if (spf.status === 'warn') score += weights.spf * 0.5;

    if (dmarc.status === 'pass') score += weights.dmarc;
    else if (dmarc.status === 'warn') score += weights.dmarc * 0.5;

    if (dkim.status === 'pass') score += weights.dkim;
    else if (dkim.status === 'warn') score += weights.dkim * 0.5;

    if (bimi.status === 'pass') score += weights.bimi;
    else if (bimi.status === 'warn') score += weights.bimi * 0.5;

    if (mtaSts.status === 'pass') score += weights.mtaSts;
    else if (mtaSts.status === 'warn') score += weights.mtaSts * 0.5;

    const overallScore = Math.round(score);

    return {
      domain,
      overallScore,
      spf,
      dmarc,
      dkim,
      bimi,
      mtaSts,
      timestamp: new Date().toISOString(),
      isPreview
    };

  } catch (error) {
    console.error(`Error checking domain ${domain}:`, error);
    throw new Error(`Failed to analyze domain: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}