import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import {
  AlignmentType,
  BorderStyle,
  Document,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableLayoutType,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType
} from 'docx';
import type { CVData } from '@/components/cvs/types';
import type { TemplateConfig } from '@/lib/types/template-config';

export interface TemplateDocxInput {
  templateName: string;
  slug: string;
  config?: Partial<TemplateConfig> | null;
  data: CVData;
}

let templateArrayBufferPromise: Promise<ArrayBuffer> | null = null;

function text(value?: string | null) {
  return (value || '').trim();
}

function toHex(value: string | undefined, fallback: string) {
  const raw = (value || '').trim();
  if (/^#[0-9A-Fa-f]{6}$/.test(raw)) return raw.slice(1).toUpperCase();
  if (/^[0-9A-Fa-f]{6}$/.test(raw)) return raw.toUpperCase();
  return fallback;
}

function pickFont(family: string | undefined) {
  const lower = (family || '').toLowerCase();
  if (lower.includes('times') || lower.includes('serif') || lower.includes('cambria')) return 'Cambria';
  if (lower.includes('arial') || lower.includes('helvetica') || lower.includes('tahoma')) return 'Arial';
  return 'Calibri';
}

function period(start?: string, end?: string, current?: boolean) {
  const s = text(start);
  const e = current ? 'Present' : text(end);
  if (s && e) return `${s} - ${e}`;
  return s || e || '';
}

function runPlaceholder(placeholder: string, font: string, color: string, size: number, bold = false) {
  return new TextRun({
    text: `{${placeholder}}`,
    font,
    color,
    size,
    bold,
    noProof: true,
    language: { value: 'en-US' }
  });
}

function runText(value: string, font: string, color: string, size: number, bold = false) {
  return new TextRun({
    text: value,
    font,
    color,
    size,
    bold,
    noProof: true,
    language: { value: 'en-US' }
  });
}

function sectionTitle(title: string, headingFont: string, accent: string) {
  return new Paragraph({
    keepLines: true,
    keepNext: true,
    spacing: { after: 90 },
    border: {
      bottom: {
        style: BorderStyle.SINGLE,
        color: 'C4D8CC',
        size: 7
      }
    },
    children: [runText(title, headingFont, accent, 21, true)]
  });
}

function contentCard(children: Paragraph[], borderColor: string) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    rows: [
      new TableRow({
        cantSplit: true,
        children: [
          new TableCell({
            verticalAlign: VerticalAlign.TOP,
            margins: { top: 110, right: 110, bottom: 110, left: 110 },
            shading: { type: ShadingType.CLEAR, fill: 'FFFFFF', color: 'auto' },
            borders: {
              top: { style: BorderStyle.SINGLE, color: borderColor, size: 11 },
              bottom: { style: BorderStyle.SINGLE, color: borderColor, size: 11 },
              left: { style: BorderStyle.SINGLE, color: borderColor, size: 11 },
              right: { style: BorderStyle.SINGLE, color: borderColor, size: 11 }
            },
            children
          })
        ]
      })
    ]
  });
}

function metricCell(label: string, valuePlaceholder: string, font: string) {
  return new TableCell({
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 70, right: 60, bottom: 70, left: 60 },
    shading: { type: ShadingType.CLEAR, fill: 'F4F5F6', color: 'auto' },
    borders: {
      top: { style: BorderStyle.SINGLE, color: 'BFC4C8', size: 8 },
      bottom: { style: BorderStyle.SINGLE, color: 'BFC4C8', size: 8 },
      left: { style: BorderStyle.SINGLE, color: 'BFC4C8', size: 8 },
      right: { style: BorderStyle.SINGLE, color: 'BFC4C8', size: 8 }
    },
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 20 },
        children: [runText(label, font, '6B7280', 13)]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [runPlaceholder(valuePlaceholder, font, '111827', 19, true)]
      })
    ]
  });
}

function spacer(after = 70) {
  return new Paragraph({ spacing: { after } });
}

