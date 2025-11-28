import {
  integer,
  pgTable,
  varchar,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { supplier_orders } from '../orders/supplier_orders.schema';
import { InferSelectModel, InferInsertModel, relations } from 'drizzle-orm';

export const shipments = pgTable('shipments', {
  // ShipEngine shipment_id (se-..., 1–25 chars)
  shipment_id: varchar('shipment_id', { length: 25 }).primaryKey(),

  supplier_order_id: integer('supplier_order_id')
    .references(() => supplier_orders.supplier_order_id)
    .notNull(),

  // ShipEngine carrier + service
  carrier_id: varchar('carrier_id', { length: 25 }).notNull(), // se- carrier id
  service_code: varchar('service_code', { length: 100 }).notNull(), // e.g. usps_priority_mail

  shipment_status: varchar('shipment_status', { length: 50 }).notNull(), // pending / processing / label_purchased / cancelled

  tracking_number: varchar('tracking_number', { length: 100 }),
  label_id: varchar('label_id', { length: 25 }), // ShipEngine label id (se-...)
  label_url: text('label_url'),

  ship_date: timestamp('ship_date').notNull(),

  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const shipmentsRelations = relations(shipments, ({ one }) => ({
  supplier_order: one(supplier_orders, {
    fields: [shipments.supplier_order_id],
    references: [supplier_orders.supplier_order_id],
  }),
}));

export type Shipment = InferSelectModel<typeof shipments>;
export type NewShipment = InferInsertModel<typeof shipments>;
