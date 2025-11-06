import { pgTable, varchar, decimal, timestamp } from 'drizzle-orm/pg-core';
import { paymentTypes, paymentStatuses } from '../enums';

export const payments = pgTable('payments', {
  ref_num: varchar('ref_num', { length: 100 }).primaryKey(),
  type: paymentTypes().notNull(),
  provider: varchar('provider', { length: 50 }).notNull(),
  status: paymentStatuses().notNull().default('PENDING'),
  amount: decimal('amount', { precision: 10, scale: 2, mode: 'number' }).notNull(),
  payment_date: timestamp('payment_date').notNull().defaultNow(),
});
