import { ProductsService } from './products.service';
import { NotFoundException } from '@nestjs/common';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(() => {
    service = new ProductsService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createProduct', () => {
    it('should create and return a new product', async () => {
      const dto = {
        product_category_id: 1,
        supplier_id: 2,
        product_name: 'Test Product',
      };

      const product = await service.createProduct(dto);

      expect(product).toMatchObject({
        product_id: 1,
        product_category_id: 1,
        supplier_id: 2,
        product_name: 'Test Product',
        product_description: '',
        is_active: true,
      });
    });
  });

  describe('getAllProducts', () => {
    it('should return all products', async () => {
      await service.createProduct({ product_category_id: 1, supplier_id: 2, product_name: 'A' });
      await service.createProduct({ product_category_id: 1, supplier_id: 2, product_name: 'B' });

      const products = await service.getAllProducts();
      expect(products.length).toBe(2);
      expect(products[0].product_name).toBe('A');
      expect(products[1].product_name).toBe('B');
    });
  });

  describe('getSingleProduct', () => {
    it('should return a product by id', async () => {
      const created = await service.createProduct({ product_category_id: 1, supplier_id: 2, product_name: 'Single' });
      const product = await service.getSingleProduct(created.product_id);
      expect(product.product_name).toBe('Single');
    });

    it('should throw NotFoundException if product does not exist', async () => {
      await expect(service.getSingleProduct(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateProduct', () => {
    it('should update a product partially', async () => {
      const created = await service.createProduct({ product_category_id: 1, supplier_id: 2, product_name: 'Old Name' });

      const updated = await service.updateProduct(created.product_id, { product_name: 'New Name' });
      expect(updated.product_name).toBe('New Name');
      expect(updated.product_category_id).toBe(1); // unchanged
    });

    it('should throw NotFoundException if product does not exist', async () => {
      await expect(service.updateProduct(999, { product_name: 'X' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      const created = await service.createProduct({ product_category_id: 1, supplier_id: 2, product_name: 'To Delete' });

      await service.deleteProduct(created.product_id);
      await expect(service.getSingleProduct(created.product_id)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if product does not exist', async () => {
      await expect(service.deleteProduct(999)).rejects.toThrow(NotFoundException);
    });
  });
});
