import { Handler } from '@netlify/functions';
import Stripe from 'stripe';

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
    const { sessionId } = JSON.parse(event.body || '{}');

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

    // Get full session details for debugging
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent', 'payment_intent.payment_method']
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session: {
          id: session.id,
          payment_status: session.payment_status,
          status: session.status,
          metadata: session.metadata,
          amount_total: session.amount_total,
          currency: session.currency,
          created: session.created,
          expires_at: session.expires_at,
          mode: session.mode,
          payment_intent: session.payment_intent ? {
            id: session.payment_intent.id,
            status: session.payment_intent.status,
            amount: session.payment_intent.amount,
            created: session.payment_intent.created
          } : null
        }
      }),
    };

  } catch (error) {
    console.error('Error debugging payment:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: 'Failed to debug payment',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};