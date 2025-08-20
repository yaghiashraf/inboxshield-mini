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
      
      if (session.payment_status === 'paid' && session.metadata?.reportId === reportId) {
        paymentVerified = true;
        domain = session.metadata.domain;
      }
    } catch (stripeError) {
      console.error('Stripe verification error:', stripeError);
      // Continue to show error but don't expose Stripe details
    }

    if (!paymentVerified) {
      return {
        statusCode: 403,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          error: 'Payment verification failed',
          paymentVerified: false 
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