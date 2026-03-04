'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import type { CVData } from '@/components/cvs/types';
import {
  TEMPLATE_PREVIEW_DATA,
  MINIMAL_NORDIC_PREVIEW_DATA,
  SALES_STAR_PREVIEW_DATA,
  RICHARD_PREVIEW_DATA,
  ANDREEMAAS_PREVIEW_DATA,
  PRODUCT_LEAD_PREVIEW_DATA,
  JULIANA_SILVA_PREVIEW_DATA,
  ALIDA_PLANET_PREVIEW_DATA
} from '@/components/templates/premium/previewData';

export interface SecretTemplateRef {
  id: number;
  name: string;
  slug: string;
}

type FormVisibility = {
  website: boolean;
  summary: boolean;
  experience: boolean;
  experienceLocation: boolean;
  education: boolean;
  educationField: boolean;
  skills: boolean;
  skillsWithPercent: boolean;
  languages: boolean;
  certifications: boolean;
  projects: boolean;
  twoNameLines: boolean;
};

type TemplateLabels = {
  personal: string;
  skills: string;
  experience: string;
  education: string;
  languages: string;
  certifications: string;
  projects: string;
  submitHint: string;
};

function normalizeSlug(slug: string) {
  return (slug || '').toLowerCase().replace(/[-_\s]/g, '');
}

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function clonePreviewData(slug?: string): CVData {
  const normalized = normalizeSlug(slug || '');
  const source =
    normalized === 'minimalnordic'
      ? MINIMAL_NORDIC_PREVIEW_DATA
      : normalized === 'salesstar'
        ? SALES_STAR_PREVIEW_DATA
        : normalized === 'richard'
          ? RICHARD_PREVIEW_DATA
          : normalized === 'andreemas'
            ? ANDREEMAAS_PREVIEW_DATA
            : normalized === 'productlead'
              ? PRODUCT_LEAD_PREVIEW_DATA
              : normalized === 'julianasilva'
                ? JULIANA_SILVA_PREVIEW_DATA
                : normalized === 'alidaplanet'
                  ? ALIDA_PLANET_PREVIEW_DATA
                  : TEMPLATE_PREVIEW_DATA;
  return JSON.parse(JSON.stringify(source)) as CVData;
}

function getFormVisibility(slug: string): FormVisibility {
  const normalized = normalizeSlug(slug);
  if (normalized === 'minimalnordic') {
    return {
      website: false,
      summary: true,
      experience: true,
      experienceLocation: true,
      education: true,
      educationField: true,
      skills: true,
      skillsWithPercent: false,
      languages: true,
      certifications: false,
      projects: false,
      twoNameLines: false
    };
  }
  if (normalized === 'salesstar') {
    return {
      website: false,
      summary: true,
      experience: true,
      experienceLocation: true,
      education: true,
      educationField: true,
      skills: true,
      skillsWithPercent: true,
      languages: true,
      certifications: false,
      projects: false,
      twoNameLines: true
    };
  }
  if (normalized === 'richard') {
    return {
      website: false,
      summary: true,
      experience: true,
      experienceLocation: true,
      education: true,
      educationField: false,
      skills: true,
      skillsWithPercent: true,
      languages: true,
      certifications: false,
      projects: false,
      twoNameLines: true
    };
  }
  if (normalized === 'andreemas') {
    return {
      website: true,
      summary: true,
      experience: true,
      experienceLocation: false,
      education: true,
      educationField: true,
      skills: true,
      skillsWithPercent: true,
      languages: false,
      certifications: true,
      projects: false,
      twoNameLines: true
    };
  }
  if (normalized === 'productlead') {
    return {
      website: true,
      summary: true,
      experience: true,
      experienceLocation: true,
      education: true,
      educationField: true,
      skills: true,
      skillsWithPercent: false,
      languages: false,
      certifications: true,
      projects: false,
      twoNameLines: false
    };
  }
  if (normalized === 'julianasilva') {
    return {
      website: true,
      summary: false,
      experience: true,
      experienceLocation: false,
      education: true,
      educationField: true,
      skills: true,
      skillsWithPercent: false,
      languages: true,
      certifications: false,
      projects: false,
      twoNameLines: false
    };
  }
  if (normalized === 'alidaplanet') {
    return {
      website: true,
      summary: true,
      experience: true,
      experienceLocation: false,
      education: true,
      educationField: true,
      skills: true,
      skillsWithPercent: false,
      languages: true,
      certifications: true,
      projects: true,
      twoNameLines: false
    };
  }
  return {
    website: true,
    summary: true,
    experience: true,
    experienceLocation: true,
    education: true,
    educationField: true,
    skills: true,
    skillsWithPercent: false,
    languages: true,
    certifications: true,
    projects: true,
    twoNameLines: false
  };
}

