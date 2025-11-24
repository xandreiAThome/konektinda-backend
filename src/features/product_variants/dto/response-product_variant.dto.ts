import { ApiProperty } from '@nestjs/swagger';

export class ResponseCategoryDto {
  @ApiProperty({ example: 1 })
  product_category_id: number;

  @ApiProperty({ example: 'Fruits' })
  category_name: string;
}

export class ResponseBasicProductDto {
  @ApiProperty({ example: 1 })
  product_id: number;

  @ApiProperty({ example: 1 })
  product_category_id: number;

  @ApiProperty({ example: 1 })
  supplier_id: number;

  @ApiProperty({ example: 'Organic Apples' })
  product_name: string;

  @ApiProperty({
    example: 'Crisp and fresh organic apples.',
    nullable: true,
  })
  product_description: string | null;

  @ApiProperty({ example: true })
  is_active: boolean;

  @ApiProperty({ type: () => ResponseCategoryDto })
  category: ResponseCategoryDto;
}

export class ResponseProductVariantDto {
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

  @ApiProperty({ type: () => ResponseBasicProductDto })
  product: ResponseBasicProductDto;
}
