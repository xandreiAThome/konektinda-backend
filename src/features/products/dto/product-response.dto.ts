import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the product',
    example: 1,
    type: Number,
  })
  product_id: number;

  @ApiProperty({
    description: 'The ID of the product category',
    example: 1,
    type: Number,
  })
  product_category_id: number;

  @ApiProperty({
    description: 'The ID of the supplier',
    example: 1,
    type: Number,
  })
  supplier_id: number;

  @ApiProperty({
    description: 'The name of the product',
    example: 'Organic Apples',
    maxLength: 100,
    type: String,
  })
  product_name: string;

  @ApiPropertyOptional({
    description: 'A detailed description of the product',
    example: 'Fresh organic apples from local farms',
    maxLength: 255,
    type: String,
    nullable: true,
  })
  product_description: string | null;

  @ApiProperty({
    description: 'Whether the product is active and available for purchase',
    example: true,
    type: Boolean,
  })
  is_active: boolean;

  @ApiPropertyOptional({
    description: 'The product category details',
  })
  category?: any;

  @ApiPropertyOptional({
    description: 'The product variants',
    isArray: true,
  })
  variants?: any[];

  @ApiPropertyOptional({
    description: 'The supplier details',
  })
  supplier?: any;
}
