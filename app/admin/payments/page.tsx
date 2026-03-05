import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { isAdminRole } from '@/lib/auth/isAdminRole';
import { redirect } from 'next/navigation';
import { neon } from '@neondatabase/serverless';
import { PaymentsManager } from '@/components/admin/PaymentsManager';
import { AdminPageShell } from '@/components/admin/AdminPageShell';

const sql = neon(process.env.DATABASE_URL!);

export default async function AdminPaymentsPage() {
  const session = await getServerSession(authOptions);

  if (!session || !isAdminRole(session.user?.role)) {
    redirect('/login');
  }

  const payments = await sql`
    SELECT
      p.*,
      u.name as user_name,
      u.email as user_email,
      t.name as template_name,
      CASE
        WHEN p.template_id = 0 THEN 'bundle'
        ELSE 'single'
      END as payment_type
    FROM payments p
    JOIN users u ON p.user_id = u.id
    LEFT JOIN templates t ON p.template_id = t.id
    ORDER BY p.created_at DESC
  `;

  const normalizedPayments = payments.map((payment) => ({
    id: Number(payment.id),
    user_id: Number(payment.user_id),
    user_name: String(payment.user_name ?? ''),
    user_email: String(payment.user_email ?? ''),
    template_id: Number(payment.template_id ?? 0),
    template_name:
      Number(payment.template_id ?? 0) === 0
        ? 'الباقة الشاملة'
        : String(payment.template_name ?? 'قالب'),
    amount: Number(payment.amount ?? 0),
    sender_number: String(payment.sender_number ?? ''),
    receiver_number: String(payment.receiver_number ?? ''),
    transaction_date: new Date(payment.transaction_date as string | Date).toISOString(),
    screenshot: payment.screenshot ? String(payment.screenshot) : null,
    status: String(payment.status ?? 'pending') as 'pending' | 'approved' | 'rejected',
    admin_notes: payment.admin_notes ? String(payment.admin_notes) : null,
    created_at: new Date(payment.created_at as string | Date).toISOString(),
    payment_type: String(payment.payment_type ?? 'single') as 'single' | 'bundle',
  }));

  const stats = {
    total: normalizedPayments.length,
    pending: normalizedPayments.filter((p) => p.status === 'pending').length,
    approved: normalizedPayments.filter((p) => p.status === 'approved').length,
    rejected: normalizedPayments.filter((p) => p.status === 'rejected').length,
    totalRevenue: normalizedPayments
      .filter((p) => p.status === 'approved')
      .reduce((sum, p) => sum + p.amount, 0),
  };

  return (
    <AdminPageShell
      title="إدارة المدفوعات"
      description="مراجعة عمليات الدفع وتأكيد الطلبات أو رفضها وفق بيانات التحويل."
      currentPath="/admin/payments"
    >
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        <StatCard title="إجمالي المعاملات" value={stats.total} />
        <StatCard title="قيد المراجعة" value={stats.pending} tone="amber" />
        <StatCard title="مقبولة" value={stats.approved} tone="emerald" />
        <StatCard title="مرفوضة" value={stats.rejected} tone="rose" />
        <StatCard
          title="الإيراد"
          value={`${stats.totalRevenue.toLocaleString('ar-SY')} ل.س`}
          tone="violet"
        />
      </section>

      <PaymentsManager payments={normalizedPayments} />
    </AdminPageShell>
  );
}

function StatCard({
  title,
  value,
  tone = 'slate',
}: {
  title: string;
  value: string | number;
  tone?: 'slate' | 'amber' | 'emerald' | 'rose' | 'violet';
}) {
  const toneMap: Record<string, string> = {
    slate: 'text-slate-700 dark:text-slate-200',
    amber: 'text-amber-700 dark:text-amber-300',
    emerald: 'text-emerald-700 dark:text-emerald-300',
    rose: 'text-rose-700 dark:text-rose-300',
    violet: 'text-violet-700 dark:text-violet-300',
  };

  return (
    <article className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
      <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
      <p className={`mt-1 text-2xl font-extrabold ${toneMap[tone]}`}>{value}</p>
    </article>
  );
}
