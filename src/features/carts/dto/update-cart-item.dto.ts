import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateCartItemDto {
  @IsInt()
  @IsOptional()
  @Min(1)
  quantity?: number;

  @IsNumber()
  @IsOptional()
  unit_price?: number;

  @IsInt()
  @IsOptional()
  @Min(0)
  discount_applied?: number;
}
