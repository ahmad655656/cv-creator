// components/editor/constants/index.ts
import { Template } from '../types';

export const SECTIONS = [
  { id: 'personal', label: 'المعلومات الشخصية', icon: '👤' },
  { id: 'experience', label: 'الخبرات المهنية', icon: '💼' },
  { id: 'education', label: 'المؤهلات التعليمية', icon: '🎓' },
  { id: 'skills', label: 'المهارات', icon: '⚡' },
  { id: 'languages', label: 'اللغات', icon: '🌐' },
  { id: 'certifications', label: 'الشهادات', icon: '📜' },
  { id: 'projects', label: 'المشاريع', icon: '🚀' },
];

export const TEMPLATES: Record<string, Template> = {
  modern: {
    id: 'modern',
    name: 'مودرن',
    slug: 'modern',
    category: 'professional',
    description: 'تصميم عصري وأنيق',
    thumbnail: '/templates/modern.jpg'
  },
  classic: {
    id: 'classic',
    name: 'كلاسيك',
    slug: 'classic',
    category: 'professional',
    description: 'تصميم كلاسيكي تقليدي',
    thumbnail: '/templates/classic.jpg'
  },
  minimal: {
    id: 'minimal',
    name: 'بسيط',
    slug: 'minimal',
    category: 'simple',
    description: 'تصميم بسيط ونظيف',
    thumbnail: '/templates/minimal.jpg'
  },
  creative: {
    id: 'creative',
    name: 'إبداعي',
    slug: 'creative',
    category: 'creative',
    description: 'تصميم إبداعي للمجالات الفنية',
    thumbnail: '/templates/creative.jpg'
  },
  executive: {
    id: 'executive',
    name: 'تنفيذي',
    slug: 'executive',
    category: 'professional',
    description: 'تصميم مناسب للمناصب القيادية',
    thumbnail: '/templates/executive.jpg'
  },
  techMaster: {
    id: 'techMaster',
    name: 'تقني',
    slug: 'techMaster',
    category: 'technical',
    description: 'تصميم متخصص للمجالات التقنية',
    thumbnail: '/templates/tech.jpg'
  },
  academicElite: {
    id: 'academicElite',
    name: 'أكاديمي',
    slug: 'academicElite',
    category: 'academic',
    description: 'تصميم مناسب للمجالات الأكاديمية',
    thumbnail: '/templates/academic.jpg'
  },
  medicalPro: {
    id: 'medicalPro',
    name: 'طبي',
    slug: 'medicalPro',
    category: 'medical',
    description: 'تصميم متخصص للمجالات الطبية',
    thumbnail: '/templates/medical.jpg'
  },
  financeElite: {
    id: 'financeElite',
    name: 'مالي',
    slug: 'financeElite',
    category: 'finance',
    description: 'تصميم للمجالات المالية والمحاسبية',
    thumbnail: '/templates/finance.jpg'
  },
  legalExpert: {
    id: 'legalExpert',
    name: 'قانوني',
    slug: 'legalExpert',
    category: 'legal',
    description: 'تصميم للمجالات القانونية',
    thumbnail: '/templates/legal.jpg'
  }
};

export const DEFAULT_SECTIONS = [
  { id: 'personal', type: 'personal', title: 'المعلومات الشخصية', enabled: true, order: 1, icon: '👤' },
  { id: 'experience', type: 'experience', title: 'الخبرات المهنية', enabled: true, order: 2, icon: '💼' },
  { id: 'education', type: 'education', title: 'المؤهلات التعليمية', enabled: true, order: 3, icon: '🎓' },
  { id: 'skills', type: 'skills', title: 'المهارات', enabled: true, order: 4, icon: '⚡' },
  { id: 'languages', type: 'languages', title: 'اللغات', enabled: true, order: 5, icon: '🌐' },
  { id: 'certifications', type: 'certifications', title: 'الشهادات', enabled: true, order: 6, icon: '📜' },
  { id: 'projects', type: 'projects', title: 'المشاريع', enabled: true, order: 7, icon: '🚀' },
];

export const PREVIEW_DIMENSIONS = {
  mobile: {
    portrait: { width: 375, height: 667 },
    landscape: { width: 667, height: 375 }
  },
  tablet: {
    portrait: { width: 768, height: 1024 },
    landscape: { width: 1024, height: 768 }
  },
  desktop: { width: '100%', height: 'auto' }
} as const;