# Error Tracking Setup Guide

This guide provides step-by-step instructions for integrating error tracking into your application. Error tracking is essential for monitoring production issues and ensuring a smooth user experience.

---

## Why Error Tracking?

Without error tracking, you're flying blind in production:
- **No visibility** into what errors users encounter
- **Can't prioritize** which bugs to fix first
- **Hard to reproduce** user-reported issues
- **Slow response time** to critical failures

With error tracking:
- **Real-time alerts** when errors occur
- **Full context**: stack traces, user actions, browser info
- **Trend analysis**: track error frequency over time
- **Session replay**: see exactly what the user did

---

## Recommended Service: Sentry

**Why Sentry:**
- Industry standard for React applications
- Excellent React integration
- Free tier for small projects (5,000 errors/month)
- Source map support for unminified stack traces
- Session replay for debugging
- Performance monitoring included

**Alternatives:**
- **LogRocket**: Session replay focus ($99/month)
- **Bugsnag**: Simple, developer-friendly ($49/month)
- **Rollbar**: Good for teams (Free tier: 5,000 events/month)

---

## Setup Instructions: Sentry

### Step 1: Create Sentry Account

1. Visit https://sentry.io/signup/
2. Sign up (free account)
3. Create a new project
   - Platform: **React**
   - Name: **Marketing Dashboard** (or your app name)
   - Alert frequency: **On every new issue**

### Step 2: Install Sentry SDK

```bash
npm install @sentry/react
```

### Step 3: Configure Sentry

#### Add Sentry DSN to Environment Variables

Add to your `.env.local` file:

```env
VITE_SENTRY_DSN=https://your-dsn@o12345.ingest.sentry.io/12345
```

**Important:** Add `VITE_SENTRY_DSN` to your production environment variables in your hosting platform.

#### Initialize Sentry in Your App

Update `src/main.tsx`:

```typescript
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import * as Sentry from "@sentry/react";
import App from './App.tsx';
import './index.css';
import { ErrorBoundary } from './components/ErrorBoundary';

// Initialize Sentry
if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,

    // Performance Monitoring
    integrations: [
      new Sentry.BrowserTracing({
        // Set sample rate to capture all transactions in production
        tracePropagationTargets: ["localhost", /^https:\/\/yourapp\.com/],
      }),
      // Session Replay - captures user interactions
      new Sentry.Replay({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],

    // Performance Monitoring sample rate
    tracesSampleRate: 1.0, // Capture 100% of transactions

    // Session Replay sample rates
    replaysSessionSampleRate: 0.1, // 10% of sessions
    replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors

    // Only send production errors to Sentry
    beforeSend(event, hint) {
      // Don't send in development
      if (import.meta.env.DEV) {
        return null;
      }
      return event;
    },
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
```

### Step 4: Integrate with Error Boundary

Update `src/components/ErrorBoundary.tsx`:

```typescript
import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import * as Sentry from '@sentry/react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorEventId: string | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorEventId: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorEventId: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to console in development
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Send to Sentry in production
    if (import.meta.env.PROD) {
      Sentry.withScope((scope) => {
        scope.setContext("react_error_info", errorInfo);
        const eventId = Sentry.captureException(error);
        this.setState({ errorEventId: eventId });
      });
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorEventId: null });
    window.location.href = '/';
  };

  private handleReportFeedback = () => {
    if (this.state.errorEventId) {
      Sentry.showReportDialog({ eventId: this.state.errorEventId });
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50/30 to-white flex items-center justify-center px-4 py-8">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-orange-100 p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <AlertTriangle size={32} className="text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Something went wrong
            </h1>
            <p className="text-gray-600 mb-6">
              We encountered an unexpected error. Our team has been notified and we're working on a fix.
            </p>
            {this.state.error && import.meta.env.DEV && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg text-left">
                <p className="text-xs font-mono text-gray-700 break-words">
                  {this.state.error.message}
                </p>
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 bg-gradient-to-r from-orange-600 to-amber-600 text-white py-3 rounded-lg font-semibold hover:from-orange-700 hover:to-amber-700 transition-all"
              >
                Return to Home
              </button>
              {this.state.errorEventId && import.meta.env.PROD && (
                <button
                  onClick={this.handleReportFeedback}
                  className="flex-1 border-2 border-orange-300 text-orange-700 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-all"
                >
                  Report Issue
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Step 5: Add Manual Error Tracking

For catching async errors outside of React:

```typescript
// Example: In API calls
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    return await response.json();
  } catch (error) {
    // Log to Sentry
    Sentry.captureException(error, {
      tags: {
        section: 'api',
        endpoint: '/api/data'
      },
      level: 'error'
    });
    throw error;
  }
}
```

### Step 6: Test Error Tracking

Add a test button in development:

```typescript
// Test component (remove before production)
function SentryTest() {
  const triggerError = () => {
    throw new Error('This is a test error for Sentry');
  };

  const triggerManualError = () => {
    Sentry.captureException(new Error('Manual test error'));
  };

  return (
    <div className="p-4 bg-yellow-100">
      <button onClick={triggerError} className="mr-2 p-2 bg-red-500 text-white">
        Trigger React Error
      </button>
      <button onClick={triggerManualError} className="p-2 bg-orange-500 text-white">
        Trigger Manual Error
      </button>
    </div>
  );
}
```

**Test Steps:**
1. Click "Trigger React Error"
2. Verify error appears in Sentry dashboard within 30 seconds
3. Check that stack trace is readable (not minified)
4. Verify user context is captured

### Step 7: Configure Source Maps (Important!)

Source maps allow Sentry to show readable stack traces instead of minified code.

#### Update `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true, // Enable source maps for production
  },
});
```

#### Upload Source Maps to Sentry

Install Sentry CLI:

```bash
npm install --save-dev @sentry/vite-plugin
```

Update `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { sentryVitePlugin } from '@sentry/vite-plugin';

