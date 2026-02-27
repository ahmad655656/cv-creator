'use client';

import { Plus, Trash2 } from 'lucide-react';
import { Skill } from '../types';

interface SkillsFormProps {
  skills: Skill[];
  addSkill: () => void;
  updateSkill: (id: string, field: keyof Skill, value: any) => void;
  removeSkill: (id: string) => void;
}

export function SkillsForm({ skills, addSkill, updateSkill, removeSkill }: SkillsFormProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {skills.map((skill) => (
          <div key={skill.id} className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
            <div className="flex-1">
              <input
                type="text"
                value={skill.name}
                onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
                placeholder="اسم المهارة"
              />
            </div>
            
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  onClick={() => updateSkill(skill.id, 'level', level)}
                  className={`w-8 h-8 rounded-full transition ${
                    skill.level >= level 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>

            <select
              value={skill.category}
              onChange={(e) => updateSkill(skill.id, 'category', e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-900 dark:text-white"
            >
              <option value="technical">تقنية</option>
              <option value="soft">شخصية</option>
              <option value="language">لغوية</option>
            </select>

            <button
              onClick={() => removeSkill(skill.id)}
              className="text-red-500 hover:text-red-700 p-2"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addSkill}
        className="w-full py-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 transition flex items-center justify-center gap-2"
      >
        <Plus size={20} />
        إضافة مهارة جديدة
      </button>
    </div>
  );
}