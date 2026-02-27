import { neon } from '@neondatabase/serverless';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { SharedCVView } from '@/components/share/SharedCVView';

const sql = neon(process.env.DATABASE_URL!);

interface PageProps {
  params: {
    shareId: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const cvs = await sql`
    SELECT c.*, u.name as user_name
    FROM cvs c
    LEFT JOIN users u ON c.user_id = u.id
    WHERE c.share_id = ${params.shareId} AND c.is_published = true
  `;

  if (cvs.length === 0) {
    return {
      title: 'السيرة الذاتية غير موجودة',
    };
  }

  const cv = cvs[0];
  
  return {
    title: `السيرة الذاتية لـ ${cv.user_name || 'مستخدم'}`,
    description: cv.content?.personalInfo?.summary || 'سيرة ذاتية احترافية',
    openGraph: {
      title: `السيرة الذاتية لـ ${cv.user_name || 'مستخدم'}`,
      description: cv.content?.personalInfo?.summary || 'سيرة ذاتية احترافية',
      type: 'profile',
    },
  };
}

export default async function SharedCVPage({ params }: PageProps) {
  // جلب السيرة الذاتية مع زيادة عدد المشاهدات
  const cvs = await sql`
    UPDATE cvs 
    SET views = views + 1 
    WHERE share_id = ${params.shareId} AND is_published = true
    RETURNING *
  `;

  if (cvs.length === 0) {
    notFound();
  }

  const cv = cvs[0];

  // جلب معلومات القالب
  const templates = await sql`
    SELECT * FROM templates WHERE slug = ${cv.template_id}
  `;

  const template = templates[0] || { slug: 'default', name: 'قالب افتراضي' };

  return (
    <SharedCVView cv={cv} template={template} />
  );
}