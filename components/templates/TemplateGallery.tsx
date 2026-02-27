'use client';

import { useRouter } from 'next/navigation';
import { Image as ImageIcon } from 'lucide-react';
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

interface TemplateItem {
  id: number;
  name: string;
  slug: string;
  is_premium: boolean;
}

function TemplateCardLivePreview({ slug }: { slug: string }) {
  const normalizedSlug = slug.toLowerCase().replace(/[-_\s]/g, '');
  const professionalTemplate = getProfessionalTemplateBySlug(slug);
  const config = professionalTemplate ? mapProfessionalToEditorConfig(professionalTemplate) : undefined;
  const props = { data: TEMPLATE_PREVIEW_DATA, config };

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
      dir="ltr"
      className="absolute inset-0 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900"
    >
      <div className="absolute inset-2 rounded-xl border border-slate-300/80 dark:border-slate-700/80 shadow-inner bg-white/70 dark:bg-slate-900/40" />
      <div className="absolute inset-2 overflow-hidden rounded-xl">
        <div className="absolute left-1/2 top-2 origin-top pointer-events-none" style={{ transform: 'translateX(-50%)' }}>
          <div
            style={{
              width: 840,
              minHeight: 1188,
              transform: 'scale(0.44)',
              transformOrigin: 'top center',
              direction: 'ltr'
            }}
          >
            {node}
          </div>
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
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {premiumTemplates.map((template) => (
        <div
          key={template.id}
          className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition cursor-pointer group border border-gray-100 dark:border-gray-800"
          onClick={() => handleTemplateClick(template)}
        >
          <div className="aspect-[210/297] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 relative overflow-hidden">
            <TemplateCardLivePreview slug={template.slug} />
            <span className="absolute top-3 right-3 rounded-full bg-amber-500 text-white text-[11px] px-2.5 py-1 font-bold shadow">
              Premium
            </span>
          </div>
          <div className="p-4">
            <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-white">{template.name}</h3>
            <button className="text-blue-600 hover:text-blue-700 font-medium">فتح القالب</button>
          </div>
        </div>
      ))}
    </div>
  );
}
