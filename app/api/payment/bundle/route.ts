import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { neon } from '@neondatabase/serverless';
import { notifyAdmins, notifyUser } from '@/lib/services/notifications';

const sql = neon(process.env.DATABASE_URL!);
const YOUR_SYRITEL_NUMBER = '0983796029';
const BUNDLE_TEMPLATE_ID = 0;
const BUNDLE_AMOUNT = 70000;

async function ensureBundleTemplateRow() {
  await sql`
    INSERT INTO templates (
      id,
      name,
      slug,
      description,
      category,
      thumbnail,
      preview,
      is_premium,
      price,
      downloads,
      rating,
      config,
      created_at
    ) VALUES (
      ${BUNDLE_TEMPLATE_ID},
      'Comprehensive Bundle',
      '__bundle__',
      'System row for comprehensive bundle payments',
      'system',
      null,
      null,
      false,
      ${BUNDLE_AMOUNT},
      0,
      0,
      '{}'::jsonb,
      NOW()
    )
    ON CONFLICT DO NOTHING
  `;
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const body = await request.json();
    const { amount, senderNumber, transactionDate, screenshot } = body;

    if (Number(amount) !== BUNDLE_AMOUNT) {
      return NextResponse.json({ error: 'مبلغ غير صحيح' }, { status: 400 });
    }

    if (!senderNumber || !transactionDate) {
      return NextResponse.json({ error: 'بيانات غير مكتملة' }, { status: 400 });
    }

    await ensureBundleTemplateRow();

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
        ${BUNDLE_TEMPLATE_ID},
        ${BUNDLE_AMOUNT},
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

    try {
      await notifyUser(currentUserId, {
        type: 'bundle_payment_pending',
        title: 'تم استلام طلب الباقة',
        message: 'تم إرسال طلب شراء الباقة الشاملة وهو الآن قيد المراجعة.',
        link: '/dashboard',
        senderUserId: currentUserId,
        metadata: {
          paymentId: newPayment[0].id,
          amount: BUNDLE_AMOUNT,
          paymentType: 'bundle',
          status: 'pending'
        }
      });

      await notifyAdmins({
        type: 'bundle_payment_submitted',
        title: 'طلب باقة شامل جديد',
        message: `طلب شراء باقة شامل بقيمة ${BUNDLE_AMOUNT} ل.س`,
        link: '/admin/payments',
        senderUserId: currentUserId,
        metadata: {
          paymentId: newPayment[0].id,
          amount: BUNDLE_AMOUNT,
          paymentType: 'bundle'
        }
      });
    } catch (notifyError) {
      console.error('Bundle payment notifications error:', notifyError);
    }

    return NextResponse.json({
      success: true,
      paymentId: newPayment[0].id,
      message: 'تم إرسال طلب شراء الباقة بنجاح. سيتم تفعيلها خلال 24 ساعة'
    });
  } catch (error) {
    console.error('Bundle payment error:', error);
    return NextResponse.json(
      {
        error: 'حدث خطأ في معالجة الدفع',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}