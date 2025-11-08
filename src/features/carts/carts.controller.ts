import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Get(':userId')
  getCartByUserId(@Param('id', ParseIntPipe) id: number) {
    return this.cartsService.getCartByUserId(id);
  }

  @Post()
  createCart(@Body() createCartDto: CreateCartDto) {
    return this.cartsService.createCart(createCartDto);
  }

  @Delete(':userId')
  deleteCart(@Param('id', ParseIntPipe) id: number) {
    return this.cartsService.deleteCart(id);
  }
}
