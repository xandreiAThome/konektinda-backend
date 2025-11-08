import { Test, TestingModule } from '@nestjs/testing';
import { CartsService } from './carts.service';
import { db } from 'database';
import { NotFoundException } from '@nestjs/common';

jest.mock('database', () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('CartsService', () => {
  let service: CartsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CartsService],
    }).compile();

    service = module.get<CartsService>(CartsService);
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCartByUserId', () => {
    const cart = { cart_id: 1, user_id: 2 };
    it('should get a cart by user id', async () => {
      (db.select as jest.Mock).mockReturnValueOnce({
        from: jest.fn().mockReturnValueOnce({
          where: jest.fn().mockResolvedValue([cart]),
        }),
      });

      const result = await service.getCartByUserId(2);
      expect(result).toEqual(cart);
      expect(db.select).toHaveBeenCalled();
      expect(typeof result).toBe('object');
    });

    it('should return a NotFoundException if user id is not found', async () => {
      (db.select as jest.Mock).mockReturnValueOnce({
        from: jest.fn().mockReturnValueOnce({
          where: jest.fn().mockResolvedValue([]),
        }),
      });

      await expect(service.getCartByUserId(-1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createCart', () => {
    it('should create a new cart', async () => {
      (db.insert as jest.Mock).mockReturnValueOnce({
        values: jest.fn().mockReturnValueOnce({
          returning: jest
            .fn()
            .mockResolvedValueOnce([{ cart_id: 2, user_id: 2 }]),
        }),
      });

      const result = await service.createCart({ user_id: 2 });
      expect(result).toEqual({ cart_id: 2, user_id: 2 });
      expect(db.insert).toHaveBeenCalled();
    });
  });

  describe('deleteCart', () => {
    it('should delete an existing cart', async () => {
      (db.delete as jest.Mock).mockReturnValueOnce({
        where: jest.fn().mockReturnValueOnce({
          returning: jest
            .fn()
            .mockResolvedValueOnce([{ cart_id: 2, user_id: 2 }]),
        }),
      });

      const result = await service.deleteCart(1);

      expect(result).toBeUndefined();
      expect(db.delete).toHaveBeenCalled();
    });

    it('should throw a NotFoundException if user cart does not exist', async () => {
      (db.delete as jest.Mock).mockReturnValueOnce({
        where: jest.fn().mockReturnValueOnce({
          returning: jest.fn().mockResolvedValueOnce([]),
        }),
      });

      await expect(service.deleteCart).rejects.toThrow(NotFoundException);
    });
  });
});
