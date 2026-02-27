import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // التحقق من ملكية السيرة الذاتية
    const cvs = await sql`
      SELECT user_id FROM cvs WHERE id = ${parseInt(params.id)}
    `;

    if (cvs.length === 0) {
      return NextResponse.json({ error: 'CV not found' }, { status: 404 });
    }

    if (parseInt(session.user.id) !== cvs[0].user_id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // حذف السيرة الذاتية
    await sql`
      DELETE FROM cvs WHERE id = ${parseInt(params.id)}
    `;

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error deleting CV:', error);
    return NextResponse.json(
      { error: 'Failed to delete CV' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, published } = body;

    // التحقق من ملكية السيرة الذاتية
    const cvs = await sql`
      SELECT user_id FROM cvs WHERE id = ${parseInt(params.id)}
    `;

    if (cvs.length === 0) {
      return NextResponse.json({ error: 'CV not found' }, { status: 404 });
    }

    if (parseInt(session.user.id) !== cvs[0].user_id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // تحديث السيرة الذاتية
    const updates = [];
    if (title !== undefined) updates.push(sql`title = ${title}`);
    if (content !== undefined) updates.push(sql`content = ${JSON.stringify(content)}`);
    if (published !== undefined) updates.push(sql`is_published = ${published}`);

    if (updates.length > 0) {
      await sql`
        UPDATE cvs 
        SET ${updates}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${parseInt(params.id)}
      `;
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error updating CV:', error);
    return NextResponse.json(
      { error: 'Failed to update CV' },
      { status: 500 }
    );
  }
}