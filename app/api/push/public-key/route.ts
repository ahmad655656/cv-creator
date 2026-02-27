import { NextResponse } from 'next/server';
import { getVapidPublicKey } from '@/lib/services/push-notifications';

export async function GET() {
  const publicKey = getVapidPublicKey();
  return NextResponse.json({ publicKey });
}
