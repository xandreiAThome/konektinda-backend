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
import { SupplierOrdersService } from './supplier_orders.service';
import { CreateSupplierOrderDto } from './dto/create-supplier_order.dto';
import { UpdateSupplierOrderDto } from './dto/update-supplier_order.dto';
import { OrderStatus } from 'src/enums';

@Controller('supplier-orders')
export class SupplierOrdersController {
  constructor(private readonly supplierOrdersService: SupplierOrdersService) {}

  @Get()
  getAllSupplierOrders(@Query('status') status?: OrderStatus) {
    return this.supplierOrdersService.getAllSupplierOrders(status);
  }

  @Get(':id')
  getSupplierOrderById(@Param('id', ParseIntPipe) id: number) {
    return this.supplierOrdersService.getSupplierOrderById(id);
  }

  @Get(':supplierId')
  getSupplierOrdersBySupplierId(
    @Param('supplierId', ParseIntPipe) supplierId: number,
    @Query('status') status?: OrderStatus,
  ) {
    return this.supplierOrdersService.getSupplierOrdersBySupplierId(
      supplierId,
      status,
    );
  }

  @Get(':id/items')
  getSupplierOrderItems(@Param('id', ParseIntPipe) id: number) {
    return this.supplierOrdersService.getSupplierOrderItems(id);
  }

  @Patch(':id')
  updateSupplierOrder(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSupplierOrderDto: UpdateSupplierOrderDto,
  ) {
    return this.supplierOrdersService.updateSupplierOrder(
      id,
      updateSupplierOrderDto,
    );
  }
}
