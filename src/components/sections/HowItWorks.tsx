import React from 'react';
import { config } from '../../config';
import { Section } from '../Section';
import { SectionHeader } from '../SectionHeader';

export const HowItWorks: React.FC = () => {
  return (
    <Section id="how-it-works" background="light">
      <SectionHeader
        title="How It Works"
        subtitle="Get started in minutes with our simple three-step process."
      />

      <div className="grid md:grid-cols-3 gap-8">
        {config.howItWorks.map((step, index) => (
          <div key={index} className="relative">
            {index < config.howItWorks.length - 1 && (
              <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-sky-300 to-emerald-300" />
            )}
            <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
              <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 text-white text-2xl font-bold shadow-lg">
                {step.step}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">
                {step.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};
