'use client';

import { Skill } from '@/lib/types/template.types';
import { Plus, Trash2, Star } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface SkillsFormProps {
  skills: Skill[];
  onChange: (skills: Skill[]) => void;
}

export function SkillsForm({ skills, onChange }: SkillsFormProps) {
  const addSkill = () => {
    const newSkill: Skill = {
      id: uuidv4(),
      name: '',
      level: 3, // مستوى متوسط افتراضي
    };
    onChange([...skills, newSkill]);
  };

  const updateSkill = (id: string, field: keyof Skill, value: any) => {
    const updated = skills.map(skill =>
      skill.id === id ? { ...skill, [field]: value } : skill
    );
    onChange(updated);
  };

  const removeSkill = (id: string) => {
    onChange(skills.filter(skill => skill.id !== id));
  };

  // مجموعات المهارات المقترحة
  const suggestedSkills = [
    'إدارة المشاريع',
    'التواصل الفعال',
    'العمل الجماعي',
    'حل المشكلات',
    'القيادة',
    'التفكير التحليلي',
    'الإبداع',
    'إدارة الوقت',
    'Microsoft Office',
    'برمجة',
    'تسويق رقمي',
    'تحليل البيانات',
  ];

  const addSuggestedSkill = (skillName: string) => {
    // التحقق من عدم وجود المهارة مسبقاً
    if (!skills.some(s => s.name === skillName)) {
      const newSkill: Skill = {
        id: uuidv4(),
        name: skillName,
        level: 3,
      };
      onChange([...skills, newSkill]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Suggested Skills */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-medium text-gray-700 mb-3">مهارات مقترحة</h3>
        <div className="flex flex-wrap gap-2">
          {suggestedSkills.map((skill) => (
            <button
              key={skill}
              onClick={() => addSuggestedSkill(skill)}
              className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm hover:bg-blue-50 hover:border-blue-300 transition"
            >
              + {skill}
            </button>
          ))}
        </div>
      </div>

      {/* Skills List */}
      <div className="space-y-3">
        {skills.map((skill) => (
          <div key={skill.id} className="flex items-center gap-3 bg-white border rounded-lg p-3">
            <div className="flex-1">
              <input
                type="text"
                value={skill.name}
                onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="اسم المهارة"
              />
            </div>
            
            {/* Level Selector */}
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  onClick={() => updateSkill(skill.id, 'level', level)}
                  className={`p-1 transition ${
                    skill.level >= level ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  <Star size={20} fill={skill.level >= level ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>

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
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 transition flex items-center justify-center gap-2"
      >
        <Plus size={20} />
        إضافة مهارة جديدة
      </button>
    </div>
  );
}