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
import { SupplierOrdersService } from './supplier_orders.service';
import { CreateSupplierOrderDto } from './dto/create-supplier_order.dto';
import { UpdateSupplierOrderDto } from './dto/update-supplier_order.dto';

@Controller('supplier-orders')
export class SupplierOrdersController {
  constructor(private readonly supplierOrdersService: SupplierOrdersService) {}

  @Post()
  create(@Body() createSupplierOrderDto: CreateSupplierOrderDto) {
    return this.supplierOrdersService.create(createSupplierOrderDto);
  }

  @Get()
  getAllSupplierOrders() {
    return this.supplierOrdersService.getAllSupplierOrders();
  }

  @Get(':id')
  getSupplierOrderById(@Param('id') id: string) {
    return this.supplierOrdersService.getSupplierOrderById(+id);
  }

  @Get(':supplierId')
  getSupplierOrdersBySupplierId(
    @Param('supplierId', ParseIntPipe) supplierId: number,
  ) {
    return this.supplierOrdersService.getSupplierOrdersBySupplierId(supplierId);
  }

  @Get(':id/items')
  getSupplierOrderItems(@Param('id', ParseIntPipe) id: number) {
    return this.supplierOrdersService.getSupplierOrderItems(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSupplierOrderDto: UpdateSupplierOrderDto,
  ) {
    return this.supplierOrdersService.update(+id, updateSupplierOrderDto);
  }
}
