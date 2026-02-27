import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { db } from '@/lib/db/drizzle';
import { cvs } from '@/lib/db/schema';
import { v4 as uuidv4 } from 'uuid';
import { eq, desc } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    // جلب الجلسة
    const session = await getServerSession(authOptions);
    
    console.log('Session in API:', session);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'غير مصرح بهذا الإجراء - الرجاء تسجيل الدخول' }, 
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, templateId, content } = body;

    console.log('Received data:', { title, templateId, userId: session.user.id });

    // التحقق من صحة البيانات
    if (!title || !templateId || !content) {
      return NextResponse.json(
        { error: 'البيانات غير مكتملة' },
        { status: 400 }
      );
    }

    // إنشاء shareId فريد
    const shareId = uuidv4();

    // حفظ السيرة الذاتية باستخدام Drizzle
    const newCV = await db.insert(cvs).values({
      userId: parseInt(session.user.id),
      title: title,
      templateId: templateId,
      content: content,
      shareId: shareId,
      isPublic: false,
      views: 0,
      downloads: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    console.log('CV saved successfully:', newCV[0]);

    return NextResponse.json({
      success: true,
      cv: newCV[0],
      message: 'تم حفظ السيرة الذاتية بنجاح'
    });

  } catch (error) {
    console.error('Error saving CV:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء حفظ السيرة الذاتية: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'غير مصرح' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const cvId = searchParams.get('id');
    const userId = parseInt(session.user.id);

    if (cvId) {
      // جلب سيرة ذاتية محددة
      const userCvs = await db.select()
        .from(cvs)
        .where(eq(cvs.id, parseInt(cvId)))
        .limit(1);
      
      const userCv = userCvs[0];
      
      if (!userCv || userCv.userId !== userId) {
        return NextResponse.json(
          { error: 'السيرة الذاتية غير موجودة' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(userCv);
    } else {
      // جلب كل السير الذاتية للمستخدم
      const userCvs = await db.select({
        id: cvs.id,
        title: cvs.title,
        templateId: cvs.templateId,
        isPublic: cvs.isPublic,
        views: cvs.views,
        downloads: cvs.downloads,
        createdAt: cvs.createdAt,
        updatedAt: cvs.updatedAt,
      })
      .from(cvs)
      .where(eq(cvs.userId, userId))
      .orderBy(desc(cvs.updatedAt));
      
      return NextResponse.json(userCvs);
    }

  } catch (error) {
    console.error('Error fetching CVs:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في جلب البيانات' },
      { status: 500 }
    );
  }
}