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
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllProducts', () => {
    it('should return all products', async () => {
      const result = [{ product_id: 1, product_name: 'Test' }];
      mockProductsService.getAllProducts.mockResolvedValue(result);

      expect(await controller.getAllProducts()).toBe(result);
      expect(mockProductsService.getAllProducts).toHaveBeenCalled();
    });
  });

  describe('getSingleProduct', () => {
    it('should return a single product by id', async () => {
      const result = { product_id: 1, product_name: 'Single' };
      mockProductsService.getSingleProduct.mockResolvedValue(result);

      expect(await controller.getSingleProduct(1)).toBe(result);
      expect(mockProductsService.getSingleProduct).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if product does not exist', async () => {
      mockProductsService.getSingleProduct.mockRejectedValue(new NotFoundException());
      await expect(controller.getSingleProduct(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createProduct', () => {
    it('should create and return a product', async () => {
      const dto = { product_category_id: 1, supplier_id: 2, product_name: 'New' };
      const result = { product_id: 1, ...dto, product_description: '', is_active: true };
      mockProductsService.createProduct.mockResolvedValue(result);

      expect(await controller.createProduct(dto)).toBe(result);
      expect(mockProductsService.createProduct).toHaveBeenCalledWith(dto);
    });
  });

  describe('updateProduct', () => {
    it('should update and return a product', async () => {
      const dto = { product_name: 'Updated' };
      const result = { product_id: 1, product_name: 'Updated' };
      mockProductsService.updateProduct.mockResolvedValue(result);

      expect(await controller.updateProduct(1, dto)).toBe(result);
      expect(mockProductsService.updateProduct).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      mockProductsService.deleteProduct.mockResolvedValue(undefined);

      expect(await controller.deleteProduct(1)).toBeUndefined();
      expect(mockProductsService.deleteProduct).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if product does not exist', async () => {
      mockProductsService.deleteProduct.mockRejectedValue(new NotFoundException());
      await expect(controller.deleteProduct(999)).rejects.toThrow(NotFoundException);
    });
  });
});
