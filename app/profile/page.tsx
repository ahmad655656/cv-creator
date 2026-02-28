import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  const userId = Number.parseInt(session.user.id, 10);
  const [user] = await sql`SELECT id, name, email, role, created_at FROM users WHERE id = ${userId} LIMIT 1`;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">الملف الشخصي</h1>
          <div className="mt-6 space-y-4 text-sm sm:text-base">
            <InfoRow label="الاسم" value={String(user?.name ?? session.user.name ?? '-')} />
            <InfoRow label="البريد" value={String(user?.email ?? session.user.email ?? '-')} />
            <InfoRow label="الدور" value={String(user?.role ?? 'user')} />
            <InfoRow label="تاريخ الإنشاء" value={new Date(user?.created_at as string | Date).toLocaleDateString('ar-EG')} />
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3">
      <span className="text-slate-500 dark:text-slate-400">{label}</span>
      <span className="font-semibold text-slate-900 dark:text-slate-100">{value}</span>
    </div>
  );
}
