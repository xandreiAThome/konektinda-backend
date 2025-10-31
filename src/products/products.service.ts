import { Injectable } from '@nestjs/common';

interface Product {
  id: number;
  name: string;
  price: number;
}

@Injectable()
export class ProductsService {
  private products: Product[] = [];
  private idCounter = 1;

  createProduct(name: string, price: number): Product {
    const newProduct: Product = { id: this.idCounter++, name, price };
    this.products.push(newProduct);
    return newProduct;
  }

  getAllProducts(): Product[] {
    return this.products;
  }

  getProductById(id: number): Product | undefined {
    return this.products.find(product => product.id === id);
  }

  updateProductById(id: number, name: string, price: number): Product | undefined {
    const product = this.getProductById(id); 
    if (product) {
      product.name = name;
      product.price = price;
      return product;
    }
    return undefined;
  }

  deleteProductById(id: number): boolean {
    const index = this.products.findIndex(product => product.id === id);
    if (index !== -1) {
      this.products.splice(index, 1);
      return true;
    }
    return false;  
  }

  
}
