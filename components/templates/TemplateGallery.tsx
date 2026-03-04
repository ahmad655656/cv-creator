'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Image as ImageIcon, ArrowUpRight } from 'lucide-react';
import {
  MinimalNordicTemplate,
  SalesStarTemplate,
  RichardPremiumTemplate,
  AndreEmaasTemplate,
  ProductLeadTemplate,
  JulianaSilvaTemplate,
  AlidaPlanetTemplate
} from '@/components/templates/premium/PremiumTemplates';
import { getProfessionalTemplateBySlug, mapProfessionalToEditorConfig } from '@/lib/templates/professional-templates';
import {
  TEMPLATE_PREVIEW_DATA,
  MINIMAL_NORDIC_PREVIEW_DATA,
  SALES_STAR_PREVIEW_DATA,
  RICHARD_PREVIEW_DATA,
  ANDREEMAAS_PREVIEW_DATA,
  PRODUCT_LEAD_PREVIEW_DATA,
  JULIANA_SILVA_PREVIEW_DATA,
  ALIDA_PLANET_PREVIEW_DATA
} from '@/components/templates/premium/previewData';
import type { TemplateConfig } from '@/lib/types/template-config';
import { isAllowedPremiumSlug, normalizeTemplateSlug } from '@/lib/templates/allowedPremiumSlugs';

interface TemplateItem {
  id: number;
  name: string;
  slug: string;
  is_premium: boolean;
  thumbnail?: string;
}

const PREVIEW_WIDTH = 840;
const PREVIEW_HEIGHT = 1188;
const MINIMAL_NORDIC_CARD_IMAGE = '/Minimal%20Nordic.jpg';
const SALES_STAR_CARD_IMAGE = '/SalesStar.jpg';
const PRODUCT_LEAD_CARD_IMAGE = '/ProductLead.png';
const RICHARD_CARD_IMAGE = '/richard.jpg';
const ANDREEMAAS_CARD_IMAGE = '/andree.png';
const ALIDA_PLANET_CARD_IMAGE = '/emmajames.jpg';

const DEFAULT_PREVIEW_CONFIG: TemplateConfig = {
  pageFormat: 'A4',
  primaryColor: '#1e3a8a',
  secondaryColor: '#334155',
  headingColor: '#0f172a',
  textColor: '#1f2937',
  mutedTextColor: '#64748b',
  headerTextColor: '#ffffff',
  pageColor: '#ffffff',
  background: 'light',
  fontFamily: '"Calibri", "Segoe UI", Arial, sans-serif',
  headingFontFamily: '"Cambria", "Georgia", serif',
  fontSize: 'medium',
  lineHeight: 1.3,
  nameSize: 34,
  titleSize: 17,
  sectionTitleSize: 15,
  bodySize: 11,
  sectionSpacing: 16,
  blockSpacing: 8,
  pagePadding: 64,
  pageWidth: 794,
  margins: 'normal',
  showBorders: true,
  borderWidth: 1,
  showShadows: false,
  roundedCorners: true,
  radiusSize: 10,
  presetLocked: false
};

