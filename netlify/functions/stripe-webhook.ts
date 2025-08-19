import { Handler } from '@netlify/functions';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export const handler: Handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const sig = event.headers['stripe-signature'];

  if (!sig) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'No signature found' }),
    };
  }

  let stripeEvent: Stripe.Event;

  try {
    stripeEvent = stripe.webhooks.constructEvent(event.body!, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Webhook signature verification failed' }),
    };
  }

  try {
    // Handle the event
    switch (stripeEvent.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = stripeEvent.data.object as Stripe.PaymentIntent;
        const domain = paymentIntent.metadata.domain;
        
        console.log('Payment succeeded for domain:', domain);
        
        // Here you could:
        // 1. Send email confirmation
        // 2. Log the successful payment
        // 3. Trigger any post-payment processing
        
        // For this simple implementation, we'll just log it
        console.log(`Payment completed for ${domain}: ${paymentIntent.amount / 100} USD`);
        
        break;
      
      case 'payment_intent.payment_failed':
        const failedPayment = stripeEvent.data.object as Stripe.PaymentIntent;
        console.log('Payment failed for:', failedPayment.metadata.domain);
        break;
        
      default:
        console.log(`Unhandled event type ${stripeEvent.type}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };
  } catch (error) {
    console.error('Error processing webhook:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Webhook processing failed' }),
    };
  }
};