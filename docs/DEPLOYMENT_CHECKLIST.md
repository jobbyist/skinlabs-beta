# Deployment Checklist

This checklist ensures all environment variables and configurations are properly set up for deployment.

## Pre-Deployment Environment Verification

### ✅ Database Configuration
- [ ] `DATABASE_URL` is set to production database
- [ ] Database is accessible from deployment environment
- [ ] Database migrations have been run (`npm run db:migrate`)
- [ ] Database has been seeded if needed (`npm run db:seed`)

### ✅ Authentication (Clerk)
- [ ] `CLERK_SECRET_KEY` is set to production key (starts with `sk_live_`)
- [ ] `VITE_CLERK_PUBLISHABLE_KEY` is set to production key (starts with `pk_live_`)
- [ ] Clerk dashboard is configured with correct domains
- [ ] OAuth providers are configured if used

### ✅ Payment Processing (PayPal)
- [ ] `PAYPAL_CLIENT_ID` is set to live credentials (NOT sandbox)
- [ ] `PAYPAL_CLIENT_SECRET` is set to live credentials (NOT sandbox)
- [ ] PayPal webhook endpoints are configured
- [ ] Payment flow has been tested in sandbox

### ✅ Email Service (SendGrid)
- [ ] `SENDGRID_API_KEY` is set to production key
- [ ] `SENDGRID_FROM_EMAIL` is verified in SendGrid
- [ ] Email templates are working
- [ ] Email delivery is tested

### ✅ AI Services (OpenAI)
- [ ] `OPENAI_API_KEY` is set and has sufficient credits
- [ ] Usage limits are configured appropriately
- [ ] API usage is being monitored

### ✅ Security Configuration
- [ ] `JWT_SECRET` is generated and unique (minimum 64 characters)
- [ ] `ENCRYPTION_KEY` is generated and unique (exactly 32 characters)
- [ ] `CONTENT_API_KEY` is generated and unique (minimum 48 characters)
- [ ] All keys are different from development environment

### ✅ Optional Services
- [ ] `VITE_GA_TRACKING_ID` is set if using Google Analytics
- [ ] `SENTRY_DSN` is set if using error monitoring
- [ ] `CLOUDINARY_URL` is set if using image storage

### ✅ System Configuration
- [ ] `NODE_ENV` is set to "production"
- [ ] `PORT` is configured correctly for hosting platform
- [ ] SSL/HTTPS is enabled
- [ ] Domain name is configured

## Build & Test

### ✅ Local Testing
- [ ] `npm run build` completes successfully
- [ ] `npm run check` passes TypeScript validation
- [ ] All environment variables validate correctly
- [ ] Key functionality works with production-like settings

### ✅ Production Environment
- [ ] Environment variables are set in hosting platform
- [ ] Build process works in production environment
- [ ] Static assets are served correctly
- [ ] API endpoints are accessible

## Post-Deployment Verification

### ✅ Application Health
- [ ] Application starts without errors
- [ ] Database connectivity is working
- [ ] Authentication flow works
- [ ] Payment processing works
- [ ] Email sending works
- [ ] AI features are functional

### ✅ Monitoring
- [ ] Error monitoring is active (Sentry)
- [ ] Analytics tracking is working (Google Analytics)
- [ ] Performance monitoring is configured
- [ ] Log aggregation is working

### ✅ Security
- [ ] HTTPS is enforced
- [ ] Security headers are configured
- [ ] Rate limiting is active
- [ ] CORS policies are configured correctly

## Environment Variable Security Checklist

### ✅ Before Deployment
- [ ] All production keys are different from development
- [ ] No placeholder values remain in environment variables
- [ ] API keys are valid and active
- [ ] Database credentials are secure
- [ ] Keys have appropriate permissions/scopes

### ✅ After Deployment
- [ ] Environment variables are not exposed in client-side code
- [ ] Server logs don't contain sensitive information
- [ ] API keys are not in version control
- [ ] Backup of environment configuration exists (securely stored)

## Quick Verification Script

Run this command to verify all required environment variables are set:

```bash
npm run dev --silent 2>&1 | grep -E "(Missing|Warning|Error)" || echo "✅ All environment variables are configured"
```

## Emergency Rollback Plan

### If Environment Issues Occur:
1. **Immediate**: Revert to previous working environment configuration
2. **Identify**: Which environment variable is causing the issue
3. **Fix**: Update the problematic variable
4. **Test**: Verify fix in staging environment first
5. **Deploy**: Apply fix to production

### Backup Procedures:
- Keep encrypted backup of production environment variables
- Document all environment variable changes
- Test environment variable changes in staging first
- Have rollback plan for each deployment

## Platform-Specific Notes

### Vercel/Netlify
- Environment variables set in dashboard
- Automatic HTTPS
- Check function timeout limits

### Railway/Render
- Environment variables in service settings
- Database connection via private network
- Monitor resource usage

### Docker Deployment
- Use `.env.production` file or container environment
- Ensure network connectivity between services
- Volume mounts for persistent data

## Success Criteria

✅ **Deployment is successful when:**
- Application starts without environment-related errors
- All core functionality works (auth, payments, email, AI)
- No sensitive data is exposed
- Monitoring and logging are functional
- Performance meets expectations

❌ **Deployment should be rolled back if:**
- Environment variables cause application crashes
- Critical functionality is broken
- Security vulnerabilities are detected
- Performance is severely degraded