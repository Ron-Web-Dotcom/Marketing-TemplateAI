import React from 'react';
import { config } from '../../config';
import { Section } from '../Section';
import { SectionHeader } from '../SectionHeader';

export const Benefits: React.FC = () => {
  return (
    <Section background="dark">
      <SectionHeader
        title="Real Results That Matter"
        subtitle="Join thousands of teams achieving measurable productivity gains."
      />

      <div className="grid md:grid-cols-3 gap-8">
        {config.benefits.map((benefit, index) => (
          <div
            key={index}
            className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700 hover:border-sky-500 transition-all duration-300"
          >
            <div className="text-6xl font-bold bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent mb-4">
              {benefit.stat}
            </div>
            <h3 className="text-2xl font-bold mb-3">{benefit.title}</h3>
            <p className="text-slate-400 leading-relaxed">{benefit.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
};
