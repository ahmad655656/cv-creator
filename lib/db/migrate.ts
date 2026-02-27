import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function migrate() {
  const sql = neon(process.env.DATABASE_URL!);
  
  try {
    console.log('🔄 بدء تهجير قاعدة البيانات...');
    
    // إنشاء الجداول
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        password_hash TEXT,
        image TEXT,
        role VARCHAR(50) DEFAULT 'user',
        email_verified TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    await sql`
      CREATE TABLE IF NOT EXISTS sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        session_token TEXT UNIQUE NOT NULL,
        expires TIMESTAMP NOT NULL
      );
    `;
    
    await sql`
      CREATE TABLE IF NOT EXISTS cvs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        template_id VARCHAR(100) NOT NULL,
        content JSONB NOT NULL DEFAULT '{}',
        is_public BOOLEAN DEFAULT FALSE,
        share_id VARCHAR(100) UNIQUE,
        views INTEGER DEFAULT 0,
        downloads INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    await sql`
      CREATE TABLE IF NOT EXISTS templates (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        category VARCHAR(100),
        thumbnail TEXT,
        preview TEXT,
        is_premium BOOLEAN DEFAULT FALSE,
        price INTEGER DEFAULT 0,
        downloads INTEGER DEFAULT 0,
        rating INTEGER DEFAULT 0,
        config JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    await sql`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        plan_id VARCHAR(50) NOT NULL,
        status VARCHAR(50) DEFAULT 'active',
        start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        end_date TIMESTAMP,
        stripe_subscription_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        recipient_user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        sender_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        type VARCHAR(64) NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        link TEXT,
        metadata JSONB DEFAULT '{}',
        is_read BOOLEAN DEFAULT FALSE,
        read_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS push_subscriptions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        endpoint TEXT UNIQUE NOT NULL,
        p256dh_key TEXT NOT NULL,
        auth_key TEXT NOT NULL,
        expiration_time TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    console.log('✅ تم إنشاء الجداول بنجاح');
    
    // إضافة بعض القوالب التجريبية
    await sql`
      INSERT INTO templates (name, slug, description, category, thumbnail, is_premium)
      VALUES 
        ('القالب الاحترافي', 'professional', 'قالب احترافي مناسب للمدراء التنفيذيين', 'professional', '/templates/professional.jpg', false),
        ('القالب العصري', 'modern', 'قالب عصري بتصميم مبتكر', 'modern', '/templates/modern.jpg', false),
        ('القالب الإبداعي', 'creative', 'قالب للمصممين والمبدعين', 'creative', '/templates/creative.jpg', true),
        ('القالب التقني', 'technical', 'قالب للمبرمجين والمهندسين', 'technical', '/templates/technical.jpg', false)
      ON CONFLICT (slug) DO NOTHING;
    `;
    
    console.log('✅ تم إضافة القوالب التجريبية');
    
  } catch (error) {
    console.error('❌ فشل التهجير:', error);
    process.exit(1);
  }
}

migrate();
