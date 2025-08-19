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
  const domainPattern = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return domainPattern.test(domain) && 
         domain.includes('.') && 
         !domain.startsWith('.') && 
         !domain.endsWith('.');
}

export function generateSPFFix(domain: string, currentRecord?: string): string {
  // This is a basic SPF record template - in production, this would be more sophisticated
  if (!currentRecord) {
    return `"v=spf1 include:_spf.google.com ~all"`;
  }
  
  // If record exists but has issues, suggest improvements
  const parsed = parseSPFRecord(currentRecord);
  if (parsed.hasSoftFail && !parsed.hasHardFail) {
    return currentRecord.replace('~all', '-all');
  }
  
  return currentRecord;
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