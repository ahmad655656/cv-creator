import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { isAdminRole } from '@/lib/auth/isAdminRole';
import { neon } from '@neondatabase/serverless';
import { notifyUser } from '@/lib/services/notifications';

const sql = neon(process.env.DATABASE_URL!);

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const paymentId = Number.parseInt(id, 10);

    if (!Number.isFinite(paymentId)) {
      return NextResponse.json({ error: 'معرف دفع غير صالح' }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    if (!session || !isAdminRole(session.user?.role)) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const body = await request.json();
    const { status, adminNotes } = body as {
      status?: 'approved' | 'rejected';
      adminNotes?: string | null;
    };

    if (!status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'حالة غير صالحة' }, { status: 400 });
    }

    const updateResult = await sql`
      UPDATE payments
      SET
        status = ${status},
        admin_notes = ${adminNotes || null},
        updated_at = NOW()
      WHERE id = ${paymentId}
      RETURNING id, user_id, template_id
    `;

    if (updateResult.length === 0) {
      return NextResponse.json({ error: 'الدفع غير موجود' }, { status: 404 });
    }

    const payment = updateResult[0];

    // Ensure notification row exists before returning, while push is handled asynchronously in service.
    await notifyUser(Number(payment.user_id), {
      type: status === 'approved' ? 'payment_approved' : 'payment_rejected',
      title: status === 'approved' ? 'تم قبول عملية الدفع' : 'تم رفض عملية الدفع',
      message:
        status === 'approved'
          ? (Number(payment.template_id) === 0
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
        ? 'تمت الموافقة على الدفع وتفعيل القالب'
        : 'تم رفض الدفع'
    });
  } catch (error) {
    console.error('Error updating payment:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في تحديث الدفع' },
      { status: 500 }
    );
  }
}
