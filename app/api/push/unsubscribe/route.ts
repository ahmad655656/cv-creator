import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { removePushSubscription } from '@/lib/services/push-notifications';

type UnsubscribeBody = {
  endpoint: string;
};

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as UnsubscribeBody;
    if (!body?.endpoint) {
      return NextResponse.json({ error: 'Missing endpoint' }, { status: 400 });
    }

    const userId = Number.parseInt(session.user.id, 10);
    await removePushSubscription(userId, body.endpoint);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Push unsubscribe error:', error);
    return NextResponse.json({ error: 'Failed to unsubscribe from push notifications' }, { status: 500 });
  }
}
