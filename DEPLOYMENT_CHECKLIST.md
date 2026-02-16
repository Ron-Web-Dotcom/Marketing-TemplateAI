# Production Deployment Checklist

This comprehensive checklist ensures your application is fully secured, optimized, and ready for production deployment.

---

## 🔒 CRITICAL SECURITY (Must Complete Before Deploy)

### Environment & Secrets

- [ ] **Rotate Supabase Credentials**
  - `.env` file was previously committed to git
  - Generate new Supabase project or rotate anon key
  - Update `.env.local` with new credentials
  - Verify `.env` is in `.gitignore`

- [ ] **Remove Secrets from Git History**
  ```bash
  # Option 1: Using BFG Repo-Cleaner (Recommended)
  bfg --delete-files .env
  git reflog expire --expire=now --all
  git gc --prune=now --aggressive

  # Option 2: Using git filter-branch
  git filter-branch --force --index-filter \
    "git rm --cached --ignore-unmatch .env" \
    --prune-empty --tag-name-filter cat -- --all
  ```

- [ ] **Verify No Hardcoded Secrets**
  ```bash
  # Search for potential secrets in codebase
  grep -r "sk_" . --exclude-dir=node_modules
  grep -r "pk_" . --exclude-dir=node_modules
  grep -r "API_KEY" . --exclude-dir=node_modules
  ```

### Security Headers

- [ ] **Configure Security Headers** (See SECURITY_HEADERS.md)
  - Content-Security-Policy
  - X-Frame-Options: DENY
  - X-Content-Type-Options: nosniff
  - Strict-Transport-Security
  - Referrer-Policy
  - Permissions-Policy

- [ ] **Test Security Headers**
  - Visit https://securityheaders.com
  - Should achieve Grade A or better
  - Fix any issues reported

### Database Security

- [ ] **Verify RLS Policies Are Active**
  ```sql
  -- Run in Supabase SQL Editor
  SELECT tablename, rowsecurity
  FROM pg_tables
  WHERE schemaname = 'public';
  -- All tables should show rowsecurity = true
  ```

- [ ] **Test Data Isolation**
  - Create two test accounts
  - Verify Account A cannot see Account B's data
  - Test all CRUD operations (Create, Read, Update, Delete)
  - Verify campaigns, analytics, insights are isolated

- [ ] **Review RLS Policies for Security Gaps**
  ```sql
  -- Check all policies
  SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
  FROM pg_policies
  WHERE schemaname = 'public';
  ```

### Edge Functions

- [ ] **Verify Edge Functions Are Deployed**
  - `create-checkout` - Payment processing
  - `verify-email-domain` - Email validation with rate limiting

- [ ] **Test Edge Functions**
  - Test rate limiting (should block after 5 requests/minute)
  - Test payment flow with Stripe test mode
  - Verify CORS headers are present
  - Check error responses don't leak sensitive info

---

## 🧪 TESTING & QA

### Authentication Flows

- [ ] **Sign Up Flow**
  - Test with valid email
  - Test with disposable email (should fail)
  - Test with weak password (should fail)
  - Test with strong password (should succeed)
  - Verify trial subscription created automatically

- [ ] **Sign In Flow**
  - Test with correct credentials
  - Test with incorrect password (should fail gracefully)
  - Test with non-existent email (should fail gracefully)
  - Verify error messages don't reveal user existence

- [ ] **Password Reset Flow**
  - Test forgot password email delivery
  - Verify reset link works
  - Test expired reset link (if applicable)

- [ ] **OAuth Flows** (If Enabled)
  - Test Google OAuth
  - Test Apple OAuth
  - Verify proper error handling

### Dashboard & Data

- [ ] **Dashboard Loading**
  - Verify dashboard loads for authenticated users
  - Verify unauthenticated users redirected to /auth
  - Verify expired trial users redirected to /upgrade
  - Test with empty data (new user)
  - Test with populated data

- [ ] **Data Operations**
  - Test creating campaigns
  - Test updating campaigns
  - Test deleting campaigns
  - Verify all changes persist after refresh

### Payment Flow

