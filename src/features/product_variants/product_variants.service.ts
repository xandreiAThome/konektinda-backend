import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductVariantDto } from './dto/create-product_variant.dto';
import { UpdateProductVariantDto } from './dto/update-product_variant.dto';
import { db } from 'database';
import { product_variants, products, product_categories } from 'db/schema';
import { eq, and } from 'drizzle-orm';

@Injectable()
export class ProductVariantsService {
  async createProductVariant(dto: CreateProductVariantDto) {
    const [newVariant] = await db
      .insert(product_variants)
      .values({
        ...dto,
      })
      .returning();

    return newVariant;
  }

  async getAllProductVariants(is_active?: boolean) {
    return db
      .select({
        variant: product_variants,
        product: products,
        category: product_categories,
      })
      .from(product_variants)
      .innerJoin(products, eq(product_variants.product_id, products.product_id))
      .innerJoin(
        product_categories,
        eq(
          products.product_category_id,
          product_categories.product_category_id,
        ),
      )
      .where(
        is_active !== undefined
          ? eq(product_variants.is_active, is_active)
          : undefined,
      );
  }

  async getProductVariantById(id: number, is_active?: boolean) {
    const where =
      is_active === undefined
        ? eq(product_variants.product_variant_id, id)
        : and(
            eq(product_variants.product_variant_id, id),
            eq(product_variants.is_active, is_active),
          );

    const result = await db
      .select({
        variant: product_variants,
        product: products,
        category: product_categories,
      })
      .from(product_variants)
      .innerJoin(products, eq(product_variants.product_id, products.product_id))
      .innerJoin(
        product_categories,
        eq(
          products.product_category_id,
          product_categories.product_category_id,
        ),
      )
      .where(where);

    if (!result || result.length === 0) {
      throw new NotFoundException('Product variant not found.');
    }

    return result[0];
  }

  async updateProductVariant(id: number, dto: UpdateProductVariantDto) {
    const [variant] = await db
      .update(product_variants)
      .set({
        ...dto,
      })
      .where(eq(product_variants.product_variant_id, id))
      .returning();

    if (!variant) {
      throw new NotFoundException('Product category not found.');
    }

    return variant;
  }

  async deleteProductVariant(id: number) {
    const [deletedVariant] = await db
      .delete(product_variants)
      .where(eq(product_variants.product_variant_id, id))
      .returning();

    if (!deletedVariant) {
      throw new NotFoundException('Product variant not found.');
    }
  }
}
