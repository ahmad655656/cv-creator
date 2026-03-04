import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';

export default async function MyCvsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');
  redirect('/templates');
}
