import axios from 'axios';

export interface DNSLookupResult {
  records: string[];
  error?: string;
}

export async function lookupTxtRecords(domain: string): Promise<DNSLookupResult> {
  try {
    // Use DNS over HTTPS for browser compatibility
    const response = await fetch(`https://dns.google/resolve?name=${domain}&type=TXT`, {
      method: 'GET',
      headers: {
        'Accept': 'application/dns-json'
      }
    });
    
    if (!response.ok) {
      throw new Error('DNS lookup failed');
    }
    
    const data = await response.json();
    
    if (data.Answer) {
      return {
        records: data.Answer.map((answer: any) => answer.data)
      };
    }
    
    return { records: [] };
  } catch (error) {
    return {
      records: [],
      error: error instanceof Error ? error.message : 'DNS lookup failed'
    };
  }
}

export async function fetchHttpContent(url: string): Promise<{ content: string; error?: string }> {
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'InboxShield-Mini/1.0'
      }
    });
    return { content: response.data };
  } catch (error) {
    return {
      content: '',
      error: error instanceof Error ? error.message : 'HTTP request failed'
    };
  }
}

export function parseSPFRecord(record: string): {
  mechanisms: string[];
  lookupCount: number;
  hasHardFail: boolean;
  hasSoftFail: boolean;
} {
  const mechanisms = record.split(/\s+/).filter(part => part.trim().length > 0);
  let lookupCount = 0;
  let hasHardFail = false;
  let hasSoftFail = false;

  mechanisms.forEach(mechanism => {
    if (mechanism.startsWith('include:') || 
        mechanism.startsWith('a:') || 
        mechanism.startsWith('mx:') ||
        mechanism.startsWith('exists:') ||
        mechanism === 'a' ||
        mechanism === 'mx') {
      lookupCount++;
    }
    
    if (mechanism === '-all') {
      hasHardFail = true;
    } else if (mechanism === '~all') {
      hasSoftFail = true;
    }
  });

  return {
    mechanisms,
    lookupCount,
    hasHardFail,
    hasSoftFail
  };
}

export function parseDMARCRecord(record: string): {
  policy?: string;
  subdomainPolicy?: string;
  reportingAddresses: string[];
  alignment: {
    dkim?: string;
    spf?: string;
  };
  percentage?: number;
} {
  const tags = record.split(';').map(tag => tag.trim());
  const parsed: Record<string, string | number> = {};
  const reportingAddresses: string[] = [];

  tags.forEach(tag => {
    const [key, value] = tag.split('=').map(s => s?.trim());
    if (!key || !value) return;

    switch (key.toLowerCase()) {
      case 'p':
        parsed.policy = value;
        break;
      case 'sp':
        parsed.subdomainPolicy = value;
        break;
      case 'rua':
        reportingAddresses.push(...value.split(',').map(s => s.trim()));
        break;
      case 'ruf':
        reportingAddresses.push(...value.split(',').map(s => s.trim()));
        break;
      case 'adkim':
        parsed.alignment = { ...parsed.alignment, dkim: value };
        break;
      case 'aspf':
        parsed.alignment = { ...parsed.alignment, spf: value };
        break;
      case 'pct':
        parsed.percentage = parseInt(value);
        break;
    }
  });

  return {
    ...parsed,
    reportingAddresses
  };
}

export function validateDomainFormat(domain: string): boolean {
  // Strict domain validation with security checks
  if (!domain || typeof domain !== 'string') {
    return false;
  }
  
  const trimmed = domain.trim().toLowerCase();
  
  // Security checks
  if (trimmed.length < 3 || trimmed.length > 253) {
    return false;
  }
  
  // Prevent malicious patterns
  if (trimmed.includes('..') || 
      trimmed.includes('localhost') || 
      trimmed.includes('127.0.0.1') ||
      trimmed.includes('0.0.0.0') ||
      trimmed.match(/^\d+\.\d+\.\d+\.\d+$/)) {
    return false;
  }
  
  // RFC compliant domain pattern
  const domainPattern = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  return domainPattern.test(trimmed) && 
         trimmed.includes('.') && 
         !trimmed.startsWith('.') && 
         !trimmed.endsWith('.') &&
         !trimmed.startsWith('-') &&
         !trimmed.endsWith('-');
}

