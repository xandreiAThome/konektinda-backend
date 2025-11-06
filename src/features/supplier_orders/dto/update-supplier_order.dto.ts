import { OrderStatus } from 'src/enums';
import { IsEnum } from 'class-validator';

export class UpdateSupplierOrderDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
