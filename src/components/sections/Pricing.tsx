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
                ? 'bg-gradient-to-br from-orange-600 to-amber-600 text-white border-2 border-orange-400 shadow-2xl scale-105 relative overflow-hidden'
                : 'bg-white border border-orange-100 hover:border-orange-200 hover:shadow-lg transition-all'
            }`}
          >
            {plan.highlighted && (
              <>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
                <div className="relative bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-4 backdrop-blur-sm">
                  MOST POPULAR
                </div>
              </>
            )}

            <h3
              className={`text-2xl font-bold mb-2 ${
                plan.highlighted ? 'text-white relative' : 'text-gray-900'
              }`}
            >
              {plan.name}
            </h3>

            <div className="mb-4">
              <span className={`text-5xl font-bold ${plan.highlighted ? 'relative' : ''}`}>{plan.price}</span>
              <span
                className={`text-lg ml-2 ${
                  plan.highlighted ? 'text-white/80' : 'text-gray-600'
                }`}
              >
                {plan.period}
              </span>
            </div>

            <p
              className={`mb-8 ${
                plan.highlighted ? 'text-white/90 relative' : 'text-gray-600'
              }`}
            >
              {plan.description}
            </p>

            <Button
              variant={plan.highlighted ? 'secondary' : 'outline'}
              className={`w-full mb-8 ${plan.highlighted ? 'bg-white text-orange-600 hover:bg-orange-50 shadow-lg relative' : ''}`}
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
                    size={18}
                    className={`flex-shrink-0 mt-0.5 ${
                      plan.highlighted ? 'text-white/90 relative' : 'text-orange-500'
                    }`}
                  />
                  <span
                    className={
                      plan.highlighted ? 'text-white/90 relative' : 'text-gray-700'
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
