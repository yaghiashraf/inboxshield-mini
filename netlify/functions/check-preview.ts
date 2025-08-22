import { Handler } from '@netlify/functions';
import { DomainCheckResult, CheckRequest } from '../../src/types';
import { validateDomainFormat } from '../../src/lib/dns-utils';
import { 
  checkSPF, 
  checkDMARC, 
  checkDKIM, 
  checkBIMI, 
  checkMTASTS 
} from '../../src/lib/checkers';

// Simple in-memory cache for preview requests
const cache = new Map<string, { data: DomainCheckResult; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

// Rate limiting: simple in-memory store
const rateLimitStore = new Map<string, { requests: number; resetTime: number }>();
const RATE_LIMIT_REQUESTS = 10; // requests per window
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute window

function checkRateLimit(clientIP: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const clientData = rateLimitStore.get(clientIP);
  
  if (!clientData || now > clientData.resetTime) {
    // Reset or initialize
    rateLimitStore.set(clientIP, { requests: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true, remaining: RATE_LIMIT_REQUESTS - 1 };
  }
  
  if (clientData.requests >= RATE_LIMIT_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }
  
  clientData.requests++;
  return { allowed: true, remaining: RATE_LIMIT_REQUESTS - clientData.requests };
}

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

  // Rate limiting
  const clientIP = event.headers['x-forwarded-for']?.split(',')[0] || 
                   event.headers['x-real-ip'] || 
                   context.clientContext?.identity?.url || 
                   'unknown';
  
  const rateLimit = checkRateLimit(clientIP);
  
  if (!rateLimit.allowed) {
    return {
      statusCode: 429,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'X-RateLimit-Limit': RATE_LIMIT_REQUESTS.toString(),
        'X-RateLimit-Remaining': '0',
        'Retry-After': '60',
      },
      body: JSON.stringify({ 
        error: 'Too many requests. Please try again in 1 minute.' 
      }),
    };
  }

  try {
    // Validate request body
    let request: CheckRequest;
    try {
      request = JSON.parse(event.body || '{}');
    } catch (e) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Invalid JSON in request body' }),
      };
    }

    const { domain, isPreview = true } = request;

    // Validate domain
    if (!domain || typeof domain !== 'string' || !validateDomainFormat(domain)) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        },
        body: JSON.stringify({ 
          error: 'Invalid domain format. Please provide a valid domain name.' 
        }),
      };
    }

    const normalizedDomain = domain.toLowerCase().trim();
    const cacheKey = `preview_${normalizedDomain}`;

    // Check cache first
    const cached = cache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300', // 5 minutes client-side cache
        },
        body: JSON.stringify({ ...cached.data, fromCache: true }),
      };
    }

    // Clean old cache entries periodically
    if (Math.random() < 0.1) { // 10% chance
      const now = Date.now();
      for (const [key, value] of cache.entries()) {
        if (now - value.timestamp > CACHE_DURATION) {
          cache.delete(key);
        }
      }
    }

    // Run all checks concurrently
    const [spfResult, dmarcResult, dkimResult, bimiResult, mtaStsResult] = await Promise.all([
      checkSPF(normalizedDomain, isPreview),
      checkDMARC(normalizedDomain, isPreview),
      checkDKIM(normalizedDomain, isPreview),
      checkBIMI(normalizedDomain, isPreview),
      checkMTASTS(normalizedDomain, isPreview),
    ]);

    // Calculate overall score
    const getStatusScore = (status: 'pass' | 'warn' | 'fail') => {
      switch (status) {
        case 'pass': return 20;
        case 'warn': return 10;
        case 'fail': return 0;
      }
    };

    const overallScore = 
      getStatusScore(spfResult.status) +
      getStatusScore(dmarcResult.status) +
      getStatusScore(dkimResult.status) +
      getStatusScore(bimiResult.status) +
      getStatusScore(mtaStsResult.status);

    const result: DomainCheckResult = {
      domain: normalizedDomain,
      timestamp: new Date().toISOString(),
      spf: spfResult,
      dmarc: dmarcResult,
      dkim: dkimResult,
      bimi: bimiResult,
      mtaSts: mtaStsResult,
      overallScore,
      isPreview,
    };

    // Cache the result
    cache.set(cacheKey, { data: result, timestamp: Date.now() });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300', // 5 minutes client-side cache
        'X-RateLimit-Limit': RATE_LIMIT_REQUESTS.toString(),
        'X-RateLimit-Remaining': rateLimit.remaining.toString(),
      },
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error('Error in check-preview function:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};