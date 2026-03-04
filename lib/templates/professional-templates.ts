import type { TemplateConfig as EditorTemplateConfig } from '@/lib/types/template-config';

export interface ProfessionalTemplateConfig {
  id: string;
  name: string;
  style: string;
  layout: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    heading: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  spacing: {
    sectionGap: number;
    itemGap: number;
    padding: number;
  };
  showProfileImage: boolean;
  showSocialLinks: boolean;
  isPremium: boolean;
  price: number;
  pageTier?: 'one-page' | 'two-page';
  sections: Array<{
    id: string;
    name: string;
    enabled: boolean;
    order: number;
  }>;
}

// Clean registry: only the 5 approved templates remain.
export const PROFESSIONAL_TEMPLATES: Record<string, ProfessionalTemplateConfig> = {
  minimalNordic: {
    id: 'minimalNordic',
    name: 'Minimal Nordic',
    style: 'minimal',
    layout: 'two-column',
    colors: {
      primary: '#334155',
      secondary: '#0f172a',
      accent: '#0ea5e9',
      background: '#ffffff',
      text: '#1f2937',
      heading: '#111827'
    },
    fonts: { heading: 'Raleway', body: 'Lato' },
    spacing: { sectionGap: 20, itemGap: 14, padding: 20 },
    showProfileImage: false,
    showSocialLinks: true,
    isPremium: true,
    price: 10000,
    pageTier: 'one-page',
    sections: [
      { id: 'profile', name: 'Profile', enabled: true, order: 1 },
      { id: 'projects', name: 'Projects', enabled: true, order: 2 },
      { id: 'experience', name: 'Experience', enabled: true, order: 3 },
      { id: 'skills', name: 'Skills', enabled: true, order: 4 },
      { id: 'education', name: 'Education', enabled: true, order: 5 }
    ]
  },
  salesStar: {
    id: 'salesStar',
    name: 'Sales Star',
    style: 'modern',
    layout: 'top-header',
    colors: {
      primary: '#b45309',
      secondary: '#92400e',
      accent: '#fbbf24',
      background: '#fffbeb',
      text: '#374151',
      heading: '#78350f'
    },
    fonts: { heading: 'Montserrat', body: 'Open Sans' },
    spacing: { sectionGap: 24, itemGap: 16, padding: 24 },
    showProfileImage: true,
    showSocialLinks: true,
    isPremium: true,
    price: 10000,
    pageTier: 'one-page',
    sections: [
      { id: 'profile', name: 'Sales Profile', enabled: true, order: 1 },
      { id: 'achievements', name: 'Achievements', enabled: true, order: 2 },
      { id: 'experience', name: 'Experience', enabled: true, order: 3 },
      { id: 'skills', name: 'Skills', enabled: true, order: 4 },
      { id: 'education', name: 'Education', enabled: true, order: 5 }
    ]
  },
  productLead: {
    id: 'productLead',
    name: 'Product Lead',
    style: 'modern',
    layout: 'top-header',
    colors: {
      primary: '#0ea5e9',
      secondary: '#2563eb',
      accent: '#22c55e',
      background: '#f8fafc',
      text: '#1f2937',
      heading: '#0f172a'
    },
    fonts: { heading: 'Sora', body: 'DM Sans' },
    spacing: { sectionGap: 20, itemGap: 14, padding: 22 },
    showProfileImage: false,
    showSocialLinks: true,
    isPremium: true,
    price: 20000,
    pageTier: 'one-page',
    sections: [
      { id: 'profile', name: 'Profile', enabled: true, order: 1 },
      { id: 'experience', name: 'Experience', enabled: true, order: 2 },
      { id: 'projects', name: 'Projects', enabled: true, order: 3 },
      { id: 'skills', name: 'Capabilities', enabled: true, order: 4 },
      { id: 'education', name: 'Education', enabled: true, order: 5 }
    ]
  },
  julianaSilva: {
    id: 'julianaSilva',
    name: 'Juliana Silva',
    style: 'modern',
    layout: 'two-column',
    colors: {
      primary: '#2f7f9f',
      secondary: '#2a6f8a',
      accent: '#5b92ab',
      background: '#f2f4f6',
      text: '#1d2f3d',
      heading: '#2f6d8f'
    },
    fonts: { heading: 'Nunito', body: 'Nunito' },
    spacing: { sectionGap: 18, itemGap: 12, padding: 18 },
    showProfileImage: true,
    showSocialLinks: false,
    isPremium: true,
    price: 10000,
    pageTier: 'one-page',
    sections: [
      { id: 'profile', name: 'Profile', enabled: true, order: 1 },
      { id: 'experience', name: 'Experience', enabled: true, order: 2 },
      { id: 'skills', name: 'Skills', enabled: true, order: 3 },
      { id: 'education', name: 'Education', enabled: true, order: 4 },
      { id: 'languages', name: 'Languages', enabled: true, order: 5 }
    ]
  },
  alidaPlanet: {
    id: 'alidaPlanet',
    name: 'Alida Planet',
    style: 'creative',
    layout: 'two-column',
    colors: {
      primary: '#9a7432',
      secondary: '#3b829d',
      accent: '#e8acb8',
      background: '#f5f2ec',
      text: '#1a1a1a',
      heading: '#1a1a1a'
    },
    fonts: { heading: 'Cormorant Garamond', body: 'Lato' },
    spacing: { sectionGap: 18, itemGap: 12, padding: 20 },
    showProfileImage: true,
    showSocialLinks: false,
    isPremium: true,
    price: 10000,
    pageTier: 'one-page',
    sections: [
      { id: 'profile', name: 'Profile', enabled: true, order: 1 },
      { id: 'education', name: 'Education', enabled: true, order: 2 },
      { id: 'experience', name: 'Experience', enabled: true, order: 3 },
      { id: 'skills', name: 'Skills', enabled: true, order: 4 },
      { id: 'languages', name: 'Languages', enabled: true, order: 5 },
      { id: 'contact', name: 'Contact', enabled: true, order: 6 }
    ]
  }
};

