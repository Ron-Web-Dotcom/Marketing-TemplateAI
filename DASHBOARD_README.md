# Marketing Dashboard

## Overview

This project includes a fully AI-powered marketing admin dashboard with comprehensive analytics, insights, and campaign management features. The dashboard is protected by authentication and requires users to sign up or sign in to access.

## Authentication

Users must sign up or sign in to access the dashboard:
- Click "Get Started" or "Start Free Trial" buttons
- Create an account with email and password (minimum 6 characters)
- After successful authentication, users are automatically redirected to the dashboard

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

## Database Schema

The dashboard uses Supabase with the following tables:

- **campaigns**: Marketing campaign data and performance metrics
- **analytics_metrics**: Daily website analytics and conversion data
- **ai_insights**: AI-generated insights, recommendations, and alerts
- **content_performance**: Content-level performance tracking

## Accessing the Dashboard

1. **Sign Up/Sign In**: Click "Download for Free" or "Start Free Trial" on the landing page
2. **Authentication Page**: Complete the sign up or sign in form
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
