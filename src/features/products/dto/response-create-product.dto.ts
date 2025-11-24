import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ResponseCreateProductDto {
  @ApiProperty({ example: 7 })
  product_id: number;

  @ApiProperty({ example: 1 })
  product_category_id: number;

  @ApiProperty({ example: 1 })
  supplier_id: number;

  @ApiProperty({ example: 'Organic Apples' })
  product_name: string;

  @ApiPropertyOptional({
    example: 'Fresh organic apples from local farms',
  })
  product_description?: string | null;

  @ApiProperty({ example: true })
  is_active: boolean;
}
