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

function App() {
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
