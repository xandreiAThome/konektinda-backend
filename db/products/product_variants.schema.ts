import {
  integer,
  varchar,
  pgTable,
  decimal,
  boolean,
} from 'drizzle-orm/pg-core';
import { products } from './products.schema';
import { InferSelectModel, InferInsertModel, relations } from 'drizzle-orm';
import { product_images } from './product_images.schema';

export const product_variants = pgTable('product_variants', {
  product_variant_id: integer('product_variant_id')
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  product_id: integer('product_id')
    .references(() => products.product_id)
    .notNull(),
  variant_name: varchar('variant_name', { length: 100 }).notNull(),
  stock: integer('stock').notNull().default(0),
  price: decimal('price', {
    precision: 10,
    scale: 2,
    mode: 'number',
  }).notNull(),
  discount: integer('discount').notNull().default(0),
  is_active: boolean('is_active').notNull().default(true),
  product_variant_img: integer('product_variant_img').references(
    () => product_images.product_image_id,
  ),
});

export const product_variantsRelations = relations(
  product_variants,
  ({ one }) => ({
    product: one(products, {
      fields: [product_variants.product_id],
      references: [products.product_id],
    }),
  }),
);

export type ProductVariant = InferSelectModel<typeof product_variants>;
export type NewProductVariant = InferInsertModel<typeof product_variants>;
