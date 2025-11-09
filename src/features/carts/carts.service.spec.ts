import { Test, TestingModule } from '@nestjs/testing';
import { CartsService } from './carts.service';
import { NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

// Mock the database
jest.mock('database', () => ({
  db: {
    insert: jest.fn(),
    select: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

import { db } from 'database';

describe('CartsService', () => {
  let service: CartsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CartsService],
    }).compile();

    service = module.get<CartsService>(CartsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCart', () => {
    it('should create a new cart', async () => {
      const dto: CreateCartDto = { user_id: 1 };
      const expectedCart = { cart_id: 1, user_id: 1 };

      const mockReturning = jest.fn().mockResolvedValue([expectedCart]);
      const mockValues = jest.fn().mockReturnValue({ returning: mockReturning });
      (db.insert as jest.Mock).mockReturnValue({ values: mockValues });

      const result = await service.createCart(dto);

      expect(db.insert).toHaveBeenCalled();
      expect(mockValues).toHaveBeenCalledWith({ user_id: dto.user_id });
      expect(result).toEqual(expectedCart);
    });
  });

  describe('getAllCarts', () => {
    it('should return all carts', async () => {
      const expectedCarts = [
        { cart_id: 1, user_id: 1 },
        { cart_id: 2, user_id: 2 },
      ];

      const mockFrom = jest.fn().mockResolvedValue(expectedCarts);
      (db.select as jest.Mock).mockReturnValue({ from: mockFrom });

      const result = await service.getAllCarts();

      expect(db.select).toHaveBeenCalled();
      expect(result).toEqual(expectedCarts);
    });
  });

  describe('getCartById', () => {
    it('should return a cart by id', async () => {
      const expectedCart = { cart_id: 1, user_id: 1 };

      const mockWhere = jest.fn().mockResolvedValue([expectedCart]);
      const mockFrom = jest.fn().mockReturnValue({ where: mockWhere });
      (db.select as jest.Mock).mockReturnValue({ from: mockFrom });

      const result = await service.getCartById(1);

      expect(result).toEqual(expectedCart);
    });

    it('should throw NotFoundException when cart not found', async () => {
      const mockWhere = jest.fn().mockResolvedValue([]);
      const mockFrom = jest.fn().mockReturnValue({ where: mockWhere });
      (db.select as jest.Mock).mockReturnValue({ from: mockFrom });

      await expect(service.getCartById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getCartByUserId', () => {
    it('should return a cart by user id', async () => {
      const expectedCart = { cart_id: 1, user_id: 1 };

      const mockWhere = jest.fn().mockResolvedValue([expectedCart]);
      const mockFrom = jest.fn().mockReturnValue({ where: mockWhere });
      (db.select as jest.Mock).mockReturnValue({ from: mockFrom });

      const result = await service.getCartByUserId(1);

      expect(result).toEqual(expectedCart);
    });

    it('should throw NotFoundException when cart not found for user', async () => {
      const mockWhere = jest.fn().mockResolvedValue([]);
      const mockFrom = jest.fn().mockReturnValue({ where: mockWhere });
      (db.select as jest.Mock).mockReturnValue({ from: mockFrom });

      await expect(service.getCartByUserId(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateCart', () => {
    it('should update a cart', async () => {
      const dto: UpdateCartDto = { user_id: 2 };
      const expectedCart = { cart_id: 1, user_id: 2 };

      const mockReturning = jest.fn().mockResolvedValue([expectedCart]);
      const mockWhere = jest.fn().mockReturnValue({ returning: mockReturning });
      const mockSet = jest.fn().mockReturnValue({ where: mockWhere });
      (db.update as jest.Mock).mockReturnValue({ set: mockSet });

      const result = await service.updateCart(1, dto);

      expect(result).toEqual(expectedCart);
    });

    it('should throw NotFoundException when cart not found', async () => {
      const dto: UpdateCartDto = { user_id: 2 };

      const mockReturning = jest.fn().mockResolvedValue([]);
      const mockWhere = jest.fn().mockReturnValue({ returning: mockReturning });
      const mockSet = jest.fn().mockReturnValue({ where: mockWhere });
      (db.update as jest.Mock).mockReturnValue({ set: mockSet });

      await expect(service.updateCart(999, dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteCart', () => {
    it('should delete a cart', async () => {
      const expectedCart = { cart_id: 1, user_id: 1 };

      const mockReturning = jest.fn().mockResolvedValue([expectedCart]);
      const mockWhere = jest.fn().mockReturnValue({ returning: mockReturning });
      (db.delete as jest.Mock).mockReturnValue({ where: mockWhere });

      await service.deleteCart(1);

      expect(db.delete).toHaveBeenCalled();
    });

    it('should throw NotFoundException when cart not found', async () => {
      const mockReturning = jest.fn().mockResolvedValue([]);
      const mockWhere = jest.fn().mockReturnValue({ returning: mockReturning });
      (db.delete as jest.Mock).mockReturnValue({ where: mockWhere });

      await expect(service.deleteCart(999)).rejects.toThrow(NotFoundException);
    });
  });
});