- [ ] **Stripe Integration**
  - **CRITICAL**: Test with Stripe test mode ONLY
  - Test checkout flow with test card: `4242 4242 4242 4242`
  - Verify redirect to Stripe Checkout
  - Test successful payment (redirects to /dashboard)
  - Test canceled payment (redirects to /upgrade)
  - Verify subscription status updates in database

- [ ] **Stripe Test Cards**
  - Success: `4242 4242 4242 4242`
  - Decline: `4000 0000 0000 0002`
  - 3D Secure: `4000 0025 0000 3155`

### Error Handling

- [ ] **Error Boundary**
  - Force a React error (modify component to throw)
  - Verify error boundary catches it
  - Verify user sees friendly error message
  - Verify no white screen of death

- [ ] **Network Errors**
  - Test with offline mode (DevTools)
  - Verify graceful error messages
  - Test with slow 3G throttling

- [ ] **Edge Cases**
  - Test division by zero (ROI calculation)
  - Test empty states (no campaigns)
  - Test very long campaign names
  - Test special characters in inputs

### Cross-Browser Testing

- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Responsive Design

- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)
- [ ] Mobile (320x568) - iPhone SE

---

## ⚡ PERFORMANCE & OPTIMIZATION

### Build Optimization

- [ ] **Run Production Build**
  ```bash
  npm run build
  ```
  - Build should complete successfully
  - No TypeScript errors
  - No ESLint errors

- [ ] **Analyze Bundle Size**
  - Check build output for warnings
  - Bundle should be <1MB gzipped (currently ~220KB)
  - Consider code splitting if needed

### Performance Testing

- [ ] **Lighthouse Audit** (Chrome DevTools)
  - Performance: >90
  - Accessibility: >90
  - Best Practices: >90
  - SEO: >90

- [ ] **Core Web Vitals**
  - LCP (Largest Contentful Paint): <2.5s
  - FID (First Input Delay): <100ms
  - CLS (Cumulative Layout Shift): <0.1

### Image Optimization

- [ ] Verify hero image loads properly
- [ ] Check image dimensions match actual display size
- [ ] Verify lazy loading working (if applicable)
- [ ] Consider using WebP format for better compression

---

## 📊 MONITORING & ERROR TRACKING

### Error Tracking Setup

