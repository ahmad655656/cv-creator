'use client';

import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF as JsPdf } from 'jspdf';
import { renderPremiumTemplateNode } from '@/components/templates/premium/renderTemplateNode';
import type { TemplateConfig } from '@/lib/types/template-config';
import type { CVData } from '@/components/cvs/types';

export interface TemplatePdfExporterTemplate {
  id: number;
  name: string;
  slug: string;
  config?: Partial<TemplateConfig> | null;
  pageTier?: 'one-page' | 'two-page';
  pageFormat?: 'A4' | 'Letter';
  data?: CVData;
}

export interface TemplatePdfExporterHandle {
  exportTemplate: (template: TemplatePdfExporterTemplate) => Promise<void>;
  generateTemplatePdfBlob: (template: TemplatePdfExporterTemplate) => Promise<Blob>;
}

const PRINT_FALLBACK_OPENED = 'PRINT_FALLBACK_OPENED';
const PX_PER_MM = 96 / 25.4;
const PAGE_MARGIN_MM = 16;

const PAGE_SPECS = {
  A4: { widthMm: 210, heightMm: 297 },
  Letter: { widthMm: 216, heightMm: 279 }
} as const;

function getPageFormat(template: TemplatePdfExporterTemplate): 'A4' | 'Letter' {
  if (template.pageFormat) return template.pageFormat;
  if (template.config?.pageFormat === 'Letter') return 'Letter';
  return 'A4';
}

function getPageSpec(format: 'A4' | 'Letter') {
  const spec = PAGE_SPECS[format];
  const contentWidthMm = spec.widthMm - PAGE_MARGIN_MM * 2;
  const contentHeightMm = spec.heightMm - PAGE_MARGIN_MM * 2;
  return {
    ...spec,
    contentWidthMm,
    contentHeightMm,
    contentWidthPx: Math.round(contentWidthMm * PX_PER_MM),
    contentHeightPx: Math.round(contentHeightMm * PX_PER_MM)
  };
}

function getExportRootSize(template?: TemplatePdfExporterTemplate) {
  const format = template ? getPageFormat(template) : 'A4';
  const spec = PAGE_SPECS[format];
  const strictSinglePage = template ? isStrictSinglePageTemplate(template.slug) : false;
  const marginMm = strictSinglePage ? 0 : PAGE_MARGIN_MM;
  const widthMm = spec.widthMm - marginMm * 2;
  const heightMm = spec.heightMm - marginMm * 2;
  return {
    widthPx: Math.round(widthMm * PX_PER_MM),
    heightPx: Math.round(heightMm * PX_PER_MM)
  };
}

function isStrictSinglePageTemplate(slug: string) {
  const normalized = (slug || '').toLowerCase().replace(/[-_\s]/g, '');
  return normalized === 'minimalnordic' || normalized === 'salesstar' || normalized === 'richard' || normalized === 'andreemas' || normalized === 'productlead' || normalized === 'julianasilva' || normalized === 'alidaplanet';
}

