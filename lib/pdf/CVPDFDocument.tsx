import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

type SectionId =
  | 'personal'
  | 'experience'
  | 'education'
  | 'skills'
  | 'languages'
  | 'certifications'
  | 'projects';

interface Props {
  cvData: CVDataLike;
  templateSlug?: string;
  templateConfig?: TemplateConfigLike;
  sectionVisibility?: Partial<Record<SectionId, boolean>>;
  sectionOrder?: SectionId[];
  sectionStyleOverrides?: Record<string, Record<string, string | number>>;
}

interface TemplateConfigLike {
  primaryColor?: string;
  textColor?: string;
  secondaryColor?: string;
  fontSize?: 'small' | 'medium' | 'large' | string;
  lineHeight?: number | string;
}

interface PersonalInfoLike {
  fullName?: string;
  jobTitle?: string;
  email?: string;
  phone?: string;
  address?: string;
  summary?: string;
}

interface ExperienceLike {
  id?: string;
  position?: string;
  company?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  description?: string[];
}

interface EducationLike {
  id?: string;
  degree?: string;
  field?: string;
  institution?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
}

interface SkillLike {
  id?: string;
  name?: string;
}

interface LanguageLike {
  id?: string;
  name?: string;
  proficiency?: string;
}

interface CertificationLike {
  id?: string;
  name?: string;
  issuer?: string;
  date?: string;
}

interface ProjectLike {
  id?: string;
  name?: string;
  role?: string;
  description?: string[];
}

interface CVDataLike {
  personalInfo?: PersonalInfoLike;
  experiences?: ExperienceLike[];
  education?: EducationLike[];
  skills?: SkillLike[];
  languages?: LanguageLike[];
  certifications?: CertificationLike[];
  projects?: ProjectLike[];
}

const DEFAULT_SECTION_ORDER: SectionId[] = [
  'personal',
  'experience',
  'education',
  'skills',
  'languages',
  'certifications',
  'projects'
];

const SECTION_TITLES: Record<SectionId, string> = {
  personal: 'البيانات الشخصية',
  experience: 'الخبرات المهنية',
  education: 'التعليم',
  skills: 'المهارات',
  languages: 'اللغات',
  certifications: 'الشهادات',
  projects: 'المشاريع'
};

const getTemplatePalette = (slug: string) => {
  const normalized = slug.toLowerCase().replace(/[-_\s]/g, '');
  switch (normalized) {
    case 'techmaster':
      return { primary: '#0f172a', accent: '#2563eb', muted: '#475569' };
    case 'academicelite':
      return { primary: '#1e3a8a', accent: '#1d4ed8', muted: '#334155' };
    case 'medicalpro':
      return { primary: '#14532d', accent: '#16a34a', muted: '#3f3f46' };
    case 'financeelite':
      return { primary: '#1f2937', accent: '#059669', muted: '#374151' };
    case 'legalexpert':
      return { primary: '#111827', accent: '#7c3aed', muted: '#374151' };
    case 'marketingguru':
      return { primary: '#9a3412', accent: '#f97316', muted: '#44403c' };
    case 'architectpro':
      return { primary: '#334155', accent: '#0ea5e9', muted: '#475569' };
    case 'hrpro':
      return { primary: '#7f1d1d', accent: '#ef4444', muted: '#374151' };
    case 'salesstar':
      return { primary: '#581c87', accent: '#a855f7', muted: '#4c1d95' };
    case 'globaledge':
      return { primary: '#0c4a6e', accent: '#0284c7', muted: '#1e293b' };
    case 'auroraprime':
      return { primary: '#0f172a', accent: '#14b8a6', muted: '#334155' };
    default:
      return { primary: '#111827', accent: '#2563eb', muted: '#475569' };
  }
};

const normalizeText = (value: unknown) => String(value ?? '').trim();
const toArray = <T,>(value: T[] | undefined | null): T[] => (Array.isArray(value) ? value : []);

