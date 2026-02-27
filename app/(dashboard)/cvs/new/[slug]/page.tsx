import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { redirect, notFound } from 'next/navigation';
import { neon } from '@neondatabase/serverless';
import { CVEditor } from '@/components/cvs/editor/CVEditor';

const sql = neon(process.env.DATABASE_URL!);

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function EditCVPage({ params }: PageProps) {
  const { slug } = await params;

  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  const templates = await sql`
    SELECT * FROM templates WHERE slug = ${slug}
  `;

  const template = templates[0];
  if (!template) notFound();
  if (!template.is_premium) redirect('/templates');

  const userId = parseInt(session.user.id, 10);

  const purchase = await sql`
    SELECT id
    FROM payments
    WHERE user_id = ${userId}
      AND status = 'approved'
      AND (template_id = ${template.id} OR template_id = 0)
    LIMIT 1
  `;

  if (!purchase.length) {
    redirect(`/templates?locked=${slug}`);
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b dark:border-gray-800 px-4 py-2 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
              {template.name.charAt(0)}
            </div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{template.name}</h1>
            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full text-xs font-medium">
              {template.category}
            </span>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            {new Date().toLocaleDateString('ar-EG', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-visible">
        <div className="container mx-auto px-4 py-4">
          <CVEditor template={template} userId={userId} />
        </div>
      </div>
    </div>
  );
}
