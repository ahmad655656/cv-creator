import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { notifyAdmins, notifyUser } from '@/lib/services/notifications';

const sql = neon(process.env.DATABASE_URL!);
const YOUR_SYRITEL_NUMBER = '0983796029';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const body = await request.json();
    const { templateId, amount, senderNumber, transactionDate, screenshot } = body as {
      templateId?: number;
      amount?: number;
      senderNumber?: string;
      transactionDate?: string;
      screenshot?: string | null;
    };

    if (!templateId || !amount || !senderNumber || !transactionDate) {
      return NextResponse.json({ error: 'بيانات غير مكتملة' }, { status: 400 });
    }

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
        ${Number.parseInt(session.user.id, 10)},
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
    const paymentId = Number(newPayment[0].id);

    try {
      await Promise.all([
        notifyUser(currentUserId, {
          type: 'payment_pending',
          title: 'تم استلام طلب شراء القالب',
          message: 'تم إرسال طلبك بنجاح وهو الآن قيد المراجعة.',
          link: '/dashboard',
          senderUserId: currentUserId,
          metadata: {
            paymentId,
            templateId,
            amount,
            status: 'pending'
          }
        }),
        notifyAdmins({
          type: 'payment_submitted',
          title: 'طلب دفع جديد',
          message: `تم استلام طلب دفع جديد لقالب #${templateId} بقيمة ${amount} ل.س`,
          link: '/admin/payments',
          senderUserId: currentUserId,
          metadata: {
            paymentId,
            templateId,
            amount,
            paymentType: 'single'
          }
        })
      ]);
    } catch (notifyError) {
      console.error('Single template payment notifications error:', notifyError);
    }

    return NextResponse.json({
      success: true,
      paymentId,
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
