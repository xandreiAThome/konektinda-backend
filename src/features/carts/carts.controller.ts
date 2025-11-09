import {
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Req,
  UseGuards,
  ParseIntPipe,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { FirebaseAuthGuard } from '../auth/guard/firebase-auth-guard';
import type { AuthenticatedRequest } from 'interface/auth_req';

// TEMP HARCODED FIREBASE UID
const uid = 'test-firebase-uid';

@Controller('cart')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  // Get the current user's cart
  @Get()
  getCartByFirebaseUid(@Req() req: AuthenticatedRequest) {
    // const uid = req.user.uid;
    return this.cartsService.getCartByFirebaseUid(uid);
  }

  // Create the user's cart
  @Post()
  createCart(@Req() req: AuthenticatedRequest) {
    // const uid = req.user.uid;
    return this.cartsService.createCart(uid);
  }

  // Delete the user's cart
  @Delete()
  deleteCart(@Req() req: AuthenticatedRequest) {
    // const uid = req.user.uid;
    return this.cartsService.deleteCart(uid);
  }

  // DEBUG ROUTE TO GET ALL CARTS. CAN ALSO FILTER BY USER ID ?userId=xxx
  @Get('/all')
  // @UseGuards() // Override auth guard
  getAllCarts(@Query('userId') userId?: number) {
    return this.cartsService.getAllCarts(userId);
  }

  /*
   CART ITEM ROUTES BELOW
  */

  @Get('items')
  getCartItems(@Req() req: AuthenticatedRequest) {
    // const uid = req.user.uid;
    return this.cartsService.getCartItems(uid);
  }

  @Get('items/:productVariantId')
  getCartItemById(
    @Req() req: AuthenticatedRequest,
    @Param('productVariantId', ParseIntPipe) productVariantId: number,
  ) {
    // const uid = req.user.uid;
    return this.cartsService.getCartItemByVariantId(uid, productVariantId);
  }

  @Post('items/:productVariantId')
  createCartItem(
    @Req() req: AuthenticatedRequest,
    @Param('productVariantId', ParseIntPipe) productVariantId: number,
    @Body('quantity', ParseIntPipe) quantity: number,
  ) {
    // const uid = req.user.uid;
    return this.cartsService.addCartItem(uid, productVariantId, quantity);
  }

  @Patch('items/:productVariantId')
  updateCartItem(
    @Req() req: AuthenticatedRequest,
    @Param('productVariantId', ParseIntPipe) productVariantId: number,
    @Body('quantity', ParseIntPipe) quantity?: number,
  ) {
    // const uid = req.user.uid;
    return this.cartsService.updateCartItem(uid, productVariantId, quantity);
  }

  @Delete('items/:productVariantId')
  deleteCartItem(
    @Req() req: AuthenticatedRequest,
    @Param('productVariantId', ParseIntPipe) productVariantId: number,
  ) {
    // const uid = req.user.uid;
    return this.cartsService.deleteCartItem(uid, productVariantId);
  }
}
