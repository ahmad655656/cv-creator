'use client';

import { ReactNode } from 'react';

interface CardLayoutProps {
  children: ReactNode;
  variant?: 'elevated' | 'outlined' | 'flat';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function CardLayout({ 
  children, 
  variant = 'elevated',
  padding = 'md',
  borderRadius = 'lg',
  shadow = 'md',
  hover = true,
  className = '',
  style 
}: CardLayoutProps) {
  const variantClasses = {
    elevated: 'bg-white dark:bg-gray-800',
    outlined: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
    flat: 'bg-gray-50 dark:bg-gray-900'
  };

  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };

  const borderRadiusClasses = {
    none: 'rounded-none',
    sm: 'rounded',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-2xl'
  };

  const shadowClasses = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow',
    lg: 'shadow-md',
    xl: 'shadow-lg'
  };

  return (
    <div 
      className={`
        ${variantClasses[variant]} 
        ${paddingClasses[padding]} 
        ${borderRadiusClasses[borderRadius]} 
        ${shadowClasses[shadow]}
        ${hover ? 'hover:shadow-xl hover:-translate-y-1 transition-all duration-300' : ''}
        ${className}
      `}
      style={style}
    >
      {children}
    </div>
  );
}