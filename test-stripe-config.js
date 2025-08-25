#!/usr/bin/env node

console.log('🔍 Testing Stripe Configuration\n');

// Check environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_STRIPE_PUBLIC_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET'
];

console.log('📋 Environment Variables:');
requiredEnvVars.forEach(envVar => {
  const value = process.env[envVar];
  const hasValue = !!value;
  const isPlaceholder = value && value.includes('REPLACE');
  
  console.log(`  ${envVar}:`);
  console.log(`    ✓ Present: ${hasValue ? '✅' : '❌'}`);
  console.log(`    ✓ Configured: ${hasValue && !isPlaceholder ? '✅' : '❌'}`);
  if (hasValue) {
    console.log(`    Value: ${value.substring(0, 20)}...`);
  }
  console.log('');
});

console.log('📋 Optional Environment Variables:');
const optionalEnvVars = [
  'NEXT_PUBLIC_APP_URL',
  'REPORT_PRICE_CENTS'
];

optionalEnvVars.forEach(envVar => {
  const value = process.env[envVar];
  console.log(`  ${envVar}: ${value || 'Not set'}`);
});

console.log('\n🎯 Next Steps:');
console.log('1. Get your Stripe test keys from: https://dashboard.stripe.com/test/apikeys');
console.log('2. Replace the placeholder values in your .env.local file');
console.log('3. Restart your development server');
console.log('4. Test the payment flow again');

console.log('\n🔧 Example .env.local configuration:');
console.log(`
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_51ABC123...
STRIPE_SECRET_KEY=sk_test_51ABC123...
STRIPE_WEBHOOK_SECRET=whsec_ABC123...
NEXT_PUBLIC_APP_URL=http://localhost:3000
REPORT_PRICE_CENTS=1199
`);