// components/editor/SectionEditorModal.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface Section {
  id: string;
  title: string;
  enabled: boolean;
  icon?: string;
}

interface SectionEditorModalProps {
  section: Section;
  onClose: () => void;
  onSave: (updatedSection: Section) => void;
}

export const SectionEditorModal = ({ section, onClose, onSave }: SectionEditorModalProps) => {
  const [title, setTitle] = useState(section.title);
  const [icon, setIcon] = useState(section.icon || '📄');

  const icons = ['📄', '👤', '💼', '🎓', '⚡', '🌐', '📜', '🚀', '🏆', '🎨', '🔧', '📊'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...section,
      title,
      icon
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border dark:border-gray-800 w-full max-w-md overflow-hidden"
      >
        <div className="p-6 border-b dark:border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">تعديل القسم</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              عنوان القسم
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              الأيقونة
            </label>
            <div className="grid grid-cols-6 gap-2">
              {icons.map((icn) => (
                <button
                  key={icn}
                  type="button"
                  onClick={() => setIcon(icn)}
                  className={`p-3 text-2xl rounded-xl border-2 transition ${
                    icon === icn 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  {icn}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg"
            >
              حفظ التغييرات
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};