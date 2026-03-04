'use client';

import React from 'react';
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
import type { CVData } from '@/components/cvs/types';

interface RenderTemplateNodeOptions {
  slug: string;
  config?: Partial<TemplateConfig> | null;
  data?: CVData;
}

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

const TEMPLATE_VISUAL_PRESETS: Record<string, Partial<TemplateConfig>> = {
  minimalnordic: {
    primaryColor: '#1f2937',
    secondaryColor: '#6b7280',
    headingColor: '#374151',
    textColor: '#4b5563',
    fontFamily: '"Calibri", "Segoe UI", Arial, sans-serif',
    headingFontFamily: '"Segoe UI", "Calibri", sans-serif',
    roundedCorners: false,
    radiusSize: 4,
    showShadows: false,
    borderWidth: 1,
    sectionSpacing: 14,
    blockSpacing: 7,
    pagePadding: 58
  },
  salesstar: {
    primaryColor: '#9a3412',
    secondaryColor: '#0f172a',
    headingColor: '#7c2d12',
    textColor: '#3f3f46',
    fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
    headingFontFamily: '"Segoe UI Semibold", "Segoe UI", sans-serif',
    radiusSize: 8,
    showShadows: false,
    borderWidth: 1
  },
  richard: {
    primaryColor: '#243b53',
    secondaryColor: '#1f3247',
    headingColor: '#243b53',
    textColor: '#1f2933',
    fontFamily: '"Poppins", "Montserrat", "Segoe UI", sans-serif',
    headingFontFamily: '"Poppins", "Montserrat", "Segoe UI", sans-serif',
    radiusSize: 0,
    showShadows: false,
    borderWidth: 0
  },
  andreemas: {
    primaryColor: '#9ec0e1',
    secondaryColor: '#2f3034',
    headingColor: '#2f3034',
    textColor: '#41464d',
    mutedTextColor: '#7d8590',
    fontFamily: '"Montserrat", "Segoe UI", Arial, sans-serif',
    headingFontFamily: '"Montserrat", "Segoe UI", Arial, sans-serif',
    radiusSize: 0,
    showShadows: false,
    borderWidth: 0
  },
  productlead: {
    primaryColor: '#0f4c81',
    secondaryColor: '#334155',
    headingColor: '#0f172a',
    textColor: '#334155',
    fontFamily: '"Segoe UI", Tahoma, Arial, sans-serif',
    headingFontFamily: '"Segoe UI", Tahoma, Arial, sans-serif',
    radiusSize: 12,
    borderWidth: 1
  },
  julianasilva: {
    primaryColor: '#377d98',
    secondaryColor: '#2f6d8f',
    headingColor: '#11181f',
    textColor: '#1f2d36',
    fontFamily: '"Nunito Sans", "Nunito", "Segoe UI", Arial, sans-serif',
    headingFontFamily: '"Playfair Display", "Times New Roman", serif',
    roundedCorners: true,
    radiusSize: 15,
    borderWidth: 0,
    showShadows: false
  },
  alidaplanet: {
    primaryColor: '#9a7432',
    secondaryColor: '#3b829d',
    headingColor: '#1a1a1a',
    textColor: '#1f2b33',
    fontFamily: '"Lato", "Segoe UI", Arial, sans-serif',
    headingFontFamily: '"Cormorant Garamond", "Times New Roman", serif',
    roundedCorners: true,
    radiusSize: 26,
    borderWidth: 0,
    showShadows: false
  }
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function isValidHexColor(value: string | undefined): value is string {
  return Boolean(value && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value));
}

function normalizeAtsConfig(config: TemplateConfig): TemplateConfig {
  const headingColor = isValidHexColor(config.headingColor) ? config.headingColor : '#0f172a';
  const textColor = isValidHexColor(config.textColor) ? config.textColor : '#1f2937';
  const mutedTextColor = isValidHexColor(config.mutedTextColor) ? config.mutedTextColor : '#475569';
  const primaryColor = isValidHexColor(config.primaryColor) ? config.primaryColor : '#1d4ed8';
  const secondaryColor = isValidHexColor(config.secondaryColor) ? config.secondaryColor : '#2563eb';

  return {
    ...config,
    pageFormat: config.pageFormat === 'Letter' ? 'Letter' : 'A4',
    primaryColor,
    secondaryColor,
    headingColor,
    textColor,
    mutedTextColor,
    pageColor: '#ffffff',
    background: 'light',
    lineHeight: clamp(config.lineHeight || 1.3, 1.15, 1.4),
    nameSize: clamp(config.nameSize || 34, 27, 37),
    titleSize: clamp(config.titleSize || 17, 16, 19),
    sectionTitleSize: clamp(config.sectionTitleSize || 15, 15, 18),
    bodySize: clamp(config.bodySize || 11, 10, 11),
    sectionSpacing: clamp(config.sectionSpacing || 16, 13, 21),
    blockSpacing: clamp(config.blockSpacing || 8, 5, 11),
    pagePadding: clamp(config.pagePadding || 64, 57, 76)
  };
}

export function renderPremiumTemplateNode(options: RenderTemplateNodeOptions): React.ReactNode {
  const { slug, config: configFromDb, data } = options;
  const normalizedSlug = (slug || '').toLowerCase().replace(/[-_\s]/g, '');

  const professionalTemplate = getProfessionalTemplateBySlug(slug);
  const fallbackConfig = professionalTemplate ? mapProfessionalToEditorConfig(professionalTemplate) : undefined;
  const presetConfig = TEMPLATE_VISUAL_PRESETS[normalizedSlug] || {};
  const mergedConfig: TemplateConfig = {
    ...DEFAULT_PREVIEW_CONFIG,
    ...(fallbackConfig || {}),
    ...presetConfig,
    ...(configFromDb || {})
  };
  const config = normalizeAtsConfig(mergedConfig);

  const fallbackData =
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
              : TEMPLATE_PREVIEW_DATA;

  const props = { data: data || fallbackData, config };

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
}
