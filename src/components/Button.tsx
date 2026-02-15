import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  href?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  href,
}) => {
  const baseStyles = 'font-semibold rounded-xl transition-all duration-200 inline-flex items-center justify-center gap-2 cursor-pointer';

  const variants = {
    primary: 'bg-gradient-to-r from-orange-600 to-amber-600 text-white hover:from-orange-700 hover:to-amber-700 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-100',
    secondary: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-100',
    outline: 'border-2 border-orange-300 text-orange-700 hover:border-orange-400 hover:bg-orange-50 hover:shadow-md',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const classNames = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <a
        href={href}
        className={classNames}
        onClick={(e) => {
          if (href.startsWith('#')) {
            e.preventDefault();
            const element = document.querySelector(href);
            element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
          onClick?.();
        }}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      className={classNames}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
