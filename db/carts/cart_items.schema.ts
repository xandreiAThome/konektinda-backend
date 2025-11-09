import { integer, pgTable, decimal, timestamp } from 'drizzle-orm/pg-core';
import { carts } from './carts.schema';
import { product_variants } from '../products/product_variants.schema';
import { InferSelectModel, InferInsertModel } from 'drizzle-orm';

export const cart_items = pgTable('cart_items', {
  cart_item_id: integer('cart_item_id')
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  cart_id: integer('cart_id')
    .references(() => carts.cart_id, { onDelete: 'cascade' })
    .notNull(),
  product_variant_id: integer('product_variant_id')
    .references(() => product_variants.product_variant_id)
    .notNull(),
  quantity: integer('quantity').notNull().default(1),
  unit_price: decimal('unit_price', {
    precision: 10,
    scale: 2,
    mode: 'number',
  }).notNull(),
  discount_applied: integer('discount_applied').notNull().default(0),
  date_priced: timestamp('date_priced').notNull().defaultNow(),
});

export type CartItem = InferSelectModel<typeof cart_items>;
export type NewCartItem = InferInsertModel<typeof cart_items>;
