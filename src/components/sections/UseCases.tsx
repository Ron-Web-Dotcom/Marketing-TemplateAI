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
            <Card key={index} className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-sky-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {IconComponent && <IconComponent size={28} className="text-sky-600" />}
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">
                {useCase.title}
              </h3>
              <p className="text-slate-600">
                {useCase.description}
              </p>
            </Card>
          );
        })}
      </div>
    </Section>
  );
};
