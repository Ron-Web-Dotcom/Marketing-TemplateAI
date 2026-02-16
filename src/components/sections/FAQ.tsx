import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { config } from '../../config';
import { Section } from '../Section';
import { SectionHeader } from '../SectionHeader';

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Section id="faq">
      <SectionHeader
        title="Frequently Asked Questions"
        subtitle="Have questions? We have answers. Can't find what you're looking for? Contact our support team."
      />

      <div className="max-w-3xl mx-auto space-y-4">
        {config.faq.map((item, index) => (
          <div
            key={index}
            className="bg-white border border-orange-100 rounded-xl overflow-hidden hover:border-orange-200 transition-all duration-300"
          >
            <button
              className="w-full px-6 py-5 flex items-center justify-between text-left"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              aria-expanded={openIndex === index}
              aria-controls={`faq-answer-${index}`}
              id={`faq-question-${index}`}
            >
              <span className="font-semibold text-lg text-gray-900">
                {item.question}
              </span>
              <ChevronDown
                size={24}
                className={`text-orange-500 transition-transform duration-300 flex-shrink-0 ml-4 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </button>

            <div
              id={`faq-answer-${index}`}
              role="region"
              aria-labelledby={`faq-question-${index}`}
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? 'max-h-96' : 'max-h-0'
              }`}
            >
              <div className="px-6 pb-5 text-gray-600 leading-relaxed">
                {item.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};
