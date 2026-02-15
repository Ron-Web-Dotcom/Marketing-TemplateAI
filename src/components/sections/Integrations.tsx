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

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {config.integrations.map((integration, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-5 flex items-center justify-center border border-orange-100 hover:border-orange-200 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
          >
            <span className="text-gray-700 font-semibold text-sm text-center">
              {integration}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-600 text-sm mb-3">
          Don't see your tool? We add new integrations every week.
        </p>
        <a href="#" className="text-orange-600 font-semibold hover:text-orange-700 inline-flex items-center gap-1">
          Request an Integration
          <span>→</span>
        </a>
      </div>
    </Section>
  );
};
