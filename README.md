# ⚡ NeuralFlow AI Platform

> AI-Powered Workflow Automation & Marketing Dashboard

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.x-61dafb)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38bdf8)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ecf8e)](https://supabase.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635bff)](https://stripe.com/)

---

## Overview

**NeuralFlow** is a production-ready, full-stack SaaS template that combines a high-converting marketing landing page with a real-time AI-powered marketing dashboard. Built for teams that want to launch fast, it includes multi-provider authentication, a 14-day free trial system, Stripe subscription billing, and a fully functional analytics dashboard — all out of the box.

Whether you're a solo developer shipping an MVP or a team building a production SaaS product, NeuralFlow provides the foundation you need.

---

## Live Demo

🔗 **[View Live Demo](https://neuralflow-ai-dashboard-1rjkqwij.live.blink.new)**

---

## Features

### Marketing Landing Page
- **Responsive Navigation** — Sticky header with scroll-aware blur, mobile hamburger drawer
- **Hero Section** — Gradient headline, dual CTAs, hero image with glow backdrop
- **Trust Bar** — Key metrics (500K+ users, 4.9/5 rating) and partner logos
- **Features Grid** — 6 feature cards with dynamic Lucide icons
- **How It Works** — 3-step walkthrough with connecting lines
- **Use Cases** — 4-column audience segment grid
- **Benefits** — Dark-themed ROI statistics section
- **Integrations** — 12-app grid with "Request Integration" modal
- **Testimonials** — 3-column customer quotes with star ratings
- **Pricing Tiers** — Free / Pro / Enterprise with highlighted popular tier
- **FAQ Accordion** — Accessible accordion with ARIA attributes
- **Final CTA** — Bottom-of-page conversion block
- **Footer** — 5-column footer with social links

### Authentication System
- **Email/Password** — Sign up, sign in, password reset
- **OAuth** — Google and Apple social login via Supabase
- **Email Validation** — Client-side format check + server-side DNS MX verification
- **Password Policy** — 8+ characters, uppercase, lowercase, digit, special character
- **Disposable Email Blocking** — Blocklist of known throwaway email domains

### Marketing Dashboard (Protected)
- **KPI Cards** — Page views, visitors, revenue, conversion rate with day-over-day change
- **AI Insights Panel** — Recommendations, alerts, and actionable insights
- **Campaign Overview** — Total spend, revenue, ROI, clicks, conversions
- **Active Campaigns List** — CTR and CVR breakdowns per campaign
- **Top Content** — Views, average time, conversions per content piece
- **Live Indicator** — Animated pulse showing real-time data status
- **Trial Banner** — Countdown showing remaining trial days with upgrade CTA

### Subscription & Billing
- **14-Day Free Trial** — Auto-provisioned on sign-up
- **Stripe Checkout** — Secure hosted payment page for Enterprise upgrade ($299/mo)
- **Subscription Management** — Status tracking (trial → active → expired → cancelled)
- **Payment Webhooks** — Success/cancel redirect handling

### Developer Experience
- **TypeScript** — End-to-end type safety
- **JSDoc Documentation** — Every file, function, and interface documented
- **Centralised Configuration** — Single `config.ts` for all brand/copy changes
- **Error Boundary** — Graceful error handling with dev-mode stack traces
- **CSS Linting Scripts** — Automated checks for undefined CSS classes and variables
- **Environment Validation** — Runtime checks for required env vars

---

## Tech Stack

| Layer         | Technology                         |
|---------------|------------------------------------|
| **Frontend**  | React 18, TypeScript 5, Vite       |
| **Styling**   | Tailwind CSS 3, shadcn/ui          |
| **Icons**     | Lucide React                       |
| **Backend**   | Supabase (PostgreSQL + Auth + Edge Functions) |
| **Payments**  | Stripe (Checkout Sessions API)     |
| **Hosting**   | Blink.new / Netlify / Vercel       |

---

## Project Structure

```
├── public/                         # Static assets (favicon, redirects)
├── scripts/                        # Build-time validation scripts
│   ├── check-css-classes.js        #   Detects undefined CSS classes
│   └── check-css-variables.js      #   Validates CSS variable consistency
├── src/
│   ├── components/
│   │   ├── sections/               # Landing page sections (Hero, Features, etc.)
│   │   │   ├── Hero.tsx
│   │   │   ├── TrustBar.tsx
│   │   │   ├── Features.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── UseCases.tsx
│   │   │   ├── Benefits.tsx
│   │   │   ├── Integrations.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   ├── Pricing.tsx
│   │   │   ├── FAQ.tsx
│   │   │   ├── FinalCTA.tsx
│   │   │   └── Footer.tsx
│   │   ├── ui/                     # shadcn/ui primitives (button, card, dialog, etc.)
│   │   ├── Button.tsx              # Reusable CTA button (primary/secondary/outline)
│   │   ├── Card.tsx                # Generic hover-enabled card container
│   │   ├── ErrorBoundary.tsx       # Global React error boundary
│   │   ├── Navigation.tsx          # Responsive sticky navbar
│   │   ├── Section.tsx             # Page section wrapper (padding, background)
│   │   └── SectionHeader.tsx       # Section title + subtitle molecule
│   ├── contexts/
│   │   ├── AuthContext.tsx          # Authentication + subscription provider
│   │   └── NavigationContext.tsx    # Client-side routing via History API
│   ├── hooks/
│   │   └── use-mobile.tsx          # Responsive breakpoint hook
│   ├── lib/
│   │   ├── supabase.ts             # Supabase client + DB type interfaces
│   │   └── utils.ts                # Tailwind `cn()` class merger
│   ├── pages/
│   │   ├── Auth.tsx                # Sign-in / sign-up / password reset
│   │   ├── Dashboard.tsx           # Protected marketing dashboard
│   │   └── Upgrade.tsx             # Stripe Enterprise checkout
│   ├── utils/
│   │   ├── env.ts                  # Environment variable validation
│   │   └── subscription.ts         # Trial / subscription CRUD + status helpers
│   ├── App.tsx                     # Root component with route switching
│   ├── config.ts                   # Centralised brand + content configuration
│   ├── index.css                   # Tailwind base + custom utilities
│   ├── main.tsx                    # Application entry point
│   └── vite-env.d.ts              # Vite type declarations
├── supabase/
│   ├── functions/
│   │   ├── create-checkout/        # Edge Function: Stripe Checkout Session
│   │   └── verify-email-domain/    # Edge Function: DNS-based email verification
│   └── migrations/
│       ├── 20260215062815_create_marketing_dashboard_schema.sql
│       ├── 20260215162628_create_user_subscriptions.sql
│       └── 20260215233115_add_user_id_and_fix_rls_policies.sql
├── index.html                      # HTML shell with SEO meta tags
├── tailwind.config.js              # Tailwind configuration
├── tsconfig.json                   # TypeScript configuration
├── vite.config.ts                  # Vite build configuration
└── package.json                    # Dependencies and scripts
```

---

## Installation

### Prerequisites

- **Node.js** 18+ and **npm** (or Bun)
- A **Supabase** project ([create one free](https://supabase.com/dashboard))
- A **Stripe** account ([sign up free](https://dashboard.stripe.com/register))

### 1. Clone the Repository

```bash
git clone https://github.com/Ron-Web-Dotcom/Marketing-TemplateAI.git
cd Marketing-TemplateAI
```

### 2. Install Dependencies

```bash
npm install
# or
bun install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

See the [Environment Variables](#environment-variables) section below for the full list.

### 4. Run Database Migrations

Apply the SQL migrations in your Supabase Dashboard → SQL Editor:

1. `supabase/migrations/20260215062815_create_marketing_dashboard_schema.sql`
2. `supabase/migrations/20260215162628_create_user_subscriptions.sql`
3. `supabase/migrations/20260215233115_add_user_id_and_fix_rls_policies.sql`

### 5. Deploy Edge Functions

Deploy the Supabase Edge Functions:

```bash
supabase functions deploy create-checkout
supabase functions deploy verify-email-domain
```

Set the required secrets:

```bash
supabase secrets set STRIPE_SECRET_KEY=sk_live_...
supabase secrets set APP_URL=https://your-domain.com
```

### 6. Start Development Server

```bash
npm run dev
# or
bun dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Environment Variables

| Variable                  | Required | Description                                     |
|---------------------------|----------|-------------------------------------------------|
| `VITE_SUPABASE_URL`      | ✅       | Your Supabase project URL                       |
| `VITE_SUPABASE_ANON_KEY` | ✅       | Supabase anonymous/public API key               |
| `STRIPE_SECRET_KEY`      | ✅ *     | Stripe secret key (Edge Function only)          |
| `SUPABASE_URL`           | Auto     | Set automatically in Edge Function runtime      |
| `SUPABASE_SERVICE_ROLE_KEY` | Auto  | Set automatically in Edge Function runtime      |
| `APP_URL`                | Optional | Override for checkout success/cancel redirects  |

\* Only required on the Supabase Edge Function runtime (set via `supabase secrets set`).

---

## Deployment

### Blink.new (Recommended)

The project is auto-deployed to:
```
https://neuralflow-ai-dashboard-1rjkqwij.live.blink.new
```

### Netlify / Vercel / Cloudflare Pages

```bash
# Build the production bundle
npm run build

# Output is in the `dist/` directory
```

Configure your hosting provider:
- **Build command**: `npm run build`
- **Output directory**: `dist`
- **Environment variables**: Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

The included `public/_redirects` file handles SPA routing for Netlify.

---

## API Documentation

### Edge Functions

#### `POST /functions/v1/create-checkout`

Creates a Stripe Checkout Session for the Enterprise plan.

**Headers**:
```
Authorization: Bearer <SUPABASE_ANON_KEY>
Content-Type: application/json
```

**Request Body**:
```json
{
  "userId": "uuid-string",
  "email": "user@example.com"
}
```

**Success Response** (`200`):
```json
{
  "success": true,
  "sessionId": "cs_live_...",
  "checkoutUrl": "https://checkout.stripe.com/c/pay/cs_live_..."
}
```

**Error Responses**:
- `400` — Missing fields or Stripe API error
- `503` — Stripe secret key not configured

---

#### `POST /functions/v1/verify-email-domain`

Validates an email domain via DNS MX record lookup.

**Headers**:
```
Authorization: Bearer <SUPABASE_ANON_KEY>
Content-Type: application/json
```

**Request Body**:
```json
{
  "domain": "gmail.com"
}
```

**Success Response** (`200`):
```json
{
  "isValid": true,
  "reason": "Valid domain"
}
```

**Error Responses**:
- `400` — Missing or invalid domain
- `429` — Rate limit exceeded (5 requests per minute per IP)
- `500` — DNS lookup failure

**Rate Limit Headers**:
```
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 4
X-RateLimit-Reset: 1708560000000
```

---

## Authentication

### Supported Providers

| Provider       | Setup Required        |
|----------------|-----------------------|
| Email/Password | Works out of the box  |
| Google OAuth   | Enable in Supabase Dashboard → Auth → Providers |
| Apple OAuth    | Enable in Supabase Dashboard → Auth → Providers |

### Auth Flow

1. User navigates to `/auth`
2. Enters email/password or clicks OAuth button
3. Email domain is verified via the `verify-email-domain` Edge Function
4. On success, a 14-day trial subscription is created automatically
5. User is redirected to `/dashboard`
6. Protected routes check `trialStatus` — expired trials redirect to `/upgrade`

### Password Requirements

- Minimum 8 characters, maximum 72 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one digit (0-9)
- At least one special character (!@#$%^&\*)

---

## Database Schema

### Tables

| Table                | Description                                 |
|----------------------|---------------------------------------------|
| `campaigns`          | Marketing campaigns with budget and metrics |
| `analytics_metrics`  | Daily analytics snapshots (views, revenue)  |
| `ai_insights`        | AI-generated recommendations and alerts     |
| `content_performance`| Content engagement and conversion data      |
| `user_subscriptions` | Trial and subscription status per user      |

### Row-Level Security

All tables enforce RLS policies so users can only access their own data:
- `auth.uid() = user_id` for SELECT, INSERT, UPDATE, DELETE
- `user_subscriptions` uses `auth.uid() = user_id` for all operations

---

## Troubleshooting

| Problem                                    | Solution                                                                                                 |
|--------------------------------------------|----------------------------------------------------------------------------------------------------------|
| **Blank page after deploy**                | Ensure `index.html` loads `/src/main.tsx`. Check that env vars are set in hosting provider.              |
| **"Missing required environment variable"**| Create a `.env` file with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.                             |
| **Google/Apple OAuth not working**         | Enable the provider in Supabase Dashboard → Auth → Providers. See `OAUTH_ENABLE_NOW.md`.                |
| **Stripe checkout returns 503**            | Set `STRIPE_SECRET_KEY` via `supabase secrets set STRIPE_SECRET_KEY=sk_live_...`.                        |
| **Dashboard shows no data**               | Run the SQL migrations to create tables and seed sample data.                                            |
| **Rate limit on email verification**       | The edge function allows 5 requests per IP per minute. Wait and retry.                                   |
| **Trial expired but user can still access**| The `checkTrialStatus` function auto-marks expired trials. Clear browser cache and re-login.             |

---

## Security Notes

### Environment Protection
- All secrets are stored as environment variables — never committed to source control
- `VITE_` prefix variables are the **only** values exposed to the browser
- Stripe secret key lives exclusively on the server (Edge Function runtime)

### Input Validation
- Email: format check → disposable domain blocklist → TLD allowlist → DNS MX verification
- Password: length + complexity requirements enforced client-side and server-side
- All Supabase queries use parameterised inputs (no raw SQL in the frontend)

### Rate Limiting
- Email domain verification: 5 requests per IP per 60-second window
- Automatic cleanup of stale rate-limit entries to prevent memory leaks

### Row-Level Security
- PostgreSQL RLS enforced on every table
- All data is scoped to `user_id = auth.uid()`
- Service role key is only used server-side in Edge Functions

### CORS
- Edge Functions include restrictive CORS headers
- Preflight (`OPTIONS`) requests are handled explicitly

### Error Handling
- Global `ErrorBoundary` catches unhandled React errors
- Edge Functions return structured JSON errors — never expose stack traces
- Dev-mode error details are hidden in production builds

---

## Customisation

### Re-branding

Edit `src/config.ts` to change:
- Brand name, logo, and tagline
- Hero headline, sub-headline, and CTA text
- Feature titles and descriptions
- Pricing tiers and amounts
- FAQ questions and answers
- Footer links and social URLs

No component code changes needed for basic re-branding.

### Adding New Sections

1. Create a new component in `src/components/sections/`
2. Import and add it to the landing page in `src/App.tsx`
3. Source content from `src/config.ts` for consistency

---

## Contributing

1. **Fork** this repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Standards

- All files must include JSDoc `@fileoverview` headers
- All exported functions must have JSDoc documentation
- TypeScript strict mode — no `any` unless unavoidable
- Tailwind CSS only — no inline styles
- Components under 200 lines — split if larger

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## Support

- **Documentation**: See individual `*.md` files in the project root
- **Issues**: [GitHub Issues](https://github.com/Ron-Web-Dotcom/Marketing-TemplateAI/issues)
- **Email**: support@example.com

---

<p align="center">
  Built with ⚡ by <strong>NeuralFlow</strong>
</p>
