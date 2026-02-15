import React from 'react';
import { Download, Play } from 'lucide-react';
import { config } from '../../config';
import { Button } from '../Button';
import { Section } from '../Section';

export const Hero: React.FC = () => {
  return (
    <Section className="pt-28 pb-20 bg-gradient-to-b from-orange-50 via-amber-50/30 to-white">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div className="text-left space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-sm font-medium text-orange-900 border border-orange-200 shadow-sm">
            <span className="text-lg">{config.brand.logo}</span>
            <span>Powered by Advanced AI</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
            <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 bg-clip-text text-transparent">
              {config.hero.headline}
            </span>
          </h1>

          <p className="text-xl text-gray-700 leading-relaxed max-w-xl">
            {config.hero.subheadline}
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Button
              size="lg"
              href="#pricing"
              onClick={() => console.log('Download button clicked')}
            >
              <Download size={20} />
              {config.hero.primaryCTA}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                console.log('Demo button clicked');
                window.alert('🎬 Demo video coming soon! Scroll down to explore all features.');
              }}
            >
              <Play size={20} />
              {config.hero.secondaryCTA}
            </Button>
          </div>

          <div className="flex items-center gap-6 pt-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Free 14-day trial</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>No credit card required</span>
            </div>
          </div>
        </div>

        <div className="relative lg:pl-8">
          <div className="absolute -inset-4 bg-gradient-to-tr from-orange-200 via-amber-100 to-orange-200 rounded-3xl blur-2xl opacity-40" />
          <div className="relative bg-white p-2 rounded-2xl shadow-2xl border border-orange-100">
            <img
              src={config.hero.image}
              alt="App Screenshot"
              className="rounded-xl w-full"
            />
          </div>
        </div>
      </div>
    </Section>
  );
};
