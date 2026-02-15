import React from 'react';
import { Star } from 'lucide-react';
import { config } from '../../config';
import { Section } from '../Section';
import { SectionHeader } from '../SectionHeader';

export const Testimonials: React.FC = () => {
  return (
    <Section>
      <SectionHeader
        title="Loved by Teams Worldwide"
        subtitle="See what our customers have to say about transforming their workflows."
      />

      <div className="grid md:grid-cols-3 gap-6">
        {config.testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-8 border border-orange-100 hover:border-orange-200 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex gap-1 mb-5">
              {Array.from({ length: testimonial.rating }).map((_, i) => (
                <Star key={i} size={18} className="fill-amber-400 text-amber-400" />
              ))}
            </div>

            <p className="text-gray-700 mb-6 leading-relaxed">
              "{testimonial.quote}"
            </p>

            <div className="border-t border-orange-50 pt-5">
              <p className="font-bold text-gray-900 text-sm">{testimonial.author}</p>
              <p className="text-gray-500 text-xs mt-1">
                {testimonial.role}, {testimonial.company}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};
