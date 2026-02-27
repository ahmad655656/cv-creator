import { neon } from '@neondatabase/serverless';
import webpush, { type PushSubscription } from 'web-push';

const sql = neon(process.env.DATABASE_URL!);

let isVapidConfigured = false;

function ensureVapidConfigured() {
  if (isVapidConfigured) return true;

  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || 'mailto:admin@example.com';

  if (!publicKey || !privateKey) {
    return false;
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);
  isVapidConfigured = true;
  return true;
}

type SerializedPushSubscription = {
  endpoint: string;
  expirationTime: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
};

export async function upsertPushSubscription(
  userId: number,
  subscription: SerializedPushSubscription,
) {
  if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
    throw new Error('Invalid push subscription payload');
  }

  const expirationIso =
    typeof subscription.expirationTime === 'number'
      ? new Date(subscription.expirationTime).toISOString()
      : null;

  await sql`
    INSERT INTO push_subscriptions (
      user_id,
      endpoint,
      p256dh_key,
      auth_key,
      expiration_time,
      created_at,
      updated_at
    ) VALUES (
      ${userId},
      ${subscription.endpoint},
      ${subscription.keys.p256dh},
      ${subscription.keys.auth},
      ${expirationIso},
      NOW(),
      NOW()
    )
    ON CONFLICT (endpoint)
    DO UPDATE SET
      user_id = EXCLUDED.user_id,
      p256dh_key = EXCLUDED.p256dh_key,
      auth_key = EXCLUDED.auth_key,
      expiration_time = EXCLUDED.expiration_time,
      updated_at = NOW()
  `;
}

export async function removePushSubscription(userId: number, endpoint: string) {
  await sql`
    DELETE FROM push_subscriptions
    WHERE user_id = ${userId}
      AND endpoint = ${endpoint}
  `;
}

type PushPayload = {
  title: string;
  message: string;
  link?: string | null;
  type?: string;
};

export async function sendPushToUser(userId: number, payload: PushPayload) {
  if (!ensureVapidConfigured()) return;

  const rows = await sql`
    SELECT endpoint, p256dh_key, auth_key
    FROM push_subscriptions
    WHERE user_id = ${userId}
  `;

  if (!rows.length) return;

  const encodedPayload = JSON.stringify({
    title: payload.title,
    message: payload.message,
    link: payload.link || '/dashboard',
    type: payload.type || 'general',
    sentAt: new Date().toISOString(),
  });

  const staleEndpoints: string[] = [];

  for (const row of rows) {
    const subscription: PushSubscription = {
      endpoint: String(row.endpoint),
      keys: {
        p256dh: String(row.p256dh_key),
        auth: String(row.auth_key),
      },
    };

    try {
      await webpush.sendNotification(subscription, encodedPayload);
    } catch (error) {
      const statusCode = (error as { statusCode?: number })?.statusCode;
      if (statusCode === 404 || statusCode === 410) {
        staleEndpoints.push(String(row.endpoint));
      }
    }
  }

  if (staleEndpoints.length > 0) {
    for (const endpoint of staleEndpoints) {
      await sql`
        DELETE FROM push_subscriptions
        WHERE endpoint = ${endpoint}
      `;
    }
  }
}

export function getVapidPublicKey() {
  return process.env.VAPID_PUBLIC_KEY || '';
}
