import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { isAdminRole } from '@/lib/auth/isAdminRole';
import { redirect } from 'next/navigation';
import { neon } from '@neondatabase/serverless';
import type { ReactNode } from 'react';
import { AdminPageShell } from '@/components/admin/AdminPageShell';
import { CreditCard, DollarSign, FileText, Users } from 'lucide-react';

const sql = neon(process.env.DATABASE_URL!);

export default async function AdminAnalyticsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');
  if (!isAdminRole(session.user?.role)) redirect('/dashboard');

  const [users, payments, cvs] = await Promise.all([
    sql`SELECT COUNT(*) as count FROM users`,
    sql`SELECT COUNT(*) as count, COALESCE(SUM(amount),0) as total FROM payments WHERE status = 'approved'`,
    sql`SELECT COUNT(*) as count FROM cvs`
  ]);

  const usersCount = Number(users[0]?.count || 0);
  const paymentsCount = Number(payments[0]?.count || 0);
  const cvsCount = Number(cvs[0]?.count || 0);
  const totalRevenue = Number(payments[0]?.total || 0);

  return (
    <AdminPageShell
      title="التحليلات"
      description="نظرة سريعة على الأداء العام للموقع والمدفوعات والمستخدمين."
      currentPath="/admin/analytics"
    >
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Metric title="المستخدمون" value={usersCount} icon={<Users size={18} />} />
        <Metric title="المدفوعات الناجحة" value={paymentsCount} icon={<CreditCard size={18} />} />
        <Metric title="السير الذاتية" value={cvsCount} icon={<FileText size={18} />} />
        <Metric title="إجمالي الإيراد" value={`${totalRevenue.toLocaleString('ar-SY')} ل.س`} icon={<DollarSign size={18} />} />
      </section>
    </AdminPageShell>
  );
}

function Metric({ title, value, icon }: { title: string; value: string | number; icon: ReactNode }) {
  return (
    <article className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-slate-100">{value}</p>
        </div>
        <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 flex items-center justify-center">{icon}</div>
      </div>
    </article>
  );
}