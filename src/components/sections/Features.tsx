/**
 * @fileoverview Features grid section.
 *
 * Renders a responsive 3-column grid of feature cards sourced from the
 * centralised {@link config}.  Icons are resolved dynamically from the
 * `lucide-react` library.
 *
 * @module components/sections/Features
 */

import React from 'react';
import * as Icons from 'lucide-react';
import { config } from '../../config';
import { Section } from '../Section';
import { SectionHeader } from '../SectionHeader';

export const Features: React.FC = () => {
  return (
    <Section id="features">
      <SectionHeader
        title="Powerful Features for Modern Teams"
        subtitle="Everything you need to automate workflows, boost productivity, and scale your business."
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {config.features.map((feature, index) => {
          const IconComponent = Icons[feature.icon as keyof typeof Icons] as React.FC<{ size?: number; className?: string }>;
          return (
            <div
              key={index}
              className="group bg-white p-8 rounded-2xl border border-orange-100 hover:border-orange-200 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                {IconComponent && <IconComponent size={24} className="text-white" />}
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </Section>
  );
};
