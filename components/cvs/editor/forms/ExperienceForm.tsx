// components/editor/forms/ExperienceForm.tsx
'use client';

import { useState } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { Experience } from '../types';

interface ExperienceFormProps {
  experiences: Experience[];
  addExperience: () => void;
  updateExperience: (id: string, field: string, value: any) => void;
  updateExperienceDescription: (id: string, index: number, value: string) => void;
  addExperienceDescription: (id: string) => void;
  removeExperienceDescription: (id: string, index: number) => void;
  removeExperience: (id: string) => void;
}

export const ExperienceForm = ({
  experiences,
  addExperience,
  updateExperience,
  updateExperienceDescription,
  addExperienceDescription,
  removeExperienceDescription,
  removeExperience
}: ExperienceFormProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {experiences.map((exp) => (
        <div
          key={exp.id}
          className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900 dark:text-white">
              {exp.position || 'خبرة جديدة'}
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => removeExperience(exp.id)}
                className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 rounded-lg"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                المسمى الوظيفي
              </label>
              <input
                type="text"
                value={exp.position || ''}
                onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl"
                placeholder="مطور برمجيات"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                اسم الشركة
              </label>
              <input
                type="text"
                value={exp.company || ''}
                onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl"
                placeholder="شركة..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                الموقع
              </label>
              <input
                type="text"
                value={exp.location || ''}
                onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl"
                placeholder="الرياض، السعودية"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  تاريخ البداية
                </label>
                <input
                  type="month"
                  value={exp.startDate || ''}
                  onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl"
                />
              </div>
              {!exp.current && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    تاريخ النهاية
                  </label>
                  <input
                    type="month"
                    value={exp.endDate || ''}
                    onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl"
                  />
                </div>
              )}
            </div>

            <div className="col-span-2 flex items-center gap-2">
              <input
                type="checkbox"
                checked={exp.current || false}
                onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                className="rounded border-gray-300 text-blue-600"
                id={`current-${exp.id}`}
              />
              <label htmlFor={`current-${exp.id}`} className="text-sm text-gray-700 dark:text-gray-300">
                أعمل هنا حالياً
              </label>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                المهام والمسؤوليات
              </label>
              <div className="space-y-3">
                {exp.description?.map((desc, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={desc || ''}
                      onChange={(e) => updateExperienceDescription(exp.id, index, e.target.value)}
                      className="flex-1 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl"
                      placeholder="وصف المهمة..."
                    />
                    <button
                      onClick={() => removeExperienceDescription(exp.id, index)}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addExperienceDescription(exp.id)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
                >
                  <Plus size={16} />
                  إضافة مهمة
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addExperience}
        className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-600 transition flex items-center justify-center gap-2"
      >
        <Plus size={20} />
        إضافة خبرة جديدة
      </button>
    </div>
  );
};