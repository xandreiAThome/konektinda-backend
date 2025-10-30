import { integer, pgTable, varchar, timestamp } from 'drizzle-orm/pg-core';
import { couriers } from './couriers.schema';
import { supplier_orders } from './supplier_orders.schema';

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
