'use client';

import { Experience } from '@/lib/types/template.types';
import { Plus, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface ExperienceFormProps {
  experiences: Experience[];
  onChange: (experiences: Experience[]) => void;
}

export function ExperienceForm({ experiences, onChange }: ExperienceFormProps) {
  const addExperience = () => {
    const newExperience: Experience = {
      id: uuidv4(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: [''],
    };
    onChange([...experiences, newExperience]);
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    const updated = experiences.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    onChange(updated);
  };

  const updateDescription = (expId: string, index: number, value: string) => {
    const updated = experiences.map(exp => {
      if (exp.id === expId) {
        const newDesc = [...exp.description];
        newDesc[index] = value;
        return { ...exp, description: newDesc };
      }
      return exp;
    });
    onChange(updated);
  };

  const addDescription = (expId: string) => {
    const updated = experiences.map(exp => {
      if (exp.id === expId) {
        return { ...exp, description: [...exp.description, ''] };
      }
      return exp;
    });
    onChange(updated);
  };

  const removeDescription = (expId: string, index: number) => {
    const updated = experiences.map(exp => {
      if (exp.id === expId) {
        const newDesc = exp.description.filter((_, i) => i !== index);
        return { ...exp, description: newDesc };
      }
      return exp;
    });
    onChange(updated);
  };

  const removeExperience = (id: string) => {
    onChange(experiences.filter(exp => exp.id !== id));
  };

  return (
    <div className="space-y-6">
      {experiences.map((exp) => (
        <div key={exp.id} className="border rounded-lg p-4 space-y-4">
          <div className="flex justify-between items-start">
            <h3 className="font-medium">خبرة</h3>
            <button
              onClick={() => removeExperience(exp.id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 size={18} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">الشركة</label>
              <input
                type="text"
                value={exp.company}
                onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="اسم الشركة"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">المسمى الوظيفي</label>
              <input
                type="text"
                value={exp.position}
                onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="المسمى الوظيفي"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">الموقع</label>
              <input
                type="text"
                value={exp.location}
                onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="الموقع"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">تاريخ البداية</label>
              <input
                type="month"
                value={exp.startDate}
                onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">تاريخ النهاية</label>
              <input
                type="month"
                value={exp.endDate}
                onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                disabled={exp.current}
                className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={exp.current}
              onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
              id={`current-${exp.id}`}
              className="rounded border-gray-300"
            />
            <label htmlFor={`current-${exp.id}`} className="text-sm text-gray-600">
              أعمل هنا حالياً
            </label>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">المهام والمسؤوليات</label>
            {exp.description.map((desc, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={desc}
                  onChange={(e) => updateDescription(exp.id, idx, e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg"
                  placeholder="وصف المهمة"
                />
                <button
                  onClick={() => removeDescription(exp.id, idx)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            <button
              onClick={() => addDescription(exp.id)}
              className="text-blue-600 text-sm flex items-center gap-1 mt-2"
            >
              <Plus size={16} />
              إضافة مهمة
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={addExperience}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 transition flex items-center justify-center gap-2"
      >
        <Plus size={20} />
        إضافة خبرة جديدة
      </button>
    </div>
  );
}