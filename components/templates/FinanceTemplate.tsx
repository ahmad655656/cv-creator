'use client';

import { CVData } from '../cvs/types';

interface TemplateProps {
  data: CVData;
}

export function FinanceTemplate({ data }: TemplateProps) {
  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900">
      {/* Header مالي */}
      <div className="bg-gradient-to-r from-emerald-900 to-emerald-700 p-8 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">{data.personalInfo.fullName}</h1>
            <p className="text-emerald-200 text-lg">{data.personalInfo.jobTitle}</p>
          </div>
          <div className="text-right">
            <p className="text-emerald-200 text-sm">محلل مالي معتمد</p>
            <p className="text-emerald-200 text-sm">CFA, CPA</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-6 text-sm text-emerald-100">
          <div>📧 {data.personalInfo.email}</div>
          <div>📱 {data.personalInfo.phone}</div>
          <div>📍 {data.personalInfo.address}</div>
        </div>
      </div>

      <div className="p-8">
        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
              {data.experiences.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">سنوات خبرة</div>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
              {data.certifications.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">شهادات مهنية</div>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
              {data.skills.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">مهارات مالية</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* الشريط الجانبي */}
          <div className="col-span-1 space-y-4">
            {/* المهارات المالية */}
            {data.skills.length > 0 && (
              <div>
                <h2 className="font-bold text-gray-800 dark:text-white mb-3">المهارات المالية</h2>
                <div className="space-y-2">
                  {data.skills.map((skill, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">{skill.name}</span>
                        <span className="text-emerald-600">{skill.level}/5</span>
                      </div>
                      <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-600 rounded-full"
                          style={{ width: `${(skill.level / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* الشهادات المهنية */}
            {data.certifications.length > 0 && (
              <div>
                <h2 className="font-bold text-gray-800 dark:text-white mb-3">الشهادات</h2>
                <div className="space-y-2">
                  {data.certifications.map((cert, i) => (
                    <div key={i} className="border border-emerald-200 dark:border-emerald-800 p-2 rounded">
                      <div className="font-medium text-gray-800 dark:text-white">{cert.name}</div>
                      <div className="text-sm text-emerald-600">{cert.issuer}</div>
                      <div className="text-xs text-gray-500">{cert.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* المحتوى الرئيسي */}
          <div className="col-span-2 space-y-6">
            {/* الخبرات المالية */}
            {data.experiences.length > 0 && (
              <div>
                <h2 className="font-bold text-gray-800 dark:text-white mb-4">الخبرات المالية</h2>
                <div className="space-y-4">
                  {data.experiences.map((exp, i) => (
                    <div key={i} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                      <div className="flex justify-between">
                        <h3 className="font-bold text-gray-800 dark:text-white">{exp.position}</h3>
                        <span className="text-sm text-emerald-600">{exp.startDate} - {exp.current ? 'حالياً' : exp.endDate}</span>
                      </div>
                      <p className="text-emerald-700 dark:text-emerald-400 mt-1">{exp.company}</p>
                      <p className="text-sm text-gray-500 mt-1">{exp.location}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* التعليم المالي */}
            {data.education.length > 0 && (
              <div>
                <h2 className="font-bold text-gray-800 dark:text-white mb-4">التعليم</h2>
                <div className="space-y-3">
                  {data.education.map((edu, i) => (
                    <div key={i}>
                      <h3 className="font-medium text-gray-800 dark:text-white">{edu.degree}</h3>
                      <p className="text-emerald-700 dark:text-emerald-400">{edu.institution}</p>
                      <p className="text-sm text-gray-500">{edu.startDate} - {edu.current ? 'حالياً' : edu.endDate}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}