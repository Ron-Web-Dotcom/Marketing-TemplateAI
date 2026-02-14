import React from 'react';

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
