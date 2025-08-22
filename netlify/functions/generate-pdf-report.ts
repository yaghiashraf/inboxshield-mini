import { Handler } from '@netlify/functions';
import { renderToStream } from '@react-pdf/renderer';
import { EnhancedPDFReport } from '../../src/components/EnhancedPDFReport';
import React from 'react';

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
    const { reportData } = JSON.parse(event.body || '{}');

    if (!reportData) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Report data is required' }),
      };
    }

    console.log(`Generating PDF for domain: ${reportData.domain}`);

    // Generate PDF using React-PDF
    const pdfStream = await renderToStream(React.createElement(EnhancedPDFReport, { reportData }));
    
    // Convert stream to buffer
    const chunks: Buffer[] = [];
    for await (const chunk of pdfStream) {
      chunks.push(chunk);
    }
    const pdfBuffer = Buffer.concat(chunks);

    // Return PDF as base64 for download
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="inboxshield-${reportData.domain}-report.pdf"`,
      },
      body: pdfBuffer.toString('base64'),
      isBase64Encoded: true,
    };
  } catch (error) {
    console.error('Error generating PDF:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: 'Failed to generate PDF',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};