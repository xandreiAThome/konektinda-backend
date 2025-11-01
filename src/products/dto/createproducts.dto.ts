import { IsInt, IsString, IsBoolean, IsOptional, MaxLength } from 'class-validator';

export class CreateProductsDto {
  @IsInt()
  product_category_id: number;

  @IsInt()
  supplier_id: number;

  @IsString()
  @MaxLength(100)
  product_name: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  product_description?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean; 
}
