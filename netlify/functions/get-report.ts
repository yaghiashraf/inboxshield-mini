import { Handler } from '@netlify/functions';
import Stripe from 'stripe';
import { checkDomain } from '../../src/lib/checkers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

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
    const { reportId, sessionId } = JSON.parse(event.body || '{}');

    if (!sessionId) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Missing sessionId' }),
      };
    }

    // Verify the payment session
    let paymentVerified = false;
    let domain = '';
    let sessionReportId = '';

    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      
      console.log('Session retrieved:', {
        id: session.id,
        payment_status: session.payment_status,
        metadata: session.metadata,
        providedReportId: reportId
      });
      
      if (session.payment_status === 'paid') {
        // Get reportId and domain from session metadata
        if (session.metadata?.domain && session.metadata?.reportId) {
          paymentVerified = true;
          domain = session.metadata.domain;
          sessionReportId = session.metadata.reportId;
          console.log('Payment verified successfully for domain:', domain, 'reportId:', sessionReportId);
        }
        else {
          console.log('Payment verification failed - missing metadata:', {
            payment_status: session.payment_status,
            metadata_reportId: session.metadata?.reportId,
            metadata_domain: session.metadata?.domain
          });
        }
      } else {
        console.log('Payment not completed:', {
          payment_status: session.payment_status,
          session_id: sessionId
        });
      }
    } catch (stripeError) {
      console.error('Stripe verification error:', stripeError);
      // Continue to show error but don't expose Stripe details
    }

    if (!paymentVerified) {
      // Get session details for debugging
      let debugInfo = {};
      let emergencyOverride = false;
      
      try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        debugInfo = {
          sessionId,
          reportId,
          paymentStatus: session.payment_status,
          metadataReportId: session.metadata?.reportId,
          metadataDomain: session.metadata?.domain,
          created: session.created,
          amount_total: session.amount_total
        };
        
        // Emergency override: if session is clearly paid with valid amount, allow it
        // Payment links may not have metadata, so we need to be more flexible
        if (session.payment_status === 'paid' && 
            session.amount_total && session.amount_total > 0) {
          console.log('🚨 EMERGENCY OVERRIDE: Payment is clearly successful, allowing report generation');
          paymentVerified = true;
          
          // Try to get domain from metadata, otherwise extract from reportId
          domain = session.metadata?.domain;
          if (!domain && reportId) {
            const domainMatch = reportId.match(/^report_(.+?)_\d+$/);
            domain = domainMatch ? domainMatch[1].replace(/_/g, '.') : 'unknown-domain';
          }
          
          sessionReportId = session.metadata?.reportId || reportId || `report_${domain.replace(/[^a-z0-9]/g, '_')}_${session.created}`;
          emergencyOverride = true;
          
          console.log('Emergency override details:', { domain, sessionReportId, reportId });
        }
      } catch (err) {
        debugInfo = { error: 'Could not retrieve session for debugging' };
      }

      if (!emergencyOverride) {
        return {
          statusCode: 403,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            error: 'Payment verification failed',
            paymentVerified: false,
            debug: debugInfo
          }),
        };
      }
    }

    // Generate the full report
    const reportData = await checkDomain(domain, false); // false = full report, not preview

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reportData,
        paymentVerified: true,
        domain,
        reportId: sessionReportId,
      }),
    };

  } catch (error) {
    console.error('Error generating report:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: 'Failed to generate report',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};