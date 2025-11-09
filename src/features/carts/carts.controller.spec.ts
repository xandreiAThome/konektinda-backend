import { Test, TestingModule } from '@nestjs/testing';
import { CartsController } from './carts.controller';
import { CartsService } from './carts.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { FirebaseAuthGuard } from '../auth/guard/firebase-auth-guard';

const mockService = {
  // cart
  getCartByFirebaseUid: jest.fn(),
  createCart: jest.fn(),
  deleteCart: jest.fn(),
  // items
  getCartItems: jest.fn(),
  getCartItemByVariantId: jest.fn(),
  addCartItem: jest.fn(),
  updateCartItem: jest.fn(),
  deleteCartItem: jest.fn(),
};

// guard that always passes
class MockFirebaseAuthGuard {
  canActivate() {
    return true;
  }
}

describe('Cart endpoints (controller)', () => {
  let controller: CartsController;

  const uid = 'abc';
  const req = { user: { uid } } as any;
  const mockCart = { cart_id: 2, user_id: 2 };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartsController],
      providers: [{ provide: CartsService, useValue: mockService }],
    })
      .overrideGuard(FirebaseAuthGuard)
      .useClass(MockFirebaseAuthGuard)
      .compile();

    controller = module.get<CartsController>(CartsController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /cart', () => {
    it('returns the current user’s cart', async () => {
      mockService.getCartByFirebaseUid.mockResolvedValueOnce(mockCart);

      const res = await controller.getCartByFirebaseUid(req);

      expect(res).toEqual(mockCart);
      expect(mockService.getCartByFirebaseUid).toHaveBeenCalledWith(uid);
    });

    it('throws NotFound when cart is missing', async () => {
      mockService.getCartByFirebaseUid.mockRejectedValueOnce(
        new NotFoundException(),
      );

      await expect(controller.getCartByFirebaseUid(req)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockService.getCartByFirebaseUid).toHaveBeenCalledWith(uid);
    });
  });

  describe('POST /cart', () => {
    it('creates a cart for the current user', async () => {
      mockService.createCart.mockResolvedValueOnce(mockCart);

      const res = await controller.createCart(req);

      expect(res).toEqual(mockCart);
      expect(mockService.createCart).toHaveBeenCalledWith(uid);
    });
  });

  describe('DELETE /cart', () => {
    it('deletes the current user’s cart', async () => {
      mockService.deleteCart.mockResolvedValueOnce(undefined);

      const res = await controller.deleteCart(req);

      expect(res).toBeUndefined(); // <- fix: call it as a matcher
      expect(mockService.deleteCart).toHaveBeenCalledWith(uid);
    });

    it('throws NotFound when cart is missing', async () => {
      mockService.deleteCart.mockRejectedValueOnce(new NotFoundException());

      await expect(controller.deleteCart(req)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockService.deleteCart).toHaveBeenCalledWith(uid);
    });
  });
});

describe('Cart item endpoints (controller)', () => {
  let controller: CartsController;

  const uid = 'abc';
  const req = { user: { uid } } as any;
  const productVariantId = 5;
  const mockItem = {
    cart_item_id: 11,
    cart_id: 2,
    product_variant_id: productVariantId,
    quantity: 2,
    unit_price: 100,
    discount_applied: 0,
    date_priced: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartsController],
      providers: [{ provide: CartsService, useValue: mockService }],
    })
      .overrideGuard(FirebaseAuthGuard)
      .useClass(MockFirebaseAuthGuard)
      .compile();

    controller = module.get<CartsController>(CartsController);
    jest.clearAllMocks();
  });

  describe('GET /cart/items', () => {
    it('returns items in the cart', async () => {
      mockService.getCartItems.mockResolvedValueOnce([mockItem]);

      const res = await controller.getCartItems(req);

      expect(res).toEqual([mockItem]);
      expect(mockService.getCartItems).toHaveBeenCalledWith(uid);
    });
  });

  describe('GET /cart/items/:productVariantId', () => {
    it('returns one item', async () => {
      mockService.getCartItemByVariantId.mockResolvedValueOnce(mockItem);

      const res = await controller.getCartItemById(req, productVariantId);

      expect(res).toEqual(mockItem);
      expect(mockService.getCartItemByVariantId).toHaveBeenCalledWith(
        uid,
        productVariantId,
      );
    });

    it('throws NotFoundException when missing', async () => {
      mockService.getCartItemByVariantId.mockRejectedValueOnce(
        new NotFoundException(),
      );

      await expect(
        controller.getCartItemById(req, productVariantId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('POST /cart/items/:productVariantId', () => {
    it('adds an item', async () => {
      mockService.addCartItem.mockResolvedValueOnce(mockItem);

      const res = await controller.createCartItem(req, productVariantId, 2);

      expect(res).toEqual(mockItem);
      expect(mockService.addCartItem).toHaveBeenCalledWith(
        uid,
        productVariantId,
        2,
      );
    });

    it('throws validation errors', async () => {
      mockService.addCartItem.mockRejectedValueOnce(new BadRequestException());

      await expect(
        controller.createCartItem(req, productVariantId, 0),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('PATCH /cart/items/:productVariantId', () => {
    it('updates quantity and syncs pricing', async () => {
      const updated = { ...mockItem, quantity: 3 };
      mockService.updateCartItem.mockResolvedValueOnce(updated);

      const res = await controller.updateCartItem(req, productVariantId, 3);

      expect(res).toEqual(updated);
      expect(mockService.updateCartItem).toHaveBeenCalledWith(
        uid,
        productVariantId,
        3,
      );
    });
  });

  describe('DELETE /cart/items/:productVariantId', () => {
    it('deletes the item', async () => {
      mockService.deleteCartItem.mockResolvedValueOnce(mockItem);

      const res = await controller.deleteCartItem(req, productVariantId);

      expect(res).toEqual(mockItem);
      expect(mockService.deleteCartItem).toHaveBeenCalledWith(
        uid,
        productVariantId,
      );
    });

    it('throws NotFoundException when missing', async () => {
      mockService.deleteCartItem.mockRejectedValueOnce(new NotFoundException());

      await expect(
        controller.deleteCartItem(req, productVariantId),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
