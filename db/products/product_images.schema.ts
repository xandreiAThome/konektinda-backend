import { pgTable, varchar } from 'drizzle-orm/pg-core';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { integer } from 'drizzle-orm/pg-core';
import { products } from './products.schema';

export const product_images = pgTable('product_images', {
  product_image_id: integer('product_image_id')
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  image_url: varchar('image_url', { length: 250 }).notNull(),
  product_id: integer('product_id').references(() => products.product_id),
});

export type ProductImage = InferSelectModel<typeof product_images>;
export type NewProductImage = InferInsertModel<typeof product_images>;
