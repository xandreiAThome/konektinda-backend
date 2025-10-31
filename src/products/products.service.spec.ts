import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { CreateProductsDto } from './dto/createproducts.dto';
import { UpdateProductsDto } from './dto/updateprodcuts.dto';
import { NotFoundException } from '@nestjs/common';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createProduct', () => {
    it('should create and return a product', () => {
      const createDto: CreateProductsDto = {
        product_category_id: 1,
        supplier_id: 1,
        product_name: 'Kangkong',
        product_description: 'Fresh vegetables',
        is_active: true,
      };

      const product = service.createProduct(createDto);

      expect(product).toEqual({
        product_id: expect.any(Number),
        product_category_id: 1,
        supplier_id: 1,
        product_name: 'Kangkong',
        product_description: 'Fresh vegetables',
        is_active: true,
      });
      expect(product.product_id).toBe(1);
    });

    it('should create product with default values when optional fields are omitted', () => {
      const createDto: CreateProductsDto = {
        product_category_id: 1,
        supplier_id: 1,
        product_name: 'Tomato',
        product_description: '',
        is_active: false,
      };

      const product = service.createProduct(createDto);

      expect(product.product_description).toBe('');
      expect(product.is_active).toBe(false);
    });

    it('should increment product_id for each new product', () => {
      const createDto1: CreateProductsDto = {
        product_category_id: 1,
        supplier_id: 1,
        product_name: 'Product 1',
        product_description: 'Description 1',
        is_active: true,
      };

      const createDto2: CreateProductsDto = {
        product_category_id: 2,
        supplier_id: 2,
        product_name: 'Product 2',
        product_description: 'Description 2',
        is_active: false,
      };

      const product1 = service.createProduct(createDto1);
      const product2 = service.createProduct(createDto2);

      expect(product1.product_id).toBe(1);
      expect(product2.product_id).toBe(2);
    });
  });

  describe('getAllProducts', () => {
    it('should return all products', () => {
      const createDto1: CreateProductsDto = {
        product_category_id: 1,
        supplier_id: 1,
        product_name: 'Kangkong',
        product_description: 'Fresh',
        is_active: true,
      };

      const createDto2: CreateProductsDto = {
        product_category_id: 2,
        supplier_id: 2,
        product_name: 'Tomato',
        product_description: 'Red',
        is_active: true,
      };

      service.createProduct(createDto1);
      service.createProduct(createDto2);

      const products = service.getAllProducts();

      expect(products).toHaveLength(2);
      expect(products[0].product_name).toBe('Kangkong');
      expect(products[1].product_name).toBe('Tomato');
    });

    it('should return an empty array when no products exist', () => {
      const products = service.getAllProducts();
      expect(products).toEqual([]);
    });
  });

  describe('getSingleProduct', () => {
    it('should return the product with the specified ID', () => {
      const createDto: CreateProductsDto = {
        product_category_id: 1,
        supplier_id: 1,
        product_name: 'Kangkong',
        product_description: 'Fresh',
        is_active: true,
      };

      const createdProduct = service.createProduct(createDto);
      const foundProduct = service.getSingleProduct(createdProduct.product_id);

      expect(foundProduct).toEqual(createdProduct);
    });

    it('should throw NotFoundException for a non-existent product', () => {
      expect(() => service.getSingleProduct(999)).toThrow(NotFoundException);
      expect(() => service.getSingleProduct(999)).toThrow(
        'Product with id 999 not found',
      );
    });
  });

  describe('updateProduct', () => {
    it('should update and return the updated product', () => {
      const createDto: CreateProductsDto = {
        product_category_id: 1,
        supplier_id: 1,
        product_name: 'Kangkong',
        product_description: 'Fresh',
        is_active: true,
      };

      const createdProduct = service.createProduct(createDto);

      const updateDto: UpdateProductsDto = {
        product_name: 'Updated Kangkong',
        product_description: 'Very fresh',
        is_active: false,
      };

      const updatedProduct = service.updateProduct(
        createdProduct.product_id,
        updateDto,
      );

      expect(updatedProduct.product_name).toBe('Updated Kangkong');
      expect(updatedProduct.product_description).toBe('Very fresh');
      expect(updatedProduct.is_active).toBe(false);
      expect(updatedProduct.product_id).toBe(createdProduct.product_id);
    });

    it('should update only provided fields', () => {
      const createDto: CreateProductsDto = {
        product_category_id: 1,
        supplier_id: 1,
        product_name: 'Kangkong',
        product_description: 'Fresh',
        is_active: true,
      };

      const createdProduct = service.createProduct(createDto);

      const updateDto: UpdateProductsDto = {
        product_name: 'Updated Kangkong',
      };

      const updatedProduct = service.updateProduct(
        createdProduct.product_id,
        updateDto,
      );

      expect(updatedProduct.product_name).toBe('Updated Kangkong');
      expect(updatedProduct.product_description).toBe('Fresh'); // unchanged
      expect(updatedProduct.is_active).toBe(true); // unchanged
    });

    it('should throw NotFoundException when updating non-existent product', () => {
      const updateDto: UpdateProductsDto = {
        product_name: 'Updated Product',
      };

      expect(() => service.updateProduct(999, updateDto)).toThrow(
        NotFoundException,
      );
      expect(() => service.updateProduct(999, updateDto)).toThrow(
        'Product with id 999 not found',
      );
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product successfully', () => {
      const createDto: CreateProductsDto = {
        product_category_id: 1,
        supplier_id: 1,
        product_name: 'Kangkong',
        product_description: 'Fresh',
        is_active: true,
      };

      const createdProduct = service.createProduct(createDto);

      service.deleteProduct(createdProduct.product_id);

      expect(() => service.getSingleProduct(createdProduct.product_id)).toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when deleting non-existent product', () => {
      expect(() => service.deleteProduct(999)).toThrow(NotFoundException);
      expect(() => service.deleteProduct(999)).toThrow(
        'Product with id 999 not found',
      );
    });

    it('should remove product from the array', () => {
      const createDto1: CreateProductsDto = {
        product_category_id: 1,
        supplier_id: 1,
        product_name: 'Product 1',
        product_description: 'Desc 1',
        is_active: true,
      };

      const createDto2: CreateProductsDto = {
        product_category_id: 2,
        supplier_id: 2,
        product_name: 'Product 2',
        product_description: 'Desc 2',
        is_active: true,
      };

      service.createProduct(createDto1);
      const product2 = service.createProduct(createDto2);

      expect(service.getAllProducts()).toHaveLength(2);

      service.deleteProduct(product2.product_id);

      const products = service.getAllProducts();
      expect(products).toHaveLength(1);
      expect(products[0].product_name).toBe('Product 1');
    });
  });
});