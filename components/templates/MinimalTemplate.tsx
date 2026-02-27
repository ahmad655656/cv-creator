'use client';

import { CVData } from '../cvs/types';

interface TemplateProps {
  data: CVData;
}

export function MinimalTemplate({ data }: TemplateProps) {
  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900">
      {/* Header بسيط */}
      <div className="p-8 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-3xl font-light text-gray-900 dark:text-white mb-2">
          {data.personalInfo.fullName}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg font-light">
          {data.personalInfo.jobTitle}
        </p>
        
        {/* معلومات الاتصال بشكل بسيط */}
        <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500 dark:text-gray-500">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
          {data.personalInfo.address && <span>{data.personalInfo.address}</span>}
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="p-8 space-y-8">
        {/* نبذة عني */}
        {data.personalInfo.summary && (
          <div>
            <h2 className="text-sm uppercase tracking-wider text-gray-400 mb-3">نبذة</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {data.personalInfo.summary}
            </p>
          </div>
        )}

        {/* الخبرات */}
        {data.experiences.length > 0 && (
          <div>
            <h2 className="text-sm uppercase tracking-wider text-gray-400 mb-4">الخبرات</h2>
            <div className="space-y-6">
              {data.experiences.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-medium text-gray-900 dark:text-white">{exp.position}</h3>
                    <span className="text-sm text-gray-400">
                      {exp.startDate} — {exp.current ? 'حالياً' : exp.endDate}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{exp.company}</p>
                  {exp.description.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {exp.description.filter(d => d).map((desc, j) => (
                        <li key={j} className="text-sm text-gray-500 dark:text-gray-500">— {desc}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* التعليم */}
        {data.education.length > 0 && (
          <div>
            <h2 className="text-sm uppercase tracking-wider text-gray-400 mb-4">التعليم</h2>
            <div className="space-y-4">
              {data.education.map((edu, i) => (
                <div key={i}>
                  <div className="flex justify-between">
                    <h3 className="font-medium text-gray-900 dark:text-white">{edu.degree}</h3>
                    <span className="text-sm text-gray-400">{edu.startDate} — {edu.current ? 'حالياً' : edu.endDate}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">{edu.institution}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* المهارات */}
        {data.skills.length > 0 && (
          <div>
            <h2 className="text-sm uppercase tracking-wider text-gray-400 mb-3">المهارات</h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, i) => (
                <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}