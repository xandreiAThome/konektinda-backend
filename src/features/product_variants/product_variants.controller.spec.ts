import { Test, TestingModule } from '@nestjs/testing';
import { ProductVariantsController } from './product_variants.controller';
import { ProductVariantsService } from './product_variants.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';


const mockService = {
  getAllProductVariants: jest.fn(),
  getProductVariantById: jest.fn(),
  createProductVariant: jest.fn(),
  updateProductVariant: jest.fn(),
  deleteProductVariant: jest.fn()
}

describe('ProductVariantsController', () => {
  let controller: ProductVariantsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductVariantsController],
      providers: [{
        provide: ProductVariantsService,
        useValue: mockService
      }]
    }).compile();

    controller = module.get<ProductVariantsController>(ProductVariantsController);
    jest.clearAllMocks(); 
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /product-variants', () => {
    it('should return all product variants', async () => {
      const data = [
        {
          product_variant_id: 1,
          variant_name: 'Meat',
          product: { product_id: 1, product_name: 'Product 1' },
        },
        {
          product_variant_id: 2,
          variant_name: 'Vegetables',
          product: { product_id: 2, product_name: 'Product 2' },
        },
      ];
      mockService.getAllProductVariants.mockResolvedValue(data);

      const res = await controller.getAllProductVariants();

      expect(res).toEqual(data);
      expect(mockService.getAllProductVariants).toHaveBeenCalledWith(undefined);
    });

    it('should return filtered product variants by is_active', async () => {
      const data = [
        {
          product_variant_id: 1,
          variant_name: 'Meat',
          is_active: true,
          product: { product_id: 1, product_name: 'Product 1' },
        },
      ];
      mockService.getAllProductVariants.mockResolvedValue(data);

      const res = await controller.getAllProductVariants(true);

      expect(res).toEqual(data);
      expect(mockService.getAllProductVariants).toHaveBeenCalledWith(true);
    });
  });


  // Constant product variant used in tests below
  const valid = {
    product_variant_id: 1,
    product_id: 4,
    variant_name: '45 ml',
    stock: 9,
    price: 5.99,
    discount: 0,
    is_active: true,
    product: {
      product_id: 4,
      product_name: 'Test Product',
      category: {
        category_id: 1,
        category_name: 'Test Category',
      },
    },
  };

  describe('GET /product-variants/:id', () => {
    it('should return the correct product variant based on id', async () => {
      mockService.getProductVariantById.mockResolvedValue(valid);
      const res = await controller.getProductVariantById(1);
      expect(res).toEqual(valid);
      expect(mockService.getProductVariantById).toHaveBeenCalledWith(
        1,
        undefined,
      );
    });

    it('should return the correct product variant filtered by is_active', async () => {
      mockService.getProductVariantById.mockResolvedValue(valid);
      const res = await controller.getProductVariantById(1, true);
      expect(res).toEqual(valid);
      expect(mockService.getProductVariantById).toHaveBeenCalledWith(1, true);
    });

    it('should return a NotFoundException if variant does not exist', async () => {
      mockService.getProductVariantById.mockRejectedValueOnce(
        new NotFoundException('Product variant not found.'),
      );

      await expect(
        controller.getProductVariantById(-1),
      ).rejects.toThrow(new NotFoundException('Product variant not found.'));
    });
  });

  describe('POST /product-variants', () => {
    it('should create a new product variant', async () => {
      const createDto = {
        product_id: 4,
        variant_name: '45 ml',
        stock: 9,
        price: 5.99,
        discount: 0,
        is_active: true,
      };

      const createdVariant = {
        product_variant_id: 1,
        ...createDto,
      };

      mockService.createProductVariant.mockResolvedValueOnce(createdVariant);
      const res = await controller.createProductVariant(createDto);

      expect(res).toEqual(createdVariant);
      expect(mockService.createProductVariant).toHaveBeenCalledWith(createDto);
      expect(mockService.createProductVariant).toHaveBeenCalledTimes(1);
    });
  });

  describe('PATCH /product-variants/:id', () => {
    const update = {
      variant_name: 'The Undertaker',
    };
    const updatedVariant = {
      product_variant_id: 1,
      product_id: 4,
      variant_name: 'The Undertaker',
      stock: 9,
      price: 5.99,
      discount: 0,
      is_active: true,
    };

    it('should update an existing product variant', async () => {
      mockService.updateProductVariant.mockResolvedValueOnce(updatedVariant);
      const res = await controller.updateProductVariant(1, update);

      expect(res).toEqual(updatedVariant);
      expect(mockService.updateProductVariant).toHaveBeenCalledWith(1, update);
      expect(mockService.updateProductVariant).toHaveBeenCalledTimes(1);
    });

    it('should return a NotFoundException if variant does not exist', async () => {
      mockService.updateProductVariant.mockRejectedValueOnce(
        new NotFoundException('Product variant not found.'),
      );

      await expect(
        controller.updateProductVariant(-1, update),
      ).rejects.toThrow(new NotFoundException('Product variant not found.'));
    });
  });

  describe('DELETE /product-variants/:id', () => {
    it('should delete an existing product variant', async () => {
      mockService.deleteProductVariant.mockResolvedValueOnce(undefined);
      const res = await controller.deleteProductVariant(2);
      expect(res).toBeUndefined();
      expect(mockService.deleteProductVariant).toHaveBeenCalledWith(2);
      expect(mockService.deleteProductVariant).toHaveBeenCalledTimes(1);
    });

    it('should return a NotFoundException if variant does not exist', async () => {
      mockService.deleteProductVariant.mockRejectedValueOnce(
        new NotFoundException('Product variant not found.'),
      );

      await expect(controller.deleteProductVariant(-1)).rejects.toThrow(
        new NotFoundException('Product variant not found.'),
      );
    });
  });

});
