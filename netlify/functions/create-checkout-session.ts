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
    console.log('Creating checkout session...');
    
    // Check if Stripe secret key is configured
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('REPLACE')) {
      console.error('Stripe secret key not configured - current value:', process.env.STRIPE_SECRET_KEY?.substring(0, 10));
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          error: 'Payment system not configured. The administrator needs to set up Stripe keys.',
          details: 'Stripe secret key is missing or not configured properly',
          envCheck: {
            hasSecretKey: !!process.env.STRIPE_SECRET_KEY,
            secretKeyValid: !!(process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('REPLACE')),
            priceConfigured: !!process.env.REPORT_PRICE_CENTS
          }
        }),
      };
    }

    const { domain } = JSON.parse(event.body || '{}');
    console.log('Processing checkout for domain:', domain);

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

    const priceInCents = parseInt(process.env.REPORT_PRICE_CENTS || '1199');
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://localhost:3000';

    // Generate a unique report ID
    const reportId = `report_${domain.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now()}`;

    // Create a Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'InboxShield Mini Email Security Report',
              description: `Complete email authentication analysis for ${domain}`,
              images: [], // You could add a product image here
            },
            unit_amount: priceInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/?cancelled=true`,
      metadata: {
        domain: domain.toLowerCase(),
        reportId,
        product: 'inboxshield-mini-report',
      },
      customer_email: undefined, // Customer will enter their email in Stripe
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId: session.id,
        reportId,
        domain: domain.toLowerCase(),
      }),
    };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: 'Failed to create checkout session',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};