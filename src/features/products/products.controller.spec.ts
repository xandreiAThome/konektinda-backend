// src/products/products.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { NotFoundException } from '@nestjs/common';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProductsService = {
    getAllProducts: jest.fn(),
    getSingleProduct: jest.fn(),
    createProduct: jest.fn(),
    updateProduct: jest.fn(),
    deleteProduct: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [{ provide: ProductsService, useValue: mockProductsService }],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);

    jest.clearAllMocks(); // reset mocks before each test
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllProducts', () => {
    it('should return an array of products', async () => {
      const products = [{ product_id: 1, product_name: 'Test Product' }];
      mockProductsService.getAllProducts.mockResolvedValue(products);

      const result = await controller.getAllProducts();
      expect(result).toBe(products);
      expect(mockProductsService.getAllProducts).toHaveBeenCalled();
    });
  });

  describe('getSingleProduct', () => {
    it('should return a product by id', async () => {
      const product = { product_id: 1, product_name: 'Single Product' };
      mockProductsService.getSingleProduct.mockResolvedValue(product);

      const result = await controller.getSingleProduct(1);
      expect(result).toBe(product);
      expect(mockProductsService.getSingleProduct).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if product not found', async () => {
      mockProductsService.getSingleProduct.mockRejectedValue(new NotFoundException());

      await expect(controller.getSingleProduct(999)).rejects.toThrow(NotFoundException);
      expect(mockProductsService.getSingleProduct).toHaveBeenCalledWith(999);
    });
  });

  describe('createProduct', () => {
    it('should create and return a product', async () => {
      const dto = { product_category_id: 1, supplier_id: 2, product_name: 'New Product' };
      const createdProduct = { product_id: 1, ...dto, product_description: '', is_active: true };
      mockProductsService.createProduct.mockResolvedValue(createdProduct);

      const result = await controller.createProduct(dto);
      expect(result).toBe(createdProduct);
      expect(mockProductsService.createProduct).toHaveBeenCalledWith(dto);
    });
  });

  describe('updateProduct', () => {
    it('should update and return a product', async () => {
      const dto = { product_name: 'Updated Name' };
      const updatedProduct = { product_id: 1, product_name: 'Updated Name' };
      mockProductsService.updateProduct.mockResolvedValue(updatedProduct);

      const result = await controller.updateProduct(1, dto);
      expect(result).toBe(updatedProduct);
      expect(mockProductsService.updateProduct).toHaveBeenCalledWith(1, dto);
    });

    it('should throw NotFoundException if product not found', async () => {
      const dto = { product_name: 'Updated Name' };
      mockProductsService.updateProduct.mockRejectedValue(new NotFoundException());

      await expect(controller.updateProduct(999, dto)).rejects.toThrow(NotFoundException);
      expect(mockProductsService.updateProduct).toHaveBeenCalledWith(999, dto);
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      mockProductsService.deleteProduct.mockResolvedValue(undefined);

      const result = await controller.deleteProduct(1);
      expect(result).toBeUndefined();
      expect(mockProductsService.deleteProduct).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if product not found', async () => {
      mockProductsService.deleteProduct.mockRejectedValue(new NotFoundException());

      await expect(controller.deleteProduct(999)).rejects.toThrow(NotFoundException);
      expect(mockProductsService.deleteProduct).toHaveBeenCalledWith(999);
    });
  });
});
