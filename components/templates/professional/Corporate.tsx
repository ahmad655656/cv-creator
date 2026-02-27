'use client';

import React from 'react';
import { CVData } from '@/lib/types/template.types';
import { BaseTemplate } from '../BaseTemplate';

export const CorporateTemplate: React.FC<{ data: CVData }> = ({ data }) => {
  return (
    <BaseTemplate 
      data={data} 
      config={{
        colors: {
          primary: '#0f172a',
          secondary: '#334155',
          accent: '#f1f5f9',
          text: '#0f172a',
          background: '#ffffff',
        },
        fonts: { heading: 'Inter', body: 'Inter' },
        layout: 'two-column',
        spacing: 'compact',
        showAvatar: false,
        showIcons: true,
      }}
    >
      <div className="max-w-4xl mx-auto bg-white shadow-lg">
        {/* تصميم الشركات الاحترافي */}
        <div className="p-8">
          <div className="border-l-4 border-primary pl-4 mb-6">
            <h1 className="text-3xl font-bold text-primary">{data.personalInfo.fullName}</h1>
            <p className="text-secondary">{data.personalInfo.jobTitle}</p>
          </div>
          {/* باقي المحتوى */}
        </div>
      </div>
    </BaseTemplate>
  );
};