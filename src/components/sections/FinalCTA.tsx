import React from 'react';
import { Download, ArrowRight } from 'lucide-react';
import { config } from '../../config';
import { Section } from '../Section';
import { Button } from '../Button';

export const FinalCTA: React.FC = () => {
  return (
    <Section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-sky-500 via-sky-600 to-emerald-500 opacity-10" />

      <div className="relative max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-6xl font-bold mb-6 text-slate-900">
          Ready to Transform Your Workflow?
        </h2>
        <p className="text-xl md:text-2xl text-slate-600 mb-10 leading-relaxed">
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

        <p className="mt-8 text-slate-500">
          14-day free trial • Cancel anytime • No credit card required
        </p>
      </div>
    </Section>
  );
};
