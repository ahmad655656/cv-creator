// components/editor/CVEditor.tsx
'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layout,
  Palette,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  Download,
  Printer,
  Save,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Bell,
  RefreshCw,
  Clock,
  X,
  FileText,
  Image,
  Share2
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// Components
import { EditorSidebar } from './sidebar/EditorSidebar';
import { TemplateCustomizer } from './customizer/TemplateCustomizer';
import { SectionDragDrop } from './SectionDragDrop';
import { SectionEditorModal } from './SectionEditorModal';
import { CustomSectionForm } from './CustomSectionForm';
import { InlineEditor } from './InlineEditor';
import { FormattingToolbar } from './FormattingToolbar';
import PreviewPanel from './panels/PreviewPanel';
import { NotificationsPanel } from './panels/NotificationsPanel';

// Forms
import { PersonalInfoForm } from '../CVForm/PersonalInfoForm';
import { ExperienceForm } from './forms/ExperienceForm';
import { EducationForm } from './forms/EducationForm';
import { SkillsForm } from './forms/SkillsForm';
import { LanguagesForm } from './forms/LanguagesForm';
import { CertificationsForm } from './forms/CertificationsForm';
import { ProjectsForm } from './forms/ProjectsForm';

// Hooks
import { useCVData } from '../hooks/useCVData';
import { useAutoSave } from '../hooks/useAutoSave';
import { useEditorUI } from '../hooks/useEditorUI';
import { useEditorNotifications } from '../hooks/useEditorNotifications';
import { useEditableElements } from '../hooks/useEditableElements';

// Constants & Types
import { SECTIONS } from './constants';
import { DEFAULT_SECTIONS } from './constants/editor.constants';
import { Template } from './types';
import { TemplateConfig } from './types/templateConfig';
import type { Template as LegacyTemplate } from '../types';
import type {
  CVData as EditorCVData,
  Experience as EditorExperience,
  Education as EditorEducation,
  Skill as EditorSkill,
  Language as EditorLanguage,
  Certification as EditorCertification,
  Project as EditorProject
} from './types';
import { getProfessionalTemplateBySlug, mapProfessionalToEditorConfig } from '@/lib/templates/professional-templates';

interface CVEditorProps {
  template: Template;
  userId: number;
}

const DEFAULT_TEMPLATE_CONFIG: TemplateConfig = {
  primaryColor: '#3B82F6',
  secondaryColor: '#6366F1',
  headingColor: '#0f172a',
  textColor: '#334155',
  mutedTextColor: '#64748b',
  headerTextColor: '#ffffff',
  pageColor: '#ffffff',
  background: 'light',
  fontFamily: 'Cairo',
  headingFontFamily: 'Cairo',
  fontSize: 'medium',
  lineHeight: 1.5,
  nameSize: 40,
  titleSize: 22,
  sectionTitleSize: 22,
  bodySize: 14,
  sectionSpacing: 24,
  blockSpacing: 14,
  pagePadding: 32,
  pageWidth: 860,
  margins: 'normal',
  showBorders: true,
  borderWidth: 1,
  showShadows: true,
  roundedCorners: true,
  radiusSize: 16,
  presetLocked: false
};

type SectionItem = {
  id: string;
  type: string;
  title: string;
  enabled: boolean;
  order: number;
  icon?: string;
  fields?: unknown[];
};

type EditableSelection = {
  id: string;
  type?: string;
  content?: string;
  style?: Record<string, string | number>;
};

