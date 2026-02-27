'use client';

import React from 'react';
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

interface RenderTemplateNodeOptions {
  slug: string;
  config?: Partial<TemplateConfig> | null;
}

export function renderPremiumTemplateNode(options: RenderTemplateNodeOptions): React.ReactNode {
  const { slug, config: configFromDb } = options;
  const normalizedSlug = slug.toLowerCase().replace(/[-_\s]/g, '');
  const professionalTemplate = getProfessionalTemplateBySlug(slug);
  const fallbackConfig = professionalTemplate ? mapProfessionalToEditorConfig(professionalTemplate) : undefined;
  const config = configFromDb || fallbackConfig;
  const props = { data: TEMPLATE_PREVIEW_DATA, config };

  switch (normalizedSlug) {
    case 'executive':
    case 'boardroomelite':
      return <ExecutiveProTemplate {...props} />;
    case 'techmaster':
    case 'startupone':
      return <TechMasterProTemplate {...props} />;
    case 'academicelite':
      return <AcademicEliteProTemplate {...props} />;
    case 'medicalpro':
      return <MedicalProTemplate {...props} />;
    case 'financeelite':
    case 'financequant':
      return <FinanceEliteTemplate {...props} />;
    case 'legalexpert':
    case 'legalmodern':
      return <LegalExpertTemplate {...props} />;
    case 'marketingguru':
      return <MarketingGuruTemplate {...props} />;
    case 'architectpro':
    case 'minimalnordic':
      return <ArchitectProTemplate {...props} />;
    case 'hrpro':
      return <HrProTemplate {...props} />;
    case 'salesstar':
      return <SalesStarTemplate {...props} />;
    case 'globaledge':
    case 'consultingprime':
      return <GlobalEdgeTemplate {...props} />;
    case 'auroraprime':
    case 'productlead':
      return <AuroraPrimeTemplate {...props} />;
    default:
      return null;
  }
}
