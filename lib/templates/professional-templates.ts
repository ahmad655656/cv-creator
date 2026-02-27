import type { TemplateConfig as EditorTemplateConfig } from '@/components/cvs/editor/types/templateConfig';

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

// قوالب احترافية معتمدة عالمياً - جميعها بسعر 10,000 ل.س
export const PROFESSIONAL_TEMPLATES: Record<string, ProfessionalTemplateConfig> = {
  // قالب تنفيذي - للمناصب القيادية
  executive: {
    id: 'executive',
    name: 'Executive Pro',
    style: 'executive',
    layout: 'left-sidebar',
    colors: {
      primary: '#0a1929',
      secondary: '#1e3a5f',
      accent: '#f0b90b',
      background: '#ffffff',
      text: '#1e293b',
      heading: '#0f172a',
    },
    fonts: { heading: 'Playfair Display', body: 'Source Sans Pro' },
    spacing: { sectionGap: 28, itemGap: 20, padding: 32 },
    showProfileImage: true,
    showSocialLinks: true,
    isPremium: true,
    price: 20000,
    pageTier: 'two-page',
    sections: [
      { id: 'profile', name: 'Executive Summary', enabled: true, order: 1 },
      { id: 'experience', name: 'Leadership Experience', enabled: true, order: 2 },
      { id: 'achievements', name: 'Key Achievements', enabled: true, order: 3 },
      { id: 'education', name: 'Education', enabled: true, order: 4 },
      { id: 'skills', name: 'Core Competencies', enabled: true, order: 5 },
    ],
  },

  // قالب تقني - للمبرمجين والمهندسين
  techMaster: {
    id: 'techMaster',
    name: 'TechMaster',
    style: 'technical',
    layout: 'right-sidebar',
    colors: {
      primary: '#2563eb',
      secondary: '#7c3aed',
      accent: '#10b981',
      background: '#f8fafc',
      text: '#1e293b',
      heading: '#0f172a',
    },
    fonts: { heading: 'Inter', body: 'Roboto Mono' },
    spacing: { sectionGap: 24, itemGap: 16, padding: 24 },
    showProfileImage: true,
    showSocialLinks: true,
    isPremium: true,
    price: 10000,
    pageTier: 'one-page',
    sections: [
      { id: 'profile', name: 'Technical Profile', enabled: true, order: 1 },
      { id: 'skills', name: 'Tech Stack', enabled: true, order: 2 },
      { id: 'experience', name: 'Experience', enabled: true, order: 3 },
      { id: 'projects', name: 'Projects', enabled: true, order: 4 },
      { id: 'education', name: 'Education', enabled: true, order: 5 },
      { id: 'certifications', name: 'Certifications', enabled: true, order: 6 },
    ],
  },

  // قالب أكاديمي - للباحثين والأكاديميين
  academicElite: {
    id: 'academicElite',
    name: 'Academic Elite',
    style: 'academic',
    layout: 'top-header',
    colors: {
      primary: '#166534',
      secondary: '#15803d',
      accent: '#ca8a04',
      background: '#ffffff',
      text: '#1e293b',
      heading: '#0f172a',
    },
    fonts: { heading: 'Merriweather', body: 'Georgia' },
    spacing: { sectionGap: 28, itemGap: 20, padding: 28 },
    showProfileImage: false,
    showSocialLinks: true,
    isPremium: true,
    price: 20000,
    pageTier: 'two-page',
    sections: [
      { id: 'profile', name: 'Academic Profile', enabled: true, order: 1 },
      { id: 'education', name: 'Education', enabled: true, order: 2 },
      { id: 'publications', name: 'Publications', enabled: true, order: 3 },
      { id: 'research', name: 'Research', enabled: true, order: 4 },
      { id: 'experience', name: 'Teaching', enabled: true, order: 5 },
      { id: 'grants', name: 'Grants', enabled: true, order: 6 },
    ],
  },

  // قالب طبي - للأطباء والممرضين
  medicalPro: {
    id: 'medicalPro',
    name: 'Medical Pro',
    style: 'medical',
    layout: 'two-column',
    colors: {
      primary: '#0891b2',
      secondary: '#0e7490',
      accent: '#06b6d4',
      background: '#f0f9ff',
      text: '#164e63',
      heading: '#083344',
    },
    fonts: { heading: 'Montserrat', body: 'Open Sans' },
    spacing: { sectionGap: 24, itemGap: 16, padding: 24 },
    showProfileImage: true,
    showSocialLinks: true,
    isPremium: true,
    price: 20000,
    pageTier: 'two-page',
    sections: [
      { id: 'profile', name: 'Medical Profile', enabled: true, order: 1 },
      { id: 'education', name: 'Medical Education', enabled: true, order: 2 },
      { id: 'experience', name: 'Clinical Experience', enabled: true, order: 3 },
      { id: 'certifications', name: 'Licenses', enabled: true, order: 4 },
      { id: 'publications', name: 'Research', enabled: true, order: 5 },
    ],
  },

  // قالب مالي - للمحاسبين والمستثمرين
  financeElite: {
    id: 'financeElite',
    name: 'Finance Elite',
    style: 'finance',
    layout: 'left-sidebar',
    colors: {
      primary: '#0f172a',
      secondary: '#1e293b',
      accent: '#fbbf24',
      background: '#ffffff',
      text: '#334155',
      heading: '#0f172a',
    },
    fonts: { heading: 'Lato', body: 'Roboto' },
    spacing: { sectionGap: 24, itemGap: 16, padding: 28 },
    showProfileImage: true,
    showSocialLinks: true,
    isPremium: true,
    price: 10000,
    pageTier: 'one-page',
    sections: [
      { id: 'profile', name: 'Financial Profile', enabled: true, order: 1 },
      { id: 'experience', name: 'Experience', enabled: true, order: 2 },
      { id: 'certifications', name: 'Certifications', enabled: true, order: 3 },
      { id: 'skills', name: 'Skills', enabled: true, order: 4 },
      { id: 'education', name: 'Education', enabled: true, order: 5 },
    ],
  },

  // قالب قانوني - للمحامين
  legalExpert: {
    id: 'legalExpert',
    name: 'Legal Expert',
    style: 'legal',
    layout: 'top-header',
    colors: {
      primary: '#7f1d1d',
      secondary: '#991b1b',
      accent: '#b45309',
      background: '#fef2f2',
      text: '#1e293b',
      heading: '#7f1d1d',
    },
    fonts: { heading: 'Cormorant Garamond', body: 'Inter' },
    spacing: { sectionGap: 28, itemGap: 20, padding: 28 },
    showProfileImage: true,
    showSocialLinks: true,
    isPremium: true,
    price: 10000,
    pageTier: 'one-page',
    sections: [
      { id: 'profile', name: 'Legal Profile', enabled: true, order: 1 },
      { id: 'experience', name: 'Cases', enabled: true, order: 2 },
      { id: 'education', name: 'Education', enabled: true, order: 3 },
      { id: 'certifications', name: 'Bar Admissions', enabled: true, order: 4 },
      { id: 'publications', name: 'Publications', enabled: true, order: 5 },
    ],
  },

  // قالب تسويقي - للمسوقين
  marketingGuru: {
    id: 'marketingGuru',
    name: 'Marketing Guru',
    style: 'creative',
    layout: 'right-sidebar',
    colors: {
      primary: '#c2410c',
      secondary: '#9a3412',
      accent: '#f97316',
      background: '#fff7ed',
      text: '#2d3748',
      heading: '#7b341e',
    },
    fonts: { heading: 'Poppins', body: 'Open Sans' },
    spacing: { sectionGap: 24, itemGap: 16, padding: 24 },
    showProfileImage: true,
    showSocialLinks: true,
    isPremium: true,
    price: 20000,
    pageTier: 'two-page',
    sections: [
      { id: 'profile', name: 'Marketing Profile', enabled: true, order: 1 },
      { id: 'experience', name: 'Campaigns', enabled: true, order: 2 },
      { id: 'skills', name: 'Skills', enabled: true, order: 3 },
      { id: 'achievements', name: 'Achievements', enabled: true, order: 4 },
      { id: 'education', name: 'Education', enabled: true, order: 5 },
    ],
  },

  // قالب معماري - للمهندسين المعماريين
  architectPro: {
    id: 'architectPro',
    name: 'Architect Pro',
    style: 'minimal',
    layout: 'two-column',
    colors: {
      primary: '#2c3e50',
      secondary: '#34495e',
      accent: '#e67e22',
      background: '#ffffff',
      text: '#2d3436',
      heading: '#2c3e50',
    },
    fonts: { heading: 'Raleway', body: 'Lato' },
    spacing: { sectionGap: 28, itemGap: 20, padding: 28 },
    showProfileImage: true,
    showSocialLinks: true,
    isPremium: true,
    price: 10000,
    pageTier: 'one-page',
    sections: [
      { id: 'profile', name: 'Architect Profile', enabled: true, order: 1 },
      { id: 'projects', name: 'Projects', enabled: true, order: 2 },
      { id: 'experience', name: 'Experience', enabled: true, order: 3 },
      { id: 'skills', name: 'Skills', enabled: true, order: 4 },
      { id: 'education', name: 'Education', enabled: true, order: 5 },
    ],
  },

  // قالب موارد بشرية
  hrPro: {
    id: 'hrPro',
    name: 'HR Pro',
    style: 'professional',
    layout: 'left-sidebar',
    colors: {
      primary: '#4a5568',
      secondary: '#2d3748',
      accent: '#48bb78',
      background: '#ffffff',
      text: '#1a202c',
      heading: '#2d3748',
    },
    fonts: { heading: 'Nunito', body: 'Roboto' },
    spacing: { sectionGap: 24, itemGap: 16, padding: 24 },
    showProfileImage: true,
    showSocialLinks: true,
    isPremium: true,
    price: 10000,
    pageTier: 'one-page',
    sections: [
      { id: 'profile', name: 'HR Profile', enabled: true, order: 1 },
      { id: 'experience', name: 'Experience', enabled: true, order: 2 },
      { id: 'skills', name: 'HR Skills', enabled: true, order: 3 },
      { id: 'certifications', name: 'Certifications', enabled: true, order: 4 },
      { id: 'education', name: 'Education', enabled: true, order: 5 },
    ],
  },

  // قالب المبيعات
  globalEdge: {
    id: 'globalEdge',
    name: 'Global Edge',
    style: 'professional',
    layout: 'two-column',
    colors: {
      primary: '#1d4ed8',
      secondary: '#0f172a',
      accent: '#14b8a6',
      background: '#ffffff',
      text: '#1e293b',
      heading: '#0f172a',
    },
    fonts: { heading: 'Manrope', body: 'Inter' },
    spacing: { sectionGap: 24, itemGap: 16, padding: 28 },
    showProfileImage: true,
    showSocialLinks: true,
    isPremium: true,
    price: 20000,
    pageTier: 'two-page',
    sections: [
      { id: 'profile', name: 'Global Profile', enabled: true, order: 1 },
      { id: 'experience', name: 'Experience', enabled: true, order: 2 },
      { id: 'projects', name: 'Projects', enabled: true, order: 3 },
      { id: 'skills', name: 'Skills', enabled: true, order: 4 },
      { id: 'education', name: 'Education', enabled: true, order: 5 },
    ],
  },

  auroraPrime: {
    id: 'auroraPrime',
    name: 'Aurora Prime',
    style: 'modern',
    layout: 'top-header',
    colors: {
      primary: '#0ea5e9',
      secondary: '#2563eb',
      accent: '#06b6d4',
      background: '#f8fafc',
      text: '#1f2937',
      heading: '#0f172a',
    },
    fonts: { heading: 'Sora', body: 'DM Sans' },
    spacing: { sectionGap: 24, itemGap: 16, padding: 26 },
    showProfileImage: true,
    showSocialLinks: true,
    isPremium: true,
    price: 20000,
    pageTier: 'two-page',
    sections: [
      { id: 'profile', name: 'Profile', enabled: true, order: 1 },
      { id: 'experience', name: 'Experience', enabled: true, order: 2 },
      { id: 'skills', name: 'Capabilities', enabled: true, order: 3 },
      { id: 'projects', name: 'Projects', enabled: true, order: 4 },
      { id: 'education', name: 'Education', enabled: true, order: 5 },
    ],
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
      heading: '#78350f',
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
      { id: 'education', name: 'Education', enabled: true, order: 5 },
    ],
  },

  boardroomElite: {
    id: 'boardroomElite',
    name: 'Boardroom Elite',
    style: 'executive',
    layout: 'left-sidebar',
    colors: {
      primary: '#0b1324',
      secondary: '#1d3557',
      accent: '#f59e0b',
      background: '#ffffff',
      text: '#1f2937',
      heading: '#0f172a',
    },
    fonts: { heading: 'Playfair Display', body: 'Source Sans Pro' },
    spacing: { sectionGap: 24, itemGap: 16, padding: 24 },
    showProfileImage: false,
    showSocialLinks: true,
    isPremium: true,
    price: 20000,
    pageTier: 'two-page',
    sections: [
      { id: 'profile', name: 'Executive Profile', enabled: true, order: 1 },
      { id: 'experience', name: 'Experience', enabled: true, order: 2 },
      { id: 'skills', name: 'Core Skills', enabled: true, order: 3 },
      { id: 'education', name: 'Education', enabled: true, order: 4 },
      { id: 'projects', name: 'Projects', enabled: true, order: 5 },
    ],
  },

  startupOne: {
    id: 'startupOne',
    name: 'Startup One',
    style: 'technical',
    layout: 'right-sidebar',
    colors: {
      primary: '#2563eb',
      secondary: '#0f172a',
      accent: '#22c55e',
      background: '#f8fafc',
      text: '#1e293b',
      heading: '#111827',
    },
    fonts: { heading: 'Inter', body: 'Inter' },
    spacing: { sectionGap: 22, itemGap: 14, padding: 22 },
    showProfileImage: false,
    showSocialLinks: true,
    isPremium: true,
    price: 10000,
    pageTier: 'one-page',
    sections: [
      { id: 'profile', name: 'Profile', enabled: true, order: 1 },
      { id: 'skills', name: 'Skills', enabled: true, order: 2 },
      { id: 'experience', name: 'Experience', enabled: true, order: 3 },
      { id: 'projects', name: 'Projects', enabled: true, order: 4 },
      { id: 'education', name: 'Education', enabled: true, order: 5 },
    ],
  },

  consultingPrime: {
    id: 'consultingPrime',
    name: 'Consulting Prime',
    style: 'professional',
    layout: 'two-column',
    colors: {
      primary: '#0f172a',
      secondary: '#1d4ed8',
      accent: '#14b8a6',
      background: '#ffffff',
      text: '#334155',
      heading: '#0f172a',
    },
    fonts: { heading: 'Manrope', body: 'Inter' },
    spacing: { sectionGap: 22, itemGap: 14, padding: 22 },
    showProfileImage: false,
    showSocialLinks: true,
    isPremium: true,
    price: 20000,
    pageTier: 'two-page',
    sections: [
      { id: 'profile', name: 'Profile', enabled: true, order: 1 },
      { id: 'experience', name: 'Consulting Experience', enabled: true, order: 2 },
      { id: 'projects', name: 'Projects', enabled: true, order: 3 },
      { id: 'skills', name: 'Skills', enabled: true, order: 4 },
      { id: 'education', name: 'Education', enabled: true, order: 5 },
    ],
  },

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
      heading: '#111827',
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
      { id: 'education', name: 'Education', enabled: true, order: 5 },
    ],
  },

  legalModern: {
    id: 'legalModern',
    name: 'Legal Modern',
    style: 'legal',
    layout: 'top-header',
    colors: {
      primary: '#7f1d1d',
      secondary: '#991b1b',
      accent: '#d97706',
      background: '#fff7ed',
      text: '#1f2937',
      heading: '#7f1d1d',
    },
    fonts: { heading: 'Cormorant Garamond', body: 'Inter' },
    spacing: { sectionGap: 22, itemGap: 14, padding: 22 },
    showProfileImage: false,
    showSocialLinks: true,
    isPremium: true,
    price: 10000,
    pageTier: 'one-page',
    sections: [
      { id: 'profile', name: 'Profile', enabled: true, order: 1 },
      { id: 'experience', name: 'Practice', enabled: true, order: 2 },
      { id: 'education', name: 'Education', enabled: true, order: 3 },
      { id: 'certifications', name: 'Admissions', enabled: true, order: 4 },
    ],
  },

  financeQuant: {
    id: 'financeQuant',
    name: 'Finance Quant',
    style: 'finance',
    layout: 'left-sidebar',
    colors: {
      primary: '#0f172a',
      secondary: '#1e293b',
      accent: '#f59e0b',
      background: '#ffffff',
      text: '#334155',
      heading: '#111827',
    },
    fonts: { heading: 'Lato', body: 'Roboto' },
    spacing: { sectionGap: 20, itemGap: 14, padding: 22 },
    showProfileImage: false,
    showSocialLinks: true,
    isPremium: true,
    price: 20000,
    pageTier: 'two-page',
    sections: [
      { id: 'profile', name: 'Profile', enabled: true, order: 1 },
      { id: 'experience', name: 'Experience', enabled: true, order: 2 },
      { id: 'skills', name: 'Skills', enabled: true, order: 3 },
      { id: 'education', name: 'Education', enabled: true, order: 4 },
      { id: 'certifications', name: 'Certifications', enabled: true, order: 5 },
    ],
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
      heading: '#0f172a',
    },
    fonts: { heading: 'Sora', body: 'DM Sans' },
    spacing: { sectionGap: 20, itemGap: 14, padding: 22 },
    showProfileImage: false,
    showSocialLinks: true,
    isPremium: true,
    price: 20000,
    pageTier: 'two-page',
    sections: [
      { id: 'profile', name: 'Profile', enabled: true, order: 1 },
      { id: 'experience', name: 'Experience', enabled: true, order: 2 },
      { id: 'projects', name: 'Projects', enabled: true, order: 3 },
      { id: 'skills', name: 'Capabilities', enabled: true, order: 4 },
      { id: 'education', name: 'Education', enabled: true, order: 5 },
    ],
  },
};

