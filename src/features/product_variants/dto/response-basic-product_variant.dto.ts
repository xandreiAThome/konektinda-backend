import { ApiProperty } from '@nestjs/swagger';

export class ResponseBasicProductVariantDto {
  @ApiProperty({ example: 1 })
  product_variant_id: number;

  @ApiProperty({ example: 1 })
  product_id: number;

  @ApiProperty({ example: '1kg Bag' })
  variant_name: string;

  @ApiProperty({ example: 50 })
  stock: number;

  @ApiProperty({ example: 4.99 })
  price: number;

  @ApiProperty({ example: 0 })
  discount: number;

  @ApiProperty({ example: true })
  is_active: boolean;

  @ApiProperty({
    example: 'https://example.com/variants/apples-1kg.jpg',
  })
  product_variant_img: string;
}
