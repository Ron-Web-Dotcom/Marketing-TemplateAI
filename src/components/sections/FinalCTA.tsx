import React from 'react';
import { Download, ArrowRight } from 'lucide-react';
import { config } from '../../config';
import { Section } from '../Section';
import { Button } from '../Button';

export const FinalCTA: React.FC = () => {
  return (
    <Section className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-600/5 via-transparent to-amber-600/5" />

      <div className="relative max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
          <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 bg-clip-text text-transparent">
            Ready to Transform Your Workflow?
          </span>
        </h2>
        <p className="text-xl text-gray-700 mb-10 leading-relaxed max-w-2xl mx-auto">
          Join 500,000+ users and start automating today. No credit card required.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <Button
            size="lg"
            href="#pricing"
          >
            <Download size={20} />
            {config.hero.primaryCTA}
          </Button>
          <Button
            size="lg"
            variant="outline"
            href="#pricing"
          >
            View Pricing
            <ArrowRight size={20} />
          </Button>
        </div>

        <p className="mt-8 text-gray-500 text-sm">
          14-day free trial • Cancel anytime • No credit card required
        </p>
      </div>
    </Section>
  );
};
