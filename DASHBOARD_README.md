# Marketing Dashboard

## Overview

This project includes a fully AI-powered marketing admin dashboard with comprehensive analytics, insights, and campaign management features. The dashboard is protected by authentication and requires users to sign up or sign in to access.

## Authentication & Trial System

### Sign Up & Trial
Users can sign up or sign in using multiple authentication methods:
- **Email/Password**: Traditional sign up with email and password (minimum 6 characters)
- **Google Sign-In**: One-click authentication with your Google account
- **Apple Sign-In**: Secure authentication with your Apple ID
- Click "Get Started", "Start Free Trial", or "Download for Free" buttons
- Automatically receive a **14-day free trial** upon signup
- After successful authentication, users are automatically redirected to the dashboard

**OAuth Configuration:**
- Google and Apple OAuth must be configured in Supabase Dashboard
- See [OAUTH_SETUP.md](./OAUTH_SETUP.md) for detailed setup instructions
- Email/Password authentication works without additional configuration

### Trial Features
- **14-day trial period** automatically starts when you create an account
- Trial status banner displays days remaining in the dashboard
- Full access to all features during the trial period
- No credit card required to start the trial

### After Trial Expiration
- After 14 days, trial expires and dashboard access is blocked
- Users are automatically redirected to the upgrade page
- Must upgrade to Enterprise plan ($299/month) to continue using the platform
- Cannot access dashboard without an active subscription

### Payment & Upgrade
- Secure payment processing via Stripe
- **Multiple payment methods available**:
  - Credit/Debit Card
  - PayPal
  - Google Pay
  - Apple Pay
- Enterprise plan: $299/month
- Instant access after successful payment
- Cancel anytime through your account

### Contact Information
For Enterprise plan inquiries: **ront.devops@gmail.com**

## Features

### 1. **Real-time Analytics**
- Page views and unique visitors tracking
- Revenue monitoring
- Conversion rate analysis
- Daily comparison metrics with percentage changes

### 2. **AI-Powered Insights**
- Automatic recommendations based on campaign performance
- SEO opportunities and content gap analysis
- Performance alerts for declining metrics
- Best practice suggestions with impact ratings (high/medium/low)

### 3. **Campaign Management**
- Overview of all marketing campaigns
- Real-time status tracking (active/paused/completed)
- Performance metrics including CTR, CVR, spend, and revenue
- ROI calculations

### 4. **Content Performance**
- Top-performing content ranking
- Engagement metrics
- Time on page analytics
- Conversion tracking per content piece

### 5. **Key Metrics Dashboard**
- Total campaign spend and revenue
- Overall ROI calculation
- Total clicks and conversions
- Visual indicators for performance trends with proper percentage calculations (no NaN values)

### 6. **Live Status Indicator**
- Animated live indicator showing real-time dashboard status
- Pulses every 5 seconds to indicate active connection
- Green dot with pulsing animation

### 7. **Subscription Management**
- Clear trial status display showing days remaining
- Upgrade button prominently displayed during trial
- Enterprise plan badge when subscription is active
- Automatic trial expiration enforcement

## Database Schema

The dashboard uses Supabase with the following tables:

- **campaigns**: Marketing campaign data and performance metrics
- **analytics_metrics**: Daily website analytics and conversion data
- **ai_insights**: AI-generated insights, recommendations, and alerts
- **content_performance**: Content-level performance tracking

## Interactive Features

### Watch Demo
- Click "Watch Demo" button on the homepage to view a product demonstration
- Opens in a new tab for easy viewing

### Request Integration
- Don't see your favorite tool in our integrations list?
- Click "Request an Integration" at the bottom of the Integrations section
- Fill out the simple form with:
  - Integration name
  - Your email
  - Why you need this integration
- We review all requests and prioritize based on demand

## Accessing the Dashboard

1. **Sign Up/Sign In**: Click "Download for Free" or "Start Free Trial" on the landing page
2. **Authentication Page**: Complete the sign up or sign in form using:
   - Email and password
   - Google Sign-In (one-click)
   - Apple Sign-In (secure)
3. **Automatic Redirect**: After successful authentication, you'll be redirected to the dashboard
4. **Direct Access**: If already authenticated, navigate to `/dashboard`
5. **Sign Out**: Click the "Sign Out" button in the dashboard header to log out
6. **Back to Home**: Use the back arrow button in the dashboard header

**Note**: Dashboard access is hidden from public navigation for security. Users must authenticate first.

## Sample Data

The database includes pre-populated sample data:
- 5 marketing campaigns with realistic metrics
- 30 days of historical analytics data
- 6 AI-generated insights and recommendations
- Top performing content pieces

## AI Capabilities

The dashboard demonstrates AI-powered features:

1. **Performance Analysis**: Automatically detects campaigns performing above/below target
2. **Budget Optimization**: Suggests budget allocation changes based on performance
3. **Content Recommendations**: Identifies content patterns that drive conversions
4. **SEO Opportunities**: Finds keyword and content gaps with high potential
5. **Timing Optimization**: Identifies peak conversion times for campaign scheduling
6. **Creative Refresh Alerts**: Notifies when ad creative needs updating

## Color Scheme

The dashboard maintains consistency with the main site:
- Primary: Orange to Amber gradients (#EA580C to #F59E0B)
- Backgrounds: Warm orange and amber tints
- Accents: Orange for highlights and CTAs

## Technology Stack

- **Frontend**: React + TypeScript + Vite
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Built-in metric cards and visualizations

## Future Enhancements

Potential additions:
- Interactive charts with Chart.js or Recharts
- Real-time data updates via Supabase subscriptions
- Campaign creation and editing forms
- Export capabilities for reports
- Advanced filtering and date range selection
- Team collaboration features
- Integration with actual marketing platforms (Google Ads, Facebook Ads, etc.)
