'use client';

import { createContext, useContext } from 'react';
import { CVData } from '@/components/cvs/types';
import { TemplateConfig } from '@/lib/types/template-config';

interface PremiumTemplateProps {
  data: CVData;
  config?: TemplateConfig;
  styleOverrides?: Record<string, Record<string, string | number>>;
  sectionVisibility?: Record<string, boolean>;
  sectionStyles?: Record<string, Record<string, string | number>>;
  sectionOrder?: string[];
}

function useTheme(config?: TemplateConfig) {
  const primary = config?.primaryColor || '#2563eb';
  const secondary = config?.secondaryColor || '#4f46e5';
  const heading = config?.headingColor || '#0f172a';
  const text = config?.textColor || '#334155';
  const muted = config?.mutedTextColor || '#64748b';
  const headerText = config?.headerTextColor || '#ffffff';
  const font = config?.fontFamily || '"Segoe UI", Tahoma, Arial, sans-serif';
  const headingFont = config?.headingFontFamily || font;
  return { primary, secondary, heading, text, muted, headerText, font, headingFont };
}

const hasText = (value?: string | null) => Boolean(value && value.trim().length > 0);
const dateRange = (start?: string, end?: string, current?: boolean) =>
  `${start || '-'} - ${current ? 'Present' : end || '-'}`;
const isRTLText = (value?: string | null) => {
  if (!hasText(value)) return false;
  const text = value!.trim();
  const rtlChar = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
  const ltrChar = /[A-Za-z]/;
  for (const char of text) {
    if (rtlChar.test(char)) return true;
    if (ltrChar.test(char)) return false;
  }
  return false;
};
const sectionVisible = (sectionVisibility: PremiumTemplateProps['sectionVisibility'], sectionId: string) =>
  sectionVisibility?.[sectionId] !== false;
const SectionStylesContext = createContext<Record<string, Record<string, string | number>>>({});
const SectionOrderContext = createContext<string[]>([]);
const useSectionStyles = () => useContext(SectionStylesContext);
const useSectionOrder = () => useContext(SectionOrderContext);
const TEXT_WRAP_STYLE: Record<string, string | number> = {
  overflowWrap: 'anywhere',
  wordBreak: 'break-word',
  whiteSpace: 'normal',
  maxWidth: '100%'
};
const sectionStyleFor = (
  sectionStyles: Record<string, Record<string, string | number>>,
  sectionOrder: string[],
  sectionId: string,
  base: Record<string, string | number> = {}
) => {
  const order = sectionOrder.indexOf(sectionId);
  return {
    minWidth: 0,
    maxWidth: '100%',
    ...base,
    ...(sectionStyles[sectionId] || {}),
    order: order === -1 ? 999 : order
  };
};
const styleFor = (
  styleOverrides: PremiumTemplateProps['styleOverrides'],
  key: string,
  base: Record<string, string | number> = {}
) => ({ ...TEXT_WRAP_STYLE, ...base, ...(styleOverrides?.[key] || {}) });
const mergeStyles = (
  styleOverrides: PremiumTemplateProps['styleOverrides'],
  keys: string[],
  base: Record<string, string | number> = {}
) =>
  keys.reduce((acc, key) => ({ ...acc, ...(styleOverrides?.[key] || {}) }), { ...TEXT_WRAP_STYLE, ...base });

function buildAtsSectionStyle(
  config: TemplateConfig | undefined,
  primary: string,
  secondary: string
): Record<string, string | number> {
  const sectionSpacing = config?.sectionSpacing || 18;
  const blockSpacing = config?.blockSpacing || 10;
  const borderWidth = Math.max(1, Math.min(2, config?.borderWidth || 1));
  const radius = config?.roundedCorners === false ? 0 : Math.max(6, Math.min(14, config?.radiusSize || 10));
  const showBorders = config?.showBorders !== false;
  const showShadows = config?.showShadows !== false;
  const accent = config?.presetLocked ? secondary : primary;
  return {
    border: showBorders ? `${borderWidth}px solid ${accent}2b` : '0',
    borderTop: showBorders ? `${Math.max(2, borderWidth)}px solid ${accent}` : '0',
    background: '#ffffff',
    borderRadius: radius,
    minWidth: 0,
    maxWidth: '100%',
    padding: `${Math.max(10, blockSpacing)}px ${Math.max(11, blockSpacing + 2)}px`,
    marginBottom: `${Math.max(8, sectionSpacing / 2)}px`,
    boxShadow: showShadows ? '0 1px 3px rgba(15,23,42,0.05)' : 'none'
  };
}

function ProfileAvatar({
  image,
  size = 72,
  ringColor = 'rgba(255,255,255,0.45)'
}: {
  image?: string;
  size?: number;
  ringColor?: string;
}) {
  void image;
  void size;
  void ringColor;
  return (
    null
  );
}

function HeaderBlock({
  data,
  config,
  styleOverrides,
  sectionVisibility,
  compact = false
}: PremiumTemplateProps & { compact?: boolean }) {
  const t = useTheme(config);
  const sectionStyles = useSectionStyles();
  const sectionOrder = useSectionOrder();
  if (!sectionVisible(sectionVisibility, 'personal')) return null;
  const isNameRTL = isRTLText(data.personalInfo.fullName);
  const headerDir = isNameRTL ? 'rtl' : 'ltr';
  return (
    <div
      className={compact ? 'p-6' : 'p-8'}
      style={sectionStyleFor(sectionStyles, sectionOrder, 'personal', {
        background: '#ffffff',
        color: t.heading,
        borderTop: `5px solid ${t.primary}`,
        borderBottom: `1px solid ${t.primary}2f`
      })}
    >
      <div className="flex items-center gap-4 min-w-0" style={{ flexDirection: isNameRTL ? 'row-reverse' : 'row' }}>
        <ProfileAvatar image={data.personalInfo.profileImage} size={compact ? 58 : 72} />
        <div className="min-w-0 flex-1" dir={headerDir} style={{ textAlign: isNameRTL ? 'right' : 'left' }}>
          <h1
            dir="auto"
            style={styleFor(styleOverrides, 'fullName', {
              fontSize: `${config?.nameSize || 36}px`,
              fontFamily: t.headingFont,
              fontWeight: 800,
              letterSpacing: '0.01em'
            })}
          >
            {data.personalInfo.fullName || 'Your Name'}
          </h1>
          <p
            dir="auto"
            style={styleFor(styleOverrides, 'jobTitle', { fontSize: `${config?.titleSize || 17}px`, color: t.primary, fontWeight: 600 })}
          >
            {data.personalInfo.jobTitle || 'Job Title'}
          </p>
          <p
            dir="auto"
            className="mt-2 text-sm"
            style={mergeStyles(styleOverrides, ['email', 'phone', 'address'], { color: t.muted })}
          >
            {[data.personalInfo.email, data.personalInfo.phone, data.personalInfo.address].filter(hasText).join(' | ')}
          </p>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ children, config }: { children: string; config?: TemplateConfig }) {
  const t = useTheme(config);
  return (
    <h2
      className="mb-3 pb-2.5 border-b"
      style={{
        borderColor: `${t.primary}50`,
        color: t.heading,
        fontFamily: t.headingFont,
        fontWeight: 700,
        fontSize: `${config?.sectionTitleSize || 15}px`,
        letterSpacing: '0.01em'
      }}
    >
      {children}
    </h2>
  );
}

function Summary({ data, config, styleOverrides, sectionVisibility }: PremiumTemplateProps) {
  const t = useTheme(config);
  const sectionStyles = useSectionStyles();
  const sectionOrder = useSectionOrder();
  if (!sectionVisible(sectionVisibility, 'personal')) return null;
  if (!hasText(data.personalInfo.summary)) return null;
  return (
    <section
      data-pdf-block="summary-section"
      style={sectionStyleFor(
        sectionStyles,
        sectionOrder,
        'personal',
        buildAtsSectionStyle(config, t.primary, t.secondary)
      )}
    >
      <SectionTitle config={config}>Professional Summary</SectionTitle>
      <p
        dir="auto"
        style={styleFor(styleOverrides, 'summary', {
          color: t.text,
          fontSize: `${config?.bodySize || 11}px`,
          lineHeight: config?.lineHeight || 1.6,
          margin: 0
        })}
      >
        {data.personalInfo.summary}
      </p>
    </section>
  );
}

