# Environment Variables Setup Guide

This guide explains how to configure all the required environment variables for the SkinLabs application.

## Quick Start

1. **Copy the environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Generate secure keys:**
   ```bash
   npm run generate-keys
   ```

3. **Fill in your API keys** (see sections below for where to obtain them)

4. **Test your configuration:**
   ```bash
   npm run dev
   ```

## Required Environment Variables

### Database Configuration

#### `DATABASE_URL`
- **Purpose**: PostgreSQL database connection string
- **Format**: `postgresql://username:password@host:port/database`
- **Where to get it**: 
  - Local: Install PostgreSQL locally
  - Cloud: [Neon.tech](https://neon.tech), [Supabase](https://supabase.com), or [AWS RDS](https://aws.amazon.com/rds/)
- **Example**: `postgresql://user:pass@db.example.com:5432/skinlabs`

### Authentication (Clerk)

#### `CLERK_SECRET_KEY`
- **Purpose**: Server-side authentication with Clerk
- **Where to get it**: [Clerk Dashboard](https://dashboard.clerk.com) → Your App → API Keys
- **Format**: Starts with `sk_test_` (development) or `sk_live_` (production)

#### `VITE_CLERK_PUBLISHABLE_KEY`
- **Purpose**: Client-side authentication with Clerk
- **Where to get it**: [Clerk Dashboard](https://dashboard.clerk.com) → Your App → API Keys
- **Format**: Starts with `pk_test_` (development) or `pk_live_` (production)

### Payment Processing (PayPal)

#### `PAYPAL_CLIENT_ID` & `PAYPAL_CLIENT_SECRET`
- **Purpose**: PayPal payment processing
- **Where to get it**: [PayPal Developer Console](https://developer.paypal.com/developer/applications/)
- **Development**: Use sandbox credentials (start with `sb_`)
- **Production**: Use live credentials

### Email Service (SendGrid)

#### `SENDGRID_API_KEY`
- **Purpose**: Send transactional emails
- **Where to get it**: [SendGrid Console](https://app.sendgrid.com/settings/api_keys)
- **Format**: Starts with `SG.`

#### `SENDGRID_FROM_EMAIL`
- **Purpose**: Default sender email address
- **Format**: Valid email address (must be verified in SendGrid)
- **Example**: `hello@skinlabs.co.za`

### AI Services (OpenAI)

#### `OPENAI_API_KEY`
- **Purpose**: Power the SKYNN AI chatbot and skin analysis
- **Where to get it**: [OpenAI Platform](https://platform.openai.com/api-keys)
- **Format**: Starts with `sk-`
- **⚠️ Warning**: Monitor usage to avoid unexpected charges

### Security Keys

#### `JWT_SECRET`
- **Purpose**: Sign JSON Web Tokens
- **Generate**: Run `npm run generate-keys`
- **Requirements**: At least 32 characters, use random hex string

#### `ENCRYPTION_KEY`
- **Purpose**: Encrypt sensitive data
- **Generate**: Run `npm run generate-keys`
- **Requirements**: Exactly 32 characters for AES-256

#### `CONTENT_API_KEY`
- **Purpose**: Secure API endpoints for content management
- **Generate**: Run `npm run generate-keys`
- **Requirements**: At least 24 characters

## Optional Environment Variables

### Analytics

#### `VITE_GA_TRACKING_ID`
- **Purpose**: Google Analytics tracking
- **Where to get it**: [Google Analytics](https://analytics.google.com)
- **Format**: `G-XXXXXXXXXX`

### Monitoring

#### `SENTRY_DSN`
- **Purpose**: Error tracking and monitoring
- **Where to get it**: [Sentry.io](https://sentry.io)
- **Format**: `https://key@sentry.io/project-id`

### File Storage

#### `CLOUDINARY_URL`
- **Purpose**: Image and file storage
- **Where to get it**: [Cloudinary Console](https://cloudinary.com/console)
- **Format**: `cloudinary://api_key:api_secret@cloud_name`

## Environment Files

### Development: `.env`
Use for local development. Contains placeholder values and generated secure keys.

### Production: `.env.production`
Copy from `.env.production.example` and fill with real production values.

### Example Files
- `.env.example` - Template with placeholder values
- `.env.development` - Development-safe defaults
- `.env.production.example` - Production template

## Security Best Practices

### ✅ Do:
- Use different keys for each environment
- Generate random keys with `npm run generate-keys`
- Keep production keys secure and never share them
- Use environment-specific API keys (sandbox for dev, live for prod)

### ❌ Don't:
- Commit `.env` files to version control
- Share API keys in chat or email
- Use the same keys across environments
- Use weak or predictable keys

## Validation

The application validates all environment variables on startup:

- **Development**: Shows warnings for missing/invalid values but continues
- **Production**: Throws errors and stops if required values are missing

## Testing Your Setup

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Check for warnings** in the console output

3. **Test key functionality:**
   - Authentication (sign up/login)
   - Payment processing (sandbox mode)
   - Email sending (use a test email)
   - AI features (with OpenAI key)

## Troubleshooting

### "Missing required environment variables"
- Ensure all required variables are set in `.env`
- Check for typos in variable names
- Verify values are not placeholder text

### Database connection errors
- Verify `DATABASE_URL` format
- Test database connectivity
- Check firewall settings

### API key errors
- Verify keys are valid and active
- Check rate limits and quotas
- Ensure correct environment (sandbox vs live)

### Build errors
- Run `npm run check` to verify TypeScript
- Ensure all dependencies are installed
- Check for import errors

## Getting Help

- Check the [TECHNICAL_CHECKLIST.md](../TECHNICAL_CHECKLIST.md) for implementation details
- Review error messages in the console
- Test with minimal configuration first
- Contact the development team for production key setup