export function generateSPFFix(domain: string, currentRecord?: string): string {
  // If no current record, suggest comprehensive SPF with common providers
  if (!currentRecord) {
    const commonProviders = [
      'include:_spf.google.com',        // Google Workspace
      'include:spf.protection.outlook.com',  // Microsoft 365
      'include:sendgrid.net',           // SendGrid
      'include:mailgun.org',            // Mailgun
      'include:servers.mcsv.net',       // Mailchimp
      'include:spf.constantcontact.com', // Constant Contact
      'include:_spf.hubspot.com',       // HubSpot
      'include:spf.createsend.com',     // Campaign Monitor
      'include:spf.messagelabs.com',    // Symantec Email Security
      'include:amazonses.com',          // Amazon SES
    ];
    
    return `"v=spf1 ${commonProviders.slice(0, 3).join(' ')} ~all"`;
  }
  
  // If record exists, analyze and improve it
  const parsed = parseSPFRecord(currentRecord);
  let improvedRecord = currentRecord;
  
  // Fix soft fail to hard fail for better security
  if (parsed.hasSoftFail && !parsed.hasHardFail) {
    improvedRecord = improvedRecord.replace('~all', '-all');
  }
  
  // Add missing fail policy
  if (!parsed.hasHardFail && !parsed.hasSoftFail) {
    improvedRecord = improvedRecord.trim() + ' -all';
  }
  
  // Detect missing common providers and suggest adding them
  const missingProviders = [];
  const recordLower = improvedRecord.toLowerCase();
  
  if (!recordLower.includes('_spf.google.com') && !recordLower.includes('gmail')) {
    missingProviders.push('include:_spf.google.com');
  }
  if (!recordLower.includes('spf.protection.outlook.com') && !recordLower.includes('office365')) {
    missingProviders.push('include:spf.protection.outlook.com');
  }
  if (!recordLower.includes('sendgrid') && !recordLower.includes('sg.')) {
    missingProviders.push('include:sendgrid.net');
  }
  
  // If we detected missing common providers, suggest adding them (but limit to avoid lookup limit)
  if (missingProviders.length > 0 && parsed.lookupCount < 8) {
    const providersToAdd = missingProviders.slice(0, 10 - parsed.lookupCount);
    const insertPosition = improvedRecord.lastIndexOf('all') || improvedRecord.lastIndexOf('redirect=');
    if (insertPosition > 0) {
      improvedRecord = improvedRecord.substring(0, insertPosition) + 
                     providersToAdd.join(' ') + ' ' + 
                     improvedRecord.substring(insertPosition);
    }
  }
  
  return `"${improvedRecord}"`;
}

export function generateDMARCFix(domain: string, currentRecord?: string): string {
  if (!currentRecord) {
    return `"v=DMARC1; p=quarantine; rua=mailto:dmarc@${domain}; ruf=mailto:dmarc@${domain}; fo=1"`;
  }
  
  // Suggest improvements to existing record
  const parsed = parseDMARCRecord(currentRecord);
  if (parsed.policy === 'none') {
    return currentRecord.replace('p=none', 'p=quarantine');
  }
  
  return currentRecord;
}

export interface DNSProvider {
  name: string;
  code: string;
  logo: string;
  confidence: number;
}

