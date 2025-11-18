import {
  IsInt,
  IsString,
  IsBoolean,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductsDto {
  @ApiProperty({
    description: 'The ID of the product category',
    example: 1,
    type: Number,
  })
  @IsInt()
  product_category_id: number;

  @ApiProperty({
    description: 'The ID of the supplier',
    example: 1,
    type: Number,
  })
  @IsInt()
  supplier_id: number;

  @ApiProperty({
    description: 'The name of the product',
    example: 'Organic Apples',
    maxLength: 100,
    type: String,
  })
  @IsString()
  @MaxLength(100)
  product_name: string;

  @ApiPropertyOptional({
    description: 'A detailed description of the product',
    example: 'Fresh organic apples from local farms',
    maxLength: 255,
    type: String,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  product_description?: string | null | undefined;

  @ApiPropertyOptional({
    description: 'Whether the product is active and available for purchase',
    example: true,
    default: true,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
