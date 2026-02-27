// أنواع القوالب العالمية
export type TemplateStyle = 'modern' | 'professional' | 'creative' | 'minimal' | 'executive' | 'academic';
export type ColorScheme = 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'gray' | 'teal' | 'indigo';
export type LayoutType = 'left-sidebar' | 'right-sidebar' | 'two-column' | 'three-column' | 'top-header' | string;

export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  address: string;
  summary: string;
  website?: string;
  linkedin?: string;
  github?: string;
  birthDate?: string;
  nationality?: string;
  profileImage?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  current: boolean;
  grade?: string;
  description?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number;
  category?: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  doesNotExpire?: boolean;
}

export interface Project {
  id: string;
  name: string;
  role?: string;
  description: string[];
  technologies: string[];
  startDate: string;
  endDate: string;
  current: boolean;
  url?: string;
  projectUrl?: string;
  githubUrl?: string;
}

export interface CVData {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
  certifications: Certification[];
  projects: Project[];
}

export interface TemplateConfig {
  id?: string;
  name?: string;
  style?: TemplateStyle;
  layout: LayoutType;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    heading?: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  spacing:
    | {
        sectionGap: number;
        itemGap: number;
        padding: number;
      }
    | string;
  showProfileImage?: boolean;
  showSocialLinks?: boolean;
  showAvatar?: boolean;
  showIcons?: boolean;
  sections?: {
    id: string;
    name: string;
    enabled: boolean;
    order: number;
    icon?: string;
  }[];
}

