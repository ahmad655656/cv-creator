'use client';

import { CVData } from '../cvs/types';

interface TemplateProps {
  data: CVData;
}

export function CreativeTemplate({ data }: TemplateProps) {
  return (
    <div className="max-w-4xl mx-auto bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header إبداعي */}
      <div className="relative h-48 bg-gradient-to-r from-purple-600 to-pink-600 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="none" stroke="white" strokeWidth="0.5" />
          </svg>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <h1 className="text-4xl font-bold mb-2">{data.personalInfo.fullName}</h1>
          <p className="text-xl text-purple-100">{data.personalInfo.jobTitle}</p>
        </div>
        
        {/* صورة دائرية */}
        <div className="absolute -bottom-16 right-8">
          <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gradient-to-br from-purple-400 to-pink-400">
            {data.personalInfo.profileImage ? (
              <img src={data.personalInfo.profileImage} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl text-white">
                {data.personalInfo.fullName?.charAt(0) || '?'}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="pt-20 p-8">
        {/* معلومات الاتصال بشكل إبداعي */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {data.personalInfo.email && (
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md text-center">
              <div className="text-2xl mb-1">📧</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{data.personalInfo.email}</div>
            </div>
          )}
          {data.personalInfo.phone && (
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md text-center">
              <div className="text-2xl mb-1">📱</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{data.personalInfo.phone}</div>
            </div>
          )}
          {data.personalInfo.address && (
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md text-center">
              <div className="text-2xl mb-1">📍</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{data.personalInfo.address}</div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* الشريط الجانبي */}
          <div className="col-span-1 space-y-6">
            {/* المهارات الإبداعية */}
            {data.skills.length > 0 && (
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
                <h2 className="text-lg font-bold text-purple-600 mb-3">المهارات</h2>
                <div className="space-y-3">
                  {data.skills.map((skill, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700 dark:text-gray-300">{skill.name}</span>
                        <span className="text-purple-600">{skill.level}/5</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                          style={{ width: `${(skill.level / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* اللغات */}
            {data.languages.length > 0 && (
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
                <h2 className="text-lg font-bold text-pink-600 mb-3">اللغات</h2>
                <div className="space-y-2">
                  {data.languages.map((lang, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="text-gray-700 dark:text-gray-300">{lang.name}</span>
                      <span className="text-sm text-pink-600">{lang.proficiency}</span>
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
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-3">نبذة إبداعية</h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {data.personalInfo.summary}
                </p>
              </div>
            )}

            {/* المشاريع الإبداعية */}
            {data.projects.length > 0 && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">المشاريع</h2>
                <div className="grid grid-cols-2 gap-4">
                  {data.projects.map((project, i) => (
                    <div key={i} className="border border-purple-200 dark:border-purple-800 p-3 rounded-lg">
                      <h3 className="font-bold text-gray-800 dark:text-white">{project.name}</h3>
                      <p className="text-sm text-purple-600 mt-1">{project.technologies.join(' • ')}</p>
                      <p className="text-xs text-gray-500 mt-2">{project.startDate} - {project.current ? 'حالياً' : project.endDate}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* الخبرات */}
            {data.experiences.length > 0 && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">الخبرات</h2>
                <div className="space-y-4">
                  {data.experiences.map((exp, i) => (
                    <div key={i}>
                      <div className="flex justify-between">
                        <h3 className="font-bold text-gray-800 dark:text-white">{exp.position}</h3>
                        <span className="text-sm text-pink-600">{exp.startDate} - {exp.current ? 'حالياً' : exp.endDate}</span>
                      </div>
                      <p className="text-purple-600">{exp.company}</p>
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