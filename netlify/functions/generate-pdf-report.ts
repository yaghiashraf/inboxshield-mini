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

    // Validate that reportData has the required structure
    if (!reportData.domain || !reportData.timestamp) {
      console.error('Invalid report data structure:', reportData);
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Invalid report data structure' }),
      };
    }

    // Ensure all required fields are present with defaults
    const completeReportData = {
      domain: reportData.domain,
      timestamp: reportData.timestamp,
      reportId: reportData.reportId || `report_${reportData.domain}_${Date.now()}`,
      overallScore: reportData.overallScore || 0,
      businessImpact: reportData.businessImpact || {
        currentImpactLevel: 'HIGH',
        estimatedDeliverabilityRate: '45-60%',
        criticalIssuesFound: 5,
        potentialImprovementRate: '95%+',
        recommendedActionTimeframe: 'Within 24 hours'
      },
      dnsFixesGenerated: reportData.dnsFixesGenerated || [],
      providerInstructions: reportData.providerInstructions || {
        godaddy: { steps: ['Contact support for setup instructions'] },
        cloudflare: { steps: ['Contact support for setup instructions'] },
        namecheap: { steps: ['Contact support for setup instructions'] }
      },
      recommendations: reportData.recommendations || [],
      verificationSteps: reportData.verificationSteps || [],
      ...reportData
    };

    console.log('Generating PDF with complete data structure...');

    // Generate PDF using React-PDF with timeout
    const pdfPromise = renderToStream(React.createElement(EnhancedPDFReport, { reportData: completeReportData }));
    
    // Add timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('PDF generation timeout')), 30000); // 30 second timeout
    });
    
    const pdfStream = await Promise.race([pdfPromise, timeoutPromise]) as NodeJS.ReadableStream;
    
    // Convert stream to buffer with size check
    const chunks: Buffer[] = [];
    for await (const chunk of pdfStream) {
      chunks.push(chunk);
    }
    const pdfBuffer = Buffer.concat(chunks);

    // Validate buffer size
    if (pdfBuffer.length === 0) {
      throw new Error('Generated PDF is empty');
    }

    console.log(`PDF generated successfully. Size: ${pdfBuffer.length} bytes`);

    // Return PDF as base64 for download
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="inboxshield-${completeReportData.domain}-analysis.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
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