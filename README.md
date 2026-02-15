# Marketing-TemplateAI

A modern, AI-powered marketing platform with comprehensive analytics dashboard, subscription management, and multiple payment options.

## Features

- **Multiple Authentication Methods**
  - Email/Password authentication
  - Google OAuth sign-in
  - Apple OAuth sign-in
  - 14-day free trial for all new users

- **Payment Integration**
  - Credit/Debit card payments
  - PayPal
  - Google Pay
  - Apple Pay

- **AI-Powered Dashboard**
  - Real-time analytics
  - Campaign management
  - AI-generated insights
  - Content performance tracking

## OAuth Setup

This application supports Google and Apple OAuth authentication. To enable these features:

1. See [OAUTH_SETUP.md](./OAUTH_SETUP.md) for detailed step-by-step configuration instructions
2. Configure OAuth providers in your Supabase Dashboard
3. Add redirect URIs to Google Cloud Console and Apple Developer Portal

**Note:** Without OAuth configuration, users can still sign up/sign in using email and password.

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables (see `.env` file)

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Documentation

- [Dashboard Guide](./DASHBOARD_README.md) - Complete dashboard features and functionality
- [OAuth Setup](./OAUTH_SETUP.md) - Google and Apple authentication configuration
- [Stripe Setup](./STRIPE_SETUP.md) - Payment processing configuration

## Technology Stack

- **Frontend:** React + TypeScript + Vite
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth (Email, Google, Apple)
- **Payments:** Stripe
- **Icons:** Lucide React

## Support

For questions or support, contact: **ront.devops@gmail.com**
