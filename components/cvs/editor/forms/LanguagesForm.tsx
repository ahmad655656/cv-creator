// components/editor/forms/LanguagesForm.tsx
'use client';

import { Plus, Trash2 } from 'lucide-react';
import { Language } from '../types';

interface LanguagesFormProps {
  languages: Language[];
  addLanguage: () => void;
  updateLanguage: (id: string, field: string, value: any) => void;
  removeLanguage: (id: string) => void;
}

export const LanguagesForm = ({ languages, addLanguage, updateLanguage, removeLanguage }: LanguagesFormProps) => {
  const proficiencyLevels = [
    { value: 'basic', label: 'أساسي' },
    { value: 'conversational', label: 'محادثة' },
    { value: 'fluent', label: 'طلاقة' },
    { value: 'native', label: 'لغة أم' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {languages.map((lang) => (
          <div
            key={lang.id}
            className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700"
          >
            <div className="flex-1 grid grid-cols-2 gap-3">
              <input
                type="text"
                value={lang.name || ''}
                onChange={(e) => updateLanguage(lang.id, 'name', e.target.value)}
                className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg"
                placeholder="اسم اللغة"
              />

              <select
                value={lang.proficiency || 'basic'}
                onChange={(e) => updateLanguage(lang.id, 'proficiency', e.target.value)}
                className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                {proficiencyLevels.map((level) => (
                  <option key={level.value} value={level.value}>{level.label}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => removeLanguage(lang.id)}
              className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 rounded-lg"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addLanguage}
        className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-600 transition flex items-center justify-center gap-2"
      >
        <Plus size={20} />
        إضافة لغة
      </button>
    </div>
  );
};