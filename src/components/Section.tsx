/**
 * @fileoverview Reusable page section wrapper.
 *
 * Provides consistent vertical padding, max-width container, and three
 * background presets (`white`, `light`, `dark`).  Used by every landing
 * page section for visual rhythm.
 *
 * @module components/Section
 */

import React from 'react';

/** Props accepted by the {@link Section} component. */
interface SectionProps {
  children: React.ReactNode;
  className?: string;
  background?: 'white' | 'light' | 'dark';
  id?: string;
}

export const Section: React.FC<SectionProps> = ({
  children,
  className = '',
  background = 'white',
  id,
}) => {
  const backgrounds = {
    white: 'bg-white',
    light: 'bg-slate-50',
    dark: 'bg-slate-900 text-white',
  };

  return (
    <section id={id} className={`py-20 ${backgrounds[background]} ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {children}
      </div>
    </section>
  );
};
