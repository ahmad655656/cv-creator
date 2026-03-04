'use client';

import { forwardRef, useImperativeHandle } from 'react';
import type { TemplateConfig } from '@/lib/types/template-config';
import type { CVData } from '@/components/cvs/types';
import { TEMPLATE_PREVIEW_DATA } from '@/components/templates/premium/previewData';
import { buildTemplateDocxBlob } from '@/lib/docx/buildTemplateDocx';

export interface TemplateDocxExporterTemplate {
  id: number;
  name: string;
  slug: string;
  config?: Partial<TemplateConfig> | null;
  pageTier?: 'one-page' | 'two-page';
  data?: CVData;
}

export interface TemplateDocxExporterHandle {
  exportTemplate: (template: TemplateDocxExporterTemplate) => Promise<void>;
  generateTemplateDocxBlob: (template: TemplateDocxExporterTemplate) => Promise<Blob>;
}

function sanitizeFileName(fileName: string) {
  return (fileName || 'template').replace(/[\\/:*?"<>|]/g, '-').trim() || 'template';
}

function downloadBlob(blob: Blob, fileName: string) {
  const safeName = sanitizeFileName(fileName);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${safeName}.docx`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

export const TemplateDocxExporter = forwardRef<TemplateDocxExporterHandle, object>(function TemplateDocxExporter(
  _props,
  ref
) {
  const generateTemplateDocxBlob = async (template: TemplateDocxExporterTemplate) => {
    return await buildTemplateDocxBlob({
      templateName: template.name,
      slug: template.slug,
      config: template.config,
      data: template.data || TEMPLATE_PREVIEW_DATA
    });
  };

  useImperativeHandle(ref, () => ({
    async exportTemplate(template: TemplateDocxExporterTemplate) {
      const blob = await generateTemplateDocxBlob(template);
      downloadBlob(blob, template.name);
    },
    async generateTemplateDocxBlob(template: TemplateDocxExporterTemplate) {
      return await generateTemplateDocxBlob(template);
    }
  }));

  return null;
});
