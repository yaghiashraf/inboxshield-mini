import { Handler } from '@netlify/functions';
import Stripe from 'stripe';
import { validateDomainFormat } from '../../src/lib/dns-utils';

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
    const { domain } = JSON.parse(event.body || '{}');

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

    const priceInCents = parseInt(process.env.REPORT_PRICE_CENTS || '1500');

    // Create a PaymentIntent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: priceInCents,
      currency: 'usd',
      metadata: {
        domain: domain.toLowerCase(),
        product: 'inboxshield-mini-report',
      },
      description: `InboxShield Mini Report for ${domain}`,
    });

    // Generate a unique report ID
    const reportId = `report_${domain.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now()}`;

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        reportId,
        domain: domain.toLowerCase(),
      }),
    };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: 'Failed to create payment intent',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};