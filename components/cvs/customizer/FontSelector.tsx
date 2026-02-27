'use client';

import { FONT_OPTIONS } from '../constants';

interface FontSelectorProps {
  fonts: {
    heading: string;
    body: string;
  };
  onFontChange: (type: 'heading' | 'body', value: string) => void;
}

export function FontSelector({ fonts, onFontChange }: FontSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">خط العناوين</label>
        <select
          value={fonts.heading}
          onChange={(e) => onFontChange('heading', e.target.value)}
          className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded dark:bg-gray-800 dark:text-white"
        >
          {FONT_OPTIONS.heading.map(font => (
            <option key={font} value={font}>{font}</option>
          ))}
        </select>
        <p className="mt-1 text-xs" style={{ fontFamily: fonts.heading }}>
          نموذج عنوان
        </p>
      </div>

      <div>
        <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">خط النص</label>
        <select
          value={fonts.body}
          onChange={(e) => onFontChange('body', e.target.value)}
          className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded dark:bg-gray-800 dark:text-white"
        >
          {FONT_OPTIONS.body.map(font => (
            <option key={font} value={font}>{font}</option>
          ))}
        </select>
        <p className="mt-1 text-xs" style={{ fontFamily: fonts.body }}>
          هذا نص تجريبي لمعاينة الخط
        </p>
      </div>
    </div>
  );
}