function TemplateCardLivePreview({ slug, staticImageSrc }: { slug: string; staticImageSrc?: string }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.35);

  const normalizedSlug = normalizeTemplateSlug(slug);
  const professionalTemplate = getProfessionalTemplateBySlug(slug);
  const config: TemplateConfig | undefined = professionalTemplate
    ? { ...DEFAULT_PREVIEW_CONFIG, ...mapProfessionalToEditorConfig(professionalTemplate) }
    : undefined;
  const props = {
    data:
      normalizedSlug === 'minimalnordic'
        ? MINIMAL_NORDIC_PREVIEW_DATA
        : normalizedSlug === 'salesstar'
          ? SALES_STAR_PREVIEW_DATA
          : normalizedSlug === 'richard'
            ? RICHARD_PREVIEW_DATA
            : normalizedSlug === 'andreemas'
              ? ANDREEMAAS_PREVIEW_DATA
              : normalizedSlug === 'productlead'
                ? PRODUCT_LEAD_PREVIEW_DATA
                : normalizedSlug === 'julianasilva'
                  ? JULIANA_SILVA_PREVIEW_DATA
                  : normalizedSlug === 'alidaplanet'
                    ? ALIDA_PLANET_PREVIEW_DATA
                    : TEMPLATE_PREVIEW_DATA,
    config
  };

  useEffect(() => {
    const element = frameRef.current;
    if (!element) return;

    const updateScale = () => {
      const width = Math.max(element.clientWidth, 0);
      const height = Math.max(element.clientHeight, 0);
      const nextScale = Math.min(width / PREVIEW_WIDTH, height / PREVIEW_HEIGHT);
      setScale(Number.isFinite(nextScale) ? Math.max(0.2, nextScale) : 0.35);
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  if (staticImageSrc) {
    return (
      <div dir="ltr" className="h-full w-full bg-[#f5f6f7] p-[5%]">
        <div className="h-full w-full flex items-center justify-center rounded-[16px] bg-[#f5f6f7]">
          <img
            src={staticImageSrc}
            alt={`${slug} template preview`}
            className="relative z-10 opacity-100 [filter:none] [backdrop-filter:none] w-full h-full rounded-[14px] shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
            style={{ objectFit: 'contain' }}
            draggable={false}
          />
        </div>
      </div>
    );
  }

  const node = (() => {
    switch (normalizedSlug) {
      case 'minimalnordic':
        return <MinimalNordicTemplate {...props} />;
      case 'salesstar':
        return <SalesStarTemplate {...props} />;
      case 'richard':
        return <RichardPremiumTemplate {...props} />;
      case 'andreemas':
        return <AndreEmaasTemplate {...props} />;
      case 'productlead':
        return <ProductLeadTemplate {...props} />;
      case 'julianasilva':
        return <JulianaSilvaTemplate {...props} />;
      case 'alidaplanet':
        return <AlidaPlanetTemplate {...props} />;
      default:
        return null;
    }
  })();

  if (!node) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#f5f6f7]">
        <ImageIcon size={40} className="text-slate-400" />
      </div>
    );
  }

  return (
    <div dir="ltr" className="h-full w-full bg-[#f5f6f7] p-[5%]">
      <div ref={frameRef} className="h-full w-full flex items-center justify-center rounded-[16px] bg-[#f5f6f7]">
        <div
          className="pointer-events-none relative z-10 opacity-100 [filter:none] [backdrop-filter:none] rounded-[14px] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
          style={{ transform: `scale(${scale})`, transformOrigin: 'center center', width: `${PREVIEW_WIDTH}px`, minHeight: `${PREVIEW_HEIGHT}px` }}
        >
          <div style={{ width: PREVIEW_WIDTH, minHeight: PREVIEW_HEIGHT, direction: 'ltr' }}>{node}</div>
        </div>
      </div>
    </div>
  );
}

export function TemplateGallery({ templates }: { templates: TemplateItem[] }) {
  const router = useRouter();
  const premiumTemplates = templates.filter((template) =>
    template.is_premium && isAllowedPremiumSlug(template.slug || '')
  );

  const handleTemplateClick = (template: TemplateItem) => {
    if (!template.slug) return;
    router.push(`/templates?focus=${template.slug}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
      {premiumTemplates.map((template) => (
        <button
          type="button"
          key={template.id}
          className="h-full text-right bg-white dark:bg-gray-900 rounded-2xl hover:shadow-[0_8px_22px_rgba(15,23,42,0.16)] transition duration-300 cursor-pointer group border border-slate-200 dark:border-slate-800 transform-gpu hover:scale-[1.02] overflow-hidden flex flex-col"
          onClick={() => handleTemplateClick(template)}
        >
          <div className="aspect-[210/297] bg-[#f5f6f7]">
            <TemplateCardLivePreview
              slug={template.slug}
              staticImageSrc={(() => {
                const normalizedSlug = normalizeTemplateSlug(template.slug || '');
                if (normalizedSlug === 'minimalnordic') return MINIMAL_NORDIC_CARD_IMAGE;
                if (normalizedSlug === 'salesstar') return SALES_STAR_CARD_IMAGE;
                if (normalizedSlug === 'richard') return RICHARD_CARD_IMAGE;
                if (normalizedSlug === 'andreemas') return ANDREEMAAS_CARD_IMAGE;
                if (normalizedSlug === 'productlead') return PRODUCT_LEAD_CARD_IMAGE;
                if (normalizedSlug === 'alidaplanet') return ALIDA_PLANET_CARD_IMAGE;
                return undefined;
              })()}
            />
          </div>

          <div className="p-3 sm:p-3.5 flex items-center justify-between gap-3 mt-auto">
            <div className="min-w-0">
              <h3 className="font-semibold text-[13px] sm:text-[14px] text-slate-900 dark:text-white leading-tight line-clamp-2">
                {template.name}
              </h3>
              <div className="mt-1 flex items-center gap-2">
                <p className="text-[10px] text-slate-500 dark:text-slate-400">A4 Preview</p>
                <span className="rounded-full bg-amber-500 text-white text-[10px] px-2 py-0.5 font-bold shadow-sm">
                  Premium
                </span>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 text-[11px] font-semibold shrink-0">
              فتح
              <ArrowUpRight size={16} />
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
