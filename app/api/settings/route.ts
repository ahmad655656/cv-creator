import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { neon } from '@neondatabase/serverless';
import { authOptions } from '@/lib/auth/auth';

const sql = neon(process.env.DATABASE_URL!);

const updateSettingsSchema = z.object({
  name: z.string().trim().min(2, 'الاسم يجب أن يكون حرفين على الأقل').max(120),
  email: z.string().trim().email('البريد الإلكتروني غير صالح'),
  currentPassword: z.string().optional().default(''),
  newPassword: z.string().optional().default(''),
});

function parseUserId(session: { user?: { id?: string } } | null) {
  const raw = Number.parseInt(String(session?.user?.id ?? ''), 10);
  return Number.isFinite(raw) ? raw : null;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const userId = parseUserId(session);
    if (!userId) return NextResponse.json({ error: 'جلسة غير صالحة' }, { status: 401 });

    const users = await sql`
      SELECT id, name, email, role, created_at, password_hash
      FROM users
      WHERE id = ${userId}
      LIMIT 1
    `;

    if (users.length === 0) return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 });

    const user = users[0];
    return NextResponse.json({
      user: {
        id: Number(user.id),
        name: String(user.name ?? ''),
        email: String(user.email ?? ''),
        role: String(user.role ?? 'user'),
        createdAt: new Date(user.created_at as string | Date).toISOString(),
        hasPassword: Boolean(user.password_hash),
      },
    });
  } catch (error) {
    console.error('GET /api/settings error:', error);
    return NextResponse.json({ error: 'فشل في جلب الإعدادات' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const userId = parseUserId(session);
    if (!userId) return NextResponse.json({ error: 'جلسة غير صالحة' }, { status: 401 });

    const body = await request.json();
    const parsed = updateSettingsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || 'بيانات غير صالحة' }, { status: 400 });
    }

    const { name, email, currentPassword, newPassword } = parsed.data;

    const existingUsers = await sql`
      SELECT id, email, password_hash
      FROM users
      WHERE id = ${userId}
      LIMIT 1
    `;
    if (existingUsers.length === 0) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 });
    }
    const existingUser = existingUsers[0];

    const duplicateEmail = await sql`
      SELECT id
      FROM users
      WHERE lower(email) = lower(${email})
      AND id <> ${userId}
      LIMIT 1
    `;
    if (duplicateEmail.length > 0) {
      return NextResponse.json({ error: 'البريد الإلكتروني مستخدم مسبقاً' }, { status: 409 });
    }

    let updatedRows: Array<Record<string, unknown>> | null = null;

    if (newPassword) {
      if (newPassword.length < 8) {
        return NextResponse.json({ error: 'كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل' }, { status: 400 });
      }

      const passwordHash = String(existingUser.password_hash ?? '');
      if (!passwordHash) {
        return NextResponse.json({ error: 'لا يمكن تغيير كلمة المرور لهذا الحساب حالياً' }, { status: 400 });
      }

      const isMatch = await bcrypt.compare(currentPassword || '', passwordHash);
      if (!isMatch) {
        return NextResponse.json({ error: 'كلمة المرور الحالية غير صحيحة' }, { status: 400 });
      }

      const nextHash = await bcrypt.hash(newPassword, 10);
      updatedRows = await sql`
        UPDATE users
        SET
          name = ${name},
          email = ${email},
          password_hash = ${nextHash},
          updated_at = NOW()
        WHERE id = ${userId}
        RETURNING id, name, email, role, created_at, password_hash
      `;
    } else {
      updatedRows = await sql`
        UPDATE users
        SET
          name = ${name},
          email = ${email},
          updated_at = NOW()
        WHERE id = ${userId}
        RETURNING id, name, email, role, created_at, password_hash
      `;
    }

    const updated = updatedRows?.[0];
    if (!updated) {
      return NextResponse.json({ error: 'لم يتم تحديث أي سجل. تحقق من هوية المستخدم.' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'تم حفظ الإعدادات بنجاح',
      debugUserId: userId,
      user: updated
        ? {
            id: Number(updated.id),
            name: String(updated.name ?? ''),
            email: String(updated.email ?? ''),
            role: String(updated.role ?? 'user'),
            createdAt: new Date(updated.created_at as string | Date).toISOString(),
            hasPassword: Boolean(updated.password_hash),
          }
        : null,
    });
  } catch (error) {
    console.error('PATCH /api/settings error:', error);
    return NextResponse.json({ error: 'فشل في حفظ الإعدادات' }, { status: 500 });
  }
}
