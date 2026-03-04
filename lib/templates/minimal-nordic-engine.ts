import type { CVData, Education, Experience, Language, Skill } from '@/components/cvs/types';

type TemplateTokens = Record<string, string>;

const RTL_CHAR_PATTERN = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;

function isNonEmpty(value?: string | null) {
  return Boolean(value && value.trim().length > 0);
}

function escapeHtml(value?: string | null) {
  const text = value || '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function withLineBreaks(value?: string | null) {
  return escapeHtml(value).replace(/\r?\n/g, '<br />');
}

function detectDirection(value?: string | null): 'rtl' | 'ltr' {
  if (!isNonEmpty(value)) return 'ltr';
  return RTL_CHAR_PATTERN.test(value || '') ? 'rtl' : 'ltr';
}

function renderContactItem(icon: string, value?: string | null) {
  if (!isNonEmpty(value)) return '';
  return `<li><span class="mn-icon">${icon}</span><span class="mn-contact-value">${escapeHtml(value)}</span></li>`;
}

function renderEducationItem(item: Education) {
  const institution = isNonEmpty(item.institution) ? item.institution : '-';
  const degree = isNonEmpty(item.degree) ? item.degree : '-';
  const range = [item.startDate, item.current ? 'Present' : item.endDate].filter(isNonEmpty).join(' - ');
  return `
    <article class="mn-edu-item">
      <p class="mn-edu-degree">${escapeHtml(degree)}</p>
      <p class="mn-edu-inst">${escapeHtml(institution)}</p>
      ${isNonEmpty(range) ? `<p class="mn-edu-date">${escapeHtml(range)}</p>` : ''}
    </article>
  `;
}

function renderSkillItem(item: Skill) {
  if (!isNonEmpty(item.name)) return '';
  return `<li>${escapeHtml(item.name)}</li>`;
}

function renderLanguageItem(item: Language) {
  if (!isNonEmpty(item.name)) return '';
  return `<li>${escapeHtml(item.name)}</li>`;
}

function renderCertificationItem(item: { name?: string | null; issuer?: string | null; date?: string | null }) {
  if (!isNonEmpty(item.name)) return '';
  const issuerPart = isNonEmpty(item.issuer) ? ` - ${escapeHtml(item.issuer || '')}` : '';
  const datePart = isNonEmpty(item.date) ? ` (${escapeHtml(item.date || '')})` : '';
  return `<li>${escapeHtml(item.name || '')}${issuerPart}${datePart}</li>`;
}

function renderExperienceItem(item: Experience) {
  const range = [item.startDate, item.current ? 'present' : item.endDate].filter(isNonEmpty).join(' - ');
  const bullets = (item.description || [])
    .filter(isNonEmpty)
    .map((line) => `<li>${escapeHtml(line)}</li>`)
    .join('');
  return `
    <article class="mn-exp-item">
      ${isNonEmpty(range) ? `<p class="mn-exp-date">${escapeHtml(range)}</p>` : ''}
      ${isNonEmpty(item.company) ? `<p class="mn-exp-company">${escapeHtml(item.company)}</p>` : ''}
      ${isNonEmpty(item.position) ? `<p class="mn-exp-role">${escapeHtml(item.position)}</p>` : ''}
      ${bullets ? `<ul class="mn-exp-bullets">${bullets}</ul>` : ''}
    </article>
  `;
}

