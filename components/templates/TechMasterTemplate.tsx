'use client';

import { CVData } from '../cvs/types';
import { TemplateConfig } from '../cvs/editor/types/templateConfig';

interface TemplateProps {
  data: CVData;
  config?: TemplateConfig;
}

export function TechMasterTemplate({ data, config }: TemplateProps) {
  const primaryColor = config?.primaryColor || '#10b981';
  const secondaryColor = config?.secondaryColor || '#06b6d4';
  const headingColor = config?.headingColor || '#0f172a';
  const textColor = config?.textColor || '#334155';
  const mutedColor = config?.mutedTextColor || '#64748b';
  const headerTextColor = config?.headerTextColor || '#ffffff';

  return (
    <div className="mx-auto bg-gray-50" style={{ fontFamily: config?.fontFamily || 'inherit', lineHeight: config?.lineHeight || 1.5, color: textColor }}>
      <div className="p-6" style={{ background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`, color: headerTextColor }}>
        <h1 className="font-bold" style={{ fontSize: `${config?.nameSize || 40}px`, fontFamily: config?.headingFontFamily || config?.fontFamily || 'inherit' }}>{data.personalInfo.fullName}</h1>
        <p className="opacity-90 mt-1" style={{ fontSize: `${config?.titleSize || 22}px` }}>{data.personalInfo.jobTitle}</p>
        <div className="mt-3 flex flex-wrap gap-4 text-sm opacity-90">
          <span>{data.personalInfo.email}</span>
          <span>{data.personalInfo.phone}</span>
          <span>{data.personalInfo.address}</span>
        </div>
      </div>

      <div className="grid grid-cols-3" style={{ padding: `${config?.pagePadding || 32}px`, gap: `${config?.sectionSpacing || 24}px` }}>
        <div className="col-span-1" style={{ display: 'grid', gap: `${config?.blockSpacing || 14}px` }}>
          {data.skills.length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h2 className="font-bold mb-3" style={{ fontSize: `${config?.sectionTitleSize || 22}px`, color: headingColor, fontFamily: config?.headingFontFamily || config?.fontFamily || 'inherit' }}>Tech Stack</h2>
              <div style={{ display: 'grid', gap: `${Math.max((config?.blockSpacing || 14) - 4, 6)}px` }}>
                {data.skills.map((skill, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-1" style={{ fontSize: `${config?.bodySize || 14}px` }}>
                      <span>{skill.name}</span>
                      <span style={{ color: primaryColor }}>{skill.level}/5</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${(skill.level / 5) * 100}%`, backgroundColor: primaryColor }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.languages.length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h2 className="font-bold mb-3" style={{ fontSize: `${config?.sectionTitleSize || 22}px`, color: headingColor, fontFamily: config?.headingFontFamily || config?.fontFamily || 'inherit' }}>Languages</h2>
              <div style={{ display: 'grid', gap: `${Math.max((config?.blockSpacing || 14) - 5, 6)}px`, fontSize: `${config?.bodySize || 14}px` }}>
                {data.languages.map((lang, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{lang.name}</span>
                    <span style={{ color: primaryColor }}>{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="col-span-2" style={{ display: 'grid', gap: `${config?.sectionSpacing || 24}px` }}>
          {data.experiences.length > 0 && (
            <section className="bg-white p-4 rounded-lg shadow-sm">
              <h2 className="font-bold mb-3 border-l-4 pl-2" style={{ borderColor: primaryColor, fontSize: `${config?.sectionTitleSize || 22}px`, color: headingColor, fontFamily: config?.headingFontFamily || config?.fontFamily || 'inherit' }}>
                Experience
              </h2>
              <div style={{ display: 'grid', gap: `${config?.blockSpacing || 14}px` }}>
                {data.experiences.map((exp, i) => (
                  <div key={i} className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
                    <div className="flex justify-between gap-3">
                      <h3 className="font-bold" style={{ fontSize: `${(config?.bodySize || 14) + 1}px`, color: headingColor }}>{exp.position}</h3>
                      <span className="text-sm" style={{ color: mutedColor }}>
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <p className="text-sm mb-2" style={{ color: primaryColor }}>
                      {exp.company}
                    </p>
                    {exp.description.length > 0 && (
                      <ul className="list-disc list-inside" style={{ fontSize: `${config?.bodySize || 14}px` }}>
                        {exp.description.filter(Boolean).map((desc, j) => (
                          <li key={j}>{desc}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.education.length > 0 && (
            <section className="bg-white p-4 rounded-lg shadow-sm">
              <h2 className="font-bold mb-3 border-l-4 pl-2" style={{ borderColor: primaryColor, fontSize: `${config?.sectionTitleSize || 22}px`, color: headingColor, fontFamily: config?.headingFontFamily || config?.fontFamily || 'inherit' }}>
                Education
              </h2>
              <div style={{ display: 'grid', gap: `${Math.max((config?.blockSpacing || 14) - 4, 6)}px` }}>
                {data.education.map((edu, i) => (
                  <div key={i}>
                    <div className="flex justify-between gap-3">
                      <h3 className="font-bold" style={{ fontSize: `${(config?.bodySize || 14) + 1}px`, color: headingColor }}>{edu.degree}</h3>
                      <span className="text-sm" style={{ color: mutedColor }}>
                        {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                      </span>
                    </div>
                    <p style={{ color: primaryColor }}>{edu.institution}</p>
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
