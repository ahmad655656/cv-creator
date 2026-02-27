'use client';

import { CVData } from '../cvs/types';

interface TemplateProps {
  data: CVData;
}

export function MedicalTemplate({ data }: TemplateProps) {
  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900">
      {/* Header طبي */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">{data.personalInfo.fullName}</h1>
        <p className="text-xl text-blue-100 mb-4">{data.personalInfo.jobTitle}</p>
        <div className="flex flex-wrap gap-4 text-sm text-blue-100">
          <span className="flex items-center gap-1">📧 {data.personalInfo.email}</span>
          <span className="flex items-center gap-1">📱 {data.personalInfo.phone}</span>
          <span className="flex items-center gap-1">📍 {data.personalInfo.address}</span>
        </div>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-3 gap-6">
          {/* الشريط الجانبي */}
          <div className="col-span-1 space-y-6">
            {/* التخصصات */}
            {data.skills.length > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h2 className="text-lg font-bold text-blue-800 dark:text-blue-300 mb-3">التخصصات</h2>
                <div className="space-y-2">
                  {data.skills.map((skill, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-gray-300">{skill.name}</span>
                      <span className="text-sm text-blue-600">{skill.level}/5</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* اللغات */}
            {data.languages.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-3">اللغات</h2>
                <div className="space-y-2">
                  {data.languages.map((lang, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="text-gray-700 dark:text-gray-300">{lang.name}</span>
                      <span className="text-sm text-blue-600">{lang.proficiency}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* المحتوى الرئيسي */}
          <div className="col-span-2 space-y-6">
            {/* نبذة */}
            {data.personalInfo.summary && (
              <div>
                <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-3">نبذة طبية</h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {data.personalInfo.summary}
                </p>
              </div>
            )}

            {/* الخبرات الطبية */}
            {data.experiences.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">الخبرات الطبية</h2>
                <div className="space-y-4">
                  {data.experiences.map((exp, i) => (
                    <div key={i} className="border-r-4 border-blue-600 pr-4">
                      <div className="flex justify-between">
                        <h3 className="font-bold text-gray-800 dark:text-white">{exp.position}</h3>
                        <span className="text-sm text-gray-500">{exp.startDate} - {exp.current ? 'حالياً' : exp.endDate}</span>
                      </div>
                      <p className="text-blue-700 dark:text-blue-400 mt-1">{exp.company}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{exp.location}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* الشهادات والتراخيص */}
            {data.certifications.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">الشهادات والتراخيص</h2>
                <div className="grid grid-cols-2 gap-3">
                  {data.certifications.map((cert, i) => (
                    <div key={i} className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <h3 className="font-bold text-gray-800 dark:text-white">{cert.name}</h3>
                      <p className="text-sm text-blue-600 mt-1">{cert.issuer}</p>
                      <p className="text-xs text-gray-500 mt-1">{cert.date}</p>
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