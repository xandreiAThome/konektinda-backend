import { Test, TestingModule } from '@nestjs/testing';
import { ProductCategoriesController } from './product_categories.controller';
import { ProductCategoriesService } from './product_categories.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockService = {
  getAllProductCategories: jest.fn(),
  getProductCategoryById: jest.fn(),
  createProductCategory: jest.fn(),
  updateProductCategory: jest.fn(),
  deleteProductCategory: jest.fn(),
};

describe('ProductCategoriesController', () => {
  let controller: ProductCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductCategoriesController],
      providers: [
        {
          provide: ProductCategoriesService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ProductCategoriesController>(
      ProductCategoriesController,
    );
    jest.clearAllMocks(); // ✅ ensure a clean mock state before every test
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /product-categories', () => {
    it('should return all product categories', async () => {
      const data = [
        { product_category_id: 1, category_name: 'Meat' },
        { product_category_id: 2, category_name: 'Vegetables' },
      ];
      mockService.getAllProductCategories.mockResolvedValue(data);

      const res = await controller.getAllProductCategories();

      expect(res).toEqual(data);
      expect(mockService.getAllProductCategories).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /product-categories/:id', () => {
    it('should return the correct product category based on id', async () => {
      const data = [{ product_category_id: 1, category_name: 'Meat' }];
      mockService.getProductCategoryById.mockResolvedValue(data);

      const res = await controller.getProductCategoryById(1);

      expect(res).toEqual(data);
      expect(mockService.getProductCategoryById).toHaveBeenCalledTimes(1);
    });

    it('should return a NotFoundException if category does not exist', async () => {
      mockService.getProductCategoryById.mockRejectedValueOnce(
        new NotFoundException('Product category not found.'),
      );

      await expect(controller.getProductCategoryById(-1)).rejects.toThrow(
        new NotFoundException('Product category not found.'),
      );
    });
  });

  describe('POST /product-categories', () => {
    it('should create a new product category', async () => {
      const dto = {
        category_name: 'Rey Mysterio',
      };

      const newCategory = {
        product_category_id: 2,
        ...dto,
      };

      mockService.createProductCategory.mockResolvedValueOnce(newCategory);
      const res = await controller.createProductCategory(dto);

      expect(res).toEqual(newCategory);
      expect(mockService.createProductCategory).toHaveBeenCalledTimes(1);
    });
  });

  describe('PATCH /product-categories/:id', () => {
    it('should update an existing product category', async () => {
      const dto = {
        category_name: 'Stone Cold',
      };

      const updatedCategory = {
        product_category_id: 2,
        ...dto,
      };
      mockService.updateProductCategory.mockResolvedValueOnce(updatedCategory);
      const res = await controller.updateProductCategory(1, dto);

      expect(res).toEqual(updatedCategory);
      expect(mockService.updateProductCategory).toHaveBeenCalledTimes(1);
    });

    it('should return a NotFoundException if category does not exist', async () => {
      const dto = {
        category_name: 'Stone Cold',
      };

      const updatedCategory = {
        product_category_id: -1,
        ...dto,
      };

      mockService.updateProductCategory.mockRejectedValueOnce(
        new NotFoundException('Product category not found.'),
      );

      await expect(controller.updateProductCategory(-1, dto)).rejects.toThrow(
        new NotFoundException('Product category not found.'),
      );
    });
  });

  describe('DELETE /product-categories/:id', () => {
    it('should delete an existing product category', async () => {
      mockService.deleteProductCategory.mockResolvedValueOnce(undefined);
      const res = await controller.deleteProductCategory(2);

      expect(res).toBeUndefined();
      expect(mockService.deleteProductCategory).toHaveBeenCalledTimes(1);
    });

    it('should return a NotFoundException if category does not exist', async () => {
      mockService.deleteProductCategory.mockRejectedValueOnce(
        new NotFoundException('Product category not found.'),
      );

      await expect(controller.deleteProductCategory(-1)).rejects.toThrow(
        new NotFoundException('Product category not found.'),
      );
    });
  });
});
