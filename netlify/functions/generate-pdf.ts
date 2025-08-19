import { Handler } from '@netlify/functions';
import { renderToStream } from '@react-pdf/renderer';
import { validateDomainFormat } from '../../src/lib/dns-utils';
import { 
  checkSPF, 
  checkDMARC, 
  checkDKIM, 
  checkBIMI, 
  checkMTASTS 
} from '../../src/lib/checkers';
import { DomainCheckResult } from '../../src/types';
import { PDFReport } from '../../src/components/PDFReport';
import React from 'react';

export const handler: Handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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
    const { domain, reportId } = JSON.parse(event.body || '{}');

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

    // Generate full report data
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

    // Generate PDF
    const stream = await renderToStream(React.createElement(PDFReport, { result }));
    
    // Convert stream to buffer
    const chunks: Uint8Array[] = [];
    return new Promise((resolve) => {
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => {
        const buffer = Buffer.concat(chunks);
        
        resolve({
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="inboxshield-${domain}-report.pdf"`,
          },
          body: buffer.toString('base64'),
          isBase64Encoded: true,
        });
      });
      stream.on('error', (error) => {
        console.error('PDF generation error:', error);
        resolve({
          statusCode: 500,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            error: 'Failed to generate PDF',
            message: error.message
          }),
        });
      });
    });
  } catch (error) {
    console.error('Error in generate-pdf function:', error);
    
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