export function buildMinimalNordicTokens(data: CVData): TemplateTokens {
  const fallbackEmail = 'hello@reallygreatsite.com';
  const fallbackPhone = '+123-456-7890';
  const fallbackAddress = '123 Anywhere St., Any City';
  const refsPhone = data.personalInfo.phone || fallbackPhone;
  const refsEmail = data.personalInfo.email || fallbackEmail;
  const website =
    data.personalInfo.website ||
    (isNonEmpty(data.personalInfo.email) && data.personalInfo.email.includes('@')
      ? data.personalInfo.email.split('@')[1].toLowerCase()
      : 'reallygreatsite.com');

  const contactItems = [
    renderContactItem('✉', data.personalInfo.email || fallbackEmail),
    renderContactItem('☎', data.personalInfo.phone || fallbackPhone),
    renderContactItem('⌖', data.personalInfo.address || fallbackAddress),
    renderContactItem('◎', website)
  ]
    .filter(Boolean)
    .join('');

  const educationSource =
    data.education && data.education.length
      ? data.education
      : [
          {
            id: 'mn-edu-fallback-1',
            institution: 'Wardiere University',
            degree: 'Master of Business',
            field: '',
            startDate: '2011',
            endDate: '2015',
            current: false
          },
          {
            id: 'mn-edu-fallback-2',
            institution: 'Wardiere University',
            degree: 'BA Sales and Commerce',
            field: '',
            startDate: '2011',
            endDate: '2015',
            current: false
          }
        ];

  const skillSource =
    data.skills && data.skills.length
      ? data.skills
      : [
          { id: 'mn-skill-fallback-1', name: 'ROI Calculations', level: 4 },
          { id: 'mn-skill-fallback-2', name: 'Social media marketing', level: 4 },
          { id: 'mn-skill-fallback-3', name: 'Product development lifecycle', level: 4 },
          { id: 'mn-skill-fallback-4', name: 'Marketing strategy', level: 5 },
          { id: 'mn-skill-fallback-5', name: 'Product promotion', level: 4 },
          { id: 'mn-skill-fallback-6', name: 'Value Propositions', level: 4 }
        ];

  const languageSource =
    data.languages && data.languages.length
      ? data.languages
      : [
          { id: 'mn-lang-fallback-1', name: 'English', proficiency: 'Fluent' },
          { id: 'mn-lang-fallback-2', name: 'French', proficiency: 'Professional' }
        ];

  const certificationSource =
    data.certifications && data.certifications.length
      ? data.certifications
      : [
          { id: 'mn-cert-fallback-1', name: 'Google Ads Certification', issuer: 'Google', date: '2024', doesNotExpire: true },
          { id: 'mn-cert-fallback-2', name: 'HubSpot Inbound', issuer: 'HubSpot', date: '2023', doesNotExpire: true }
        ];

  const educationItems = educationSource.slice(0, 2).map(renderEducationItem).join('');
  const skillItems = skillSource.slice(0, 8).map(renderSkillItem).filter(Boolean).join('');
  const languageItems = languageSource.slice(0, 4).map(renderLanguageItem).filter(Boolean).join('');
  const certificationItems = certificationSource.slice(0, 4).map(renderCertificationItem).filter(Boolean).join('');
  const experienceItems = (data.experiences || []).slice(0, 3).map(renderExperienceItem).join('');

  return {
    fullName: escapeHtml(data.personalInfo.fullName || 'Olivia Wilson'),
    jobTitle: withLineBreaks(data.personalInfo.jobTitle || 'Marketing Manager'),
    summary: withLineBreaks(
      data.personalInfo.summary ||
        'An experienced Marketing Manager with exceptional skills in creating marketing plans, launching products, promoting them, and overseeing their development.'
    ),
    contactList: contactItems,
    educationList: educationItems,
    skillsList: skillItems,
    languageList: languageItems,
    certificationsList: certificationItems,
    experienceList: experienceItems,
    references:
      `<div class="mn-ref-col">
        <p class="mn-ref-name">Estelle Darcy</p>
        <p class="mn-ref-role">Wardiere Inc. / CEO</p>
        <p><strong>Phone:</strong> ${escapeHtml(refsPhone)}</p>
        <p><strong>Email:</strong> ${escapeHtml(refsEmail)}</p>
      </div>
      <div class="mn-ref-col">
        <p class="mn-ref-name">Harper Russo</p>
        <p class="mn-ref-role">Wardiere Inc. / CEO</p>
        <p><strong>Phone:</strong> ${escapeHtml(refsPhone)}</p>
        <p><strong>Email:</strong> ${escapeHtml(refsEmail)}</p>
      </div>`,
    profileImage:
      isNonEmpty(data.personalInfo.profileImage)
        ? `<img src="${escapeHtml(data.personalInfo.profileImage || '')}" alt="Profile" class="mn-avatar-img" />`
        : '<div class="mn-avatar-fallback" />'
  };
}

function applyTemplateTokens(template: string, tokens: TemplateTokens) {
  return template.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_match, key) => tokens[key] || '');
}

