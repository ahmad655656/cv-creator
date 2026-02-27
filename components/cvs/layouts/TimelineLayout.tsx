'use client';

import { ReactNode } from 'react';

interface TimelineItem {
  date: string;
  title: string;
  subtitle?: string;
  description?: string;
  icon?: ReactNode;
}

interface TimelineLayoutProps {
  items: TimelineItem[];
  variant?: 'default' | 'alternating' | 'compact';
  lineColor?: string;
  dotColor?: string;
}

export function TimelineLayout({ 
  items, 
  variant = 'default',
  lineColor = '#3b82f6',
  dotColor = '#3b82f6'
}: TimelineLayoutProps) {
  return (
    <div className="relative">
      {/* الخط العمودي */}
      <div 
        className="absolute right-4 top-0 bottom-0 w-0.5"
        style={{ backgroundColor: lineColor }}
      />

      <div className="space-y-6">
        {items.map((item, index) => (
          <div key={index} className="relative pr-12">
            {/* نقطة على الخط */}
            <div 
              className="absolute right-2 w-4 h-4 rounded-full border-2 border-white dark:border-gray-900"
              style={{ backgroundColor: dotColor, right: '10px', top: '4px' }}
            />
            
            {/* المحتوى */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition">
              <div className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">
                {item.date}
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white">
                {item.title}
              </h4>
              {item.subtitle && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {item.subtitle}
                </p>
              )}
              {item.description && (
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}