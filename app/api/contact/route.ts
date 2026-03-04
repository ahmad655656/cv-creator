import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { z } from 'zod';

const contactSchema = z.object({
  fullName: z.string().trim().min(2, 'الاسم يجب أن يكون حرفين على الأقل').max(80),
  email: z.string().trim().email('البريد الإلكتروني غير صحيح'),
  phone: z.string().trim().max(30).optional().default(''),
  subject: z.string().trim().min(3, 'العنوان قصير جدًا').max(120),
  message: z.string().trim().min(10, 'الرسالة قصيرة جدًا').max(3000),
  company: z.string().trim().max(0).optional().default(''), // Honeypot
});

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = String(process.env.SMTP_SECURE || '').toLowerCase() === 'true' || port === 465;

  if (!host || !user || !pass) {
    throw new Error('SMTP is not configured');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.issues[0]?.message || 'بيانات غير صالحة',
        },
        { status: 400 },
      );
    }

    const data = parsed.data;
    if (data.company) {
      return NextResponse.json({ success: true, message: 'تم الاستلام' });
    }

    const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL || 'haedarahasan69@gmail.com';
    const transporter = getTransporter();

    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.8;color:#0f172a">
        <h2 style="margin:0 0 12px 0">رسالة جديدة من صفحة التواصل</h2>
        <p><strong>الاسم:</strong> ${data.fullName}</p>
        <p><strong>البريد:</strong> ${data.email}</p>
        <p><strong>الهاتف:</strong> ${data.phone || '-'}</p>
        <p><strong>العنوان:</strong> ${data.subject}</p>
        <hr />
        <p style="white-space:pre-wrap">${data.message}</p>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.CONTACT_FROM_EMAIL || process.env.SMTP_USER,
      to: receiverEmail,
      replyTo: data.email,
      subject: `[CV Creator] ${data.subject}`,
      text: `الاسم: ${data.fullName}\nالبريد: ${data.email}\nالهاتف: ${data.phone || '-'}\nالعنوان: ${data.subject}\n\n${data.message}`,
      html,
    });

    return NextResponse.json({ success: true, message: 'تم إرسال رسالتك بنجاح' });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'تعذر إرسال الرسالة الآن. تحقق من إعدادات البريد (SMTP).',
      },
      { status: 500 },
    );
  }
}
