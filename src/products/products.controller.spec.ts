// products.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  beforeEach(async () => {
    const mockProductsService = {
      getAllProducts: jest.fn().mockReturnValue([
        { product_id: 1, product_category_id: 1, supplier_id: 1, product_name: "Kangkong", product_description: "Fresh", is_active: true },
        { product_id: 2, product_category_id: 2, supplier_id: 2, product_name: "Phone", product_description: "Smartphone", is_active: true },
      ]),

      getSingleProduct: jest.fn().mockImplementation((id: number) => ({
        product_id: id,
        product_name: 'Mock Product',
        product_description: 'Mock Description',
        is_active: true,
      })),

      createProduct: jest.fn().mockImplementation((name: string, price: number) => ({
        product_id: 3,
        product_name: name,
        product_description: 'Mock Description',
        is_active: true,
      })),

      updateProduct: jest
        .fn()
        .mockImplementation((id: number, name: string, price: number) => ({
          product_id: id,
          product_name: name,
          product_description: 'Mock Description',
          is_active: true,
        })),
        
      deleteProduct: jest.fn().mockImplementation((id: number) => ({
        message: `Product ${id} deleted successfully`,
      })),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [{ provide: ProductsService, useValue: mockProductsService }],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // ✅ Get all products
  it('should return all products', () => {
    const result = controller.getAllProducts();
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('Phone');
    expect(service.getAllProducts).toHaveBeenCalled();
  });

  // ✅ Get single product by ID
  it('should return a single product by id', () => {
    const result = controller.getSingleProduct('1');
    expect(result).toEqual({
      id: 1,
      name: 'Mock Product',
      price: 999,
    });
    expect(service.getSingleProduct).toHaveBeenCalledWith(1);
  });

  // ✅ Create a product
  it('should create and return a new product', () => {
    const result = controller.createProduct('Tablet', 500);
    expect(result).toEqual({
      id: 3,
      name: 'Tablet',
      price: 500,
    });
    expect(service.createProduct).toHaveBeenCalledWith('Tablet', 500);
  });

  // ✅ Update product by ID
  it('should update and return the updated product', () => {
    const result = controller.updateProduct('1', 'Updated Product', 1500);
    expect(result).toEqual({
      id: 1,
      name: 'Updated Product',
      price: 1500,
    });
    expect(service.updateProduct).toHaveBeenCalledWith(1, 'Updated Product', 1500);
  });

  // ✅ Delete product by ID
  it('should delete a product and return confirmation', () => {
    const result = controller.deleteProduct('1');
    expect(result).toEqual({
      message: 'Product 1 deleted successfully',
    });
    expect(service.deleteProduct).toHaveBeenCalledWith(1);
  });
});
