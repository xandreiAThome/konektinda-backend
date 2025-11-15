import { integer, pgTable } from 'drizzle-orm/pg-core';
import { users } from '../users/users.schema';
import { cart_items } from './cart_items.schema';
import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';

export const carts = pgTable('carts', {
  cart_id: integer('cart_id').primaryKey().generatedAlwaysAsIdentity(),
  user_id: integer('user_id')
    .references(() => users.user_id)
    .notNull()
    .unique(),
});

export const cartsRelations = relations(carts, ({ one, many }) => ({
  user: one(users, {
    fields: [carts.user_id],
    references: [users.user_id],
  }),
  items: many(cart_items),
}));

export type Cart = InferSelectModel<typeof carts>;
export type NewCart = InferInsertModel<typeof carts>;
