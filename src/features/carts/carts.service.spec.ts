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
  let mockGetUserId: jest.SpyInstance | undefined;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CartsService],
    }).compile();

    service = module.get<CartsService>(CartsService);
    jest.resetAllMocks();
    mockGetUserId = jest
      .spyOn(service as any, 'getUserIdByFirebaseUid')
      .mockResolvedValue(2);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const firebaseUid = 'abc';
  const mockCart = { cart_id: 2, user_id: 2 };

  describe('getCartByFirebaseUid', () => {
    it('returns the cart', async () => {
      (db.select as jest.Mock).mockReturnValueOnce({
        from: jest.fn().mockReturnValueOnce({
          where: jest.fn().mockResolvedValueOnce([mockCart]),
        }),
      });

      const result = await service.getCartByFirebaseUid(firebaseUid);

      expect(mockGetUserId).toHaveBeenCalledWith('abc');
      expect(result).toEqual(mockCart);
      expect(db.select).toHaveBeenCalledTimes(1);
    });

    it('throws if cart not found', async () => {
      (db.select as jest.Mock).mockReturnValueOnce({
        from: jest.fn().mockReturnValueOnce({
          where: jest.fn().mockResolvedValueOnce([]),
        }),
      });

      await expect(service.getCartByFirebaseUid(firebaseUid)).rejects.toThrow(
        NotFoundException,
      );

      expect(mockGetUserId).toHaveBeenCalledWith('abc');
    });

    it('propagates NotFound if user lookup fails', async () => {
      const mockGetUserId = jest
        .spyOn(service as any, 'getUserIdByFirebaseUid')
        .mockRejectedValue(new NotFoundException('User not found'));

      await expect(service.getCartByFirebaseUid(firebaseUid)).rejects.toThrow(
        NotFoundException,
      );

      expect(mockGetUserId).toHaveBeenCalledWith('abc');
      expect(db.select).not.toHaveBeenCalled();
    });
  });

  describe('createCart', () => {
    it('creates a cart', async () => {
      (db.insert as jest.Mock).mockReturnValueOnce({
        values: jest.fn().mockReturnValueOnce({
          returning: jest.fn().mockResolvedValueOnce([mockCart]),
        }),
      });

      const result = await service.createCart(firebaseUid);

      expect(mockGetUserId).toHaveBeenCalledWith('abc');
      expect(result).toEqual(mockCart);
      expect(db.insert).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteCart', () => {
    it('deletes the cart', async () => {
      (db.delete as jest.Mock).mockReturnValueOnce({
        where: jest.fn().mockReturnValueOnce({
          returning: jest.fn().mockResolvedValueOnce([mockCart]),
        }),
      });

      const result = await service.deleteCart(firebaseUid);

      expect(mockGetUserId).toHaveBeenCalledWith('abc');
      expect(result).toBeUndefined();
      expect(db.delete).toHaveBeenCalledTimes(1);
    });

    it('throws if cart not found', async () => {
      (db.delete as jest.Mock).mockReturnValueOnce({
        where: jest.fn().mockReturnValueOnce({
          returning: jest.fn().mockResolvedValueOnce([]),
        }),
      });

      await expect(service.deleteCart(firebaseUid)).rejects.toThrow(
        NotFoundException,
      );

      expect(mockGetUserId).toHaveBeenCalledWith('abc');
    });
  });

  describe('getUserIdByFirebaseUid (helper)', () => {
    beforeEach(() => {
      jest.restoreAllMocks();
    });

    it('returns user_id', async () => {
      (db.select as jest.Mock).mockReturnValueOnce({
        from: jest.fn().mockReturnValueOnce({
          where: jest.fn().mockResolvedValueOnce([{ user_id: 2 }]),
        }),
      });

      const id = await (service as any).getUserIdByFirebaseUid('abc');
      expect(id).toBe(2);
    });

    it('throws if user missing', async () => {
      (db.select as jest.Mock).mockReturnValueOnce({
        from: jest.fn().mockReturnValueOnce({
          where: jest.fn().mockResolvedValueOnce([]),
        }),
      });

      await expect(
        (service as any).getUserIdByFirebaseUid('nope'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
