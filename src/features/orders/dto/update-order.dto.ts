import { IsEnum } from 'class-validator';
import { OrderStatus } from 'src/enums';

export class UpdateOrderDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
