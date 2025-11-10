import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductVariantDto } from './dto/create-product_variant.dto';
import { UpdateProductVariantDto } from './dto/update-product_variant.dto';
import { db } from 'database';
import { product_variants } from 'db/schema';
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

  async getAllProductVariants(
    is_active?: boolean,
  ): Promise<Awaited<ReturnType<typeof db.query.product_variants.findMany>>> {
    const where =
      is_active !== undefined
        ? eq(product_variants.is_active, is_active)
        : undefined;

    return db.query.product_variants.findMany({
      where,
      with: {
        product: {
          with: {
            category: true,
          },
        },
      },
    });
  }

  async getProductVariantById(
    id: number,
    is_active?: boolean,
  ): Promise<Awaited<ReturnType<typeof db.query.product_variants.findFirst>>> {
    const where =
      is_active === undefined
        ? eq(product_variants.product_variant_id, id)
        : and(
            eq(product_variants.product_variant_id, id),
            eq(product_variants.is_active, is_active),
          );

    const variant = await db.query.product_variants.findFirst({
      where,
      with: {
        product: {
          with: {
            category: true,
          },
        },
      },
    });

    if (!variant) {
      throw new NotFoundException('Product variant not found.');
    }

    return variant;
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
