import { integer, pgTable, varchar, boolean } from 'drizzle-orm/pg-core';
import { suppliers } from '../suppliers/suppliers.schema';
import { user_addresses } from './user_addresses.schema';
import { userRoles } from '../enums';
import { InferSelectModel, InferInsertModel, relations } from 'drizzle-orm';

export const users = pgTable('users', {
  user_id: integer('user_id').primaryKey().generatedAlwaysAsIdentity(),
  firebase_uid: varchar('firebase_uid', { length: 128 }).unique(),
  first_name: varchar('first_name', { length: 20 }).notNull(),
  last_name: varchar('last_name', { length: 20 }).notNull(),
  email: varchar('email', { length: 50 }).notNull().unique(),
  username: varchar('username', { length: 20 }).notNull().unique(),
  password_hash: varchar('password_hash', { length: 255 }),
  phone_number: varchar('phone_number', { length: 20 }),
  email_verified: boolean('email_verified').notNull().default(false),
  role: userRoles().notNull().default('CONSUMER'),
  profile_picture_url: varchar('profile_picture_url', { length: 255 }).default(
    '',
  ),
  supplier_id: integer('supplier_id').references(() => suppliers.supplier_id),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  supplier: one(suppliers, {
    fields: [users.supplier_id],
    references: [suppliers.supplier_id],
  }),
  addresses: many(user_addresses),
}));

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