function ActionButton({
  onClick,
  icon: Icon,
  label,
  active = false,
  variant = 'soft',
  disabled = false
}: {
  onClick: () => void;
  icon: LucideIcon;
  label: string;
  active?: boolean;
  variant?: 'soft' | 'primary' | 'dark';
  disabled?: boolean;
}) {
  const base =
    'inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed';
  const tone =
    variant === 'primary'
      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow'
      : variant === 'dark'
      ? 'bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-100'
      : active
      ? 'bg-blue-600 text-white shadow'
      : 'bg-white/85 dark:bg-gray-900/85 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800';

  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${tone}`}>
      <Icon size={16} />
      <span>{label}</span>
    </button>
  );
}

export function CVEditor({ template, userId }: CVEditorProps) {
  const [activeSection, setActiveSection] = useState('personal');
  const [showPreview, setShowPreview] = useState(true);
  const [isPreviewFullPage, setIsPreviewFullPage] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [showSectionEditor, setShowSectionEditor] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [editorMode, setEditorMode] = useState<'forms' | 'direct'>('direct');
  const [selectedElement, setSelectedElement] = useState<EditableSelection | null>(null);
  const [showFormatting, setShowFormatting] = useState(false);
  const [editingSection, setEditingSection] = useState<SectionItem | null>(null);
  const [showCustomSectionForm, setShowCustomSectionForm] = useState(false);
  const [sectionStyleOverrides, setSectionStyleOverrides] = useState<
    Record<string, Record<string, string | number>>
  >({});

  const [sections, setSections] = useState<SectionItem[]>(
    () => DEFAULT_SECTIONS.map((section) => ({ ...section }))
  );
  const resolvedTemplateDefaults = useMemo(() => {
    const paidTemplate = getProfessionalTemplateBySlug(template.slug);
    if (!paidTemplate) return DEFAULT_TEMPLATE_CONFIG;
    return {
      ...DEFAULT_TEMPLATE_CONFIG,
      ...mapProfessionalToEditorConfig(paidTemplate),
      // Purchased premium templates should be editable in the customizer.
      presetLocked: false
    };
  }, [template.slug]);

  const [templateConfig, setTemplateConfig] = useState<TemplateConfig>(resolvedTemplateDefaults);
  const safeTemplateConfig = useMemo(
    () => ({ ...resolvedTemplateDefaults, ...templateConfig }),
    [resolvedTemplateDefaults, templateConfig]
  );
  const autoSaveTemplate = useMemo<LegacyTemplate>(
    () => ({
      id: Number.parseInt(template.id, 10) || 0,
      name: template.name,
      slug: template.slug,
      category: template.category,
      description: template.description
    }),
    [template]
  );

  const { cvData, ...cvActions } = useCVData();
  const { saving, lastSaved, saveStatus, handleSave } = useAutoSave(cvData, autoSaveTemplate, userId);
  const ui = useEditorUI();
  const previewPanelWidth = ui.isMobile ? Math.max(ui.previewWidth, 380) : ui.previewWidth;
  const { notifications, unreadCount, showNotification, markAllAsRead } =
    useEditorNotifications();
  const {
    elements: editableElements,
    styleOverrides,
    getSectionElements,
    updateElementContent,
    updateElementStyle
  } = useEditableElements(cvData, (update) => {
    if (update.type === 'personal' && update.data) {
      Object.entries(update.data).forEach(([key, value]) => {
        type PersonalInfoField = Parameters<typeof cvActions.updatePersonalInfo>[0];
        cvActions.updatePersonalInfo(key as PersonalInfoField, value as string);
      });
    } else if (update.type === 'experience' && update.id && update.field) {
      type ExperienceField = Parameters<typeof cvActions.updateExperience>[1];
      cvActions.updateExperience(update.id, update.field as ExperienceField, update.value);
    } else if (update.type === 'experienceBatch' && update.id && update.data) {
      Object.entries(update.data).forEach(([field, value]) => {
        type ExperienceField = Parameters<typeof cvActions.updateExperience>[1];
        cvActions.updateExperience(update.id, field as ExperienceField, value);
      });
    } else if (update.type === 'experienceDescription' && update.id && update.index !== undefined) {
      cvActions.updateExperienceDescription(update.id, update.index, update.value);
    } else if (update.type === 'education' && update.id && update.field) {
      type EducationField = Parameters<typeof cvActions.updateEducation>[1];
      cvActions.updateEducation(update.id, update.field as EducationField, update.value);
    } else if (update.type === 'educationBatch' && update.id && update.data) {
      Object.entries(update.data).forEach(([field, value]) => {
        type EducationField = Parameters<typeof cvActions.updateEducation>[1];
        cvActions.updateEducation(update.id, field as EducationField, value);
      });
    }
  });

  const saveStatusClass = useMemo(() => {
    if (saveStatus === 'saved') return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
    if (saveStatus === 'saving') return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300';
    if (saveStatus === 'error') return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
    return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
  }, [saveStatus]);

  const selectedElementLive = useMemo(() => {
    if (!selectedElement) return null;
    return editableElements.find((el) => el.id === selectedElement.id) || selectedElement;
  }, [editableElements, selectedElement]);

  const toggleEditorMode = () => {
    const nextMode = editorMode === 'forms' ? 'direct' : 'forms';
    setEditorMode(nextMode);
    showNotification(
      nextMode === 'direct' ? 'تم التبديل إلى التحرير المباشر' : 'تم التبديل إلى وضع النماذج',
      'info'
    );
  };

  const handleElementSelect = (element: EditableSelection) => {
    setSelectedElement(element);
    setShowFormatting(true);
  };

  const handleDownloadPDF = () => {
    if (!showPreview) {
      setShowPreview(true);
      showNotification('تم فتح المعاينة. استخدم زر تصدير المعاينة لتحميل PDF', 'info');
      return;
    }
    showNotification('استخدم زر التصدير داخل المعاينة لتحميل PDF', 'info');
  };

  const handleDownloadDOCX = () => {
    showNotification('قريباً: تصدير بصيغة Word', 'info');
  };

  const handleDownloadPNG = () => {
    if (!showPreview) {
      setShowPreview(true);
      showNotification('تم فتح المعاينة. استخدم زر التصدير لتحميل PNG', 'info');
      return;
    }
    showNotification('استخدم زر التصدير داخل المعاينة لتحميل PNG', 'info');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    showNotification('تم نسخ رابط المشاركة', 'success');
  };

  const togglePreviewVisibility = () => {
    if (showPreview && isPreviewFullPage) {
      setIsPreviewFullPage(false);
    }
    setShowPreview((prev) => !prev);
  };

  const togglePreviewFullPage = () => {
    if (!showPreview) {
      setShowPreview(true);
    }
    setIsPreviewFullPage((prev) => !prev);
  };

  const handleReorderSections = (
    newSections: Array<{ id: string; title: string; enabled: boolean; icon?: string }>
  ) => {
    setSections((prev) => {
      const prevById = new Map(prev.map((section) => [section.id, section]));
      return newSections.map((section, index) => {
        const existing = prevById.get(section.id);
        return {
          id: section.id,
          type: existing?.type || section.id,
          title: section.title,
          enabled: section.enabled,
          order: index + 1,
          icon: section.icon || existing?.icon,
          fields: existing?.fields
        };
      });
    });
  };

  const handleToggleSection = (sectionId: string) => {
    setSections((prev) => prev.map((s) => (s.id === sectionId ? { ...s, enabled: !s.enabled } : s)));
  };
  const handleMoveSection = (sectionId: string, direction: 'up' | 'down') => {
    setSections((prev) => {
      const ordered = [...prev].sort((a, b) => a.order - b.order);
      const index = ordered.findIndex((s) => s.id === sectionId);
      if (index === -1) return prev;
      const target = direction === 'up' ? index - 1 : index + 1;
      if (target < 0 || target >= ordered.length) return prev;
      const [item] = ordered.splice(index, 1);
      ordered.splice(target, 0, item);
      return ordered.map((s, i) => ({ ...s, order: i + 1 }));
    });
  };
  const handleSectionStyleUpdate = (sectionId: string, style: Record<string, string | number>) => {
    setSectionStyleOverrides((prev) => {
      const current = prev[sectionId] || {};
      let hasChanges = false;
      for (const [key, value] of Object.entries(style)) {
        if (current[key] !== value) {
          hasChanges = true;
          break;
        }
      }
      if (!hasChanges) return prev;
      return {
        ...prev,
        [sectionId]: { ...current, ...style }
      };
    });
  };
  const handleSectionStyleReset = (sectionId: string) => {
    setSectionStyleOverrides((prev) => {
      const next = { ...prev };
      delete next[sectionId];
      return next;
    });
  };

  const handleAddCustomSection = (sectionData: { name: string; fields?: unknown[] }) => {
    const newSection: SectionItem = {
      id: `custom-${Date.now()}`,
      type: 'custom',
      title: sectionData.name,
      enabled: true,
      order: sections.length + 1,
      icon: '📦',
      fields: sectionData.fields || []
    };
    setSections((prev) => [...prev, newSection]);
    setShowCustomSectionForm(false);
    showNotification('تم إضافة القسم بنجاح', 'success');
  };

  const currentSection = sections.find((s) => s.id === activeSection);

  const renderContent = () => {
    if (!currentSection) {
      return (
        <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-10 text-center">
          <p className="text-gray-600 dark:text-gray-300">القسم غير موجود. اختر قسماً آخر.</p>
        </div>
      );
    }

    if (!currentSection.enabled) {
      return (
        <div className="text-center py-14">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800 mb-4">
            <EyeOff size={24} className="text-gray-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">هذا القسم متوقف حالياً</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            يمكنك تفعيله مباشرة أو إدارة الأقسام بالكامل.
          </p>
          <div className="flex justify-center gap-3">
            <ActionButton
              onClick={() => handleToggleSection(currentSection.id)}
              icon={Eye}
              label="تفعيل القسم"
              variant="primary"
            />
            <ActionButton
              onClick={() => setShowSectionEditor(true)}
              icon={Layout}
              label="إدارة الأقسام"
            />
          </div>
        </div>
      );
    }

    if (editorMode === 'direct') {
      return (
        <div className="space-y-5">
          <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300 flex items-center gap-2">
            <Sparkles size={16} />
            <span>انقر مرتين على أي نص داخل المحرر للتعديل المباشر.</span>
          </div>
          <InlineEditor
            elements={getSectionElements(activeSection)}
            onSelect={handleElementSelect}
            selectedId={selectedElement?.id}
            onContentUpdate={updateElementContent}
          />
        </div>
      );
    }

    const forms: Record<string, ReactNode> = {
      personal: (
        <PersonalInfoForm
          personalInfo={cvData.personalInfo}
          updatePersonalInfo={cvActions.updatePersonalInfo}
        />
      ),
      experience: (
        <ExperienceForm
          experiences={cvData.experiences as EditorExperience[]}
          addExperience={cvActions.addExperience}
          updateExperience={(id, field, value) =>
            cvActions.updateExperience(id, field as Parameters<typeof cvActions.updateExperience>[1], value)
          }
          updateExperienceDescription={cvActions.updateExperienceDescription}
          addExperienceDescription={cvActions.addExperienceDescription}
          removeExperienceDescription={cvActions.removeExperienceDescription}
          removeExperience={cvActions.removeExperience}
        />
      ),
      education: (
        <EducationForm
          education={cvData.education as EditorEducation[]}
          addEducation={cvActions.addEducation}
          updateEducation={(id, field, value) =>
            cvActions.updateEducation(id, field as Parameters<typeof cvActions.updateEducation>[1], value)
          }
          removeEducation={cvActions.removeEducation}
        />
      ),
      skills: (
        <SkillsForm
          skills={cvData.skills as EditorSkill[]}
          addSkill={cvActions.addSkill}
          updateSkill={(id, field, value) =>
            cvActions.updateSkill(id, field as Parameters<typeof cvActions.updateSkill>[1], value)
          }
          removeSkill={cvActions.removeSkill}
        />
      ),
      languages: (
        <LanguagesForm
          languages={cvData.languages as unknown as EditorLanguage[]}
          addLanguage={cvActions.addLanguage}
          updateLanguage={(id, field, value) =>
            cvActions.updateLanguage(id, field as Parameters<typeof cvActions.updateLanguage>[1], value)
          }
          removeLanguage={cvActions.removeLanguage}
        />
      ),
      certifications: (
        <CertificationsForm
          certifications={cvData.certifications as EditorCertification[]}
          addCertification={cvActions.addCertification}
          updateCertification={(id, field, value) =>
            cvActions.updateCertification(
              id,
              field as Parameters<typeof cvActions.updateCertification>[1],
              value
            )
          }
          removeCertification={cvActions.removeCertification}
        />
      ),
      projects: (
        <ProjectsForm
          projects={cvData.projects as EditorProject[]}
          addProject={cvActions.addProject}
          updateProject={(id, field, value) =>
            cvActions.updateProject(id, field as Parameters<typeof cvActions.updateProject>[1], value)
          }
          updateProjectDescription={cvActions.updateProjectDescription}
          addProjectDescription={cvActions.addProjectDescription}
          removeProjectDescription={cvActions.removeProjectDescription}
          removeProject={cvActions.removeProject}
        />
      )
    };

    return forms[currentSection.type] || null;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12),transparent_45%),radial-gradient(circle_at_90%_0%,rgba(14,165,233,0.10),transparent_35%)]" />

      <header className="sticky top-0 z-50 border-b border-gray-200/80 dark:border-gray-800/80 bg-white/85 dark:bg-gray-950/85 backdrop-blur-xl">
        <div className="mx-auto max-w-[1900px] px-4 md:px-6 py-3 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center shadow">
                {template.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-sm md:text-base font-bold">{template.name}</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">{template.category}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 ${saveStatusClass}`}>
                {saveStatus === 'saved' && <CheckCircle2 size={14} />}
                {saveStatus === 'saving' && <RefreshCw size={14} className="animate-spin" />}
                {saveStatus === 'error' && <AlertCircle size={14} />}
                <span>
                  {saveStatus === 'saved'
                    ? 'تم الحفظ'
                    : saveStatus === 'saving'
                    ? 'جاري الحفظ...'
                    : saveStatus === 'error'
                    ? 'خطأ في الحفظ'
                    : 'بانتظار الحفظ'}
                </span>
              </div>

              {lastSaved && (
                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                  <Clock size={14} />
                  <span>{lastSaved.toLocaleTimeString('ar-EG')}</span>
                </div>
              )}

              <button
                onClick={() => setShowNotifications((prev) => !prev)}
                className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <Bell size={18} className="text-gray-600 dark:text-gray-400" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-500" />
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <ActionButton onClick={() => handleSave(true)} icon={Save} label="حفظ" variant="primary" disabled={saving} />
            <ActionButton onClick={handleDownloadPDF} icon={FileText} label="PDF" variant="dark" />
            <ActionButton onClick={handleDownloadDOCX} icon={Download} label="Word" />
            <ActionButton onClick={handleDownloadPNG} icon={Image} label="PNG" />
            <ActionButton onClick={handlePrint} icon={Printer} label="طباعة" />
            <ActionButton onClick={handleShare} icon={Share2} label="مشاركة" />
            <ActionButton
              onClick={toggleEditorMode}
              icon={Sparkles}
              label={editorMode === 'direct' ? 'وضع النماذج' : 'التحرير المباشر'}
            />
            <ActionButton
              onClick={() => setShowCustomizer((prev) => !prev)}
              icon={Palette}
              label="تخصيص القالب"
              active={showCustomizer}
            />
            <ActionButton
              onClick={() => setShowSectionEditor((prev) => !prev)}
              icon={Layout}
              label="إدارة الأقسام"
              active={showSectionEditor}
            />
            {showPreview && (
              <ActionButton
                onClick={togglePreviewFullPage}
                icon={isPreviewFullPage ? Minimize2 : Maximize2}
                label={isPreviewFullPage ? 'خروج من كامل الصفحة' : 'معاينة كاملة الصفحة'}
                active={isPreviewFullPage}
              />
            )}
            <ActionButton
              onClick={togglePreviewVisibility}
              icon={showPreview ? EyeOff : Eye}
              label={showPreview ? 'إخفاء المعاينة' : 'إظهار المعاينة'}
              active={showPreview}
            />
          </div>
        </div>
      </header>

      <NotificationsPanel
        show={showNotifications}
        notifications={notifications}
        unreadCount={unreadCount}
        onClose={() => setShowNotifications(false)}
        onMarkAllAsRead={markAllAsRead}
      />

      <AnimatePresence>
        {showCustomizer && (
          <motion.aside
            initial={{ x: -420 }}
            animate={{ x: 0 }}
            exit={{ x: -420 }}
            transition={{ type: 'spring', damping: 30 }}
            className="fixed inset-y-0 left-0 w-full max-w-md bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-2xl z-[60]"
          >
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Palette size={18} className="text-blue-600" />
                  <h3 className="font-bold">تخصيص القالب</h3>
                </div>
                <button
                  onClick={() => setShowCustomizer(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <TemplateCustomizer
                  templateConfig={safeTemplateConfig}
                  setTemplateConfig={setTemplateConfig}
                  defaultConfig={resolvedTemplateDefaults}
                />
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSectionEditor && (
          <motion.aside
            initial={{ x: -420 }}
            animate={{ x: 0 }}
            exit={{ x: -420 }}
            transition={{ type: 'spring', damping: 30 }}
            className="fixed inset-y-0 left-0 w-full max-w-md bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-2xl z-[60]"
          >
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layout size={18} className="text-blue-600" />
                  <h3 className="font-bold">إدارة الأقسام</h3>
                </div>
                <button
                  onClick={() => setShowSectionEditor(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <SectionDragDrop
                  sections={sections}
                  onReorder={handleReorderSections}
                  onToggleSection={handleToggleSection}
                  onEditSection={(id) => setEditingSection(sections.find((s) => s.id === id) || null)}
                  onDeleteSection={(id) => {
                    if (id === 'personal') {
                      showNotification('لا يمكن حذف قسم المعلومات الشخصية', 'error');
                      return;
                    }
                    if (confirm('هل أنت متأكد من حذف هذا القسم؟')) {
                      setSections((prev) => prev.filter((s) => s.id !== id));
                      showNotification('تم حذف القسم بنجاح', 'success');
                    }
                  }}
                  onDuplicateSection={(id) => {
                    const section = sections.find((s) => s.id === id);
                    if (section) {
                      setSections((prev) => [
                        ...prev,
                        {
                          ...section,
                          id: `custom-${Date.now()}`,
                          title: `${section.title} (نسخة)`,
                          order: prev.length + 1
                        }
                      ]);
                      showNotification('تم نسخ القسم بنجاح', 'success');
                    }
                  }}
                  onAddSection={() => setShowCustomSectionForm(true)}
                />
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <main className="relative z-10 mx-auto max-w-[2100px] p-4 md:p-6">
        <div
          className={`grid grid-cols-1 ${
            showPreview && !isPreviewFullPage ? 'xl:grid-cols-[0.78fr_1.22fr]' : ''
          } gap-3 min-h-[calc(100vh-150px)]`}
        >
          {!showPreview && (
            <aside
              className="hidden xl:flex flex-col rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-900/80 shadow-sm overflow-hidden"
              style={{ width: ui.sidebarWidth }}
            >
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                <h3 className="text-sm font-bold">الأقسام</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">تنقل سريع بين أجزاء السيرة</p>
              </div>
              <div className="flex-1 min-h-0">
                <EditorSidebar
                  sections={SECTIONS}
                  activeSection={activeSection}
                  setActiveSection={setActiveSection}
                  collapsed={ui.sidebarWidth < 280}
                />
              </div>
            </aside>
          )}

          {!isPreviewFullPage && (
            <section className="min-w-0 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/85 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex flex-wrap items-center gap-2">
                {sections.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveSection(s.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      activeSection === s.id
                        ? 'bg-blue-600 text-white'
                        : s.enabled
                        ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        : 'bg-gray-100/60 text-gray-400 dark:bg-gray-800/70 dark:text-gray-500'
                    }`}
                  >
                    {s.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-[calc(100%-64px)] overflow-y-auto p-5">
              <motion.div
                key={activeSection + editorMode}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 md:p-6"
              >
                {renderContent()}
              </motion.div>
            </div>
            </section>
          )}

          {showPreview && (
            <div className="min-w-0">
              <div className="xl:sticky xl:top-28 rounded-2xl overflow-hidden border border-gray-200/80 dark:border-gray-800/80 shadow-sm">
                <PreviewPanel
                  show={showPreview}
                  width={previewPanelWidth}
                  zoom={ui.previewZoom}
                  device={ui.previewDevice}
                  orientation={ui.previewOrientation}
                  background={ui.previewBackground}
                  showGrid={ui.showGrid}
                  templateConfig={safeTemplateConfig}
                  template={template}
                  cvData={cvData as unknown as EditorCVData}
                  sections={sections.map((s) => ({ id: s.id, title: s.title, enabled: s.enabled, order: s.order }))}
                  styleOverrides={styleOverrides}
                  sectionStyleOverrides={sectionStyleOverrides}
                  selectedElement={selectedElementLive}
                  onUpdateSelectedStyle={(style) => {
                    if (!selectedElementLive) return;
                    updateElementStyle(selectedElementLive.id, style);
                  }}
                  onSectionStyleChange={handleSectionStyleUpdate}
                  onSectionStyleReset={handleSectionStyleReset}
                  onClose={() => {
                    setShowPreview(false);
                    setIsPreviewFullPage(false);
                  }}
                  onZoomIn={ui.zoomIn}
                  onZoomOut={ui.zoomOut}
                  onZoomReset={ui.resetZoom}
                  onDeviceChange={ui.setPreviewDevice}
                  activeSectionId={activeSection}
                  onSectionFocus={setActiveSection}
                  onSectionToggle={handleToggleSection}
                  onSectionMove={handleMoveSection}
                  onOrientationToggle={() =>
                    ui.setPreviewOrientation((prev: 'portrait' | 'landscape') =>
                      prev === 'portrait' ? 'landscape' : 'portrait'
                    )
                  }
                  onBackgroundChange={() =>
                    ui.setPreviewBackground((prev: 'white' | 'gray' | 'dark' | 'mesh') =>
                      prev === 'white' ? 'gray' : prev === 'gray' ? 'dark' : 'white'
                    )
                  }
                  onGridToggle={() => ui.setShowGrid((prev: boolean) => !prev)}
                  onResize={ui.setPreviewWidth}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      <AnimatePresence>
        {showFormatting && selectedElementLive && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70]"
          >
            <FormattingToolbar
              selectedElement={selectedElementLive}
              onUpdateStyle={(style) => updateElementStyle(selectedElementLive.id, style)}
              onClose={() => setShowFormatting(false)}
              elements={editableElements}
              onElementsUpdate={() => {}}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingSection && (
          <SectionEditorModal
            section={editingSection}
            onClose={() => setEditingSection(null)}
            onSave={(updatedSection) => {
              setSections((prev) =>
                prev.map((s) => (s.id === updatedSection.id ? { ...s, ...updatedSection } : s))
              );
              setEditingSection(null);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCustomSectionForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl"
            >
              <CustomSectionForm
                onSave={handleAddCustomSection}
                onCancel={() => setShowCustomSectionForm(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-4 left-4 space-y-2 z-[90]">
        <AnimatePresence>
          {notifications.slice(0, 3).map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }}
              className={`min-w-[280px] px-4 py-3 rounded-xl shadow-md border flex items-center gap-3 ${
                notification.type === 'success'
                  ? 'bg-green-50 text-green-800 border-green-200'
                  : notification.type === 'error'
                  ? 'bg-red-50 text-red-800 border-red-200'
                  : 'bg-blue-50 text-blue-800 border-blue-200'
              }`}
            >
              {notification.type === 'success' && <CheckCircle2 size={18} />}
              {notification.type === 'error' && <AlertCircle size={18} />}
              {notification.type === 'info' && <Sparkles size={18} />}
              <p className="text-sm font-medium flex-1">{notification.text}</p>
              <button className="p-1 rounded-lg hover:bg-white/40 transition">
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