- [ ] **Choose Error Tracking Service**
  - Recommended: Sentry (https://sentry.io)
  - Alternative: LogRocket, Bugsnag, Rollbar

- [ ] **Install Sentry** (Example)
  ```bash
  npm install @sentry/react
  ```

- [ ] **Configure Sentry**
  ```typescript
  // src/main.tsx
  import * as Sentry from "@sentry/react";

  Sentry.init({
    dsn: "YOUR_SENTRY_DSN",
    environment: import.meta.env.MODE,
    integrations: [
      new Sentry.BrowserTracing(),
      new Sentry.Replay()
    ],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
  ```

- [ ] **Test Error Tracking**
  - Trigger a test error
  - Verify it appears in Sentry dashboard

### Analytics Setup

- [ ] **Choose Analytics Service**
  - Recommended: Plausible (privacy-friendly)
  - Alternative: Google Analytics 4, Fathom

- [ ] **Install Analytics Script**
  - Add to index.html <head>
  - Verify tracking working in dashboard

- [ ] **Set Up Key Events**
  - Sign up completed
  - Trial started
  - Payment completed
  - Campaign created

---

## 🚀 DEPLOYMENT PLATFORM CONFIGURATION

### Environment Variables

- [ ] **Configure Production Environment Variables**
  ```
  VITE_SUPABASE_URL=your-production-url
  VITE_SUPABASE_ANON_KEY=your-production-anon-key
  ```

### DNS & Domain

- [ ] Domain purchased and configured
- [ ] SSL certificate installed (usually automatic)
- [ ] HTTPS enforced (no HTTP access)
- [ ] www redirect configured (if applicable)

### Supabase Configuration

- [ ] **Verify Production Supabase Project**
  - Not using same database as development
  - RLS policies enabled on all tables
  - Edge functions deployed

- [ ] **Stripe Configuration**
  - Stripe account in production mode
  - Webhook endpoints configured
  - Test mode disabled

### Platform-Specific Steps

#### Vercel
- [ ] Connect Git repository
- [ ] Configure build command: `npm run build`
- [ ] Configure output directory: `dist`
- [ ] Add environment variables
- [ ] Add `vercel.json` for security headers
- [ ] Enable automatic deployments

#### Netlify
- [ ] Connect Git repository
- [ ] Configure build command: `npm run build`
- [ ] Configure publish directory: `dist`
- [ ] Add environment variables
- [ ] Add `netlify.toml` for security headers
- [ ] Enable automatic deployments

---

## 📄 LEGAL & COMPLIANCE

### Required Pages

- [ ] **Privacy Policy**
  - Create privacy policy page
  - Link from footer
  - Link from sign up form
  - Covers: Data collection, usage, storage, deletion

- [ ] **Terms of Service**
  - Create terms of service page
  - Link from footer
  - Link from sign up form
  - Covers: User obligations, liability, termination

- [ ] **Cookie Policy** (if using cookies)
  - Explain what cookies are used
  - Link from footer

### GDPR Compliance (If Serving EU Users)

- [ ] Cookie consent banner implemented
- [ ] Data export functionality
- [ ] Data deletion functionality
- [ ] Privacy policy includes GDPR rights
- [ ] DPA (Data Processing Agreement) if needed

### CCPA Compliance (If Serving CA Users)

- [ ] "Do Not Sell My Information" link in footer
- [ ] Privacy policy includes CCPA rights
- [ ] Data deletion request process

---

## 📱 POST-DEPLOYMENT VERIFICATION

### Smoke Tests (Immediately After Deploy)

- [ ] Visit homepage - loads correctly
- [ ] Click "Get Started" - navigates to auth
- [ ] Sign up with test account - succeeds
- [ ] Dashboard loads - no errors
- [ ] Sign out - works
- [ ] Sign in - works
- [ ] Test payment flow - completes successfully

### Monitoring (First 24 Hours)

- [ ] Check error tracking dashboard hourly
- [ ] Monitor server response times
- [ ] Watch for spike in 404s or 500s
- [ ] Monitor database query performance
- [ ] Check Stripe dashboard for test transactions

### Ongoing Monitoring

- [ ] Set up uptime monitoring (e.g., UptimeRobot)
- [ ] Configure alerts for:
  - Downtime (>5 minutes)
  - Error rate spike (>5% errors)
  - Slow response times (>3s)
  - Failed payments

---

## 🔄 ROLLBACK PLAN

If critical issues are discovered post-deployment:

1. **Immediate Actions**
   - [ ] Revert to previous deployment (platform-specific)
   - [ ] Notify users via status page (if applicable)
   - [ ] Disable new sign-ups temporarily if needed

2. **Investigation**
   - [ ] Check error tracking logs
   - [ ] Review recent code changes
   - [ ] Identify root cause

3. **Fix & Redeploy**
   - [ ] Fix issue in development
   - [ ] Test thoroughly
   - [ ] Deploy fix
   - [ ] Verify fix in production

---

## ✅ FINAL SIGN-OFF

### Stakeholder Approvals

- [ ] Technical lead approval
- [ ] Security review completed
- [ ] Legal review completed (Privacy/Terms)
- [ ] Product owner approval

### Documentation

- [ ] README updated with deployment instructions
- [ ] API documentation current
- [ ] Environment variables documented
- [ ] Troubleshooting guide created

### Handoff

- [ ] On-call rotation defined
- [ ] Escalation procedures documented
- [ ] Access credentials shared securely
- [ ] Monitoring dashboard access granted

---

## 🎉 DEPLOYMENT COMPLETE!

Once all items are checked:

1. Tag the release in Git:
   ```bash
   git tag -a v1.0.0 -m "Initial production release"
   git push origin v1.0.0
   ```

2. Announce deployment to team

3. Monitor closely for first 48 hours

4. Celebrate! 🎊

---

## 📞 SUPPORT CONTACTS

**Emergency Contacts:**
- Technical Lead: [Name/Contact]
- DevOps: [Name/Contact]
- On-Call: [Phone/Slack]

**Service Providers:**
- Hosting: [Platform Support]
- Database: Supabase Support
- Payments: Stripe Support
- DNS: [Provider Support]

---

**Last Updated:** 2026-02-16
**Next Review:** Before next major release
