/**
 * @fileoverview Generic Card container component.
 *
 * Renders a rounded white card with an optional hover lift + shadow effect.
 * Used as a wrapper in feature grids, pricing, and dashboard widgets.
 *
 * @module components/Card
 */

import React from 'react';

/** Props accepted by the {@link Card} component. */
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = true,
}) => {
  return (
    <div
      className={`bg-white rounded-2xl p-8 border border-slate-200 ${
        hover ? 'hover:shadow-xl hover:border-sky-200 transition-all duration-300 hover:-translate-y-1' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
