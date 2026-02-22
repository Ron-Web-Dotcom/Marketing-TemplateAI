/**
 * @fileoverview Section heading molecule with title and optional subtitle.
 *
 * Provides a consistent typographic treatment for every landing page
 * section — large bold title, muted subtitle, generous bottom margin.
 *
 * @module components/SectionHeader
 */

import React from 'react';

/** Props accepted by the {@link SectionHeader} component. */
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  centered = true,
  className = '',
}) => {
  return (
    <div className={`mb-16 ${centered ? 'text-center' : ''} ${className}`}>
      <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};
