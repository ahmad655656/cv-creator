// components/editor/CustomSectionForm.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Trash2, GripVertical } from 'lucide-react';

interface CustomSectionFormProps {
  onSave: (sectionData: any) => void;
  onCancel: () => void;
}

interface Field {
  id: string;
  type: 'text' | 'textarea' | 'date' | 'list';
  label: string;
  required: boolean;
}

export const CustomSectionForm = ({ onSave, onCancel }: CustomSectionFormProps) => {
  const [sectionName, setSectionName] = useState('');
  const [fields, setFields] = useState<Field[]>([
    { id: '1', type: 'text', label: 'حقل جديد', required: false }
  ]);

  const addField = () => {
    setFields(prev => [
      ...prev,
      { id: Date.now().toString(), type: 'text', label: 'حقل جديد', required: false }
    ]);
  };

  const removeField = (id: string) => {
    setFields(prev => prev.filter(f => f.id !== id));
  };

  const updateField = (id: string, updates: Partial<Field>) => {
    setFields(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectionName.trim()) return;
    
    onSave({
      name: sectionName,
      fields: fields.map(f => ({
        ...f,
        label: f.label || 'حقل بدون عنوان'
      }))
    });
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border dark:border-gray-800 overflow-hidden">
      <div className="p-6 border-b dark:border-gray-800 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">إضافة قسم مخصص</h2>
        <button onClick={onCancel} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            اسم القسم
          </label>
          <input
            type="text"
            value={sectionName}
            onChange={(e) => setSectionName(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="مثال: الجوائز والإنجازات"
            required
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              حقول القسم
            </label>
            <button
              type="button"
              onClick={addField}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-sm hover:bg-blue-200 dark:hover:bg-blue-900/50 transition"
            >
              <Plus size={16} />
              إضافة حقل
            </button>
          </div>

          <div className="space-y-3">
            {fields.map((field, index) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700"
              >
                <div className="cursor-move text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 mt-3">
                  <GripVertical size={18} />
                </div>
                
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) => updateField(field.id, { label: e.target.value })}
                      className="flex-1 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                      placeholder="عنوان الحقل"
                    />
                    
                    <select
                      value={field.type}
                      onChange={(e) => updateField(field.id, { type: e.target.value as any })}
                      className="px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                    >
                      <option value="text">نص قصير</option>
                      <option value="textarea">نص طويل</option>
                      <option value="date">تاريخ</option>
                      <option value="list">قائمة</option>
                    </select>

                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) => updateField(field.id, { required: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      إجباري
                    </label>

                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeField(field.id)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t dark:border-gray-800">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            إلغاء
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition"
          >
            إضافة القسم
          </button>
        </div>
      </form>
    </div>
  );
};