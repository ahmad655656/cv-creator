import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');
  if (session.user.role !== 'admin') redirect('/dashboard');

  const users = await sql`
    SELECT id, name, email, role, created_at
    FROM users
    ORDER BY created_at DESC
    LIMIT 100
  `;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">إدارة المستخدمين</h1>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500">
                  <th className="text-right py-2">الاسم</th>
                  <th className="text-right py-2">البريد</th>
                  <th className="text-right py-2">الدور</th>
                  <th className="text-right py-2">التسجيل</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-2 font-medium text-slate-900 dark:text-slate-100">{String(user.name ?? '-')}</td>
                    <td className="py-2 text-slate-600 dark:text-slate-300">{String(user.email)}</td>
                    <td className="py-2 text-slate-600 dark:text-slate-300">{String(user.role ?? 'user')}</td>
                    <td className="py-2 text-slate-500">{new Date(user.created_at as string | Date).toLocaleDateString('ar-EG')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
