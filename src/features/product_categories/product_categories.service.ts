import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from 'database';
import { eq } from 'drizzle-orm'
import { CreateProductCategoryDto } from './dto/create-product_category.dto';
import { UpdateProductCategoryDto } from './dto/update-product_category.dto';
import { product_categories } from 'db/schema';


@Injectable()
export class ProductCategoriesService {
  async createProductCategory(createProductCategoryDto: CreateProductCategoryDto) {
    const [newCategory] = await db
    .insert(product_categories)
    .values({ 
      ...createProductCategoryDto
    })
    .returning()

    return newCategory;
  }

  async getAllProductCategories() {
    return db.select().from(product_categories);
  }

  async getProductCategoryById(id: number) {
    const [category] = await db
      .select()
      .from(product_categories)
      .where(eq(product_categories.product_category_id, id));

    if (!category) {
      throw new NotFoundException('Product category not found.');
    }

    return category;
  }

  async updateProductCategory(id: number, updateProductCategoryDto: UpdateProductCategoryDto) {
    const [category] = await db
      .update(product_categories)
      .set({ 
        ...updateProductCategoryDto
       })
      .where(eq(product_categories.product_category_id, id))
      .returning();

    if (!category) {
      throw new NotFoundException('Product category not found.');
    }

    return category;
  }

  async deleteProductCategory(id: number) {
    const [deletedCategory] = await db
      .delete(product_categories)
      .where(eq(product_categories.product_category_id, id))
      .returning();
    
    if (!deletedCategory) {
      throw new NotFoundException('Product category not found.');
    } 
  }
}
