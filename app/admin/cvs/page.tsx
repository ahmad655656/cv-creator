import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { isAdminRole } from '@/lib/auth/isAdminRole';
import { redirect } from 'next/navigation';
import { neon } from '@neondatabase/serverless';
import { AdminPageShell } from '@/components/admin/AdminPageShell';

const sql = neon(process.env.DATABASE_URL!);

export default async function AdminCvsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');
  if (!isAdminRole(session.user?.role)) redirect('/dashboard');

  const rows = await sql`
    SELECT c.id, c.title, c.updated_at, u.name as user_name
    FROM cvs c
    JOIN users u ON c.user_id = u.id
    ORDER BY c.updated_at DESC
    LIMIT 100
  `;

  return (
    <AdminPageShell
      title="إدارة السير الذاتية"
      description="استعراض آخر السير المعدلة وربطها بالمستخدمين."
      currentPath="/admin/cvs"
    >
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60">
              <tr className="text-slate-600 dark:text-slate-300">
                <th className="text-right py-3 px-4 font-semibold">العنوان</th>
                <th className="text-right py-3 px-4 font-semibold">المستخدم</th>
                <th className="text-right py-3 px-4 font-semibold">آخر تحديث</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={Number(row.id)} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">{String(row.title)}</td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{String(row.user_name)}</td>
                  <td className="py-3 px-4 text-slate-500">{new Date(row.updated_at as string | Date).toLocaleDateString('ar-SY')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminPageShell>
  );
}