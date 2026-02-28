'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Image as ImageIcon, ArrowUpRight } from 'lucide-react';
import {
  ExecutiveProTemplate,
  TechMasterProTemplate,
  AcademicEliteProTemplate,
  MedicalProTemplate,
  FinanceEliteTemplate,
  LegalExpertTemplate,
  MarketingGuruTemplate,
  ArchitectProTemplate,
  HrProTemplate,
  SalesStarTemplate,
  GlobalEdgeTemplate,
  AuroraPrimeTemplate
} from '@/components/templates/premium/PremiumTemplates';
import { getProfessionalTemplateBySlug, mapProfessionalToEditorConfig } from '@/lib/templates/professional-templates';
import { TEMPLATE_PREVIEW_DATA } from '@/components/templates/premium/previewData';
import type { TemplateConfig } from '@/components/cvs/editor/types/templateConfig';

interface TemplateItem {
  id: number;
  name: string;
  slug: string;
  is_premium: boolean;
}

const PREVIEW_WIDTH = 840;
const PREVIEW_HEIGHT = 1188;

const DEFAULT_PREVIEW_CONFIG: TemplateConfig = {
  primaryColor: '#2563eb',
  secondaryColor: '#4f46e5',
  headingColor: '#0f172a',
  textColor: '#334155',
  mutedTextColor: '#64748b',
  headerTextColor: '#ffffff',
  pageColor: '#ffffff',
  background: 'light',
  fontFamily: 'Cairo',
  headingFontFamily: 'Cairo',
  fontSize: 'medium',
  lineHeight: 1.5,
  nameSize: 40,
  titleSize: 22,
  sectionTitleSize: 22,
  bodySize: 14,
  sectionSpacing: 24,
  blockSpacing: 14,
  pagePadding: 32,
  pageWidth: 860,
  margins: 'normal',
  showBorders: true,
  borderWidth: 1,
  showShadows: true,
  roundedCorners: true,
  radiusSize: 16,
  presetLocked: false
};

function TemplateCardLivePreview({ slug }: { slug: string }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.35);

  const normalizedSlug = slug.toLowerCase().replace(/[-_\s]/g, '');
  const professionalTemplate = getProfessionalTemplateBySlug(slug);
  const config: TemplateConfig | undefined = professionalTemplate
    ? { ...DEFAULT_PREVIEW_CONFIG, ...mapProfessionalToEditorConfig(professionalTemplate) }
    : undefined;
  const props = { data: TEMPLATE_PREVIEW_DATA, config };

  useEffect(() => {
    const element = frameRef.current;
    if (!element) return;

    const updateScale = () => {
      const width = Math.max(element.clientWidth - 14, 0);
      const height = Math.max(element.clientHeight - 14, 0);
      const nextScale = Math.min(width / PREVIEW_WIDTH, height / PREVIEW_HEIGHT);
      setScale(Number.isFinite(nextScale) ? Math.max(0.2, nextScale) : 0.35);
    };

    updateScale();

    const observer = new ResizeObserver(updateScale);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const node = (() => {
    switch (normalizedSlug) {
      case 'executive':
        return <ExecutiveProTemplate {...props} />;
      case 'techmaster':
        return <TechMasterProTemplate {...props} />;
      case 'academicelite':
        return <AcademicEliteProTemplate {...props} />;
      case 'medicalpro':
        return <MedicalProTemplate {...props} />;
      case 'financeelite':
        return <FinanceEliteTemplate {...props} />;
      case 'legalexpert':
        return <LegalExpertTemplate {...props} />;
      case 'marketingguru':
        return <MarketingGuruTemplate {...props} />;
      case 'architectpro':
        return <ArchitectProTemplate {...props} />;
      case 'hrpro':
        return <HrProTemplate {...props} />;
      case 'salesstar':
        return <SalesStarTemplate {...props} />;
      case 'globaledge':
        return <GlobalEdgeTemplate {...props} />;
      case 'auroraprime':
        return <AuroraPrimeTemplate {...props} />;
      default:
        return null;
    }
  })();

  if (!node) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
        <ImageIcon size={40} className="text-slate-400" />
      </div>
    );
  }

  return (
    <div
      ref={frameRef}
      dir="ltr"
      className="absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_top,#f8fafc_0%,#dbeafe_45%,#cbd5e1_100%)] dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900"
    >
      <div className="absolute inset-[8px] rounded-xl border border-slate-300/80 dark:border-slate-700/80 shadow-inner bg-white/70 dark:bg-slate-900/40" />
      <div className="absolute inset-[8px] overflow-hidden rounded-xl">
        <div
          className="absolute left-1/2 top-1 origin-top pointer-events-none"
          style={{ transform: `translateX(-50%) scale(${scale})`, transformOrigin: 'top center' }}
        >
          <div style={{ width: PREVIEW_WIDTH, minHeight: PREVIEW_HEIGHT, direction: 'ltr' }}>{node}</div>
        </div>
      </div>
    </div>
  );
}

export function TemplateGallery({ templates }: { templates: TemplateItem[] }) {
  const router = useRouter();
  const premiumTemplates = templates.filter((template) => template.is_premium);

  const handleTemplateClick = (template: TemplateItem) => {
    if (!template.slug) return;
    router.push(`/cvs/new/${template.slug}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
      {premiumTemplates.map((template) => (
        <button
          type="button"
          key={template.id}
          className="text-right bg-white dark:bg-gray-900 rounded-2xl shadow-[0_15px_40px_rgba(15,23,42,0.12)] overflow-hidden hover:shadow-[0_22px_50px_rgba(15,23,42,0.18)] transition cursor-pointer group border border-slate-200 dark:border-slate-800"
          onClick={() => handleTemplateClick(template)}
        >
          <div className="aspect-[210/297] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 relative overflow-hidden">
            <TemplateCardLivePreview slug={template.slug} />
            <span className="absolute top-3 right-3 rounded-full bg-amber-500 text-white text-[11px] px-2.5 py-1 font-bold shadow">
              Premium
            </span>
          </div>

          <div className="p-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">{template.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">معاينة متجاوبة وواضحة</p>
            </div>
            <span className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 text-sm font-semibold">
              فتح
              <ArrowUpRight size={16} />
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
