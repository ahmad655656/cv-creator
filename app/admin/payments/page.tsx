import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import { neon } from '@neondatabase/serverless';
import { PaymentsManager } from '@/components/admin/PaymentsManager';

const sql = neon(process.env.DATABASE_URL!);

export default async function AdminPaymentsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.role !== 'admin') {
    redirect('/login');
  }

  // جلب جميع المدفوعات مع تفاصيل المستخدم والقالب
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
        ? 'Comprehensive Bundle'
        : String(payment.template_name ?? 'Template'),
    amount: Number(payment.amount ?? 0),
    sender_number: String(payment.sender_number ?? ''),
    receiver_number: String(payment.receiver_number ?? ''),
    transaction_date: new Date(payment.transaction_date as string | Date).toISOString(),
    screenshot: payment.screenshot ? String(payment.screenshot) : null,
    status: String(payment.status ?? 'pending') as 'pending' | 'approved' | 'rejected',
    admin_notes: payment.admin_notes ? String(payment.admin_notes) : null,
    created_at: new Date(payment.created_at as string | Date).toISOString(),
    payment_type: (String(payment.payment_type ?? 'single') as 'single' | 'bundle'),
  }));

  // إحصائيات المدفوعات
  const stats = {
    total: normalizedPayments.length,
    pending: normalizedPayments.filter(p => p.status === 'pending').length,
    approved: normalizedPayments.filter(p => p.status === 'approved').length,
    rejected: normalizedPayments.filter(p => p.status === 'rejected').length,
    totalRevenue: normalizedPayments
      .filter(p => p.status === 'approved')
      .reduce((sum, p) => sum + p.amount, 0)
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header مع إحصائيات سريعة */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            إدارة المدفوعات
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            مراجعة طلبات الدفع وتفعيل القوالب للمستخدمين
          </p>
        </div>

        {/* بطاقات الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
            <div className="text-sm text-gray-500">إجمالي المعاملات</div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl shadow-md p-6">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-yellow-600">قيد المراجعة</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl shadow-md p-6">
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            <div className="text-sm text-green-600">مقبولة</div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl shadow-md p-6">
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            <div className="text-sm text-red-600">مرفوضة</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl shadow-md p-6">
            <div className="text-2xl font-bold text-purple-600">
              {stats.totalRevenue.toLocaleString()} ل.س
            </div>
            <div className="text-sm text-purple-600">إجمالي الإيرادات</div>
          </div>
        </div>

        {/* مدير المدفوعات */}
        <PaymentsManager payments={normalizedPayments} />
      </div>
    </div>
  );
}
