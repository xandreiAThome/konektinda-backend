import { Test, TestingModule } from '@nestjs/testing';
import { CartsController } from './carts.controller';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

describe('CartsController', () => {
  let controller: CartsController;
  let service: CartsService;

  const mockCartsService = {
    createCart: jest.fn(),
    getAllCarts: jest.fn(),
    getCartById: jest.fn(),
    getCartByUserId: jest.fn(),
    updateCart: jest.fn(),
    deleteCart: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartsController],
      providers: [
        {
          provide: CartsService,
          useValue: mockCartsService,
        },
      ],
    }).compile();

    controller = module.get<CartsController>(CartsController);
    service = module.get<CartsService>(CartsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createCart', () => {
    it('should create a new cart', async () => {
      const dto: CreateCartDto = { user_id: 1 };
      const expectedCart = { cart_id: 1, user_id: 1 };

      mockCartsService.createCart.mockResolvedValue(expectedCart);

      const result = await controller.createCart(dto);

      expect(service.createCart).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedCart);
    });
  });

  describe('getAllCarts', () => {
    it('should return all carts', async () => {
      const expectedCarts = [
        { cart_id: 1, user_id: 1 },
        { cart_id: 2, user_id: 2 },
      ];

      mockCartsService.getAllCarts.mockResolvedValue(expectedCarts);

      const result = await controller.getAllCarts();

      expect(service.getAllCarts).toHaveBeenCalled();
      expect(result).toEqual(expectedCarts);
    });
  });

  describe('getCartById', () => {
    it('should return a cart by id', async () => {
      const expectedCart = { cart_id: 1, user_id: 1 };

      mockCartsService.getCartById.mockResolvedValue(expectedCart);

      const result = await controller.getCartById(1);

      expect(service.getCartById).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedCart);
    });
  });

  describe('getCartByUserId', () => {
    it('should return a cart by user id', async () => {
      const expectedCart = { cart_id: 1, user_id: 1 };

      mockCartsService.getCartByUserId.mockResolvedValue(expectedCart);

      const result = await controller.getCartByUserId(1);

      expect(service.getCartByUserId).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedCart);
    });
  });

  describe('updateCart', () => {
    it('should update a cart', async () => {
      const dto: UpdateCartDto = { user_id: 2 };
      const expectedCart = { cart_id: 1, user_id: 2 };

      mockCartsService.updateCart.mockResolvedValue(expectedCart);

      const result = await controller.updateCart(1, dto);

      expect(service.updateCart).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual(expectedCart);
    });
  });

  describe('deleteCart', () => {
    it('should delete a cart', async () => {
      mockCartsService.deleteCart.mockResolvedValue(undefined);

      await controller.deleteCart(1);

      expect(service.deleteCart).toHaveBeenCalledWith(1);
    });
  });
});