// قوالب جاهزة عالمية
export const TEMPLATES: Record<TemplateStyle, TemplateConfig> = {
  modern: {
    id: 'modern',
    name: 'Modern Professional',
    style: 'modern',
    layout: 'left-sidebar',
    colors: {
      primary: '#2563eb',
      secondary: '#7c3aed',
      accent: '#f59e0b',
      background: '#ffffff',
      text: '#1f2937',
      heading: '#111827',
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
    spacing: {
      sectionGap: 24,
      itemGap: 16,
      padding: 24,
    },
    showProfileImage: true,
    showSocialLinks: true,
    sections: [
      { id: 'profile', name: 'Profile', enabled: true, order: 1 },
      { id: 'experience', name: 'Experience', enabled: true, order: 2 },
      { id: 'education', name: 'Education', enabled: true, order: 3 },
      { id: 'skills', name: 'Skills', enabled: true, order: 4 },
      { id: 'languages', name: 'Languages', enabled: true, order: 5 },
      { id: 'certifications', name: 'Certifications', enabled: true, order: 6 },
      { id: 'projects', name: 'Projects', enabled: true, order: 7 },
    ],
  },
  professional: {
    id: 'professional',
    name: 'Executive Classic',
    style: 'professional',
    layout: 'top-header',
    colors: {
      primary: '#1e3a8a',
      secondary: '#334155',
      accent: '#cbd5e1',
      background: '#f8fafc',
      text: '#334155',
      heading: '#0f172a',
    },
    fonts: {
      heading: 'Merriweather',
      body: 'Roboto',
    },
    spacing: {
      sectionGap: 28,
      itemGap: 20,
      padding: 28,
    },
    showProfileImage: true,
    showSocialLinks: true,
    sections: [
      { id: 'profile', name: 'Professional Summary', enabled: true, order: 1 },
      { id: 'experience', name: 'Work History', enabled: true, order: 2 },
      { id: 'education', name: 'Education', enabled: true, order: 3 },
      { id: 'skills', name: 'Core Competencies', enabled: true, order: 4 },
      { id: 'certifications', name: 'Certifications', enabled: true, order: 5 },
      { id: 'languages', name: 'Languages', enabled: true, order: 6 },
    ],
  },
  creative: {
    id: 'creative',
    name: 'Creative Portfolio',
    style: 'creative',
    layout: 'right-sidebar',
    colors: {
      primary: '#db2777',
      secondary: '#6d28d9',
      accent: '#fbbf24',
      background: '#ffffff',
      text: '#1f2937',
      heading: '#111827',
    },
    fonts: {
      heading: 'Poppins',
      body: 'Open Sans',
    },
    spacing: {
      sectionGap: 20,
      itemGap: 12,
      padding: 20,
    },
    showProfileImage: true,
    showSocialLinks: true,
    sections: [
      { id: 'profile', name: 'About Me', enabled: true, order: 1 },
      { id: 'skills', name: 'Skills', enabled: true, order: 2 },
      { id: 'experience', name: 'Experience', enabled: true, order: 3 },
      { id: 'projects', name: 'Portfolio', enabled: true, order: 4 },
      { id: 'education', name: 'Education', enabled: true, order: 5 },
    ],
  },
  minimal: {
    id: 'minimal',
    name: 'Clean Minimal',
    style: 'minimal',
    layout: 'two-column',
    colors: {
      primary: '#4b5563',
      secondary: '#9ca3af',
      accent: '#6b7280',
      background: '#ffffff',
      text: '#374151',
      heading: '#111827',
    },
    fonts: {
      heading: 'Lato',
      body: 'Lato',
    },
    spacing: {
      sectionGap: 16,
      itemGap: 12,
      padding: 16,
    },
    showProfileImage: false,
    showSocialLinks: true,
    sections: [
      { id: 'profile', name: 'Summary', enabled: true, order: 1 },
      { id: 'experience', name: 'Experience', enabled: true, order: 2 },
      { id: 'education', name: 'Education', enabled: true, order: 3 },
      { id: 'skills', name: 'Skills', enabled: true, order: 4 },
    ],
  },
  executive: {
    id: 'executive',
    name: 'Executive Board',
    style: 'executive',
    layout: 'left-sidebar',
    colors: {
      primary: '#0f172a',
      secondary: '#334155',
      accent: '#f59e0b',
      background: '#ffffff',
      text: '#1e293b',
      heading: '#0f172a',
    },
    fonts: {
      heading: 'Playfair Display',
      body: 'Source Sans Pro',
    },
    spacing: {
      sectionGap: 24,
      itemGap: 18,
      padding: 24,
    },
    showProfileImage: true,
    showSocialLinks: true,
    sections: [
      { id: 'profile', name: 'Executive Profile', enabled: true, order: 1 },
      { id: 'experience', name: 'Leadership Experience', enabled: true, order: 2 },
      { id: 'education', name: 'Education', enabled: true, order: 3 },
      { id: 'skills', name: 'Executive Skills', enabled: true, order: 4 },
      { id: 'certifications', name: 'Board Certifications', enabled: true, order: 5 },
    ],
  },
  academic: {
    id: 'academic',
    name: 'Academic CV',
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
    fonts: {
      heading: 'Times New Roman',
      body: 'Georgia',
    },
    spacing: {
      sectionGap: 20,
      itemGap: 14,
      padding: 20,
    },
    showProfileImage: false,
    showSocialLinks: true,
    sections: [
      { id: 'profile', name: 'Academic Profile', enabled: true, order: 1 },
      { id: 'education', name: 'Education', enabled: true, order: 2 },
      { id: 'publications', name: 'Publications', enabled: true, order: 3 },
      { id: 'experience', name: 'Teaching Experience', enabled: true, order: 4 },
      { id: 'certifications', name: 'Research Grants', enabled: true, order: 5 },
      { id: 'skills', name: 'Research Skills', enabled: true, order: 6 },
    ],
  },
};

// خيارات الألوان
export const COLOR_PALETTES = {
  blue: {
    primary: '#2563eb',
    secondary: '#7c3aed',
    accent: '#f59e0b',
  },
  green: {
    primary: '#059669',
    secondary: '#10b981',
    accent: '#fbbf24',
  },
  purple: {
    primary: '#7c3aed',
    secondary: '#c084fc',
    accent: '#fcd34d',
  },
  orange: {
    primary: '#ea580c',
    secondary: '#f97316',
    accent: '#3b82f6',
  },
  red: {
    primary: '#dc2626',
    secondary: '#ef4444',
    accent: '#6b7280',
  },
  gray: {
    primary: '#4b5563',
    secondary: '#6b7280',
    accent: '#9ca3af',
  },
  teal: {
    primary: '#0d9488',
    secondary: '#14b8a6',
    accent: '#f59e0b',
  },
  indigo: {
    primary: '#4f46e5',
    secondary: '#818cf8',
    accent: '#f43f5e',
  },
};

// خيارات الخطوط العالمية
export const FONT_OPTIONS = {
  heading: [
    'Inter',
    'Poppins',
    'Roboto',
    'Montserrat',
    'Open Sans',
    'Lato',
    'Merriweather',
    'Playfair Display',
    'Times New Roman',
    'Georgia',
  ],
  body: [
    'Inter',
    'Roboto',
    'Open Sans',
    'Lato',
    'Arial',
    'Helvetica',
    'Georgia',
    'Times New Roman',
  ],
};
