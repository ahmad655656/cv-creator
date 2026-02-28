import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export default async function MyCvsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  const userId = Number.parseInt(session.user.id, 10);
  const cvs = await sql`
    SELECT id, title, views, downloads, updated_at
    FROM cvs
    WHERE user_id = ${userId}
    ORDER BY updated_at DESC
    LIMIT 30
  `;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">سيري الذاتية</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300 text-sm">إدارة وتصفح السير المحفوظة فقط. تم إيقاف محرر السيرة المباشر.</p>

          <div className="mt-6 space-y-3">
            {cvs.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400">لا توجد سير محفوظة حالياً.</p>
            ) : (
              cvs.map((cv) => (
                <div key={cv.id} className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{String(cv.title)}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">آخر تحديث: {new Date(cv.updated_at as string | Date).toLocaleDateString('ar-EG')}</p>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {Number(cv.views)} مشاهدة • {Number(cv.downloads)} تحميل
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
