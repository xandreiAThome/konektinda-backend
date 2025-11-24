import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { CreateProductsDto } from './dto/createproducts.dto';
import { UpdateProductsDto } from './dto/updateproducts.dto';
import { Product, product_images, products } from 'db/schema';
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

    if (!newProduct) {
      throw new InternalServerErrorException('Failed to create product');
    }

    if (dto.images?.length) {
      await db.insert(product_images).values(
        dto.images.map((url) => ({
          product_id: newProduct.product_id,
          image_url: url,
        })),
      );
    }
    return newProduct;
  }

  async getAllProducts(): Promise<Product[]> {
    // Use relational query to fetch products with their category and variants
    const result = await db.query.products.findMany({
      with: {
        category: true,
        variants: true,
        images: true,
      },
    });

    return result;
  }

  async getSingleProduct(id: number): Promise<Product> {
    // Use relational query to fetch a single product with its category and variants
    const result = await db.query.products.findFirst({
      where: eq(products.product_id, id),
      with: {
        category: true,
        variants: true,
        images: true,
      },
    });

    if (!result) throw new NotFoundException(`Product with id ${id} not found`);

    return result;
  }

  async updateProduct(id: number, dto: UpdateProductsDto): Promise<Product> {
    const updateData: Partial<Product> = {};
    if (dto.product_category_id !== undefined)
      updateData.product_category_id = dto.product_category_id;
    if (dto.supplier_id !== undefined) updateData.supplier_id = dto.supplier_id;
    if (dto.product_name !== undefined)
      updateData.product_name = dto.product_name;
    if (dto.product_description !== undefined)
      updateData.product_description = dto.product_description;
    if (dto.is_active !== undefined) updateData.is_active = dto.is_active;

    let updatedProduct: Product | undefined;
    if (Object.keys(updateData).length > 0) {
      const [prod] = await db
        .update(products)
        .set(updateData)
        .where(eq(products.product_id, id))
        .returning();

      updatedProduct = prod;
    }

    // Update the images if provided
    if (dto.images) {
      // remove old images
      await db.delete(product_images).where(eq(product_images.product_id, id));

      // insert new images
      if (dto.images.length > 0) {
        await db.insert(product_images).values(
          dto.images.map((imageUrl) => ({
            product_id: id,
            image_url: imageUrl,
          })),
        );
      }
    }

    if (!updatedProduct) {
      const prod = await db.query.products.findFirst({
        where: eq(products.product_id, id),
        with: {
          category: true,
          variants: true,
          images: true,
        },
      });
      if (!prod) throw new NotFoundException(`Product with id ${id} not found`);
      updatedProduct = prod;
    }

    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<void> {
    const [deletedProduct] = await db
      .delete(products)
      .where(eq(products.product_id, id))
      .returning();
    if (!deletedProduct)
      throw new NotFoundException(`Product with id ${id} not found`);
  }
}
