'use client';

import { CVData } from '../cvs/types';
import { TemplateConfig } from '../cvs/editor/types/templateConfig';

interface TemplateProps {
  data: CVData;
  config?: TemplateConfig;
}

export function ExecutiveTemplate({ data, config }: TemplateProps) {
  const primaryColor = config?.primaryColor || '#2563eb';
  const secondaryColor = config?.secondaryColor || '#4f46e5';
  const headingColor = config?.headingColor || '#0f172a';
  const textColor = config?.textColor || '#334155';
  const mutedColor = config?.mutedTextColor || '#64748b';
  const headerTextColor = config?.headerTextColor || '#ffffff';

  return (
    <div className="mx-auto bg-white shadow-2xl overflow-hidden" style={{ fontFamily: config?.fontFamily || 'inherit', lineHeight: config?.lineHeight || 1.5, color: textColor }}>
      <div
        className="p-8"
        style={{ background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`, color: headerTextColor }}
      >
        <h1 className="font-bold mb-2" style={{ fontSize: `${config?.nameSize || 40}px`, fontFamily: config?.headingFontFamily || config?.fontFamily || 'inherit' }}>{data.personalInfo.fullName}</h1>
        <p className="opacity-90" style={{ fontSize: `${config?.titleSize || 22}px` }}>{data.personalInfo.jobTitle}</p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm opacity-90">
          <span>{data.personalInfo.email}</span>
          <span>{data.personalInfo.phone}</span>
          <span>{data.personalInfo.address}</span>
        </div>
      </div>

      <div className="grid grid-cols-3" style={{ padding: `${config?.pagePadding || 32}px`, gap: `${config?.sectionSpacing || 24}px` }}>
        <div className="col-span-1" style={{ display: 'grid', gap: `${config?.blockSpacing || 14}px` }}>
          {data.skills.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="font-bold mb-3 border-b pb-2" style={{ borderColor: `${primaryColor}44`, fontSize: `${config?.sectionTitleSize || 22}px`, color: headingColor, fontFamily: config?.headingFontFamily || config?.fontFamily || 'inherit' }}>
                Skills
              </h2>
              <div className="space-y-2">
                {data.skills.map((skill, i) => (
                  <div key={i} className="flex items-center justify-between" style={{ fontSize: `${config?.bodySize || 14}px` }}>
                    <span>{skill.name}</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <span
                          key={level}
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: level <= skill.level ? primaryColor : '#d1d5db' }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.languages.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="font-bold mb-3 border-b pb-2" style={{ borderColor: `${primaryColor}44`, fontSize: `${config?.sectionTitleSize || 22}px`, color: headingColor, fontFamily: config?.headingFontFamily || config?.fontFamily || 'inherit' }}>
                Languages
              </h2>
              <div className="space-y-2">
                {data.languages.map((lang, i) => (
                  <div key={i} className="flex justify-between" style={{ fontSize: `${config?.bodySize || 14}px` }}>
                    <span>{lang.name}</span>
                    <span style={{ color: primaryColor }}>{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="col-span-2" style={{ display: 'grid', gap: `${config?.sectionSpacing || 24}px` }}>
          {data.personalInfo.summary && (
            <section>
              <h2 className="font-bold mb-3 border-b-2 pb-2" style={{ borderColor: primaryColor, fontSize: `${config?.sectionTitleSize || 22}px`, color: headingColor, fontFamily: config?.headingFontFamily || config?.fontFamily || 'inherit' }}>
                Summary
              </h2>
              <p style={{ fontSize: `${config?.bodySize || 14}px` }}>{data.personalInfo.summary}</p>
            </section>
          )}

          {data.experiences.length > 0 && (
            <section>
              <h2 className="font-bold mb-4 border-b-2 pb-2" style={{ borderColor: primaryColor, fontSize: `${config?.sectionTitleSize || 22}px`, color: headingColor, fontFamily: config?.headingFontFamily || config?.fontFamily || 'inherit' }}>
                Experience
              </h2>
              <div style={{ display: 'grid', gap: `${config?.blockSpacing || 14}px` }}>
                {data.experiences.map((exp, i) => (
                  <div key={i} className="relative pr-6">
                    <span
                      className="absolute right-0 top-2 w-2 h-2 rounded-full"
                      style={{ backgroundColor: primaryColor }}
                    />
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <h3 className="font-bold" style={{ fontSize: `${(config?.bodySize || 14) + 1}px`, color: headingColor }}>{exp.position}</h3>
                        <p style={{ color: primaryColor }}>{exp.company}</p>
                      </div>
                      <span className="text-sm" style={{ fontSize: `${Math.max((config?.bodySize || 14) - 1, 11)}px`, color: mutedColor }}>
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    {exp.description.length > 0 && (
                      <ul className="mt-2 space-y-1" style={{ fontSize: `${config?.bodySize || 14}px` }}>
                        {exp.description.filter(Boolean).map((desc, j) => (
                          <li key={j}>• {desc}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
