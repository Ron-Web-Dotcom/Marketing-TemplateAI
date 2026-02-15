# Stripe Integration Setup Guide

## Overview

Your application now includes a complete 14-day trial system with Stripe payment integration for Enterprise upgrades.

## How It Works

### 1. User Sign Up Flow
1. User creates account via the auth page
2. Trial subscription is automatically created
3. Trial period: 14 days from signup date
4. Full dashboard access during trial

### 2. Trial Period
- **Duration**: 14 days from signup
- **Access**: Full access to all dashboard features
- **Status Display**: Banner shows days remaining
- **No Payment Required**: No credit card needed to start

### 3. Trial Expiration
- After 14 days, trial status changes to "expired"
- User is redirected to upgrade page when accessing dashboard
- Dashboard access is blocked until payment

### 4. Upgrade to Enterprise
- **Price**: $299/month
- **Payment**: Stripe credit card processing
- **Features**: Unlimited campaigns, AI insights, priority support
- **Instant Access**: Dashboard unlocks immediately after payment

## Stripe Configuration

### Required Setup

To enable payment processing, you need to configure Stripe:

1. **Create Stripe Account**
   - Go to https://stripe.com
   - Sign up for an account

2. **Get API Keys**
   - Navigate to Developers → API Keys
   - Copy your Secret Key (starts with `sk_`)

3. **Configure Environment**
   - The Stripe secret key is stored as `STRIPE_SECRET_KEY` in your Supabase Edge Function environment
   - This is automatically configured for you

### Important Notes

- **Test Mode**: During development, use Stripe test keys (they start with `sk_test_`)
- **Live Mode**: For production, use live keys (they start with `sk_live_`)
- **Security**: Never expose secret keys in client-side code

### Test Card Numbers

For testing payments in development:
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- Use any future expiry date and any 3-digit CVC

## Database Schema

The subscription system uses the `user_subscriptions` table:

```sql
- id: Unique identifier
- user_id: Links to auth.users
- trial_start_date: When trial began
- trial_end_date: When trial ends (14 days after start)
- subscription_status: trial | active | expired | cancelled
- plan_type: trial | enterprise
- stripe_customer_id: Stripe customer reference
- stripe_subscription_id: Stripe subscription reference
- stripe_payment_method_id: Saved payment method
```

## Edge Function

The `create-checkout` edge function handles:
1. Creating Stripe customer
2. Processing payment method
3. Creating subscription
4. Updating database with subscription details

## User Experience

### Trial User
- Sees trial banner with countdown
- Can upgrade anytime via "Upgrade Now" button
- At expiration, automatically redirected to upgrade page

### Enterprise User
- Sees "Enterprise Plan Active" badge
- Full access to all features
- No trial limitations

## Contact Information

For questions or Enterprise inquiries: **ront.devops@gmail.com**

## Security Features

- Row Level Security (RLS) on subscriptions table
- Users can only access their own subscription data
- Stripe API calls made from secure edge function
- Payment details never stored in database
- PCI-compliant payment processing through Stripe
