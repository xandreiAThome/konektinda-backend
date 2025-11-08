import { Module } from '@nestjs/common';
import { SupplierOrdersService } from './supplier_orders.service';
import { SupplierOrdersController } from './supplier_orders.controller';

@Module({
  controllers: [SupplierOrdersController],
  providers: [SupplierOrdersService],
})
export class SupplierOrdersModule {}
