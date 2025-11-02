import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { integer, varchar, pgTable } from 'drizzle-orm/pg-core';

export const suppliers = pgTable('suppliers', {
  supplier_id: integer('supplier_id').primaryKey().generatedAlwaysAsIdentity(),
  supplier_name: varchar('supplier_name', { length: 50 }).notNull(),
  supplier_description: varchar('supplier_description', { length: 255 }),
});

export type Supplier = InferSelectModel<typeof suppliers>;
export type NewSupplier = InferInsertModel<typeof suppliers>;