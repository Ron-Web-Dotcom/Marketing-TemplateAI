/**
 * @fileoverview "How It Works" three-step walkthrough section.
 *
 * Displays a numbered step-by-step flow with connecting lines between
 * steps on desktop.  Content is sourced from {@link config.howItWorks}.
 *
 * @module components/sections/HowItWorks
 */

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
              <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-orange-200 via-amber-200 to-orange-200" />
            )}
            <div className="relative bg-white rounded-2xl p-8 shadow-md border border-orange-100 hover:shadow-xl hover:border-orange-200 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-600 to-amber-600 rounded-xl flex items-center justify-center mb-6 text-white text-xl font-bold">
                {step.step}
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};
