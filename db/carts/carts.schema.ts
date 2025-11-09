import { integer, pgTable } from 'drizzle-orm/pg-core';
import { users } from '../users/users.schema';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export const carts = pgTable('carts', {
  cart_id: integer('cart_id').primaryKey().generatedAlwaysAsIdentity(),
  user_id: integer('user_id')
    .references(() => users.user_id)
    .notNull(),
});

export type Cart = InferSelectModel<typeof carts>;
export type NewCart = InferInsertModel<typeof carts>;