export default defineConfig({
  plugins: [
    react(),
    sentryVitePlugin({
      org: "your-org-name",
      project: "your-project-name",
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }),
  ],
  build: {
    sourcemap: true,
  },
});
```

Create `.sentryclirc` in project root:

```ini
[auth]
token=YOUR_SENTRY_AUTH_TOKEN

[defaults]
org=your-org-name
project=your-project-name
```

**Important:** Add `.sentryclirc` to `.gitignore`!

---

## Sentry Dashboard Overview

### Issues Tab
- View all errors grouped by type
- See frequency, user count, last occurrence
- Mark issues as resolved
- Assign issues to team members

### Performance Tab
- Monitor page load times
- Track API call performance
- Identify slow database queries

### Replays Tab
- Watch session recordings of error occurrences
- See exact user actions leading to error

### Alerts
Configure alerts for:
- **New issues**: Get notified immediately
- **Spike in errors**: More than 100 errors/hour
- **Regression**: Previously resolved issue reappears

---

## Best Practices

### 1. Add Context to Errors

```typescript
Sentry.setContext("user", {
  id: user.id,
  email: user.email,
  plan: user.subscription?.plan_type,
});

Sentry.setTag("page", "dashboard");
Sentry.setTag("feature", "campaigns");
```

### 2. Filter Sensitive Data

```typescript
Sentry.init({
  beforeSend(event) {
    // Remove sensitive data
    if (event.request?.headers) {
      delete event.request.headers['Authorization'];
      delete event.request.headers['Cookie'];
    }
    return event;
  },
});
```

### 3. Set Up Alerts

- **Slack integration**: Get notified in team channel
- **Email alerts**: For critical errors
- **PagerDuty**: For on-call escalation

### 4. Regular Review

- Review new issues daily
- Triage and assign weekly
- Track error trends monthly

---

## Alternative: LogRocket

If you need more visual debugging:

```bash
npm install logrocket logrocket-react
```

```typescript
import LogRocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';

if (import.meta.env.PROD) {
  LogRocket.init('your-app-id/project-name');
  setupLogRocketReact(LogRocket);
}
```

LogRocket captures:
- DOM snapshots
- Console logs
- Network requests
- Redux state changes

---

## Cost Considerations

### Sentry Free Tier
- 5,000 errors/month
- 100 replays/month
- 10,000 performance units/month
- 1 project

**When to upgrade:**
- Exceeding free tier limits
- Need more team members
- Want advanced features (spike protection, data forwarding)

### Paid Plans
- **Developer**: $26/month (50k errors)
- **Team**: $80/month (250k errors)
- **Business**: Custom pricing

**Tip:** Start with free tier and upgrade as needed.

---

## Troubleshooting

### Issue: Errors not appearing in Sentry

**Solutions:**
1. Check DSN is correct
2. Verify `PROD` environment variable is true
3. Check browser console for Sentry initialization errors
4. Verify network requests to Sentry (DevTools → Network)

### Issue: Source maps not working

**Solutions:**
1. Verify `sourcemap: true` in vite.config.ts
2. Check source maps uploaded: Sentry → Settings → Source Maps
3. Verify release version matches
4. Check auth token has correct permissions

### Issue: Too many errors

**Solutions:**
1. Implement rate limiting on Sentry side
2. Filter out known errors with `beforeSend`
3. Group similar errors to reduce noise
4. Fix the underlying bugs!

---

## Next Steps

1. ✅ Set up Sentry account
2. ✅ Install and configure SDK
3. ✅ Test error tracking
4. ✅ Configure source maps
5. ✅ Set up alerts
6. 📊 Monitor dashboard daily
7. 🐛 Fix errors as they appear
8. 📈 Track error trends over time

---

**Resources:**
- [Sentry React Documentation](https://docs.sentry.io/platforms/javascript/guides/react/)
- [Sentry Best Practices](https://docs.sentry.io/platforms/javascript/best-practices/)
- [LogRocket Documentation](https://docs.logrocket.com/)

**Last Updated:** 2026-02-16
