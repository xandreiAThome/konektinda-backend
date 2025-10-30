import { integer, varchar, pgTable } from 'drizzle-orm/pg-core';
import { users } from './users.schema';

export const user_addresses = pgTable('user_addresses', {
  address_id: integer('address_id').primaryKey().generatedAlwaysAsIdentity(),
  user_id: integer('user_id')
    .references(() => users.user_id)
    .notNull(),
  region: varchar('region', { length: 50 }).notNull(),
  province: varchar('province', { length: 50 }).notNull(),
  city: varchar('city', { length: 50 }).notNull(),
  barangay: varchar('barangay', { length: 50 }).notNull(),
  zip_code: varchar('zip_code', { length: 10 }).notNull(),
});
