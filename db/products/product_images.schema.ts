import { pgTable, serial, text } from 'drizzle-orm/pg-core';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { integer } from 'drizzle-orm/pg-core';

export const product_images = pgTable('product_images', {
  product_image_id: integer('product_image_id')
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  image_url: text('image_url').notNull(),
});

export type ProductImage = InferSelectModel<typeof product_images>;
export type NewProductImage = InferInsertModel<typeof product_images>;
