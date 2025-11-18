import { integer, varchar, pgTable, boolean } from 'drizzle-orm/pg-core';
import { product_categories } from './product_categories.schema';
import { suppliers } from '../suppliers/suppliers.schema';
import { product_variants } from './product_variants.schema';
import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { product_images } from './product_images.schema';

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
  product_img: integer('product_img').references(
    () => product_images.product_image_id,
  ),
});

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(product_categories, {
    fields: [products.product_category_id],
    references: [product_categories.product_category_id],
  }),
  supplier: one(suppliers, {
    fields: [products.supplier_id],
    references: [suppliers.supplier_id],
  }),
  variants: many(product_variants),
}));

export type Product = InferSelectModel<typeof products>;
export type NewProduct = InferInsertModel<typeof products>;
