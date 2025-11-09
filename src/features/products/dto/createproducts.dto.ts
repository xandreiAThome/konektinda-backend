import { IsNotEmpty, IsString, IsBoolean, IsOptional, IsInt, IsNumber } from 'class-validator';

export class CreateProductsDto {
  @IsNumber()
  product_category_id: number;

  @IsNumber()
  supplier_id: number;

  @IsString()
  @IsNotEmpty()
  product_name: string;

  @IsString()
  @IsOptional()
  product_description?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
