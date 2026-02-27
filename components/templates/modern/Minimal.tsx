'use client';

import React from 'react';
import { CVData } from '@/lib/types/template.types';
import { BaseTemplate } from '../BaseTemplate';

export const MinimalTemplate: React.FC<{ data: CVData }> = ({ data }) => {
  return (
    <BaseTemplate 
      data={data} 
      config={{
        colors: {
          primary: '#000000',
          secondary: '#4b5563',
          accent: '#f3f4f6',
          text: '#111827',
          background: '#ffffff',
        },
        fonts: { heading: 'Inter', body: 'Inter' },
        layout: 'single-column',
        spacing: 'spacious',
        showAvatar: true,
        showIcons: false,
      }}
    >
      <div className="max-w-3xl mx-auto bg-white p-12">
        {/* تصميم مينيمالي نظيف */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-light tracking-tight mb-2">{data.personalInfo.fullName}</h1>
          <p className="text-xl text-gray-500">{data.personalInfo.jobTitle}</p>
        </div>
        
        <div className="max-w-2xl mx-auto space-y-12">
          <p className="text-gray-600 leading-relaxed text-lg">
            {data.personalInfo.summary}
          </p>

          {/* خبرات بتصميم بسيط */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-6">
              الخبرات
            </h2>
            {data.experiences.map((exp) => (
              <div key={exp.id} className="mb-8">
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="font-medium">{exp.position}</h3>
                  <span className="text-sm text-gray-400">{exp.startDate} - {exp.endDate}</span>
                </div>
                <p className="text-gray-500 mb-2">{exp.company}</p>
                <ul className="list-disc list-inside space-y-1">
                  {exp.description.map((item, idx) => (
                    <li key={idx} className="text-gray-600 text-sm">{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BaseTemplate>
  );
};