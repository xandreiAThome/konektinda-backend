import { Test, TestingModule } from '@nestjs/testing';
import { CartsController } from './carts.controller';
import { CartsService } from './carts.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockService = {
  getCartByUserId: jest.fn(),
  createCart: jest.fn(),
  deleteCart: jest.fn(),
};

describe('CartsController', () => {
  let controller: CartsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartsController],
      providers: [
        {
          provide: CartsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<CartsController>(CartsController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /carts/:userId', () => {
    it('should return the correct cart based on user id', async () => {
      const cart = [{ cart_id: 1, user_id: 2 }];
      mockService.getCartByUserId.mockResolvedValue(cart);

      const res = await controller.getCartByUserId(1);

      expect(res).toEqual(cart);
      expect(mockService.getCartByUserId).toHaveBeenCalledTimes(1);
    });

    it('should return a NotFoundException if user cart does not exist', async () => {
      mockService.getCartByUserId.mockRejectedValueOnce(
        new NotFoundException(),
      );

      await expect(controller.getCartByUserId(-1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('POST /carts', () => {
    it('should create a new cart', async () => {
      const dto = { user_id: 2 };

      mockService.createCart.mockResolvedValueOnce({ cart_id: 2, user_id: 2 });
      const res = await controller.createCart(dto);

      expect(res).toEqual({ cart_id: 2, user_id: 2 });
      expect(mockService.createCart).toHaveBeenCalledTimes(1);
    });
  });

  describe('DELETE /carts/:id', () => {
    it('should delete an existing cart', async () => {
      mockService.deleteCart.mockResolvedValueOnce(undefined);
      const res = await controller.deleteCart(2);

      expect(res).toBeUndefined();
      expect(mockService.deleteCart).toHaveBeenCalledTimes(1);
    });

    it('should return a NotFoundException if cart does not exist', async () => {
      mockService.deleteCart.mockRejectedValueOnce(new NotFoundException());

      await expect(controller.deleteCart(-1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
