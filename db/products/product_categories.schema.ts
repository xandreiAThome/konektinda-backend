import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { integer, varchar, pgTable } from 'drizzle-orm/pg-core';

export const product_categories = pgTable('product_categories', {
  product_category_id: integer('product_category_id')
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  category_name: varchar('category_name', { length: 50 }).notNull(),
});

export type ProductCategory = InferSelectModel<typeof product_categories>;
export type NewProductCategory = InferInsertModel<typeof product_categories>;