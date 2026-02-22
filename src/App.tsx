/**
 * @fileoverview Root application component with client-side routing.
 *
 * Wraps the entire app in {@link NavigationProvider} (URL routing) and
 * {@link AuthProvider} (authentication + subscription state).
 * {@link AppContent} reads the current route and renders the appropriate
 * page or the marketing landing page.
 *
 * Routes:
 * - `/dashboard` — Authenticated marketing dashboard
 * - `/auth`      — Sign-in / sign-up / password reset
 * - `/upgrade`   — Stripe-powered subscription upgrade
 * - `/` (default)— Public landing page with all marketing sections
 *
 * @module App
 */

import { AuthProvider } from './contexts/AuthContext';
import { NavigationProvider, useNavigation } from './contexts/NavigationContext';
import { Navigation } from './components/Navigation';
import { Hero } from './components/sections/Hero';
import { TrustBar } from './components/sections/TrustBar';
import { Features } from './components/sections/Features';
import { HowItWorks } from './components/sections/HowItWorks';
import { UseCases } from './components/sections/UseCases';
import { Benefits } from './components/sections/Benefits';
import { Integrations } from './components/sections/Integrations';
import { Testimonials } from './components/sections/Testimonials';
import { Pricing } from './components/sections/Pricing';
import { FAQ } from './components/sections/FAQ';
import { FinalCTA } from './components/sections/FinalCTA';
import { Footer } from './components/sections/Footer';
import { Dashboard } from './pages/Dashboard';
import { Auth } from './pages/Auth';
import { Upgrade } from './pages/Upgrade';

/**
 * Renders the correct view based on the current client-side route.
 * Falls back to the full marketing landing page for unknown routes.
 */
function AppContent() {
  const { currentRoute } = useNavigation();

  if (currentRoute === '/dashboard') {
    return <Dashboard />;
  }

  if (currentRoute === '/auth') {
    return <Auth />;
  }

  if (currentRoute === '/upgrade') {
    return <Upgrade />;
  }

  /* Default: public marketing landing page */
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <TrustBar />
      <Features />
      <HowItWorks />
      <UseCases />
      <Benefits />
      <Integrations />
      <Testimonials />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}

/**
 * Top-level App component.
 * Provides navigation and authentication context to the entire tree.
 */
function App() {
  return (
    <NavigationProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </NavigationProvider>
  );
}

export default App;