async function createWordTemplateArrayBuffer(config?: Partial<TemplateConfig> | null) {
  const accent = toHex(config?.primaryColor, '1D8D5D');
  const headingFont = pickFont(config?.headingFontFamily || config?.fontFamily);
  const bodyFont = pickFont(config?.fontFamily);

  const header = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    rows: [
      new TableRow({
        cantSplit: true,
        children: [
          new TableCell({
            shading: { type: ShadingType.CLEAR, fill: 'EEF1F2', color: 'auto' },
            margins: { top: 70, right: 80, bottom: 70, left: 80 },
            borders: {
              top: { style: BorderStyle.NONE, color: accent, size: 0 },
              bottom: { style: BorderStyle.NONE, color: accent, size: 0 },
              left: { style: BorderStyle.NONE, color: accent, size: 0 },
              right: { style: BorderStyle.NONE, color: accent, size: 0 }
            },
            children: [
              new Paragraph({ children: [runPlaceholder('fullName', headingFont, '111827', 33, true)] }),
              new Paragraph({ spacing: { after: 25 }, children: [runPlaceholder('jobTitle', bodyFont, accent, 14)] }),
              new Paragraph({
                children: [runPlaceholder('contactLine', bodyFont, '6B7280', 11)]
              })
            ]
          })
        ]
      })
    ]
  });

  const metrics = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    rows: [
      new TableRow({
        cantSplit: true,
        children: [
          metricCell('Experience', 'experienceCount', bodyFont),
          metricCell('Projects', 'projectCount', bodyFont),
          metricCell('Skills', 'skillCount', bodyFont)
        ]
      })
    ]
  });

  const leftColumn = [
    contentCard([sectionTitle('Education', headingFont, '111827'), new Paragraph({ children: [runPlaceholder('educationBlock', bodyFont, '1F2937', 12)] })], accent),
    spacer(55),
    contentCard([sectionTitle('Skills', headingFont, '111827'), new Paragraph({ children: [runPlaceholder('skillsBlock', bodyFont, '1F2937', 12)] })], accent),
    spacer(55),
    contentCard([sectionTitle('Languages', headingFont, '111827'), new Paragraph({ children: [runPlaceholder('languagesBlock', bodyFont, '1F2937', 12)] })], accent),
    spacer(55),
    contentCard([sectionTitle('Certifications', headingFont, '111827'), new Paragraph({ children: [runPlaceholder('certificationsBlock', bodyFont, '1F2937', 12)] })], accent)
  ];

  const rightColumn = [
    contentCard([sectionTitle('Professional Summary', headingFont, '111827'), new Paragraph({ children: [runPlaceholder('summary', bodyFont, '1F2937', 15)] })], accent),
    spacer(55),
    contentCard([sectionTitle('Research & Teaching', headingFont, '111827'), new Paragraph({ children: [runPlaceholder('experienceBlock', bodyFont, '1F2937', 13)] })], accent),
    spacer(55),
    contentCard([sectionTitle('Projects', headingFont, '111827'), new Paragraph({ children: [runPlaceholder('projectsBlock', bodyFont, '1F2937', 13)] })], accent)
  ];

  const grid = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    rows: [
      new TableRow({
        cantSplit: true,
        children: [
          new TableCell({
            width: { size: 26, type: WidthType.PERCENTAGE },
            verticalAlign: VerticalAlign.TOP,
            margins: { top: 70, right: 50, bottom: 70, left: 0 },
            borders: {
              top: { style: BorderStyle.NONE, color: accent, size: 0 },
              bottom: { style: BorderStyle.NONE, color: accent, size: 0 },
              left: { style: BorderStyle.NONE, color: accent, size: 0 },
              right: { style: BorderStyle.NONE, color: accent, size: 0 }
            },
            children: leftColumn
          }),
          new TableCell({
            width: { size: 74, type: WidthType.PERCENTAGE },
            verticalAlign: VerticalAlign.TOP,
            margins: { top: 70, right: 0, bottom: 70, left: 50 },
            borders: {
              top: { style: BorderStyle.NONE, color: accent, size: 0 },
              bottom: { style: BorderStyle.NONE, color: accent, size: 0 },
              left: { style: BorderStyle.NONE, color: accent, size: 0 },
              right: { style: BorderStyle.NONE, color: accent, size: 0 }
            },
            children: rightColumn
          })
        ]
      })
    ]
  });

  const templateDoc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: bodyFont,
            color: '1F2937',
            noProof: true,
            language: { value: 'en-US' }
          },
          paragraph: { spacing: { line: 280 } }
        }
      }
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838 },
            margin: { top: 280, right: 280, bottom: 280, left: 280 }
          }
        },
        children: [header, spacer(70), metrics, spacer(70), grid]
      }
    ]
  });

  const blob = await Packer.toBlob(templateDoc);
  return await blob.arrayBuffer();
}