const CVPDFDocument: React.FC<Props> = ({
  cvData,
  templateSlug = 'executive',
  templateConfig,
  sectionVisibility,
  sectionOrder,
  sectionStyleOverrides
}) => {
  const palette = getTemplatePalette(templateSlug);
  const accentColor = templateConfig?.primaryColor || palette.accent;
  const textColor = templateConfig?.textColor || palette.primary;
  const mutedColor = templateConfig?.secondaryColor || palette.muted;
  const fontSize =
    templateConfig?.fontSize === 'small' ? 10 : templateConfig?.fontSize === 'large' ? 12 : 11;
  const lineHeight = Number(templateConfig?.lineHeight || 1.45);

  const styles = StyleSheet.create({
    page: {
      paddingTop: 28,
      paddingBottom: 28,
      paddingHorizontal: 28,
      backgroundColor: '#ffffff',
      fontSize,
      lineHeight,
      color: textColor
    },
    header: {
      borderBottomWidth: 2,
      borderBottomColor: accentColor,
      paddingBottom: 10,
      marginBottom: 12
    },
    name: {
      fontSize: 22,
      fontWeight: 700,
      color: textColor
    },
    job: {
      marginTop: 3,
      fontSize: 13,
      color: mutedColor
    },
    contactLine: {
      marginTop: 4,
      fontSize: 10,
      color: mutedColor
    },
    section: {
      marginBottom: 10
    },
    sectionTitle: {
      fontSize: 12,
      fontWeight: 700,
      color: accentColor,
      marginBottom: 4,
      borderBottomWidth: 1,
      borderBottomColor: '#e2e8f0',
      paddingBottom: 2
    },
    itemTitle: {
      fontSize: 11,
      fontWeight: 700,
      color: textColor
    },
    itemMeta: {
      fontSize: 9,
      color: mutedColor,
      marginBottom: 2
    },
    bulletLine: {
      fontSize: 10,
      marginBottom: 1
    },
    chipWrap: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6
    },
    chip: {
      fontSize: 9,
      paddingVertical: 2,
      paddingHorizontal: 6,
      borderWidth: 1,
      borderColor: '#cbd5e1',
      borderRadius: 10,
      color: textColor
    }
  });

  const personalInfo = cvData?.personalInfo || {};
  const orderedSections = (sectionOrder?.length ? sectionOrder : DEFAULT_SECTION_ORDER).filter(
    (sectionId, index, arr) => arr.indexOf(sectionId) === index
  );
  const isVisible = (sectionId: SectionId) => sectionVisibility?.[sectionId] !== false;

  const dynamicSectionStyle = (sectionId: SectionId) => {
    const raw = sectionStyleOverrides?.[sectionId] || {};
    return {
      ...(raw.backgroundColor ? { backgroundColor: String(raw.backgroundColor) } : {}),
      ...(raw.borderColor
        ? {
            borderWidth: 1,
            borderColor: String(raw.borderColor),
            borderStyle: 'solid' as const
          }
        : {}),
      ...(raw.borderRadius ? { borderRadius: Number.parseInt(String(raw.borderRadius), 10) || 0 } : {}),
      ...(raw.padding ? { padding: Number.parseInt(String(raw.padding), 10) || 0 } : {})
    };
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{normalizeText(personalInfo.fullName) || 'CV'}</Text>
          {normalizeText(personalInfo.jobTitle) ? <Text style={styles.job}>{personalInfo.jobTitle}</Text> : null}
          <Text style={styles.contactLine}>
            {[personalInfo.email, personalInfo.phone, personalInfo.address]
              .map((value: unknown) => normalizeText(value))
              .filter(Boolean)
              .join(' | ')}
          </Text>
        </View>

        {orderedSections.map((sectionId) => {
          if (!isVisible(sectionId)) return null;

          if (sectionId === 'personal') {
            const summary = normalizeText(personalInfo.summary);
            if (!summary) return null;
            return (
              <View key={sectionId} style={[styles.section, dynamicSectionStyle(sectionId)]}>
                <Text style={styles.sectionTitle}>{SECTION_TITLES.personal}</Text>
                <Text>{summary}</Text>
              </View>
            );
          }

          if (sectionId === 'experience') {
            const experiences = toArray<ExperienceLike>(cvData?.experiences);
            if (!experiences.length) return null;
            return (
              <View key={sectionId} style={[styles.section, dynamicSectionStyle(sectionId)]}>
                <Text style={styles.sectionTitle}>{SECTION_TITLES.experience}</Text>
                {experiences.map((exp) => (
                  <View key={exp.id || `${exp.position}-${exp.company}`} style={{ marginBottom: 6 }}>
                    <Text style={styles.itemTitle}>{normalizeText(exp.position)}</Text>
                    <Text style={styles.itemMeta}>
                      {[normalizeText(exp.company), normalizeText(exp.location), `${normalizeText(exp.startDate)} - ${exp.current ? 'Present' : normalizeText(exp.endDate)}`]
                        .filter(Boolean)
                        .join(' | ')}
                    </Text>
                    {toArray<string>(exp.description).map((line, idx) => (
                      <Text key={idx} style={styles.bulletLine}>
                        - {normalizeText(line)}
                      </Text>
                    ))}
                  </View>
                ))}
              </View>
            );
          }

          if (sectionId === 'education') {
            const education = toArray<EducationLike>(cvData?.education);
            if (!education.length) return null;
            return (
              <View key={sectionId} style={[styles.section, dynamicSectionStyle(sectionId)]}>
                <Text style={styles.sectionTitle}>{SECTION_TITLES.education}</Text>
                {education.map((edu) => (
                  <View key={edu.id || `${edu.degree}-${edu.institution}`} style={{ marginBottom: 6 }}>
                    <Text style={styles.itemTitle}>
                      {[normalizeText(edu.degree), normalizeText(edu.field)].filter(Boolean).join(' - ')}
                    </Text>
                    <Text style={styles.itemMeta}>
                      {[normalizeText(edu.institution), `${normalizeText(edu.startDate)} - ${edu.current ? 'Present' : normalizeText(edu.endDate)}`]
                        .filter(Boolean)
                        .join(' | ')}
                    </Text>
                  </View>
                ))}
              </View>
            );
          }

          if (sectionId === 'skills') {
            const skills = toArray<SkillLike>(cvData?.skills);
            if (!skills.length) return null;
            return (
              <View key={sectionId} style={[styles.section, dynamicSectionStyle(sectionId)]}>
                <Text style={styles.sectionTitle}>{SECTION_TITLES.skills}</Text>
                <View style={styles.chipWrap}>
                  {skills.map((skill) => (
                    <Text key={skill.id || skill.name} style={styles.chip}>
                      {normalizeText(skill.name)}
                    </Text>
                  ))}
                </View>
              </View>
            );
          }

          if (sectionId === 'languages') {
            const languages = toArray<LanguageLike>(cvData?.languages);
            if (!languages.length) return null;
            return (
              <View key={sectionId} style={[styles.section, dynamicSectionStyle(sectionId)]}>
                <Text style={styles.sectionTitle}>{SECTION_TITLES.languages}</Text>
                {languages.map((lang) => (
                  <Text key={lang.id || lang.name} style={styles.bulletLine}>
                    - {[normalizeText(lang.name), normalizeText(lang.proficiency)].filter(Boolean).join(' - ')}
                  </Text>
                ))}
              </View>
            );
          }

          if (sectionId === 'certifications') {
            const certifications = toArray<CertificationLike>(cvData?.certifications);
            if (!certifications.length) return null;
            return (
              <View key={sectionId} style={[styles.section, dynamicSectionStyle(sectionId)]}>
                <Text style={styles.sectionTitle}>{SECTION_TITLES.certifications}</Text>
                {certifications.map((cert) => (
                  <Text key={cert.id || cert.name} style={styles.bulletLine}>
                    - {[normalizeText(cert.name), normalizeText(cert.issuer), normalizeText(cert.date)].filter(Boolean).join(' | ')}
                  </Text>
                ))}
              </View>
            );
          }

          if (sectionId === 'projects') {
            const projects = toArray<ProjectLike>(cvData?.projects);
            if (!projects.length) return null;
            return (
              <View key={sectionId} style={[styles.section, dynamicSectionStyle(sectionId)]}>
                <Text style={styles.sectionTitle}>{SECTION_TITLES.projects}</Text>
                {projects.map((project) => (
                  <View key={project.id || project.name} style={{ marginBottom: 6 }}>
                    <Text style={styles.itemTitle}>
                      {[normalizeText(project.name), normalizeText(project.role)].filter(Boolean).join(' - ')}
                    </Text>
                    {toArray<string>(project.description).map((line, idx) => (
                      <Text key={idx} style={styles.bulletLine}>
                        - {normalizeText(line)}
                      </Text>
                    ))}
                  </View>
                ))}
              </View>
            );
          }

          return null;
        })}
      </Page>
    </Document>
  );
};

export default CVPDFDocument;
