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

export const handler: Handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      } as Record<string, string>,
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
    const request: CheckRequest = JSON.parse(event.body || '{}');
    const { domain, dkimSelector } = request;

    if (!domain || !validateDomainFormat(domain)) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Invalid domain format' }),
      };
    }

    // For full report, isPreview = false to get detailed results
    const [spfResult, dmarcResult, dkimResult, bimiResult, mtaStsResult] = await Promise.all([
      checkSPF(domain, false),
      checkDMARC(domain, false),
      checkDKIM(domain, false),
      checkBIMI(domain, false),
      checkMTASTS(domain, false),
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
      domain: domain.toLowerCase(),
      timestamp: new Date().toISOString(),
      spf: spfResult,
      dmarc: dmarcResult,
      dkim: dkimResult,
      bimi: bimiResult,
      mtaSts: mtaStsResult,
      overallScore,
      isPreview: false,
    };

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error('Error in check-full function:', error);
    
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