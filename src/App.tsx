import { useState, useEffect } from 'react';
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

function App() {
  const [currentRoute, setCurrentRoute] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentRoute(path);
  };

  (window as any).navigate = navigate;

  if (currentRoute === '/dashboard') {
    return <Dashboard />;
  }

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

export default App;
