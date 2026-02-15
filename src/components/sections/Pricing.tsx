import React from 'react';
import { Check } from 'lucide-react';
import { config } from '../../config';
import { Section } from '../Section';
import { SectionHeader } from '../SectionHeader';
import { Button } from '../Button';

export const Pricing: React.FC = () => {
  return (
    <Section id="pricing" background="light">
      <SectionHeader
        title="Simple, Transparent Pricing"
        subtitle="Choose the plan that's right for you. All plans include a 14-day free trial."
      />

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {config.pricing.map((plan, index) => (
          <div
            key={index}
            className={`rounded-2xl p-8 ${
              plan.highlighted
                ? 'bg-slate-900 text-white border-4 border-sky-500 shadow-2xl scale-105'
                : 'bg-white border border-slate-200'
            }`}
          >
            {plan.highlighted && (
              <div className="bg-sky-500 text-white text-sm font-bold px-4 py-1 rounded-full inline-block mb-4">
                MOST POPULAR
              </div>
            )}

            <h3
              className={`text-2xl font-bold mb-2 ${
                plan.highlighted ? 'text-white' : 'text-slate-900'
              }`}
            >
              {plan.name}
            </h3>

            <div className="mb-4">
              <span className="text-5xl font-bold">{plan.price}</span>
              <span
                className={`text-lg ml-2 ${
                  plan.highlighted ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                {plan.period}
              </span>
            </div>

            <p
              className={`mb-8 ${
                plan.highlighted ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              {plan.description}
            </p>

            <Button
              variant={plan.highlighted ? 'primary' : 'outline'}
              className="w-full mb-8"
              onClick={() => {
                console.log(`${plan.name} plan selected`);
                if (plan.name === 'Enterprise') {
                  window.alert('📞 Thank you for your interest! Our sales team will contact you shortly.\n\nEmail: sales@neuralflow.ai\nPhone: 1-800-NEURAL');
                } else {
                  window.alert(`🎉 Great choice! You've selected the ${plan.name} plan.\n\nYou'll be redirected to sign up in a production environment.`);
                }
              }}
            >
              {plan.cta}
            </Button>

            <ul className="space-y-4">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-start gap-3">
                  <Check
                    size={20}
                    className={`flex-shrink-0 mt-0.5 ${
                      plan.highlighted ? 'text-sky-400' : 'text-emerald-500'
                    }`}
                  />
                  <span
                    className={
                      plan.highlighted ? 'text-slate-200' : 'text-slate-700'
                    }
                  >
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
};
