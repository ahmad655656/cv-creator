import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import { neon } from '@neondatabase/serverless';
import { TemplateShowcase } from '@/components/templates/TemplateShowcase';
import type { TemplateConfig } from '@/components/cvs/editor/types/templateConfig';

const sql = neon(process.env.DATABASE_URL!);

export default async function TemplatesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  // جلب القوالب من قاعدة البيانات
  const templates = await sql`
    SELECT * FROM templates
    WHERE is_premium = true
    ORDER BY price DESC, name
  `;
  const normalizedTemplates = templates.map((template) => ({
    id: Number(template.id),
    name: String(template.name ?? 'Template'),
    slug: String(template.slug ?? ''),
    config: (template.config ?? null) as
      | (Partial<TemplateConfig> & { pageTier?: 'one-page' | 'two-page' })
      | null,
    description: String(template.description ?? ''),
    category: String(template.category ?? 'General'),
    thumbnail: String(template.thumbnail ?? ''),
    is_premium: Boolean(template.is_premium),
    price: Number(template.price ?? 0),
    rating: Number(template.rating ?? 0),
    downloads: Number(template.downloads ?? 0),
  }));

  // جلب اشتراكات المستخدم
  const userPurchases = await sql`
    SELECT template_id FROM payments 
    WHERE user_id = ${Number.parseInt(session.user.id, 10)} 
    AND status = 'approved'
  `;

  const purchasedTemplateIds = new Set(
    userPurchases.map(p => p.template_id)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            قوالب احترافية معتمدة عالمياً
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
            اختر القالب المناسب لمجالك. جميع القوالب مصممة وفق أحدث المعايير العالمية ومتوافقة مع أنظمة ATS
          </p>
        </div>
      </div>

      {/* Template Showcase */}
      <div className="container mx-auto px-4 py-8">
        <TemplateShowcase 
          templates={normalizedTemplates} 
          purchasedTemplates={purchasedTemplateIds}
          userId={Number.parseInt(session.user.id, 10)}
        />
      </div>
    </div>
  );
}
