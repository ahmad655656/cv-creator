import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import { neon } from '@neondatabase/serverless';
import { TemplateGallery } from '@/components/templates/TemplateGallery';

const sql = neon(process.env.DATABASE_URL!);

export default async function NewCVPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  // جلب القوالب من قاعدة البيانات
  const templates = await sql`
    SELECT * FROM templates
    WHERE is_premium = true
    ORDER BY name
  `;

  console.log('Available templates:', templates.map(t => ({ name: t.name, slug: t.slug }))); // للتشخيص

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">إنشاء سيرة ذاتية جديدة</h1>
          <p className="text-gray-600 mt-1">اختر قالباً لتبدأ في إنشاء سيرتك الذاتية</p>
        </div>
      </div>

      {/* Template Gallery */}
      <div className="container mx-auto px-4 py-8">
        <TemplateGallery templates={templates} />
      </div>
    </div>
  );
}
