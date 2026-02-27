'use client';

import { ReactNode } from 'react';

interface GridLayoutProps {
  children: ReactNode[];
  columns: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
  style?: React.CSSProperties;
}

export function GridLayout({ children, columns, gap = 'md', className = '', style }: GridLayoutProps) {
  const gapSizes = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6'
  };

  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div 
      className={`grid ${columnClasses[columns]} ${gapSizes[gap]} ${className}`}
      style={style}
    >
      {children.map((child, index) => (
        <div key={index} className="relative group">
          {child}
          {/* زر تعديل القسم */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition bg-white dark:bg-gray-800 rounded-lg shadow-lg p-1">
            <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              <span className="text-xs">✎</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}