import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { notifyAdmins, notifyUser } from '@/lib/services/notifications';

const sql = neon(process.env.DATABASE_URL!);

// رقم سيريتيل كاش الخاص بك
const YOUR_SYRITEL_NUMBER = '0983796029';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const body = await request.json();
    const { templateId, amount, senderNumber, transactionDate, screenshot } = body;

    // التحقق من صحة البيانات
    if (!templateId || !amount || !senderNumber || !transactionDate) {
      return NextResponse.json({ error: 'بيانات غير مكتملة' }, { status: 400 });
    }

    // إنشاء طلب دفع جديد
    const newPayment = await sql`
      INSERT INTO payments (
        user_id, 
        template_id, 
        amount, 
        sender_number, 
        receiver_number,
        transaction_date,
        screenshot,
        status,
        created_at
      ) VALUES (
        ${parseInt(session.user.id)},
        ${templateId},
        ${amount},
        ${senderNumber},
        ${YOUR_SYRITEL_NUMBER},
        ${transactionDate},
        ${screenshot || null},
        'pending',
        NOW()
      )
      RETURNING id
    `;

    const currentUserId = Number.parseInt(session.user.id, 10);

    await notifyUser(currentUserId, {
      type: 'payment_pending',
      title: 'تم استلام طلب الشراء',
      message: 'تم إرسال طلب شراء القالب بنجاح وهو الآن قيد المراجعة.',
      link: '/dashboard',
      senderUserId: currentUserId,
      metadata: {
        paymentId: newPayment[0].id,
        templateId,
        amount,
        status: 'pending'
      }
    });

    await notifyAdmins({
      type: 'payment_submitted',
      title: 'طلب دفع جديد',
      message: `طلب دفع جديد لقالب #${templateId} بقيمة ${amount} ل.س`,
      link: '/admin/payments',
      senderUserId: currentUserId,
      metadata: {
        paymentId: newPayment[0].id,
        templateId,
        amount,
        paymentType: 'single'
      }
    });

    return NextResponse.json({
      success: true,
      paymentId: newPayment[0].id,
      message: 'تم إرسال طلب الدفع بنجاح. سيتم مراجعته وتفعيل القالب خلال 24 ساعة'
    });

  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في معالجة الدفع' },
      { status: 500 }
    );
  }
}
