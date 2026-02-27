'use client';

import { Palette } from 'lucide-react';
import { COLOR_PALETTES } from '../constants';

interface ColorPickerProps {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  onColorChange: (key: 'primary' | 'secondary' | 'accent', value: string) => void;
  onApplyPalette: (paletteName: keyof typeof COLOR_PALETTES) => void;
}

export function ColorPicker({ colors, onColorChange, onApplyPalette }: ColorPickerProps) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <Palette size={16} />
          باقات الألوان
        </h4>
        
        <div className="grid grid-cols-4 gap-2 mb-4">
          {Object.entries(COLOR_PALETTES).map(([name, palette]) => (
            <button
              key={name}
              onClick={() => onApplyPalette(name as keyof typeof COLOR_PALETTES)}
              className="h-8 rounded-lg border-2 border-transparent hover:border-blue-500 transition overflow-hidden"
              title={name}
            >
              <div className="flex h-full">
                <div className="flex-1" style={{ backgroundColor: palette.primary }} />
                <div className="flex-1" style={{ backgroundColor: palette.secondary }} />
                <div className="flex-1" style={{ backgroundColor: palette.accent }} />
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">اللون الأساسي</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={colors.primary}
              onChange={(e) => onColorChange('primary', e.target.value)}
              className="w-8 h-8 rounded border border-gray-300 dark:border-gray-700"
            />
            <input
              type="text"
              value={colors.primary}
              onChange={(e) => onColorChange('primary', e.target.value)}
              className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">اللون الثانوي</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={colors.secondary}
              onChange={(e) => onColorChange('secondary', e.target.value)}
              className="w-8 h-8 rounded border border-gray-300 dark:border-gray-700"
            />
            <input
              type="text"
              value={colors.secondary}
              onChange={(e) => onColorChange('secondary', e.target.value)}
              className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">لون التمييز</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={colors.accent}
              onChange={(e) => onColorChange('accent', e.target.value)}
              className="w-8 h-8 rounded border border-gray-300 dark:border-gray-700"
            />
            <input
              type="text"
              value={colors.accent}
              onChange={(e) => onColorChange('accent', e.target.value)}
              className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}