'use client';

import { useState } from 'react';
import { X, Type, Palette, AlignLeft, Square, Grid, Save } from 'lucide-react';

interface SectionEditorModalProps {
  section: any;
  onClose: () => void;
  onSave: (updatedSection: any) => void;
}

export function SectionEditorModal({ section, onClose, onSave }: SectionEditorModalProps) {
  const [title, setTitle] = useState(section.title);
  const [icon, setIcon] = useState(section.icon || '');
  const [layout, setLayout] = useState(section.layout || 'default');
  const [style, setStyle] = useState(section.style || {
    backgroundColor: '#ffffff',
    textColor: '#000000',
    headingColor: '#2563eb',
    borderColor: '#e5e7eb',
    borderRadius: '8',
    padding: '16',
  });

  const layouts = [
    { id: 'default', name: 'عادي', icon: '📄' },
    { id: 'cards', name: 'بطاقات', icon: '🃏' },
    { id: 'timeline', name: 'خط زمني', icon: '⏳' },
    { id: 'grid', name: 'شبكة', icon: '🔲' },
    { id: 'minimal', name: 'بسيط', icon: '⚪' },
  ];

  const handleSave = () => {
    onSave({
      ...section,
      title,
      icon,
      layout,
      style,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b dark:border-gray-800 p-4 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            تخصيص القسم
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* العنوان والأيقونة */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                عنوان القسم
              </label>
              <div className="relative">
                <Type className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full pr-10 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                أيقونة القسم
              </label>
              <input
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder="👤 أو 💼"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          {/* تخطيط القسم */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              تخطيط القسم
            </label>
            <div className="grid grid-cols-5 gap-2">
              {layouts.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setLayout(l.id)}
                  className={`p-3 rounded-xl border-2 transition ${
                    layout === l.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{l.icon}</div>
                  <div className="text-xs">{l.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* ألوان القسم */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Palette size={16} />
              ألوان القسم
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                  لون الخلفية
                </label>
                <input
                  type="color"
                  value={style.backgroundColor}
                  onChange={(e) => setStyle({...style, backgroundColor: e.target.value})}
                  className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-700"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                  لون النص
                </label>
                <input
                  type="color"
                  value={style.textColor}
                  onChange={(e) => setStyle({...style, textColor: e.target.value})}
                  className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-700"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                  لون العناوين
                </label>
                <input
                  type="color"
                  value={style.headingColor}
                  onChange={(e) => setStyle({...style, headingColor: e.target.value})}
                  className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-700"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                  لون الحدود
                </label>
                <input
                  type="color"
                  value={style.borderColor}
                  onChange={(e) => setStyle({...style, borderColor: e.target.value})}
                  className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-700"
                />
              </div>
            </div>
          </div>

          {/* المسافات */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                انحناء الحدود (px)
              </label>
              <input
                type="range"
                min="0"
                max="32"
                value={style.borderRadius}
                onChange={(e) => setStyle({...style, borderRadius: e.target.value})}
                className="w-full"
              />
              <div className="text-center text-sm mt-1">{style.borderRadius}px</div>
            </div>

            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                الحشوة الداخلية (px)
              </label>
              <input
                type="range"
                min="8"
                max="32"
                value={style.padding}
                onChange={(e) => setStyle({...style, padding: e.target.value})}
                className="w-full"
              />
              <div className="text-center text-sm mt-1">{style.padding}px</div>
            </div>
          </div>

          {/* معاينة حية */}
          <div className="border-t dark:border-gray-800 pt-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">معاينة حية</h4>
            <div
              className="rounded-xl p-4"
              style={{
                backgroundColor: style.backgroundColor,
                color: style.textColor,
                borderRadius: `${style.borderRadius}px`,
              }}
            >
              <h3
                style={{
                  color: style.headingColor,
                  borderBottomColor: style.borderColor,
                  borderBottomWidth: '2px',
                  paddingBottom: '8px',
                  marginBottom: '12px',
                }}
              >
                {icon} {title}
              </h3>
              <p className="text-sm opacity-75">محتوى تجريبي للقسم...</p>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t dark:border-gray-800 p-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition font-medium"
          >
            إلغاء
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2"
          >
            <Save size={18} />
            حفظ التغييرات
          </button>
        </div>
      </div>
    </div>
  );
}