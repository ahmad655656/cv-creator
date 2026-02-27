'use client';

import { ReactNode } from 'react';

interface MagazineSection {
  title: string;
  content: ReactNode;
  columns?: 1 | 2 | 3;
  featured?: boolean;
  image?: string;
}

interface MagazineLayoutProps {
  sections: MagazineSection[];
  header?: ReactNode;
  footer?: ReactNode;
}

export function MagazineLayout({ sections, header, footer }: MagazineLayoutProps) {
  return (
    <div className="max-w-4xl mx-auto">
      {header && (
        <div className="mb-8 pb-4 border-b-2 border-gray-200 dark:border-gray-700">
          {header}
        </div>
      )}

      <div className="space-y-8">
        {sections.map((section, index) => (
          <div 
            key={index} 
            className={`
              ${section.featured ? 'bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl' : ''}
            `}
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b-2 border-blue-500 inline-block">
              {section.title}
            </h2>

            {section.image && (
              <div className="mb-4">
                <img 
                  src={section.image} 
                  alt={section.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}

            <div className={`
              grid gap-4
              ${section.columns === 2 ? 'grid-cols-1 md:grid-cols-2' : ''}
              ${section.columns === 3 ? 'grid-cols-1 md:grid-cols-3' : ''}
            `}>
              {section.content}
            </div>
          </div>
        ))}
      </div>

      {footer && (
        <div className="mt-8 pt-4 border-t-2 border-gray-200 dark:border-gray-700">
          {footer}
        </div>
      )}
    </div>
  );
}