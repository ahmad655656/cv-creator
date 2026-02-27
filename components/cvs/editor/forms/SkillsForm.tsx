// components/editor/forms/SkillsForm.tsx
'use client';

import { Plus, Trash2 } from 'lucide-react';
import { Skill } from '../types';

interface SkillsFormProps {
  skills: Skill[];
  addSkill: () => void;
  updateSkill: (id: string, field: string, value: any) => void;
  removeSkill: (id: string) => void;
}

export const SkillsForm = ({ skills, addSkill, updateSkill, removeSkill }: SkillsFormProps) => {
  const categories = ['تقنية', 'لغوية', 'شخصية', 'إدارية', 'فنية'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700"
          >
            <div className="flex-1 grid grid-cols-3 gap-3">
              <input
                type="text"
                value={skill.name || ''}
                onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg"
                placeholder="اسم المهارة"
              />

              <select
                value={skill.category || 'تقنية'}
                onChange={(e) => updateSkill(skill.id, 'category', e.target.value)}
                className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={skill.level || 3}
                  onChange={(e) => updateSkill(skill.id, 'level', parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm font-medium w-8 text-center">
                  {skill.level || 3}/5
                </span>
              </div>
            </div>

            <button
              onClick={() => removeSkill(skill.id)}
              className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 rounded-lg"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addSkill}
        className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-600 transition flex items-center justify-center gap-2"
      >
        <Plus size={20} />
        إضافة مهارة
      </button>
    </div>
  );
};