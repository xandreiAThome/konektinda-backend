import { integer, varchar, pgTable, boolean } from 'drizzle-orm/pg-core';
import { product_categories } from './product_categories.schema';
import { suppliers } from '../suppliers/suppliers.schema';

export const products = pgTable('products', {
  product_id: integer('product_id').primaryKey().generatedAlwaysAsIdentity(),
  product_category_id: integer('product_category_id')
    .references(() => product_categories.product_category_id)
    .notNull(),
  supplier_id: integer('supplier_id')
    .references(() => suppliers.supplier_id)
    .notNull(),
  product_name: varchar('product_name', { length: 100 }).notNull(),
  product_description: varchar('product_description', { length: 255 }),
  is_active: boolean('is_active').notNull().default(true),
});
