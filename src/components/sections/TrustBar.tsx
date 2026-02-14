import React from 'react';
import { config } from '../../config';
import { Section } from '../Section';

export const TrustBar: React.FC = () => {
  return (
    <Section background="light" className="py-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
        {config.trust.metrics.map((metric, index) => (
          <div key={index} className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-sky-500 mb-2">
              {metric.value}
            </div>
            <div className="text-slate-600 font-medium">{metric.label}</div>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-200 pt-12">
        <p className="text-center text-slate-500 mb-8 font-medium">
          Trusted by teams at
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {config.trust.partners.map((partner, index) => (
            <div
              key={index}
              className="text-slate-400 font-semibold text-lg hover:text-slate-600 transition-colors"
            >
              {partner}
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};
