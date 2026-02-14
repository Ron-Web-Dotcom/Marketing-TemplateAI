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

      <div className="grid md:grid-cols-3 gap-8">
        {config.testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-8 border border-slate-200 hover:border-sky-200 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex gap-1 mb-6">
              {Array.from({ length: testimonial.rating }).map((_, i) => (
                <Star key={i} size={20} className="fill-amber-400 text-amber-400" />
              ))}
            </div>

            <p className="text-slate-700 mb-6 leading-relaxed text-lg">
              "{testimonial.quote}"
            </p>

            <div className="border-t border-slate-200 pt-6">
              <p className="font-bold text-slate-900">{testimonial.author}</p>
              <p className="text-slate-600 text-sm">
                {testimonial.role}, {testimonial.company}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};
