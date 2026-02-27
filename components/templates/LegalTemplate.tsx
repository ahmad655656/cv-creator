'use client';

import { CVData } from '../cvs/types';

interface TemplateProps {
  data: CVData;
}

export function LegalTemplate({ data }: TemplateProps) {
  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900">
      {/* Header قانوني كلاسيكي */}
      <div className="bg-gradient-to-r from-amber-900 to-amber-700 p-8 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-serif font-bold mb-2">{data.personalInfo.fullName}</h1>
            <p className="text-amber-200 text-lg">{data.personalInfo.jobTitle}</p>
          </div>
          <div className="text-right border-r-2 border-amber-400 pr-4">
            <p className="text-amber-200 text-sm">محامٍ معتمد</p>
            <p className="text-amber-200 text-sm">نقابة المحامين</p>
          </div>
        </div>
        
        {/* معلومات الاتصال */}
        <div className="grid grid-cols-3 gap-4 mt-6 text-sm text-amber-100">
          <div className="flex items-center gap-2">
            <span className="text-amber-300">⚖️</span>
            <span>{data.personalInfo.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-amber-300">📞</span>
            <span>{data.personalInfo.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-amber-300">📍</span>
            <span>{data.personalInfo.address}</span>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* الشعار القانوني */}
        <div className="text-center mb-8">
          <p className="text-amber-700 dark:text-amber-500 text-sm font-serif italic">
            "العدل أساس الملك"
          </p>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* الشريط الجانبي */}
          <div className="col-span-1 space-y-6">
            {/* التخصصات القانونية */}
            {data.skills.length > 0 && (
              <div className="border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <h2 className="text-lg font-serif font-bold text-amber-900 dark:text-amber-500 mb-3 border-b border-amber-200 pb-2">
                  التخصصات
                </h2>
                <div className="space-y-3">
                  {data.skills.map((skill, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700 dark:text-gray-300">{skill.name}</span>
                        <span className="text-amber-700 dark:text-amber-500">{skill.level}/5</span>
                      </div>
                      <div className="h-1.5 bg-amber-100 dark:bg-amber-900/30 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-amber-700 dark:bg-amber-500 rounded-full"
                          style={{ width: `${(skill.level / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* العضويات والنقابات */}
            {data.certifications.length > 0 && (
              <div className="border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <h2 className="text-lg font-serif font-bold text-amber-900 dark:text-amber-500 mb-3 border-b border-amber-200 pb-2">
                  العضويات
                </h2>
                <div className="space-y-3">
                  {data.certifications.map((cert, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-amber-700">⚖️</span>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">{cert.name}</p>
                        <p className="text-sm text-amber-700 dark:text-amber-500">{cert.issuer}</p>
                        <p className="text-xs text-gray-500">{cert.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* اللغات */}
            {data.languages.length > 0 && (
              <div className="border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <h2 className="text-lg font-serif font-bold text-amber-900 dark:text-amber-500 mb-3 border-b border-amber-200 pb-2">
                  اللغات
                </h2>
                <div className="space-y-2">
                  {data.languages.map((lang, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="text-gray-700 dark:text-gray-300">{lang.name}</span>
                      <span className="text-sm text-amber-700 dark:text-amber-500">{lang.proficiency}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* المحتوى الرئيسي */}
          <div className="col-span-2 space-y-6">
            {/* نبذة قانونية */}
            {data.personalInfo.summary && (
              <div className="border border-amber-200 dark:border-amber-800 rounded-lg p-6">
                <h2 className="text-lg font-serif font-bold text-amber-900 dark:text-amber-500 mb-3">
                  السيرة القانونية
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {data.personalInfo.summary}
                </p>
              </div>
            )}

            {/* الخبرات القانونية */}
            {data.experiences.length > 0 && (
              <div className="border border-amber-200 dark:border-amber-800 rounded-lg p-6">
                <h2 className="text-lg font-serif font-bold text-amber-900 dark:text-amber-500 mb-4">
                  الخبرات القانونية
                </h2>
                <div className="space-y-6">
                  {data.experiences.map((exp, i) => (
                    <div key={i} className="relative pr-6">
                      {/* نقطة زمنية */}
                      <div className="absolute right-0 top-1 w-2 h-2 bg-amber-700 rounded-full"></div>
                      
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-gray-800 dark:text-white">{exp.position}</h3>
                          <p className="text-amber-700 dark:text-amber-500 mt-1">{exp.company}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{exp.location}</p>
                        </div>
                        <span className="text-sm bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 px-2 py-1 rounded">
                          {exp.startDate} - {exp.current ? 'حالياً' : exp.endDate}
                        </span>
                      </div>

                      {/* القضايا والمهام */}
                      {exp.description.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">القضايا:</p>
                          <ul className="space-y-1">
                            {exp.description.filter(d => d).map((desc, j) => (
                              <li key={j} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                                <span className="text-amber-600">•</span>
                                <span>{desc}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* التعليم القانوني */}
            {data.education.length > 0 && (
              <div className="border border-amber-200 dark:border-amber-800 rounded-lg p-6">
                <h2 className="text-lg font-serif font-bold text-amber-900 dark:text-amber-500 mb-4">
                  التعليم القانوني
                </h2>
                <div className="space-y-4">
                  {data.education.map((edu, i) => (
                    <div key={i} className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-800 dark:text-white">{edu.degree}</h3>
                        <p className="text-amber-700 dark:text-amber-500">{edu.institution}</p>
                        {edu.grade && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">التقدير: {edu.grade}</p>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">
                        {edu.startDate} - {edu.current ? 'حالياً' : edu.endDate}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* الأبحاث والمنشورات */}
            {data.projects.length > 0 && (
              <div className="border border-amber-200 dark:border-amber-800 rounded-lg p-6">
                <h2 className="text-lg font-serif font-bold text-amber-900 dark:text-amber-500 mb-4">
                  الأبحاث والمنشورات
                </h2>
                <div className="space-y-3">
                  {data.projects.map((project, i) => (
                    <div key={i} className="border-b border-amber-100 dark:border-amber-800/50 pb-3 last:border-0">
                      <h3 className="font-medium text-gray-800 dark:text-white">{project.name}</h3>
                      <p className="text-sm text-amber-700 dark:text-amber-500 mt-1">
                        {project.technologies.join(' • ')}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{project.startDate}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* توقيع المحامي */}
        <div className="mt-8 pt-6 border-t border-amber-200 dark:border-amber-800 text-center">
          <p className="text-amber-700 dark:text-amber-500 text-sm">
            تم التحقق من صحة المعلومات حسب الأصول القانونية
          </p>
          <div className="mt-2 text-xs text-gray-400">
            {new Date().toLocaleDateString('ar-EG')}
          </div>
        </div>
      </div>
    </div>
  );
}