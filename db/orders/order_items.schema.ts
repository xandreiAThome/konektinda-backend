import { integer, pgTable, decimal } from 'drizzle-orm/pg-core';
import { supplier_orders } from './supplier_orders.schema';
import { product_variants } from '../products/product_variants.schema';

export const order_items = pgTable('order_items', {
  order_item_id: integer('order_item_id')
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  supplier_order_id: integer('supplier_order_id')
    .references(() => supplier_orders.supplier_order_id)
    .notNull(),
  product_variant_id: integer('product_variant_id')
    .references(() => product_variants.product_variant_id)
    .notNull(),
  quantity: integer('quantity').notNull().default(1),
  unit_price: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
  discount_applied: integer('discount_applied').notNull().default(0),
});
