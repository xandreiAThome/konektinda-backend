import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { integer, varchar, pgTable } from 'drizzle-orm/pg-core';
import { products } from './products.schema';

export const product_categories = pgTable('product_categories', {
  product_category_id: integer('product_category_id')
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  category_name: varchar('category_name', { length: 50 }).notNull(),
});

export const product_categoriesRelations = relations(
  product_categories,
  ({ many }) => ({
    products: many(products),
  }),
);

export type ProductCategory = InferSelectModel<typeof product_categories>;
export type NewProductCategory = InferInsertModel<typeof product_categories>;
