import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export default async function AdminCvsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');
  if (session.user.role !== 'admin') redirect('/dashboard');

  const rows = await sql`
    SELECT c.id, c.title, c.updated_at, u.name as user_name
    FROM cvs c
    JOIN users u ON c.user_id = u.id
    ORDER BY c.updated_at DESC
    LIMIT 100
  `;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">إدارة السير الذاتية</h1>
          <div className="mt-5 space-y-2">
            {rows.map((row) => (
              <div key={row.id} className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{String(row.title)}</p>
                  <p className="text-xs text-slate-500">{String(row.user_name)}</p>
                </div>
                <span className="text-xs text-slate-500">{new Date(row.updated_at as string | Date).toLocaleDateString('ar-EG')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
