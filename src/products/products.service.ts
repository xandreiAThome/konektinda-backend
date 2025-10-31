import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from 'interface/product';
import { CreateProductsDto } from './dto/createproducts.dto';
import { UpdateProductsDto } from './dto/updateprodcuts.dto';

@Injectable()
export class ProductsService {
  private products: Product[] = [];
  private idCounter = 1;

  createProduct(dto: CreateProductsDto): Product {
    const newProduct: Product = {
      product_id: this.idCounter++,
      product_category_id: dto.product_category_id,
      supplier_id: dto.supplier_id,
      product_name: dto.product_name,
      product_description: dto.product_description ?? '',
      is_active: dto.is_active ?? false,
    };
    this.products.push(newProduct);
    return newProduct;
  }

  getAllProducts(): Product[] {
    return this.products;
  }

  getSingleProduct(id: number): Product {
    const product = this.products.find(p => p.product_id === id);
    if (!product) throw new NotFoundException(`Product with id ${id} not found`);
    return product;
  }

  updateProduct(id: number, dto: UpdateProductsDto): Product {
    const product = this.getSingleProduct(id); // throws if not found
    if (dto.product_category_id !== undefined)
      product.product_category_id = dto.product_category_id;
    if (dto.supplier_id !== undefined) product.supplier_id = dto.supplier_id;
    if (dto.product_name !== undefined) product.product_name = dto.product_name;
    if (dto.product_description !== undefined)
      product.product_description = dto.product_description;
    if (dto.is_active !== undefined) product.is_active = dto.is_active;
    return product;
  }

  deleteProduct(id: number): void {
    const index = this.products.findIndex(p => p.product_id === id);
    if (index === -1) throw new NotFoundException(`Product with id ${id} not found`);
    this.products.splice(index, 1);
  }
}
