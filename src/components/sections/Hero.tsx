import React from 'react';
import { Download, Play } from 'lucide-react';
import { config } from '../../config';
import { Button } from '../Button';
import { Section } from '../Section';

export const Hero: React.FC = () => {
  return (
    <>
      <div className="bg-sky-500 text-white text-center py-3 text-sm font-medium">
        {config.hero.announcement}
      </div>

      <Section className="pt-32 pb-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-slate-900">
              {config.hero.headline}
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-8 leading-relaxed">
              {config.hero.subheadline}
            </p>
            <div className="flex flex-wrap gap-4">
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
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-sky-400 to-emerald-400 rounded-3xl blur-3xl opacity-20" />
            <img
              src={config.hero.image}
              alt="App Screenshot"
              className="relative rounded-2xl shadow-2xl w-full"
            />
          </div>
        </div>
      </Section>
    </>
  );
};
