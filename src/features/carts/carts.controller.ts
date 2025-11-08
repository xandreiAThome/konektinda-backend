import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Get(':userId')
  getCartByUserId(@Param('id') id: string) {
    return this.cartsService.getCartByUserId(+id);
  }

  @Post()
  create(@Body() createCartDto: CreateCartDto) {
    return this.cartsService.create(createCartDto);
  }

  @Delete(':id')
  deleteCart(@Param('id') id: string) {
    return this.cartsService.deleteCart(+id);
  }
}
