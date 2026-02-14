import React from 'react';
import { config } from '../../config';
import { Section } from '../Section';
import { SectionHeader } from '../SectionHeader';

export const Integrations: React.FC = () => {
  return (
    <Section id="integrations" background="light">
      <SectionHeader
        title="Seamless Integrations"
        subtitle="Connect with all your favorite tools. Works with 1000+ apps out of the box."
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {config.integrations.map((integration, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 flex items-center justify-center border border-slate-200 hover:border-sky-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <span className="text-slate-700 font-semibold text-sm text-center">
              {integration}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-slate-600 mb-4">
          Don't see your tool? We add new integrations every week.
        </p>
        <a href="#" className="text-sky-500 font-semibold hover:text-sky-600">
          Request an Integration →
        </a>
      </div>
    </Section>
  );
};
