import React from 'react';

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
