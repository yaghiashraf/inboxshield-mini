import { promisify } from 'util';
import { resolve } from 'dns';
import axios from 'axios';

const resolveTxt = promisify(resolve) as (hostname: string, rrtype: string) => Promise<string[][]>;

export interface DNSLookupResult {
  records: string[];
  error?: string;
}

export async function lookupTxtRecords(domain: string): Promise<DNSLookupResult> {
  try {
    const records = await resolveTxt(domain, 'TXT');
    return {
      records: records.flat()
    };
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