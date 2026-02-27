import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { neon } from '@neondatabase/serverless';
import { notifyUser } from '@/lib/services/notifications';

const sql = neon(process.env.DATABASE_URL!);

// في Next.js 15، params هو Promise
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // انتظر params لأنه Promise
    const { id } = await params;
    
    console.log('🔧 PATCH request received for payment ID:', id);
    
    const session = await getServerSession(authOptions);
    console.log('👤 Session:', session?.user);

    if (!session || session.user.role !== 'admin') {
      console.log('❌ Unauthorized - not admin');
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const body = await request.json();
    console.log('📦 Request body:', body);
    
    const { status, adminNotes } = body;

    if (!status || !['approved', 'rejected'].includes(status)) {
      console.log('❌ Invalid status:', status);
      return NextResponse.json({ error: 'حالة غير صالحة' }, { status: 400 });
    }

    // جلب معلومات الدفع قبل التحديث
    const paymentInfo = await sql`
      SELECT p.*, u.email as user_email, u.name as user_name 
      FROM payments p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ${parseInt(id)}
    `;

    console.log('💳 Payment info:', paymentInfo[0]);

    if (paymentInfo.length === 0) {
      console.log('❌ Payment not found');
      return NextResponse.json({ error: 'الدفع غير موجود' }, { status: 404 });
    }

    const payment = paymentInfo[0];

    // تحديث حالة الدفع
    const updateResult = await sql`
      UPDATE payments 
      SET status = ${status}, 
          admin_notes = ${adminNotes || null},
          updated_at = NOW()
      WHERE id = ${parseInt(id)}
      RETURNING *
    `;

    console.log('✅ Update result:', updateResult[0]);

    // إذا تمت الموافقة، تفعيل القالب للمستخدم
    if (status === 'approved') {
      if (payment.template_id === 0) {
        // باقة شاملة - يمكن إضافة سجل في جدول user_bundles
        console.log(`✅ تم تفعيل الباقة الشاملة للمستخدم ${payment.user_name}`);
        
        // هنا يمكنك إضافة كود لتفعيل الباقة
        // مثلاً إنشاء سجل في جدول user_subscriptions
      } else {
        // قالب مفرد
        console.log(`✅ تم تفعيل القالب للمستخدم ${payment.user_name}`);
      }
    }

    await notifyUser(Number(payment.user_id), {
      type: status === 'approved' ? 'payment_approved' : 'payment_rejected',
      title: status === 'approved' ? 'تم قبول عملية الدفع' : 'تم رفض عملية الدفع',
      message:
        status === 'approved'
          ? (payment.template_id === 0
              ? 'تم قبول طلب الباقة الشاملة وتفعيلها في حسابك.'
              : 'تم قبول طلب القالب وتفعيله في حسابك.')
          : 'تم رفض طلب الدفع. يمكنك إعادة المحاولة مع بيانات تحويل صحيحة.',
      link: '/dashboard',
      metadata: {
        paymentId: payment.id,
        templateId: payment.template_id,
        status
      }
    });

    return NextResponse.json({ 
      success: true,
      message: status === 'approved' 
        ? 'تم الموافقة على الدفع وتفعيل القالب' 
        : 'تم رفض الدفع'
    });

  } catch (error) {
    console.error('❌ Error updating payment:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في تحديث الدفع' },
      { status: 500 }
    );
  }
}