export async function detectDNSProvider(domain: string): Promise<DNSProvider> {
  try {
    // Try to detect provider through nameservers
    const nameservers = await lookupNameservers(domain);
    
    // Provider patterns based on common nameserver formats
    const providers = [
      {
        name: 'GoDaddy',
        code: 'godaddy',
        logo: '🟢',
        patterns: ['godaddy.com', 'domaincontrol.com', 'secureserver.net'],
        confidence: 0
      },
      {
        name: 'Cloudflare',
        code: 'cloudflare', 
        logo: '🟠',
        patterns: ['cloudflare.com', 'ns.cloudflare.com'],
        confidence: 0
      },
      {
        name: 'Namecheap',
        code: 'namecheap',
        logo: '🔴',
        patterns: ['registrar-servers.com', 'namecheaphosting.com', 'namecheap.com'],
        confidence: 0
      },
      {
        name: 'Route 53 (Amazon)',
        code: 'route53',
        logo: '🟡',
        patterns: ['awsdns'],
        confidence: 0
      },
      {
        name: 'Google Domains',
        code: 'google',
        logo: '🔵',
        patterns: ['googledomains.com', 'google.com'],
        confidence: 0
      }
    ];

    // Calculate confidence scores
    for (const provider of providers) {
      for (const ns of nameservers) {
        for (const pattern of provider.patterns) {
          if (ns.toLowerCase().includes(pattern.toLowerCase())) {
            provider.confidence += 1;
          }
        }
      }
    }

    // Find provider with highest confidence
    const detectedProvider = providers.reduce((prev, current) => 
      (prev.confidence > current.confidence) ? prev : current
    );

    // If no clear match, return generic
    if (detectedProvider.confidence === 0) {
      return {
        name: 'Generic DNS Provider',
        code: 'generic',
        logo: '⚙️',
        confidence: 0
      };
    }

    return {
      name: detectedProvider.name,
      code: detectedProvider.code,
      logo: detectedProvider.logo,
      confidence: detectedProvider.confidence
    };

  } catch (error) {
    console.error('Error detecting DNS provider:', error);
    
    // Fallback to generic provider
    return {
      name: 'Generic DNS Provider', 
      code: 'generic',
      logo: '⚙️',
      confidence: 0
    };
  }
}

async function lookupNameservers(domain: string): Promise<string[]> {
  try {
    // For browser environment, we'll need to use a DNS over HTTPS service
    // This is a simplified version - in production you'd want more robust detection
    const response = await fetch(`https://dns.google/resolve?name=${domain}&type=NS`, {
      method: 'GET',
      headers: {
        'Accept': 'application/dns-json'
      }
    });
    
    if (!response.ok) {
      throw new Error('DNS lookup failed');
    }
    
    const data = await response.json();
    
    if (data.Answer) {
      return data.Answer.map((answer: any) => answer.data);
    }
    
    return [];
  } catch (error) {
    console.error('Nameserver lookup failed:', error);
    return [];
  }
}

