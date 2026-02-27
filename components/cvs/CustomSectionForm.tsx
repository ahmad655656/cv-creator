'use client';

import { useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';

interface CustomField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'date' | 'url' | 'list';
  required: boolean;
}

interface CustomSectionFormProps {
  onSave: (sectionData: any) => void;
  onCancel: () => void;
}

export function CustomSectionForm({ onSave, onCancel }: CustomSectionFormProps) {
  const [sectionName, setSectionName] = useState('');
  const [fields, setFields] = useState<CustomField[]>([
    { id: '1', label: '', type: 'text', required: false }
  ]);

  const addField = () => {
    setFields([
      ...fields,
      { id: Date.now().toString(), label: '', type: 'text', required: false }
    ]);
  };

  const updateField = (id: string, updates: Partial<CustomField>) => {
    setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const removeField = (id: string) => {
    if (fields.length > 1) {
      setFields(fields.filter(f => f.id !== id));
    }
  };

  const handleSubmit = () => {
    if (!sectionName.trim()) {
      alert('الرجاء إدخال اسم القسم');
      return;
    }

    const validFields = fields.filter(f => f.label.trim());
    if (validFields.length === 0) {
      alert('الرجاء إضافة حقل واحد على الأقل');
      return;
    }

    onSave({
      name: sectionName,
      fields: validFields
    });
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        إضافة قسم مخصص
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            اسم القسم المخصص
          </label>
          <input
            type="text"
            value={sectionName}
            onChange={(e) => setSectionName(e.target.value)}
            placeholder="مثال: الجوائز والتكريمات"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              حقول القسم
            </label>
            <button
              onClick={addField}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <Plus size={16} />
              إضافة حقل
            </button>
          </div>

          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl">
                <GripVertical size={18} className="text-gray-400 cursor-move" />
                
                <input
                  type="text"
                  value={field.label}
                  onChange={(e) => updateField(field.id, { label: e.target.value })}
                  placeholder="اسم الحقل (مثال: اسم الجائزة)"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white text-sm"
                />

                <select
                  value={field.type}
                  onChange={(e) => updateField(field.id, { type: e.target.value as any })}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white text-sm"
                >
                  <option value="text">نص</option>
                  <option value="textarea">نص طويل</option>
                  <option value="date">تاريخ</option>
                  <option value="url">رابط</option>
                  <option value="list">قائمة</option>
                </select>

                <label className="flex items-center gap-1 text-sm">
                  <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(e) => updateField(field.id, { required: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <span>إجباري</span>
                </label>

                {fields.length > 1 && (
                  <button
                    onClick={() => removeField(field.id)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition font-medium"
          >
            إلغاء
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-medium"
          >
            إضافة القسم
          </button>
        </div>
      </div>
    </div>
  );
}