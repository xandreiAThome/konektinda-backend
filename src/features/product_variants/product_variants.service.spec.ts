import { Test, TestingModule } from '@nestjs/testing';
import { ProductVariantsService } from './product_variants.service';
import { db } from 'database';
import { NotFoundException } from '@nestjs/common';

// Mock needed drizzle functions
jest.mock('database', () => ({
  db: {
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
        },
        {
          product_variant_id: 2,
          product_id: 1,
          variant_name: '44 ml',
          stock: 23,
          price: 8.99,
          discount: 15,
          is_active: true,
        },
      ];

      (db.select as jest.Mock).mockReturnValueOnce({
        from: jest.fn().mockReturnValueOnce({
          where: jest.fn().mockResolvedValueOnce(allProductVariants),
        }),
      });

      const results = await service.getAllProductVariants();

      expect(results).toEqual(allProductVariants);
      expect(db.select).toHaveBeenCalled();
    });
  });

  // Constant product variant used in tests below
  const valid = {
    product_id: 4,
    variant_name: '45 ml',
    stock: 9,
    price: 5.99,
    discount: 0,
    is_active: true,
  };

  describe('getProductVariantById', () => {
    it('should return a product variant by id', async () => {
      (db.select as jest.Mock).mockReturnValue({
        from: jest.fn().mockReturnValueOnce({
          where: jest.fn().mockResolvedValueOnce([valid]),
        }),
      });

      const result = await service.getProductVariantById(1);

      expect(result).toEqual(valid);
      expect(db.select).toHaveBeenCalled();
    });

    it('returns NotFoundException if variant id does not exist', async () => {
      (db.select as jest.Mock).mockReturnValue({
        from: jest.fn().mockReturnValueOnce({
          where: jest.fn().mockResolvedValueOnce([]),
        }),
      });

      await expect(service.getProductVariantById(-1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createProductVariants', () => {
    it('returns new product variant upon successful creation', async () => {
      (db.insert as jest.Mock).mockReturnValueOnce({
        values: jest.fn().mockReturnValueOnce({
          returning: jest
            .fn()
            .mockResolvedValueOnce([{ product_variant_id: 1, ...valid }]),
        }),
      });

      const result = await service.createProductVariant(valid);

      expect(result).toEqual({ product_variant_id: 1, ...valid });
      expect(db.insert).toHaveBeenCalled();
    });
  });

  describe('updateProductVariants', () => {
    const update = {
      variant_name: 'The Undertaker',
    };
    const updatedVariant = {
      product_variant_id: 1,
      ...valid,
      ...update,
    };

    it('should update an existing product variant', async () => {
      (db.update as jest.Mock).mockReturnValueOnce({
        set: jest.fn().mockReturnValueOnce({
          where: jest.fn().mockReturnValueOnce({
            returning: jest.fn().mockResolvedValueOnce([updatedVariant]),
          }),
        }),
      });

      const result = await service.updateProductVariant(2, update);

      expect(result).toEqual(updatedVariant);
      expect(db.update).toHaveBeenCalled();
    });

    it('should throw a NotFoundException if variant id does not exist', async () => {
      (db.update as jest.Mock).mockReturnValueOnce({
        set: jest.fn().mockReturnValueOnce({
          where: jest.fn().mockReturnValueOnce({
            returning: jest.fn().mockResolvedValueOnce([]),
          }),
        }),
      });

      await expect(service.updateProductVariant(-1, update)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteProductVariant', () => {
    it('should delete an existing product variant', async () => {
      (db.delete as jest.Mock).mockReturnValueOnce({
        where: jest.fn().mockReturnValueOnce({
          returning: jest.fn().mockResolvedValueOnce([valid]),
        }),
      });

      const result = await service.deleteProductVariant(1);

      expect(result).toBeUndefined();
      expect(db.delete).toHaveBeenCalled();
    });

    it('should throw a NotFoundException if variant id does not exist', async () => {
      (db.delete as jest.Mock).mockReturnValueOnce({
        where: jest.fn().mockReturnValueOnce({
          returning: jest.fn().mockResolvedValueOnce([]),
        }),
      });

      await expect(service.deleteProductVariant).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
