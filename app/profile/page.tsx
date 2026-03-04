import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import { neon } from '@neondatabase/serverless';
import { CheckCircle2, Crown, Mail, Phone, ShieldCheck, Sparkles, User2 } from 'lucide-react';
import { isAllowedPremiumSlug } from '@/lib/templates/allowedPremiumSlugs';

const sql = neon(process.env.DATABASE_URL!);
const ALLOWED_SLUGS_SQL = ['richard', 'salesstar', 'alidaplanet', 'andreemas', 'julianasilva', 'minimalnordic', 'productlead'];

type PurchasedTemplate = {
  id: number;
  name: string;
  slug: string;
  category: string;
  price: number;
  purchasedAt: string;
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  const userId = Number.parseInt(session.user.id, 10);

  const [userRows, bundleRows, purchasedRows, bundleTemplates] = await Promise.all([
    sql`SELECT id, name, email, role, created_at FROM users WHERE id = ${userId} LIMIT 1`,
    sql`
      SELECT id, created_at
      FROM payments
      WHERE user_id = ${userId}
      AND template_id = 0
      AND status = 'approved'
      ORDER BY created_at DESC
      LIMIT 1
    `,
    sql`
      SELECT DISTINCT ON (t.id)
        t.id,
        t.name,
        t.slug,
        t.category,
        t.price,
        p.created_at AS purchased_at
      FROM payments p
      JOIN templates t ON t.id = p.template_id
      WHERE p.user_id = ${userId}
      AND p.status = 'approved'
      AND p.template_id != 0
      AND regexp_replace(lower(t.slug), '[-_\\s]', '', 'g') = ANY(${ALLOWED_SLUGS_SQL})
      ORDER BY t.id, p.created_at DESC
    `,
    sql`
      SELECT id, name, slug, category, price
      FROM templates
      WHERE is_premium = true
      AND regexp_replace(lower(slug), '[-_\\s]', '', 'g') = ANY(${ALLOWED_SLUGS_SQL})
      ORDER BY price DESC, name
    `,
  ]);

  const user = userRows[0];
  const hasBundle = bundleRows.length > 0;
  const bundlePurchasedAt = hasBundle ? new Date(bundleRows[0].created_at as string | Date) : null;

  const directPurchasedTemplates: PurchasedTemplate[] = purchasedRows
    .filter((row) => isAllowedPremiumSlug(String(row.slug ?? '')))
    .map((row) => ({
      id: Number(row.id),
      name: String(row.name ?? 'Template'),
      slug: String(row.slug ?? ''),
      category: String(row.category ?? 'General'),
      price: Number(row.price ?? 0),
      purchasedAt: new Date(row.purchased_at as string | Date).toISOString(),
    }));

  const purchasedById = new Map<number, PurchasedTemplate>();
  for (const item of directPurchasedTemplates) purchasedById.set(item.id, item);

  const purchasedTemplates: PurchasedTemplate[] = hasBundle
    ? bundleTemplates
        .filter((template) => isAllowedPremiumSlug(String(template.slug ?? '')))
        .map((template) => {
          const direct = purchasedById.get(Number(template.id));
          return (
            direct || {
              id: Number(template.id),
              name: String(template.name ?? 'Template'),
              slug: String(template.slug ?? ''),
              category: String(template.category ?? 'General'),
              price: Number(template.price ?? 0),
              purchasedAt: bundlePurchasedAt ? bundlePurchasedAt.toISOString() : new Date().toISOString(),
            }
          );
        })
    : directPurchasedTemplates;

  const userName = String(user?.name ?? session.user.name ?? 'مستخدم');
  const userEmail = String(user?.email ?? session.user.email ?? '-');
  const joinedDate =
    user?.created_at ? new Date(user.created_at as string | Date).toLocaleDateString('ar-EG') : '-';

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[radial-gradient(900px_420px_at_100%_-10%,#dbeafe_0%,transparent_62%),radial-gradient(700px_340px_at_0%_0%,#cffafe_0%,transparent_52%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_56%,#ffffff_100%)] dark:bg-[radial-gradient(900px_420px_at_100%_-10%,#1e3a8a_0%,transparent_62%),radial-gradient(700px_340px_at_0%_0%,#155e75_0%,transparent_52%),linear-gradient(180deg,#020617_0%,#0b1220_56%,#020617_100%)]"
    >
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <section className="mx-auto max-w-6xl rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_70px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900/85 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300">
                <Sparkles size={14} />
                الملف الشخصي
              </p>

              <h1 className="mt-4 text-3xl font-black text-slate-900 dark:text-slate-100 sm:text-4xl">{userName}</h1>
              <p className="mt-2 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                هذه الصفحة تعرض بيانات حسابك الأساسية والقوالب التي تم شراؤها على هذا الحساب.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <InfoChip icon={Mail} label="البريد الإلكتروني" value={userEmail} />
                <InfoChip icon={ShieldCheck} label="الدور" value={String(user?.role ?? 'user')} />
                <InfoChip icon={User2} label="تاريخ إنشاء الحساب" value={joinedDate} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <StatCard title="القوالب المشتراة" value={String(purchasedTemplates.length)} />
              <StatCard title="نوع الاشتراك" value={hasBundle ? 'باقة شاملة' : 'شراء فردي'} />
              <StatCard title="حالة الحساب" value="نشط" />
              <StatCard title="الدعم" value="متاح" />
            </div>
          </div>
        </section>

        <section className="mx-auto mt-6 max-w-6xl rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/85 sm:p-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <Crown size={18} className="text-amber-500" />
              <h2 className="text-xl font-extrabold">القوالب التي تم شراؤها</h2>
            </div>
            <Link
              href="/templates"
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              الذهاب إلى القوالب
            </Link>
          </div>

          {hasBundle && (
            <div className="mb-4 rounded-xl border border-purple-200 bg-purple-50 px-4 py-3 text-sm text-purple-700 dark:border-purple-700/50 dark:bg-purple-900/20 dark:text-purple-300">
              لديك باقة شاملة مفعلة، وتمت إضافة كل القوالب المتاحة في حسابك.
            </div>
          )}

          {purchasedTemplates.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
              لا يوجد قوالب مشتراة حتى الآن.
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {purchasedTemplates.map((template) => (
                <article
                  key={template.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/80"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-extrabold text-slate-900 dark:text-slate-100">{template.name}</h3>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{template.category}</p>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                      <CheckCircle2 size={12} />
                      Purchased
                    </span>
                  </div>

                  <div className="mt-3 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                    <p>السعر: {Number(template.price || 0).toLocaleString('en-US')} ل.س</p>
                    <p>تاريخ الشراء: {new Date(template.purchasedAt).toLocaleDateString('ar-EG')}</p>
                    <p className="truncate" dir="ltr">
                      /templates?focus={template.slug}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="mx-auto mt-6 max-w-6xl rounded-3xl border border-slate-200 bg-gradient-to-l from-blue-600 to-cyan-600 p-6 text-white shadow-lg dark:border-slate-700 sm:p-8">
          <h3 className="text-2xl font-extrabold">تحتاج مساعدة؟</h3>
          <p className="mt-2 max-w-3xl text-sm leading-8 text-blue-50">
            إذا واجهت أي مشكلة في القوالب أو التحميل، يمكنك التواصل مباشرة مع فريق الدعم وسنقوم بالمتابعة معك.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="mailto:haedarahasan69@gmail.com"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-blue-700 transition hover:bg-slate-100"
            >
              <Mail size={16} />
              haedarahasan69@gmail.com
            </a>
            <a
              href="tel:+963983796029"
              className="inline-flex items-center gap-2 rounded-xl border border-white/40 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/10"
            >
              <Phone size={16} />
              +963983796029
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}

function InfoChip({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 dark:border-slate-700 dark:bg-slate-800/70">
      <p className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
        <Icon size={13} />
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-bold text-slate-900 dark:text-slate-100">{value}</p>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/80">
      <p className="text-xs text-slate-500 dark:text-slate-400">{title}</p>
      <p className="mt-1 text-lg font-black text-slate-900 dark:text-slate-100">{value}</p>
    </div>
  );
}
