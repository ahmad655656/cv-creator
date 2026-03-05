import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { isAdminRole } from '@/lib/auth/isAdminRole';
import { redirect } from 'next/navigation';
import { neon } from '@neondatabase/serverless';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { CreditCard, LayoutTemplate, Package, ShoppingCart, TrendingUp } from 'lucide-react';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';
import { isAllowedPremiumSlug } from '@/lib/templates/allowedPremiumSlugs';

const sql = neon(process.env.DATABASE_URL!);
const BUNDLE_TEMPLATE_LIMIT = 7;
const ALLOWED_SLUGS_SQL = ['richard', 'salesstar', 'alidaplanet', 'andreemas', 'julianasilva', 'minimalnordic', 'productlead'];

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  const userRole = session.user?.role || 'user';
  const isAdmin = isAdminRole(userRole);

  if (isAdmin) {
    const templateScopeCondition = sql`regexp_replace(lower(t.slug), '[-_\\s]', '', 'g') = ANY(${ALLOWED_SLUGS_SQL})`;

    const [
      totalUsers,
      totalTemplates,
      totalPayments,
      pendingPayments,
      totalCVs,
      recentPayments,
      popularTemplates,
      bundlePayments
    ] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM users`,
      sql`
        SELECT COUNT(*) as count
        FROM templates t
        WHERE ${templateScopeCondition}
      `,
      sql`
        SELECT COUNT(*) as count, COALESCE(SUM(p.amount), 0) as total
        FROM payments p
        LEFT JOIN templates t ON p.template_id = t.id
        WHERE p.status = 'approved'
        AND (
          p.template_id = 0
          OR ${templateScopeCondition}
        )
      `,
      sql`
        SELECT COUNT(*) as count
        FROM payments p
        LEFT JOIN templates t ON p.template_id = t.id
        WHERE p.status = 'pending'
        AND (
          p.template_id = 0
          OR ${templateScopeCondition}
        )
      `,
      sql`
        SELECT COUNT(*) as count
        FROM cvs c
        WHERE regexp_replace(lower(c.template_id), '[-_\\s]', '', 'g') = ANY(${ALLOWED_SLUGS_SQL})
      `,
      sql`
        SELECT p.*, u.name as user_name, u.email, t.name as template_name,
               CASE WHEN p.template_id = 0 THEN 'bundle' ELSE 'single' END as payment_type
        FROM payments p
        JOIN users u ON p.user_id = u.id
        LEFT JOIN templates t ON p.template_id = t.id
        WHERE p.template_id = 0 OR ${templateScopeCondition}
        ORDER BY p.created_at DESC
        LIMIT 5
      `,
      sql`
        SELECT t.name, COUNT(c.id) as usage_count
        FROM templates t
        LEFT JOIN cvs c ON t.slug = c.template_id
        WHERE ${templateScopeCondition}
        GROUP BY t.id, t.name
        ORDER BY usage_count DESC
        LIMIT 5
      `,
      sql`
        SELECT COUNT(*) as count
        FROM payments
        WHERE template_id = 0
        AND status = 'approved'
      `
    ]);

    const adminStats = {
      totalUsers: Number(totalUsers[0]?.count || 0),
      totalTemplates: Number(totalTemplates[0]?.count || 0),
      totalPayments: Number(totalPayments[0]?.count || 0),
      totalRevenue: Number(totalPayments[0]?.total || 0),
      pendingPayments: Number(pendingPayments[0]?.count || 0),
      totalCVs: Number(totalCVs[0]?.count || 0),
      recentPayments: recentPayments || [],
      popularTemplates: popularTemplates || [],
      bundlePayments: Number(bundlePayments[0]?.count || 0)
    };

    return <AdminDashboard stats={adminStats} user={session.user} />;
  }

  const userId = Number.parseInt(session.user.id, 10);

  const [userBundle, purchasedTemplates, approvedPaymentsCount] = await Promise.all([
    sql`
      SELECT id
      FROM payments
      WHERE user_id = ${userId}
      AND template_id = 0
      AND status = 'approved'
      LIMIT 1
    `,
    sql`
      SELECT DISTINCT ON (t.id) t.id, t.name, t.slug, t.category, t.price
      FROM templates t
      JOIN payments p ON t.id = p.template_id
      WHERE p.user_id = ${userId}
      AND p.status = 'approved'
      AND p.template_id != 0
      AND t.is_premium = true
      AND regexp_replace(lower(t.slug), '[-_\\s]', '', 'g') = ANY(${ALLOWED_SLUGS_SQL})
      ORDER BY t.id, t.name
    `,
    sql`
      SELECT COUNT(*)::int AS count
      FROM payments
      WHERE user_id = ${userId}
      AND status = 'approved'
      AND template_id != 0
    `
  ]);

  const hasBundle = userBundle.length > 0;

  const availableTemplates = hasBundle
    ? await sql`
      SELECT id, name, slug, category, price
      FROM templates
      WHERE is_premium = true
      AND regexp_replace(lower(slug), '[-_\\s]', '', 'g') = ANY(${ALLOWED_SLUGS_SQL})
      ORDER BY price DESC, name
      LIMIT ${BUNDLE_TEMPLATE_LIMIT}
    `
    : purchasedTemplates;

  const filteredAvailableTemplates = availableTemplates.filter((template) =>
    isAllowedPremiumSlug(String(template.slug ?? ''))
  );

  const stats = {
    templates: filteredAvailableTemplates.length,
    approvedPayments: Number(approvedPaymentsCount[0]?.count ?? 0),
    hasBundle: hasBundle ? 'نعم' : 'لا',
    status: 'نشط'
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(900px_360px_at_90%_-10%,#dbeafe_0%,transparent_55%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_50%,#ffffff_100%)] dark:bg-[radial-gradient(900px_360px_at_90%_-10%,#1e3a8a_0%,transparent_55%),linear-gradient(180deg,#0b1220_0%,#0f172a_50%,#020617_100%)]">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <section className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/85 dark:bg-slate-900/80 backdrop-blur-sm shadow-sm p-5 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">لوحة التحكم</h1>
              <p className="mt-2 text-slate-600 dark:text-slate-300">أهلاً {session.user.name}، كل شيء جاهز لإدارة القوالب والمدفوعات.</p>
              {hasBundle ? (
                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1 text-sm">
                  <Package size={16} />
                  مشترك في الباقة الشاملة
                </div>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-2">
              <Link href="/templates" className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition">
                <LayoutTemplate size={18} />
                استعراض القوالب
              </Link>
              <Link href="/pricing" className="inline-flex items-center gap-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 px-4 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                <CreditCard size={18} />
                الأسعار
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard title="القوالب المتاحة" value={stats.templates} icon={<LayoutTemplate size={20} />} />
          <StatCard title="عمليات الشراء" value={stats.approvedPayments} icon={<ShoppingCart size={20} />} />
          <StatCard title="اشتراك الباقة" value={stats.hasBundle} icon={<Package size={20} />} />
          <StatCard title="حالة الحساب" value={stats.status} icon={<CreditCard size={20} />} />
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">قوالبك المتاحة</h2>
            <Link href="/templates" className="text-sm text-blue-600 hover:text-blue-700">عرض الكل</Link>
          </div>
          {filteredAvailableTemplates.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">لا توجد قوالب متاحة حالياً. يمكنك الشراء من صفحة القوالب.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredAvailableTemplates.map((template) => (
                <Link
                  key={`${template.id}-${String(template.slug)}`}
                  href={`/templates?focus=${template.slug}`}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 hover:border-blue-400 transition"
                >
                  <p className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">{String(template.name)}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{String(template.category ?? 'General')}</p>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="mt-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-5 sm:p-6 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold">الخطوة التالية</h3>
              <p className="text-blue-100 mt-1">اختر قالبًا مناسبًا ثم أكمل الشراء أو حمّل النسخة المتاحة لديك.</p>
            </div>
            <Link href="/templates" className="inline-flex items-center gap-2 bg-white text-blue-700 px-4 py-2.5 rounded-xl font-semibold hover:bg-slate-100 transition">
              <TrendingUp size={18} />
              الذهاب للقوالب
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: number | string; icon: ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-slate-100">{value}</p>
        </div>
        <div className="w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 flex items-center justify-center">
          {icon}
        </div>
      </div>
    </div>
  );
}


