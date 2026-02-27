// components/editor/constants/editor.constants.ts
export type LayoutMode = 'full' | 'compact' | 'minimal';
export type SidebarPosition = 'left' | 'right' | 'bottom' | 'hidden';
export type EditorMode = 'forms' | 'direct';
export type PreviewDevice = 'desktop' | 'tablet' | 'mobile';
export type ThemeMode = 'light' | 'dark' | 'system';
export type PreviewBackground = 'white' | 'gray' | 'dark';
export type PreviewOrientation = 'portrait' | 'landscape';

export const DEFAULT_SECTIONS = [
  { id: 'personal', type: 'personal', title: 'المعلومات الشخصية', enabled: true, order: 1, icon: '👤' },
  { id: 'experience', type: 'experience', title: 'الخبرات المهنية', enabled: true, order: 2, icon: '💼' },
  { id: 'education', type: 'education', title: 'المؤهلات التعليمية', enabled: true, order: 3, icon: '🎓' },
  { id: 'skills', type: 'skills', title: 'المهارات', enabled: true, order: 4, icon: '⚡' },
  { id: 'languages', type: 'languages', title: 'اللغات', enabled: true, order: 5, icon: '🌐' },
  { id: 'certifications', type: 'certifications', title: 'الشهادات', enabled: true, order: 6, icon: '📜' },
  { id: 'projects', type: 'projects', title: 'المشاريع', enabled: true, order: 7, icon: '🚀' },
] as const;

export const PREVIEW_DIMENSIONS = {
  mobile: { portrait: { width: 375, height: 667 }, landscape: { width: 667, height: 375 } },
  tablet: { portrait: { width: 768, height: 1024 }, landscape: { width: 1024, height: 768 } },
  desktop: { width: '100%', height: 'auto' }
} as const;