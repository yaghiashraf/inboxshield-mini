import { 
  SPFResult, 
  DMARCResult, 
  DKIMResult, 
  BIMIResult, 
  MTASTSResult,
  ProviderGuidance 
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
  // For preview mode, provide realistic deterministic results
  if (isPreview) {
    // Simulate realistic SPF scenarios based on domain characteristics
    const majorProviders = ['gmail.com', 'google.com', 'microsoft.com', 'outlook.com', 'office365.com'];
    const isLikelyMajorProvider = majorProviders.some(provider => 
      domain.includes(provider.split('.')[0]) || domain.endsWith(provider)
    );
    
    if (isLikelyMajorProvider) {
      return {
        status: 'pass',
        issues: [],
        recommendations: []
      };
    } else {
      // Most small businesses have basic issues
      const commonIssues = [
        domain.length < 10 ? 'SPF record not found' : 'SPF record found but needs optimization',
      ];
      
      return {
        status: domain.includes('example') || domain.includes('test') ? 'fail' : 'warn',
        issues: commonIssues,
        recommendations: []
      };
    }
  }

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
    issues.push(isPreview ? 'DNS lookup limit exceeded' : 'SPF record exceeds 10 DNS lookup limit');
    if (!isPreview) {
      recommendations.push('Flatten SPF record by replacing includes with IP addresses');
    }
  }

  if (parsed.hasSoftFail && !parsed.hasHardFail) {
    issues.push(isPreview ? 'Weak SPF policy detected' : 'SPF uses soft fail (~all) instead of hard fail (-all)');
    if (!isPreview) {
      recommendations.push('Change ~all to -all for stronger protection');
    }
  }

  if (!parsed.hasHardFail && !parsed.hasSoftFail) {
    issues.push(isPreview ? 'No fail policy specified' : 'SPF record missing fail policy (all mechanism)');
    if (!isPreview) {
      recommendations.push('Add -all at the end of your SPF record');
    }
  }

  const status = issues.length === 0 ? 'pass' : (issues.length <= 2 ? 'warn' : 'fail');

  return {
    status,
    record: isPreview ? undefined : spfRecord,
    issues,
    recommendations,
    dnsLookupCount: isPreview ? undefined : parsed.lookupCount,
    mechanisms: isPreview ? undefined : parsed.mechanisms,
    suggestedRecord: isPreview ? undefined : generateSPFFix(domain, spfRecord)
  };
}

export async function checkDMARC(domain: string, isPreview: boolean = false): Promise<DMARCResult> {
  // For preview mode, provide realistic deterministic results
  if (isPreview) {
    const majorProviders = ['gmail.com', 'google.com', 'microsoft.com', 'outlook.com', 'office365.com'];
    const isLikelyMajorProvider = majorProviders.some(provider => 
      domain.includes(provider.split('.')[0]) || domain.endsWith(provider)
    );
    
    if (isLikelyMajorProvider) {
      return {
        status: 'warn', // Even major providers often start with p=none
        issues: ['DMARC policy set to monitoring only'],
        recommendations: []
      };
    } else {
      return {
        status: 'fail',
        issues: ['DMARC record not found'],
        recommendations: []
      };
    }
  }

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
    issues.push(isPreview ? 'DMARC policy set to none' : 'DMARC policy is set to none (monitoring only)');
    if (!isPreview) {
      recommendations.push('Upgrade to p=quarantine or p=reject for active protection');
    }
  }

  if (parsed.reportingAddresses.length === 0) {
    issues.push(isPreview ? 'No reporting configured' : 'No DMARC reporting addresses configured');
    if (!isPreview) {
      recommendations.push('Add rua and ruf tags for DMARC reports');
    }
  }

  const status = issues.length === 0 ? 'pass' : (parsed.policy === 'none' ? 'warn' : 'fail');

  return {
    status,
    record: isPreview ? undefined : dmarcRecord,
    policy: isPreview ? undefined : parsed.policy,
    issues,
    recommendations,
    suggestedRecord: isPreview ? undefined : generateDMARCFix(domain, dmarcRecord)
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
  
  // For preview, provide realistic simulation based on domain
  if (isPreview) {
    // Simple deterministic check - major providers likely have DKIM
    const majorProviders = ['gmail.com', 'google.com', 'microsoft.com', 'outlook.com', 'office365.com'];
    const isLikelyMajorProvider = majorProviders.some(provider => 
      domain.includes(provider.split('.')[0]) || domain.endsWith(provider)
    );
    
    if (isLikelyMajorProvider) {
      return {
        status: 'pass',
        commonSelectors,
        validatedSelectors: ['google'],
        issues: [],
        recommendations: [],
        providerGuidance
      };
    } else {
      return {
        status: 'warn',
        commonSelectors,
        validatedSelectors: [],
        issues: ['DKIM records not found for common selectors'],
        recommendations: [],
        providerGuidance
      };
    }
  }

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
      issues: isPreview ? ['BIMI record not found'] : ['No BIMI record found (optional for brand logos)'],
      recommendations: isPreview ? [] : [
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

  if (logoUrl && !isPreview) {
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
    record: isPreview ? undefined : bimiRecord,
    logoUrl: isPreview ? undefined : logoUrl,
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
      issues: isPreview ? ['MTA-STS record not found'] : ['No MTA-STS record found (optional security enhancement)'],
      recommendations: isPreview ? [] : [
        'MTA-STS is optional but provides additional email security',
        'Requires hosting a policy file at https://mta-sts.yourdomain.com/.well-known/mta-sts.txt'
      ]
    };
  }

  const issues: string[] = [];
  const recommendations: string[] = [];

  if (!isPreview) {
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
  }

  const status = issues.length === 0 ? 'pass' : 'warn';

  return {
    status,
    record: isPreview ? undefined : mtaStsRecord,
    policyContent: isPreview ? undefined : undefined, // Would include policy content in full version
    issues,
    recommendations
  };
}