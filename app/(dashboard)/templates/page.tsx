import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import { neon } from '@neondatabase/serverless';
import { TemplateShowcase } from '@/components/templates/TemplateShowcase';
import type { TemplateConfig } from '@/lib/types/template-config';

const sql = neon(process.env.DATABASE_URL!);
const BUNDLE_TEMPLATE_LIMIT = 10;

export default async function TemplatesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');
  const userId = Number.parseInt(session.user.id, 10);

  const [templates, userPurchases, userBundle] = await Promise.all([
    sql`
      SELECT * FROM templates
      WHERE is_premium = true
      ORDER BY price DESC, name
    `,
    sql`
      SELECT template_id FROM payments
      WHERE user_id = ${userId}
      AND status = 'approved'
      AND template_id != 0
    `,
    sql`
      SELECT id FROM payments
      WHERE user_id = ${userId}
      AND template_id = 0
      AND status = 'approved'
      LIMIT 1
    `
  ]);

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

  const purchasedTemplateIds = new Set(userPurchases.map((p) => p.template_id));
  const hasBundle = userBundle.length > 0;

  if (hasBundle) {
    const bundleTemplates = await sql`
      SELECT id
      FROM templates
      WHERE is_premium = true
      ORDER BY price DESC, name
      LIMIT ${BUNDLE_TEMPLATE_LIMIT}
    `;

    for (const template of bundleTemplates) {
      purchasedTemplateIds.add(Number(template.id));
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(800px_400px_at_90%_-20%,#dbeafe_0%,transparent_60%),linear-gradient(180deg,#f8fafc_0%,#f1f5f9_55%,#ffffff_100%)] dark:bg-[radial-gradient(800px_400px_at_90%_-20%,#1e3a8a_0%,transparent_60%),linear-gradient(180deg,#0b1220_0%,#0f172a_55%,#020617_100%)]">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <section className="rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 backdrop-blur-sm p-5 sm:p-8 shadow-sm">
          <p className="inline-flex rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30 px-3 py-1 text-xs font-semibold">
            Premium CV Collection
          </p>
          <h1 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-slate-100">
            قوالب احترافية بتجربة عرض أوضح
          </h1>
          <p className="mt-3 max-w-3xl text-sm sm:text-base text-slate-600 dark:text-slate-300">
            اختر قالبك من معرض متجاوب مصمم للموبايل واللابتوب، مع معاينة واضحة ودقيقة قبل الشراء أو التحميل.
          </p>
        </section>

        <div className="mt-6 sm:mt-8">
          <TemplateShowcase
            templates={normalizedTemplates}
            purchasedTemplates={purchasedTemplateIds}
            userId={userId}
          />
        </div>
      </div>
    </div>
  );
}

