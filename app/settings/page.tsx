import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import { neon } from '@neondatabase/serverless';
import { SettingsPageClient } from '@/components/settings/SettingsPageClient';

const sql = neon(process.env.DATABASE_URL!);

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  const userId = Number.parseInt(session.user.id, 10);
  const users = await sql`
    SELECT id, name, email, role, created_at, password_hash
    FROM users
    WHERE id = ${userId}
    LIMIT 1
  `;

  if (users.length === 0) redirect('/login');

  const user = users[0];

  return (
    <SettingsPageClient
      initialUser={{
        id: Number(user.id),
        name: String(user.name ?? ''),
        email: String(user.email ?? ''),
        role: String(user.role ?? 'user'),
        createdAt: new Date(user.created_at as string | Date).toISOString(),
        hasPassword: Boolean(user.password_hash),
      }}
    />
  );
}
