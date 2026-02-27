import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

// إنشاء اتصال SQL
const sql = neon(process.env.DATABASE_URL);

// إنشاء اتصال Drizzle ORM
export const db = drizzle(sql, { schema });

// دالة لاختبار الاتصال
export async function testConnection() {
  try {
    const result = await sql`SELECT NOW()`;
    console.log('✅ Database connected successfully:', result);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}