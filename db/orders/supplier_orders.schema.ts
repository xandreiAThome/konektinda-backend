import { integer, pgTable, varchar, decimal } from 'drizzle-orm/pg-core';
import { suppliers } from '../suppliers/suppliers.schema';
import { orders } from './orders.schema';
import { orderStatuses } from '../enums';
import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';

export const supplier_orders = pgTable('supplier_orders', {
  supplier_order_id: integer('supplier_order_id')
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  order_id: integer('order_id')
    .references(() => orders.order_id)
    .notNull(),
  supplier_id: integer('supplier_id')
    .references(() => suppliers.supplier_id)
    .notNull(),
  supplier_order_num: varchar('supplier_order_number', { length: 50 })
    .notNull()
    .unique(),
  subtotal: decimal('subtotal', {
    precision: 10,
    scale: 2,
    mode: 'number',
  }).notNull(),
  shipping: decimal('shipping_fee', {
    precision: 10,
    scale: 2,
    mode: 'number',
  }).notNull(),
  total_price: decimal('total_price', {
    precision: 10,
    scale: 2,
    mode: 'number',
  }).notNull(),
  status: orderStatuses().notNull().default('PENDING'),
});

export const supplier_ordersRelations = relations(
  supplier_orders,
  ({ one }) => ({
    order: one(orders, {
      fields: [supplier_orders.order_id],
      references: [orders.order_id],
    }),
    supplier: one(suppliers, {
      fields: [supplier_orders.supplier_id],
      references: [suppliers.supplier_id],
    }),
  }),
);

export type SupplierOrder = InferSelectModel<typeof supplier_orders>;
export type NewSupplierOrder = InferInsertModel<typeof supplier_orders>;
