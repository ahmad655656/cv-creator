'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Palette, Type, Maximize, SlidersHorizontal, Lock } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { TemplateConfig } from '../types/templateConfig';

interface TemplateCustomizerProps {
  templateConfig: TemplateConfig;
  setTemplateConfig: (config: TemplateConfig) => void;
  defaultConfig: TemplateConfig;
}

type Tab = 'colors' | 'typography' | 'layout' | 'effects';

const FONT_OPTIONS = ['Cairo', 'Tajawal', 'Almarai', 'Changa', 'Readex Pro', 'IBM Plex Sans Arabic'];

function NumberControl({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  disabled = false
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}) {
  return (
    <label className="block space-y-2">
      <div className="flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
        <span>{label}</span>
        <span className="text-xs text-gray-500">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </label>
  );
}

function ColorControl({
  label,
  value,
  onChange,
  disabled = false
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const safeValue = typeof value === 'string' && /^#[0-9A-Fa-f]{6}$/.test(value) ? value : '#3B82F6';

  return (
    <label className="flex items-center justify-between gap-3 p-2.5 rounded-xl border border-gray-200 dark:border-gray-700">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">{safeValue.toUpperCase()}</span>
        <input
          type="color"
          value={safeValue}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-10 p-0 border-0 bg-transparent cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
    </label>
  );
}

export const TemplateCustomizer = ({
  templateConfig,
  setTemplateConfig,
  defaultConfig
}: TemplateCustomizerProps) => {
  const [activeTab, setActiveTab] = useState<Tab>('colors');
  const locked = templateConfig.presetLocked;

  const update = <K extends keyof TemplateConfig>(key: K, value: TemplateConfig[K]) => {
    if (locked) return;
    setTemplateConfig({ ...templateConfig, [key]: value });
  };

  const tabButton = (id: Tab, label: string, Icon: LucideIcon) => (
    <button
      key={id}
      onClick={() => setActiveTab(id)}
      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition ${
        activeTab === id
          ? 'bg-white dark:bg-gray-900 text-blue-600 shadow-sm'
          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
      }`}
    >
      <Icon size={16} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="space-y-5">
      <div className="rounded-2xl p-1 bg-gray-100 dark:bg-gray-800 flex gap-1">
        {tabButton('colors', 'ألوان', Palette)}
        {tabButton('typography', 'خطوط', Type)}
        {tabButton('layout', 'قياسات', Maximize)}
        {tabButton('effects', 'تأثيرات', SlidersHorizontal)}
      </div>

      {locked && (
        <div className="rounded-xl p-3 border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 flex items-start gap-2">
          <Lock size={16} className="mt-0.5 text-amber-700 dark:text-amber-300" />
          <p className="text-xs text-amber-800 dark:text-amber-300">
            هذا قالب مدفوع بهوية تصميم مقفلة. يمكنك تعديل محتوى السيرة فقط، وليس ألوان/هوية القالب.
          </p>
        </div>
      )}

      <motion.div key={activeTab} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
        {activeTab === 'colors' && (
          <div className="space-y-3">
            <ColorControl label="اللون الأساسي" value={templateConfig.primaryColor} onChange={(v) => update('primaryColor', v)} disabled={locked} />
            <ColorControl label="اللون الثانوي" value={templateConfig.secondaryColor} onChange={(v) => update('secondaryColor', v)} disabled={locked} />
            <ColorControl label="لون العناوين" value={templateConfig.headingColor} onChange={(v) => update('headingColor', v)} disabled={locked} />
            <ColorControl label="لون النص" value={templateConfig.textColor} onChange={(v) => update('textColor', v)} disabled={locked} />
            <ColorControl label="لون النص الثانوي" value={templateConfig.mutedTextColor} onChange={(v) => update('mutedTextColor', v)} disabled={locked} />
            <ColorControl label="لون نص الهيدر" value={templateConfig.headerTextColor} onChange={(v) => update('headerTextColor', v)} disabled={locked} />
            <ColorControl label="لون الورقة" value={templateConfig.pageColor} onChange={(v) => update('pageColor', v)} disabled={locked} />
          </div>
        )}

        {activeTab === 'typography' && (
          <div className="space-y-4">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">خط المحتوى</span>
              <select
                value={templateConfig.fontFamily}
                disabled={locked}
                onChange={(e) => update('fontFamily', e.target.value)}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 disabled:opacity-60"
              >
                {FONT_OPTIONS.map((font) => (
                  <option key={font} value={font}>
                    {font}
                  </option>
                ))}
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">خط العناوين</span>
              <select
                value={templateConfig.headingFontFamily}
                disabled={locked}
                onChange={(e) => update('headingFontFamily', e.target.value)}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 disabled:opacity-60"
              >
                {FONT_OPTIONS.map((font) => (
                  <option key={font} value={font}>
                    {font}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid grid-cols-2 gap-3">
              <NumberControl label="حجم الاسم" value={templateConfig.nameSize} min={28} max={56} onChange={(v) => update('nameSize', v)} disabled={locked} />
              <NumberControl label="حجم المسمى" value={templateConfig.titleSize} min={14} max={30} onChange={(v) => update('titleSize', v)} disabled={locked} />
              <NumberControl label="عنوان القسم" value={templateConfig.sectionTitleSize} min={14} max={32} onChange={(v) => update('sectionTitleSize', v)} disabled={locked} />
              <NumberControl label="النص العادي" value={templateConfig.bodySize} min={10} max={22} onChange={(v) => update('bodySize', v)} disabled={locked} />
            </div>
            <NumberControl label="تباعد السطور" value={templateConfig.lineHeight} min={1} max={2.2} step={0.1} onChange={(v) => update('lineHeight', v)} disabled={locked} />
          </div>
        )}

        {activeTab === 'layout' && (
          <div className="space-y-4">
            <NumberControl label="عرض الورقة" value={templateConfig.pageWidth} min={620} max={980} onChange={(v) => update('pageWidth', v)} disabled={locked} />
            <NumberControl label="حشوة الصفحة" value={templateConfig.pagePadding} min={12} max={60} onChange={(v) => update('pagePadding', v)} disabled={locked} />
            <NumberControl label="تباعد الأقسام" value={templateConfig.sectionSpacing} min={8} max={48} onChange={(v) => update('sectionSpacing', v)} disabled={locked} />
            <NumberControl label="تباعد العناصر" value={templateConfig.blockSpacing} min={4} max={28} onChange={(v) => update('blockSpacing', v)} disabled={locked} />
          </div>
        )}

        {activeTab === 'effects' && (
          <div className="space-y-4">
            <NumberControl label="سماكة الحدود" value={templateConfig.borderWidth} min={0} max={4} onChange={(v) => update('borderWidth', v)} disabled={locked} />
            <NumberControl label="نصف قطر الزوايا" value={templateConfig.radiusSize} min={0} max={28} onChange={(v) => update('radiusSize', v)} disabled={locked} />
          </div>
        )}
      </motion.div>

      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setTemplateConfig(defaultConfig)}
          disabled={locked}
          className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          إعادة إعدادات التصميم الافتراضية
        </button>
      </div>
    </div>
  );
};
