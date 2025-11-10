import { integer, pgTable, varchar, timestamp } from 'drizzle-orm/pg-core';
import { couriers } from '../couriers/couriers.schema';
import { supplier_orders } from '../orders/supplier_orders.schema';
import { InferSelectModel, InferInsertModel, relations } from 'drizzle-orm';

export const shipments = pgTable('shipments', {
  shipment_id: integer('shipment_id').primaryKey().generatedAlwaysAsIdentity(),
  courier_id: integer('courier_id')
    .references(() => couriers.courier_id)
    .notNull(),
  supplier_order_id: integer('supplier_order_id')
    .references(() => supplier_orders.supplier_order_id)
    .notNull(),
  tracking_num: varchar('tracking_num', { length: 100 }).notNull().unique(),
  date_shipped: timestamp('date_shipped').notNull().defaultNow(),
  date_delivered: timestamp('date_delivered'),
});

export const shipmentsRelations = relations(shipments, ({ one }) => ({
  courier: one(couriers, {
    fields: [shipments.courier_id],
    references: [couriers.courier_id],
  }),
  supplier_order: one(supplier_orders, {
    fields: [shipments.supplier_order_id],
    references: [supplier_orders.supplier_order_id],
  }),
}));

export type Shipment = InferSelectModel<typeof shipments>;
export type NewShipment = InferInsertModel<typeof shipments>;
