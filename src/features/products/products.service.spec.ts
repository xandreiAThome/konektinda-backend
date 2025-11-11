// src/products/products.service.spec.ts
import { ProductsService } from './products.service';
import { NotFoundException } from '@nestjs/common';
import { db } from 'database';
import { products } from 'db/schema';
import { CreateProductsDto } from './dto/createproducts.dto';

jest.mock('database', () => ({
  db: {
    query: {
      products: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
      },
    },
    insert: jest.fn(),
    select: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('ProductsService (Drizzle ORM)', () => {
  let service: ProductsService;

  beforeEach(() => {
    service = new ProductsService();
    jest.clearAllMocks();
  });

  describe('createProduct', () => {
    it('should insert a product and return it', async () => {
      const dto: CreateProductsDto = {
        product_category_id: 1,
        supplier_id: 2,
        product_name: 'Test',
        product_description: null,
        is_active: true,
      };
      const newProduct = { product_id: 1, ...dto };

      (db.insert as jest.Mock).mockReturnValueOnce({
        values: jest.fn().mockReturnValueOnce({
          returning: jest.fn().mockResolvedValueOnce([newProduct]),
        }),
      });

      const result = await service.createProduct(dto);
      expect(result).toEqual(newProduct);
      expect(db.insert).toHaveBeenCalledWith(products);
    });
  });

  describe('getAllProducts', () => {
    it('should return all products', async () => {
      const allProducts = [
        {
          product_id: 1,
          product_name: 'Product A',
          category: { category_id: 1, category_name: 'Category 1' },
          variants: [{ product_variant_id: 1, variant_name: 'Variant 1' }],
        },
        {
          product_id: 2,
          product_name: 'Product B',
          category: { category_id: 2, category_name: 'Category 2' },
          variants: [{ product_variant_id: 2, variant_name: 'Variant 2' }],
        },
      ];

      (db.query.products.findMany as jest.Mock).mockResolvedValueOnce(
        allProducts,
      );

      const result = await service.getAllProducts();
      expect(result).toEqual(allProducts);
      expect(db.query.products.findMany).toHaveBeenCalled();
    });
  });

  describe('getSingleProduct', () => {
    it('should return a product by id', async () => {
      const product = {
        product_id: 1,
        product_name: 'Single Product',
        category: { category_id: 1, category_name: 'Category 1' },
        variants: [{ product_variant_id: 1, variant_name: 'Variant 1' }],
      };

      (db.query.products.findFirst as jest.Mock).mockResolvedValueOnce(product);

      const result = await service.getSingleProduct(1);
      expect(result).toEqual(product);
      expect(db.query.products.findFirst).toHaveBeenCalled();
    });

    it('should throw NotFoundException if product not found', async () => {
      (db.query.products.findFirst as jest.Mock).mockResolvedValueOnce(
        undefined,
      );

      await expect(service.getSingleProduct(999)).rejects.toThrow(
        NotFoundException,
      );
      expect(db.query.products.findFirst).toHaveBeenCalled();
    });
  });

  describe('updateProduct', () => {
    it('should update and return a product', async () => {
      const updatedProduct = { product_id: 1, product_name: 'Updated' };

      const mockChain = {
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValueOnce([updatedProduct]),
      };
      (db.update as jest.Mock).mockReturnValueOnce(mockChain);

      const result = await service.updateProduct(1, { product_name: 'Updated' });
      expect(result).toEqual(updatedProduct);
      expect(db.update).toHaveBeenCalled();
      expect(mockChain.set).toHaveBeenCalled();
      expect(mockChain.where).toHaveBeenCalled();
      expect(mockChain.returning).toHaveBeenCalled();
    });

    it('should throw NotFoundException if product not found', async () => {
      const mockChain = {
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValueOnce([]),
      };
      (db.update as jest.Mock).mockReturnValueOnce(mockChain);

      await expect(
        service.updateProduct(999, { product_name: 'X' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      const mockChain = {
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValueOnce([{ product_id: 1 }]),
      };
      (db.delete as jest.Mock).mockReturnValueOnce(mockChain);

      await expect(service.deleteProduct(1)).resolves.toBeUndefined();
      expect(db.delete).toHaveBeenCalled();
      expect(mockChain.where).toHaveBeenCalled();
      expect(mockChain.returning).toHaveBeenCalled();
    });

    it('should throw NotFoundException if product not found', async () => {
      const mockChain = {
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValueOnce([]),
      };
      (db.delete as jest.Mock).mockReturnValueOnce(mockChain);

      await expect(service.deleteProduct(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
