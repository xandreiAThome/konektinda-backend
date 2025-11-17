import {
  IsInt,
  IsString,
  IsBoolean,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProductsDto {
  @ApiPropertyOptional({
    description: 'The ID of the product category',
    example: 1,
    type: Number,
  })
  @IsOptional()
  @IsInt()
  product_category_id?: number;

  @ApiPropertyOptional({
    description: 'The ID of the supplier',
    example: 1,
    type: Number,
  })
  @IsOptional()
  @IsInt()
  supplier_id?: number;

  @ApiPropertyOptional({
    description: 'The name of the product',
    example: 'Organic Apples',
    maxLength: 100,
    type: String,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  product_name?: string;

  @ApiPropertyOptional({
    description: 'A detailed description of the product',
    example: 'Fresh organic apples from local farms',
    maxLength: 255,
    type: String,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  product_description?: string;

  @ApiPropertyOptional({
    description: 'Whether the product is active and available for purchase',
    example: true,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
