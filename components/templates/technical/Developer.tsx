'use client';

import React from 'react';
import { CVData } from '@/lib/types/template.types';
import { BaseTemplate } from '../BaseTemplate';
import { Code2, GitBranch, Terminal, Cpu } from 'lucide-react';

export const DeveloperTemplate: React.FC<{ data: CVData }> = ({ data }) => {
  return (
    <BaseTemplate 
      data={data} 
      config={{
        colors: {
          primary: '#0d1117',
          secondary: '#58a6ff',
          accent: '#161b22',
          text: '#c9d1d9',
          background: '#0d1117',
        },
        fonts: { heading: 'Fira Code', body: 'Fira Code' },
        layout: 'two-column',
        spacing: 'compact',
        showAvatar: true,
        showIcons: true,
      }}
    >
      <div className="max-w-4xl mx-auto bg-[#0d1117] text-[#c9d1d9] font-mono">
        {/* Header بتصميم terminal */}
        <div className="border-b border-[#30363d] p-6">
          <div className="flex items-center gap-2 text-[#58a6ff] mb-4">
            <Terminal size={20} />
            <span>~/profile</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[#8b949e]">$ name</p>
              <p className="text-[#58a6ff] text-xl">{data.personalInfo.fullName}</p>
            </div>
            <div>
              <p className="text-[#8b949e]">$ title</p>
              <p className="text-[#58a6ff]">{data.personalInfo.jobTitle}</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-3 gap-4 p-6">
          {/* Left Column - مثل README */}
          <div className="col-span-1 space-y-4">
            <div className="border border-[#30363d] rounded-lg p-4">
              <h3 className="text-[#58a6ff] mb-3 flex items-center gap-2">
                <Code2 size={16} />
                tech stack
              </h3>
              {data.skills.map(skill => (
                <div key={skill.id} className="mb-2">
                  <span className="text-sm text-[#8b949e]">{skill.name}</span>
                  <div className="w-full h-2 bg-[#30363d] rounded-full mt-1">
                    <div 
                      className="h-2 bg-[#58a6ff] rounded-full"
                      style={{ width: `${skill.level * 20}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Experience like commits */}
          <div className="col-span-2 space-y-4">
            <div className="border border-[#30363d] rounded-lg p-4">
              <h3 className="text-[#58a6ff] mb-3 flex items-center gap-2">
                <GitBranch size={16} />
                work history
              </h3>
              {data.experiences.map(exp => (
                <div key={exp.id} className="mb-4 relative pr-4 before:content-[''] before:absolute before:right-0 before:top-2 before:w-2 before:h-2 before:bg-[#58a6ff] before:rounded-full">
                  <div className="flex justify-between mb-1">
                    <span className="font-bold">{exp.position}</span>
                    <span className="text-xs text-[#8b949e]">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <p className="text-[#8b949e] text-sm mb-2">{exp.company}</p>
                  <ul className="list-disc list-inside space-y-1">
                    {exp.description.map((item, idx) => (
                      <li key={idx} className="text-sm text-[#c9d1d9]">{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </BaseTemplate>
  );
};