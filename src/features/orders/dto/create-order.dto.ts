import { IsDateString, IsInt, IsNumber, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsInt()
  user_id: number;

  @IsNumber()
  grand_total: number;

  @IsString()
  region: string;

  @IsString()
  province: string;

  @IsString()
  city: string;

  @IsString()
  barangay: string;

  @IsString()
  zip_code: string;

  @IsString()
  payment_id: string;

  @IsDateString()
  order_date: string;
}
