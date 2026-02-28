export interface TemplateConfig {
  primaryColor: string;
  secondaryColor: string;
  headingColor: string;
  textColor: string;
  mutedTextColor: string;
  headerTextColor: string;
  pageColor: string;
  background: 'light' | 'dark';
  fontFamily: string;
  headingFontFamily: string;
  fontSize: 'small' | 'medium' | 'large';
  lineHeight: number;
  nameSize: number;
  titleSize: number;
  sectionTitleSize: number;
  bodySize: number;
  sectionSpacing: number;
  blockSpacing: number;
  pagePadding: number;
  pageWidth: number;
  margins: 'compact' | 'normal';
  showBorders: boolean;
  borderWidth: number;
  showShadows: boolean;
  roundedCorners: boolean;
  radiusSize: number;
  presetLocked: boolean;
}
