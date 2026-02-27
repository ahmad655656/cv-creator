'use client';

import { ReactNode } from 'react';

interface FlexLayoutProps {
  children: ReactNode[];
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  wrap?: boolean;
  justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  align?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  gap?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
  className?: string;
  style?: React.CSSProperties;
}

export function FlexLayout({ 
  children, 
  direction = 'row',
  wrap = true,
  justify = 'flex-start',
  align = 'stretch',
  gap = 'md',
  className = '',
  style 
}: FlexLayoutProps) {
  const gapMap = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  };

  const directionMap = {
    row: 'flex-row',
    'row-reverse': 'flex-row-reverse',
    column: 'flex-col',
    'column-reverse': 'flex-col-reverse'
  };

  const justifyMap = {
    'flex-start': 'justify-start',
    'flex-end': 'justify-end',
    'center': 'justify-center',
    'space-between': 'justify-between',
    'space-around': 'justify-around',
    'space-evenly': 'justify-evenly'
  };

  const alignMap = {
    'flex-start': 'items-start',
    'flex-end': 'items-end',
    'center': 'items-center',
    'stretch': 'items-stretch',
    'baseline': 'items-baseline'
  };

  return (
    <div 
      className={`
        flex 
        ${directionMap[direction]} 
        ${wrap ? 'flex-wrap' : 'flex-nowrap'}
        ${justifyMap[justify]}
        ${alignMap[align]}
        ${gapMap[gap]}
        ${className}
      `}
      style={style}
    >
      {children.map((child, index) => (
        <div key={index} className="flex-1 min-w-[200px]">
          {child}
        </div>
      ))}
    </div>
  );
}