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

@UseGuards(FirebaseAuthGuard)
@Controller('cart')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  // Get the current user's cart
  @Get()
  getCartByFirebaseUid(@Req() req: AuthenticatedRequest) {
    const uid = req.user.uid;
    return this.cartsService.getCartByFirebaseUid(uid);
  }

  // Create the user's cart
  @Post()
  createCart(@Req() req: AuthenticatedRequest) {
    const uid = req.user.uid;
    return this.cartsService.createCart(uid);
  }

  // Delete the user's cart
  @Delete()
  deleteCart(@Req() req: AuthenticatedRequest) {
    const uid = req.user.uid;
    return this.cartsService.deleteCart(uid);
  }

  /*
   CART ITEM ROUTES BELOW
  */

  @Get('items')
  getCartItems(@Req() req: AuthenticatedRequest) {
    const uid = req.user.uid;
    return this.cartsService.getCartItems(uid);
  }

  @Get('items/:productVariantId')
  getCartItemById(
    @Req() req: AuthenticatedRequest,
    @Param('productVariantId', ParseIntPipe) productVariantId: number,
  ) {
    const uid = req.user.uid;
    return this.cartsService.getCartItemByVariantId(uid, productVariantId);
  }

  @Post('items/:productVariantId')
  createCartItem(
    @Req() req: AuthenticatedRequest,
    @Param('productVariantId', ParseIntPipe) productVariantId: number,
    @Body('quantity', ParseIntPipe) quantity: number,
  ) {
    const uid = req.user.uid;
    return this.cartsService.addCartItem(uid, productVariantId, quantity);
  }

  @Patch('items/:productVariantId')
  updateCartItem(
    @Req() req: AuthenticatedRequest,
    @Param('productVariantId', ParseIntPipe) productVariantId: number,
    @Body('quantity', ParseIntPipe) quantity?: number,
  ) {
    const uid = req.user.uid;
    return this.cartsService.updateCartItem(uid, productVariantId, quantity);
  }

  @Delete('items/:productVariantId')
  deleteCartItem(
    @Req() req: AuthenticatedRequest,
    @Param('productVariantId', ParseIntPipe) productVariantId: number,
  ) {
    const uid = req.user.uid;
    return this.cartsService.deleteCartItem(uid, productVariantId);
  }

  // ----------DEBUG ROUTES BELOW------------------

  @Get('/all')
  // @UseGuards() // Override auth guard
  getAllCarts(@Query('userId') userId?: number) {
    return this.cartsService.getAllCarts(userId);
  }

  // Routes below are same as routes above but you can specify firebase uid through params (i.e. cart/firebaseuid/...)
  @Get(':firebaseUID')
  getCartByFirebaseUidDebug(@Param('firebaseUID') firebaseUID: string) {
    return this.cartsService.getCartByFirebaseUid(firebaseUID);
  }

  @Post(':firebaseUID')
  createCartDebug(@Param('firebaseUID') firebaseUID: string) {
    return this.cartsService.createCart(firebaseUID);
  }

  @Delete(':firebaseUID')
  deleteCartDebug(@Param('firebaseUID') firebaseUID: string) {
    return this.cartsService.deleteCart(firebaseUID);
  }

  @Get(':firebaseUID/items')
  getCartItemsDebug(@Param('firebaseUID') firebaseUID: string) {
    return this.cartsService.getCartItems(firebaseUID);
  }

  @Get(':firebaseUID/items/:productVariantId')
  getCartItemByIdDebug(
    @Param('firebaseUID') firebaseUID: string,
    @Param('productVariantId', ParseIntPipe) productVariantId: number,
  ) {
    return this.cartsService.getCartItemByVariantId(
      firebaseUID,
      productVariantId,
    );
  }

  @Post(':firebaseUID/items/:productVariantId')
  createCartItemDebug(
    @Param('firebaseUID') firebaseUID: string,
    @Param('productVariantId', ParseIntPipe) productVariantId: number,
    @Body('quantity', ParseIntPipe) quantity: number,
  ) {
    return this.cartsService.addCartItem(
      firebaseUID,
      productVariantId,
      quantity,
    );
  }

  @Patch(':firebaseUID/items/:productVariantId')
  updateCartItemDebug(
    @Param('firebaseUID') firebaseUID: string,
    @Param('productVariantId', ParseIntPipe) productVariantId: number,
    @Body('quantity', ParseIntPipe) quantity?: number,
  ) {
    return this.cartsService.updateCartItem(
      firebaseUID,
      productVariantId,
      quantity,
    );
  }

  @Delete(':firebaseUID/items/:productVariantId')
  deleteCartItemDebug(
    @Param('firebaseUID') firebaseUID: string,
    @Param('productVariantId', ParseIntPipe) productVariantId: number,
  ) {
    return this.cartsService.deleteCartItem(firebaseUID, productVariantId);
  }
}
