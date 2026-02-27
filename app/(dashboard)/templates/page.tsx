import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import { neon } from '@neondatabase/serverless';
import { TemplateShowcase } from '@/components/templates/TemplateShowcase';

const sql = neon(process.env.DATABASE_URL!);

export default async function TemplatesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  // جلب القوالب من قاعدة البيانات
  const templates = await sql`
    SELECT * FROM templates
    WHERE is_premium = true
    ORDER BY price DESC, name
  `;

  // جلب اشتراكات المستخدم
  const userPurchases = await sql`
    SELECT template_id FROM payments 
    WHERE user_id = ${parseInt(session.user.id)} 
    AND status = 'approved'
  `;

  const purchasedTemplateIds = new Set(
    userPurchases.map(p => p.template_id)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            قوالب احترافية معتمدة عالمياً
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
            اختر القالب المناسب لمجالك. جميع القوالب مصممة وفق أحدث المعايير العالمية ومتوافقة مع أنظمة ATS
          </p>
        </div>
      </div>

      {/* Template Showcase */}
      <div className="container mx-auto px-4 py-8">
        <TemplateShowcase 
          templates={templates} 
          purchasedTemplates={purchasedTemplateIds}
          userId={parseInt(session.user?.id)}
        />
      </div>
    </div>
  );
}