export function getProviderInstructions(providerCode: string): {
  setupSteps: string[];
  spfSteps: string[];
  dmarcSteps: string[];
  dkimSteps: string[];
  notes: string[];
} {
  const instructions = {
    godaddy: {
      setupSteps: [
        'Log in to your GoDaddy account at godaddy.com',
        'Go to your account and select "My Products"',
        'Find your domain and click "DNS" or "Manage DNS"',
        'Look for the "Records" section'
      ],
      spfSteps: [
        'In the DNS Management page, click "Add" to create a new record',
        'Select "TXT" as the record type',
        'Leave the "Host" field blank (or enter "@")',
        'In the "TXT Value" field, paste your SPF record exactly as provided',
        'Set TTL to 1 hour (3600 seconds)',
        'Click "Save" to add the record'
      ],
      dmarcSteps: [
        'Click "Add" to create another new TXT record',
        'Select "TXT" as the record type', 
        'In the "Host" field, enter "_dmarc"',
        'In the "TXT Value" field, paste your DMARC policy',
        'Set TTL to 1 hour (3600 seconds)',
        'Click "Save" to add the DMARC record'
      ],
      dkimSteps: [
        'Get your DKIM record from your email provider (Google, Microsoft, etc.)',
        'Click "Add" to create a new TXT record',
        'In the "Host" field, enter the DKIM selector (e.g., "selector1._domainkey")',
        'In the "TXT Value" field, paste the DKIM public key',
        'Set TTL to 1 hour',
        'Save the record'
      ],
      notes: [
        'DNS changes at GoDaddy usually propagate within 1 hour',
        'You can verify changes using GoDaddy\'s DNS checker tool',
        'Make sure to remove any conflicting existing records'
      ]
    },
    cloudflare: {
      setupSteps: [
        'Log in to your Cloudflare dashboard at cloudflare.com',
        'Select the domain you want to configure',
        'Navigate to the "DNS" tab in the main menu',
        'Look for the "Records" section'
      ],
      spfSteps: [
        'Click the "Add record" button',
        'Select "TXT" from the Type dropdown',
        'In the "Name" field, enter "@" (represents root domain)',
        'In the "Content" field, paste your SPF record',
        'Leave "TTL" as "Auto" or set to 1 hour',
        'Click "Save" to add the record'
      ],
      dmarcSteps: [
        'Click "Add record" for a new TXT record',
        'Select "TXT" as the type',
        'In the "Name" field, enter "_dmarc"',
        'In the "Content" field, paste your DMARC policy',
        'Set TTL to "Auto" or 1 hour',
        'Click "Save"'
      ],
      dkimSteps: [
        'Obtain DKIM record from your email service provider',
        'Click "Add record"',
        'Select "TXT" as type',
        'Enter the DKIM selector in "Name" (e.g., "selector1._domainkey")',
        'Paste DKIM public key in "Content"',
        'Save the record'
      ],
      notes: [
        'Cloudflare DNS changes are usually instant',
        'Use Cloudflare\'s DNS checker to verify records',
        'Orange cloud (proxied) should be off for email records'
      ]
    },
    namecheap: {
      setupSteps: [
        'Log in to your Namecheap account',
        'Go to "Domain List" in your dashboard',
        'Find your domain and click "Manage"',
        'Click on the "Advanced DNS" tab'
      ],
      spfSteps: [
        'Click "Add New Record" button',
        'Select "TXT Record" from the dropdown',
        'Leave "Host" field as "@"',
        'In the "Value" field, paste your SPF record',
        'Set TTL to 1800 (30 minutes) or use Automatic',
        'Click the green checkmark to save'
      ],
      dmarcSteps: [
        'Click "Add New Record"',
        'Select "TXT Record"',
        'In "Host" field, enter "_dmarc"',
        'Paste DMARC policy in "Value" field',
        'Set appropriate TTL',
        'Save the record'
      ],
      dkimSteps: [
        'Get DKIM record from email provider',
        'Add new TXT record',
        'Enter DKIM selector as Host (e.g., "selector1._domainkey")',
        'Paste DKIM key as Value',
        'Save the record'
      ],
      notes: [
        'Namecheap DNS changes typically take 30 minutes to 4 hours',
        'Free DNS is included with all domain registrations',
        'Check "Domain" tab to ensure DNS is pointed to Namecheap servers'
      ]
    },
    generic: {
      setupSteps: [
        'Log in to your domain registrar or DNS hosting provider',
        'Look for "DNS Management", "DNS Zone", or "DNS Records" section',
        'Find the area where you can add or edit DNS records',
        'Locate TXT record management options'
      ],
      spfSteps: [
        'Create a new TXT record',
        'Set the name/host to "@" or leave blank for root domain',
        'Paste your SPF record in the value/content field',
        'Set TTL to 3600 seconds (1 hour) if available',
        'Save or apply the changes'
      ],
      dmarcSteps: [
        'Add another TXT record',
        'Set name/host to "_dmarc"',
        'Enter your DMARC policy as the value',
        'Set appropriate TTL',
        'Save the record'
      ],
      dkimSteps: [
        'Obtain DKIM record from your email service provider',
        'Create new TXT record',
        'Use DKIM selector as the name (e.g., "selector1._domainkey")',
        'Enter DKIM public key as value',
        'Save the configuration'
      ],
      notes: [
        'DNS propagation time varies by provider (15 minutes to 24 hours)',
        'Verify records using online DNS lookup tools',
        'Contact your provider\'s support if you need assistance'
      ]
    }
  };

  return instructions[providerCode as keyof typeof instructions] || instructions.generic;
}