'use client';

import { Plus, Trash2 } from 'lucide-react';
import { Experience } from '../types';

interface ExperienceFormProps {
  experiences: Experience[];
  addExperience: () => void;
  updateExperience: (id: string, field: keyof Experience, value: any) => void;
  updateExperienceDescription: (id: string, index: number, value: string) => void;
  addExperienceDescription: (id: string) => void;
  removeExperienceDescription: (id: string, index: number) => void;
  removeExperience: (id: string) => void;
}

export function ExperienceForm({
  experiences,
  addExperience,
  updateExperience,
  updateExperienceDescription,
  addExperienceDescription,
  removeExperienceDescription,
  removeExperience
}: ExperienceFormProps) {
  return (
    <div className="space-y-6">
      {experiences.map((exp, index) => (
        <div key={exp.id} className="relative group">
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-medium text-gray-900 dark:text-white">
                خبرة {index + 1}
              </h3>
              <button
                onClick={() => removeExperience(exp.id)}
                className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">الشركة</label>
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
                  placeholder="اسم الشركة"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">المسمى الوظيفي</label>
                <input
                  type="text"
                  value={exp.position}
                  onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
                  placeholder="المسمى الوظيفي"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">الموقع</label>
                <input
                  type="text"
                  value={exp.location}
                  onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
                  placeholder="الرياض"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">تاريخ البداية</label>
                <input
                  type="month"
                  value={exp.startDate}
                  onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">تاريخ النهاية</label>
                <input
                  type="month"
                  value={exp.endDate}
                  onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                  disabled={exp.current}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={exp.current}
                onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                className="rounded border-gray-300"
              />
              <label className="text-sm text-gray-600 dark:text-gray-400">
                أعمل هنا حالياً
              </label>
            </div>

            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">المهام والمسؤوليات</label>
              {exp.description.map((desc, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={desc}
                    onChange={(e) => updateExperienceDescription(exp.id, idx, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
                    placeholder="وصف المهمة أو المسؤولية"
                  />
                  <button
                    onClick={() => removeExperienceDescription(exp.id, idx)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => addExperienceDescription(exp.id)}
                className="text-blue-600 text-sm flex items-center gap-1 mt-2"
              >
                <Plus size={16} />
                إضافة مهمة
              </button>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addExperience}
        className="w-full py-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 transition flex items-center justify-center gap-2"
      >
        <Plus size={20} />
        إضافة خبرة جديدة
      </button>
    </div>
  );
}