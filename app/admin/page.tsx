import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import { isAdminRole } from '@/lib/auth/isAdminRole';

export default async function AdminRootPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');
  if (!isAdminRole(session.user?.role)) redirect('/dashboard');
  redirect('/admin/payments');
}
