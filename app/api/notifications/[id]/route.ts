import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { markNotificationRead } from '@/lib/services/notifications';

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const notificationId = Number.parseInt(id, 10);
    const userId = Number.parseInt(session.user.id, 10);

    if (!Number.isFinite(notificationId)) {
      return NextResponse.json({ error: 'Invalid notification id' }, { status: 400 });
    }

    const updated = await markNotificationRead(userId, notificationId);
    if (!updated) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Notification PATCH by id error:', error);
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
  }
}
