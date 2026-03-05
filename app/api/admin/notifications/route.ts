import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { isAdminRole } from '@/lib/auth/isAdminRole';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !isAdminRole(session.user?.role)) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    // جلب آخر 10 مدفوعات معلقة
    const pendingPayments = await sql`
      SELECT p.*, u.name as user_name, u.email, t.name as template_name 
      FROM payments p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN templates t ON p.template_id = t.id
      WHERE p.status = 'pending'
      ORDER BY p.created_at DESC
      LIMIT 10
    `;

    // جلب عدد المدفوعات المعلقة
    const pendingCount = await sql`
      SELECT COUNT(*) as count FROM payments WHERE status = 'pending'
    `;

    return NextResponse.json({
      payments: pendingPayments,
      pendingCount: pendingCount[0]?.count || 0
    });

  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في جلب الإشعارات' },
      { status: 500 }
    );
  }
}

