import { pgTable, serial, text, timestamp, jsonb, boolean, integer, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  passwordHash: text('password_hash'),
  image: text('image'),
  role: varchar('role', { length: 50 }).default('user'),
  emailVerified: timestamp('email_verified'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const sessions = pgTable('sessions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  sessionToken: text('session_token').notNull().unique(),
  expires: timestamp('expires').notNull(),
});

export const cvs = pgTable('cvs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  templateId: varchar('template_id', { length: 100 }).notNull(),
  content: jsonb('content').notNull().default({}),
  isPublic: boolean('is_public').default(false),
  shareId: varchar('share_id', { length: 100 }).unique(),
  views: integer('views').default(0),
  downloads: integer('downloads').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const templates = pgTable('templates', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  description: text('description'),
  category: varchar('category', { length: 100 }),
  thumbnail: text('thumbnail'),
  preview: text('preview'),
  isPremium: boolean('is_premium').default(false),
  price: integer('price').default(0),
  downloads: integer('downloads').default(0),
  rating: integer('rating').default(0),
  config: jsonb('config').default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const subscriptions = pgTable('subscriptions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  planId: varchar('plan_id', { length: 50 }).notNull(),
  status: varchar('status', { length: 50 }).default('active'),
  startDate: timestamp('start_date').defaultNow().notNull(),
  endDate: timestamp('end_date'),
  stripeSubscriptionId: varchar('stripe_subscription_id', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  templateId: integer('template_id').references(() => templates.id).notNull(),
  amount: integer('amount').notNull(),
  senderNumber: varchar('sender_number', { length: 20 }).notNull(),
  receiverNumber: varchar('receiver_number', { length: 20 }).notNull(),
  transactionDate: timestamp('transaction_date').notNull(),
  screenshot: text('screenshot'),
  status: varchar('status', { length: 20 }).default('pending'),
  adminNotes: text('admin_notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  recipientUserId: integer('recipient_user_id').references(() => users.id).notNull(),
  senderUserId: integer('sender_user_id').references(() => users.id),
  type: varchar('type', { length: 64 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  link: text('link'),
  metadata: jsonb('metadata').default({}),
  isRead: boolean('is_read').default(false).notNull(),
  readAt: timestamp('read_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const pushSubscriptions = pgTable('push_subscriptions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  endpoint: text('endpoint').notNull().unique(),
  p256dhKey: text('p256dh_key').notNull(),
  authKey: text('auth_key').notNull(),
  expirationTime: timestamp('expiration_time'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const schema = {
  users,
  sessions,
  cvs,
  templates,
  subscriptions,
  payments,
  notifications,
  pushSubscriptions,
};
