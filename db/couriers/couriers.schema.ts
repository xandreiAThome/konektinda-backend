import { integer, pgTable, varchar } from 'drizzle-orm/pg-core';
import { InferSelectModel, InferInsertModel, relations } from 'drizzle-orm';
import { shipments } from '../shipments/shipments.schema';

export const couriers = pgTable('couriers', {
  courier_id: integer('courier_id').primaryKey().generatedAlwaysAsIdentity(),
  courier_name: varchar('courier_name', { length: 50 }).notNull(),
  contact_number: varchar('contact_number', { length: 20 }).notNull(),
});

export const couriersRelations = relations(couriers, ({ many }) => ({
  shipments: many(shipments),
}));

export type Courier = InferSelectModel<typeof couriers>;
export type NewCourier = InferInsertModel<typeof couriers>;
