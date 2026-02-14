import React from 'react';
import * as Icons from 'lucide-react';
import { config } from '../../config';
import { Section } from '../Section';
import { SectionHeader } from '../SectionHeader';
import { Card } from '../Card';

export const Features: React.FC = () => {
  return (
    <Section id="features">
      <SectionHeader
        title="Powerful Features for Modern Teams"
        subtitle="Everything you need to automate workflows, boost productivity, and scale your business."
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {config.features.map((feature, index) => {
          const IconComponent = Icons[feature.icon as keyof typeof Icons] as React.FC<{ size?: number; className?: string }>;
          return (
            <Card key={index}>
              <div className="w-14 h-14 bg-sky-100 rounded-xl flex items-center justify-center mb-6">
                {IconComponent && <IconComponent size={28} className="text-sky-500" />}
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">
                {feature.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </Card>
          );
        })}
      </div>
    </Section>
  );
};
