import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { isAdminRole } from '@/lib/auth/isAdminRole';
import { redirect } from 'next/navigation';
import { neon } from '@neondatabase/serverless';
import { AdminPageShell } from '@/components/admin/AdminPageShell';

const sql = neon(process.env.DATABASE_URL!);

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');
  if (!isAdminRole(session.user?.role)) redirect('/dashboard');

  const users = await sql`
    SELECT id, name, email, role, created_at
    FROM users
    ORDER BY created_at DESC
    LIMIT 100
  `;

  return (
    <AdminPageShell
      title="إدارة المستخدمين"
      description="عرض سريع للمستخدمين المسجلين مع بياناتهم الأساسية."
      currentPath="/admin/users"
    >
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60">
              <tr className="text-slate-600 dark:text-slate-300">
                <th className="text-right py-3 px-4 font-semibold">الاسم</th>
                <th className="text-right py-3 px-4 font-semibold">البريد</th>
                <th className="text-right py-3 px-4 font-semibold">الدور</th>
                <th className="text-right py-3 px-4 font-semibold">تاريخ التسجيل</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={Number(user.id)} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">{String(user.name ?? '-')}</td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{String(user.email)}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {String(user.role ?? 'user')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500">{new Date(user.created_at as string | Date).toLocaleDateString('ar-SY')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminPageShell>
  );
}