export function getProfessionalTemplateBySlug(slug: string) {
  return PROFESSIONAL_TEMPLATES[slug];
}

// Map DB/professional template config to the live editor visual system.
export function mapProfessionalToEditorConfig(template: ProfessionalTemplateConfig): Partial<EditorTemplateConfig> {
  const perTemplate: Record<string, Partial<EditorTemplateConfig>> = {
    executive: { nameSize: 44, titleSize: 22, sectionTitleSize: 22, pageWidth: 880, radiusSize: 14 },
    techMaster: { nameSize: 38, titleSize: 20, sectionTitleSize: 20, pageWidth: 860, radiusSize: 18 },
    academicElite: { nameSize: 40, titleSize: 20, sectionTitleSize: 21, pageWidth: 900, radiusSize: 10, lineHeight: 1.7 },
    medicalPro: { nameSize: 36, titleSize: 19, sectionTitleSize: 19, pageWidth: 860, radiusSize: 10 },
    financeElite: { nameSize: 42, titleSize: 21, sectionTitleSize: 20, pageWidth: 870, radiusSize: 6 },
    legalExpert: { nameSize: 41, titleSize: 20, sectionTitleSize: 21, pageWidth: 880, radiusSize: 8 },
    marketingGuru: { nameSize: 39, titleSize: 21, sectionTitleSize: 20, pageWidth: 860, radiusSize: 20 },
    architectPro: { nameSize: 36, titleSize: 19, sectionTitleSize: 18, pageWidth: 900, radiusSize: 0, showShadows: false },
    hrPro: { nameSize: 37, titleSize: 19, sectionTitleSize: 19, pageWidth: 860, radiusSize: 12 },
    globalEdge: { nameSize: 40, titleSize: 21, sectionTitleSize: 20, pageWidth: 880, radiusSize: 12 },
    auroraPrime: { nameSize: 42, titleSize: 22, sectionTitleSize: 20, pageWidth: 880, radiusSize: 18 },
    salesStar: { nameSize: 43, titleSize: 24, sectionTitleSize: 20, pageWidth: 870, radiusSize: 16 },
    boardroomElite: { nameSize: 42, titleSize: 22, sectionTitleSize: 21, pageWidth: 880, radiusSize: 10 },
    startupOne: { nameSize: 38, titleSize: 20, sectionTitleSize: 19, pageWidth: 860, radiusSize: 14 },
    consultingPrime: { nameSize: 40, titleSize: 20, sectionTitleSize: 20, pageWidth: 880, radiusSize: 12 },
    minimalNordic: { nameSize: 36, titleSize: 19, sectionTitleSize: 18, pageWidth: 900, radiusSize: 6, showShadows: false },
    legalModern: { nameSize: 40, titleSize: 20, sectionTitleSize: 20, pageWidth: 880, radiusSize: 8 },
    financeQuant: { nameSize: 41, titleSize: 20, sectionTitleSize: 20, pageWidth: 870, radiusSize: 8 },
    productLead: { nameSize: 41, titleSize: 21, sectionTitleSize: 20, pageWidth: 880, radiusSize: 14 }
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
    lineHeight: template.style === 'academic' ? 1.7 : 1.5,
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
