'use client';

import { useState } from 'react';
import { Palette, Move, Eye, EyeOff, Settings } from 'lucide-react';
import { ColorPicker } from './ColorPicker';
import { FontSelector } from './FontSelector';
import { SectionsManager } from './SectionsManager';
import { TemplateConfig } from '../types';
import { COLOR_PALETTES } from '../constants';

interface TemplateCustomizerProps {
  templateConfig: TemplateConfig;
  setTemplateConfig: (config: TemplateConfig) => void;
}

export function TemplateCustomizer({ templateConfig, setTemplateConfig }: TemplateCustomizerProps) {
  const [activeTab, setActiveTab] = useState<'colors' | 'fonts' | 'sections'>('colors');

  const updateTemplateColor = (key: keyof typeof templateConfig.colors, value: string) => {
    setTemplateConfig({
      ...templateConfig,
      colors: { ...templateConfig.colors, [key]: value }
    });
  };

  const applyColorPalette = (paletteName: keyof typeof COLOR_PALETTES) => {
    const palette = COLOR_PALETTES[paletteName];
    setTemplateConfig({
      ...templateConfig,
      colors: { ...templateConfig.colors, ...palette }
    });
  };

  const updateFont = (type: 'heading' | 'body', value: string) => {
    setTemplateConfig({
      ...templateConfig,
      fonts: { ...templateConfig.fonts, [type]: value }
    });
  };

  const toggleSection = (sectionId: string) => {
    setTemplateConfig({
      ...templateConfig,
      sections: templateConfig.sections.map(s => 
        s.id === sectionId ? { ...s, enabled: !s.enabled } : s
      )
    });
  };

  const moveSection = (sectionId: string, direction: 'up' | 'down') => {
    const index = templateConfig.sections.findIndex(s => s.id === sectionId);
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === templateConfig.sections.length - 1)
    ) return;

    const newSections = [...templateConfig.sections];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]];
    
    setTemplateConfig({
      ...templateConfig,
      sections: newSections.map((s, i) => ({ ...s, order: i + 1 }))
    });
  };

  return (
    <div className="w-80 bg-white dark:bg-gray-900 border-l dark:border-gray-800 shadow-xl flex flex-col flex-shrink-0 overflow-y-auto">
      <div className="p-4 border-b dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10">
        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Settings size={18} />
          تخصيص القالب
        </h3>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b dark:border-gray-800">
        <button
          onClick={() => setActiveTab('colors')}
          className={`flex-1 px-4 py-2 text-sm font-medium transition ${
            activeTab === 'colors' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          الألوان
        </button>
        <button
          onClick={() => setActiveTab('fonts')}
          className={`flex-1 px-4 py-2 text-sm font-medium transition ${
            activeTab === 'fonts' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          الخطوط
        </button>
        <button
          onClick={() => setActiveTab('sections')}
          className={`flex-1 px-4 py-2 text-sm font-medium transition ${
            activeTab === 'sections' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          الأقسام
        </button>
      </div>

      <div className="p-4 space-y-6">
        {activeTab === 'colors' && (
          <ColorPicker
            colors={templateConfig.colors}
            onColorChange={updateTemplateColor}
            onApplyPalette={applyColorPalette}
          />
        )}

        {activeTab === 'fonts' && (
          <FontSelector
            fonts={templateConfig.fonts}
            onFontChange={updateFont}
          />
        )}

        {activeTab === 'sections' && (
          <SectionsManager
            sections={templateConfig.sections}
            onToggleSection={toggleSection}
            onMoveSection={moveSection}
          />
        )}
      </div>
    </div>
  );
}