'use client';

import { 
  Save, 
  Eye, 
  Download, 
  Moon, 
  Sun, 
  Palette, 
  Sparkles, 
  CheckCircle2, 
  Printer, 
  Layout 
} from 'lucide-react';

import { SaveStatus } from '../types';
import { SECTIONS } from '../constants';

interface EditorHeaderProps {
  sections: typeof SECTIONS;
  activeSection: string;
  saveStatus: SaveStatus;
  lastSaved: Date | null;
  saving: boolean;
  darkMode: boolean;
  showPreview: boolean;
  showCustomizer: boolean;
  showTips: boolean;
  showSectionEditor?: boolean;

  onToggleDarkMode: () => void;
  onTogglePreview: () => void;
  onToggleCustomizer: () => void;
  onToggleTips: () => void;
  onToggleSectionEditor?: () => void;

  onSave: () => void;

  onDownloadPDF: () => void;     // ⬅️ اجعلها مطلوبة
  onDownloadDOCX?: () => void;
  onPrint?: () => void;
}

export function EditorHeader({
  sections,
  activeSection,
  saveStatus,
  lastSaved,
  saving,
  darkMode,
  showPreview,
  showCustomizer,
  showTips,
  showSectionEditor,
  onToggleDarkMode,
  onTogglePreview,
  onToggleCustomizer,
  onToggleTips,
  onToggleSectionEditor,
  onSave,
  onDownloadPDF,
  onDownloadDOCX,
  onPrint
}: EditorHeaderProps) {

  const currentSection = sections.find(s => s.id === activeSection);

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        
        {/* Title */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {currentSection?.name}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {currentSection?.description}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">

          {/* Save Status */}
          <div className="flex items-center gap-2">
            {saveStatus === 'saving' && (
              <span className="text-sm text-yellow-600 dark:text-yellow-400">
                جاري الحفظ...
              </span>
            )}

            {saveStatus === 'saved' && (
              <span className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                <CheckCircle2 size={14} />
                تم الحفظ
              </span>
            )}

            {lastSaved && saveStatus === 'idle' && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {lastSaved.toLocaleTimeString('ar-EG')}
              </span>
            )}
          </div>

          {/* Section Editor */}
          <button
            onClick={onToggleSectionEditor}
            className={`p-2 rounded-lg transition ${
              showSectionEditor 
                ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
            }`}
            title="تخصيص الأقسام"
          >
            <Layout size={18} />
          </button>

          {/* Template Customizer */}
          <button
            onClick={onToggleCustomizer}
            className={`p-2 rounded-lg transition ${
              showCustomizer 
                ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
            }`}
            title="تخصيص القالب"
          >
            <Palette size={18} />
          </button>

          {/* 🔥 تحميل PDF (تحميل فقط بدون طباعة) */}
          <button
            onClick={onDownloadPDF}
            className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-1 text-sm"
            title="تحميل PDF"
          >
            <Download size={14} />
            PDF
          </button>

          {/* تحميل DOCX */}
          <button
            onClick={() => {
              if (onDownloadDOCX) {
                onDownloadDOCX();
              } else {
                alert('لم يتم تفعيل تحميل Word بعد');
              }
            }}
            className="px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-1 text-sm"
            title="تحميل Word"
          >
            <Download size={14} />
            DOCX
          </button>

          {/* طباعة مستقلة */}
          <button
            onClick={() => {
              if (onPrint) {
                onPrint();
              } else {
                window.print();
              }
            }}
            className="px-3 py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition flex items-center gap-1 text-sm"
            title="طباعة"
          >
            <Printer size={14} />
            طباعة
          </button>

          {/* Dark Mode */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition text-gray-600 dark:text-gray-400"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Preview */}
          <button
            onClick={onTogglePreview}
            className="px-3 py-1.5 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition flex items-center gap-1 text-sm"
          >
            <Eye size={14} />
            {showPreview ? 'إخفاء' : 'عرض'}
          </button>

          {/* Save */}
          <button
            onClick={onSave}
            disabled={saving}
            className="px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-1 text-sm disabled:opacity-50"
          >
            <Save size={14} />
            {saving ? '...' : 'حفظ'}
          </button>

        </div>
      </div>

      {/* Tips */}
      {showTips && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <Sparkles className="text-blue-600 dark:text-blue-400 mt-0.5" size={18} />
            <div className="flex-1">
              <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-1">
                نصائح سريعة
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                أضف معلومات دقيقة ومحدثة. استخدم كلمات مفتاحية تتناسب مع المجال الوظيفي المستهدف.
              </p>
            </div>
            <button 
              onClick={onToggleTips}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}