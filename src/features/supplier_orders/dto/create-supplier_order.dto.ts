import {
  IsInt,
  IsString,
  IsDecimal,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { OrderStatus } from 'src/enums';

export class CreateSupplierOrderDto {
  @IsInt()
  order_id: number;

  @IsInt()
  supplier_id: number;

  @IsString()
  supplier_order_num: string;

  @IsDecimal()
  subtotal: string;

  @IsDecimal()
  shipping: string;

  @IsDecimal()
  total_price: string;

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus = OrderStatus.PENDING;
}
