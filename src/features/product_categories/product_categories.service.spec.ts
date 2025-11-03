import { Test, TestingModule } from '@nestjs/testing';
import { ProductCategoriesService } from './product_categories.service';
import { db } from 'database';
import { NotFoundException } from '@nestjs/common';


// Mock needed drizzle functions
jest.mock('database', () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  }
}))

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
        { product_category_id: 1, category_name: "Meat"},
        { product_category_id: 2, category_name: "Vegetables"},
        { product_category_id: 3, category_name: "Fruits"},
      ];

      (db.select as jest.Mock).mockReturnValue({
        from: jest.fn().mockResolvedValue(allProductCategories)
      });
      const results = await service.getAllProductCategories();
      
      expect(results).toEqual(allProductCategories);
      expect(db.select).toHaveBeenCalled();
    })
  })

  describe('getProductCategoryById', () => {
    it('should return a product category by id', async () => {
      const category = { product_category_id: 2, category_name: "Vegetables"};

      (db.select as jest.Mock).mockReturnValue({
        from: jest.fn().mockReturnValueOnce({
          where: jest.fn().mockResolvedValueOnce([category])
        })
      });

      const result = await service.getProductCategoryById(2);

      expect(result).toEqual(category);
      expect(db.select).toHaveBeenCalled();
    })

    it('returns NotFoundException if category id does not exist', async () => {
      (db.select as jest.Mock).mockReturnValue({
        from: jest.fn().mockReturnValueOnce({
          where: jest.fn().mockResolvedValueOnce([])
        })
      });

      await expect(service.getProductCategoryById(-1))
      .rejects
      .toThrow(NotFoundException);
    })
  })

  describe('createProductCategory', () => {
    it('creates a new product category', async () => {
      const categoryName = {
        category_name: 'Hulk Hogan'
      };
      const newProductCategory = { 
        product_category_id: 5, 
        category_name: categoryName 
      };

      (db.insert as jest.Mock).mockReturnValueOnce({
        values: jest.fn().mockReturnValueOnce({
          returning: jest.fn().mockResolvedValueOnce([newProductCategory])
        })
      });

      const result = await service.createProductCategory(categoryName);

      expect(result).toEqual(newProductCategory);
      expect(db.insert).toHaveBeenCalled();

    })   
  })

  describe('updateProductCategory', () => {
    it('should update an existing product category', async () => {
      const newName =  {
        category_name: 'John Cena'
      };
      const updatedCategory = { product_category_id: 2, newName };

      (db.update as jest.Mock).mockReturnValueOnce({
        set: jest.fn().mockReturnValueOnce({
          where: jest.fn().mockReturnValueOnce({
            returning: jest.fn().mockResolvedValueOnce([updatedCategory])
          })
        })
      });

      const result = await service.updateProductCategory(2, newName);

      expect(result).toEqual(updatedCategory);
      expect(db.update).toHaveBeenCalled();

    }) 

    it('should throw a NotFoundException if category id does not exist', async () => {
      (db.update as jest.Mock).mockReturnValueOnce({
        set: jest.fn().mockReturnValueOnce({
          where: jest.fn().mockReturnValueOnce({
            returning: jest.fn().mockResolvedValueOnce([])
          })
        })
      });

      await expect(service.updateProductCategory)
      .rejects
      .toThrow(NotFoundException);
    })
  })

  describe('deleteProductCategory', () => {
    it('should delete an existing product category', async () => {
      const deletedCategory = {
        product_category_id: 1,
        category_name: 'Randy Orton'
      };

      (db.delete as jest.Mock).mockReturnValueOnce({
        where: jest.fn().mockReturnValueOnce({
          returning: jest.fn().mockResolvedValueOnce([deletedCategory])
        })
      });

      const result = await service.deleteProductCategory(1);
      
      expect(result).toBeUndefined();
      expect(db.delete).toHaveBeenCalled();
    })
    
  })
});
