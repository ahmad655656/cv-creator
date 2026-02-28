'use client';

import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { renderPremiumTemplateNode } from '@/components/templates/premium/renderTemplateNode';
import type { TemplateConfig } from '@/lib/types/template-config';

export interface TemplatePdfExporterTemplate {
  id: number;
  name: string;
  slug: string;
  config?: Partial<TemplateConfig> | null;
  pageTier?: 'one-page' | 'two-page';
}

export interface TemplatePdfExporterHandle {
  exportTemplate: (template: TemplatePdfExporterTemplate) => Promise<void>;
  generateTemplatePdfBlob: (template: TemplatePdfExporterTemplate) => Promise<Blob>;
}

export const TemplatePdfExporter = forwardRef<TemplatePdfExporterHandle, object>(function TemplatePdfExporter(
  _props,
  ref
) {
  const exportRef = useRef<HTMLDivElement>(null);
  const [exportTemplate, setExportTemplate] = useState<TemplatePdfExporterTemplate | null>(null);
  const waitForClientAssets = async (root: HTMLElement) => {
    const images = Array.from(root.querySelectorAll('img'));
    await Promise.all(
      images.map(
        (img) =>
          new Promise<void>((resolve) => {
            if (img.complete) {
              resolve();
              return;
            }
            img.onload = () => resolve();
            img.onerror = () => resolve();
          })
      )
    );
    if (document.fonts) {
      await document.fonts.ready;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  };

  const buildHtmlForServerPdf = (title: string, slug: string, content: string) => {
    const styleTags = Array.from(document.querySelectorAll('style'))
      .map((style) => style.outerHTML)
      .join('\n');
    const linkTags = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
      .map((link) => link.outerHTML)
      .join('\n');
    const origin = window.location.origin;
    const normalizedSlug = slug.toLowerCase().replace(/[^a-z0-9_-]/g, '');

    return `
      <!doctype html>
      <html lang="en" dir="ltr">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <base href="${origin}/" />
          <title>${title}</title>
          ${linkTags}
          ${styleTags}
          <style>
            @page { size: A4 portrait; margin: 4mm 0 5mm 0; }
            html, body {
              margin: 0;
              padding: 0;
              background: #fff !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
              -webkit-print-color-adjust: exact !important;
              overflow: visible !important;
            }
            .pdf-page {
              width: 210mm;
              min-height: 297mm;
              margin: 0 auto;
              background: #fff !important;
            }
            .pdf-root {
              width: 100%;
              min-height: 297mm;
              margin: 0;
              padding: 6mm;
              background: #fff !important;
              overflow: visible !important;
              direction: ltr;
              font-size: 92%;
              line-height: 1.35;
            }
            .pdf-content {
              width: 100%;
              min-height: calc(297mm - 12mm);
            }
            /* Only the visual header may touch page edges */
            .pdf-content > * > :first-child {
              margin-top: -6mm !important;
              margin-left: -6mm !important;
              margin-right: -6mm !important;
            }
            .pdf-content > * > :first-child > * {
              break-inside: avoid-page !important;
              page-break-inside: avoid !important;
            }
            .pdf-root * {
              box-sizing: border-box;
              print-color-adjust: exact !important;
              -webkit-print-color-adjust: exact !important;
            }
            .pdf-root h1,
            .pdf-root h2,
            .pdf-root h3,
            .pdf-root h4,
            .pdf-root h5,
            .pdf-root h6 {
              break-after: avoid-page !important;
              page-break-after: avoid !important;
            }
            .pdf-root p,
            .pdf-root li,
            .pdf-root blockquote {
              orphans: 3;
              widows: 3;
            }
            .pdf-root section,
            .pdf-root article,
            .pdf-root ul,
            .pdf-root ol,
            .pdf-root div {
              break-inside: auto;
              page-break-inside: auto;
            }
            /* Keep logical blocks intact across pages */
            .pdf-root section > div,
            .pdf-root article,
            .pdf-root [class*="rounded-xl"],
            .pdf-root [class*="rounded-2xl"],
            .pdf-root [class*="card"] {
              break-inside: avoid-page !important;
              page-break-inside: avoid !important;
            }
            .pdf-root section,
            .pdf-root article {
              margin-bottom: 3mm;
            }
            .pdf-root .no-page-break {
              break-inside: avoid-page !important;
              page-break-inside: avoid !important;
            }
            .pdf-root h2,
            .pdf-root h3 {
              break-after: avoid-page !important;
              page-break-after: avoid !important;
            }
            .pdf-root h2 + *,
            .pdf-root h3 + * {
              break-inside: avoid-page !important;
              page-break-inside: avoid !important;
            }
            .pdf-root article,
            .pdf-root li {
              break-inside: avoid-page !important;
              page-break-inside: avoid !important;
            }
            .pdf-root img,
            .pdf-root svg,
            .pdf-root table {
              break-inside: avoid-page !important;
              page-break-inside: avoid !important;
              max-width: 100%;
              height: auto;
            }
            /* Preserve professional multi-column layout in exported PDF */
            .pdf-root .grid-cols-12 { grid-template-columns: repeat(12, minmax(0, 1fr)) !important; }
            .pdf-root .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
            .pdf-root .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
            .pdf-root .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)) !important; }
            .pdf-root .col-span-8,
            .pdf-root .xl\:col-span-8 { grid-column: span 8 / span 8 !important; }
            .pdf-root .col-span-4,
            .pdf-root .xl\:col-span-4 { grid-column: span 4 / span 4 !important; }
            .pdf-root .col-span-3 { grid-column: span 3 / span 3 !important; }
            .pdf-root .col-span-2 { grid-column: span 2 / span 2 !important; }
            .pdf-root .col-span-1 { grid-column: span 1 / span 1 !important; }
            .pdf-root main,
            .pdf-root aside {
              break-inside: auto !important;
              page-break-inside: auto !important;
            }
            /* Compact spacing for cleaner multi-page layout */
            .pdf-root [class*="p-10"] { padding: 6mm !important; }
            .pdf-root [class*="p-8"] { padding: 5mm !important; }
            .pdf-root [class*="p-7"] { padding: 4.5mm !important; }
            .pdf-root [class*="p-6"] { padding: 4mm !important; }
            .pdf-root [class*="p-5"] { padding: 3.5mm !important; }
            .pdf-root [class*="p-4"] { padding: 3mm !important; }
            .pdf-root [class*="gap-8"] { gap: 3mm !important; }
            .pdf-root [class*="gap-7"] { gap: 2.8mm !important; }
            .pdf-root [class*="gap-6"] { gap: 2.5mm !important; }
            .pdf-root [class*="gap-5"] { gap: 2.2mm !important; }
            .pdf-root [class*="gap-4"] { gap: 2mm !important; }
            .pdf-root [class*="space-y-"] > * + * { margin-top: 1.8mm !important; }
            .pdf-root h1, .pdf-root h2, .pdf-root h3, .pdf-root h4 {
              margin-top: 0 !important;
              margin-bottom: 1.5mm !important;
            }
            .pdf-root p, .pdf-root li {
              margin-top: 0.8mm !important;
              margin-bottom: 0.8mm !important;
            }
          </style>
        </head>
        <body>
          <div class="pdf-page">
            <div class="pdf-root">
              <div class="pdf-content template-${normalizedSlug}">${content}</div>
            </div>
          </div>
        </body>
      </html>
    `;
  };

  const downloadBlob = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const generateClientSidePdfBlob = async (sourceElement: HTMLElement) => {
    const [{ default: html2canvas }, jspdfModule] = await Promise.all([
      import('html2canvas'),
      import('jspdf')
    ]);
    const JsPdf = jspdfModule.jsPDF;

    const canvas = await html2canvas(sourceElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new JsPdf('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
    }

    return pdf.output('blob') as Blob;
  };

  const generateTemplatePdfBlob = async (template: TemplatePdfExporterTemplate) => {
    setExportTemplate(template);
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

    const sourceElement = exportRef.current;
    if (!sourceElement) {
      setExportTemplate(null);
      throw new Error('Export source is not ready');
    }

    const renderedId = Number.parseInt(sourceElement.dataset.templateId || '-1', 10);
    if (renderedId !== template.id) {
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    }

    const safeName = (template.name || 'template').replace(/[\\/:*?"<>|]/g, '-').trim() || 'template';

    try {
      await waitForClientAssets(sourceElement);
      const html = buildHtmlForServerPdf(safeName, template.slug, sourceElement.innerHTML);

      try {
        const response = await fetch('/api/templates/export-pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            templateId: template.id,
            slug: template.slug,
            fileName: safeName,
            pageTier: template.pageTier,
            html
          })
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data?.error || 'Server PDF export failed');
        }

        return await response.blob();
      } catch (serverError) {
        console.warn('Server PDF export failed. Falling back to client PDF export.', serverError);
        return await generateClientSidePdfBlob(sourceElement);
      }
    } finally {
      setExportTemplate(null);
    }
  };

  useImperativeHandle(ref, () => ({
    async exportTemplate(template: TemplatePdfExporterTemplate) {
      const safeName = (template.name || 'template').replace(/[\\/:*?"<>|]/g, '-').trim() || 'template';
      const blob = await generateTemplatePdfBlob(template);
      downloadBlob(blob, safeName);
    },
    async generateTemplatePdfBlob(template: TemplatePdfExporterTemplate) {
      return await generateTemplatePdfBlob(template);
    }
  }));

  return (
    <div className="fixed left-[-10000px] top-0 pointer-events-none opacity-0" aria-hidden="true">
      <div
        ref={exportRef}
        data-template-id={exportTemplate?.id ?? -1}
        style={{
          width: 794,
          minHeight: 1123,
          background: '#ffffff',
          direction: 'ltr'
        }}
      >
        {exportTemplate
          ? renderPremiumTemplateNode({
            slug: exportTemplate.slug,
            config: exportTemplate.config
          })
          : null}
      </div>
    </div>
  );
});

