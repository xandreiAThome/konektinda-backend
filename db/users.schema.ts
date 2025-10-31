import {
  integer,
  pgTable,
  varchar,
  boolean,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { suppliers } from './suppliers.schema';
import { userRoles } from './enums';

export const users = pgTable('users', {
  user_id: integer('user_id').primaryKey().generatedAlwaysAsIdentity(),
  first_name: varchar('first_name', { length: 20 }).notNull(),
  last_name: varchar('last_name', { length: 20 }).notNull(),
  email: varchar('email', { length: 50 }).notNull().unique(),
  username: varchar('username', { length: 20 }).notNull().unique(),
  password_hash: varchar('password_hash', { length: 255 }).notNull(),
  phone_number: varchar('phone_number', { length: 20 }).notNull().unique(),
  email_verified: boolean('email_verified').notNull().default(false),
  role: userRoles().notNull().default('CONSUMER'),
  profile_picture_url: varchar('profile_picture_url', { length: 255 }).default(
    '',
  ),
  supplier_id: integer('supplier_id').references(() => suppliers.supplier_id),
});
