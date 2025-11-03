import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductVariantDto } from './dto/create-product_variant.dto';
import { UpdateProductVariantDto } from './dto/update-product_variant.dto';
import { db } from 'database'
import { product_variants, products } from 'db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class ProductVariantsService {
  async createProductVariant(dto: CreateProductVariantDto) {
    const [newVariant] = await db
      .insert(product_variants)
      .values({
        ...dto
      })
      .returning();

    return newVariant;  
  }

  async getAllProductVariants() {
    return db.select().from(product_variants);
  }

  async getProductVariantById(id: number) {
    const [variant] = await db
    .select()
    .from(product_variants)
    .where(eq(product_variants.product_variant_id, id));
   
    if (!variant) {
      throw new NotFoundException('Product variant not found.');
    }

    return variant;

  }

  async updateProductVariant(id: number, dto: UpdateProductVariantDto) {
    const [variant] = await db
      .update(product_variants)
      .set({ 
        ...dto
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
