/**
 * @fileoverview Trust bar section with metrics and partner logos.
 *
 * Shows key platform statistics (users, rating, countries, uptime) and a
 * row of recognised partner names to build social proof.
 *
 * @module components/sections/TrustBar
 */

import React from 'react';
import { config } from '../../config';
import { Section } from '../Section';

export const TrustBar: React.FC = () => {
  return (
    <Section background="white" className="py-12 border-y border-orange-100">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
        {config.trust.metrics.map((metric, index) => (
          <div key={index} className="text-center">
            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-1">
              {metric.value}
            </div>
            <div className="text-gray-600 text-sm font-medium">{metric.label}</div>
          </div>
        ))}
      </div>

      <div className="border-t border-orange-100 pt-10">
        <p className="text-center text-gray-500 mb-6 text-sm font-medium uppercase tracking-wider">
          Trusted by teams at
        </p>
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
          {config.trust.partners.map((partner, index) => (
            <div
              key={index}
              className="text-gray-400 font-semibold hover:text-orange-600 transition-colors"
            >
              {partner}
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};
