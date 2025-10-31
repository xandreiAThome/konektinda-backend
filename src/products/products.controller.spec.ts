import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CreateProductsDto } from './dto/createproducts.dto';
import { UpdateProductsDto } from './dto/updateprodcuts.dto';
import { Product } from 'interface/product';
import { NotFoundException } from '@nestjs/common';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProduct: Product = {
    product_id: 1,
    product_category_id: 1,
    supplier_id: 1,
    product_name: 'Kangkong',
    product_description: 'Fresh vegetables',
    is_active: true,
  };

  const mockProducts: Product[] = [
    mockProduct,
    {
      product_id: 2,
      product_category_id: 2,
      supplier_id: 2,
      product_name: 'Tomato',
      product_description: 'Fresh tomatoes',
      is_active: true,
    },
  ];

  const mockProductsService = {
    getAllProducts: jest.fn(),
    getSingleProduct: jest.fn(),
    createProduct: jest.fn(),
    updateProduct: jest.fn(),
    deleteProduct: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllProducts', () => {
    it('should return an array of products', () => {
      mockProductsService.getAllProducts.mockReturnValue(mockProducts);

      const result = controller.getAllProducts();

      expect(result).toEqual(mockProducts);
      expect(result).toHaveLength(2);
      expect(service.getAllProducts).toHaveBeenCalled();
    });

    it('should return an empty array when no products exist', () => {
      mockProductsService.getAllProducts.mockReturnValue([]);

      const result = controller.getAllProducts();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
      expect(service.getAllProducts).toHaveBeenCalled();
    });
  });

  describe('getSingleProduct', () => {
    it('should return a single product by id', () => {
      mockProductsService.getSingleProduct.mockReturnValue(mockProduct);

      const result = controller.getSingleProduct(1);

      expect(result).toEqual(mockProduct);
      expect(service.getSingleProduct).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when product does not exist', () => {
      mockProductsService.getSingleProduct.mockImplementation(() => {
        throw new NotFoundException('Product with id 999 not found');
      });

      expect(() => controller.getSingleProduct(999)).toThrow(NotFoundException);
      expect(service.getSingleProduct).toHaveBeenCalledWith(999);
    });
  });

  describe('createProduct', () => {
    it('should create and return a new product', () => {
      const createDto: CreateProductsDto = {
        product_category_id: 1,
        supplier_id: 1,
        product_name: 'Kangkong',
        product_description: 'Fresh vegetables',
        is_active: true,
      };

      mockProductsService.createProduct.mockReturnValue(mockProduct);

      const result = controller.createProduct(createDto);

      expect(result).toEqual(mockProduct);
      expect(service.createProduct).toHaveBeenCalledWith(createDto);
    });

    it('should create product with default values when optional fields are omitted', () => {
      const createDto: CreateProductsDto = {
        product_category_id: 1,
        supplier_id: 1,
        product_name: 'Kangkong',
        product_description: '',
        is_active: false,
      };

      const expectedProduct: Product = {
        product_id: 3,
        product_category_id: 1,
        supplier_id: 1,
        product_name: 'Kangkong',
        product_description: '',
        is_active: false,
      };

      mockProductsService.createProduct.mockReturnValue(expectedProduct);

      const result = controller.createProduct(createDto);

      expect(result).toEqual(expectedProduct);
      expect(service.createProduct).toHaveBeenCalledWith(createDto);
    });
  });

  describe('updateProduct', () => {
    it('should update and return the updated product', () => {
      const updateDto: UpdateProductsDto = {
        product_name: 'Updated Kangkong',
        product_description: 'Updated description',
        is_active: false,
      };

      const updatedProduct: Product = {
        ...mockProduct,
        product_name: 'Updated Kangkong',
        product_description: 'Updated description',
        is_active: false,
      };

      mockProductsService.updateProduct.mockReturnValue(updatedProduct);

      const result = controller.updateProduct(1, updateDto);

      expect(result).toEqual(updatedProduct);
      expect(service.updateProduct).toHaveBeenCalledWith(1, updateDto);
    });

    it('should throw NotFoundException when updating non-existent product', () => {
      const updateDto: UpdateProductsDto = {
        product_name: 'Updated Product',
      };

      mockProductsService.updateProduct.mockImplementation(() => {
        throw new NotFoundException('Product with id 999 not found');
      });

      expect(() => controller.updateProduct(999, updateDto)).toThrow(
        NotFoundException,
      );
      expect(service.updateProduct).toHaveBeenCalledWith(999, updateDto);
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product successfully', () => {
      mockProductsService.deleteProduct.mockReturnValue(undefined);

      const result = controller.deleteProduct(1);

      expect(result).toBeUndefined();
      expect(service.deleteProduct).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when deleting non-existent product', () => {
      mockProductsService.deleteProduct.mockImplementation(() => {
        throw new NotFoundException('Product with id 999 not found');
      });

      expect(() => controller.deleteProduct(999)).toThrow(NotFoundException);
      expect(service.deleteProduct).toHaveBeenCalledWith(999);
    });
  });
});
