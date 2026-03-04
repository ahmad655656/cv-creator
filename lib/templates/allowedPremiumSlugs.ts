export const ALLOWED_PREMIUM_SLUGS = [
  'richard',
  'salesstar',
  'alidaplanet',
  'andreemas',
  'julianasilva',
  'minimalnordic',
  'productlead'
] as const;

export const ALLOWED_PREMIUM_SLUG_SET = new Set<string>(ALLOWED_PREMIUM_SLUGS);

export function normalizeTemplateSlug(slug: string) {
  return (slug || '').toLowerCase().replace(/[-_\s]/g, '');
}

export function isAllowedPremiumSlug(slug: string) {
  return ALLOWED_PREMIUM_SLUG_SET.has(normalizeTemplateSlug(slug));
}
