import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { neon } from '@neondatabase/serverless';
import { notifyAdmins, notifyUser } from '@/lib/services/notifications';

const sql = neon(process.env.DATABASE_URL!);
const YOUR_SYRITEL_NUMBER = '0983796029';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const body = await request.json();
    const { amount, senderNumber, transactionDate, screenshot } = body;

    if (amount !== 70000) {
      return NextResponse.json({ error: 'مبلغ غير صحيح' }, { status: 400 });
    }

    if (!senderNumber || !transactionDate) {
      return NextResponse.json({ error: 'بيانات غير مكتملة' }, { status: 400 });
    }

    // إنشاء طلب دفع للباقة
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
        payment_type,
        created_at
      ) VALUES (
        ${parseInt(session.user.id)},
        ${0}, -- 0 يعني الباقة الشاملة
        ${amount},
        ${senderNumber},
        ${YOUR_SYRITEL_NUMBER},
        ${transactionDate},
        ${screenshot || null},
        'pending',
        'bundle',
        NOW()
      )
      RETURNING id
    `;

    const currentUserId = Number.parseInt(session.user.id, 10);

    await notifyUser(currentUserId, {
      type: 'bundle_payment_pending',
      title: 'تم استلام طلب الباقة',
      message: 'تم إرسال طلب شراء الباقة الشاملة وهو الآن قيد المراجعة.',
      link: '/dashboard',
      senderUserId: currentUserId,
      metadata: {
        paymentId: newPayment[0].id,
        amount,
        paymentType: 'bundle',
        status: 'pending'
      }
    });

    await notifyAdmins({
      type: 'bundle_payment_submitted',
      title: 'طلب باقة شامل جديد',
      message: `طلب شراء باقة شامل بقيمة ${amount} ل.س`,
      link: '/admin/payments',
      senderUserId: currentUserId,
      metadata: {
        paymentId: newPayment[0].id,
        amount,
        paymentType: 'bundle'
      }
    });

    return NextResponse.json({
      success: true,
      paymentId: newPayment[0].id,
      message: 'تم إرسال طلب شراء الباقة بنجاح. سيتم تفعيلها خلال 24 ساعة'
    });

  } catch (error) {
    console.error('Bundle payment error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في معالجة الدفع' },
      { status: 500 }
    );
  }
}