function skillLevelBar(level: number) {
  const normalized = Math.max(1, Math.min(5, Number(level) || 3));
  return `${'█'.repeat(normalized)}${'░'.repeat(5 - normalized)}`;
}

function formatExperienceBlock(data: CVData) {
  return data.experiences
    .map((exp) => {
      const header = [text(exp.position), text(exp.company)].filter(Boolean).join(' - ');
      const meta = [text(exp.location), period(exp.startDate, exp.endDate, exp.current)].filter(Boolean).join(' | ');
      const bullets = exp.description
        .map((line) => text(line))
        .filter(Boolean)
        .map((line) => `• ${line}`)
        .join('\n');
      return [header, meta, bullets].filter(Boolean).join('\n');
    })
    .filter(Boolean)
    .join('\n\n');
}

function formatProjectsBlock(data: CVData) {
  return data.projects
    .map((project) => {
      const header = [text(project.name), period(project.startDate, project.endDate, project.current)]
        .filter(Boolean)
        .join(' | ');
      const tech = project.technologies.map((item) => text(item)).filter(Boolean).join(', ');
      const bullets = project.description
        .map((line) => text(line))
        .filter(Boolean)
        .map((line) => `• ${line}`)
        .join('\n');
      return [header, tech ? `Tech: ${tech}` : '', bullets].filter(Boolean).join('\n');
    })
    .filter(Boolean)
    .join('\n\n');
}

function formatEducationBlock(data: CVData) {
  return data.education
    .map((edu) => {
      const degree = [text(edu.degree), text(edu.field)].filter(Boolean).join(' in ');
      const institution = text(edu.institution);
      const d = period(edu.startDate, edu.endDate, edu.current);
      return [degree, institution, d].filter(Boolean).join('\n');
    })
    .filter(Boolean)
    .join('\n\n');
}

function formatSkillsBlock(data: CVData) {
  return data.skills
    .slice(0, 10)
    .map((skill) => `${text(skill.name)}  ${skillLevelBar(skill.level)}  ${Math.max(1, Math.min(5, Number(skill.level) || 3))}/5`)
    .join('\n');
}

function formatLanguagesBlock(data: CVData) {
  return data.languages
    .map((lang) => [text(lang.name), text(lang.proficiency)].filter(Boolean).join(' - '))
    .filter(Boolean)
    .join('\n');
}

function formatCertificationsBlock(data: CVData) {
  return data.certifications
    .map((cert) => [text(cert.name), text(cert.issuer), text(cert.date)].filter(Boolean).join(' | '))
    .filter(Boolean)
    .join('\n');
}

function buildTemplateData(input: TemplateDocxInput) {
  const { data } = input;
  return {
    fullName: text(data.personalInfo.fullName) || 'Your Name',
    jobTitle: text(data.personalInfo.jobTitle) || 'Professional Title',
    contactLine: [text(data.personalInfo.email), text(data.personalInfo.phone), text(data.personalInfo.address)]
      .filter(Boolean)
      .join(' | '),
    experienceCount: String(data.experiences.length),
    projectCount: String(data.projects.length),
    skillCount: String(data.skills.length),
    summary: text(data.personalInfo.summary),
    experienceBlock: formatExperienceBlock(data),
    projectsBlock: formatProjectsBlock(data),
    educationBlock: formatEducationBlock(data),
    skillsBlock: formatSkillsBlock(data),
    languagesBlock: formatLanguagesBlock(data),
    certificationsBlock: formatCertificationsBlock(data)
  };
}

export async function buildTemplateDocxBlob(input: TemplateDocxInput): Promise<Blob> {
  if (!templateArrayBufferPromise) {
    templateArrayBufferPromise = createWordTemplateArrayBuffer(input.config);
  }

  const templateBuffer = await templateArrayBufferPromise;
  const zip = new PizZip(templateBuffer);
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true
  });

  doc.render(buildTemplateData(input));

  return doc.getZip().generate({
    type: 'blob',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  }) as Blob;
}
