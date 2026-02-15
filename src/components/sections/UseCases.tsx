import React from 'react';
import * as Icons from 'lucide-react';
import { config } from '../../config';
import { Section } from '../Section';
import { SectionHeader } from '../SectionHeader';
import { Card } from '../Card';

export const UseCases: React.FC = () => {
  return (
    <Section>
      <SectionHeader
        title="Built for Every Team"
        subtitle="Discover how different teams use NeuralFlow to transform their workflows."
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {config.useCases.map((useCase, index) => {
          const IconComponent = Icons[useCase.icon as keyof typeof Icons] as React.FC<{ size?: number; className?: string }>;
          return (
            <div key={index} className="bg-white p-6 rounded-2xl border border-orange-100 hover:border-orange-200 hover:shadow-lg transition-all text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {IconComponent && <IconComponent size={28} className="text-orange-600" />}
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-900">
                {useCase.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {useCase.description}
              </p>
            </div>
          );
        })}
      </div>
    </Section>
  );
};
