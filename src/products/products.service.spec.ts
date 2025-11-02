// src/products/products.service.spec.ts
import { ProductsService } from './products.service';
import { NotFoundException } from '@nestjs/common';
import { db } from 'database';
import { products } from 'db/schema';
import { eq } from 'drizzle-orm';
import { CreateProductsDto } from './dto/createproducts.dto';

jest.mock('database', () => ({
  db: {
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
      const allProducts = [{ product_id: 1, product_name: 'A' }, { product_id: 2, product_name: 'B' }];

      (db.select as jest.Mock).mockReturnValueOnce({
        from: jest.fn().mockResolvedValueOnce(allProducts),
      });

      const result = await service.getAllProducts();
      expect(result).toEqual(allProducts);
      expect(db.select).toHaveBeenCalled();
    });
  });

  describe('getSingleProduct', () => {
    it('should return a product by id', async () => {
      const product = { product_id: 1, product_name: 'Single' };

      (db.select as jest.Mock).mockReturnValueOnce({
        from: jest.fn().mockReturnValueOnce({
          where: jest.fn().mockResolvedValueOnce([product]),
        }),
      });

      const result = await service.getSingleProduct(1);
      expect(result).toEqual(product);
    });

    it('should throw NotFoundException if product not found', async () => {
      (db.select as jest.Mock).mockReturnValueOnce({
        from: jest.fn().mockReturnValueOnce({
          where: jest.fn().mockResolvedValueOnce([]),
        }),
      });

      await expect(service.getSingleProduct(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateProduct', () => {
    it('should update and return a product', async () => {
      const updatedProduct = { product_id: 1, product_name: 'Updated' };
      (db.update as jest.Mock).mockReturnValueOnce({
        set: jest.fn().mockReturnValueOnce({
          where: jest.fn().mockReturnValueOnce({
            returning: jest.fn().mockResolvedValueOnce([updatedProduct]),
          }),
        }),
      });

      const result = await service.updateProduct(1, { product_name: 'Updated' });
      expect(result).toEqual(updatedProduct);
    });

    it('should throw NotFoundException if product not found', async () => {
      (db.update as jest.Mock).mockReturnValueOnce({
        set: jest.fn().mockReturnValueOnce({
          where: jest.fn().mockReturnValueOnce({
            returning: jest.fn().mockResolvedValueOnce([]),
          }),
        }),
      });

      await expect(service.updateProduct(999, { product_name: 'X' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      (db.delete as jest.Mock).mockReturnValueOnce({
        where: jest.fn().mockReturnValueOnce({
          returning: jest.fn().mockResolvedValueOnce([{}]),
        }),
      });

      await expect(service.deleteProduct(1)).resolves.toBeUndefined();
    });

    it('should throw NotFoundException if product not found', async () => {
      (db.delete as jest.Mock).mockReturnValueOnce({
        where: jest.fn().mockReturnValueOnce({
          returning: jest.fn().mockResolvedValueOnce([]),
        }),
      });

      await expect(service.deleteProduct(999)).rejects.toThrow(NotFoundException);
    });
  });
});
