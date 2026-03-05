import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { isAdminRole } from '@/lib/auth/isAdminRole';
import { redirect } from 'next/navigation';
import { AdminPageShell } from '@/components/admin/AdminPageShell';

export default async function AdminNewTemplatePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');
  if (!isAdminRole(session.user?.role)) redirect('/dashboard');

  return (
    <AdminPageShell
      title="إضافة قالب جديد"
      description="إنشاء قالب جديد وربطه ببيانات العرض والسعر والتصنيف."
      currentPath="/admin/templates"
    >
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6">
        <p className="text-slate-600 dark:text-slate-300">يمكن ربط هذه الصفحة بنموذج إنشاء كامل لاحقاً.</p>
      </section>
    </AdminPageShell>
  );
}