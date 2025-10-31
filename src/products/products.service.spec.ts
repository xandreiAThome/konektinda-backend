import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';

describe('ProductsService (TDD)', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create and return a product', () => {
    const product = service.createProduct('Laptop', 1200);
    expect(product).toEqual({
      id: expect.any(Number),
      name: 'Laptop',
      price: 1200,
    });
  });

  it('should return all products', () => {
    service.createProduct('Phone', 800);
    service.createProduct('Tablet', 500);
    const products = service.getAllProducts();

    expect(products).toHaveLength(2);
    expect(products[1].name).toBe('Tablet');
  });

  it("should only return the product with the specified ID", () => {
    const product1 = service.createProduct('Monitor', 300);
    const product2 = service.createProduct('Keyboard', 100);
    const foundProduct = service.getProductById(product1.id);
    expect(foundProduct).toEqual(product1);
  });

  it("should return undefined for a non-existent product", () => {
    const foundProduct = service.getProductById(999);
    expect(foundProduct).toBeUndefined();
  });

  it("should be deleted successfully", () => {
    const product = service.createProduct('Mouse', 50);
    const deleteResult = service.deleteProductById(product.id);
    expect(deleteResult).toBe(true);
    expect(service.getProductById(product.id)).toBeUndefined();
  });

  it("the product should be updated successfully", () => {
    const product = service.createProduct('Headphones', 150);
    const updatedProduct = service.updateProductById(product.id, 'Wireless Headphones', 200);
    expect(updatedProduct).toEqual({
      id: product.id,
      name: 'Wireless Headphones',
      price: 200,
    });
  }); 
});