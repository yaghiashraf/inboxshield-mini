export interface DomainCheckResult {
  domain: string;
  timestamp: string;
  spf: SPFResult;
  dmarc: DMARCResult;
  dkim: DKIMResult;
  bimi: BIMIResult;
  mtaSts: MTASTSResult;
  overallScore: number;
  isPreview: boolean;
}

export interface SPFResult {
  status: 'pass' | 'warn' | 'fail';
  record?: string;
  issues: string[];
  recommendations: string[];
  dnsLookupCount?: number;
  mechanisms?: string[];
  suggestedRecord?: string;
}

export interface DMARCResult {
  status: 'pass' | 'warn' | 'fail';
  record?: string;
  policy?: 'none' | 'quarantine' | 'reject';
  issues: string[];
  recommendations: string[];
  suggestedRecord?: string;
}

export interface DKIMResult {
  status: 'pass' | 'warn' | 'fail';
  commonSelectors: string[];
  validatedSelectors: string[];
  issues: string[];
  recommendations: string[];
  providerGuidance?: ProviderGuidance[];
}

export interface BIMIResult {
  status: 'pass' | 'warn' | 'fail';
  record?: string;
  logoUrl?: string;
  issues: string[];
  recommendations: string[];
  suggestedRecord?: string;
}

export interface MTASTSResult {
  status: 'pass' | 'warn' | 'fail';
  record?: string;
  policyContent?: string;
  issues: string[];
  recommendations: string[];
  suggestedRecord?: string;
  suggestedPolicy?: string;
}

export interface ProviderGuidance {
  provider: string;
  commonSelectors: string[];
  setupInstructions: string;
  documentationUrl?: string;
}

export interface CheckRequest {
  domain: string;
  isPreview?: boolean;
  dkimSelector?: string;
}

export interface PaymentIntent {
  domain: string;
  clientSecret: string;
  reportId: string;
}