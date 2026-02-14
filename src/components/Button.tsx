import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
}) => {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-200 inline-flex items-center justify-center gap-2';

  const variants = {
    primary: 'bg-sky-500 text-white hover:bg-sky-600 hover:shadow-lg hover:scale-105 active:scale-100',
    secondary: 'bg-slate-700 text-white hover:bg-slate-800 hover:shadow-lg hover:scale-105 active:scale-100',
    outline: 'border-2 border-slate-300 text-slate-700 hover:border-sky-500 hover:text-sky-500 hover:shadow-md',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
