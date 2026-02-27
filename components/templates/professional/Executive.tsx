'use client';

import React from 'react';
import { CVData } from '@/lib/types/template.types';
import { BaseTemplate } from '../BaseTemplate';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Calendar } from 'lucide-react';

interface ExecutiveTemplateProps {
  data: CVData;
}

export const ExecutiveTemplate: React.FC<ExecutiveTemplateProps> = ({ data }) => {
  const config = {
    colors: {
      primary: '#1e3a8a',
      secondary: '#2563eb',
      accent: '#dbeafe',
      text: '#1f2937',
      background: '#ffffff',
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
    layout: 'two-column',
    spacing: 'normal',
    showAvatar: true,
    showIcons: true,
  };

  return (
    <BaseTemplate data={data} config={config}>
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-8 text-white">
          <div className="flex items-center gap-6">
            {data.personalInfo.avatar && (
              <img 
                src={data.personalInfo.avatar} 
                alt={data.personalInfo.fullName}
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
              />
            )}
            <div>
              <h1 className="text-4xl font-bold mb-2">{data.personalInfo.fullName}</h1>
              <p className="text-xl text-blue-100">{data.personalInfo.jobTitle}</p>
            </div>
          </div>
        </div>

        {/* Contact Bar */}
        <div className="bg-gray-50 p-4 border-b grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Mail size={18} />
            <span className="text-sm">{data.personalInfo.email}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Phone size={18} />
            <span className="text-sm">{data.personalInfo.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin size={18} />
            <span className="text-sm">{data.personalInfo.address}</span>
          </div>
          {data.personalInfo.website && (
            <div className="flex items-center gap-2 text-gray-600">
              <Globe size={18} />
              <span className="text-sm">{data.personalInfo.website}</span>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-3 gap-6 p-8">
          {/* Left Column */}
          <div className="col-span-1 space-y-6">
            {/* Summary */}
            <div>
              <h2 className="text-lg font-bold text-blue-900 mb-3 pb-2 border-b-2 border-blue-900">
                نبذة عني
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                {data.personalInfo.summary}
              </p>
            </div>

            {/* Skills */}
            <div>
              <h2 className="text-lg font-bold text-blue-900 mb-3 pb-2 border-b-2 border-blue-900">
                المهارات
              </h2>
              <div className="space-y-3">
                {data.skills.map((skill) => (
                  <div key={skill.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-gray-500">{skill.level}/5</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${skill.level * 20}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div>
              <h2 className="text-lg font-bold text-blue-900 mb-3 pb-2 border-b-2 border-blue-900">
                اللغات
              </h2>
              <div className="space-y-2">
                {data.languages.map((lang) => (
                  <div key={lang.id} className="flex justify-between">
                    <span className="font-medium">{lang.name}</span>
                    <span className="text-gray-500">{lang.level}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            {data.certifications.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-blue-900 mb-3 pb-2 border-b-2 border-blue-900">
                  الشهادات
                </h2>
                <div className="space-y-3">
                  {data.certifications.map((cert) => (
                    <div key={cert.id}>
                      <h3 className="font-medium text-sm">{cert.name}</h3>
                      <p className="text-xs text-gray-500">{cert.issuer} • {cert.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="col-span-2 space-y-6">
            {/* Experience */}
            <div>
              <h2 className="text-lg font-bold text-blue-900 mb-3 pb-2 border-b-2 border-blue-900">
                الخبرات المهنية
              </h2>
              <div className="space-y-4">
                {data.experiences.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-800">{exp.position}</h3>
                        <p className="text-blue-600 text-sm">{exp.company}</p>
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{exp.startDate} - {exp.current ? 'حتى الآن' : exp.endDate}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{exp.location}</p>
                    <ul className="mt-2 list-disc list-inside space-y-1">
                      {exp.description.map((item, idx) => (
                        <li key={idx} className="text-sm text-gray-600">{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div>
              <h2 className="text-lg font-bold text-blue-900 mb-3 pb-2 border-b-2 border-blue-900">
                المؤهلات العلمية
              </h2>
              <div className="space-y-4">
                {data.education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between">
                      <h3 className="font-bold text-gray-800">{edu.degree} في {edu.field}</h3>
                      <span className="text-sm text-gray-500">{edu.startDate} - {edu.endDate}</span>
                    </div>
                    <p className="text-blue-600 text-sm">{edu.institution}</p>
                    {edu.grade && (
                      <p className="text-sm text-gray-500 mt-1">التقدير: {edu.grade}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Projects */}
            {data.projects.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-blue-900 mb-3 pb-2 border-b-2 border-blue-900">
                  المشاريع
                </h2>
                <div className="space-y-4">
                  {data.projects.map((project) => (
                    <div key={project.id}>
                      <h3 className="font-bold text-gray-800">{project.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {project.technologies.map((tech, idx) => (
                          <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </BaseTemplate>
  );
};