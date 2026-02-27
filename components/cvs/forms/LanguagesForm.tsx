'use client';

import { Plus, Trash2 } from 'lucide-react';
import { Language } from '../types';

interface LanguagesFormProps {
  languages: Language[];
  addLanguage: () => void;
  updateLanguage: (id: string, field: keyof Language, value: any) => void;
  removeLanguage: (id: string) => void;
}

export function LanguagesForm({ languages, addLanguage, updateLanguage, removeLanguage }: LanguagesFormProps) {
  return (
    <div className="space-y-6">
      {languages.map((lang) => (
        <div key={lang.id} className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
          <div className="flex-1">
            <input
              type="text"
              value={lang.name}
              onChange={(e) => updateLanguage(lang.id, 'name', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
              placeholder="اسم اللغة"
            />
          </div>

          <select
            value={lang.proficiency}
            onChange={(e) => updateLanguage(lang.id, 'proficiency', e.target.value)}
            className="w-40 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-900 dark:text-white"
          >
            <option value="مبتدئ">مبتدئ</option>
            <option value="متوسط">متوسط</option>
            <option value="متقدم">متقدم</option>
            <option value="خبير">خبير</option>
            <option value="لغة أم">لغة أم</option>
          </select>

          <button
            onClick={() => removeLanguage(lang.id)}
            className="text-red-500 hover:text-red-700 p-2"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))}

      <button
        onClick={addLanguage}
        className="w-full py-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 transition flex items-center justify-center gap-2"
      >
        <Plus size={20} />
        إضافة لغة جديدة
      </button>
    </div>
  );
}