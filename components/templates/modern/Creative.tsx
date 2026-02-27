'use client';

import React from 'react';
import { CVData } from '@/lib/types/template.types';
import { BaseTemplate } from '../BaseTemplate';

export const CreativeTemplate: React.FC<{ data: CVData }> = ({ data }) => {
  return (
    <BaseTemplate 
      data={data} 
      config={{
        colors: {
          primary: '#ec4899',
          secondary: '#8b5cf6',
          accent: '#fdf2f8',
          text: '#1f2937',
          background: '#ffffff',
        },
        fonts: { heading: 'Poppins', body: 'Inter' },
        layout: 'creative',
        spacing: 'normal',
        showAvatar: true,
        showIcons: true,
      }}
    >
      <div className="max-w-4xl mx-auto bg-white overflow-hidden rounded-3xl shadow-2xl">
        {/* Header إبداعي مع أشكال هندسية */}
        <div className="relative h-48 bg-gradient-to-r from-pink-500 to-purple-600">
          <div className="absolute -bottom-16 left-12">
            <div className="w-32 h-32 rounded-2xl bg-white shadow-xl flex items-center justify-center overflow-hidden">
              {data.personalInfo.profileImage ? (
                <img src={data.personalInfo.profileImage} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl text-pink-500 font-bold">
                  {data.personalInfo.fullName.charAt(0)}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="pt-20 p-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">{data.personalInfo.fullName}</h1>
          <p className="text-pink-500 mb-4">{data.personalInfo.jobTitle}</p>
          
          {/* شبكة إبداعية للمحتوى */}
          <div className="grid grid-cols-3 gap-6 mt-8">
            <div className="col-span-1 space-y-4">
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-4 rounded-xl">
                <h3 className="font-bold text-gray-700 mb-3">المهارات</h3>
                {data.skills.map(skill => (
                  <div key={skill.id} className="mb-2">
                    <span className="text-sm">{skill.name}</span>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1">
                      <div 
                        className="h-1.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full"
                        style={{ width: `${skill.level * 20}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="col-span-2 space-y-6">
              {/* المحتوى الرئيسي */}
            </div>
          </div>
        </div>
      </div>
    </BaseTemplate>
  );
};
