import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatus } from 'src/enums';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createOrder(createOrderDto);
  }

  @Get()
  getAllOrders(
    @Query('status') status?: OrderStatus,
    @Query('userId') userId?: number,
  ) {
    return this.ordersService.getAllOrders(status, userId);
  }

  @Get(':id')
  getOrderById(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.getOrderById(id);
  }

  /*
  @Get(':userId')
  getOrdersByUserId(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('status') status?: OrderStatus,
  ) {
    return this.ordersService.getOrdersByUserId(userId, status);
  }
*/

  @Get(':id/items')
  getOrderItems(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.getOrderItems(id);
  }

  @Get(':id/supplier-orders')
  getSupplierOrders(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.getSupplierOrders(id);
  }

  @Patch(':id')
  updateOrder(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.updateOrder(id, updateOrderDto);
  }
}
