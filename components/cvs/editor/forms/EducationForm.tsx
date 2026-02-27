// components/editor/forms/EducationForm.tsx
'use client';

import { Plus, Trash2 } from 'lucide-react';
import { Education } from '../types';

interface EducationFormProps {
  education: Education[];
  addEducation: () => void;
  updateEducation: (id: string, field: string, value: any) => void;
  removeEducation: (id: string) => void;
}

export const EducationForm = ({ education, addEducation, updateEducation, removeEducation }: EducationFormProps) => {
  return (
    <div className="space-y-6">
      {education.map((edu) => (
        <div
          key={edu.id}
          className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900 dark:text-white">
              {edu.degree || 'مؤهل جديد'}
            </h3>
            <button
              onClick={() => removeEducation(edu.id)}
              className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 rounded-lg"
            >
              <Trash2 size={16} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                الدرجة العلمية
              </label>
              <input
                type="text"
                value={edu.degree || ''}
                onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl"
                placeholder="بكالوريوس"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                التخصص
              </label>
              <input
                type="text"
                value={edu.field || ''}
                onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl"
                placeholder="علوم الحاسب"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                اسم المؤسسة التعليمية
              </label>
              <input
                type="text"
                value={edu.institution || ''}
                onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl"
                placeholder="جامعة الملك سعود"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                سنة البداية
              </label>
              <input
                type="month"
                value={edu.startDate || ''}
                onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                سنة التخرج
              </label>
              <input
                type="month"
                value={edu.endDate || ''}
                onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                المعدل/التقدير (اختياري)
              </label>
              <input
                type="text"
                value={edu.grade || ''}
                onChange={(e) => updateEducation(edu.id, 'grade', e.target.value)}
                className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl"
                placeholder="ممتاز - 4.5/5"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addEducation}
        className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-600 transition flex items-center justify-center gap-2"
      >
        <Plus size={20} />
        إضافة مؤهل تعليمي
      </button>
    </div>
  );
};