export function buildMinimalNordicPageHtml(data: CVData) {
  const tokens = buildMinimalNordicTokens(data);
  const direction = detectDirection(`${data.personalInfo.fullName} ${data.personalInfo.summary}`);
  const hasContact = Boolean(tokens.contactList);
  const hasEducation = Boolean(tokens.educationList);
  const hasSkills = Boolean(tokens.skillsList);
  const hasLanguages = Boolean(tokens.languageList);
  const hasCertifications = Boolean(tokens.certificationsList);
  const hasSummary = isNonEmpty(data.personalInfo.summary);
  const hasExperience = Boolean(tokens.experienceList);

  const template = `
  <div class="mn-sheet" dir="${direction}">
    <div class="mn-layout">
      <aside class="mn-sidebar">
        <div class="mn-avatar-wrap">{{profileImage}}</div>
        ${hasContact ? `<section class="mn-section"><h3>Contact</h3><ul class="mn-contact-list">{{contactList}}</ul></section>` : ''}
        ${hasEducation ? `<section class="mn-section"><h3>Education</h3><div>{{educationList}}</div></section>` : ''}
        ${hasSkills ? `<section class="mn-section"><h3>Skills</h3><ul class="mn-bullets">{{skillsList}}</ul></section>` : ''}
        ${hasCertifications ? `<section class="mn-section"><h3>Certifications</h3><ul class="mn-bullets">{{certificationsList}}</ul></section>` : ''}
        ${hasLanguages ? `<section class="mn-section"><h3>Language</h3><ul class="mn-lang-list">{{languageList}}</ul></section>` : ''}
      </aside>
      <main class="mn-main">
        <header class="mn-header">
          <h1>{{fullName}}</h1>
          <p class="mn-job">{{jobTitle}}</p>
        </header>
        ${hasSummary ? `<section class="mn-main-section"><h3>About Me</h3><p>{{summary}}</p></section>` : ''}
        ${hasExperience ? `<section class="mn-main-section"><h3>Work Experience</h3><div>{{experienceList}}</div></section>` : ''}
        <section class="mn-main-section mn-ref-section"><h3>References</h3><div class="mn-ref-grid">{{references}}</div></section>
      </main>
    </div>
  </div>
  `;

  return applyTemplateTokens(template, tokens);
}

