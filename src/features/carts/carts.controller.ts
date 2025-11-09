import { Controller, Get, Post, Delete, Req, UseGuards } from '@nestjs/common';
import { CartsService } from './carts.service';
import { FirebaseAuthGuard } from '../auth/guard/firebase-auth-guard';

@Controller('cart')
@UseGuards(FirebaseAuthGuard)
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  // Get the current user's cart
  @Get()
  async getCartByFirebaseUid(@Req() req) {
    const firebaseUid = req.user.uid;
    return this.cartsService.getCartByFirebaseUid(firebaseUid);
  }

  // Create the user's cart
  @Post()
  async createCart(@Req() req) {
    const firebaseUid = req.user.uid;
    return this.cartsService.createCart(firebaseUid);
  }

  // Delete the user's cart
  @Delete()
  async deleteCart(@Req() req) {
    const firebaseUid = req.user.uid;
    return this.cartsService.deleteCart(firebaseUid);
  }
}