function Experience({
  data,
  config,
  styleOverrides,
  sectionVisibility,
  title = 'Experience'
}: PremiumTemplateProps & { title?: string }) {
  const t = useTheme(config);
  const sectionStyles = useSectionStyles();
  const sectionOrder = useSectionOrder();
  if (!sectionVisible(sectionVisibility, 'experience')) return null;
  if (!data.experiences.length) return null;
  return (
    <section
      data-pdf-block="experience-section"
      style={sectionStyleFor(
        sectionStyles,
        sectionOrder,
        'experience',
        buildAtsSectionStyle(config, t.primary, t.secondary)
      )}
    >
      <SectionTitle config={config}>{title}</SectionTitle>
      <div className="space-y-3">
        {data.experiences.map((exp) => (
          <article
            key={exp.id}
            data-pdf-block="experience-item"
            className="rounded-lg border p-3.5"
            style={{ borderColor: `${t.primary}24`, background: '#ffffff' }}
          >
            <div className="flex items-start justify-between gap-4 min-w-0">
              <div className="min-w-0 flex-1">
                <h3
                  dir="auto"
                  style={styleFor(styleOverrides, `exp-${exp.id}-position`, {
                    color: t.heading,
                    fontFamily: t.headingFont,
                    fontWeight: 700
                  })}
                >
                  {exp.position}
                </h3>
                <p
                  dir="auto"
                  style={styleFor(styleOverrides, `exp-${exp.id}-company`, {
                    color: t.primary,
                    fontSize: `${Math.max((config?.bodySize || 11) - 1, 10)}px`
                  })}
                >
                  {[exp.company, exp.location].filter(hasText).join(' - ')}
                </p>
              </div>
              <span
                className="px-2 py-1 rounded-md shrink-0"
                style={styleFor(styleOverrides, `exp-${exp.id}-date`, {
                  color: t.muted,
                  fontSize: '12px',
                  background: `${t.primary}12`
                })}
              >
                {dateRange(exp.startDate, exp.endDate, exp.current)}
              </span>
            </div>
            {exp.description?.filter(Boolean).length ? (
              <ul className="mt-2 space-y-1 list-disc pl-5" style={{ fontSize: `${config?.bodySize || 11}px`, color: t.text }}>
                {exp.description.filter(Boolean).map((line, idx) => (
                  <li key={idx} dir="auto" style={styleFor(styleOverrides, `exp-${exp.id}-desc-${idx}`)}>
                    {line}
                  </li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

function Education({ data, config, styleOverrides, sectionVisibility }: PremiumTemplateProps) {
  const t = useTheme(config);
  const sectionStyles = useSectionStyles();
  const sectionOrder = useSectionOrder();
  if (!sectionVisible(sectionVisibility, 'education')) return null;
  if (!data.education.length) return null;
  return (
    <section
      data-pdf-block="education-section"
      style={sectionStyleFor(
        sectionStyles,
        sectionOrder,
        'education',
        buildAtsSectionStyle(config, t.primary, t.secondary)
      )}
    >
      <SectionTitle config={config}>Education</SectionTitle>
      <div className="space-y-3">
        {data.education.map((e) => (
          <article
            key={e.id}
            data-pdf-block="education-item"
            className="rounded-lg border p-3"
            style={{ borderColor: `${t.primary}22`, background: '#ffffff' }}
          >
            <h3
              dir="auto"
              style={styleFor(styleOverrides, `edu-${e.id}-degree`, {
                color: t.heading,
                fontFamily: t.headingFont,
                fontWeight: 700
              })}
            >
              {e.degree}
            </h3>
            <p dir="auto" style={styleFor(styleOverrides, `edu-${e.id}-institution`, { color: t.primary })}>
              {e.institution}
            </p>
            <p style={styleFor(styleOverrides, `edu-${e.id}-date`, { color: t.muted, fontSize: '12px' })}>
              {dateRange(e.startDate, e.endDate, e.current)}
            </p>
            {hasText(e.field) && <p dir="auto" style={{ color: t.text, fontSize: '13px' }}>{e.field}</p>}
          </article>
        ))}
      </div>
    </section>
  );
}

function Skills({ data, config, sectionVisibility, title = 'Skills' }: PremiumTemplateProps & { title?: string }) {
  const t = useTheme(config);
  const sectionStyles = useSectionStyles();
  const sectionOrder = useSectionOrder();
  const getLevelLabel = (level: number) => {
    if (level >= 5) return 'Expert';
    if (level >= 4) return 'Advanced';
    if (level >= 3) return 'Intermediate';
    if (level >= 2) return 'Basic';
    return 'Beginner';
  };
  if (!sectionVisible(sectionVisibility, 'skills')) return null;
  if (!data.skills.length) return null;
  return (
    <section
      data-pdf-block="skills-section"
      style={sectionStyleFor(
        sectionStyles,
        sectionOrder,
        'skills',
        buildAtsSectionStyle(config, t.primary, t.secondary)
      )}
    >
      <SectionTitle config={config}>{title}</SectionTitle>
      <div className="space-y-2.5">
        {data.skills.map((s) => (
          <div
            key={s.id}
            data-pdf-block="skills-item"
            className="rounded-lg border p-2.5 text-sm bg-white"
            style={{ borderColor: `${t.primary}22` }}
          >
            <div className="flex items-center justify-between gap-2 min-w-0">
              <span dir="auto" className="font-medium min-w-0 flex-1" style={TEXT_WRAP_STYLE}>{s.name}</span>
              <span className="shrink-0" style={{ color: t.primary, fontWeight: 700 }}>{s.level}/5</span>
            </div>
            <div className="mt-1.5 text-[11px]" style={{ color: t.muted }}>
              {getLevelLabel(s.level)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Languages({ data, config, sectionVisibility }: PremiumTemplateProps) {
  const t = useTheme(config);
  const sectionStyles = useSectionStyles();
  const sectionOrder = useSectionOrder();
  if (!sectionVisible(sectionVisibility, 'languages')) return null;
  if (!data.languages.length) return null;
  return (
    <section
      data-pdf-block="languages-section"
      style={sectionStyleFor(
        sectionStyles,
        sectionOrder,
        'languages',
        buildAtsSectionStyle(config, t.primary, t.secondary)
      )}
    >
      <SectionTitle config={config}>Languages</SectionTitle>
      <div className="space-y-2">
        {data.languages.map((lang) => (
          <div key={lang.id} className="flex items-center justify-between text-sm gap-2 min-w-0">
            <span dir="auto" className="min-w-0 flex-1" style={TEXT_WRAP_STYLE}>{lang.name}</span>
            <span dir="auto" className="shrink-0" style={{ color: t.muted }}>{lang.proficiency}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Certifications({ data, config, sectionVisibility }: PremiumTemplateProps) {
  const t = useTheme(config);
  const sectionStyles = useSectionStyles();
  const sectionOrder = useSectionOrder();
  if (!sectionVisible(sectionVisibility, 'certifications')) return null;
  if (!data.certifications.length) return null;
  return (
    <section
      data-pdf-block="certifications-section"
      style={sectionStyleFor(
        sectionStyles,
        sectionOrder,
        'certifications',
        buildAtsSectionStyle(config, t.primary, t.secondary)
      )}
    >
      <SectionTitle config={config}>Certifications</SectionTitle>
      <div className="space-y-3">
        {data.certifications.map((c) => (
          <article
            key={c.id}
            data-pdf-block="certification-item"
            className="text-sm rounded-md border p-2.5"
            style={{ borderColor: `${t.primary}20` }}
          >
            <h3 dir="auto" style={{ color: t.heading, fontFamily: t.headingFont, fontWeight: 700 }}>{c.name}</h3>
            <p dir="auto" style={{ color: t.primary }}>{c.issuer}</p>
            <p style={{ color: t.muted, fontSize: '12px' }}>
              {c.date}
              {!c.doesNotExpire && hasText(c.expiryDate) ? ` - ${c.expiryDate}` : ''}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Projects({ data, config, sectionVisibility }: PremiumTemplateProps) {
  const t = useTheme(config);
  const sectionStyles = useSectionStyles();
  const sectionOrder = useSectionOrder();
  if (!sectionVisible(sectionVisibility, 'projects')) return null;
  if (!data.projects.length) return null;
  return (
    <section
      data-pdf-block="projects-section"
      style={sectionStyleFor(
        sectionStyles,
        sectionOrder,
        'projects',
        buildAtsSectionStyle(config, t.primary, t.secondary)
      )}
    >
      <SectionTitle config={config}>Projects</SectionTitle>
      <div className="space-y-3">
        {data.projects.map((p) => (
          <article
            key={p.id}
            data-pdf-block="project-item"
            className="rounded-lg border p-3.5 bg-white"
            style={{ borderColor: `${t.primary}22` }}
          >
            <div className="flex items-start justify-between gap-4 min-w-0">
              <h3 dir="auto" className="min-w-0 flex-1" style={{ ...TEXT_WRAP_STYLE, color: t.heading, fontFamily: t.headingFont, fontWeight: 700 }}>{p.name}</h3>
              <span className="shrink-0" style={{ color: t.muted, fontSize: '12px' }}>{dateRange(p.startDate, p.endDate, p.current)}</span>
            </div>
            {p.description?.filter(Boolean).length ? (
              <ul className="mt-2 space-y-1 text-sm list-disc pl-5" style={{ color: t.text }}>
                {p.description.filter(Boolean).map((line, idx) => (
                  <li key={idx} dir="auto">{line}</li>
                ))}
              </ul>
            ) : null}
            {p.technologies?.length ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {p.technologies.map((tech) => (
                  <span key={tech} className="text-xs px-2 py-1 rounded-full" style={{ background: `${t.primary}16`, color: t.primary }}>
                    {tech}
                  </span>
                ))}
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

export function ExecutiveProTemplate({ data, config, styleOverrides, sectionVisibility, sectionStyles, sectionOrder }: PremiumTemplateProps) {
  const t = useTheme(config);
  const isNameRTL = isRTLText(data.personalInfo.fullName);
  const headerDir = isNameRTL ? 'rtl' : 'ltr';
  const showPersonalHeader = sectionVisible(sectionVisibility, 'personal');
  const hasSkills = sectionVisible(sectionVisibility, 'skills') && data.skills.length > 0;
  const hasLanguages = sectionVisible(sectionVisibility, 'languages') && data.languages.length > 0;
  const hasCertifications = sectionVisible(sectionVisibility, 'certifications') && data.certifications.length > 0;
  return (
    <SectionStylesContext.Provider value={sectionStyles || {}}>
      <SectionOrderContext.Provider value={sectionOrder || []}>
    <div style={{ fontFamily: t.font, color: t.text }} className="bg-white">
      <div className="flex flex-col">
        {showPersonalHeader && (
          <section
            className="w-full px-8 py-7 border-b"
            style={sectionStyleFor(sectionStyles || {}, sectionOrder || [], 'personal', {
              background: '#ffffff',
              color: t.heading,
              borderColor: `${t.primary}35`,
              borderTop: `6px solid ${t.primary}`
            })}
          >
            <div
              className="max-w-5xl mx-auto w-full"
            >
              <div
                className="flex items-start justify-between gap-4"
                style={{
                  flexDirection: isNameRTL ? 'row-reverse' : 'row'
                }}
              >
                <div dir={headerDir} style={{ textAlign: isNameRTL ? 'right' : 'left' }} className="space-y-2">
                  <h1
                    dir="auto"
                    style={styleFor(styleOverrides, 'fullName', {
                      fontFamily: t.headingFont,
                      fontSize: `${config?.nameSize || 34}px`,
                      fontWeight: 800,
                      lineHeight: 1.1
                    })}
                  >
                    {data.personalInfo.fullName || 'Your Name'}
                  </h1>
                  <p dir="auto" className="text-base opacity-95" style={styleFor(styleOverrides, 'jobTitle')}>
                    {data.personalInfo.jobTitle || 'Executive Role'}
                  </p>
                </div>

                <div className="text-sm text-right" dir="auto" style={mergeStyles(styleOverrides, ['email', 'phone', 'address'], { color: t.muted })}>
                  {[data.personalInfo.email, data.personalInfo.phone, data.personalInfo.address]
                    .filter(hasText)
                    .join(' | ')}
                </div>
              </div>

              <div
                className="mt-4 grid grid-cols-3 gap-3"
                style={{
                  direction: isNameRTL ? 'rtl' : 'ltr'
                }}
              >
                <div className="rounded-lg px-3 py-2 text-center border bg-white" style={{ borderColor: `${t.primary}2f` }}>
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">Experience</p>
                  <p className="font-bold">{data.experiences.length}</p>
                </div>
                <div className="rounded-lg px-3 py-2 text-center border bg-white" style={{ borderColor: `${t.primary}2f` }}>
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">Projects</p>
                  <p className="font-bold">{data.projects.length}</p>
                </div>
                <div className="rounded-lg px-3 py-2 text-center border bg-white" style={{ borderColor: `${t.primary}2f` }}>
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">Skills</p>
                  <p className="font-bold">{data.skills.length}</p>
                </div>
              </div>
            </div>
          </section>
        )}

        <div className="flex-1 p-6 md:p-7 grid grid-cols-1 xl:grid-cols-12 gap-5">
          <aside className="xl:col-span-4 flex flex-col gap-6">
            {hasSkills && (
              <div
                data-pdf-block="executive-side-skills"
                className="rounded-lg p-4 border bg-white"
                style={{ borderColor: `${t.primary}2f` }}
              >
                <Skills data={data} config={config} sectionVisibility={sectionVisibility} title="Core Competencies" />
              </div>
            )}
            {(hasLanguages || hasCertifications) && (
              <div
                data-pdf-block="executive-side-langs-certs"
                className="rounded-lg p-4 border bg-white"
                style={{ borderColor: `${t.secondary}2b` }}
              >
                <Languages data={data} config={config} sectionVisibility={sectionVisibility} />
                <div className="mt-4">
                  <Certifications data={data} config={config} sectionVisibility={sectionVisibility} />
                </div>
              </div>
            )}
          </aside>

          <main className="xl:col-span-8 flex flex-col gap-5">
            <Summary data={data} config={config} styleOverrides={styleOverrides} sectionVisibility={sectionVisibility} />
            <Experience data={data} config={config} styleOverrides={styleOverrides} sectionVisibility={sectionVisibility} title="Leadership Experience" />
            <Education data={data} config={config} styleOverrides={styleOverrides} sectionVisibility={sectionVisibility} />
            <Projects data={data} config={config} sectionVisibility={sectionVisibility} />
          </main>
        </div>
      </div>
    </div>
      </SectionOrderContext.Provider>
    </SectionStylesContext.Provider>
  );
}

export function BoardroomEliteTemplate({ data, config, styleOverrides, sectionVisibility, sectionStyles, sectionOrder }: PremiumTemplateProps) {
  void config;
  void styleOverrides;
  void sectionStyles;
  void sectionOrder;

  const name = data.personalInfo.fullName || 'Lorna Alvarado';
  const title = data.personalInfo.jobTitle || 'Marketing Manager';
  const summary =
    data.personalInfo.summary ||
    'A results-driven professional with experience in planning, communication, and strategic execution.';
  const exp = data.experiences.slice(0, 3);
  const edu = data.education.slice(0, 2);
  const skills = data.skills.slice(0, 6);
  const refs = [
    { name: 'Marilyn Koelyn', role: 'Manager', phone: '+123-456-7890' },
    { name: 'Dakley Dupont', role: 'Supervisor', phone: '+123-456-7891' }
  ];

  return (
    <SectionStylesContext.Provider value={sectionStyles || {}}>
      <SectionOrderContext.Provider value={sectionOrder || []}>
        <div className="bg-[#eef2f7] p-5">
          <div className="mx-auto w-[840px] h-[1188px] bg-white rounded-[14px] border border-[#d6dbe4] overflow-hidden">
            <div className="grid h-full" style={{ gridTemplateColumns: '32% 68%', fontFamily: '"Poppins","Segoe UI",Arial,sans-serif' }}>
              <aside className="bg-[#f7f9fc] border-r border-[#d9dfeb] px-5 py-6">
                <h1 className="text-[28px] font-extrabold text-[#6f8fb8] leading-[0.95] break-words">{name}</h1>
                <p className="text-[10px] text-[#8ea0bb] mt-1">{title}</p>
                <div className="mt-4 h-[82px] w-[82px] rounded-full overflow-hidden border-[4px] border-[#d6dde9] bg-[#c8d1df]">
                  {data.personalInfo.profileImage ? (
                    <div className="h-full w-full" style={{ backgroundImage: `url(${data.personalInfo.profileImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                  ) : null}
                </div>

                <section className="mt-5 pt-3 border-t border-[#cbd4e2]">
                  <h4 className="text-[11px] font-semibold text-[#49566d] mb-1.5">Contact</h4>
                  <p className="text-[8px] text-[#6a7486] break-words">{data.personalInfo.phone || '+123-456-7890'}</p>
                  <p className="text-[8px] text-[#6a7486] break-words mt-1">{data.personalInfo.email || 'hello@reallygreatsite.com'}</p>
                  <p className="text-[8px] text-[#6a7486] break-words mt-1">{data.personalInfo.address || '123 Anywhere St., Any City'}</p>
                </section>

                <section className="mt-5 pt-3 border-t border-[#cbd4e2]">
                  <h4 className="text-[11px] font-semibold text-[#49566d] mb-1.5">About Me</h4>
                  <p className="text-[8px] leading-[1.35] text-[#6a7486] break-words">{summary}</p>
                </section>

                <section className="mt-5 pt-3 border-t border-[#cbd4e2]">
                  <h4 className="text-[11px] font-semibold text-[#49566d] mb-1.5">Skills</h4>
                  <ul className="space-y-1">
                    {skills.map((s) => (
                      <li key={s.id} className="text-[8px] text-[#6a7486] break-words">• {s.name}</li>
                    ))}
                  </ul>
                </section>
              </aside>

              <main className="px-6 py-6 text-[#4b5567]">
                <section className="mb-4">
                  <h3 className="text-[12px] font-semibold text-[#495060] mb-2">Education</h3>
                  <div className="space-y-2">
                    {edu.map((e) => (
                      <div key={e.id}>
                        <p className="text-[8.4px] font-semibold text-[#4c5565] break-words">{e.degree}</p>
                        <p className="text-[7.8px] text-[#6c7584] break-words">{e.institution}</p>
                        <p className="text-[7px] text-[#9098a6]">{e.startDate} - {e.current ? 'Present' : e.endDate || '-'}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="mb-4 pt-3 border-t border-[#cfd6e2]">
                  <h3 className="text-[12px] font-semibold text-[#495060] mb-2">Experience</h3>
                  <div className="space-y-2">
                    {exp.map((x) => (
                      <div key={x.id}>
                        <p className="text-[8.4px] font-semibold text-[#4c5565] break-words">{x.position}</p>
                        <p className="text-[7.8px] text-[#6c7584] break-words">{x.company}</p>
                        <p className="text-[7px] text-[#9098a6]">{x.startDate} - {x.current ? 'Present' : x.endDate || '-'}</p>
                        <p className="text-[7.5px] text-[#6a7486] mt-0.5 break-words">{x.description.filter(Boolean).slice(0, 1).join(' ')}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="pt-3 border-t border-[#cfd6e2]">
                  <h3 className="text-[12px] font-semibold text-[#495060] mb-2">References</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {refs.map((r) => (
                      <div key={r.name}>
                        <p className="text-[8px] font-semibold text-[#4c5565]">{r.name}</p>
                        <p className="text-[7px] text-[#6c7584]">{r.role}</p>
                        <p className="text-[6.8px] text-[#9098a6]">{r.phone}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </main>
            </div>
          </div>
        </div>
      </SectionOrderContext.Provider>
    </SectionStylesContext.Provider>
  );
}

export function TechMasterProTemplate({ data, config, styleOverrides, sectionVisibility, sectionStyles, sectionOrder }: PremiumTemplateProps) {
  const t = useTheme(config);
  const hasSkills = sectionVisible(sectionVisibility, 'skills') && data.skills.length > 0;
  const hasLanguages = sectionVisible(sectionVisibility, 'languages') && data.languages.length > 0;
  const hasCertifications = sectionVisible(sectionVisibility, 'certifications') && data.certifications.length > 0;
  return (
    <SectionStylesContext.Provider value={sectionStyles || {}}>
      <SectionOrderContext.Provider value={sectionOrder || []}>
    <div style={{ fontFamily: t.font, color: t.text }} className="bg-white">
      <HeaderBlock data={data} config={config} styleOverrides={styleOverrides} sectionVisibility={sectionVisibility} compact />
      <div className="p-6 grid grid-cols-12 gap-6">
        <main className="col-span-8 flex flex-col gap-5">
          <Summary data={data} config={config} styleOverrides={styleOverrides} sectionVisibility={sectionVisibility} />
          <Experience data={data} config={config} styleOverrides={styleOverrides} sectionVisibility={sectionVisibility} title="Engineering Experience" />
          <Projects data={data} config={config} sectionVisibility={sectionVisibility} />
        </main>
        <aside className="col-span-4 flex flex-col gap-5">
          {hasSkills && (
            <section data-pdf-block="tech-stack-matrix" className="rounded-md border p-4 bg-white" style={{ borderColor: `${t.primary}30` }}>
              <SectionTitle config={config}>Stack Proficiency</SectionTitle>
              <div className="grid grid-cols-1 gap-2.5">
                {data.skills.map((s) => (
                  <div key={s.id} className="rounded-md p-2.5 border" style={{ borderColor: `${t.secondary}30` }}>
                    <div className="flex justify-between text-xs mb-1">
                      <span>{s.name}</span>
                      <span style={{ color: t.primary }}>{s.level}/5</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${(s.level / 5) * 100}%`, background: t.primary }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
          <Education data={data} config={config} styleOverrides={styleOverrides} sectionVisibility={sectionVisibility} />
          {(hasLanguages || hasCertifications) && (
            <div className="flex flex-col gap-5">
              <Languages data={data} config={config} sectionVisibility={sectionVisibility} />
              <Certifications data={data} config={config} sectionVisibility={sectionVisibility} />
            </div>
          )}
        </aside>
      </div>
    </div>
      </SectionOrderContext.Provider>
    </SectionStylesContext.Provider>
  );
}

export function AcademicEliteProTemplate({ data, config, styleOverrides, sectionVisibility, sectionStyles, sectionOrder }: PremiumTemplateProps) {
  const t = useTheme(config);
  const isNameRTL = isRTLText(data.personalInfo.fullName);
  const headerDir = isNameRTL ? 'rtl' : 'ltr';
  const showPersonalHeader = sectionVisible(sectionVisibility, 'personal');
  return (
    <SectionStylesContext.Provider value={sectionStyles || {}}>
      <SectionOrderContext.Provider value={sectionOrder || []}>
    <div style={{ fontFamily: t.font, color: t.text }} className="bg-white">
      {showPersonalHeader && (
        <div className="p-8 border-b-4" style={sectionStyleFor(sectionStyles || {}, sectionOrder || [], 'personal', { borderColor: `${t.primary}33` })}>
        <div
          className="flex items-center gap-4"
          style={{
            flexDirection: isNameRTL ? 'row-reverse' : 'row',
            justifyContent: isNameRTL ? 'flex-end' : 'flex-start'
          }}
        >
          <ProfileAvatar image={data.personalInfo.profileImage} size={70} ringColor={`${t.primary}66`} />
          <div dir={headerDir} style={{ textAlign: isNameRTL ? 'right' : 'left' }}>
            <h1
              dir="auto"
              style={styleFor(styleOverrides, 'fullName', {
                fontFamily: t.headingFont,
                fontSize: `${config?.nameSize || 34}px`,
                fontWeight: 800,
                color: t.heading
              })}
            >
              {data.personalInfo.fullName || 'Your Name'}
            </h1>
            <p dir="auto" style={styleFor(styleOverrides, 'jobTitle', { color: t.primary })}>
              {data.personalInfo.jobTitle || 'Academic Profile'}
            </p>
          </div>
        </div>
        </div>
      )}
      <div className="p-8 grid grid-cols-3 gap-7">
        <aside className="col-span-1 flex flex-col gap-6 border-r pr-6" style={{ borderColor: `${t.primary}35` }}>
          <Education data={data} config={config} styleOverrides={styleOverrides} sectionVisibility={sectionVisibility} />
          <Skills data={data} config={config} sectionVisibility={sectionVisibility} />
          <Languages data={data} config={config} sectionVisibility={sectionVisibility} />
        </aside>
        <main className="col-span-2 flex flex-col gap-6">
          <Summary data={data} config={config} styleOverrides={styleOverrides} sectionVisibility={sectionVisibility} />
          <Experience data={data} config={config} styleOverrides={styleOverrides} sectionVisibility={sectionVisibility} title="Research & Teaching" />
          <Projects data={data} config={config} sectionVisibility={sectionVisibility} />
          <Certifications data={data} config={config} sectionVisibility={sectionVisibility} />
        </main>
      </div>
    </div>
      </SectionOrderContext.Provider>
    </SectionStylesContext.Provider>
  );
}

export function MedicalProTemplate({ data, config, styleOverrides, sectionVisibility, sectionStyles, sectionOrder }: PremiumTemplateProps) {
  const t = useTheme(config);
  const hasSkills = sectionVisible(sectionVisibility, 'skills') && data.skills.length > 0;
  const hasLanguages = sectionVisible(sectionVisibility, 'languages') && data.languages.length > 0;
  const hasCertifications = sectionVisible(sectionVisibility, 'certifications') && data.certifications.length > 0;
  const hasProjects = sectionVisible(sectionVisibility, 'projects') && data.projects.length > 0;
  return (
    <SectionStylesContext.Provider value={sectionStyles || {}}>
      <SectionOrderContext.Provider value={sectionOrder || []}>
    <div style={{ fontFamily: t.font, color: t.text }} className="bg-white">
      <HeaderBlock data={data} config={config} styleOverrides={styleOverrides} sectionVisibility={sectionVisibility} compact />
      <div className="medical-pro-layout grid grid-cols-12 gap-5 p-6">
        <main className="medical-pro-main col-span-8 flex flex-col gap-5">
          <Summary data={data} config={config} styleOverrides={styleOverrides} sectionVisibility={sectionVisibility} />
          <Experience data={data} config={config} styleOverrides={styleOverrides} sectionVisibility={sectionVisibility} title="Clinical Experience" />
          <Education data={data} config={config} styleOverrides={styleOverrides} sectionVisibility={sectionVisibility} />
          {hasProjects && <Projects data={data} config={config} sectionVisibility={sectionVisibility} />}
        </main>
        <aside className="medical-pro-aside col-span-4 flex flex-col gap-5">
          {hasSkills && (
          <div data-pdf-block="medical-side-skills" className="rounded-md p-4 border bg-white" style={{ borderColor: `${t.primary}2f` }}>
              <Skills data={data} config={config} sectionVisibility={sectionVisibility} />
          </div>
        )}
        {(hasCertifications || hasLanguages) && (
          <div data-pdf-block="medical-side-certs-langs" className="rounded-md p-4 border bg-white" style={{ borderColor: `${t.secondary}2f` }}>
              <Certifications data={data} config={config} sectionVisibility={sectionVisibility} />
              <Languages data={data} config={config} sectionVisibility={sectionVisibility} />
          </div>
          )}
        </aside>
      </div>
    </div>
      </SectionOrderContext.Provider>
    </SectionStylesContext.Provider>
  );
}

export function FinanceEliteTemplate({ data, config, styleOverrides, sectionVisibility, sectionStyles, sectionOrder }: PremiumTemplateProps) {
  const t = useTheme(config);
  const hasSkills = sectionVisible(sectionVisibility, 'skills') && data.skills.length > 0;
  const hasCertifications = sectionVisible(sectionVisibility, 'certifications') && data.certifications.length > 0;
  const hasExperience = sectionVisible(sectionVisibility, 'experience') && data.experiences.length > 0;
  const hasProjects = sectionVisible(sectionVisibility, 'projects') && data.projects.length > 0;
  const hasEducation = sectionVisible(sectionVisibility, 'education') && data.education.length > 0;
  return (
    <SectionStylesContext.Provider value={sectionStyles || {}}>
      <SectionOrderContext.Provider value={sectionOrder || []}>
    <div style={{ fontFamily: t.font, color: t.text }} className="bg-white">
      <div className="h-1" style={{ background: t.primary }} />
      <HeaderBlock data={data} config={config} styleOverrides={styleOverrides} sectionVisibility={sectionVisibility} compact />
      <div className="p-8 flex flex-col gap-6">
        {(hasExperience || hasProjects || hasCertifications) && (
          <div className="grid grid-cols-3 gap-3">
          <div className="rounded-md p-3 border text-center bg-white" style={{ borderColor: `${t.primary}30` }}><p className="text-xs text-gray-500">Experience</p><p className="font-bold">{data.experiences.length}</p></div>
          <div className="rounded-md p-3 border text-center bg-white" style={{ borderColor: `${t.primary}30` }}><p className="text-xs text-gray-500">Projects</p><p className="font-bold">{data.projects.length}</p></div>
          <div className="rounded-md p-3 border text-center bg-white" style={{ borderColor: `${t.primary}30` }}><p className="text-xs text-gray-500">Certs</p><p className="font-bold">{data.certifications.length}</p></div>
          </div>
        )}
        <Experience data={data} config={config} styleOverrides={styleOverrides} sectionVisibility={sectionVisibility} />
        {(hasEducation || hasSkills || hasCertifications) && (
          <div className="grid grid-cols-2 gap-6">
            <Education data={data} config={config} styleOverrides={styleOverrides} sectionVisibility={sectionVisibility} />
            {(hasSkills || hasCertifications) && (
              <div className="flex flex-col gap-6">
                <Skills data={data} config={config} sectionVisibility={sectionVisibility} />
                <Certifications data={data} config={config} sectionVisibility={sectionVisibility} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
      </SectionOrderContext.Provider>
    </SectionStylesContext.Provider>
  );
}

export function LegalExpertTemplate({ data, config, styleOverrides, sectionVisibility, sectionStyles, sectionOrder }: PremiumTemplateProps) {
  const t = useTheme(config);
  const isNameRTL = isRTLText(data.personalInfo.fullName);
  const headerDir = isNameRTL ? 'rtl' : 'ltr';
  const showPersonalHeader = sectionVisible(sectionVisibility, 'personal');
  return (
    <SectionStylesContext.Provider value={sectionStyles || {}}>
      <SectionOrderContext.Provider value={sectionOrder || []}>
    <div style={{ fontFamily: t.font, color: t.text, borderColor: `${t.primary}45` }} className="p-8 border">
      {showPersonalHeader && (
        <div className="border-b pb-5 mb-6" style={sectionStyleFor(sectionStyles || {}, sectionOrder || [], 'personal', { borderColor: `${t.primary}40` })}>
        <div
          className="flex items-center gap-4"
          style={{
            flexDirection: isNameRTL ? 'row-reverse' : 'row',
            justifyContent: isNameRTL ? 'flex-end' : 'flex-start'
          }}
        >
          <ProfileAvatar image={data.personalInfo.profileImage} size={68} ringColor={`${t.primary}60`} />
          <div dir={headerDir} style={{ textAlign: isNameRTL ? 'right' : 'left' }}>
            <h1
              dir="auto"
              style={styleFor(styleOverrides, 'fullName', {
                fontFamily: t.headingFont,
                fontSize: `${config?.nameSize || 34}px`,
                color: t.heading,
                fontWeight: 800
              })}
            >
              {data.personalInfo.fullName || 'Your Name'}
            </h1>
            <p dir="auto" style={styleFor(styleOverrides, 'jobTitle', { color: t.primary })}>
              {data.personalInfo.jobTitle || 'Legal Counsel'}
            </p>
          </div>
        </div>
        </div>
      )}
      <div className="grid grid-cols-12 gap-6">
        <aside className="col-span-4 flex flex-col gap-5">
            <Skills data={data} config={config} sectionVisibility={sectionVisibility} />
            <Certifications data={data} config={config} sectionVisibility={sectionVisibility} />
            <Languages data={data} config={config} sectionVisibility={sectionVisibility} />
        </aside>
        <main className="col-span-8 flex flex-col gap-5">
          <Summary data={data} config={config} styleOverrides={styleOverrides} sectionVisibility={sectionVisibility} />
          <Experience data={data} config={config} styleOverrides={styleOverrides} sectionVisibility={sectionVisibility} title="Cases & Practice" />
          <Education data={data} config={config} styleOverrides={styleOverrides} sectionVisibility={sectionVisibility} />
        </main>
      </div>
    </div>
      </SectionOrderContext.Provider>
    </SectionStylesContext.Provider>
  );
}

export function MarketingGuruTemplate({ data, config, styleOverrides, sectionVisibility, sectionStyles, sectionOrder }: PremiumTemplateProps) {
  const t = useTheme(config);
  return (
    <SectionStylesContext.Provider value={sectionStyles || {}}>
      <SectionOrderContext.Provider value={sectionOrder || []}>
    <div style={{ fontFamily: t.font, color: t.text }} className="bg-white">
      <HeaderBlock data={data} config={config} styleOverrides={styleOverrides} sectionVisibility={sectionVisibility} compact />
      <div className="p-7 grid grid-cols-12 gap-6">
        <main className="col-span-7 flex flex-col gap-6">
          <Summary data={data} config={config} styleOverrides={styleOverrides} sectionVisibility={sectionVisibility} />
          <Experience data={data} config={config} styleOverrides={styleOverrides} sectionVisibility={sectionVisibility} title="Campaign Experience" />
          <Projects data={data} config={config} sectionVisibility={sectionVisibility} />
        </main>
        <aside className="col-span-5 flex flex-col gap-6">
          <Skills data={data} config={config} sectionVisibility={sectionVisibility} title="Marketing Skills" />
          <Education data={data} config={config} styleOverrides={styleOverrides} sectionVisibility={sectionVisibility} />
          <Certifications data={data} config={config} sectionVisibility={sectionVisibility} />
          <Languages data={data} config={config} sectionVisibility={sectionVisibility} />
        </aside>
      </div>
    </div>
      </SectionOrderContext.Provider>
    </SectionStylesContext.Provider>
  );
}

export function ArchitectProTemplate({ data, config, styleOverrides, sectionVisibility, sectionStyles, sectionOrder }: PremiumTemplateProps) {
  const t = useTheme(config);
  const isNameRTL = isRTLText(data.personalInfo.fullName);
  const showPersonalHeader = sectionVisible(sectionVisibility, 'personal');
  return (
    <SectionStylesContext.Provider value={sectionStyles || {}}>
      <SectionOrderContext.Provider value={sectionOrder || []}>
    <div style={{ fontFamily: t.font, color: t.text }} className="p-10 bg-white">
      {showPersonalHeader && (
        <div className="mb-8" dir={isNameRTL ? 'rtl' : 'ltr'} style={{ textAlign: isNameRTL ? 'right' : 'left' }}>
        <h1
          dir="auto"
          style={styleFor(styleOverrides, 'fullName', {
            fontFamily: t.headingFont,
            fontSize: `${config?.nameSize || 36}px`,
            fontWeight: 700,
            color: t.heading
          })}
        >
          {data.personalInfo.fullName || 'Your Name'}
        </h1>
        <p dir="auto" style={styleFor(styleOverrides, 'jobTitle', { color: t.muted })}>
          {data.personalInfo.jobTitle || 'Architect'}
        </p>
        </div>
      )}
      <div className="grid grid-cols-12 gap-8">
        <main className="col-span-8 flex flex-col gap-8">
          <Projects data={data} config={config} sectionVisibility={sectionVisibility} />
          <Experience data={data} config={config} styleOverrides={styleOverrides} sectionVisibility={sectionVisibility} />
        </main>
        <aside className="col-span-4 flex flex-col gap-8 border-l pl-6" style={{ borderColor: `${t.primary}40` }}>
          <Summary data={data} config={config} styleOverrides={styleOverrides} sectionVisibility={sectionVisibility} />
          <Skills data={data} config={config} sectionVisibility={sectionVisibility} />
          <Education data={data} config={config} styleOverrides={styleOverrides} sectionVisibility={sectionVisibility} />
          <Languages data={data} config={config} sectionVisibility={sectionVisibility} />
        </aside>
      </div>
    </div>
      </SectionOrderContext.Provider>
    </SectionStylesContext.Provider>
  );
}

export function HrProTemplate({ data, config, styleOverrides, sectionVisibility, sectionStyles, sectionOrder }: PremiumTemplateProps) {
  const t = useTheme(config);
  const isNameRTL = isRTLText(data.personalInfo.fullName);
  const showPersonalHeader = sectionVisible(sectionVisibility, 'personal');
  return (
    <SectionStylesContext.Provider value={sectionStyles || {}}>
      <SectionOrderContext.Provider value={sectionOrder || []}>
    <div style={{ fontFamily: t.font, color: t.text }} className="p-8 bg-white">
      {showPersonalHeader && (
        <div
          className="rounded-md p-6 mb-6 border"
          style={sectionStyleFor(sectionStyles || {}, sectionOrder || [], 'personal', {
            background: '#ffffff',
            borderColor: `${t.primary}35`,
            borderTop: `5px solid ${t.primary}`,
            textAlign: isNameRTL ? 'right' : 'left'
          })}
          dir={isNameRTL ? 'rtl' : 'ltr'}
        >
        <h1
          dir="auto"
          style={styleFor(styleOverrides, 'fullName', {
            fontFamily: t.headingFont,
            fontSize: `${config?.nameSize || 36}px`,
            fontWeight: 800,
            color: t.heading
          })}
        >
          {data.personalInfo.fullName || 'Your Name'}
        </h1>
        <p dir="auto" style={styleFor(styleOverrides, 'jobTitle', { color: t.primary })}>
          {data.personalInfo.jobTitle || 'HR Specialist'}
        </p>
        </div>
      )}
      <div className="grid grid-cols-12 gap-6">
        <aside className="col-span-4 flex flex-col gap-6">
          <Skills data={data} config={config} sectionVisibility={sectionVisibility} title="HR Skills" />
          <Certifications data={data} config={config} sectionVisibility={sectionVisibility} />
          <Languages data={data} config={config} sectionVisibility={sectionVisibility} />
        </aside>
        <main className="col-span-8 flex flex-col gap-6">
          <Summary data={data} config={config} styleOverrides={styleOverrides} sectionVisibility={sectionVisibility} />
          <Experience data={data} config={config} styleOverrides={styleOverrides} sectionVisibility={sectionVisibility} />
          <Education data={data} config={config} styleOverrides={styleOverrides} sectionVisibility={sectionVisibility} />
        </main>
      </div>
    </div>
      </SectionOrderContext.Provider>
    </SectionStylesContext.Provider>
  );
}

export function SalesStarTemplate({ data, config, styleOverrides, sectionVisibility, sectionStyles, sectionOrder }: PremiumTemplateProps) {
  void config;
  void styleOverrides;
  void sectionStyles;
  void sectionOrder;

  const showPersonal = sectionVisible(sectionVisibility, 'personal');
  const showExperience = sectionVisible(sectionVisibility, 'experience');
  const showEducation = sectionVisible(sectionVisibility, 'education');
  const showSkills = sectionVisible(sectionVisibility, 'skills');
  const showLanguages = sectionVisible(sectionVisibility, 'languages');

  const fullName = data.personalInfo.fullName || 'RICHARD SANCHEZ';
  const fallbackNameParts = fullName.trim().split(/\s+/).filter(Boolean);
  const fallbackLine1 = fallbackNameParts[0] || 'RICHARD';
  const fallbackLine2 = fallbackNameParts.slice(1).join(' ') || 'SANCHEZ';
  const nameLine1 = (data.personalInfo.nameLine1 || fallbackLine1).toUpperCase();
  const nameLine2 = (data.personalInfo.nameLine2 || fallbackLine2).toUpperCase();
  const title = data.personalInfo.jobTitle || 'Product Designer';
  const summary =
    data.personalInfo.summary ||
    'A compassionate family wellness counselor with a strong background in providing support and guidance to families facing various challenges.';
  const aboutText =
    (data.projects[0]?.description?.[0] || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sit amet quam rhoncus, egestas dui eget, malesuada justo. Ut aliquam augue.')
      .slice(0, 180);
  const contactList = [
    data.personalInfo.phone || '+123-456-7890',
    data.personalInfo.email || 'hello@reallygreatsite.com',
    data.personalInfo.address || '123 Anywhere St., Any City'
  ];
  const experienceItems = data.experiences.length
    ? data.experiences.slice(0, 3)
    : [
        {
          id: 'ss-exp-1',
          company: 'Studio Shodwe Canberra - Australia',
          position: 'Family Counselor',
          location: '',
          startDate: '2020',
          endDate: '2022',
          current: false,
          description: ['Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum at amet quam rhoncus, egestas dui eget, malesuada justo.']
        },
        {
          id: 'ss-exp-2',
          company: 'Eleotown Cor. Kota Baru - Singapore',
          position: 'Wellness Specialist',
          location: '',
          startDate: '2016',
          endDate: '2020',
          current: false,
          description: ['Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum at amet quam rhoncus, egestas dui eget, malesuada justo.']
        },
        {
          id: 'ss-exp-3',
          company: 'Studio Shodwe Sydney - Australia',
          position: 'Program Advisor',
          location: '',
          startDate: '2010',
          endDate: '2015',
          current: false,
          description: ['Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum at amet quam rhoncus, egestas dui eget, malesuada justo.']
        }
      ];
  const educationItems = data.education.length
    ? data.education.slice(0, 2)
    : [
        {
          id: 'ss-edu-1',
          institution: 'Borcelle University',
          degree: 'Bachelor of Business Management',
          field: '',
          startDate: '2020',
          endDate: '2025',
          current: false
        },
        {
          id: 'ss-edu-2',
          institution: 'Borcelle University',
          degree: 'Master of Business Management',
          field: '',
          startDate: '2014',
          endDate: '2018',
          current: false
        }
      ];
  const languageItems = data.languages.length
    ? data.languages.slice(0, 3)
    : [
        { id: 'ss-lang-1', name: 'English', proficiency: 'Fluent' },
        { id: 'ss-lang-2', name: 'German', proficiency: 'Basic' },
        { id: 'ss-lang-3', name: 'Spanish', proficiency: 'Basic' }
      ];
  const skillItems = data.skills.length
    ? data.skills
    : [
        { id: 'ss-s1', name: 'Management Skills', level: 4 },
        { id: 'ss-s2', name: 'Creativity', level: 4 },
        { id: 'ss-s3', name: 'Digital Marketing', level: 4 },
        { id: 'ss-s4', name: 'Negotiation', level: 4 },
        { id: 'ss-s5', name: 'Critical Thinking', level: 5 },
        { id: 'ss-s6', name: 'Leadership', level: 5 }
      ];
  const expertiseItems = skillItems.filter((s) => hasText(s.name)).slice(0, 6);
  const normalizeSkillPercent = (level: number, percent?: number) => {
    const explicitPercent = Number(percent);
    if (Number.isFinite(explicitPercent)) {
      return Math.max(0, Math.min(100, Math.round(explicitPercent)));
    }
    const numeric = Number(level);
    if (!Number.isFinite(numeric)) return 0;
    return Math.max(0, Math.min(100, Math.round(numeric * 20)));
  };
  const skillSummarySource = skillItems.filter((s) => hasText(s.name)).slice(0, 2);
  const skillSummary = [
    {
      id: skillSummarySource[0]?.id || 'ss-summary-1',
      name: 'Design Process',
      percent: normalizeSkillPercent(
        skillSummarySource[0]?.level ?? 4,
        (skillSummarySource[0] as { percent?: number } | undefined)?.percent
      )
    },
    {
      id: skillSummarySource[1]?.id || 'ss-summary-2',
      name: 'Project Management',
      percent: normalizeSkillPercent(
        skillSummarySource[1]?.level ?? 4,
        (skillSummarySource[1] as { percent?: number } | undefined)?.percent
      )
    }
  ];
  const HeaderBar = ({ titleText }: { titleText: string }) => (
    <div className="mb-3 h-[28px] pb-5 w-full bg-[#2f8f84] text-center">
      <span className="block h-full text-[10px] font-bold text-white uppercase">{titleText}</span>
    </div>
  );

  const ContactIcon = ({ type }: { type: 'phone' | 'email' | 'address' }) => {
    const common = {
      width: 10,
      height: 10,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: 2,
      strokeLinecap: 'round' as const,
      strokeLinejoin: 'round' as const
    };
    if (type === 'phone') {
      return (
        <svg {...common} aria-hidden="true">
          <path d="M22 16.92v2a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.12 3.18 2 2 0 0 1 4.11 1h2a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.62a2 2 0 0 1-.45 2.11L7.1 8.64a16 16 0 0 0 6.26 6.26l1.19-1.19a2 2 0 0 1 2.11-.45c.84.29 1.72.5 2.62.62A2 2 0 0 1 22 16.92Z" />
        </svg>
      );
    }
    if (type === 'email') {
      return (
        <svg {...common} aria-hidden="true">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m4 7 8 6 8-6" />
        </svg>
      );
    }
    return (
      <svg {...common} aria-hidden="true">
        <path d="M12 21s-6-5.2-6-11a6 6 0 1 1 12 0c0 5.8-6 11-6 11Z" />
        <circle cx="12" cy="10" r="2.1" />
      </svg>
    );
  };

  return (
   <SectionStylesContext.Provider value={sectionStyles || {}}>
  <SectionOrderContext.Provider value={sectionOrder || []}>
    <div
      dir="ltr"
      className="w-full h-full rounded-[12px]"
      style={{
        aspectRatio: "210 / 297",
        fontFamily:
          '"Poppins","Montserrat","Segoe UI",Arial,sans-serif',
      }}
    >
      <div className="h-full w-full bg-white border border-[#e3e8ee] rounded-[12px] overflow-hidden">

        {/* ===== GRID ===== */}
        <div
          className="grid h-full"
          style={{ gridTemplateColumns: "38% 62%" }}
        >

          {/* ================= LEFT SIDEBAR ================= */}
          <aside className="bg-[#2f8f84] text-white m-3 rounded-[26px] px-5 py-6 flex flex-col">

            {/* ===== PHOTO ===== */}
            <div className="mx-auto w-[128px] h-[128px] rounded-full overflow-hidden border-[4px] border-[#d5efe9] bg-[#79c4bb]">
              {data.personalInfo.profileImage ? (
                <img
                  src={data.personalInfo.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#9ad0c9]" />
              )}
            </div>

            {/* ===== ABOUT ===== */}
            <section className="mt-6">
              <h3 className="text-[14px] font-semibold mb-2">
                About Me
              </h3>
              <p className="text-[10px] leading-[1.6] text-[#e9fffb]">
                {aboutText}
              </p>
            </section>

            {/* ===== CONTACT ===== */}
            <section className="mt-6">
              <ul className="space-y-3">
                {contactList.map((item, idx) => {
                  const iconType =
                    idx === 0
                      ? "phone"
                      : idx === 1
                      ? "email"
                      : "address";

                  return (
                    <li
                      key={idx}
                      className="flex items-center gap-3 text-[10px]"
                    >
                      <span className="w-7 h-7 rounded-full bg-white flex items-center justify-center shrink-0">
                        <span className="text-[#2f8f84]">
                          <ContactIcon type={iconType} />
                        </span>
                      </span>
                      <span className="break-words">
                        {item}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </section>

            {/* ===== LANGUAGE ===== */}
            {showLanguages && (
              <section className="mt-7">
                <div className="mb-3 h-[28px] border border-[#9ed6cf] bg-[#f4ffff] text-center text-[#2f8f84]">
                  <span className="block h-full text-[11px] font-bold uppercase">Language</span>
                </div>

                <ul className="list-disc pl-5 space-y-2 text-[10px]">
                  {languageItems.map((lang) => (
                    <li key={lang.id}>
                      {lang.name}
                      {lang.proficiency
                        ? ` (${lang.proficiency.toLowerCase()})`
                        : ""}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* ===== EXPERTISE ===== */}
            {showSkills && (
              <section className="mt-7">
                <div className="mb-3 h-[28px] border border-[#9ed6cf] bg-[#f4ffff] text-center text-[#2f8f84]">
                  <span className="block h-full text-[11px] font-bold uppercase">Expertise</span>
                </div>

                <ul className="list-disc pl-5 space-y-2 text-[10px]">
                  {expertiseItems.map((skill) => (
                    <li key={skill.id} className="break-words">
                      {skill.name}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </aside>

          {/* ================= RIGHT CONTENT ================= */}
          <main className="px-6 py-6 text-[#1f2b37]">

            {/* ===== HEADER ===== */}
            {showPersonal && (
              <header>
                <h1 className="text-[56px] leading-[0.92] mb-6 font-extrabold text-[#2f8f84] uppercase">
                  <span className="block">{nameLine1}</span>
                  <span className="block pl-[60px]">{nameLine2}</span>
                </h1>

                <p className="text-[14px] font-semibold text-[#2a5f65] mt-3">
                  {title}
                </p>

                <p className="text-[12px] leading-[1.55] mt-2 text-[#35535a] max-w-[95%]">
                  {summary}
                </p>
              </header>
            )}

            {/* ===== EXPERIENCE ===== */}
            {showExperience && (
              <section className="mt-6">
                <HeaderBar titleText="Experience" />

                <div className="space-y-4 mt-3">
                  {experienceItems.map((exp) => (
                    <article key={exp.id}>
                      <h4 className="text-[14px] font-bold">
                        {[exp.company, exp.location]
                          .filter(hasText)
                          .join(" - ")}
                      </h4>

                      <p className="text-[12px] font-semibold text-[#2f3e4f]">
                        {exp.startDate} -{" "}
                        {exp.current
                          ? "Present"
                          : exp.endDate || "-"}
                      </p>

                      <p className="text-[12px] leading-[1.5] text-[#36485a] mt-1">
                        {exp.description
                          .filter(Boolean)
                          .join(" ")}
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* ===== EDUCATION ===== */}
            {showEducation && (
              <section className="mt-6">
                <HeaderBar titleText="Education" />

                <div className="space-y-3 mt-3">
                  {educationItems.map((edu) => (
                    <article key={edu.id}>
                      <h4 className="text-[14px] font-bold">
                        {edu.institution}
                      </h4>

                      <p className="text-[12px]">
                        {[edu.degree, edu.field]
                          .filter(hasText)
                          .join(" - ")}
                      </p>

                      <p className="text-[11px] text-[#4f6072]">
                        {edu.startDate} -{" "}
                        {edu.current
                          ? "Present"
                          : edu.endDate || "-"}
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* ===== SKILLS SUMMARY ===== */}
            {showSkills && (
              <section className="mt-6">
                <HeaderBar titleText="Skills Summary" />

                <div className="space-y-3 mt-3">
                  {skillSummary.map((skill) => (
                    <div
                      key={skill.id}
                      className="grid grid-cols-[1fr_120px_40px] items-center gap-3"
                    >
                      <span className="text-[12px] text-[#344456]">
                        {skill.name}
                      </span>

                      <div className="h-[6px] bg-[#d7dde4] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#24445f]"
                          style={{
                            width: `${skill.percent}%`,
                          }}
                        />
                      </div>

                      <span className="text-[12px] font-semibold text-[#32485d]">
                        {skill.percent}%
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  </SectionOrderContext.Provider>
</SectionStylesContext.Provider>
  );
}

export function RichardPremiumTemplate({ data, sectionVisibility, sectionStyles, sectionOrder }: PremiumTemplateProps) {
  const showPersonal = sectionVisible(sectionVisibility, 'personal');
  const showExperience = sectionVisible(sectionVisibility, 'experience');
  const showEducation = sectionVisible(sectionVisibility, 'education');
  const showSkills = sectionVisible(sectionVisibility, 'skills');
  const showLanguages = sectionVisible(sectionVisibility, 'languages');

  const fullName = (data.personalInfo.fullName || 'RICHARD SANCHEZ').trim();
  const fullNameParts = fullName.split(/\s+/).filter(Boolean);
  const fallbackFirstLine = fullNameParts[0] || 'RICHARD';
  const fallbackSecondLine = fullNameParts.slice(1).join(' ') || 'SANCHEZ';
  const firstLine = (data.personalInfo.nameLine1 || fallbackFirstLine).toUpperCase();
  const secondLine = (data.personalInfo.nameLine2 || fallbackSecondLine).toUpperCase();
  const title = data.personalInfo.jobTitle || 'Product Designer';
  const about =
    data.personalInfo.summary ||
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sit amet quam rhoncus, egestas dui eget, malesuada justo. Ut aliquam augue.';
  const profileImage = data.personalInfo.profileImage || '/richard.jpg';

  const experiences = (data.experiences.length
    ? data.experiences
    : [
        {
          id: 'r-exp-1',
          company: 'Studio Showde',
          position: '',
          location: 'Canberra - Australia',
          startDate: '2020',
          endDate: '2022',
          current: false,
          description: ['Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sit amet quam rhoncus, egestas dui eget, malesuada justo. Ut aliquam augue.']
        },
        {
          id: 'r-exp-2',
          company: 'Elsetown Cor.',
          position: '',
          location: 'Kota Baru - Singapore',
          startDate: '2016',
          endDate: '2020',
          current: false,
          description: ['Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sit amet quam rhoncus, egestas dui eget, malesuada justo. Ut aliquam augue.']
        },
        {
          id: 'r-exp-3',
          company: 'Studio Showde',
          position: '',
          location: 'Sydney - Australia',
          startDate: '2010',
          endDate: '2015',
          current: false,
          description: ['Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sit amet quam rhoncus, egestas dui eget, malesuada justo. Ut aliquam augue.']
        }
      ]).slice(0, 3);

  const education = (data.education.length
    ? data.education
    : [
        { id: 'r-edu-1', institution: 'Borcelle University', degree: 'Bachelor of Business Management', field: '', startDate: '2014', endDate: '2023', current: false },
        { id: 'r-edu-2', institution: 'Borcelle University', degree: 'Master of Business Management', field: '', startDate: '2014', endDate: '2018', current: false }
      ]).slice(0, 2);

  const languages = (data.languages.length
    ? data.languages
    : [
        { id: 'r-lang-1', name: 'English', proficiency: '' },
        { id: 'r-lang-2', name: 'Germany', proficiency: 'basic' },
        { id: 'r-lang-3', name: 'Spain', proficiency: 'basic' }
      ]).slice(0, 3);

  const skills = (data.skills.length
    ? data.skills
    : [
        { id: 'r-s1', name: 'Management Skills', level: 4 },
        { id: 'r-s2', name: 'Creativity', level: 4 },
        { id: 'r-s3', name: 'Digital Marketing', level: 4 },
        { id: 'r-s4', name: 'Negotiation', level: 4 },
        { id: 'r-s5', name: 'Critical Thinking', level: 5 },
        { id: 'r-s6', name: 'Leadership', level: 5 }
      ])
    .filter((s) => hasText(s.name))
    .slice(0, 6);

  const summaryBars = [
    { id: skills[0]?.id || 'r-bar-1', name: skills[0]?.name || 'Design Process', percent: Math.max(0, Math.min(100, Math.round((skills[0]?.level || 4) * 20))) },
    { id: skills[1]?.id || 'r-bar-2', name: skills[1]?.name || 'Project Management', percent: Math.max(0, Math.min(100, Math.round((skills[1]?.level || 4) * 20))) }
  ];

  const contactRows = [
    { icon: '☎', value: data.personalInfo.phone || '+123-456-7890' },
    { icon: '✉', value: data.personalInfo.email || 'hello@reallygreatsite.com' },
    { icon: '⌂', value: data.personalInfo.address || '123 Anywhere St., Any City' }
  ];

  const SectionBar = ({ text }: { text: string }) => (
    <div className="h-[28px] w-full bg-[#243b53] text-white text-[11px] tracking-[0.04em] font-semibold uppercase flex items-center justify-center">
      {text}
    </div>
  );

  return (
    <SectionStylesContext.Provider value={sectionStyles || {}}>
      <SectionOrderContext.Provider value={sectionOrder || []}>
        <div
          dir="ltr"
          className="w-full bg-[#eceef0] text-[#1f2933]"
          style={{ aspectRatio: '210 / 297', fontFamily: '"Poppins","Montserrat","Segoe UI",Arial,sans-serif' }}
        >
          <div className="grid grid-rows-[195px_1fr] h-full">
            <header className="bg-[#243b53] px-[26px] py-[18px] text-white">
              <div className="h-full grid grid-cols-[180px_1fr] items-center gap-[22px]">
                <div className="w-[160px] h-[160px] rounded-full overflow-hidden bg-white/30">
                  <img src={profileImage} alt="Richard profile" className="w-full h-full object-cover object-center" />
                </div>
                {showPersonal && (
                  <div>
                    <h1 className="uppercase leading-[0.95] font-extrabold text-[70px]">
                      <span className="block">{firstLine}</span>
                      <span className="block pl-[37px]">{secondLine}</span>
                    </h1>
                    <p className="mt-[6px] text-[20px] text-white/95 font-medium">{title}</p>
                  </div>
                )}
              </div>
            </header>

            <div className="grid grid-cols-[43%_57%] gap-[16px] px-[18px] py-[14px]">
              <aside className="space-y-[16px]">
                {showPersonal && (
                  <section className="text-center px-[10px]">
                    <h3 className="text-[38px] font-medium tracking-[0.01em] mb-[4px]">About Me</h3>
                    <p className="text-[10.6px] leading-[1.65] text-[#273442]">{about}</p>
                  </section>
                )}

                <section className="space-y-[10px]">
                  {contactRows.map((row, idx) => (
                    <div key={idx} className="grid grid-cols-[26px_1fr] gap-[8px] items-center text-[10.5px]">
                      <div className="w-[24px] h-[24px] rounded-full bg-[#243b53] text-white flex items-center justify-center text-[11px]">{row.icon}</div>
                      <span className="break-words">{row.value}</span>
                    </div>
                  ))}
                </section>

                {showLanguages && (
                  <section>
                    <SectionBar text="Language" />
                    <ul className="mt-[8px] list-disc pl-[17px] space-y-[5px] text-[10.7px]">
                      {languages.map((lang) => (
                        <li key={lang.id}>
                          {lang.name}
                          {hasText(lang.proficiency) ? ` (${lang.proficiency})` : ''}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {showSkills && (
                  <section>
                    <SectionBar text="Expertise" />
                    <ul className="mt-[8px] list-disc pl-[17px] space-y-[5px] text-[10.7px]">
                      {skills.map((skill) => (
                        <li key={skill.id}>{skill.name}</li>
                      ))}
                    </ul>
                  </section>
                )}
              </aside>

              <main className="space-y-[16px]">
                {showExperience && (
                  <section>
                    <SectionBar text="Experience" />
                    <div className="mt-[9px] space-y-[10px]">
                      {experiences.map((exp) => (
                        <article key={exp.id} className="text-[10.6px] leading-[1.45] text-[#212d3a]">
                          <h4 className="text-[12px] font-semibold">{exp.company || exp.position}</h4>
                          <p className="text-[12px]">{exp.location || ''}</p>
                          <p className="text-[12px]">{exp.startDate} - {exp.current ? 'Present' : exp.endDate || '-'}</p>
                          <p className="mt-[3px]">{exp.description.filter(Boolean).join(' ')}</p>
                        </article>
                      ))}
                    </div>
                  </section>
                )}

                {showEducation && (
                  <section>
                    <SectionBar text="Education" />
                    <div className="mt-[9px] space-y-[10px]">
                      {education.map((edu) => (
                        <article key={edu.id} className="text-[10.8px] leading-[1.4]">
                          <h4 className="text-[12.5px] font-semibold">{edu.institution}</h4>
                          <p>{edu.degree}</p>
                          <p>{edu.startDate}-{edu.current ? 'Present' : edu.endDate || '-'}</p>
                        </article>
                      ))}
                    </div>
                  </section>
                )}

                {showSkills && (
                  <section>
                    <SectionBar text="Skills Summary" />
                    <div className="mt-[9px] space-y-[9px]">
                      {summaryBars.map((bar) => (
                        <div key={bar.id} className="grid grid-cols-[1fr_110px_34px] items-center gap-[8px] text-[11px]">
                          <span>{bar.name}</span>
                          <div className="h-[5px] bg-[#d6d9de] rounded-full overflow-hidden">
                            <div className="h-full bg-[#243b53]" style={{ width: `${bar.percent}%` }} />
                          </div>
                          <span className="text-right">{bar.percent}%</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </main>
            </div>
          </div>
        </div>
      </SectionOrderContext.Provider>
    </SectionStylesContext.Provider>
  );
}

export function AndreEmaasTemplate({ data, sectionVisibility, sectionStyles, sectionOrder }: PremiumTemplateProps) {
  const showPersonal = sectionVisible(sectionVisibility, 'personal');
  const showExperience = sectionVisible(sectionVisibility, 'experience');
  const showEducation = sectionVisible(sectionVisibility, 'education');
  const showSkills = sectionVisible(sectionVisibility, 'skills');
  const showReferences = sectionVisible(sectionVisibility, 'certifications');

  const fullName = (data.personalInfo.fullName || 'ANDRÉ MAAS').toUpperCase();
  const parts = fullName.split(/\s+/).filter(Boolean);
  const line1 = parts.slice(0, Math.ceil(parts.length / 2)).join(' ') || 'ANDRÉ';
  const line2 = parts.slice(Math.ceil(parts.length / 2)).join(' ') || 'MAAS';
  const title = (data.personalInfo.jobTitle || 'ROBOTICA-INGENIEUR').toUpperCase();
  const profileImage = data.personalInfo.profileImage || '/ander.png';
  const about = data.personalInfo.summary || 'Ik ben een robotica-ingenieur met kennis in computerwetenschap en elektrotechniek. Ik heb zowel in academische als zakelijke omgevingen gewerkt.';
  
  const skills = (data.skills.length ? data.skills : [
    { id: 'am-s1', name: 'Installatie en debugging' },
    { id: 'am-s2', name: 'Technologieontwerp' },
    { id: 'am-s3', name: 'Systeemanalyse en -evaluatie' },
    { id: 'am-s4', name: 'Machine learning' },
    { id: 'am-s5', name: 'Kunstmatige intelligentie' },
    { id: 'am-s6', name: 'Computerprogrammering' }
  ]).slice(0, 6);

  const experiences = (data.experiences.length ? data.experiences : [
    { id: 'am-exp-1', company: 'Gritters en bedrijf', position: 'Hoofd Robotica-ingenieur', startDate: 'Dec 2015', endDate: '', current: true, description: ['Ontwerpen en integreren van robots die naadloos aansluiten op de klantprocessen.', 'Werkt nauw samen met andere ingenieurs, ontwikkelaars en managers.'] },
    { id: 'am-exp-2', company: 'ODK Global Systems', position: 'Robotica-ingenieur', startDate: 'Jan 2014', endDate: 'nov 2015', current: false, description: ["Ontwikkelde efficiënte oplossingen voor robotica-programma's die door klanten worden gebruikt.", "Onderhoud van elektrische schema's na de initiële installatie."] }
  ]).slice(0, 3);

  const education = (data.education.length ? data.education : [
    { id: 'am-edu-1', institution: 'Beekstad College', degree: 'Master of Science', field: 'Master in Robotica en Mechatronics', startDate: 'Jan 2010', endDate: 'dec 2013', current: false },
    { id: 'am-edu-2', institution: 'Beekstad Universiteit', degree: 'Bachelor of Science', field: 'BS Elektrotechniek', startDate: 'Jan 2006', endDate: 'dec 2009', current: false }
  ]).slice(0, 2);

  const references = (data.certifications.length ? data.certifications : [
    { id: 'am-r1', name: 'Amir Stulberg', issuer: 'Robotica Beekstad Universiteit', date: 'hallo@geweldigewebsite.nl' },
    { id: 'am-r2', name: 'Jessica Swart', issuer: 'ODK Global Systems', date: 'hallo@geweldigewebsite.nl' }
  ]).slice(0, 3);
  const skillBars = skills
    .filter((skill) => hasText(skill.name))
    .map((skill, idx) => {
      const safePercent = Number.isFinite((skill as any)?.percent)
        ? Number((skill as any).percent)
        : (skill as any)?.level
          ? Number((skill as any).level) * 20
          : 80;
      return {
        id: skill.id || `am-bar-${idx + 1}`,
        name: skill.name,
        percent: Math.max(0, Math.min(100, Math.round(safePercent)))
      };
    })
    .slice(0, 8);

  return (
    <SectionStylesContext.Provider value={sectionStyles || {}}>
      <SectionOrderContext.Provider value={sectionOrder || []}>
        <div
          dir="ltr"
          className="w-full aspect-[210/297] overflow-hidden bg-[#efefef] text-[#1f2328]"
          style={{ fontFamily: '"Montserrat", "Poppins", "Segoe UI", sans-serif' }}
        >
          <div className="grid h-full grid-cols-[42%_58%]">
       <aside className="h-full min-h-full bg-[#efefef] flex flex-col border-r border-[#d8d8d9] shadow-[6px_0_22px_rgba(20,28,36,0.08)]">

  {/* الصورة */}
  <div className="h-[255px] bg-[#2f3134]">
    <div className="h-full w-full overflow-hidden border border-[#ffffff3b] bg-white">
      <img
        src={profileImage}
        alt="profile"
        className="h-full w-full object-cover object-center"
      />
    </div>
  </div>

  {/* القسم الأوسط — يتمدد تلقائياً */}
 <div className="relative flex-1 bg-gradient-to-b from-[#9dc0dd] via-[#8fb6d6] to-[#86adc8] px-[28px] py-[34px] flex flex-col border-y border-[#ffffff40]">

  <div className="pointer-events-none absolute inset-x-[18px] top-[16px] h-px bg-[#ffffff7d]" />

  <div className="flex-1 grid grid-rows-2 gap-[20px]">

    {/* القسم العلوي */}
    <div className="rounded-[14px] border border-[#ffffff5c] bg-[#ffffff1a] p-[16px] shadow-[0_6px_14px_rgba(35,53,71,0.08)]">
      {showPersonal && (
        <section>
          <h3 className="mb-[14px] text-[15px] font-bold uppercase tracking-[0.12em] text-[#1f2d3b]">
            Loopbaansamenvatting
          </h3>
          <p className="text-[11px] leading-[1.48] text-[#4c6376]">
            {about}
          </p>
        </section>
      )}
    </div>

    {/* القسم السفلي */}
    <div className="rounded-[14px] border border-[#ffffff5c] bg-[#ffffff1a] p-[16px] shadow-[0_6px_14px_rgba(35,53,71,0.08)]">
      {showSkills && (
        <section>
          <h3 className="mb-[14px] text-[15px] font-bold uppercase tracking-[0.12em] text-[#1f2d3b]">
            Professionele vaardigheden
          </h3>
          <ul className="space-y-[2px] text-[11px] leading-[1.45] text-[#5a7084]">
            {skills.map((s) => (
              <li key={s.id}>- {s.name}</li>
            ))}
          </ul>
        </section>
      )}
    </div>

  </div>
</div>

  {/* القسم السفلي يبقى بالأسفل دائماً */}
  <div className="bg-gradient-to-b from-[#efeff0] to-[#e6e7e8] px-[28px] pt-[40px] pb-[36px] border-t-[1.5px] border-[#cfd2d6]">
    <section className="rounded-[14px] border border-[#cfd4da] bg-[#ffffffc4] p-[16px] shadow-[0_5px_14px_rgba(38,46,56,0.08)]">
      <h3 className="mb-[12px] text-[15px] font-bold uppercase tracking-[0.11em] text-[#2b3138]">
        Contactinformatie
      </h3>
      <div className="space-y-[3px] text-[10.5px] leading-[1.42] text-[#636a72]">
        <p>E-mail: {data.personalInfo.email || 'hallo@geweldigewebsite.nl'}</p>
        <p>Telefoon: {data.personalInfo.phone || '0275-565600'}</p>
        <p>Website: {data.personalInfo.website || 'www.geweldigewebsite.nl'}</p>
        <p>Kantooradres: {data.personalInfo.address || 'Overalstraat 123, 1234 AB Beekstad'}</p>
      </div>
    </section>
  </div>

</aside>

            <main className="h-full overflow-hidden px-[44px] pb-[30px] pt-[44px]">
              <header className="mb-[28px] border-b-[3px] border-[#8fb6d6] pb-[14px]">
                <h1
                  className="uppercase text-[#9bbfe0] leading-[0.95] font-[800] flex items-center gap-2 text-[46px] tracking-[0.14em]"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  <span className="block">{line1}</span>
                  <span className="block">{line2}</span>
                </h1>
                <p className="mt-[10px] text-[20px] tracking-[0.23em] font-light text-[#51565d] uppercase">{title}</p>
              </header>

              {showExperience && (
                <section className="mb-[26px]">
                  <h2 className="mb-[12px] text-[18px] font-bold tracking-[0.11em] uppercase text-[#23292f]">Werkervaring</h2>
                  <div className="space-y-[16px]">
                    {experiences.map((exp) => (
                      <article key={exp.id}>
                        <h3 className="text-[15px] font-bold text-[#21262b]">{exp.position}</h3>
                        <p className="mb-[4px] text-[13px] font-semibold tracking-[0.03em] text-[#2f343a]">
                          {exp.company} | {exp.startDate} - {exp.current ? 'heden' : exp.endDate || '-'}
                        </p>
                        <ul className="space-y-[1px] text-[11px] leading-[1.36] text-[#8a9199]">
                          {exp.description.filter(Boolean).slice(0, 2).map((line, i) => (
                            <li key={i}>- {line}</li>
                          ))}
                        </ul>
                      </article>
                    ))}
                  </div>
                </section>
              )}

              {showEducation && (
                <section className="mb-[24px]">
                  <h2 className="mb-[12px] text-[18px] font-bold tracking-[0.11em] uppercase text-[#23292f]">Voorgaande scholen</h2>
                  <div className="space-y-[14px]">
                    {education.map((edu) => (
                      <article key={edu.id}>
                        <h3 className="text-[15px] font-bold text-[#21262b]">{edu.institution}</h3>
                        <p className="mb-[4px] text-[13px] font-semibold tracking-[0.03em] text-[#2f343a]">
                          {edu.degree} | {edu.startDate} - {edu.current ? 'heden' : edu.endDate || '-'}
                        </p>
                        {edu.field && <p className="text-[11px] leading-[1.36] text-[#8a9199]">- {edu.field}</p>}
                      </article>
                    ))}
                  </div>
                </section>
              )}

              {showSkills && (
                <section className="mb-[24px]">
                  <div className="h-[28px] w-full bg-[#2f3f54] flex items-center justify-center text-[11px] font-medium uppercase text-center tracking-[0.09em] text-white">
                    Skills Summary
                  </div>
                  <div className="mt-[10px] space-y-[7px]">
                    {skillBars.map((bar) => (
                      <div key={bar.id} className="grid grid-cols-[1fr_116px_38px] items-center gap-[10px] text-[11px] text-[#293039]">
                        <span>{bar.name}</span>
                        <div className="h-[6px] overflow-hidden rounded-full bg-[#d7dce2]">
                          <div className="h-full rounded-full bg-[#273f59]" style={{ width: `${bar.percent}%` }} />
                        </div>
                        <span className="text-right">{bar.percent}%</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {showReferences && (
                <section>
                  <h2 className="mb-[12px] text-[18px] font-bold tracking-[0.11em] uppercase text-[#23292f]">Werkreferenties</h2>
                  <div className="space-y-[8px] text-[11px] leading-[1.34] text-[#8a9199]">
                    {references.map((refItem) => (
                      <article key={refItem.id}>
                        <p className="text-[#596068]">{refItem.name}</p>
                        <p>{refItem.issuer}</p>
                        <p>E-mail: {refItem.date}</p>
                      </article>
                    ))}
                  </div>
                </section>
              )}
            </main>
          </div>
        </div>
      </SectionOrderContext.Provider>
    </SectionStylesContext.Provider>
  );
}

export function GlobalEdgeTemplate({ data, config, styleOverrides, sectionVisibility, sectionStyles, sectionOrder }: PremiumTemplateProps) {
  const t = useTheme(config);
  const isNameRTL = isRTLText(data.personalInfo.fullName);
  const showPersonalHeader = sectionVisible(sectionVisibility, 'personal');
  
  return (
    <SectionStylesContext.Provider value={sectionStyles || {}}>
      <SectionOrderContext.Provider value={sectionOrder || []}>
        <div style={{ fontFamily: t.font, color: t.text }} className="bg-white">
          {showPersonalHeader && (
            <header
              className="p-8 border-b-4"
              style={sectionStyleFor(sectionStyles || {}, sectionOrder || [], 'personal', {
                borderColor: `${t.primary}40`,
                background: '#ffffff',
                borderTop: `6px solid ${t.primary}`
              })}
              dir={isNameRTL ? 'rtl' : 'ltr'}
            >
              <div className="flex items-center gap-4" style={{ flexDirection: isNameRTL ? 'row-reverse' : 'row' }}>
                <ProfileAvatar image={data.personalInfo.profileImage} size={76} ringColor={`${t.primary}70`} />
                <div style={{ textAlign: isNameRTL ? 'right' : 'left' }}>
                  <h1
                    dir="auto"
                    style={styleFor(styleOverrides, 'fullName', {
                      fontFamily: t.headingFont,
                      fontSize: `${config?.nameSize || 34}px`,
                      color: t.heading,
                      fontWeight: 800
                    })}
                  >
                    {data.personalInfo.fullName || 'Your Name'}
                  </h1>
                  <p dir="auto" style={styleFor(styleOverrides, 'jobTitle', { color: t.primary, fontWeight: 600 })}>
                    {data.personalInfo.jobTitle || 'Global Professional'}
                  </p>
                  <p className="mt-2 text-sm opacity-80" dir="auto" style={mergeStyles(styleOverrides, ['email', 'phone', 'address'])}>
                    {[data.personalInfo.email, data.personalInfo.phone, data.personalInfo.address].filter(hasText).join(' | ')}
                  </p>
                </div>
              </div>
            </header>
          )}
  
          <div className="p-8 grid grid-cols-12 gap-7">
            <aside className="col-span-4 flex flex-col gap-6">
              <div className="rounded-md border p-4 bg-white" style={{ borderColor: `${t.primary}2f` }}>
                <Skills data={data} config={config} sectionVisibility={sectionVisibility} />
              </div>
              <div className="rounded-md border p-4 bg-white" style={{ borderColor: `${t.secondary}2f` }}>
                <Languages data={data} config={config} sectionVisibility={sectionVisibility} />
                <div className="mt-5">
                  <Certifications data={data} config={config} sectionVisibility={sectionVisibility} />
                </div>
              </div>
            </aside>
  
            <main className="col-span-8 flex flex-col gap-6">
              <Summary data={data} config={config} styleOverrides={styleOverrides} sectionVisibility={sectionVisibility} />
              <Experience data={data} config={config} styleOverrides={styleOverrides} sectionVisibility={sectionVisibility} />
              <Projects data={data} config={config} sectionVisibility={sectionVisibility} />
              <Education data={data} config={config} styleOverrides={styleOverrides} sectionVisibility={sectionVisibility} />
            </main>
          </div>
        </div>
      </SectionOrderContext.Provider>
    </SectionStylesContext.Provider>
  );
}

export function AuroraPrimeTemplate({ data, config, styleOverrides, sectionVisibility, sectionStyles, sectionOrder }: PremiumTemplateProps) {
  const t = useTheme(config);
  const isNameRTL = isRTLText(data.personalInfo.fullName);
  const showPersonalHeader = sectionVisible(sectionVisibility, 'personal');
  const metricBlock = [
    { label: 'Experience', value: data.experiences.length },
    { label: 'Projects', value: data.projects.length },
    { label: 'Skills', value: data.skills.length }
  ];

  return (
    <SectionStylesContext.Provider value={sectionStyles || {}}>
      <SectionOrderContext.Provider value={sectionOrder || []}>
        <div style={{ fontFamily: t.font, color: t.text }} className="bg-white">
          {showPersonalHeader && (
            <header
              className="p-8"
              style={sectionStyleFor(sectionStyles || {}, sectionOrder || [], 'personal', {
                background: '#ffffff',
                color: t.heading,
                borderTop: `6px solid ${t.primary}`,
                borderBottom: `1px solid ${t.primary}35`
              })}
              dir={isNameRTL ? 'rtl' : 'ltr'}
            >
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-4" style={{ flexDirection: isNameRTL ? 'row-reverse' : 'row' }}>
                  <ProfileAvatar image={data.personalInfo.profileImage} size={78} ringColor="rgba(255,255,255,0.55)" />
                  <div style={{ textAlign: isNameRTL ? 'right' : 'left' }}>
                    <h1
                      dir="auto"
                      style={styleFor(styleOverrides, 'fullName', {
                        fontFamily: t.headingFont,
                        fontSize: `${config?.nameSize || 34}px`,
                        fontWeight: 800
                      })}
                    >
                      {data.personalInfo.fullName || 'Your Name'}
                    </h1>
                    <p dir="auto" style={styleFor(styleOverrides, 'jobTitle', { opacity: 0.95 })}>
                      {data.personalInfo.jobTitle || 'Senior Professional'}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-right" dir="auto" style={mergeStyles(styleOverrides, ['email', 'phone', 'address'], { color: t.muted })}>
                  {[data.personalInfo.email, data.personalInfo.phone, data.personalInfo.address].filter(hasText).join(' | ')}
                </p>
              </div>
            </header>
          )}

          <div className="p-7 flex flex-col gap-6">
            <div className="grid grid-cols-3 gap-3">
              {metricBlock.map((item) => (
                <div key={item.label} className="rounded-md p-3 bg-white border text-center" style={{ borderColor: `${t.primary}30` }}>
                  <p className="text-xs text-gray-500">{item.label}</p>
                  <p className="text-lg font-bold" style={{ color: t.heading }}>{item.value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-12 gap-6">
              <main className="col-span-8 flex flex-col gap-6">
                <Summary data={data} config={config} styleOverrides={styleOverrides} sectionVisibility={sectionVisibility} />
                <Experience data={data} config={config} styleOverrides={styleOverrides} sectionVisibility={sectionVisibility} title="Impact Experience" />
                <Projects data={data} config={config} sectionVisibility={sectionVisibility} />
              </main>
              <aside className="col-span-4 flex flex-col gap-6">
                <div
                  data-pdf-block="aurora-side-skills"
                  className="rounded-md p-4 bg-white border"
                  style={{ borderColor: `${t.secondary}28` }}
                >
                  <Skills data={data} config={config} sectionVisibility={sectionVisibility} />
                </div>
                <div
                  data-pdf-block="aurora-side-education"
                  className="rounded-md p-4 bg-white border"
                  style={{ borderColor: `${t.primary}28` }}
                >
                  <Education data={data} config={config} styleOverrides={styleOverrides} sectionVisibility={sectionVisibility} />
                </div>
                <div
                  data-pdf-block="aurora-side-languages"
                  className="rounded-md p-4 bg-white border"
                  style={{ borderColor: `${t.primary}22` }}
                >
                  <Languages data={data} config={config} sectionVisibility={sectionVisibility} />
                </div>
              </aside>
            </div>
          </div>
        </div>
      </SectionOrderContext.Provider>
    </SectionStylesContext.Provider>
  );
}

export function StartupOneTemplate({ data, config, styleOverrides, sectionVisibility, sectionStyles, sectionOrder }: PremiumTemplateProps) {
  const t = useTheme(config);
  return (
    <SectionStylesContext.Provider value={sectionStyles || {}}>
      <SectionOrderContext.Provider value={sectionOrder || []}>
        <div style={{ fontFamily: t.font, color: t.text }} className="bg-white p-7">
          <HeaderBlock data={data} config={config} styleOverrides={styleOverrides} sectionVisibility={sectionVisibility} compact />
          <div className="mt-5 grid grid-cols-12 gap-6">
            <main className="col-span-12 md:col-span-7 flex flex-col gap-5">
              <Summary data={data} config={config} styleOverrides={styleOverrides} sectionVisibility={sectionVisibility} />
              <Projects data={data} config={config} sectionVisibility={sectionVisibility} />
              <Experience data={data} config={config} styleOverrides={styleOverrides} sectionVisibility={sectionVisibility} title="Startup Experience" />
            </main>
            <aside className="col-span-12 md:col-span-5 flex flex-col gap-5">
              <Skills data={data} config={config} sectionVisibility={sectionVisibility} title="Startup Toolkit" />
              <Education data={data} config={config} styleOverrides={styleOverrides} sectionVisibility={sectionVisibility} />
              <Languages data={data} config={config} sectionVisibility={sectionVisibility} />
            </aside>
          </div>
        </div>
      </SectionOrderContext.Provider>
    </SectionStylesContext.Provider>
  );
}

export function FinanceQuantTemplate({ data, config, styleOverrides, sectionVisibility, sectionStyles, sectionOrder }: PremiumTemplateProps) {
  const t = useTheme(config);
  const metrics = [
    { label: 'Roles', value: data.experiences.length },
    { label: 'Projects', value: data.projects.length },
    { label: 'Certs', value: data.certifications.length }
  ];
  return (
    <SectionStylesContext.Provider value={sectionStyles || {}}>
      <SectionOrderContext.Provider value={sectionOrder || []}>
        <div style={{ fontFamily: t.font, color: t.text }} className="bg-white p-8">
          <div className="grid grid-cols-3 gap-3 mb-5">
            {metrics.map((m) => (
              <div key={m.label} className="border rounded-md p-2.5 text-center" style={{ borderColor: `${t.primary}35` }}>
                <p className="text-[11px] uppercase tracking-wide text-slate-500">{m.label}</p>
                <p className="font-bold text-lg" style={{ color: t.heading }}>{m.value}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-12 gap-6">
            <aside className="col-span-12 md:col-span-5 flex flex-col gap-5">
              <Summary data={data} config={config} styleOverrides={styleOverrides} sectionVisibility={sectionVisibility} />
              <Skills data={data} config={config} sectionVisibility={sectionVisibility} title="Quant Skills" />
              <Certifications data={data} config={config} sectionVisibility={sectionVisibility} />
            </aside>
            <main className="col-span-12 md:col-span-7 flex flex-col gap-5">
              <Experience data={data} config={config} styleOverrides={styleOverrides} sectionVisibility={sectionVisibility} title="Quant Experience" />
              <Projects data={data} config={config} sectionVisibility={sectionVisibility} />
              <Education data={data} config={config} styleOverrides={styleOverrides} sectionVisibility={sectionVisibility} />
            </main>
          </div>
        </div>
      </SectionOrderContext.Provider>
    </SectionStylesContext.Provider>
  );
}

export function LegalModernTemplate({ data, config, styleOverrides, sectionVisibility, sectionStyles, sectionOrder }: PremiumTemplateProps) {
  const t = useTheme(config);
  const isNameRTL = isRTLText(data.personalInfo.fullName);
  return (
    <SectionStylesContext.Provider value={sectionStyles || {}}>
      <SectionOrderContext.Provider value={sectionOrder || []}>
        <div style={{ fontFamily: t.font, color: t.text }} className="bg-white p-9">
          <header className="pb-5 mb-6 border-b-2" style={{ borderColor: `${t.primary}3a` }} dir={isNameRTL ? 'rtl' : 'ltr'}>
            <h1 dir="auto" style={{ fontFamily: t.headingFont, fontSize: `${config?.nameSize || 34}px`, fontWeight: 800, color: t.heading }}>
              {data.personalInfo.fullName || 'Your Name'}
            </h1>
            <p dir="auto" style={{ color: t.primary, fontWeight: 600 }}>{data.personalInfo.jobTitle || 'Legal Advisor'}</p>
            <p className="mt-2 text-sm" dir="auto" style={{ color: t.muted }}>
              {[data.personalInfo.email, data.personalInfo.phone, data.personalInfo.address].filter(hasText).join(' | ')}
            </p>
          </header>
          <div className="flex flex-col gap-5">
            <Summary data={data} config={config} styleOverrides={styleOverrides} sectionVisibility={sectionVisibility} />
            <Experience data={data} config={config} styleOverrides={styleOverrides} sectionVisibility={sectionVisibility} title="Practice Highlights" />
            <Education data={data} config={config} styleOverrides={styleOverrides} sectionVisibility={sectionVisibility} />
            <div className="grid grid-cols-2 gap-5">
              <Skills data={data} config={config} sectionVisibility={sectionVisibility} />
              <Languages data={data} config={config} sectionVisibility={sectionVisibility} />
            </div>
          </div>
        </div>
      </SectionOrderContext.Provider>
    </SectionStylesContext.Provider>
  );
}

export function MinimalNordicTemplate({ data, config, styleOverrides, sectionVisibility, sectionStyles, sectionOrder }: PremiumTemplateProps) {
  void config;
  void styleOverrides;
  void sectionVisibility;
  void sectionStyles;
  void sectionOrder;
  const ContactIcon = ({ type }: { type: 'email' | 'phone' | 'address' | 'website' }) => {
    const common = {
      width: 14,
      height: 14,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: '#f2f5fb',
      strokeWidth: 1.8,
      strokeLinecap: 'round' as const,
      strokeLinejoin: 'round' as const
    };
    if (type === 'email') return <svg {...common}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></svg>;
    if (type === 'phone') return <svg {...common}><path d="M22 16.9v2a2 2 0 0 1-2.2 2A19.9 19.9 0 0 1 11.2 18a19.5 19.5 0 0 1-6-6A19.9 19.9 0 0 1 2.1 3.2 2 2 0 0 1 4.1 1h2a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.4 2.1L7.1 8.6a16 16 0 0 0 6.3 6.3l1.2-1.2a2 2 0 0 1 2.1-.4c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2Z" /></svg>;
    if (type === 'address') return <svg {...common}><path d="M12 21s-6-5.2-6-11a6 6 0 1 1 12 0c0 5.8-6 11-6 11Z" /><circle cx="12" cy="10" r="2.1" /></svg>;
    return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3a15 15 0 0 1 0 18" /><path d="M12 3a15 15 0 0 0 0 18" /></svg>;
  };

  const truncate = (value: string, max: number) => (value.length > max ? `${value.slice(0, max - 1).trim()}...` : value);
  const websiteFromEmail = hasText(data.personalInfo.email) && data.personalInfo.email.includes('@')
    ? data.personalInfo.email.split('@')[1].toLowerCase()
    : 'reallygreatsite.com';

  const name = data.personalInfo.fullName || 'Olivia Wilson';
  const title = data.personalInfo.jobTitle || 'Marketing Manager';
  const summary = truncate(
    data.personalInfo.summary ||
      'An experienced Marketing Manager with exceptional skills in creating marketing plans, launching products, promoting them, and overseeing their development.',
    260
  );

  const contactItems: Array<{ key: string; type: 'email' | 'phone' | 'address' | 'website'; value: string }> = [
    { key: 'email', type: 'email', value: data.personalInfo.email || 'hello@reallygreatsite.com' },
    { key: 'phone', type: 'phone', value: data.personalInfo.phone || '+123-456-7890' },
    { key: 'address', type: 'address', value: data.personalInfo.address || '123 Anywhere St., Any City' },
    { key: 'website', type: 'website', value: websiteFromEmail }
  ];

  const educationItems = (data.education.length ? data.education : [
    { id: 'mn-edu-1', degree: 'Master of Business', institution: 'Wardiere University', startDate: '2011', endDate: '2015', current: false, field: '' },
    { id: 'mn-edu-2', degree: 'BA Sales and Commerce', institution: 'Wardiere University', startDate: '2011', endDate: '2015', current: false, field: '' }
  ]).slice(0, 2);

  const skillItems = (data.skills.length ? data.skills : [
    { id: 'mn-skill-1', name: 'ROI Calculations', level: 4 },
    { id: 'mn-skill-2', name: 'Social media marketing', level: 4 },
    { id: 'mn-skill-3', name: 'Product development lifecycle', level: 4 },
    { id: 'mn-skill-4', name: 'Marketing strategy', level: 5 },
    { id: 'mn-skill-5', name: 'Product promotion', level: 4 },
    { id: 'mn-skill-6', name: 'Value Propositions', level: 4 }
  ]).slice(0, 6);

  const languageItems = (data.languages.length ? data.languages : [
    { id: 'mn-lang-1', name: 'English', proficiency: 'Fluent' },
    { id: 'mn-lang-2', name: 'French', proficiency: 'Professional' }
  ]).slice(0, 2);

  const experienceItems = (data.experiences.length ? data.experiences : [
    {
      id: 'mn-exp-1',
      position: 'Marketing Manager',
      company: 'Timmerman Industries',
      location: '',
      startDate: 'Aug 2018',
      endDate: 'present',
      current: true,
      description: [
        'Maintained and organized numerous office files',
        'Constantly updated the company\'s contact and mailing lists',
        'Monitored ongoing marketing campaigns',
        'Monitored press coverage'
      ]
    },
    {
      id: 'mn-exp-2',
      position: 'Marketing Assistant',
      company: 'Timmerman Industries',
      location: '',
      startDate: 'Jul 2015',
      endDate: 'Aug 2018',
      current: false,
      description: [
        'Handled the company\'s online presence and social media accounts',
        'Monitored ongoing marketing campaigns'
      ]
    },
    {
      id: 'mn-exp-3',
      position: 'Marketing Assistant',
      company: 'Liceria & Co.',
      location: '',
      startDate: 'Aug 2014',
      endDate: 'Jul 2015',
      current: false,
      description: ['Handled the company\'s online presence and social media accounts']
    }
  ]).slice(0, 3);

  return (
    <SectionStylesContext.Provider value={sectionStyles || {}}>
      <SectionOrderContext.Provider value={sectionOrder || []}>
        <div
          className="w-full h-full box-border text-[#2f3440]"
          style={{
            aspectRatio: '210 / 297',
            fontFamily: '"Poppins", "Montserrat", "Segoe UI", Arial, sans-serif'
          }}
          dir="ltr"
        >
          <div
            className="grid h-full w-full overflow-hidden bg-[#f4f4f5]"
            style={{ gridTemplateColumns: '33% 67%' }}
          >
            <aside className="bg-[#344159] text-[#f6f8fc] px-5 py-6 text-left">
              <div className="mx-auto mb-6 h-[108px] w-[108px] rounded-full border-[8px] border-[#4f6284] overflow-hidden bg-[#bac5d7]">
                {data.personalInfo.profileImage ? (
                  <img src={data.personalInfo.profileImage} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-[#c4cedd]" />
                )}
              </div>

              <section className="pb-4 border-b border-white/45">
                <h4 className="text-[12px] leading-none font-semibold tracking-[0.01em] mb-2">Contact</h4>
                <ul className="space-y-2">
                  {contactItems.map((item) => (
                    <li key={item.key} className="text-[9.3px] leading-[1.25] break-words">
                      <span className="inline-flex items-start gap-1.5">
                        <ContactIcon type={item.type} />
                        <span>{truncate(item.value, 42)}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="py-4 border-b border-white/45">
                <h4 className="text-[12px] leading-none font-semibold tracking-[0.01em] mb-2">Education</h4>
                <div className="space-y-3">
                  {educationItems.map((edu) => (
                    <div key={edu.id}>
                      <p className="text-[9.2px] leading-[1.2] font-medium break-words">{truncate(edu.degree, 30)}</p>
                      <p className="text-[9.2px] leading-[1.2] font-semibold break-words">{truncate(edu.institution, 30)}</p>
                      <p className="text-[8.6px] leading-[1.2] text-[#dbe3f0]">{edu.startDate}{edu.endDate ? ` - ${edu.endDate}` : ''}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="py-4 border-b border-white/45">
                <h4 className="text-[12px] leading-none font-semibold tracking-[0.01em] mb-2">Skills</h4>
                <ul className="space-y-1.5">
                  {skillItems.map((skill) => (
                    <li key={skill.id} className="text-[9.1px] leading-[1.24] break-words">
                      <span className="inline-block mr-1.5 h-[4px] w-[4px] rounded-full bg-white/90 align-middle" />
                      {truncate(skill.name, 34)}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="pt-4">
                <h4 className="text-[12px] leading-none font-semibold tracking-[0.01em] mb-2">Language</h4>
                <ul className="space-y-1.5">
                  {languageItems.map((lang) => (
                    <li key={lang.id} className="text-[9.1px] leading-[1.24] break-words">{truncate(lang.name, 22)}</li>
                  ))}
                </ul>
              </section>
            </aside>

            <main className="bg-[#f4f4f5] px-6 py-6 text-left">
              <header className="pb-4 mb-4 border-b border-[#989da6]">
                <h1 className="text-[40px] mb-2 font-bold text-[#35383f] leading-[0.95] break-words">{truncate(name, 22)}</h1>
                <p className="text-[11px] font-medium text-[#3d4047] leading-[1.05] break-words">{truncate(title, 40)}</p>
              </header>

              <section className="pb-4 mb-4 border-b border-[#989da6]">
                <h3 className="text-[13px] leading-none font-semibold text-[#3e424a] mb-1.5">About Me</h3>
                <p className="text-[8.5px] leading-[1.35] text-[#404651] break-words">{summary}</p>
              </section>

              <section className="pb-4 mb-4 border-b border-[#989da6]">
                <h3 className="text-[13px] leading-none font-semibold text-[#3e424a] mb-2">Work Experience</h3>
                <div className="space-y-3">
                  {experienceItems.map((exp) => (
                    <article key={exp.id} className="text-[#3f4651]">
                      <p className="text-[7.2px] leading-[1.2] text-[#70757f]">{exp.startDate}{exp.endDate ? ` - ${exp.endDate}` : exp.current ? ' - present' : ''}</p>
                      <p className="text-[8.6px] leading-[1.18] text-[#5f6672] break-words">{truncate(exp.company, 38)}</p>
                      <p className="text-[9.4px] leading-[1.12] font-medium text-[#3a404a] break-words">{truncate(exp.position, 30)}</p>
                      <ul className="mt-0.5 space-y-0.5 text-[7.6px] leading-[1.28] text-[#444b57]">
                        {exp.description.slice(0, 4).map((line, idx) => (
                          <li key={idx} className="break-words">
                            <span className="inline-block mr-1.5 h-[3px] w-[3px] rounded-full bg-[#5e6674] align-middle" />
                            {truncate(line, 110)}
                          </li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-[13px] leading-none font-semibold text-[#3e424a] mb-2">References</h3>
                <div className="grid grid-cols-2 gap-3 border-t border-[#989da6] pt-2.5">
                  <div>
                    <p className="text-[8.3px] leading-[1.1] font-semibold text-[#3f4650]">Estelle Darcy</p>
                    <p className="text-[6.6px] leading-[1.2] text-[#5f6672]">Wardiere Inc. / CEO</p>
                    <p className="text-[6.2px] leading-[1.2] text-[#6f7580] mt-0.5">Phone: {data.personalInfo.phone || '+123-456-7890'}</p>
                    <p className="text-[6.2px] leading-[1.2] text-[#6f7580]">Email: {truncate(data.personalInfo.email || 'hello@reallygreatsite.com', 36)}</p>
                  </div>
                  <div>
                    <p className="text-[8.3px] leading-[1.1] font-semibold text-[#3f4650]">Harper Russo</p>
                    <p className="text-[6.6px] leading-[1.2] text-[#5f6672]">Wardiere Inc. / CEO</p>
                    <p className="text-[6.2px] leading-[1.2] text-[#6f7580] mt-0.5">Phone: {data.personalInfo.phone || '+123-456-7890'}</p>
                    <p className="text-[6.2px] leading-[1.2] text-[#6f7580]">Email: {truncate(data.personalInfo.email || 'hello@reallygreatsite.com', 36)}</p>
                  </div>
                </div>
              </section>
            </main>
          </div>
        </div>
      </SectionOrderContext.Provider>
    </SectionStylesContext.Provider>
  );
}

export function ConsultingPrimeTemplate({ data, config, styleOverrides, sectionVisibility, sectionStyles, sectionOrder }: PremiumTemplateProps) {
  const t = useTheme(config);
  return (
    <SectionStylesContext.Provider value={sectionStyles || {}}>
      <SectionOrderContext.Provider value={sectionOrder || []}>
        <div style={{ fontFamily: t.font, color: t.text }} className="bg-white p-8">
          <HeaderBlock data={data} config={config} styleOverrides={styleOverrides} sectionVisibility={sectionVisibility} compact />
          <div className="mt-6 grid grid-cols-12 gap-6">
            <main className="col-span-12 lg:col-span-8 flex flex-col gap-5">
              <Experience data={data} config={config} styleOverrides={styleOverrides} sectionVisibility={sectionVisibility} title="Consulting Engagements" />
              <Projects data={data} config={config} sectionVisibility={sectionVisibility} />
            </main>
            <aside className="col-span-12 lg:col-span-4 flex flex-col gap-5">
              <Summary data={data} config={config} styleOverrides={styleOverrides} sectionVisibility={sectionVisibility} />
              <Skills data={data} config={config} sectionVisibility={sectionVisibility} title="Advisory Capabilities" />
              <Education data={data} config={config} styleOverrides={styleOverrides} sectionVisibility={sectionVisibility} />
              <Certifications data={data} config={config} sectionVisibility={sectionVisibility} />
            </aside>
          </div>
        </div>
      </SectionOrderContext.Provider>
    </SectionStylesContext.Provider>
  );
}

export function ProductLeadTemplate({ data, config, styleOverrides, sectionVisibility, sectionStyles, sectionOrder }: PremiumTemplateProps) {
  void config;
  void styleOverrides;
  void sectionStyles;
  void sectionOrder;
  const fullName = (data.personalInfo.fullName || 'JULIANA SILVA').toUpperCase();
  const jobTitle = data.personalInfo.jobTitle || 'Senior Graphic Designer';
  const summary = data.personalInfo.summary || 'I am a senior graphic designer with 10 years experience in graphic design and UX design. I am also experienced in coordinating a team of mid-level designers.';

  const experiences = (data.experiences.length
    ? data.experiences
    : [
        {
          id: 'pl-exp-1',
          company: 'Fauget',
          position: 'Senior Graphic Designer',
          location: '',
          startDate: 'Oct 2019',
          endDate: '',
          current: true,
          description: [
            'Design concept development and implementation for the main product application',
            'Leading a team of five mid-level designers'
          ]
        },
        {
          id: 'pl-exp-2',
          company: 'Studio Showde',
          position: 'Graphic Designer',
          location: '',
          startDate: 'Dec 2015',
          endDate: 'Sep 2019',
          current: false,
          description: [
            'Creating and editing graphic design assets for the web application and website',
            'Developing and editing social media templates'
          ]
        },
        {
          id: 'pl-exp-3',
          company: 'Borcelle',
          position: 'Graphic Design Intern',
          location: '',
          startDate: 'Jul 2014',
          endDate: 'Oct 2015',
          current: false,
          description: [
            'Helping with day-to-day project tasks',
            'Editing photos for client projects'
          ]
        }
      ]).slice(0, 3);

  const education = (data.education.length
    ? data.education
    : [
        {
          id: 'pl-edu-1',
          institution: 'Keithston and Partners',
          degree: 'Masters in Graphic Design',
          field: '',
          startDate: '2013',
          endDate: '2015',
          current: false
        },
        {
          id: 'pl-edu-2',
          institution: 'Keithston and Partners',
          degree: 'BA Graphic Design',
          field: '',
          startDate: '2010',
          endDate: '2013',
          current: false
        }
      ]).slice(0, 2);

  const allSkills = (data.skills.length
    ? data.skills
    : [
        { id: 'pl-s1', name: 'UX Design', level: 4 },
        { id: 'pl-s2', name: 'Graphics Design', level: 4 },
        { id: 'pl-s3', name: 'Project Management', level: 4 },
        { id: 'pl-s4', name: 'Branding', level: 4 },
        { id: 'pl-s5', name: 'Graphic Design Software', level: 4 },
        { id: 'pl-s6', name: 'Software for Design', level: 4 },
        { id: 'pl-s7', name: 'Another Software', level: 3 },
        { id: 'pl-s8', name: 'Team Communication', level: 4 },
        { id: 'pl-s9', name: 'Software', level: 3 },
        { id: 'pl-s10', name: 'Graphics Software', level: 3 }
      ]).filter((s) => hasText(s.name));

  const expertise = allSkills.slice(0, 4);
  const softwareKnowledge = allSkills.slice(4, 8);
  const personalSkills = data.certifications.length
    ? data.certifications.map((c) => c.name).filter(Boolean).slice(0, 5)
    : ['Creativity', 'Team building', 'Communication', 'Problem Solving', 'Leadership'];

  const profileImage = data.personalInfo.profileImage || 'https://images.pexels.com/photos/16162594/pexels-photo-16162594.jpeg';

  return (
    <SectionStylesContext.Provider value={sectionStyles || {}}>
      <SectionOrderContext.Provider value={sectionOrder || []}>
        <div
          className="w-full min-h-full bg-[#efefed] text-[#2d2d2a]"
          style={{ fontFamily: '"Baskerville Old Face", "Times New Roman", serif', aspectRatio: '210 / 297' }}
          dir="ltr"
        >
          <div className="h-full w-full box-border">
            <div className="h-full w-full grid grid-cols-[29.5%_69.5%]">
              <aside className="pl-[7mm] m-0 pr-5 pt-[7mm] pb-[7mm] border-r border-[#8f8e8a]">
                <div className="w-[182px] h-[231px] bg-[#e2ddd3] p-[10px] mb-3">
                  <div className="w-full h-full bg-[#d1ccc1] overflow-hidden">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-[#cfc8ba]" />
                    )}
                  </div>
                </div>
                <section className="mb-6">
                  <h3 className="text-[15px] leading-none font-medium uppercase tracking-[0.2em] mb-2.5">Contact</h3>
                  <ul className="space-y-1.5 text-[11px]">
                    <li>☎ {data.personalInfo.phone || '123-456-7890'}</li>
                    <li>✉ {data.personalInfo.email || 'hello@reallygreatsite.com'}</li>
                    <li>🌐 {data.personalInfo.website || 'www.reallygreatsite.com'}</li>
                  </ul>
                </section>

                {sectionVisible(sectionVisibility, 'skills') && (
                  <section className="mb-6">
                    <h3 className="text-[15px] leading-none font-medium uppercase tracking-[0.2em] mb-2.5">Expertise</h3>
                    <ul className="space-y-1.5 text-[11px]">
                      {expertise.map((skill) => (
                        <li key={skill.id}>{skill.name}</li>
                      ))}
                    </ul>
                  </section>
                )}

                {sectionVisible(sectionVisibility, 'skills') && (
                  <section className="mb-6">
                    <h3 className="text-[15px] leading-none font-medium uppercase tracking-[0.2em] mb-2.5">Software Knowledge</h3>
                    <ul className="space-y-1.5 text-[11px]">
                      {softwareKnowledge.map((skill) => (
                        <li key={skill.id}>{skill.name}</li>
                      ))}
                    </ul>
                  </section>
                )}

                <section>
                  <h3 className="text-[15px] leading-none font-medium uppercase tracking-[0.2em] mb-2.5">Personal Skills</h3>
                  <ul className="space-y-1.5 text-[11px]">
                    {personalSkills.map((skill, idx) => (
                      <li key={`${skill}-${idx}`}>{skill}</li>
                    ))}
                  </ul>
                </section>
              </aside>

              <main className="pl-8 pr-[7mm] pt-[7mm] pb-[7mm]">
                <header className="pb-3 border-b border-[#6f6d68] mb-6">
                  <h1 className="text-[34px] uppercase tracking-[0.14em] font-semibold leading-none text-[#6d5a37]">{fullName}</h1>
                  <p className="text-[20px] mt-1.5 leading-none">{jobTitle}</p>
                </header>

                {sectionVisible(sectionVisibility, 'personal') && (
                  <section className="mb-6">
                    <h2 className="text-[18px] uppercase tracking-[0.12em] text-[#6b5b43] mb-2.5">Personal Profile</h2>
                    <p className="text-[13px] leading-[1.4]">{summary}</p>
                  </section>
                )}

                {sectionVisible(sectionVisibility, 'experience') && (
                  <section className="mb-6 border-t border-[#6f6d68] pt-4">
                    <h2 className="text-[18px] uppercase tracking-[0.12em] text-[#6b5b43] mb-3">Work Experience</h2>
                    <div className="space-y-4">
                      {experiences.map((exp) => (
                        <article key={exp.id}>
                          <h3 className="text-[13px] uppercase tracking-[0.12em] font-semibold">{exp.position}</h3>
                          <p className="text-[14px] italic leading-none mt-1">
                            {exp.company} | {exp.startDate || '-'} - {exp.current ? 'present' : exp.endDate || '-'}
                          </p>
                          <ul className="mt-1.5 text-[11px] leading-[1.34]">
                            {exp.description.filter(Boolean).slice(0, 2).map((line, idx) => (
                              <li key={idx}>- {line}</li>
                            ))}
                          </ul>
                        </article>
                      ))}
                    </div>
                  </section>
                )}

                {sectionVisible(sectionVisibility, 'education') && (
                  <section className="border-t border-[#6f6d68] pt-4">
                    <h2 className="text-[18px] uppercase tracking-[0.12em] text-[#6b5b43] mb-3">Education</h2>
                    <div className="space-y-4">
                      {education.map((e) => (
                        <article key={e.id}>
                          <h3 className="text-[13px] uppercase tracking-[0.12em] font-semibold">{e.degree}</h3>
                          <p className="text-[14px] italic leading-none mt-1">
                            {e.institution} | {e.startDate || '-'} - {e.current ? 'present' : e.endDate || '-'}
                          </p>
                        </article>
                      ))}
                    </div>
                  </section>
                )}
              </main>
            </div>
          </div>
        </div>
      </SectionOrderContext.Provider>
    </SectionStylesContext.Provider>
  );
}

export function JulianaSilvaTemplate({ data, config, styleOverrides, sectionVisibility, sectionStyles, sectionOrder }: PremiumTemplateProps) {
  void config;
  void styleOverrides;
  void sectionStyles;
  void sectionOrder;
  const fullName = (data.personalInfo.fullName || 'JULIANA SILVA').toUpperCase();
  const [firstName, ...lastNameParts] = fullName.split(/\s+/);
  const lastName = lastNameParts.join(' ');
  const jobTitle = data.personalInfo.jobTitle || 'Grafisch vormgever';
  const website = data.personalInfo.website || 'www.reallygreatsite.com';
  const experiences = (
    data.experiences.length
      ? data.experiences
      : [
          {
            id: 'js-exp-1',
            company: website,
            position: 'Grafisch vormgever',
            location: '',
            startDate: '2020',
            endDate: '',
            current: true,
            description: [
              "Het ontwerpen en uitwerken van logo's, flyers en het vormgeven van een huisstijl. Daarnaast heb ik bijgedragen aan de strategie bepaling."
            ]
          },
          {
            id: 'js-exp-2',
            company: website,
            position: 'Stagiaire Vormgeving',
            location: '',
            startDate: '2018',
            endDate: '2019',
            current: false,
            description: [
              'Het vormgeven van huisstijl elementen zoals visitekaartjes. Daarnaast mocht ik de promotie flyers vormgeven en heb ik ervaring opgedaan met webdesign.'
            ]
          }
        ]
  ).slice(0, 2);
  const education = (
    data.education.length
      ? data.education
      : [
        {
          id: 'js-edu-1',
          institution: website,
          degree: 'Cursus ondernemingsschap',
          field: '',
          startDate: '2019',
          endDate: '',
          current: false
        },
        {
          id: 'js-edu-2',
          institution: website,
          degree: 'Mediavormgever',
          field: '',
          startDate: '2016',
          endDate: '2018',
          current: false
          }
        ]
  ).slice(0, 2);
  const allSkills = (
    data.skills.length
      ? data.skills
      : [
          { id: 'js-s1', name: 'Strategie bepaling', level: 5 },
          { id: 'js-s2', name: 'Visueel ontwerp', level: 5 },
          { id: 'js-s3', name: 'Leiderschap', level: 4 },
          { id: 'js-s4', name: 'Web ontwerp', level: 4 }
        ]
  ).filter((s) => hasText(s.name));
  const expertise = allSkills.slice(0, 4);
  const languages = (
    data.languages.length
      ? data.languages
      : [
          { id: 'js-l1', name: 'Nederlands', proficiency: 'Moedertaal' },
          { id: 'js-l2', name: 'Engels', proficiency: 'Vloeiend' },
          { id: 'js-l3', name: 'Spaans', proficiency: 'Goed' },
          { id: 'js-l4', name: 'Duits', proficiency: 'Beperkt' }
        ]
  ).slice(0, 4);
  const profileImage = data.personalInfo.profileImage || '/julianaSilva.png';
  const contactPhone = data.personalInfo.phone || '+123-456-7890';
  const contactAddress = data.personalInfo.address || '123 Anywhere St., Any City, ST 12345';
  const contactEmail = data.personalInfo.email || 'hello@reallygreatsite.com';

  return (
  <SectionStylesContext.Provider value={sectionStyles || {}}>
    <SectionOrderContext.Provider value={sectionOrder || []}>
      <div className="w-full min-h-screen flex justify-center bg-[#e5e5e5] py-10">
        <div
          className=""
          style={{
            width: "210mm",
            height: "297mm",
            fontFamily: '"Nunito Sans", "Segoe UI", Arial, sans-serif'
          }}
          dir="ltr"
        >
          <div className="w-full h-full p-[10mm] box-border">
            <div className="grid h-full grid-cols-[44%_56%] gap-[18px]">

              {/* LEFT SIDE */}
              <aside className="flex flex-col gap-[18px]">

                {/* IMAGE */}
                <div className="rounded-[28px] overflow-hidden h-[118mm] bg-[#cfd6db]">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover object-center"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#b8c0c6]" />
                  )}
                </div>

                {/* BLUE PANEL */}
                <div className="rounded-[28px] bg-[#377d98] text-white p-[24px] flex-1 flex flex-col">

                  {/* CONTACT */}
                  <section className="mb-[20px]">
                    <h3 className="text-[22px] font-extrabold mb-[10px]">
                      Contact
                    </h3>
                    <ul className="space-y-[6px] text-[13px] leading-[1.4]">
                      <li>{contactPhone}</li>
                      <li>{contactAddress}</li>
                      <li>{contactEmail}</li>
                    </ul>
                  </section>

                  {/* EXPERTISE */}
                  {sectionVisible(sectionVisibility, 'skills') && (
                    <section className="mb-[10px]">
                      <h3 className="text-[22px] font-extrabold mb-[10px]">
                        Expertise
                      </h3>
                      <ul className="space-y-[6px] text-[13px] list-disc pl-[18px]">
                        {expertise.map((skill) => (
                          <li key={skill.id}>{skill.name}</li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {/* LANGUAGES */}
                  {sectionVisible(sectionVisibility, 'languages') && (
                    <section>
                      <h3 className="text-[22px] font-extrabold mb-[10px]">
                        Talen
                      </h3>
                      <div className="space-y-[6px] text-[13px]">
                        {languages.map((lang) => (
                          <div key={lang.id} className="flex justify-between">
                            <span className="font-bold">{lang.name}</span>
                            <span>{lang.proficiency || "Goed"}</span>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                </div>
              </aside>

              {/* RIGHT SIDE */}
              <main className="flex flex-col gap-[18px]">

                {/* HEADER */}
                <header>
                  <h1
                    className="text-[#2f7d98] uppercase font-bold leading-[0.85]"
                    style={{
                      fontSize: "64px",
                      fontFamily: '"Playfair Display", serif'
                    }}
                  >
                    <span className="block">{firstName}</span>
                    <span className="block">{lastName}</span>
                  </h1>

                  <p className="text-[20px] mt-[12px] font-medium text-[#11151a]">
                    {jobTitle}
                  </p>
                </header>

                {/* EXPERIENCE */}
                {sectionVisible(sectionVisibility, 'experience') && (
                  <section className="rounded-[28px] bg-[#d8e6ef] p-[24px] flex-1">
                    <h2 className="text-[22px] font-extrabold mb-[14px] text-[#0f1720]">
                      Ervaring
                    </h2>

                    <div className="space-y-[18px] text-[14px]">
                      {experiences.map((exp) => (
                        <article key={exp.id}>
                          <p className="font-extrabold">
                            {exp.startDate || "-"}-{exp.current ? "Heden" : exp.endDate || "-"} {exp.position}
                          </p>

                          <p className="text-[12px] mt-[4px] text-[#1f2a35]">
                            {exp.company || website}
                          </p>

                          <p className="mt-[8px] leading-[1.55] text-[#202d38]">
                            {exp.description.filter(Boolean).slice(0, 1).join(" ")}
                          </p>
                        </article>
                      ))}
                    </div>
                  </section>
                )}

                {/* EDUCATION */}
                {sectionVisible(sectionVisibility, 'education') && (
                  <section className="relative rounded-[28px] bg-[#bcd8e8] p-[24px] flex-1">
                    <h2 className="text-[22px] font-extrabold mb-[14px] text-[#0f1720]">
                      Studie
                    </h2>

                    <div className="space-y-[18px] text-[14px]">
                      {education.map((e) => (
                        <article key={e.id}>
                          <p className="font-extrabold">
                            {e.startDate || "-"}
                            {e.endDate ? `-${e.endDate}` : ""} {e.degree}
                          </p>

                          <p className="text-[12px] mt-[4px] text-[#1f2a35]">
                            {e.institution || website}
                          </p>

                          {hasText(e.field) && (
                            <p className="mt-[8px] leading-[1.55] text-[#202d38]">
                              {e.field}
                            </p>
                          )}
                        </article>
                      ))}
                    </div>
                  </section>
                )}

              </main>
            </div>
          </div>
        </div>
      </div>
    </SectionOrderContext.Provider>
  </SectionStylesContext.Provider>
  );
}

export function AlidaPlanetTemplate({ data, config, styleOverrides, sectionVisibility, sectionStyles, sectionOrder }: PremiumTemplateProps) {
  void config;
  void styleOverrides;

  const nameTokens = (data.personalInfo.fullName || 'EMMA JAMES ROBERTSON').trim().split(/\s+/).filter(Boolean);
  const nameLine1 = (nameTokens.slice(0, 2).join(' ') || 'EMMA JAMES').toUpperCase();
  const nameLine2 = (nameTokens.slice(2).join(' ') || 'ROBERTSON').toUpperCase();
  const jobTitle = (data.personalInfo.jobTitle || 'TONEEL- EN FILMACTRICE').toUpperCase();
  const profileImage = data.personalInfo.profileImage || 'https://media.istockphoto.com/id/2172317014/photo/happy-hispanic-man-working-on-laptop-at-home.jpg?b=1&s=612x612&w=0&k=20&c=ukqKyfuXrrr3JQ9JQ_XFPVldwCAyNOAqgthkRiRcbzs=';
  const summary =
    data.personalInfo.summary ||
    'Ik ben actrice en heb in verschillende toneelstukken gespeeld, zoals Rent in Carré en Miss Saigon in de Ahoy. Ik heb in verschillende onafhankelijke films gespeeld en hou me ook bezig met kostuum- en productiewerk.';

  const education = (data.education.length
    ? data.education
    : [
        {
          id: 'em-edu-1',
          institution: 'Beekstad Theateracademie',
          degree: 'Bachelor Schone Kunsten in Theater Kunst Minor in Toneelproductie',
          field: '',
          startDate: '2013',
          endDate: '',
          current: false
        },
        {
          id: 'em-edu-2',
          institution: 'Stanford Toneel- en acteerworkshop',
          degree: 'Certificaat voor Acteren',
          field: '',
          startDate: '2012',
          endDate: '',
          current: false
        }
      ]).slice(0, 2);

  const toneel = (data.experiences.length
    ? data.experiences
    : [
        { id: 'em-ex1', company: 'Foxland Gracie', position: '', location: '', startDate: '2014', endDate: '', current: false, description: [] },
        { id: 'em-ex2', company: 'De geheimzinnige Huishoudster Stefanie', position: '', location: '', startDate: '2013', endDate: '', current: false, description: [] },
        { id: 'em-ex3', company: 'Madeline Anja', position: '', location: '', startDate: '2012', endDate: '', current: false, description: [] },
        { id: 'em-ex4', company: 'Cipres park Maartje', position: '', location: '', startDate: '2010', endDate: '', current: false, description: [] }
      ]).slice(0, 4);

  const film = (data.projects.length
    ? data.projects
    : [
        { id: 'em-pr1', name: 'Kaarten naar de melkweg', description: ['Bijrol | Alexa'], technologies: [], startDate: '2014', endDate: '', current: false },
        { id: 'em-pr2', name: 'Een vreselijke schoonheid', description: ['Ondersteunend | Katrina'], technologies: [], startDate: '2013', endDate: '', current: false },
        { id: 'em-pr3', name: 'De jager', description: ['Hoofdrol | Sam'], technologies: [], startDate: '2012', endDate: '', current: false }
      ]).slice(0, 3);

  const stats = (data.certifications.length
    ? data.certifications
    : [
        { id: 'em-st-1', name: 'Haarkleur', issuer: 'Blond Grijs', date: '', doesNotExpire: true },
        { id: 'em-st-2', name: 'Ogen', issuer: '', date: '', doesNotExpire: true },
        { id: 'em-st-3', name: 'Gewicht', issuer: '53 kg', date: '', doesNotExpire: true },
        { id: 'em-st-4', name: 'Lengte', issuer: '1,65 m', date: '', doesNotExpire: true }
      ]).slice(0, 4);

  const specialSkills = data.skills.length
    ? data.skills.map((s) => s.name).filter(hasText).join(', ')
    : 'Beatboksen, ballet, stijldansen, yoga';
  const languages = data.languages.length
    ? data.languages.map((l) => l.name).filter(hasText).join(', ')
    : 'Engels, Mandarijn, Frans';

  const phone = data.personalInfo.phone || '0275-565600.';
  const address = data.personalInfo.address || 'Overalstraat 123, 1234 AB Beekstad 020-76347658';
  const website = data.personalInfo.website || 'www.emmajansen.nl';
  const email = data.personalInfo.email || '';

  return (
   <SectionStylesContext.Provider value={sectionStyles || {}}>
  <SectionOrderContext.Provider value={sectionOrder || []}>
    <div
    dir="ltr"
      className="w-full bg-[#e6e6e8] text-[#2f333b]"
      style={{
        fontFamily: '"Lato", Arial, sans-serif',
        aspectRatio: '210 / 297'
      }}
    >
      <div className="grid grid-cols-[39%_61%] h-full">

        {/* LEFT COLUMN */}
        <aside className="grid grid-rows-[22% 79%] h-full">

          {/* IMAGE */}
          <div className="overflow-hidden">
            <img
              src={profileImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          {/* ORANGE PANEL */}
          <div className="bg-[#e39a12] text-[#f5e6c9] px-[28px] pt-[26px] pb-[24px]">

            {/* CONTACT */}
            <section className="mb-[26px]">
              <h3
                className="uppercase text-[22px] tracking-[0.06em]"
                style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 500 }}
              >
                Contact
              </h3>
              <div className="mt-[10px] text-[12px] leading-[1.35] tracking-[0.04em] space-y-[2px]">
                <p>{phone}</p>
                <p>{address}</p>
                <p>{website}</p>
                {email && <p>{email}</p>}
              </div>
            </section>

            {/* STATISTIEKEN */}
            <section className="mb-[24px]">
              <h3
                className="uppercase text-[22px] tracking-[0.06em]"
                style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 500 }}
              >
                Statistieken
              </h3>

              <div className="mt-[10px] text-[12px] leading-[1.3] space-y-[4px]">
                {stats.map((s) => (
                  <div key={s.id} className="grid grid-cols-[90px_1fr]">
                    <p className="font-semibold">{s.name}</p>
                    <p>{s.issuer}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* FILM */}
            {sectionVisible(sectionVisibility, 'projects') && (
              <section className="mb-[24px]">
                <h3
                  className="uppercase text-[22px] tracking-[0.06em]"
                  style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 500 }}
                >
                  Film
                </h3>

                <div className="mt-[10px] space-y-[10px] text-[12px]">
                  {film.map((item) => (
                    <div key={item.id} className="grid grid-cols-[60px_1fr] gap-[6px]">
                      <p className="font-bold">{item.startDate}</p>
                      <div>
                        <p>{item.name}</p>
                        <p>{item.description?.[0]}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* TALEN */}
            {sectionVisible(sectionVisibility, 'languages') && (
              <section>
                <h3
                  className="uppercase text-[22px] tracking-[0.06em]"
                  style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 500 }}
                >
                  Talen
                </h3>
                <p className="mt-[10px] text-[12px] tracking-[0.05em]">
                  {languages}
                </p>
              </section>
            )}
          </div>
        </aside>

        {/* RIGHT COLUMN */}
        <main className="px-[40px] pt-[40px] pb-[30px]">

          {/* HEADER */}
          <header className="mb-[34px]">
            <h1
              className="uppercase leading-[0.95] tracking-[0.08em] text-[#c88a2a]"
              style={{
                fontFamily: '"Cormorant Garamond", serif',
                fontSize: '52px',
                fontWeight: 500
              }}
            >
              <span className="block">{nameLine1}</span>
              <span className="block">{nameLine2}</span>
            </h1>

            <p className="mt-[10px] text-[17px] tracking-[0.25em] font-black uppercase">
              {jobTitle}
            </p>
          </header>

          {/* PROFIEL */}
          <section className="mb-[24px]">
            <h2
              className="uppercase text-[22px] tracking-[0.07em] text-[#c79440]"
              style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 500 }}
            >
              Profiel
            </h2>
            <p className="mt-[8px] text-[12px] leading-[1.45] tracking-[0.05em] max-w-[420px]">
              {summary}
            </p>
          </section>

          {/* OPLEIDING */}
          {sectionVisible(sectionVisibility, 'education') && (
            <section className="mb-[22px]">
              <h2
                className="uppercase text-[22px] tracking-[0.07em] text-[#c79440]"
                style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 500 }}
              >
                Opleiding
              </h2>

              <div className="mt-[10px] space-y-[10px] text-[12px]">
                {education.map((item) => (
                  <div key={item.id} className="grid grid-cols-[60px_1fr] gap-[8px]">
                    <p className="font-bold">{item.startDate}</p>
                    <div>
                      <p>{item.institution} {item.degree}</p>
                      {item.field && <p>{item.field}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* TONEEL */}
          {sectionVisible(sectionVisibility, 'experience') && (
            <section className="mb-[22px]">
              <h2
                className="uppercase text-[22px] tracking-[0.07em] text-[#c79440]"
                style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 500 }}
              >
                Toneel
              </h2>

              <div className="mt-[10px] space-y-[12px]">
                {toneel.map((item, i) => (
                  <div key={item.id} className="grid grid-cols-[60px_1fr] gap-[8px]">
                    <p className="text-[12px] font-bold">{item.startDate}</p>
                    <p className={`${i === 0 ? 'text-[22px] tracking-[0.1em]' : 'text-[12px] tracking-[0.06em]'}`}>
                      {item.company || item.position}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* SPECIAL SKILLS */}
          {sectionVisible(sectionVisibility, 'skills') && (
            <section>
              <h2
                className="uppercase text-[22px] tracking-[0.07em] text-[#c79440]"
                style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 500 }}
              >
                Speciale vaardigheden
              </h2>
              <p className="mt-[10px] text-[12px] tracking-[0.06em]">
                {specialSkills}
              </p>
            </section>
          )}

        </main>
      </div>
    </div>
  </SectionOrderContext.Provider>
</SectionStylesContext.Provider>
  );
}
