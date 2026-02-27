// components/editor/types/index.ts
export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  address: string;
  summary: string;
  [key: string]: any;
}

export interface Experience {
  id: string;
  position: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string[];
}

export interface Education {
  id: string;
  degree: string;
  field: string;
  institution: string;
  startDate: string;
  endDate: string;
  current: boolean;
  grade?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number;
  category: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: 'basic' | 'conversational' | 'fluent' | 'native';
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  credentialId?: string;
  url?: string;
}

export interface Project {
  id: string;
  name: string;
  role: string;
  description: string[];
  technologies: string[];
  startDate: string;
  endDate: string;
  current: boolean;
  url?: string;
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

export interface Template {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  thumbnail: string;
}

export interface TemplateConfig {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  fontSize: string;
  spacing: string;
  showBorders: boolean;
  showShadows: boolean;
  roundedCorners: boolean;
}