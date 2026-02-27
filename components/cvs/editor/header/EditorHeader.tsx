'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, Download, Printer, Eye, EyeOff, Palette, 
  Layout, Sparkles, Sun, Moon, RotateCcw, RefreshCw,
  FileText, Image, Share2, ChevronRight, CheckCircle2,
  Settings2, HelpCircle
} from 'lucide-react';

interface EditorHeaderProps {
  sections: any[];
  activeSection: string;
  saveStatus: string;
  lastSaved: Date | null;
  saving: boolean;
  themeMode: string;
  showPreview: boolean;
  showCustomizer: boolean;
  showTips: boolean;
  showSectionEditor: boolean;
  onToggleTheme: () => void;
  onTogglePreview: () => void;
  onToggleCustomizer: () => void;
  onToggleTips: () => void;
  onToggleSectionEditor: () => void;
  onSave: () => void;
  onDownloadPDF: () => void;
  onDownloadDOCX: () => void;
  onDownloadPNG: () => void;
  onPrint: () => void;
  onShare: () => void;
  editorMode: string;
  onToggleEditorMode: () => void;
  isExporting: boolean;
}

export const EditorHeader = ({
  sections, activeSection, saveStatus, lastSaved, saving,
  themeMode, showPreview, showCustomizer, showTips, showSectionEditor,
  onToggleTheme, onTogglePreview, onToggleCustomizer, onToggleTips,
  onToggleSectionEditor, onSave, onDownloadPDF, onShare,
  editorMode, onToggleEditorMode, isExporting
}: EditorHeaderProps) => {

  const activeSectionLabel = sections.find(s => s.id === activeSection)?.label || 'تعديل المحتوى';

  return (
    <div className="relative z-30 mb-8 space-y-4">
      {/* 1. Top Navigation & Status Bar */}
      <div className="flex items-center justify-between">
        <nav className="flex items-center gap-2 text-[13px]">
          <span className="text-gray-400 dark:text-gray-500 hover:text-blue-500 cursor-pointer transition">السير الذاتية</span>
          <ChevronRight size={14} className="text-gray-300 dark:text-gray-600 rotate-180" />
          <span className="text-gray-900 dark:text-white font-bold tracking-tight">محرر السيرة الذاتية</span>
          
          <AnimatePresence mode="wait">
            {lastSaved && !saving && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }}
                className="mr-4 px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-500/10 border border-green-100 dark:border-green-500/20 flex items-center gap-1.5"
              >
                <CheckCircle2 size={12} className="text-green-600 dark:text-green-400" />
                <span className="text-[10px] font-bold text-green-700 dark:text-green-400 uppercase tracking-wider">
                  تم الحفظ {lastSaved.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        <div className="flex items-center gap-2">
          {/* Quick Actions Theme & Support */}
          <button onClick={onToggleTips} className={`p-2 rounded-xl transition-all ${showTips ? 'bg-orange-500 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`} title="نصائح الذكاء الاصطناعي">
            <Sparkles size={18} />
          </button>
          <button onClick={onToggleTheme} className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors">
            {themeMode === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>

      {/* 2. Main Control Header */}
      <div className="flex flex-wrap items-end justify-between gap-6 bg-white/50 dark:bg-white/[0.02] p-1 rounded-3xl backdrop-blur-sm">
        <div className="pr-4 pb-2">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            {activeSectionLabel}
            <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">قم بتخصيص بياناتك لإنشاء سيرة ذاتية مثالية</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 p-2 bg-white dark:bg-[#18181b] rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-white/5">
          
          {/* View Mode Group */}
          <div className="flex items-center gap-1 bg-gray-50 dark:bg-white/5 p-1 rounded-xl">
            <HeaderButton 
              active={showPreview} 
              onClick={onTogglePreview} 
              icon={showPreview ? EyeOff : Eye} 
              label="المعاينة"
            />
            <HeaderButton 
              active={showCustomizer} 
              onClick={onToggleCustomizer} 
              icon={Palette} 
              label="الألوان"
            />
            <HeaderButton 
              active={showSectionEditor} 
              onClick={onToggleSectionEditor} 
              icon={Layout} 
              label="الأقسام"
            />
          </div>

          <div className="h-8 w-px bg-gray-200 dark:bg-white/10 mx-1" />

          {/* Core Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleEditorMode}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg:white/5 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-all font-bold text-xs"
            >
              <RotateCcw size={16} className="text-blue-500" />
              {editorMode === 'forms' ? 'الوضع المتقدم' : 'الوضع المبسط'}
            </button>

            <button
              onClick={onSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/25 font-bold text-xs"
            >
              {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
              حفظ المسودة
            </button>

            <div className="relative group">
              <button
                onClick={onDownloadPDF}
                disabled={isExporting}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 dark:bg-white dark:text-black text-white rounded-xl hover:scale-105 transition-all font-black text-xs"
              >
                {isExporting ? <RefreshCw size={16} className="animate-spin" /> : <Download size={16} />}
                تحميل PDF
              </button>
            </div>

            <button
              onClick={onShare}
              className="p-2.5 text-purple-600 bg-purple-50 dark:bg-purple-500/10 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-500/20 transition-all"
              title="مشاركة"
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-component for cleaner code
const HeaderButton = ({ active, onClick, icon: Icon, label }: any) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-300
      ${active 
        ? 'bg-white dark:bg-white/10 text-blue-600 dark:text-blue-400 shadow-sm ring-1 ring-gray-200 dark:ring-white/10' 
        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
      }
    `}
  >
    <Icon size={16} />
    <span className="text-xs font-bold">{label}</span>
  </button>
);