function getTemplateLabels(slug: string): TemplateLabels {
  const normalized = normalizeSlug(slug);
  if (normalized === 'andreemas') {
    return {
      personal: 'Loopbaansamenvatting / Contactinformatie',
      skills: 'Professionele vaardigheden + Skills Summary',
      experience: 'Werkervaring',
      education: 'Voorgaande scholen',
      languages: 'Talen',
      certifications: 'Werkreferenties',
      projects: 'Projecten',
      submitHint: 'عدّل الحقول ثم أنشئ ملف PDF ليظهر بنفس بيانات القالب.'
    };
  }
  if (normalized === 'alidaplanet') {
    return {
      personal: 'Profiel / Contact',
      skills: 'Speciale vaardigheden',
      experience: 'Toneel',
      education: 'Opleiding',
      languages: 'Talen',
      certifications: 'Statistieken',
      projects: 'Film',
      submitHint: 'عدّل الحقول ثم أنشئ ملف PDF بالقيم الجديدة.'
    };
  }
  if (normalized === 'salesstar') {
    return {
      personal: 'About Me / Contact',
      skills: 'Expertise + Skills Summary',
      experience: 'Experience',
      education: 'Education',
      languages: 'Language',
      certifications: 'Certifications',
      projects: 'Projects',
      submitHint: 'عدّل الحقول قبل التصدير ليظهر الملف النهائي بالقيم الجديدة.'
    };
  }
  if (normalized === 'richard') {
    return {
      personal: 'About Me / Contact',
      skills: 'Expertise + Skills Summary',
      experience: 'Experience',
      education: 'Education',
      languages: 'Language',
      certifications: 'References',
      projects: 'Projects',
      submitHint: 'عدّل الحقول قبل التصدير ليظهر الملف النهائي بالقيم الجديدة.'
    };
  }
  return {
    personal: 'المعلومات الشخصية',
    skills: 'المهارات',
    experience: 'الخبرات',
    education: 'التعليم',
    languages: 'اللغات',
    certifications: 'الشهادات / المراجع',
    projects: 'المشاريع',
    submitHint: 'عدّل الحقول ثم أنشئ ملف PDF بالقيم الجديدة.'
  };
}

function buildExportData(data: CVData, visibility: FormVisibility): CVData {
  const next: CVData = JSON.parse(JSON.stringify(data)) as CVData;

  if (visibility.experience && next.experiences.length === 0) {
    next.experiences = [{ id: createId('exp-fallback'), company: '', position: '', location: '', startDate: '', endDate: '', current: false, description: [] }];
  }
  if (visibility.education && next.education.length === 0) {
    next.education = [{ id: createId('edu-fallback'), institution: '', degree: '', field: '', startDate: '', endDate: '', current: false }];
  }
  if (visibility.skills && next.skills.length === 0) {
    next.skills = [{ id: createId('skill-fallback'), name: '', level: 1, ...(visibility.skillsWithPercent ? { percent: 0 } : {}) }];
  }
  if (visibility.languages && next.languages.length === 0) {
    next.languages = [{ id: createId('lang-fallback'), name: '', proficiency: '' }];
  }
  if (visibility.certifications && next.certifications.length === 0) {
    next.certifications = [{ id: createId('cert-fallback'), name: '', issuer: '', date: '', doesNotExpire: true }];
  }
  if (visibility.projects && next.projects.length === 0) {
    next.projects = [{ id: createId('proj-fallback'), name: '', role: '', description: [], technologies: [], startDate: '', endDate: '', current: false }];
  }

  return next;
}

