import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import { join } from 'path';
import {
  PROFESSIONAL_TEMPLATES,
  mapProfessionalToEditorConfig
} from '../lib/templates/professional-templates';

dotenv.config({ path: join(process.cwd(), '.env.local') });

const sql = neon(process.env.DATABASE_URL!);

type SeedTemplate = {
  name: string;
  slug: string;
  description: string;
  category: string;
  thumbnail: string | null;
  price: number;
  config: Record<string, unknown>;
};

const toSeedTemplates = (): SeedTemplate[] =>
  Object.entries(PROFESSIONAL_TEMPLATES).map(([slug, template]) => {
    const pageTier = template.pageTier || 'one-page';
    const resolvedPrice = pageTier === 'two-page' ? 20000 : 10000;
    const editorConfig = mapProfessionalToEditorConfig(template) as Record<string, unknown>;
    return {
      name: template.name,
      slug,
      description: `${template.name} - Professional CV template`,
      category: pageTier === 'two-page' ? 'Two Pages' : 'One Page',
      thumbnail: null,
      price: resolvedPrice,
      config: {
        ...editorConfig,
        designId: template.id,
        style: template.style,
        layout: template.layout,
        pageTier,
        sections: template.sections
      }
    };
  });

async function seedPremiumTemplates() {
  const templates = toSeedTemplates();

  for (const template of templates) {
    await sql`
      INSERT INTO templates (
        name,
        slug,
        description,
        category,
        thumbnail,
        is_premium,
        price,
        rating,
        downloads,
        config
      )
      VALUES (
        ${template.name},
        ${template.slug},
        ${template.description},
        ${template.category},
        ${template.thumbnail},
        true,
        ${template.price},
        5,
        0,
        ${JSON.stringify(template.config)}::jsonb
      )
      ON CONFLICT (slug)
      DO UPDATE SET
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        category = EXCLUDED.category,
        thumbnail = EXCLUDED.thumbnail,
        is_premium = EXCLUDED.is_premium,
        price = EXCLUDED.price,
        config = EXCLUDED.config
    `;
  }

  console.log(`Seeded premium templates: ${templates.length}`);
  console.log(templates.map((template) => template.slug).join(', '));
}

seedPremiumTemplates().catch((error) => {
  console.error('Failed to seed premium templates:', error);
  process.exit(1);
});
