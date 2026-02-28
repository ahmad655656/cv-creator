import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';

export default async function AdminSettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');
  if (session.user.role !== 'admin') redirect('/dashboard');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">إعدادات الإدارة</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">هذه الصفحة جاهزة لإضافة إعدادات النظام (المفاتيح، الصلاحيات، سياسات الدفع).</p>
        </div>
      </div>
    </div>
  );
}
