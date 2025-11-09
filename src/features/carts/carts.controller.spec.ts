import { Test, TestingModule } from '@nestjs/testing';
import { CartsController } from './carts.controller';
import { CartsService } from './carts.service';
import { NotFoundException } from '@nestjs/common';
import { FirebaseAuthGuard } from '../auth/guard/firebase-auth-guard';

const mockService = {
  getCartByFirebaseUid: jest.fn(),
  createCart: jest.fn(),
  deleteCart: jest.fn(),
};

// mock guard that always passes
class MockFirebaseAuthGuard {
  canActivate() {
    return true;
  }
}

describe('CartsController (auth-scoped)', () => {
  let controller: CartsController;

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

  const uid = 'abc';
  const req = { user: { uid } } as any;
  const mockCart = { cart_id: 2, user_id: 2 };

  describe('GET /cart', () => {
    it('returns the current user’s cart', async () => {
      mockService.getCartByFirebaseUid.mockResolvedValueOnce(mockCart);

      const res = await controller.getCartByFirebaseUid(req);

      expect(res).toEqual(mockCart);
      expect(mockService.getCartByFirebaseUid).toHaveBeenCalledTimes(1);
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
      expect(mockService.createCart).toHaveBeenCalledTimes(1);
      expect(mockService.createCart).toHaveBeenCalledWith(uid);
    });
  });

  describe('DELETE /cart', () => {
    it('deletes the current user’s cart', async () => {
      // If your service returns the deleted cart row:
      mockService.deleteCart.mockResolvedValueOnce(mockCart);

      const res = await controller.deleteCart(req);

      expect(res).toBeUndefined;
      expect(mockService.deleteCart).toHaveBeenCalledTimes(1);
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
