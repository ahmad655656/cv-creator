import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { isAdminRole } from '@/lib/auth/isAdminRole';
import { redirect } from 'next/navigation';
import { AdminPageShell } from '@/components/admin/AdminPageShell';

export default async function AdminSettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');
  if (!isAdminRole(session.user?.role)) redirect('/dashboard');

  return (
    <AdminPageShell
      title="إعدادات الإدارة"
      description="إدارة إعدادات النظام العامة والصلاحيات ومفاتيح الخدمات."
      currentPath="/admin/settings"
    >
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6">
        <p className="text-slate-600 dark:text-slate-300">صفحة الإعدادات جاهزة لربط عناصر التحكم الفعلية.</p>
      </section>
    </AdminPageShell>
  );
}