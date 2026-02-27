import { neon } from '@neondatabase/serverless';
import { sendPushToUser } from '@/lib/services/push-notifications';

const sql = neon(process.env.DATABASE_URL!);

type NotificationPayload = {
  type: string;
  title: string;
  message: string;
  link?: string | null;
  metadata?: Record<string, unknown> | null;
  senderUserId?: number | null;
};

export async function notifyUser(recipientUserId: number, payload: NotificationPayload) {
  const inserted = await sql`
    INSERT INTO notifications (
      recipient_user_id,
      sender_user_id,
      type,
      title,
      message,
      link,
      metadata,
      is_read,
      created_at
    ) VALUES (
      ${recipientUserId},
      ${payload.senderUserId || null},
      ${payload.type},
      ${payload.title},
      ${payload.message},
      ${payload.link || null},
      ${JSON.stringify(payload.metadata || {})}::jsonb,
      false,
      NOW()
    )
    RETURNING id
  `;

  await sendPushToUser(recipientUserId, {
    title: payload.title,
    message: payload.message,
    link: payload.link || '/dashboard',
    type: payload.type,
  }).catch((error) => {
    console.error('Push send error:', error);
  });

  return inserted[0]?.id ? Number(inserted[0].id) : null;
}

export async function notifyRole(role: string, payload: NotificationPayload) {
  const users = await sql`
    SELECT id FROM users WHERE role = ${role}
  `;

  for (const user of users) {
    await notifyUser(Number(user.id), payload);
  }
}

export async function notifyAdmins(payload: NotificationPayload) {
  await notifyRole('admin', payload);
}

export async function getUserNotifications(userId: number, limit = 20) {
  return await sql`
    SELECT
      id,
      recipient_user_id,
      sender_user_id,
      type,
      title,
      message,
      link,
      metadata,
      is_read,
      read_at,
      created_at
    FROM notifications
    WHERE recipient_user_id = ${userId}
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;
}

export async function getUnreadCount(userId: number) {
  const rows = await sql`
    SELECT COUNT(*)::int AS count
    FROM notifications
    WHERE recipient_user_id = ${userId}
      AND is_read = false
  `;
  return Number(rows[0]?.count || 0);
}

export async function markNotificationRead(userId: number, notificationId: number) {
  const rows = await sql`
    UPDATE notifications
    SET is_read = true, read_at = NOW()
    WHERE id = ${notificationId}
      AND recipient_user_id = ${userId}
    RETURNING id
  `;
  return rows.length > 0;
}

export async function markAllNotificationsRead(userId: number) {
  await sql`
    UPDATE notifications
    SET is_read = true, read_at = NOW()
    WHERE recipient_user_id = ${userId}
      AND is_read = false
  `;
}