function SectionCard({
  title,
  children,
  addLabel,
  onAdd
}: {
  title: string;
  children: React.ReactNode;
  addLabel?: string;
  onAdd?: () => void;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h4 className="font-bold text-slate-900 dark:text-slate-100">{title}</h4>
        {onAdd && addLabel && (
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-300 dark:border-slate-700 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Plus size={14} />
            {addLabel}
          </button>
        )}
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

export function SecretCvFormModal({
  template,
  open,
  loading,
  onClose,
  onSubmit
}: {
  template: SecretTemplateRef;
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onSubmit: (data: CVData) => Promise<void>;
}) {
  const [formData, setFormData] = useState<CVData>(() => clonePreviewData(template.slug));
  const visibility = getFormVisibility(template.slug);
  const labels = getTemplateLabels(template.slug);
  const normalizedSlug = normalizeSlug(template.slug);

  useEffect(() => {
    if (open) setFormData(clonePreviewData(template.slug));
  }, [open, template.slug, template.id]);

  const updatePersonalInfo = (key: keyof CVData['personalInfo'], value: string) => {
    setFormData((prev) => ({ ...prev, personalInfo: { ...prev.personalInfo, [key]: value } }));
  };

  const getNameLines = () => {
    const l1 = (formData.personalInfo.nameLine1 || '').trim();
    const l2 = (formData.personalInfo.nameLine2 || '').trim();
    if (l1 || l2) return { line1: l1, line2: l2 };
    const parts = (formData.personalInfo.fullName || '').trim().split(/\s+/).filter(Boolean);
    if (normalizedSlug === 'andreemas') {
      return {
        line1: parts.slice(0, Math.ceil(parts.length / 2)).join(' ') || 'ANDRE',
        line2: parts.slice(Math.ceil(parts.length / 2)).join(' ') || 'MAAS'
      };
    }
    return {
      line1: parts[0] || 'RICHARD',
      line2: parts.slice(1).join(' ') || 'SANCHEZ'
    };
  };

  const updateNameLine = (line: 'line1' | 'line2', value: string) => {
    const current = getNameLines();
    const line1 = line === 'line1' ? value : current.line1;
    const line2 = line === 'line2' ? value : current.line2;
    updatePersonalInfo('nameLine1', line1);
    updatePersonalInfo('nameLine2', line2);
    updatePersonalInfo('fullName', `${line1} ${line2}`.replace(/\s+/g, ' ').trim());
  };

  const handleProfileImageUpload = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updatePersonalInfo('profileImage', typeof reader.result === 'string' ? reader.result : '');
    reader.readAsDataURL(file);
  };

  const setExperienceItem = (index: number, patch: Partial<CVData['experiences'][number]>) => {
    setFormData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((item, i) => (i === index ? { ...item, ...patch } : item))
    }));
  };

  const setEducationItem = (index: number, patch: Partial<CVData['education'][number]>) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.map((item, i) => (i === index ? { ...item, ...patch } : item))
    }));
  };

  const setSkillItem = (index: number, patch: Partial<CVData['skills'][number]>) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.map((item, i) => (i === index ? { ...item, ...patch } : item))
    }));
  };

  const setLanguageItem = (index: number, patch: Partial<CVData['languages'][number]>) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.map((item, i) => (i === index ? { ...item, ...patch } : item))
    }));
  };

  const setCertificationItem = (index: number, patch: Partial<CVData['certifications'][number]>) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.map((item, i) => (i === index ? { ...item, ...patch } : item))
    }));
  };

  const setProjectItem = (index: number, patch: Partial<CVData['projects'][number]>) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.map((item, i) => (i === index ? { ...item, ...patch } : item))
    }));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-slate-950/85 p-2 sm:p-4 md:p-6">
      <div className="h-full w-full max-w-6xl mx-auto bg-white dark:bg-gray-950 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
        <div className="h-14 px-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 truncate">النموذج الخاص - {template.name}</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="h-[calc(100%-56px)] overflow-auto bg-slate-50 dark:bg-slate-900 p-4 sm:p-6">
          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              const payload = buildExportData(formData, visibility);
              void onSubmit(payload);
            }}
          >
            <SectionCard title={labels.personal}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input type="file" accept="image/*" onChange={(e) => handleProfileImageUpload(e.target.files?.[0] ?? null)} className="md:col-span-2 block w-full text-sm file:mr-3 file:px-3 file:py-2 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 text-slate-700 dark:text-slate-200" />
                {visibility.twoNameLines ? (
                  <>
                    <input value={getNameLines().line1} onChange={(e) => updateNameLine('line1', e.target.value)} placeholder="الاسم - السطر الأول" className="px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white" />
                    <input value={getNameLines().line2} onChange={(e) => updateNameLine('line2', e.target.value)} placeholder="الاسم - السطر الثاني" className="px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white" />
                  </>
                ) : (
                  <input value={formData.personalInfo.fullName} onChange={(e) => updatePersonalInfo('fullName', e.target.value)} placeholder="الاسم الكامل" className="px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white" />
                )}
                <input value={formData.personalInfo.jobTitle} onChange={(e) => updatePersonalInfo('jobTitle', e.target.value)} placeholder="المسمى الوظيفي" className="px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white" />
                <input value={formData.personalInfo.email} onChange={(e) => updatePersonalInfo('email', e.target.value)} placeholder="البريد الإلكتروني" className="px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white" />
                <input value={formData.personalInfo.phone} onChange={(e) => updatePersonalInfo('phone', e.target.value)} placeholder="رقم الهاتف" className="px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white" />
                <input value={formData.personalInfo.address} onChange={(e) => updatePersonalInfo('address', e.target.value)} placeholder="العنوان" className="md:col-span-2 px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white" />
                {visibility.website && <input value={formData.personalInfo.website || ''} onChange={(e) => updatePersonalInfo('website', e.target.value)} placeholder="الموقع الإلكتروني" className="md:col-span-2 px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white" />}
                {visibility.summary && <textarea value={formData.personalInfo.summary || ''} onChange={(e) => updatePersonalInfo('summary', e.target.value)} placeholder="نبذة احترافية" rows={4} className="md:col-span-2 px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white" />}
              </div>
            </SectionCard>

            {visibility.experience && (
              <SectionCard
                title={labels.experience}
                addLabel="إضافة خبرة"
                onAdd={() => setFormData((prev) => ({
                  ...prev,
                  experiences: [...prev.experiences, { id: createId('exp'), company: '', position: '', location: '', startDate: '', endDate: '', current: false, description: [''] }]
                }))}
              >
                {formData.experiences.map((exp, idx) => (
                  <div key={exp.id || `exp-${idx}`} className="rounded-xl border border-slate-200 dark:border-slate-800 p-3">
                    <div className={`grid grid-cols-1 ${visibility.experienceLocation ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-2`}>
                      <input value={exp.position} onChange={(e) => setExperienceItem(idx, { position: e.target.value })} placeholder="المسمى" className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white" />
                      <input value={exp.company} onChange={(e) => setExperienceItem(idx, { company: e.target.value })} placeholder="الشركة" className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white" />
                      {visibility.experienceLocation && <input value={exp.location} onChange={(e) => setExperienceItem(idx, { location: e.target.value })} placeholder="الموقع" className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white" />}
                      <input value={exp.startDate} onChange={(e) => setExperienceItem(idx, { startDate: e.target.value })} placeholder="تاريخ البداية" className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white" />
                      <input value={exp.endDate} onChange={(e) => setExperienceItem(idx, { endDate: e.target.value })} placeholder="تاريخ النهاية" className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white" />
                      <textarea value={exp.description.join('\n')} onChange={(e) => setExperienceItem(idx, { description: e.target.value.split('\n').map((line) => line.trim()).filter(Boolean) })} placeholder="الوصف (كل سطر نقطة)" rows={3} className="md:col-span-2 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white" />
                    </div>
                    <div className="mt-2 flex justify-end">
                      <button type="button" onClick={() => setFormData((prev) => ({ ...prev, experiences: prev.experiences.filter((_, i) => i !== idx) }))} className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700">
                        <Trash2 size={14} />
                        حذف
                      </button>
                    </div>
                  </div>
                ))}
              </SectionCard>
            )}

            {visibility.education && (
              <SectionCard
                title={labels.education}
                addLabel="إضافة تعليم"
                onAdd={() => setFormData((prev) => ({
                  ...prev,
                  education: [...prev.education, { id: createId('edu'), institution: '', degree: '', field: '', startDate: '', endDate: '', current: false }]
                }))}
              >
                {formData.education.map((edu, idx) => (
                  <div key={edu.id || `edu-${idx}`} className="rounded-xl border border-slate-200 dark:border-slate-800 p-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <input value={edu.degree} onChange={(e) => setEducationItem(idx, { degree: e.target.value })} placeholder="الدرجة" className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white" />
                      <input value={edu.institution} onChange={(e) => setEducationItem(idx, { institution: e.target.value })} placeholder="المؤسسة" className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white" />
                      {visibility.educationField && <input value={edu.field} onChange={(e) => setEducationItem(idx, { field: e.target.value })} placeholder="التخصص" className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white" />}
                      <input value={edu.startDate} onChange={(e) => setEducationItem(idx, { startDate: e.target.value })} placeholder="تاريخ البداية" className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white" />
                      <input value={edu.endDate} onChange={(e) => setEducationItem(idx, { endDate: e.target.value })} placeholder="تاريخ النهاية" className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white" />
                    </div>
                    <div className="mt-2 flex justify-end">
                      <button type="button" onClick={() => setFormData((prev) => ({ ...prev, education: prev.education.filter((_, i) => i !== idx) }))} className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700">
                        <Trash2 size={14} />
                        حذف
                      </button>
                    </div>
                  </div>
                ))}
              </SectionCard>
            )}

            {visibility.skills && (
              <SectionCard
                title={labels.skills}
                addLabel="إضافة مهارة"
                onAdd={() => setFormData((prev) => ({ ...prev, skills: [...prev.skills, { id: createId('skill'), name: '', level: 3, ...(visibility.skillsWithPercent ? { percent: 60 } : {}) }] }))}
              >
                {formData.skills.map((skill, idx) => (
                  <div key={skill.id || `skill-${idx}`} className={`grid grid-cols-1 ${visibility.skillsWithPercent ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-2 rounded-xl border border-slate-200 dark:border-slate-800 p-3`}>
                    <input value={skill.name} onChange={(e) => setSkillItem(idx, { name: e.target.value })} placeholder="اسم المهارة" className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white" />
                    <input type="number" min={1} max={5} value={skill.level} onChange={(e) => setSkillItem(idx, { level: Math.max(1, Math.min(5, Number(e.target.value) || 1)) })} placeholder="المستوى 1-5" className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white" />
                    {visibility.skillsWithPercent && <input type="number" min={0} max={100} value={(skill as any).percent ?? skill.level * 20} onChange={(e) => setSkillItem(idx, { percent: Math.max(0, Math.min(100, Number(e.target.value) || 0)) } as any)} placeholder="النسبة %" className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white" />}
                    <div className={`flex ${visibility.skillsWithPercent ? 'md:col-span-3' : 'md:col-span-2'} justify-end`}>
                      <button type="button" onClick={() => setFormData((prev) => ({ ...prev, skills: prev.skills.filter((_, i) => i !== idx) }))} className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700">
                        <Trash2 size={14} />
                        حذف
                      </button>
                    </div>
                  </div>
                ))}
              </SectionCard>
            )}

            {visibility.languages && (
              <SectionCard
                title={labels.languages}
                addLabel="إضافة لغة"
                onAdd={() => setFormData((prev) => ({ ...prev, languages: [...prev.languages, { id: createId('lang'), name: '', proficiency: '' }] }))}
              >
                {formData.languages.map((lang, idx) => (
                  <div key={lang.id || `lang-${idx}`} className="grid grid-cols-1 md:grid-cols-2 gap-2 rounded-xl border border-slate-200 dark:border-slate-800 p-3">
                    <input value={lang.name} onChange={(e) => setLanguageItem(idx, { name: e.target.value })} placeholder="اللغة" className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white" />
                    <input value={lang.proficiency} onChange={(e) => setLanguageItem(idx, { proficiency: e.target.value })} placeholder="المستوى" className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white" />
                    <div className="md:col-span-2 flex justify-end">
                      <button type="button" onClick={() => setFormData((prev) => ({ ...prev, languages: prev.languages.filter((_, i) => i !== idx) }))} className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700">
                        <Trash2 size={14} />
                        حذف
                      </button>
                    </div>
                  </div>
                ))}
              </SectionCard>
            )}

            {visibility.certifications && (
              <SectionCard
                title={labels.certifications}
                addLabel="إضافة عنصر"
                onAdd={() => setFormData((prev) => ({ ...prev, certifications: [...prev.certifications, { id: createId('cert'), name: '', issuer: '', date: '', doesNotExpire: true }] }))}
              >
                {formData.certifications.map((cert, idx) => (
                  <div key={cert.id || `cert-${idx}`} className="grid grid-cols-1 md:grid-cols-3 gap-2 rounded-xl border border-slate-200 dark:border-slate-800 p-3">
                    <input value={cert.name} onChange={(e) => setCertificationItem(idx, { name: e.target.value })} placeholder="الاسم" className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white" />
                    <input value={cert.issuer} onChange={(e) => setCertificationItem(idx, { issuer: e.target.value })} placeholder="الجهة" className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white" />
                    <input value={cert.date || ''} onChange={(e) => setCertificationItem(idx, { date: e.target.value })} placeholder="السنة / التاريخ" className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white" />
                    <div className="md:col-span-3 flex justify-end">
                      <button type="button" onClick={() => setFormData((prev) => ({ ...prev, certifications: prev.certifications.filter((_, i) => i !== idx) }))} className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700">
                        <Trash2 size={14} />
                        حذف
                      </button>
                    </div>
                  </div>
                ))}
              </SectionCard>
            )}

            {visibility.projects && (
              <SectionCard
                title={labels.projects}
                addLabel="إضافة مشروع"
                onAdd={() => setFormData((prev) => ({ ...prev, projects: [...prev.projects, { id: createId('proj'), name: '', role: '', description: [''], technologies: [], startDate: '', endDate: '', current: false }] }))}
              >
                {formData.projects.map((project, idx) => (
                  <div key={project.id || `proj-${idx}`} className="grid grid-cols-1 md:grid-cols-2 gap-2 rounded-xl border border-slate-200 dark:border-slate-800 p-3">
                    <input value={project.name} onChange={(e) => setProjectItem(idx, { name: e.target.value })} placeholder="اسم المشروع" className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white" />
                    <input value={project.startDate} onChange={(e) => setProjectItem(idx, { startDate: e.target.value })} placeholder="السنة / البداية" className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white" />
                    <textarea value={project.description.join('\n')} onChange={(e) => setProjectItem(idx, { description: e.target.value.split('\n').map((line) => line.trim()).filter(Boolean) })} placeholder="الوصف" rows={3} className="md:col-span-2 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white" />
                    <div className="md:col-span-2 flex justify-end">
                      <button type="button" onClick={() => setFormData((prev) => ({ ...prev, projects: prev.projects.filter((_, i) => i !== idx) }))} className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700">
                        <Trash2 size={14} />
                        حذف
                      </button>
                    </div>
                  </div>
                ))}
              </SectionCard>
            )}

            <div className="sticky bottom-0 flex items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 p-3 backdrop-blur">
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">{labels.submitHint}</p>
              <button type="submit" disabled={loading} className="px-4 sm:px-6 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? 'جاري الإنشاء...' : 'إنشاء PDF'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
