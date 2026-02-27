'use client';

import { Language } from '@/lib/types/template.types';
import { Plus, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface LanguagesFormProps {
  languages: Language[];
  onChange: (languages: Language[]) => void;
}

export function LanguagesForm({ languages, onChange }: LanguagesFormProps) {
  const addLanguage = () => {
    const newLanguage: Language = {
      id: uuidv4(),
      name: '',
      proficiency: 'متوسط',
    };
    onChange([...languages, newLanguage]);
  };

  const updateLanguage = (id: string, field: keyof Language, value: any) => {
    const updated = languages.map(lang =>
      lang.id === id ? { ...lang, [field]: value } : lang
    );
    onChange(updated);
  };

  const removeLanguage = (id: string) => {
    onChange(languages.filter(lang => lang.id !== id));
  };

  const proficiencyLevels = [
    'مبتدئ',
    'متوسط',
    'متقدم',
    'خبير',
    'لغة أم',
  ];

  return (
    <div className="space-y-6">
      {languages.map((lang) => (
        <div key={lang.id} className="flex items-center gap-3 bg-white border rounded-lg p-3">
          <div className="flex-1">
            <input
              type="text"
              value={lang.name}
              onChange={(e) => updateLanguage(lang.id, 'name', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="اسم اللغة (مثال: العربية)"
            />
          </div>
          
          <div className="w-40">
            <select
              value={lang.proficiency}
              onChange={(e) => updateLanguage(lang.id, 'proficiency', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            >
              {proficiencyLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

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
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 transition flex items-center justify-center gap-2"
      >
        <Plus size={20} />
        إضافة لغة جديدة
      </button>
    </div>
  );
}