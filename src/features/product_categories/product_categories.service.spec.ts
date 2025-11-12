import { Test, TestingModule } from '@nestjs/testing';
import { ProductCategoriesService } from './product_categories.service';
import { db } from 'database';
import { NotFoundException } from '@nestjs/common';

// Mock needed drizzle functions
jest.mock('database', () => ({
  db: {
    query: {
      product_categories: {
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

describe('ProductCategoriesService', () => {
  let service: ProductCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductCategoriesService],
    }).compile();

    service = module.get<ProductCategoriesService>(ProductCategoriesService);
    jest.clearAllMocks(); // ✅ ensure a clean mock state before every test
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllProductCategories', () => {
    it('should return all product categories', async () => {
      const allProductCategories = [
        { product_category_id: 1, category_name: 'Meat' },
        { product_category_id: 2, category_name: 'Vegetables' },
        { product_category_id: 3, category_name: 'Fruits' },
      ];

      (db.query.product_categories.findMany as jest.Mock).mockResolvedValueOnce(
        allProductCategories,
      );

      const results = await service.getAllProductCategories();

      expect(results).toEqual(allProductCategories);
      expect(db.query.product_categories.findMany).toHaveBeenCalled();
    });
  });

  describe('getProductCategoryById', () => {
    it('should return a product category by id', async () => {
      const category = {
        product_category_id: 2,
        category_name: 'Vegetables',
      };

      (
        db.query.product_categories.findFirst as jest.Mock
      ).mockResolvedValueOnce(category);

      const result = await service.getProductCategoryById(2);

      expect(result).toEqual(category);
      expect(db.query.product_categories.findFirst).toHaveBeenCalled();
    });

    it('returns NotFoundException if category id does not exist', async () => {
      (
        db.query.product_categories.findFirst as jest.Mock
      ).mockResolvedValueOnce(undefined);

      await expect(service.getProductCategoryById(-1)).rejects.toThrow(
        NotFoundException,
      );
      expect(db.query.product_categories.findFirst).toHaveBeenCalled();
    });
  });

  describe('createProductCategory', () => {
    it('creates a new product category', async () => {
      const categoryName = {
        category_name: 'Hulk Hogan',
      };
      const newProductCategory = {
        product_category_id: 5,
        category_name: 'Hulk Hogan',
      };

      const mockChain = {
        values: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValueOnce([newProductCategory]),
      };
      (db.insert as jest.Mock).mockReturnValueOnce(mockChain);

      const result = await service.createProductCategory(categoryName);

      expect(result).toEqual(newProductCategory);
      expect(db.insert).toHaveBeenCalled();
      expect(mockChain.values).toHaveBeenCalled();
      expect(mockChain.returning).toHaveBeenCalled();
    });
  });

  describe('updateProductCategory', () => {
    it('should update an existing product category', async () => {
      const newName = {
        category_name: 'John Cena',
      };
      const updatedCategory = {
        product_category_id: 2,
        category_name: 'John Cena',
      };

      const mockChain = {
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValueOnce([updatedCategory]),
      };
      (db.update as jest.Mock).mockReturnValueOnce(mockChain);

      const result = await service.updateProductCategory(2, newName);

      expect(result).toEqual(updatedCategory);
      expect(db.update).toHaveBeenCalled();
      expect(mockChain.set).toHaveBeenCalled();
      expect(mockChain.where).toHaveBeenCalled();
      expect(mockChain.returning).toHaveBeenCalled();
    });

    it('should throw a NotFoundException if category id does not exist', async () => {
      const newName = {
        category_name: 'John Cena',
      };

      const mockChain = {
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValueOnce([]),
      };
      (db.update as jest.Mock).mockReturnValueOnce(mockChain);

      await expect(service.updateProductCategory(-1, newName)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteProductCategory', () => {
    it('should delete an existing product category', async () => {
      const deletedCategory = {
        product_category_id: 1,
        category_name: 'Randy Orton',
      };

      const mockChain = {
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValueOnce([deletedCategory]),
      };
      (db.delete as jest.Mock).mockReturnValueOnce(mockChain);

      const result = await service.deleteProductCategory(1);

      expect(result).toBeUndefined();
      expect(db.delete).toHaveBeenCalled();
      expect(mockChain.where).toHaveBeenCalled();
      expect(mockChain.returning).toHaveBeenCalled();
    });

    it('should throw a NotFoundException if category id does not exist', async () => {
      const mockChain = {
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValueOnce([]),
      };
      (db.delete as jest.Mock).mockReturnValueOnce(mockChain);

      await expect(service.deleteProductCategory(-1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
