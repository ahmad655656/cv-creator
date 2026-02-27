'use client';

import { useState } from 'react';
import { 
  Grid, Layout, Columns, Rows, Maximize2, Minimize2,
  ChevronDown, ChevronUp, Settings
} from 'lucide-react';

interface LayoutControlsProps {
  onLayoutChange: (layout: any) => void;
  currentLayout: any;
}

export function LayoutControls({ onLayoutChange, currentLayout }: LayoutControlsProps) {
  const [expanded, setExpanded] = useState(true);

  const layouts = [
    { id: 'grid', name: 'شبكة', icon: Grid, columns: [1, 2, 3, 4] },
    { id: 'flex', name: 'مرن', icon: Layout, directions: ['row', 'column'] },
    { id: 'cards', name: 'بطاقات', icon: Columns },
    { id: 'timeline', name: 'خط زمني', icon: Rows },
    { id: 'magazine', name: 'مجلة', icon: Maximize2 },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between mb-2"
      >
        <h3 className="font-medium text-gray-900 dark:text-white">تخطيط الصفحة</h3>
        {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {expanded && (
        <div className="space-y-4">
          {/* أنواع التخطيطات */}
          <div className="grid grid-cols-5 gap-2">
            {layouts.map(layout => {
              const Icon = layout.icon;
              return (
                <button
                  key={layout.id}
                  onClick={() => onLayoutChange({ type: layout.id })}
                  className={`p-2 rounded-lg text-center transition ${
                    currentLayout?.type === layout.id
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon size={20} className="mx-auto mb-1" />
                  <span className="text-xs">{layout.name}</span>
                </button>
              );
            })}
          </div>

          {/* تحكمات إضافية حسب نوع التخطيط */}
          {currentLayout?.type === 'grid' && (
            <div>
              <label className="block text-sm text-gray-600 mb-2">عدد الأعمدة</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map(num => (
                  <button
                    key={num}
                    onClick={() => onLayoutChange({ ...currentLayout, columns: num })}
                    className={`flex-1 py-2 rounded-lg border transition ${
                      currentLayout.columns === num
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentLayout?.type === 'flex' && (
            <div>
              <label className="block text-sm text-gray-600 mb-2">الاتجاه</label>
              <div className="flex gap-2">
                <button
                  onClick={() => onLayoutChange({ ...currentLayout, direction: 'row' })}
                  className={`flex-1 py-2 rounded-lg border transition ${
                    currentLayout.direction === 'row'
                      ? 'bg-blue-600 text-white'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  أفقي
                </button>
                <button
                  onClick={() => onLayoutChange({ ...currentLayout, direction: 'column' })}
                  className={`flex-1 py-2 rounded-lg border transition ${
                    currentLayout.direction === 'column'
                      ? 'bg-blue-600 text-white'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  عمودي
                </button>
              </div>
            </div>
          )}

          {/* المسافات */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">المسافات</label>
            <input
              type="range"
              min="0"
              max="32"
              className="w-full"
              onChange={(e) => onLayoutChange({ ...currentLayout, gap: parseInt(e.target.value) })}
            />
          </div>
        </div>
      )}
    </div>
  );
}