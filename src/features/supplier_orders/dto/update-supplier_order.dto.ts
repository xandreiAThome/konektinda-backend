import { PartialType } from '@nestjs/mapped-types';
import { CreateSupplierOrderDto } from './create-supplier_order.dto';
import { OrderStatus } from 'src/enums';
import { IsEnum } from 'class-validator';

export class UpdateSupplierOrderDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
