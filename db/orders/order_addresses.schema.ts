import { integer, varchar, text, pgTable } from 'drizzle-orm/pg-core';
import { orders } from './orders.schema';
import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';

export const order_addresses = pgTable('order_addresses', {
  order_address_id: integer('order_address_id')
    .primaryKey()
    .generatedAlwaysAsIdentity(),

  order_id: integer('order_id')
    .references(() => orders.order_id)
    .notNull(),

  // 'shipping' | 'billing' (or whatever you want)
  type: varchar('type', { length: 20 }).notNull(),

  name: text('name'),
  phone: text('phone'),
  email: text('email'),
  company_name: text('company_name'),

  address_line1: text('address_line1').notNull(),
  address_line2: text('address_line2'),
  address_line3: text('address_line3'),

  city_locality: text('city_locality').notNull(),
  state_province: text('state_province').notNull(),
  postal_code: text('postal_code'),

  country_code: varchar('country_code', { length: 2 }).notNull(),
  address_residential_indicator: varchar('address_residential_indicator', {
    length: 7,
  }),
});

export const order_addressesRelations = relations(
  order_addresses,
  ({ one }) => ({
    order: one(orders, {
      fields: [order_addresses.order_id],
      references: [orders.order_id],
    }),
  }),
);

export type OrderAddress = InferSelectModel<typeof order_addresses>;
export type NewOrderAddress = InferInsertModel<typeof order_addresses>;
