import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart } from 'db/carts/carts.schema';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createCart(@Body() dto: CreateCartDto): Promise<Cart> {
    return this.cartsService.createCart(dto);
  }

  @Get()
  getAllCarts(): Promise<Cart[]> {
    return this.cartsService.getAllCarts();
  }

  @Get(':id')
  getCartById(@Param('id', ParseIntPipe) id: number): Promise<Cart> {
    return this.cartsService.getCartById(id);
  }

  @Get('user/:userId')
  getCartByUserId(@Param('userId', ParseIntPipe) userId: number): Promise<Cart> {
    return this.cartsService.getCartByUserId(userId);
  }

  @Put(':id')
  updateCart(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCartDto,
  ): Promise<Cart> {
    return this.cartsService.updateCart(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteCart(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.cartsService.deleteCart(id);
  }
}
