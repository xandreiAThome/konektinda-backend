// src/products/products.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import type { CreateProductsDto } from './dto/createproducts.dto';
import type { UpdateProductsDto } from './dto/updateprodcuts.dto';
import type { Product } from 'interface/product';

@Injectable()
export class ProductsService {
  private products: Product[] = [];
  private idCounter = 1;

  async createProduct(dto: CreateProductsDto): Promise<Product> {
    const newProduct: Product = {
      product_id: this.idCounter++,
      product_category_id: dto.product_category_id,
      supplier_id: dto.supplier_id,
      product_name: dto.product_name,
      product_description: dto.product_description ?? '',
      is_active: dto.is_active ?? true,
    };

    this.products.push(newProduct);
    return newProduct;
  }

  async getAllProducts(): Promise<Product[]> {
    return this.products;
  }

  async getSingleProduct(id: number): Promise<Product> {
    const product = this.products.find((p) => p.product_id === id);
    if (!product) throw new NotFoundException(`Product with id ${id} not found`);
    return product;
  }

  async updateProduct(id: number, dto: UpdateProductsDto): Promise<Product> {
    const product = await this.getSingleProduct(id);

    const updateData = Object.fromEntries(
      Object.entries(dto).filter(([_, v]) => v !== undefined),
    ) as Partial<Product>;

    Object.assign(product, updateData);

    return product;
  }

  async deleteProduct(id: number): Promise<void> {
    const index = this.products.findIndex((p) => p.product_id === id);
    if (index === -1) throw new NotFoundException(`Product with id ${id} not found`);
    this.products.splice(index, 1);
  }
}
