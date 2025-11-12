import { Test, TestingModule } from '@nestjs/testing';
import { ProductVariantsService } from './product_variants.service';
import { db } from 'database';
import { NotFoundException } from '@nestjs/common';

// Mock needed drizzle functions
jest.mock('database', () => ({
  db: {
    query: {
      product_variants: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
      },
    },
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('ProductVariantsService', () => {
  let service: ProductVariantsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductVariantsService],
    }).compile();

    service = module.get<ProductVariantsService>(ProductVariantsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllProductVariants', () => {
    it('should return all product variants', async () => {
      const allProductVariants = [
        {
          product_variant_id: 1,
          product_id: 1,
          variant_name: '24 ml',
          stock: 8,
          price: 4.99,
          discount: 20,
          is_active: true,
          product: {
            product_id: 1,
            product_name: 'Test Product',
            category: {
              category_id: 1,
              category_name: 'Test Category',
            },
          },
        },
        {
          product_variant_id: 2,
          product_id: 1,
          variant_name: '44 ml',
          stock: 23,
          price: 8.99,
          discount: 15,
          is_active: true,
          product: {
            product_id: 1,
            product_name: 'Test Product',
            category: {
              category_id: 1,
              category_name: 'Test Category',
            },
          },
        },
      ];

      (db.query.product_variants.findMany as jest.Mock).mockResolvedValueOnce(
        allProductVariants,
      );

      const results = await service.getAllProductVariants();

      expect(results).toEqual(allProductVariants);
      expect(db.query.product_variants.findMany).toHaveBeenCalled();
    });

    it('should return filtered product variants by is_active', async () => {
      const activeVariants = [
        {
          product_variant_id: 1,
          product_id: 1,
          variant_name: '24 ml',
          stock: 8,
          price: 4.99,
          discount: 20,
          is_active: true,
          product: {
            product_id: 1,
            product_name: 'Test Product',
            category: {
              category_id: 1,
              category_name: 'Test Category',
            },
          },
        },
      ];

      (db.query.product_variants.findMany as jest.Mock).mockResolvedValueOnce(
        activeVariants,
      );

      const results = await service.getAllProductVariants(true);

      expect(results).toEqual(activeVariants);
      expect(db.query.product_variants.findMany).toHaveBeenCalled();
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

  describe('getProductVariantById', () => {
    it('should return a product variant by id', async () => {
      (db.query.product_variants.findFirst as jest.Mock).mockResolvedValueOnce(
        valid,
      );

      const result = await service.getProductVariantById(1);

      expect(result).toEqual(valid);
      expect(db.query.product_variants.findFirst).toHaveBeenCalled();
    });

    it('returns NotFoundException if variant id does not exist', async () => {
      (db.query.product_variants.findFirst as jest.Mock).mockResolvedValueOnce(
        undefined,
      );

      await expect(service.getProductVariantById(-1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return a product variant filtered by is_active', async () => {
      (db.query.product_variants.findFirst as jest.Mock).mockResolvedValueOnce(
        valid,
      );

      const result = await service.getProductVariantById(1, true);

      expect(result).toEqual(valid);
      expect(db.query.product_variants.findFirst).toHaveBeenCalled();
    });
  });

  describe('createProductVariants', () => {
    it('returns new product variant upon successful creation', async () => {
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

      const mockChain = {
        values: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValueOnce([createdVariant]),
      };
      (db.insert as jest.Mock).mockReturnValueOnce(mockChain);

      const result = await service.createProductVariant(createDto);

      expect(result).toEqual(createdVariant);
      expect(db.insert).toHaveBeenCalled();
      expect(mockChain.values).toHaveBeenCalled();
      expect(mockChain.returning).toHaveBeenCalled();
    });
  });

  describe('updateProductVariants', () => {
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
      const mockChain = {
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValueOnce([updatedVariant]),
      };
      (db.update as jest.Mock).mockReturnValueOnce(mockChain);

      const result = await service.updateProductVariant(1, update);

      expect(result).toEqual(updatedVariant);
      expect(db.update).toHaveBeenCalled();
      expect(mockChain.set).toHaveBeenCalled();
      expect(mockChain.where).toHaveBeenCalled();
      expect(mockChain.returning).toHaveBeenCalled();
    });

    it('should throw a NotFoundException if variant id does not exist', async () => {
      const mockChain = {
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValueOnce([]),
      };
      (db.update as jest.Mock).mockReturnValueOnce(mockChain);

      await expect(service.updateProductVariant(-1, update)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteProductVariant', () => {
    it('should delete an existing product variant', async () => {
      const deletedVariant = {
        product_variant_id: 1,
        product_id: 4,
        variant_name: '45 ml',
        stock: 9,
        price: 5.99,
        discount: 0,
        is_active: true,
      };

      const mockChain = {
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValueOnce([deletedVariant]),
      };
      (db.delete as jest.Mock).mockReturnValueOnce(mockChain);

      const result = await service.deleteProductVariant(1);

      expect(result).toBeUndefined();
      expect(db.delete).toHaveBeenCalled();
      expect(mockChain.where).toHaveBeenCalled();
      expect(mockChain.returning).toHaveBeenCalled();
    });

    it('should throw a NotFoundException if variant id does not exist', async () => {
      const mockChain = {
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValueOnce([]),
      };
      (db.delete as jest.Mock).mockReturnValueOnce(mockChain);

      await expect(service.deleteProductVariant(-1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
