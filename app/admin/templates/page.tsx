import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { AdminPageShell } from '@/components/admin/AdminPageShell';

export default async function AdminTemplatesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');
  if (session.user.role !== 'admin') redirect('/dashboard');

  return (
    <AdminPageShell
      title="إدارة القوالب"
      description="إدارة القوالب المعروضة في الموقع وتحديثها بشكل سريع."
      currentPath="/admin/templates"
      actions={
        <Link
          href="/admin/templates/new"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <Plus size={16} />
          إضافة قالب
        </Link>
      }
    >
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6">
        <p className="text-slate-600 dark:text-slate-300">
          هذه الصفحة جاهزة لإدارة القوالب. يمكنك إضافة نموذج إنشاء أو تعديل مباشر لاحقاً بنفس النمط البصري.
        </p>
      </section>
    </AdminPageShell>
  );
}

