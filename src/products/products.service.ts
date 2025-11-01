import { Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { CreateProductsDto } from './dto/createproducts.dto';
import { UpdateProductsDto } from './dto/updateprodcuts.dto';
import { Product } from 'interface/products';
import { products } from 'db/schema';
import { db } from 'database';

@Injectable()
export class ProductsService {
  async createProduct(dto: CreateProductsDto): Promise<Product> {
    const [newProduct] = await db
      .insert(products)
      .values({
        product_category_id: dto.product_category_id,
        supplier_id: dto.supplier_id,
        product_name: dto.product_name,
        product_description: dto.product_description ?? null,
        is_active: dto.is_active ?? true,
      })
      .returning();
    return newProduct;
  }

  async getAllProducts(): Promise<Product[]> {
    return db.select().from(products);
  }

  async getSingleProduct(id: number): Promise<Product> {
    const [product] = await db.select().from(products).where(eq(products.product_id, id));
    if (!product) throw new NotFoundException(`Product with id ${id} not found`);
    return product;
  }

  async updateProduct(id: number, dto: UpdateProductsDto): Promise<Product> {
    const updateData: Partial<Product> = {};
    if (dto.product_category_id !== undefined) updateData.product_category_id = dto.product_category_id;
    if (dto.supplier_id !== undefined) updateData.supplier_id = dto.supplier_id;
    if (dto.product_name !== undefined) updateData.product_name = dto.product_name;
    if (dto.product_description !== undefined) updateData.product_description = dto.product_description;
    if (dto.is_active !== undefined) updateData.is_active = dto.is_active;

    const [updatedProduct] = await db
      .update(products)
      .set(updateData)
      .where(eq(products.product_id, id))
      .returning();

    if (!updatedProduct) throw new NotFoundException(`Product with id ${id} not found`);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<void> {
    const [deletedProduct] = await db.delete(products).where(eq(products.product_id, id)).returning();
    if (!deletedProduct) throw new NotFoundException(`Product with id ${id} not found`);
  }
}
