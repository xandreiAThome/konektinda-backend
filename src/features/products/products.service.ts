import { Injectable, NotFoundException } from "@nestjs/common";
import { db } from "database";
import { Product, products } from "db/schema";
import { eq } from "drizzle-orm";
import { CreateProductsDto } from "./dto/createproducts.dto";
import { UpdateProductsDto } from "./dto/updateprodcuts.dto";

@Injectable()
export class ProductsService {
  async createProduct(dto: CreateProductsDto): Promise<Product> {
    const [newProduct] = await db
      .insert(products)
      .values({
        ...dto,
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
    const [updatedProduct] = await db
      .update(products)
      .set({ ...dto }) // DTO is already Partial
      .where(eq(products.product_id, id))
      .returning();

    if (!updatedProduct) throw new NotFoundException(`Product with id ${id} not found`);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<void> {
    const deleted = await db.delete(products).where(eq(products.product_id, id)).returning();
    if (!deleted.length) throw new NotFoundException(`Product with id ${id} not found`);
  }
}
