export interface Template {
  id: number;
  name: string;
  slug: string;
  category: string;
  description?: string;
}

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
  profileImage?: string; // <-- هذا السطر مهم جداً
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
  doesNotExpire: boolean;
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

export type TemplateStyle = 'modern' | 'professional' | 'creative' | 'minimal' | 'executive' | 'academic';
export type LayoutType = 'left-sidebar' | 'right-sidebar' | 'two-column' | 'three-column' | 'top-header';

export interface TemplateConfig {
  id: string;
  name: string;
  style: TemplateStyle;
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
  spacing: {
    sectionGap: number;
    itemGap: number;
    padding: number;
  };
  showProfileImage: boolean;
  showSocialLinks: boolean;
  isPremium?: boolean;
  price?: number;
  sections: {
    id: string;
    name: string;
    enabled: boolean;
    order: number;
    icon?: string;
  }[];
}

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';


// أنواع العناصر القابلة للتحرير
export type EditableElementType = 
  | 'heading'
  | 'paragraph' 
  | 'text'
  | 'list'
  | 'image'
  | 'section'
  | 'container'
  | 'column'
  | 'divider'
  | 'icon'
  | 'button'
  | 'date'
  | 'progress'
  | 'rating';

export interface EditableElement {
  id: string;
  type: EditableElementType;
  content: any;
  section: string;
  style: ElementStyle;
  layout?: ElementLayout;
  parentId?: string;
  children?: EditableElement[];
}

export interface ElementStyle {
  // Text styles
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  fontStyle?: string;
  textDecoration?: string;
  textAlign?: 'right' | 'center' | 'left' | 'justify';
  color?: string;
  lineHeight?: string;
  letterSpacing?: string;
  
  // Box styles
  backgroundColor?: string;
  backgroundImage?: string;
  padding?: string;
  margin?: string;
  borderWidth?: string;
  borderStyle?: string;
  borderColor?: string;
  borderRadius?: string;
  boxShadow?: string;
  
  // Image styles
  objectFit?: 'cover' | 'contain' | 'fill' | 'none';
  objectPosition?: string;
  filter?: string;
  
  // Flex styles
  flexGrow?: number;
  flexShrink?: number;
  flexBasis?: string;
  alignSelf?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'stretch';
  
  // Effects
  opacity?: number;
  rotate?: string;
  scale?: string;
  transition?: string;
  transform?: string;
  
  // Position
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  zIndex?: number;
  
  // Width/Height
  width?: string;
  height?: string;
  minWidth?: string;
  minHeight?: string;
  maxWidth?: string;
  maxHeight?: string;
}

export interface ElementLayout {
  flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  flexWrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  alignContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'stretch';
  gap?: string;
  gridTemplateColumns?: string;
  gridTemplateRows?: string;
}
// أنواع التقسيمات المتقدمة
export type AdvancedLayoutType = 'grid' | 'flex' | 'masonry' | 'timeline' | 'cards' | 'magazine';
export type ColumnCount = 1 | 2 | 3 | 4 | 6 | 12;
export type GapSize = 'none' | 'sm' | 'md' | 'lg' | 'xl';

export interface GridLayout {
  type: 'grid';
  columns: ColumnCount;
  rows?: number;
  gap: GapSize;
  columnSpan?: number;
  rowSpan?: number;
  areas?: string[][];
  template?: string;
}

export interface FlexLayout {
  type: 'flex';
  direction: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  wrap: 'wrap' | 'nowrap' | 'wrap-reverse';
  justifyContent: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  alignContent: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'stretch';
  gap: GapSize;
}

export interface CardLayout {
  type: 'cards';
  variant: 'elevated' | 'outlined' | 'flat';
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  shadow: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hoverEffect: boolean;
}

export interface SectionDivider {
  show: boolean;
  style: 'solid' | 'dashed' | 'dotted' | 'double' | 'gradient';
  color?: string;
  thickness: number;
  width: number; // percentage
  margin: number;
}

export interface SectionSpacing {
  padding: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  margin: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

export interface SectionBackground {
  type: 'color' | 'gradient' | 'image' | 'none';
  color?: string;
  gradient?: {
    start: string;
    end: string;
    angle: number;
  };
  image?: string;
  opacity?: number;
  blur?: number;
}
