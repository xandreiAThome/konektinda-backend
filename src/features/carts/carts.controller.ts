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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiParam,
  ApiBody,
  ApiBadRequestResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { ResponseCartDto } from './dto/response-cart.dto';
import { ResponseCartItemDto } from './dto/response-cart_item.dto';
import { ResponseCreateCartItemDto } from './dto/response-create-cart_item.dto';

@ApiBearerAuth()
@UseGuards(FirebaseAuthGuard)
@Controller('cart')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @ApiOperation({
    summary: "Returns the authenticated user's cart",
  })
  @ApiOkResponse({
    description: "Successfully fetched the user's cart",
    type: ResponseCartDto,
  })
  @ApiUnauthorizedResponse({
    description: 'User is not authenticated',
  })
  @Get()
  getCartByFirebaseUid(@Req() req: AuthenticatedRequest) {
    const uid = req.user.uid;
    return this.cartsService.getCartByFirebaseUid(uid);
  }

  /*
   CART ITEM ROUTES BELOW
  */

  @ApiOperation({
    summary: 'Get all cart items for the authenticated user with product names',
  })
  @ApiOkResponse({
    description:
      'Successfully fetched all cart items with parent product names',
    type: ResponseCartItemDto,
    isArray: true,
  })
  @ApiUnauthorizedResponse({
    description: 'User is not authenticated',
  })
  @Get('items')
  getCartItems(@Req() req: AuthenticatedRequest) {
    const uid = req.user.uid;
    return this.cartsService.getCartItems(uid);
  }

  @ApiOperation({
    summary: 'Get a single cart item by product variant ID',
  })
  @ApiOkResponse({
    description: 'Successfully fetched the cart item',
    type: ResponseCartItemDto,
  })
  @ApiNotFoundResponse({
    description: 'Cart item not found',
  })
  @ApiUnauthorizedResponse({
    description: 'User is not authenticated',
  })
  @ApiParam({
    name: 'productVariantId',
    description: 'The ID of the product variant',
    type: Number,
    example: 12,
  })
  @Get('items/:productVariantId')
  getCartItemById(
    @Req() req: AuthenticatedRequest,
    @Param('productVariantId', ParseIntPipe) productVariantId: number,
  ) {
    const uid = req.user.uid;
    return this.cartsService.getCartItemByVariantId(uid, productVariantId);
  }

  @ApiOperation({
    summary: "Add a product variant to the user's cart",
  })
  @ApiCreatedResponse({
    description: 'Cart item added successfully',
    type: ResponseCreateCartItemDto,
  })
  @ApiNotFoundResponse({
    description: 'Product variant is not found or inactive',
  })
  @ApiBadRequestResponse({
    description: 'Invalid quantity or not enough stock',
  })
  @ApiUnauthorizedResponse({
    description: 'User is not authenticated',
  })
  @ApiParam({
    name: 'productVariantId',
    description: 'The ID of the product variant to add',
    type: Number,
    example: 12,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        quantity: { type: 'number', example: 2 },
      },
      required: ['quantity'],
    },
  })
  @Post('items/:productVariantId')
  createCartItem(
    @Req() req: AuthenticatedRequest,
    @Param('productVariantId', ParseIntPipe) productVariantId: number,
    @Body('quantity', ParseIntPipe) quantity: number,
  ) {
    const uid = req.user.uid;
    return this.cartsService.addCartItem(uid, productVariantId, quantity);
  }

  @ApiOperation({
    summary:
      'Update the cart item to the latest product variant info. Quantity is optional to update',
  })
  @ApiOkResponse({
    description: 'Cart item updated successfully',
    type: ResponseCreateCartItemDto,
  })
  @ApiNotFoundResponse({
    description:
      'Either: Invalid product variant id, Product variant is inactive, or Item is not in cart',
  })
  @ApiBadRequestResponse({
    description: 'Invalid quantity or not enough stock',
  })
  @ApiUnauthorizedResponse({
    description: 'User is not authenticated',
  })
  @ApiParam({
    name: 'productVariantId',
    description: 'The ID of the product variant',
    type: Number,
    example: 12,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        quantity: { type: 'number', example: 5 },
      },
      required: [],
    },
    required: false,
  })
  @Patch('items/:productVariantId')
  updateCartItem(
    @Req() req: AuthenticatedRequest,
    @Param('productVariantId', ParseIntPipe) productVariantId: number,
    @Body('quantity', ParseIntPipe) quantity?: number,
  ) {
    const uid = req.user.uid;
    return this.cartsService.updateCartItem(uid, productVariantId, quantity);
  }

  @ApiOperation({
    summary: "Delete a cart item from the user's cart",
  })
  @ApiNoContentResponse({
    description: 'Cart item deleted successfully',
  })
  @ApiNotFoundResponse({
    description: 'Cart item not found',
  })
  @ApiUnauthorizedResponse({
    description: 'User is not authenticated',
  })
  @ApiParam({
    name: 'productVariantId',
    description: 'The ID of the product variant',
    type: Number,
    example: 12,
  })
  @Delete('items/:productVariantId')
  deleteCartItem(
    @Req() req: AuthenticatedRequest,
    @Param('productVariantId', ParseIntPipe) productVariantId: number,
  ) {
    const uid = req.user.uid;
    return this.cartsService.deleteCartItem(uid, productVariantId);
  }

  // Shits still requires auth. Just move the debug routes to a new controller if needed.
  /*
  // ----------DEBUG ROUTES BELOW------------------

  @ApiBearerAuth(undefined)
  @ApiOperation({
    summary: 'DEBUG: Get all carts (optionally filter by userId)',
  })
  @ApiOkResponse({
    description: 'All carts fetched',
    type: ResponseCartDto,
    isArray: true,
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    type: Number,
  })
  @Get('/all')
  @UseGuards() // Override auth guard
  getAllCarts(@Query('userId') userId?: number) {
    return this.cartsService.getAllCarts(userId);
  }

  // Routes below are same as routes above but you can specify firebase uid through params (i.e. cart/firebaseuid/...)

  @ApiOperation({ summary: 'DEBUG: Get cart by Firebase UID' })
  @ApiOkResponse({ description: 'Cart fetched', type: ResponseCartDto })
  @ApiParam({
    name: 'firebaseUID',
    type: String,
  })
  @Get(':firebaseUID')
  @UseGuards()
  getCartByFirebaseUidDebug(@Param('firebaseUID') firebaseUID: string) {
    return this.cartsService.getCartByFirebaseUid(firebaseUID);
  }

  @ApiOperation({ summary: 'DEBUG: Create cart by Firebase UID' })
  @ApiCreatedResponse({
    description: 'Cart created',
    type: ResponseCartDto,
  })
  @ApiParam({ name: 'firebaseUID', type: String })
  @Post(':firebaseUID')
  @UseGuards()
  createCartDebug(@Param('firebaseUID') firebaseUID: string) {
    return this.cartsService.createCart(firebaseUID);
  }

  @ApiOperation({ summary: 'DEBUG: Delete cart by Firebase UID' })
  @ApiNoContentResponse({ description: 'Cart deleted' })
  @ApiParam({ name: 'firebaseUID', type: String })
  @Delete(':firebaseUID')
  @UseGuards()
  deleteCartDebug(@Param('firebaseUID') firebaseUID: string) {
    return this.cartsService.deleteCart(firebaseUID);
  }

  @ApiOperation({ summary: 'DEBUG: Get cart items by Firebase UID' })
  @ApiOkResponse({
    description: 'Items fetched',
    type: ResponseCartItemDto,
    isArray: true,
  })
  @ApiParam({ name: 'firebaseUID', type: String })
  @Get(':firebaseUID/items')
  @UseGuards()
  getCartItemsDebug(@Param('firebaseUID') firebaseUID: string) {
    return this.cartsService.getCartItems(firebaseUID);
  }

  @ApiOperation({
    summary:
      'DEBUG: Get a single cart item by Firebase UID & product variant ID',
  })
  @ApiOkResponse({
    description: 'Cart item fetched',
    type: ResponseCartItemDto,
  })
  @ApiNotFoundResponse({
    description: 'Cart item not found',
  })
  @ApiParam({ name: 'firebaseUID', type: String })
  @ApiParam({
    name: 'productVariantId',
    description: 'The ID of the product variant',
    type: Number,
    example: 12,
  })
  @Get(':firebaseUID/items/:productVariantId')
  @UseGuards()
  getCartItemByIdDebug(
    @Param('firebaseUID') firebaseUID: string,
    @Param('productVariantId', ParseIntPipe) productVariantId: number,
  ) {
    return this.cartsService.getCartItemByVariantId(
      firebaseUID,
      productVariantId,
    );
  }

  @ApiOperation({ summary: 'DEBUG: Add cart item by Firebase UID' })
  @ApiCreatedResponse({
    description: 'Cart item added',
    type: ResponseCartItemDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid quantity or not enough stock',
  })
  @ApiNotFoundResponse({ description: 'Product variant not found or inactive' })
  @ApiParam({ name: 'firebaseUID', type: String })
  @ApiParam({
    name: 'productVariantId',
    description: 'The ID of the product variant',
    type: Number,
    example: 12,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        quantity: { type: 'number', example: 2 },
      },
      required: ['quantity'],
    },
  })
  @Post(':firebaseUID/items/:productVariantId')
  @UseGuards()
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

  @ApiOperation({ summary: 'DEBUG: Update cart item by Firebase UID' })
  @ApiOkResponse({
    description: 'Cart item updated',
    type: ResponseCartItemDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid quantity' })
  @ApiNotFoundResponse({
    description:
      'Either: Invalid product variant id, product variant is inactive, or item is not in cart',
  })
  @ApiParam({ name: 'firebaseUID', type: String })
  @ApiParam({
    name: 'productVariantId',
    description: 'The ID of the product variant',
    type: Number,
    example: 12,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        quantity: { type: 'number', example: 5 },
      },
      required: [],
    },
    required: false,
  })
  @Patch(':firebaseUID/items/:productVariantId')
  @UseGuards()
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

  @ApiOperation({ summary: 'DEBUG: Delete cart item by Firebase UID' })
  @ApiNoContentResponse({ description: 'Cart item deleted' })
  @ApiNotFoundResponse({ description: 'Cart item not found' })
  @ApiParam({ name: 'firebaseUID', type: String })
  @ApiParam({
    name: 'productVariantId',
    description: 'The ID of the product variant',
    type: Number,
    example: 12,
  })
  @Delete(':firebaseUID/items/:productVariantId')
  @UseGuards()
  deleteCartItemDebug(
    @Param('firebaseUID') firebaseUID: string,
    @Param('productVariantId', ParseIntPipe) productVariantId: number,
  ) {
    return this.cartsService.deleteCartItem(firebaseUID, productVariantId);
  }
    */
}