function isAutoScaleSinglePageTemplate(slug: string) {
  const normalized = (slug || '').toLowerCase().replace(/[-_\s]/g, '');
  return normalized === 'minimalnordic' || normalized === 'salesstar' || normalized === 'richard' || normalized === 'andreemas' || normalized === 'productlead' || normalized === 'julianasilva' || normalized === 'alidaplanet';
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

  const sanitizeUnsupportedColorFunctions = (clonedDoc: Document) => {
    const root = clonedDoc.querySelector('[data-template-id]') as HTMLElement | null;
    if (!root) return;
    const view = clonedDoc.defaultView;
    if (!view) return;

    const probe = clonedDoc.createElement('span');
    probe.style.display = 'none';
    clonedDoc.body.appendChild(probe);

    const resolveFunctionalColor = (fn: string) => {
      try {
        probe.style.color = '';
        probe.style.color = fn;
        const resolved = view.getComputedStyle(probe).color || probe.style.color;
        if (
          resolved &&
          !resolved.toLowerCase().includes('oklab(') &&
          !resolved.toLowerCase().includes('oklch(') &&
          !resolved.toLowerCase().includes('lab(') &&
          !resolved.toLowerCase().includes('lch(')
        ) {
          return resolved;
        }
      } catch {
        // ignore
      }
      return '';
    };

    const replaceUnsupportedColorFunctions = (input: string) => {
      if (!input) return input;
      return input.replace(/(?:ok)?l(?:ab|ch)\([^)]+\)/gi, (match) => {
        const converted = resolveFunctionalColor(match);
        return converted || 'rgba(0,0,0,0)';
      });
    };

    const fallbackForProperty = (propName: string) => {
      const lower = propName.toLowerCase();
      if (lower.includes('shadow')) return 'none';
      if (lower.includes('background-image')) return 'none';
      if (lower.includes('background')) return '#ffffff';
      if (lower.includes('border')) return '#cbd5e1';
      if (lower.includes('outline')) return 'transparent';
      if (lower.includes('text-decoration')) return '#0f172a';
      if (lower.includes('color')) return '#0f172a';
      return '';
    };

    const nodes = [root, ...Array.from(root.querySelectorAll<HTMLElement>('*'))];
    for (const node of nodes) {
      const computed = view.getComputedStyle(node);
      if (!computed) continue;

      for (let i = 0; i < computed.length; i += 1) {
        const prop = computed.item(i);
        if (!prop) continue;
        const value = computed.getPropertyValue(prop);
        if (!value) continue;
        const lowered = value.toLowerCase();
        if (lowered.includes('oklab(') || lowered.includes('oklch(') || lowered.includes('lab(') || lowered.includes('lch(')) {
          const replaced = replaceUnsupportedColorFunctions(value);
          const stillUnsupported =
            replaced.toLowerCase().includes('oklab(') ||
            replaced.toLowerCase().includes('oklch(') ||
            replaced.toLowerCase().includes('lab(') ||
            replaced.toLowerCase().includes('lch(');
          const nextValue = stillUnsupported ? fallbackForProperty(prop) : replaced;
          if (nextValue) {
            node.style.setProperty(prop, nextValue, 'important');
          }
        }
      }
    }

    probe.remove();
  };

  const buildHtmlForServerPdf = (
    title: string,
    slug: string,
    content: string,
    pageFormat: 'A4' | 'Letter',
    fitScale = 1
  ) => {
    const styleTags = Array.from(document.querySelectorAll('style'))
      .map((style) => style.outerHTML)
      .join('\n');
    const linkTags = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
      .map((link) => link.outerHTML)
      .join('\n');
    const origin = window.location.origin;
    const normalizedSlug = slug.toLowerCase().replace(/[^a-z0-9_-]/g, '');

    const safeTitle = title
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
    const strictSinglePage = isStrictSinglePageTemplate(slug);
    const pageMarginMm = strictSinglePage ? 0 : PAGE_MARGIN_MM;
    const rawPageSpec = PAGE_SPECS[pageFormat];
    const contentWidthMm = rawPageSpec.widthMm - pageMarginMm * 2;
    const contentHeightMm = rawPageSpec.heightMm - pageMarginMm * 2;
    const contentWidthPx = Math.round(contentWidthMm * PX_PER_MM);
    const contentHeightPx = Math.round(contentHeightMm * PX_PER_MM);
    const autoScaleSinglePage = isAutoScaleSinglePageTemplate(slug);

    return `
      <!doctype html>
      <html lang="en" dir="ltr">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <base href="${origin}/" />
          <title>${safeTitle}</title>
          ${linkTags}
          ${styleTags}
          <style>
            @page { size: ${pageFormat} portrait; margin: ${pageMarginMm}mm; }
            html, body {
              margin: 0;
              padding: 0;
              background: #fff !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
              -webkit-print-color-adjust: exact !important;
              overflow: visible !important;
              font-synthesis-weight: none;
              font-synthesis-style: none;
            }
            .pdf-page {
              width: ${rawPageSpec.widthMm}mm;
              min-height: ${rawPageSpec.heightMm}mm;
              margin: 0 auto;
              background: #fff !important;
              display: flex;
              justify-content: center;
            }
            .pdf-root {
              width: ${contentWidthPx}px;
              max-width: ${contentWidthMm}mm;
              min-height: ${contentHeightPx}px;
              margin: 0 auto;
              padding: 0;
              background: #fff !important;
              overflow: visible !important;
              direction: ltr;
            }
            .pdf-content {
              width: 100%;
            }
            ${autoScaleSinglePage
              ? `.pdf-content {
              width: ${Math.round(contentWidthPx / Math.max(fitScale, 0.01))}px;
              margin: 0 auto;
              zoom: ${fitScale};
            }`
              : ''}
            .pdf-root * {
              box-sizing: border-box;
              print-color-adjust: exact !important;
              -webkit-print-color-adjust: exact !important;
              text-shadow: none !important;
              animation: none !important;
              transition: none !important;
            }
            .pdf-content {
              color: #0f172a;
              text-rendering: geometricPrecision;
              -webkit-font-smoothing: antialiased;
            }
            .pdf-content h1,
            .pdf-content h2,
            .pdf-content h3,
            .pdf-content p,
            .pdf-content li,
            .pdf-content section,
            .pdf-content article,
            .pdf-content [data-pdf-block] {
              break-inside: avoid-page;
              page-break-inside: avoid;
            }
            .pdf-content ul,
            .pdf-content ol {
              margin-top: 6px;
              margin-bottom: 6px;
            }
            .pdf-content a {
              color: inherit !important;
              text-decoration: none !important;
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
    // Defer revocation to avoid rare browser timing issues on hosted environments.
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  };

  const generateClientSidePdfBlob = async (
    sourceElement: HTMLElement,
    pageFormat: 'A4' | 'Letter',
    forceSinglePage = false
  ) => {
    const canvas = await html2canvas(sourceElement, {
      scale: 3,
      useCORS: true,
      backgroundColor: '#ffffff',
      onclone: (clonedDoc) => {
        sanitizeUnsupportedColorFunctions(clonedDoc);
      }
    });

    const pdf = new JsPdf('p', 'mm', pageFormat.toLowerCase() as 'a4' | 'letter');
    const pageSpec = getPageSpec(pageFormat);
    const pageHeightPx = Math.floor((canvas.width * pageSpec.contentHeightMm) / pageSpec.contentWidthMm);

    if (forceSinglePage) {
      const fullPageSpec = PAGE_SPECS[pageFormat];
      const renderWidthMm = fullPageSpec.widthMm;
      const renderHeightLimitMm = fullPageSpec.heightMm;
      const rawRenderHeightMm = (canvas.height * renderWidthMm) / canvas.width;
      const fitScale = Math.min(1, renderHeightLimitMm / Math.max(rawRenderHeightMm, 0.01));
      const scaledWidthMm = renderWidthMm * fitScale;
      const scaledHeightMm = rawRenderHeightMm * fitScale;
      const offsetX = (fullPageSpec.widthMm - scaledWidthMm) / 2;
      const offsetY = (fullPageSpec.heightMm - scaledHeightMm) / 2;
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', offsetX, offsetY, scaledWidthMm, scaledHeightMm, undefined, 'MEDIUM');
      return pdf.output('blob') as Blob;
    }

    const rootRect = sourceElement.getBoundingClientRect();
    const protectedBlocks = Array.from(sourceElement.querySelectorAll<HTMLElement>('[data-pdf-block]'))
      .map((el) => {
        const rect = el.getBoundingClientRect();
        const top = rect.top - rootRect.top;
        const bottom = rect.bottom - rootRect.top;
        return { top, bottom, height: rect.height };
      })
      .filter((b) => b.height > 28 && b.height < sourceElement.scrollHeight * 0.92)
      .sort((a, b) => a.top - b.top);

    const scaleY = canvas.height / Math.max(1, sourceElement.scrollHeight);
    const toDomY = (px: number) => px / Math.max(scaleY, 0.0001);
    const toPxY = (dom: number) => Math.round(dom * scaleY);
    const crossesProtectedBlock = (domY: number) =>
      protectedBlocks.find((b) => b.top < domY && b.bottom > domY);

    const ctxRead = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctxRead) {
      throw new Error('Unable to access canvas pixels for pagination');
    }

    const rowScore = (yPx: number) => {
      const y = Math.max(0, Math.min(canvas.height - 1, yPx));
      const row = ctxRead.getImageData(0, y, canvas.width, 1).data;
      let quietPixels = 0;
      for (let i = 0; i < row.length; i += 4) {
        const r = row[i];
        const g = row[i + 1];
        const b = row[i + 2];
        const a = row[i + 3];
        if (a < 12 || (r > 230 && g > 230 && b > 230)) {
          quietPixels += 1;
        }
      }
      return quietPixels / canvas.width;
    };

    const findBestCutPx = (startPx: number, targetEndPx: number) => {
      const minEndPx = startPx + Math.floor(pageHeightPx * 0.52);
      const searchTop = Math.max(minEndPx, targetEndPx - Math.floor(pageHeightPx * 0.38));
      const searchBottom = Math.min(canvas.height - 1, targetEndPx + Math.floor(pageHeightPx * 0.08));

      let hardTargetPx = targetEndPx;
      const crossing = crossesProtectedBlock(toDomY(hardTargetPx));
      if (crossing) {
        const safeTopPx = toPxY(crossing.top);
        if (safeTopPx >= minEndPx) {
          hardTargetPx = safeTopPx;
        }
      }

      let bestY = targetEndPx;
      let bestScore = -1;
      const refinedTop = Math.max(minEndPx, Math.min(searchTop, hardTargetPx));
      const refinedBottom = Math.max(refinedTop, Math.min(searchBottom, hardTargetPx + Math.floor(pageHeightPx * 0.08)));
      for (let y = refinedTop; y <= refinedBottom; y += 1) {
        if (crossesProtectedBlock(toDomY(y))) continue;
        const score = rowScore(y);
        if (score > bestScore) {
          bestScore = score;
          bestY = y;
          if (score > 0.995) break;
        }
      }

      if (bestScore < 0.65) {
        return hardTargetPx;
      }
      return Math.max(minEndPx, Math.min(bestY, canvas.height));
    };

    const pageSlices: Array<{ start: number; end: number }> = [];
    let startPx = 0;
    let guard = 0;
    while (startPx < canvas.height && guard < 100) {
      guard += 1;
      const targetEndPx = Math.min(startPx + pageHeightPx, canvas.height);
      if (targetEndPx >= canvas.height) {
        pageSlices.push({ start: startPx, end: canvas.height });
        break;
      }

      let endPx = findBestCutPx(startPx, targetEndPx);
      if (!Number.isFinite(endPx) || endPx <= startPx + 80) {
        endPx = targetEndPx;
      }
      endPx = Math.min(Math.max(endPx, startPx + 80), canvas.height);
      pageSlices.push({ start: startPx, end: endPx });
      startPx = endPx;
    }

    for (let pageIndex = 0; pageIndex < pageSlices.length; pageIndex += 1) {
      const sourceY = pageSlices[pageIndex].start;
      const sliceHeight = pageSlices[pageIndex].end - pageSlices[pageIndex].start;
      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = canvas.width;
      pageCanvas.height = sliceHeight;
      const ctx = pageCanvas.getContext('2d');
      if (!ctx) {
        throw new Error('Unable to prepare PDF canvas page');
      }
      ctx.drawImage(canvas, 0, sourceY, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight);

      const imgData = pageCanvas.toDataURL('image/png');
      const renderWidthMm = pageSpec.contentWidthMm;
      const renderHeightMm = (sliceHeight * renderWidthMm) / canvas.width;
      if (pageIndex > 0) {
        pdf.addPage();
      }
      pdf.addImage(imgData, 'PNG', PAGE_MARGIN_MM, PAGE_MARGIN_MM, renderWidthMm, renderHeightMm, undefined, 'MEDIUM');
    }

    return pdf.output('blob') as Blob;
  };

  const openPrintFallback = (
    title: string,
    slug: string,
    content: string,
    pageFormat: 'A4' | 'Letter',
    fitScale = 1
  ) => {
    const html = buildHtmlForServerPdf(title, slug, content, pageFormat, fitScale);
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      throw new Error('Unable to open print window');
    }
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    const triggerPrint = () => {
      printWindow.focus();
      printWindow.print();
    };
    if (printWindow.document.readyState === 'complete') {
      triggerPrint();
    } else {
      printWindow.onload = triggerPrint;
    }
  };

  const generateTemplatePdfBlob = async (template: TemplatePdfExporterTemplate) => {
    const pageFormat = getPageFormat(template);
    const forceSinglePage = isStrictSinglePageTemplate(template.slug);
    const pageSpec = getPageSpec(pageFormat);
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
    const contentHeightPx = Math.max(sourceElement.scrollHeight, sourceElement.offsetHeight, 1);
    const fitScale =
      forceSinglePage && isAutoScaleSinglePageTemplate(template.slug)
        ? Math.min(1, pageSpec.contentHeightPx / contentHeightPx)
        : 1;
    try {
      await waitForClientAssets(sourceElement);

      // Force strict one-page templates through the client fit-to-page renderer
      // to avoid occasional server-side pagination splits.
      if (forceSinglePage) {
        return await generateClientSidePdfBlob(sourceElement, pageFormat, true);
      }

      try {
        const html = buildHtmlForServerPdf(safeName, template.slug, sourceElement.innerHTML, pageFormat, fitScale);
        const response = await fetch('/api/templates/export-pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            templateId: template.id,
            slug: template.slug,
            fileName: safeName,
            pageTier: forceSinglePage ? 'one-page' : template.pageTier,
            pageFormat,
            html
          })
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          const details = data?.details ? ` (${data.details})` : '';
          throw new Error(`${data?.error || 'Server PDF export failed'}${details}`);
        }

        return await response.blob();
      } catch (serverError) {
        console.warn('Server PDF export failed. Trying client PDF export.', serverError);
      }

      try {
        return await generateClientSidePdfBlob(sourceElement, pageFormat, forceSinglePage);
      } catch (clientError) {
        console.warn('Client PDF export failed. Falling back to print dialog.', clientError);
        openPrintFallback(safeName, template.slug, sourceElement.innerHTML, pageFormat, fitScale);
        throw new Error(PRINT_FALLBACK_OPENED);
      }
    } finally {
      setExportTemplate(null);
    }
  };

  useImperativeHandle(ref, () => ({
    async exportTemplate(template: TemplatePdfExporterTemplate) {
      const safeName = (template.name || 'template').replace(/[\\/:*?"<>|]/g, '-').trim() || 'template';
      try {
        const blob = await generateTemplatePdfBlob(template);
        downloadBlob(blob, safeName);
      } catch (error) {
        if (error instanceof Error && error.message === PRINT_FALLBACK_OPENED) {
          return;
        }
        throw error;
      } finally {
        setExportTemplate(null);
      }
    },
    async generateTemplatePdfBlob(template: TemplatePdfExporterTemplate) {
      return await generateTemplatePdfBlob(template);
    }
  }));

  return (
    <div className="fixed inset-0 pointer-events-none opacity-0 overflow-hidden" aria-hidden="true">
      {(() => {
        const exportSize = getExportRootSize(exportTemplate || undefined);
        return (
      <div
        ref={exportRef}
        data-template-id={exportTemplate?.id ?? -1}
        style={{
          width: exportSize.widthPx,
          minHeight: exportSize.heightPx,
          background: '#ffffff',
          direction: 'ltr',
          margin: '0 auto'
        }}
      >
        {exportTemplate
          ? renderPremiumTemplateNode({
            slug: exportTemplate.slug,
            config: exportTemplate.config,
            data: exportTemplate.data
          })
          : null}
      </div>
        );
      })()}
    </div>
  );
});

