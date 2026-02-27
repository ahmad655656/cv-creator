'use client';

import { Education } from '@/lib/types/template.types';
import { Plus, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface EducationFormProps {
  education: Education[];
  onChange: (education: Education[]) => void;
}

export function EducationForm({ education, onChange }: EducationFormProps) {
  const addEducation = () => {
    const newEducation: Education = {
      id: uuidv4(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      grade: '',
    };
    onChange([...education, newEducation]);
  };

  const updateEducation = (id: string, field: keyof Education, value: any) => {
    const updated = education.map(edu =>
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    onChange(updated);
  };

  const removeEducation = (id: string) => {
    onChange(education.filter(edu => edu.id !== id));
  };

  return (
    <div className="space-y-6">
      {education.map((edu) => (
        <div key={edu.id} className="border rounded-lg p-4 space-y-4">
          <div className="flex justify-between items-start">
            <h3 className="font-medium">مؤهل تعليمي</h3>
            <button
              onClick={() => removeEducation(edu.id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 size={18} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">المؤسسة التعليمية</label>
              <input
                type="text"
                value={edu.institution}
                onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="اسم الجامعة أو المعهد"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">الشهادة</label>
              <input
                type="text"
                value={edu.degree}
                onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="مثال: بكالوريوس"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">التخصص</label>
              <input
                type="text"
                value={edu.field}
                onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="مثال: علوم الحاسب"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">التقدير</label>
              <input
                type="text"
                value={edu.grade || ''}
                onChange={(e) => updateEducation(edu.id, 'grade', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="مثال: ممتاز"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">تاريخ البداية</label>
              <input
                type="month"
                value={edu.startDate}
                onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">تاريخ النهاية</label>
              <input
                type="month"
                value={edu.endDate}
                onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                disabled={edu.current}
                className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100"
              />
            </div>
            <div className="flex items-center gap-2 mt-7">
              <input
                type="checkbox"
                checked={edu.current}
                onChange={(e) => updateEducation(edu.id, 'current', e.target.checked)}
                id={`current-${edu.id}`}
                className="rounded border-gray-300"
              />
              <label htmlFor={`current-${edu.id}`} className="text-sm text-gray-600">
                أدرس هنا حالياً
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">وصف إضافي (اختياري)</label>
            <textarea
              value={edu.description || ''}
              onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="أضف أي معلومات إضافية عن دراستك..."
            />
          </div>
        </div>
      ))}

      <button
        onClick={addEducation}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 transition flex items-center justify-center gap-2"
      >
        <Plus size={20} />
        إضافة مؤهل تعليمي جديد
      </button>
    </div>
  );
}