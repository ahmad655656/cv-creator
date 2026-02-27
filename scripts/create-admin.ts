import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { join } from 'path';

// تحميل متغيرات البيئة
dotenv.config({ path: join(process.cwd(), '.env.local') });

const sql = neon(process.env.DATABASE_URL!);

async function createAdmin() {
  const adminEmail = 'admin@cvcreator.com';
  const adminPassword = 'Admin@123'; // يمكنك تغيير كلمة المرور هنا
  const adminName = 'مدير النظام';

  try {
    console.log('🔄 جاري إنشاء حساب الأدمن...');
    console.log('📧 البريد:', adminEmail);
    console.log('🔐 كلمة المرور:', adminPassword);
    console.log('────────────────────────────');

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    console.log('✅ تم تشفير كلمة المرور');

    // التأكد من وجود عمود role
    await sql`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user'
    `;
    console.log('✅ تم التأكد من وجود عمود role');

    // إدراج أو تحديث الأدمن
    const result = await sql`
      INSERT INTO users (email, name, password_hash, role, created_at, updated_at)
      VALUES (
        ${adminEmail},
        ${adminName},
        ${hashedPassword},
        'admin',
        NOW(),
        NOW()
      )
      ON CONFLICT (email) 
      DO UPDATE SET 
        password_hash = ${hashedPassword},
        role = 'admin',
        updated_at = NOW()
      RETURNING id, email, name, role, created_at
    `;

    console.log('\n✅✅✅ تم إنشاء حساب الأدمن بنجاح! ✅✅✅');
    console.log('═══════════════════════════════════════');
    console.log(`🆔 المعرّف: ${result[0].id}`);
    console.log(`📧 البريد الإلكتروني: ${result[0].email}`);
    console.log(`👤 اسم المستخدم: ${result[0].name}`);
    console.log(`🔑 الصلاحية: ${result[0].role}`);
    console.log(`📅 تاريخ الإنشاء: ${new Date(result[0].created_at).toLocaleString('ar-EG')}`);
    console.log(`🔐 كلمة المرور: ${adminPassword}`);
    console.log('═══════════════════════════════════════');
    console.log('🌐 يمكنك الدخول إلى لوحة التحكم عبر:');
    console.log('   http://localhost:3000/admin/payments');
    console.log('═══════════════════════════════════════\n');
    
  } catch (error: any) {
    console.error('❌ خطأ في إنشاء حساب الأدمن:');
    console.error(error);
    
    if (error.message?.includes('relation "users" does not exist')) {
      console.log('\n⚠️  جدول users غير موجود. الرجاء إنشاء الجداول أولاً باستخدام:');
      console.log('   npx drizzle-kit push');
    }
    
    if (error.message?.includes('duplicate key')) {
      console.log('\n⚠️  البريد الإلكتروني موجود بالفعل. جاري تحديث الصلاحية...');
      
      // تحديث الصلاحية إلى admin
      const updateResult = await sql`
        UPDATE users 
        SET role = 'admin', updated_at = NOW()
        WHERE email = ${adminEmail}
        RETURNING id, email, name, role
      `;
      
      if (updateResult.length > 0) {
        console.log('✅ تم تحديث الصلاحية إلى admin');
        console.log(`📧 ${updateResult[0].email} الآن هو أدمن`);
      }
    }
  }
}

// تشغيل الدالة
createAdmin();