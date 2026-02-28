'use client';

import { CVData } from '../cvs/types';
import type { TemplateConfig } from '@/lib/types/template-config';

interface TemplateProps {
  data: CVData;
  config?: TemplateConfig;
}

export function AcademicTemplate({ data, config }: TemplateProps) {
  const primaryColor = config?.primaryColor || '#166534';
  const secondaryColor = config?.secondaryColor || '#1d4ed8';
  const headingColor = config?.headingColor || '#0f172a';
  const textColor = config?.textColor || '#334155';
  const mutedColor = config?.mutedTextColor || '#64748b';
  const headerTextColor = config?.headerTextColor || '#ffffff';

  return (
    <div className="mx-auto bg-white" style={{ fontFamily: config?.fontFamily || 'inherit', lineHeight: config?.lineHeight || 1.6, color: textColor }}>
      <div className="p-8" style={{ background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`, color: headerTextColor }}>
        <h1 className="font-bold mb-2" style={{ fontSize: `${config?.nameSize || 40}px`, fontFamily: config?.headingFontFamily || config?.fontFamily || 'inherit' }}>{data.personalInfo.fullName}</h1>
        <p className="opacity-90" style={{ fontSize: `${config?.titleSize || 22}px` }}>{data.personalInfo.jobTitle}</p>
        <div className="mt-4 flex flex-wrap gap-5 text-sm opacity-90">
          <span>{data.personalInfo.email}</span>
          <span>{data.personalInfo.phone}</span>
          <span>{data.personalInfo.address}</span>
        </div>
      </div>

      <div style={{ padding: `${config?.pagePadding || 32}px` }}>
        {data.personalInfo.summary && (
          <div className="mb-6 p-4 bg-gray-50 border-r-4 rounded" style={{ borderColor: primaryColor }}>
            <p className="italic" style={{ fontSize: `${config?.bodySize || 14}px` }}>{data.personalInfo.summary}</p>
          </div>
        )}

        <div className="grid grid-cols-3" style={{ gap: `${config?.sectionSpacing || 24}px` }}>
          <div className="col-span-1">
            {data.education.length > 0 && (
              <section className="mb-6">
                <h2 className="font-bold mb-3 border-b pb-2" style={{ color: primaryColor, fontSize: `${config?.sectionTitleSize || 22}px`, fontFamily: config?.headingFontFamily || config?.fontFamily || 'inherit' }}>
                  Education
                </h2>
                <div style={{ display: 'grid', gap: `${Math.max((config?.blockSpacing || 14) - 4, 6)}px` }}>
                  {data.education.map((edu, i) => (
                    <div key={i}>
                      <h3 className="font-bold" style={{ fontSize: `${(config?.bodySize || 14) + 1}px`, color: headingColor }}>{edu.degree}</h3>
                      <p style={{ color: primaryColor }}>{edu.institution}</p>
                      <p className="text-sm" style={{ color: mutedColor }}>
                        {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                      </p>
                      {edu.grade && <p style={{ fontSize: `${config?.bodySize || 14}px` }}>Grade: {edu.grade}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {data.skills.length > 0 && (
              <section>
                <h2 className="font-bold mb-3 border-b pb-2" style={{ color: primaryColor, fontSize: `${config?.sectionTitleSize || 22}px`, fontFamily: config?.headingFontFamily || config?.fontFamily || 'inherit' }}>
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full"
                      style={{ backgroundColor: `${primaryColor}22`, color: headingColor, fontSize: `${config?.bodySize || 14}px` }}
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="col-span-2">
            {data.experiences.length > 0 && (
              <section className="mb-6">
                <h2 className="font-bold mb-3 border-b pb-2" style={{ color: primaryColor, fontSize: `${config?.sectionTitleSize || 22}px`, fontFamily: config?.headingFontFamily || config?.fontFamily || 'inherit' }}>
                  Experience
                </h2>
                <div style={{ display: 'grid', gap: `${config?.blockSpacing || 14}px` }}>
                  {data.experiences.map((exp, i) => (
                    <div key={i}>
                      <div className="flex justify-between gap-3">
                        <h3 className="font-bold" style={{ fontSize: `${(config?.bodySize || 14) + 1}px`, color: headingColor }}>{exp.position}</h3>
                        <span className="text-sm" style={{ color: mutedColor }}>
                          {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                        </span>
                      </div>
                      <p style={{ color: primaryColor }}>{exp.company}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {data.certifications.length > 0 && (
              <section>
                <h2 className="font-bold mb-3 border-b pb-2" style={{ color: primaryColor, fontSize: `${config?.sectionTitleSize || 22}px`, fontFamily: config?.headingFontFamily || config?.fontFamily || 'inherit' }}>
                  Certifications
                </h2>
                <div style={{ display: 'grid', gap: `${Math.max((config?.blockSpacing || 14) - 4, 6)}px` }}>
                  {data.certifications.map((cert, i) => (
                    <div key={i} className="border-b pb-2 last:border-0">
                      <h3 className="font-bold" style={{ fontSize: `${(config?.bodySize || 14) + 1}px`, color: headingColor }}>{cert.name}</h3>
                      <p style={{ color: primaryColor }}>{cert.issuer}</p>
                      <p className="text-sm" style={{ color: mutedColor }}>{cert.date}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

