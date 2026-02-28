import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export default async function AdminAnalyticsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');
  if (session.user.role !== 'admin') redirect('/dashboard');

  const [users, payments, cvs] = await Promise.all([
    sql`SELECT COUNT(*) as count FROM users`,
    sql`SELECT COUNT(*) as count, COALESCE(SUM(amount),0) as total FROM payments WHERE status = 'approved'`,
    sql`SELECT COUNT(*) as count FROM cvs`
  ]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">التحليلات</h1>
          <div className="mt-6 grid sm:grid-cols-3 gap-4">
            <Card title="المستخدمون" value={Number(users[0]?.count || 0)} />
            <Card title="المدفوعات الناجحة" value={Number(payments[0]?.count || 0)} />
            <Card title="السير الذاتية" value={Number(cvs[0]?.count || 0)} />
          </div>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">إجمالي الإيراد: {Number(payments[0]?.total || 0).toLocaleString()} ل.س</p>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
      <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
      <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">{value}</p>
    </div>
  );
}
