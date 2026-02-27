'use client';

import { useState } from 'react';
import { 
  Palette, Type, Layout, Eye, EyeOff, Move, Settings,
  ChevronUp, ChevronDown, Plus, Trash2, Save
} from 'lucide-react';
import { TemplateConfig, COLOR_PALETTES, FONT_OPTIONS } from '@/lib/templates/template-types';

interface TemplateCustomizerProps {
  template: TemplateConfig;
  onUpdate: (config: TemplateConfig) => void;
}

export function TemplateCustomizer({ template, onUpdate }: TemplateCustomizerProps) {
  const [activeTab, setActiveTab] = useState<'colors' | 'fonts' | 'layout' | 'sections'>('colors');

  const updateColor = (key: keyof typeof template.colors, value: string) => {
    onUpdate({
      ...template,
      colors: { ...template.colors, [key]: value }
    });
  };

  const applyColorPalette = (paletteName: keyof typeof COLOR_PALETTES) => {
    const palette = COLOR_PALETTES[paletteName];
    onUpdate({
      ...template,
      colors: { ...template.colors, ...palette }
    });
  };

  const updateFont = (type: 'heading' | 'body', value: string) => {
    onUpdate({
      ...template,
      fonts: { ...template.fonts, [type]: value }
    });
  };

  const toggleSection = (sectionId: string) => {
    onUpdate({
      ...template,
      sections: template.sections.map(s => 
        s.id === sectionId ? { ...s, enabled: !s.enabled } : s
      )
    });
  };

  const moveSection = (sectionId: string, direction: 'up' | 'down') => {
    const index = template.sections.findIndex(s => s.id === sectionId);
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === template.sections.length - 1)
    ) return;

    const newSections = [...template.sections];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]];
    
    // Update order numbers
    onUpdate({
      ...template,
      sections: newSections.map((s, i) => ({ ...s, order: i + 1 }))
    });
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b dark:border-gray-800">
        <button
          onClick={() => setActiveTab('colors')}
          className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2
            ${activeTab === 'colors' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
        >
          <Palette size={16} />
          الألوان
        </button>
        <button
          onClick={() => setActiveTab('fonts')}
          className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2
            ${activeTab === 'fonts' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
        >
          <Type size={16} />
          الخطوط
        </button>
        <button
          onClick={() => setActiveTab('sections')}
          className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2
            ${activeTab === 'sections' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
        >
          <Layout size={16} />
          الأقسام
        </button>
      </div>

      <div className="p-4">
        {/* Colors Tab */}
        {activeTab === 'colors' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                باقات الألوان الجاهزة
              </label>
              <div className="grid grid-cols-4 gap-2">
                {Object.entries(COLOR_PALETTES).map(([name, colors]) => (
                  <button
                    key={name}
                    onClick={() => applyColorPalette(name as keyof typeof COLOR_PALETTES)}
                    className="h-10 rounded-lg border-2 border-transparent hover:border-blue-500 transition overflow-hidden"
                    title={name}
                  >
                    <div className="flex h-full">
                      <div className="flex-1" style={{ backgroundColor: colors.primary }} />
                      <div className="flex-1" style={{ backgroundColor: colors.secondary }} />
                      <div className="flex-1" style={{ backgroundColor: colors.accent }} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                  اللون الأساسي
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={template.colors.primary}
                    onChange={(e) => updateColor('primary', e.target.value)}
                    className="w-10 h-10 rounded border border-gray-300 dark:border-gray-700"
                  />
                  <input
                    type="text"
                    value={template.colors.primary}
                    onChange={(e) => updateColor('primary', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                  اللون الثانوي
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={template.colors.secondary}
                    onChange={(e) => updateColor('secondary', e.target.value)}
                    className="w-10 h-10 rounded border border-gray-300 dark:border-gray-700"
                  />
                  <input
                    type="text"
                    value={template.colors.secondary}
                    onChange={(e) => updateColor('secondary', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                  لون التمييز
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={template.colors.accent}
                    onChange={(e) => updateColor('accent', e.target.value)}
                    className="w-10 h-10 rounded border border-gray-300 dark:border-gray-700"
                  />
                  <input
                    type="text"
                    value={template.colors.accent}
                    onChange={(e) => updateColor('accent', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Fonts Tab */}
        {activeTab === 'fonts' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                خط العناوين
              </label>
              <select
                value={template.fonts.heading}
                onChange={(e) => updateFont('heading', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white"
              >
                {FONT_OPTIONS.heading.map(font => (
                  <option key={font} value={font} style={{ fontFamily: font }}>
                    {font}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-sm" style={{ fontFamily: template.fonts.heading }}>
                معاينة: عنوان تجريبي
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                خط النص
              </label>
              <select
                value={template.fonts.body}
                onChange={(e) => updateFont('body', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white"
              >
                {FONT_OPTIONS.body.map(font => (
                  <option key={font} value={font} style={{ fontFamily: font }}>
                    {font}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-sm" style={{ fontFamily: template.fonts.body }}>
                هذا نص تجريبي لمعاينة الخط المستخدم في المحتوى
              </p>
            </div>
          </div>
        )}

        {/* Sections Tab */}
        {activeTab === 'sections' && (
          <div className="space-y-3">
            {template.sections.map((section, index) => (
              <div
                key={section.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Move size={16} className="text-gray-400 cursor-move" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {section.name}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => moveSection(section.id, 'up')}
                    disabled={index === 0}
                    className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-30"
                  >
                    <ChevronUp size={16} />
                  </button>
                  <button
                    onClick={() => moveSection(section.id, 'down')}
                    disabled={index === template.sections.length - 1}
                    className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-30"
                  >
                    <ChevronDown size={16} />
                  </button>
                  <button
                    onClick={() => toggleSection(section.id)}
                    className={`p-1 rounded ${
                      section.enabled 
                        ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20' 
                        : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {section.enabled ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>
              </div>
            ))}

            <button className="w-full mt-4 px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 transition flex items-center justify-center gap-2">
              <Plus size={16} />
              إضافة قسم مخصص
            </button>
          </div>
        )}
      </div>

      <div className="p-4 border-t dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
          <Save size={16} />
          تطبيق التغييرات
        </button>
      </div>
    </div>
  );
}