export function buildMinimalNordicPdfHtmlDocument(data: CVData) {
  const body = buildMinimalNordicPageHtml(data);
  return `
    <!doctype html>
    <html lang="en" dir="ltr">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          @font-face {
            font-family: 'MinimalNordicBody';
            src: local('Segoe UI'), local('Arial');
            font-weight: 400;
            font-style: normal;
          }
          @font-face {
            font-family: 'MinimalNordicHeading';
            src: local('Poppins'), local('Montserrat'), local('Segoe UI Bold'), local('Arial Bold');
            font-weight: 700;
            font-style: normal;
          }
          @page { size: A4; margin: 0; }
          html, body {
            margin: 0;
            padding: 0;
            width: 210mm;
            min-height: 297mm;
            background: #f4f4f5;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          * { box-sizing: border-box; }
          .mn-sheet {
            width: 210mm;
            min-height: 297mm;
            background: #f4f4f5;
            color: #2f3440;
            font-family: 'MinimalNordicBody', 'Segoe UI', Arial, sans-serif;
          }
          .mn-layout {
            width: 100%;
            min-height: 297mm;
            display: grid;
            grid-template-columns: 35% 65%;
          }
          .mn-sidebar {
            background: #344159;
            color: #f6f8fc;
            padding: 8mm 6mm;
          }
          .mn-avatar-wrap {
            width: 44mm;
            height: 44mm;
            margin: 0 auto 8mm;
            border-radius: 999px;
            border: 4mm solid #4f6284;
            overflow: hidden;
            background: #c4cedd;
          }
          .mn-avatar-img { width: 100%; height: 100%; object-fit: cover; display: block; }
          .mn-avatar-fallback { width: 100%; height: 100%; background: #c4cedd; }
          .mn-section { padding-bottom: 6mm; margin-bottom: 6mm; border-bottom: 0.35mm solid rgba(255,255,255,0.6); }
          .mn-section:last-child { border-bottom: 0; margin-bottom: 0; padding-bottom: 0; }
          .mn-section h3 {
            margin: 0 0 3mm;
            font-family: 'MinimalNordicHeading', 'Segoe UI', Arial, sans-serif;
            font-size: 3.2mm;
            line-height: 1;
            font-weight: 700;
            letter-spacing: 0.02em;
          }
          .mn-contact-list, .mn-bullets, .mn-lang-list { margin: 0; padding: 0; list-style: none; }
          .mn-contact-list li, .mn-bullets li, .mn-lang-list li, .mn-edu-item, .mn-exp-item p, .mn-exp-bullets li {
            font-size: 2.25mm;
            line-height: 1.32;
          }
          .mn-contact-list li { display: flex; align-items: flex-start; gap: 2mm; margin-bottom: 1.6mm; }
          .mn-icon { width: 3mm; display: inline-flex; justify-content: center; flex: 0 0 auto; }
          .mn-contact-value { overflow-wrap: anywhere; }
          .mn-edu-item + .mn-edu-item { margin-top: 2mm; }
          .mn-edu-degree { margin: 0; font-weight: 600; }
          .mn-edu-inst { margin: 0; font-weight: 700; }
          .mn-edu-date { margin: 0; color: #dbe3f0; }
          .mn-bullets li::before {
            content: '';
            width: 1.1mm;
            height: 1.1mm;
            border-radius: 50%;
            background: rgba(255,255,255,0.9);
            display: inline-block;
            margin-inline-end: 2mm;
            vertical-align: middle;
          }
          .mn-main {
            padding: 8mm 7mm 8mm 8mm;
            background: #f4f4f5;
          }
          .mn-header {
            padding-bottom: 5mm;
            margin-bottom: 5mm;
            border-bottom: 0.35mm solid #989da6;
          }
          .mn-header h1 {
            margin: 0;
            font-family: 'MinimalNordicHeading', 'Segoe UI', Arial, sans-serif;
            font-size: 13.5mm;
            line-height: 0.95;
            font-weight: 800;
            color: #35383f;
            overflow-wrap: anywhere;
          }
          .mn-job {
            margin: 1.2mm 0 0;
            font-size: 4.6mm;
            line-height: 1.08;
            color: #3d4047;
            overflow-wrap: anywhere;
          }
          .mn-main-section {
            padding-bottom: 5mm;
            margin-bottom: 5mm;
            border-bottom: 0.35mm solid #989da6;
            break-inside: avoid-page;
            page-break-inside: avoid;
          }
          .mn-main-section:last-child { margin-bottom: 0; }
          .mn-main-section h3 {
            margin: 0 0 2mm;
            font-family: 'MinimalNordicHeading', 'Segoe UI', Arial, sans-serif;
            font-size: 4.8mm;
            line-height: 1;
            font-weight: 700;
            color: #3e424a;
          }
          .mn-main-section p {
            margin: 0;
            font-size: 2.65mm;
            line-height: 1.34;
            color: #404651;
            overflow-wrap: anywhere;
          }
          .mn-exp-item + .mn-exp-item { margin-top: 3.2mm; }
          .mn-exp-date { margin: 0; font-size: 2.4mm; color: #70757f; }
          .mn-exp-company { margin: 0; font-size: 2.95mm; color: #5f6672; }
          .mn-exp-role { margin: 0; font-size: 3.45mm; font-weight: 600; color: #3a404a; }
          .mn-exp-bullets { margin: 1.2mm 0 0; padding: 0; list-style: none; }
          .mn-exp-bullets li { margin: 0.8mm 0 0; color: #444b57; overflow-wrap: anywhere; }
          .mn-exp-bullets li::before {
            content: '';
            width: 0.9mm;
            height: 0.9mm;
            border-radius: 50%;
            background: #5e6674;
            display: inline-block;
            margin-inline-end: 1.8mm;
            vertical-align: middle;
          }
          .mn-ref-section { border-bottom: 0; padding-bottom: 0; }
          .mn-ref-grid {
            border-top: 0.35mm solid #989da6;
            padding-top: 2.4mm;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 3mm;
          }
          .mn-ref-col p { margin: 0; }
          .mn-ref-name {
            font-family: 'MinimalNordicHeading', 'Segoe UI', Arial, sans-serif;
            font-size: 3.2mm;
            font-weight: 700;
            color: #3f4650;
          }
          .mn-ref-role { font-size: 2.4mm; color: #5f6672; margin-top: 0.6mm; }
          .mn-ref-col p:not(.mn-ref-name):not(.mn-ref-role) { font-size: 2.1mm; color: #6f7580; margin-top: 0.4mm; }
        </style>
      </head>
      <body>${body}</body>
    </html>
  `;
}
