import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { integer, varchar, pgTable } from 'drizzle-orm/pg-core';
import { products } from '../products/products.schema';

export const suppliers = pgTable('suppliers', {
  supplier_id: integer('supplier_id').primaryKey().generatedAlwaysAsIdentity(),
  supplier_name: varchar('supplier_name', { length: 50 }).notNull(),
  supplier_description: varchar('supplier_description', { length: 1000 }),
});

export const suppliersRelations = relations(suppliers, ({ many }) => ({
  products: many(products),
}));

export type Supplier = InferSelectModel<typeof suppliers>;
export type NewSupplier = InferInsertModel<typeof suppliers>;
