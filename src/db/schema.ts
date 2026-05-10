import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';

export const trials = pgTable('trials', {
  id: serial('id').primaryKey(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phoneNumber: varchar('phone_number', { length: 50 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const memberships = pgTable('memberships', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull(),
  planType: varchar('plan_type', { length: 100 }).notNull(),
  status: varchar('status', { length: 50 }).default('active').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
