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

    if (!reportId || !sessionId) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Missing reportId or sessionId' }),
      };
    }

    // Verify the payment session
    let paymentVerified = false;
    let domain = '';

    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      
      console.log('Session retrieved:', {
        id: session.id,
        payment_status: session.payment_status,
        metadata: session.metadata,
        providedReportId: reportId
      });
      
      if (session.payment_status === 'paid') {
        // Primary check: exact reportId match
        if (session.metadata?.reportId === reportId) {
          paymentVerified = true;
          domain = session.metadata.domain;
          console.log('Payment verified successfully with exact reportId match for domain:', domain);
        }
        // Fallback check: if payment is successful and domain matches (for cases where reportId might not match)
        else if (session.metadata?.domain && reportId.includes(session.metadata.domain.replace(/[^a-z0-9]/g, '_'))) {
          paymentVerified = true;
          domain = session.metadata.domain;
          console.log('Payment verified successfully with domain match fallback for domain:', domain);
        }
        // Emergency fallback: if payment is paid but reportId format doesn't match, still allow if we have a domain
        else if (session.metadata?.domain) {
          paymentVerified = true;
          domain = session.metadata.domain;
          console.log('Payment verified with emergency fallback - payment is paid and domain exists:', domain);
        }
        else {
          console.log('Payment verification failed despite paid status:', {
            payment_status: session.payment_status,
            metadata_reportId: session.metadata?.reportId,
            provided_reportId: reportId,
            metadata_domain: session.metadata?.domain,
            exact_match: session.metadata?.reportId === reportId
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
      } catch (err) {
        debugInfo = { error: 'Could not retrieve session for debugging' };
      }

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