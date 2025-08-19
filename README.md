# InboxShield Mini

A one-time purchase email deliverability audit tool for small businesses. Analyzes SPF, DKIM, DMARC, BIMI, and MTA-STS records and provides actionable fixes.

## Features

- **Domain Health Check**: Instant preview of email authentication status
- **Comprehensive Analysis**: Full reports covering all major email authentication protocols
- **Copy-Paste Fixes**: Exact DNS records ready for implementation  
- **Professional Reports**: Branded PDF reports with shareable links
- **Payment Integration**: Stripe Checkout for secure one-time payments
- **Provider Guidance**: Specific setup instructions for popular email providers

## Tech Stack

- **Frontend**: Next.js 15 with TypeScript and Tailwind CSS
- **Backend**: Netlify Functions (serverless)
- **Payment**: Stripe Checkout
- **PDF Generation**: React-PDF
- **DNS Resolution**: Node.js built-in DNS module
- **Deployment**: Netlify

## Getting Started

### 1. Clone and Install

```bash
git clone <repository-url>
cd inboxshield-mini
npm install
```

### 2. Environment Setup

Copy `.env.local.example` to `.env.local` and configure:

```bash
# Stripe Configuration (required)
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.netlify.app
REPORT_PRICE_CENTS=1200

# Email Service (optional)
EMAIL_API_KEY=your-email-service-key
FROM_EMAIL=noreply@yourdomain.com
```

### 3. Development

```bash
npm run dev
```

Visit http://localhost:3000 to see the application.

### 4. Deployment

This project is optimized for Netlify deployment:

1. Push to GitHub
2. Connect to Netlify
3. Set environment variables in Netlify dashboard
4. Deploy

The `netlify.toml` file is already configured for automatic deployment.

## API Endpoints

### Netlify Functions

- `/.netlify/functions/check-preview` - Free domain preview
- `/.netlify/functions/check-full` - Full domain analysis  
- `/.netlify/functions/create-checkout-session` - Stripe payment
- `/.netlify/functions/generate-pdf` - PDF report generation
- `/.netlify/functions/stripe-webhook` - Payment confirmation

## Project Structure

```
inboxshield-mini/
├── src/
│   ├── app/                 # Next.js app router pages
│   ├── components/          # React components
│   ├── lib/                 # Utility functions
│   └── types/              # TypeScript type definitions
├── netlify/
│   └── functions/          # Serverless functions
├── netlify.toml           # Netlify configuration
└── README.md
```

## Email Authentication Checks

### SPF (Sender Policy Framework)
- Validates sender authorization
- Checks DNS lookup limits
- Recommends hard fail policies

### DMARC (Domain-based Message Authentication)
- Analyzes authentication policies
- Checks reporting configuration
- Suggests policy upgrades

### DKIM (DomainKeys Identified Mail)  
- Tests common selectors
- Provides provider-specific guidance
- Validates public key records

### BIMI (Brand Indicators for Message Identification)
- Checks brand logo configuration
- Validates SVG accessibility
- Notes optional implementation

### MTA-STS (Mail Transfer Agent Strict Transport Security)
- Tests policy record existence
- Validates policy file accessibility
- Confirms secure transport requirements

## Pricing Model

- Free preview shows issues found
- $12 one-time payment for full report with:
  - Detailed issue descriptions
  - Copy-paste DNS fixes
  - Professional PDF report
  - Shareable report links
  - Provider-specific instructions

## Cost Analysis

**Development Costs**: < $100
- Free tier services (Netlify, Stripe testing)
- Open source libraries only
- No database or persistent storage

**Operating Costs**: ~$0-5/month
- Netlify hosting (free tier covers most usage)
- Stripe payment processing (2.9% + 30¢ per transaction)

**Revenue Potential**: $5-10 profit per report after Stripe fees

## Security & Privacy

- No sensitive data storage
- Reports generated on-demand
- HTTPS enforced for all transactions
- No tracking or analytics by default

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues or questions, please open a GitHub issue or contact support.