export function getProfessionalTemplateBySlug(slug: string) {
  return PROFESSIONAL_TEMPLATES[slug];
}

export function mapProfessionalToEditorConfig(template: ProfessionalTemplateConfig): Partial<EditorTemplateConfig> {
  const perTemplate: Record<string, Partial<EditorTemplateConfig>> = {
    minimalNordic: { nameSize: 36, titleSize: 19, sectionTitleSize: 18, pageWidth: 900, radiusSize: 6, showShadows: false },
    salesStar: { nameSize: 43, titleSize: 24, sectionTitleSize: 20, pageWidth: 870, radiusSize: 16 },
    productLead: { nameSize: 41, titleSize: 21, sectionTitleSize: 20, pageWidth: 880, radiusSize: 14 },
    julianaSilva: { nameSize: 53, titleSize: 13, sectionTitleSize: 13, pageWidth: 840, radiusSize: 14, lineHeight: 1.35 },
    alidaPlanet: { nameSize: 60, titleSize: 18, sectionTitleSize: 24, pageWidth: 840, radiusSize: 26, lineHeight: 1.45 }
  };

  return {
    primaryColor: template.colors.primary,
    secondaryColor: template.colors.secondary,
    headingColor: template.colors.heading,
    textColor: template.colors.text,
    mutedTextColor: `${template.colors.text}CC`,
    headerTextColor: '#ffffff',
    pageColor: template.colors.background,
    fontFamily: template.fonts.body,
    headingFontFamily: template.fonts.heading,
    lineHeight: 1.5,
    nameSize: 36,
    titleSize: 20,
    sectionTitleSize: 20,
    bodySize: 14,
    sectionSpacing: template.spacing.sectionGap,
    blockSpacing: template.spacing.itemGap,
    pagePadding: template.spacing.padding,
    pageWidth: template.layout === 'two-column' ? 880 : 860,
    showBorders: true,
    borderWidth: 1,
    showShadows: true,
    roundedCorners: true,
    radiusSize: template.style === 'minimal' ? 8 : 16,
    presetLocked: true,
    ...perTemplate[template.id]
  };
}
