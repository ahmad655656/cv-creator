'use client';

import { createContext, useContext } from 'react';
import { CVData } from '@/components/cvs/types';
import { TemplateConfig } from '@/components/cvs/editor/types/templateConfig';

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
  const font = config?.fontFamily || 'Cairo';
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
const sectionStyleFor = (
  sectionStyles: Record<string, Record<string, string | number>>,
  sectionOrder: string[],
  sectionId: string,
  base: Record<string, string | number> = {}
) => {
  const order = sectionOrder.indexOf(sectionId);
  return {
    ...base,
    ...(sectionStyles[sectionId] || {}),
    order: order === -1 ? 999 : order
  };
};
const styleFor = (
  styleOverrides: PremiumTemplateProps['styleOverrides'],
  key: string,
  base: Record<string, string | number> = {}
) => ({ ...base, ...(styleOverrides?.[key] || {}) });
const mergeStyles = (
  styleOverrides: PremiumTemplateProps['styleOverrides'],
  keys: string[],
  base: Record<string, string | number> = {}
) =>
  keys.reduce((acc, key) => ({ ...acc, ...(styleOverrides?.[key] || {}) }), { ...base });

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
        background: `linear-gradient(110deg, ${t.primary}, ${t.secondary})`,
        color: t.headerText
      })}
    >
      <div className="flex items-center gap-4" style={{ flexDirection: isNameRTL ? 'row-reverse' : 'row' }}>
        <ProfileAvatar image={data.personalInfo.profileImage} size={compact ? 58 : 72} />
        <div dir={headerDir} style={{ textAlign: isNameRTL ? 'right' : 'left' }}>
          <h1
            dir="auto"
            style={styleFor(styleOverrides, 'fullName', {
              fontSize: `${config?.nameSize || 38}px`,
              fontFamily: t.headingFont,
              fontWeight: 800
            })}
          >
            {data.personalInfo.fullName || 'Your Name'}
          </h1>
          <p
            dir="auto"
            style={styleFor(styleOverrides, 'jobTitle', { fontSize: `${config?.titleSize || 20}px`, opacity: 0.95 })}
          >
            {data.personalInfo.jobTitle || 'Job Title'}
          </p>
          <p
            dir="auto"
            className="mt-2 text-sm opacity-90"
            style={mergeStyles(styleOverrides, ['email', 'phone', 'address'])}
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
      className="mb-4 pb-2 border-b-2 tracking-wide uppercase"
      style={{
        borderColor: t.primary,
        color: t.heading,
        fontFamily: t.headingFont,
        fontWeight: 800,
        fontSize: `${config?.sectionTitleSize || 20}px`,
        letterSpacing: '0.02em'
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
    <section style={sectionStyleFor(sectionStyles, sectionOrder, 'personal')}>
      <SectionTitle config={config}>Professional Summary</SectionTitle>
      <p
        dir="auto"
        style={styleFor(styleOverrides, 'summary', {
          color: t.text,
          fontSize: `${config?.bodySize || 14}px`,
          lineHeight: config?.lineHeight || 1.6
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
    <section style={sectionStyleFor(sectionStyles, sectionOrder, 'experience')}>
      <SectionTitle config={config}>{title}</SectionTitle>
      <div className="space-y-4">
        {data.experiences.map((exp) => (
          <article
            key={exp.id}
            className="rounded-xl border p-4"
            style={{ borderColor: `${t.primary}26`, background: `${t.primary}07` }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
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
                    fontSize: `${Math.max((config?.bodySize || 14) - 1, 11)}px`
                  })}
                >
                  {[exp.company, exp.location].filter(hasText).join(' - ')}
                </p>
              </div>
              <span
                className="px-2 py-1 rounded-md"
                style={styleFor(styleOverrides, `exp-${exp.id}-date`, {
                  color: t.muted,
                  fontSize: '12px',
                  background: '#ffffff'
                })}
              >
                {dateRange(exp.startDate, exp.endDate, exp.current)}
              </span>
            </div>
            {exp.description?.filter(Boolean).length ? (
              <ul className="mt-2 space-y-1" style={{ fontSize: `${config?.bodySize || 14}px`, color: t.text }}>
                {exp.description.filter(Boolean).map((line, idx) => (
                  <li key={idx} dir="auto" style={styleFor(styleOverrides, `exp-${exp.id}-desc-${idx}`)}>
                    - {line}
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
    <section style={sectionStyleFor(sectionStyles, sectionOrder, 'education')}>
      <SectionTitle config={config}>Education</SectionTitle>
      <div className="space-y-3">
        {data.education.map((e) => (
          <article key={e.id} className="rounded-xl border p-3" style={{ borderColor: `${t.primary}22` }}>
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
  if (!sectionVisible(sectionVisibility, 'skills')) return null;
  if (!data.skills.length) return null;
  return (
    <section style={sectionStyleFor(sectionStyles, sectionOrder, 'skills')}>
      <SectionTitle config={config}>{title}</SectionTitle>
      <div className="space-y-2.5">
        {data.skills.map((s) => (
          <div key={s.id} className="rounded-lg border p-2.5 text-sm" style={{ borderColor: `${t.primary}22` }}>
            <div className="mb-1.5 flex items-center justify-between">
              <span dir="auto" className="font-medium">{s.name}</span>
              <span style={{ color: t.primary, fontWeight: 700 }}>{s.level}/5</span>
            </div>
            <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${Math.max(0, Math.min(100, (s.level / 5) * 100))}%`, background: `linear-gradient(90deg, ${t.primary}, ${t.secondary})` }}
              />
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
    <section style={sectionStyleFor(sectionStyles, sectionOrder, 'languages')}>
      <SectionTitle config={config}>Languages</SectionTitle>
      <div className="space-y-2">
        {data.languages.map((lang) => (
          <div key={lang.id} className="flex items-center justify-between text-sm">
            <span dir="auto">{lang.name}</span>
            <span dir="auto" style={{ color: t.muted }}>{lang.proficiency}</span>
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
    <section style={sectionStyleFor(sectionStyles, sectionOrder, 'certifications')}>
      <SectionTitle config={config}>Certifications</SectionTitle>
      <div className="space-y-3">
        {data.certifications.map((c) => (
          <article key={c.id} className="text-sm">
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
    <section style={sectionStyleFor(sectionStyles, sectionOrder, 'projects')}>
      <SectionTitle config={config}>Projects</SectionTitle>
      <div className="space-y-4">
        {data.projects.map((p) => (
          <article key={p.id} className="rounded-xl border p-4" style={{ borderColor: `${t.primary}20` }}>
            <div className="flex items-start justify-between gap-4">
              <h3 dir="auto" style={{ color: t.heading, fontFamily: t.headingFont, fontWeight: 700 }}>{p.name}</h3>
              <span style={{ color: t.muted, fontSize: '12px' }}>{dateRange(p.startDate, p.endDate, p.current)}</span>
            </div>
            {p.description?.filter(Boolean).length ? (
              <ul className="mt-2 space-y-1 text-sm" style={{ color: t.text }}>
                {p.description.filter(Boolean).map((line, idx) => (
                  <li key={idx} dir="auto">- {line}</li>
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
    <div style={{ fontFamily: t.font, color: t.text }} className="bg-slate-50">
      <div className="flex flex-col">
        {showPersonalHeader && (
          <section
            className="w-full px-8 py-7"
            style={sectionStyleFor(sectionStyles || {}, sectionOrder || [], 'personal', {
              background: `linear-gradient(120deg, ${t.primary}, ${t.secondary})`,
              color: t.headerText
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
                      fontSize: `${config?.nameSize || 38}px`,
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

                <div className="text-sm opacity-90 text-right" dir="auto" style={mergeStyles(styleOverrides, ['email', 'phone', 'address'])}>
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
                <div className="rounded-xl px-3 py-2 text-center" style={{ background: 'rgba(255,255,255,0.12)' }}>
                  <p className="text-[11px] uppercase tracking-wide opacity-80">Experience</p>
                  <p className="font-bold">{data.experiences.length}</p>
                </div>
                <div className="rounded-xl px-3 py-2 text-center" style={{ background: 'rgba(255,255,255,0.12)' }}>
                  <p className="text-[11px] uppercase tracking-wide opacity-80">Projects</p>
                  <p className="font-bold">{data.projects.length}</p>
                </div>
                <div className="rounded-xl px-3 py-2 text-center" style={{ background: 'rgba(255,255,255,0.12)' }}>
                  <p className="text-[11px] uppercase tracking-wide opacity-80">Skills</p>
                  <p className="font-bold">{data.skills.length}</p>
                </div>
              </div>
            </div>
          </section>
        )}

        <div className="flex-1 p-6 md:p-7 grid grid-cols-1 xl:grid-cols-12 gap-5">
          <aside className="xl:col-span-4 flex flex-col gap-6">
            {hasSkills && (
              <div className="rounded-2xl p-4 border bg-white" style={{ borderColor: `${t.primary}30`, background: `${t.primary}08` }}>
                <Skills data={data} config={config} sectionVisibility={sectionVisibility} title="Core Competencies" />
              </div>
            )}
            {(hasLanguages || hasCertifications) && (
              <div className="rounded-2xl p-4 border bg-white" style={{ borderColor: `${t.secondary}2b` }}>
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

export function TechMasterProTemplate({ data, config, styleOverrides, sectionVisibility, sectionStyles, sectionOrder }: PremiumTemplateProps) {
  const t = useTheme(config);
  const hasSkills = sectionVisible(sectionVisibility, 'skills') && data.skills.length > 0;
  const hasLanguages = sectionVisible(sectionVisibility, 'languages') && data.languages.length > 0;
  const hasCertifications = sectionVisible(sectionVisibility, 'certifications') && data.certifications.length > 0;
  return (
    <SectionStylesContext.Provider value={sectionStyles || {}}>
      <SectionOrderContext.Provider value={sectionOrder || []}>
    <div style={{ fontFamily: t.font, color: t.text }}>
      <HeaderBlock data={data} config={config} styleOverrides={styleOverrides} sectionVisibility={sectionVisibility} />
      <div className="p-7 flex flex-col gap-6 bg-slate-50">
        {hasSkills && (
          <section className="rounded-2xl border p-4 bg-white" style={{ borderColor: `${t.primary}30` }}>
            <SectionTitle config={config}>Tech Stack Matrix</SectionTitle>
            <div className="grid grid-cols-2 gap-3">
              {data.skills.map((s) => (
                <div key={s.id} className="rounded-xl p-3 border" style={{ borderColor: `${t.secondary}2e` }}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{s.name}</span>
                    <span style={{ color: t.primary }}>{s.level}/5</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(s.level / 5) * 100}%`, background: `linear-gradient(90deg, ${t.primary}, ${t.secondary})` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        <Experience data={data} config={config} styleOverrides={styleOverrides} sectionVisibility={sectionVisibility} />
        <Projects data={data} config={config} sectionVisibility={sectionVisibility} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Education data={data} config={config} styleOverrides={styleOverrides} sectionVisibility={sectionVisibility} />
          {(hasLanguages || hasCertifications) && (
            <div className="flex flex-col gap-5">
              <Languages data={data} config={config} sectionVisibility={sectionVisibility} />
              <Certifications data={data} config={config} sectionVisibility={sectionVisibility} />
            </div>
          )}
        </div>
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
    <div style={{ fontFamily: t.font, color: t.text }}>
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
                fontSize: `${config?.nameSize || 38}px`,
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
        <aside className="col-span-1 flex flex-col gap-6 border-r pr-6" style={{ borderColor: `${t.primary}22` }}>
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
    <div style={{ fontFamily: t.font, color: t.text }}>
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
            <div className="rounded-2xl p-4" style={{ background: `${t.primary}12` }}>
              <Skills data={data} config={config} sectionVisibility={sectionVisibility} />
            </div>
          )}
          {(hasCertifications || hasLanguages) && (
            <div className="rounded-2xl p-4" style={{ background: `${t.secondary}10` }}>
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
      <div className="h-2" style={{ background: `linear-gradient(90deg, ${t.primary}, ${t.secondary})` }} />
      <HeaderBlock data={data} config={config} styleOverrides={styleOverrides} sectionVisibility={sectionVisibility} compact />
      <div className="p-8 flex flex-col gap-6">
        {(hasExperience || hasProjects || hasCertifications) && (
          <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl p-3 border text-center" style={{ borderColor: `${t.primary}25` }}><p className="text-xs text-gray-500">Experience</p><p className="font-bold">{data.experiences.length}</p></div>
          <div className="rounded-xl p-3 border text-center" style={{ borderColor: `${t.primary}25` }}><p className="text-xs text-gray-500">Projects</p><p className="font-bold">{data.projects.length}</p></div>
          <div className="rounded-xl p-3 border text-center" style={{ borderColor: `${t.primary}25` }}><p className="text-xs text-gray-500">Certs</p><p className="font-bold">{data.certifications.length}</p></div>
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
    <div style={{ fontFamily: t.font, color: t.text }} className="p-8 border-2" >
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
                fontSize: `${config?.nameSize || 38}px`,
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
    <div style={{ fontFamily: t.font, color: t.text }}>
      <HeaderBlock data={data} config={config} styleOverrides={styleOverrides} sectionVisibility={sectionVisibility} />
      <div className="p-7 flex flex-col gap-6" style={{ background: `linear-gradient(180deg, ${t.primary}08, transparent)` }}>
        <Summary data={data} config={config} styleOverrides={styleOverrides} sectionVisibility={sectionVisibility} />
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl p-4 bg-white border" style={{ borderColor: `${t.primary}25` }}>
            <Skills data={data} config={config} sectionVisibility={sectionVisibility} title="Marketing Skills" />
          </div>
          <div className="rounded-2xl p-4 bg-white border" style={{ borderColor: `${t.secondary}25` }}>
            <Projects data={data} config={config} sectionVisibility={sectionVisibility} />
          </div>
        </div>
        <Experience data={data} config={config} styleOverrides={styleOverrides} sectionVisibility={sectionVisibility} title="Campaign Experience" />
        <div className="grid grid-cols-2 gap-5">
          <Education data={data} config={config} styleOverrides={styleOverrides} sectionVisibility={sectionVisibility} />
          <Certifications data={data} config={config} sectionVisibility={sectionVisibility} />
        </div>
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
    <div style={{ fontFamily: t.font, color: t.text }} className="p-10">
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
        <aside className="col-span-4 flex flex-col gap-8 border-l pl-6" style={{ borderColor: `${t.primary}22` }}>
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
    <div style={{ fontFamily: t.font, color: t.text }} className="p-8">
      {showPersonalHeader && (
        <div
          className="rounded-3xl p-6 mb-6"
          style={sectionStyleFor(sectionStyles || {}, sectionOrder || [], 'personal', { background: `${t.primary}12`, textAlign: isNameRTL ? 'right' : 'left' })}
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
  const t = useTheme(config);
  const isNameRTL = isRTLText(data.personalInfo.fullName);
  const showPersonalHeader = sectionVisible(sectionVisibility, 'personal');
  return (
    <SectionStylesContext.Provider value={sectionStyles || {}}>
      <SectionOrderContext.Provider value={sectionOrder || []}>
    <div style={{ fontFamily: t.font, color: t.text }}>
      {showPersonalHeader && (
        <div
          className="p-8"
          style={sectionStyleFor(sectionStyles || {}, sectionOrder || [], 'personal', {
            background: `linear-gradient(120deg, ${t.primary}, ${t.secondary})`,
            color: t.headerText,
            textAlign: isNameRTL ? 'right' : 'left'
          })}
          dir={isNameRTL ? 'rtl' : 'ltr'}
        >
        <h1
          dir="auto"
          style={styleFor(styleOverrides, 'fullName', {
            fontFamily: t.headingFont,
            fontSize: `${config?.nameSize || 40}px`,
            fontWeight: 900
          })}
        >
          {data.personalInfo.fullName || 'Your Name'}
        </h1>
        <p dir="auto" className="opacity-90" style={styleFor(styleOverrides, 'jobTitle')}>
          {data.personalInfo.jobTitle || 'Sales Leader'}
        </p>
        </div>
      )}
      <div className="p-7 flex flex-col gap-6">
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl p-3 text-center" style={{ background: `${t.primary}14` }}><p className="text-xs">Deals</p><p className="font-bold">{data.projects.length}</p></div>
          <div className="rounded-xl p-3 text-center" style={{ background: `${t.secondary}14` }}><p className="text-xs">Roles</p><p className="font-bold">{data.experiences.length}</p></div>
          <div className="rounded-xl p-3 text-center" style={{ background: `${t.primary}14` }}><p className="text-xs">Skills</p><p className="font-bold">{data.skills.length}</p></div>
        </div>
        <Experience data={data} config={config} styleOverrides={styleOverrides} sectionVisibility={sectionVisibility} />
        <Projects data={data} config={config} sectionVisibility={sectionVisibility} />
        <div className="grid grid-cols-2 gap-5">
          <Skills data={data} config={config} sectionVisibility={sectionVisibility} />
          <Education data={data} config={config} styleOverrides={styleOverrides} sectionVisibility={sectionVisibility} />
        </div>
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
                background: `linear-gradient(180deg, ${t.primary}10, transparent)`
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
                      fontSize: `${config?.nameSize || 40}px`,
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
              <div className="rounded-2xl border p-4" style={{ borderColor: `${t.primary}2a`, background: `${t.primary}08` }}>
                <Skills data={data} config={config} sectionVisibility={sectionVisibility} />
              </div>
              <div className="rounded-2xl border p-4" style={{ borderColor: `${t.secondary}2a` }}>
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
        <div style={{ fontFamily: t.font, color: t.text }} className="bg-slate-50">
          {showPersonalHeader && (
            <header
              className="p-8"
              style={sectionStyleFor(sectionStyles || {}, sectionOrder || [], 'personal', {
                background: `linear-gradient(120deg, ${t.primary}, ${t.secondary})`,
                color: t.headerText
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
                        fontSize: `${config?.nameSize || 42}px`,
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
                <p className="text-sm opacity-90 text-right" dir="auto" style={mergeStyles(styleOverrides, ['email', 'phone', 'address'])}>
                  {[data.personalInfo.email, data.personalInfo.phone, data.personalInfo.address].filter(hasText).join(' | ')}
                </p>
              </div>
            </header>
          )}

          <div className="p-7 flex flex-col gap-6">
            <div className="grid grid-cols-3 gap-3">
              {metricBlock.map((item) => (
                <div key={item.label} className="rounded-xl p-3 bg-white border text-center" style={{ borderColor: `${t.primary}28` }}>
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
                <div className="rounded-2xl p-4 bg-white border" style={{ borderColor: `${t.secondary}28` }}>
                  <Skills data={data} config={config} sectionVisibility={sectionVisibility} />
                </div>
                <div className="rounded-2xl p-4 bg-white border" style={{ borderColor: `${t.primary}28` }}>
                  <Education data={data} config={config} styleOverrides={styleOverrides} sectionVisibility={sectionVisibility} />
                </div>
                <div className="rounded-2xl p-4 bg-white border" style={{ borderColor: `${t.primary}22` }}>
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
