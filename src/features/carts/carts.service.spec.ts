import { Test, TestingModule } from '@nestjs/testing';
import { CartsService } from './carts.service';
import { db } from 'database';
import { BadRequestException, NotFoundException } from '@nestjs/common';

jest.mock('database', () => ({
  db: {
    query: {
      carts: {
        findMany: jest.fn(),
        findOne: jest.fn(),
      },
      cart_items: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
      },
    },

    select: jest.fn(),
    insert: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
  },
}));

// Mock the select chain once to reduce redundancy
const mockSelectReturn = (data: any[]) => {
  (db.select as jest.Mock).mockReturnValueOnce({
    from: jest.fn().mockReturnValueOnce({
      where: jest.fn().mockResolvedValueOnce(data),
    }),
  });
};

describe('Cart endpoints', () => {
  let service: CartsService;
  let mockGetUserId: jest.SpyInstance | undefined;

  const firebaseUid = 'abc';
  const mockCart = { cart_id: 2, user_id: 2 };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CartsService],
    }).compile();

    service = module.get<CartsService>(CartsService);
    jest.resetAllMocks();

    // resolve user id
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

  describe('getCartByFirebaseUid', () => {
    it('returns the cart', async () => {
      mockSelectReturn([mockCart]);
      const result = await service.getCartByFirebaseUid(firebaseUid);

      expect(mockGetUserId).toHaveBeenCalledWith(firebaseUid);
      expect(result).toEqual(mockCart);
      expect(db.select).toHaveBeenCalledTimes(1);
    });

    it('throws if cart not found', async () => {
      mockSelectReturn([]);

      await expect(service.getCartByFirebaseUid(firebaseUid)).rejects.toThrow(
        NotFoundException,
      );

      expect(mockGetUserId).toHaveBeenCalledWith(firebaseUid);
    });

    it('propagates NotFound if user lookup fails', async () => {
      const localSpy = jest
        .spyOn(service as any, 'getUserIdByFirebaseUid')
        .mockRejectedValue(new NotFoundException('User not found'));

      await expect(service.getCartByFirebaseUid(firebaseUid)).rejects.toThrow(
        NotFoundException,
      );

      expect(localSpy).toHaveBeenCalledWith(firebaseUid);
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

      expect(mockGetUserId).toHaveBeenCalledWith(firebaseUid);
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

      expect(mockGetUserId).toHaveBeenCalledWith(firebaseUid);
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

      expect(mockGetUserId).toHaveBeenCalledWith(firebaseUid);
    });
  });

  describe('getUserIdByFirebaseUid (helper)', () => {
    // use real impl here
    beforeEach(() => {
      jest.restoreAllMocks();
    });

    it('returns user_id', async () => {
      mockSelectReturn([{ user_id: 2 }]);

      const id = await (service as any).getUserIdByFirebaseUid(firebaseUid);
      expect(id).toBe(2);
    });

    it('throws if user missing', async () => {
      mockSelectReturn([]);

      await expect(
        (service as any).getUserIdByFirebaseUid('nope'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});

// CART ITEM ENDPOINTS

describe('cart item endpoints', () => {
  let service: CartsService;
  let mockGetCartId: jest.SpyInstance | undefined;

  const firebaseUid = 'abc';
  const mockCart = { cart_id: 2, user_id: 2 };
  const productVariantId = 5;
  const mockVariant = {
    product_variant_id: productVariantId,
    price: 100,
    stock: 10,
    discount: 2,
    is_active: true,
  };
  const mockItem = {
    cart_item_id: 11,
    cart_id: mockCart.cart_id,
    product_variant_id: productVariantId,
    quantity: 1,
    unit_price: 100,
    discount_applied: 2,
    date_priced: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CartsService],
    }).compile();

    service = module.get<CartsService>(CartsService);
    jest.resetAllMocks();

    mockGetCartId = jest
      .spyOn(service as any, 'getCartByFirebaseUid')
      .mockResolvedValue(mockCart);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getCartItems', () => {
    it('returns all items for the user cart', async () => {
      (db.query.cart_items.findMany as jest.Mock).mockResolvedValue([mockItem]);

      const res = await service.getCartItems(firebaseUid);

      expect(mockGetCartId).toHaveBeenCalledWith(firebaseUid);
      expect(res).toEqual([mockItem]);
      expect(db.query.cart_items.findMany).toHaveBeenCalled();
      expect(mockGetCartId).toHaveBeenCalledWith(firebaseUid);
    });
  });

  describe('getCartItemByVariantId', () => {
    it('returns one item', async () => {
      (db.query.cart_items.findFirst as jest.Mock).mockResolvedValue(mockItem);

      const res = await service.getCartItemByVariantId(
        firebaseUid,
        productVariantId,
      );
      expect(res).toEqual(mockItem);
      expect(mockGetCartId).toHaveBeenCalledWith(firebaseUid);
    });

    it('throws if item not found', async () => {
      mockSelectReturn([]); // no item

      await expect(
        service.getCartItemByVariantId(firebaseUid, productVariantId),
      ).rejects.toThrow(NotFoundException);
      expect(mockGetCartId).toHaveBeenCalledWith(firebaseUid);
    });
  });

  describe('addCartItem', () => {
    it('adds item when variant is valid and not in cart', async () => {
      // Get cart
      mockSelectReturn([mockVariant]); // Product variant exists
      mockSelectReturn([]); // Item does not exist in cart

      (db.insert as jest.Mock).mockReturnValueOnce({
        values: jest.fn().mockReturnValueOnce({
          returning: jest.fn().mockResolvedValueOnce([mockItem]),
        }),
      });

      const res = await service.addCartItem(firebaseUid, productVariantId, 1);

      expect(res).toEqual(mockItem);
      expect(db.insert).toHaveBeenCalledTimes(1);
      expect(mockGetCartId).toHaveBeenCalledWith(firebaseUid);
    });

    it('rejects invalid quantity', async () => {
      await expect(
        service.addCartItem(firebaseUid, productVariantId, 0),
      ).rejects.toThrow(BadRequestException);
      expect(db.select).not.toHaveBeenCalled();
      expect(mockGetCartId).toHaveBeenCalledTimes(0);
    });

    it('throws if variant not found', async () => {
      mockSelectReturn([]); // No variant found

      await expect(
        service.addCartItem(firebaseUid, productVariantId, 1),
      ).rejects.toThrow(BadRequestException);
      expect(mockGetCartId).toHaveBeenCalledWith(firebaseUid);
    });

    it('throws if not enough stock', async () => {
      mockSelectReturn([{ ...mockVariant, stock: 0 }]); // Variant with low stock

      await expect(
        service.addCartItem(firebaseUid, productVariantId, 1),
      ).rejects.toThrow(BadRequestException);
      expect(mockGetCartId).toHaveBeenCalledWith(firebaseUid);
    });

    it('throws if variant inactive', async () => {
      mockSelectReturn([{ ...mockVariant, is_active: false }]);

      await expect(
        service.addCartItem(firebaseUid, productVariantId, 1),
      ).rejects.toThrow(BadRequestException);
      expect(mockGetCartId).toHaveBeenCalledWith(firebaseUid);
    });

    it('throws if already in cart', async () => {
      mockSelectReturn([mockVariant]);
      mockSelectReturn([mockItem]); // Item is already in cart

      await expect(
        service.addCartItem(firebaseUid, productVariantId, 1),
      ).rejects.toThrow(BadRequestException);
      expect(mockGetCartId).toHaveBeenCalledWith(firebaseUid);
    });
  });

  describe('updateCartItem', () => {
    it('updates item with latest variant data', async () => {
      mockSelectReturn([mockVariant]);
      mockSelectReturn([mockItem]); // Item is already in cart

      // update
      const updated = {
        ...mockItem,
        quantity: 3,
        unit_price: 100,
        discount_applied: 2,
      };
      (db.update as jest.Mock).mockReturnValueOnce({
        set: jest.fn().mockReturnValueOnce({
          where: jest.fn().mockReturnValueOnce({
            returning: jest.fn().mockResolvedValueOnce([updated]),
          }),
        }),
      });

      const res = await service.updateCartItem(
        firebaseUid,
        productVariantId,
        3,
      );

      expect(res).toEqual(updated);
      expect(db.update).toHaveBeenCalledTimes(1);
      expect(mockGetCartId).toHaveBeenCalledWith(firebaseUid);
    });

    it('throws if item missing', async () => {
      mockSelectReturn([mockVariant]);
      mockSelectReturn([]); // Item not found in cart

      await expect(
        service.updateCartItem(firebaseUid, productVariantId, 1),
      ).rejects.toThrow(NotFoundException);
      expect(mockGetCartId).toHaveBeenCalledWith(firebaseUid);
    });

    it('throws if variant missing', async () => {
      mockSelectReturn([]); // Product variant not found

      await expect(
        service.updateCartItem(firebaseUid, productVariantId, 1),
      ).rejects.toThrow(NotFoundException);
      expect(mockGetCartId).toHaveBeenCalledWith(firebaseUid);
    });

    it('throws if variant inactive', async () => {
      mockSelectReturn([{ ...mockVariant, is_active: false }]); // Variant is inactive

      await expect(
        service.updateCartItem(firebaseUid, productVariantId, 1),
      ).rejects.toThrow(NotFoundException); // matches your service
      expect(mockGetCartId).toHaveBeenCalledWith(firebaseUid);
    });

    it('throws if invalid quantity', async () => {
      mockSelectReturn([mockVariant]);
      mockSelectReturn([mockItem]);

      await expect(
        service.updateCartItem(firebaseUid, productVariantId, 0),
      ).rejects.toThrow(BadRequestException);
      expect(mockGetCartId).toHaveBeenCalledWith(firebaseUid);
    });
  });

  describe('deleteCartItem', () => {
    it('deletes a cart item', async () => {
      // cart
      (db.select as jest.Mock).mockReturnValueOnce({
        from: jest.fn().mockReturnValueOnce({
          where: jest.fn().mockResolvedValueOnce([mockCart]),
        }),
      });
      // delete item
      (db.delete as jest.Mock).mockReturnValueOnce({
        where: jest.fn().mockReturnValueOnce({
          returning: jest.fn().mockResolvedValueOnce([mockItem]),
        }),
      });

      const res = await service.deleteCartItem(firebaseUid, productVariantId);

      expect(res).toBeUndefined();
      expect(db.delete).toHaveBeenCalledTimes(1);
      expect(mockGetCartId).toHaveBeenCalledWith(firebaseUid);
    });

    it('throws if item not found', async () => {
      // cart
      (db.select as jest.Mock).mockReturnValueOnce({
        from: jest.fn().mockReturnValueOnce({
          where: jest.fn().mockResolvedValueOnce([mockCart]),
        }),
      });
      // delete none
      (db.delete as jest.Mock).mockReturnValueOnce({
        where: jest.fn().mockReturnValueOnce({
          returning: jest.fn().mockResolvedValueOnce([]),
        }),
      });

      await expect(
        service.deleteCartItem(firebaseUid, productVariantId),
      ).rejects.toThrow(NotFoundException);
      expect(mockGetCartId).toHaveBeenCalledWith(firebaseUid);
    });
  });
});
