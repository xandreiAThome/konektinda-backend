import { ApiProperty } from '@nestjs/swagger';

class ResponseCartItemProductDto {
  @ApiProperty({
    example: 'Mountain Spring Water',
    description: 'Name of the parent product',
  })
  product_name: string;
}

class ResponseCartItemVariantDto {
  @ApiProperty({
    example: '14 Liters',
    description: 'Name of the product variant',
  })
  variant_name: string;

  @ApiProperty({
    example: 'https://example.com/images/242.png',
    description: 'Image URL of the variant',
  })
  product_variant_img: string;

  @ApiProperty({
    example: true,
    description: 'Whether the variant is currently active',
  })
  is_active: boolean;

  @ApiProperty({
    type: () => ResponseCartItemProductDto,
    description: 'Parent product information',
  })
  product: ResponseCartItemProductDto;
}

export class ResponseCartItemDto {
  @ApiProperty({
    example: 101,
    description: 'Unique ID of the cart item',
  })
  cart_item_id: number;

  @ApiProperty({
    example: 12,
    description: 'ID of the cart this item belongs to',
  })
  cart_id: number;

  @ApiProperty({
    example: 55,
    description: 'Product variant ID associated with this cart item',
  })
  product_variant_id: number;

  @ApiProperty({
    example: 3,
    description: 'Quantity of the product variant in the cart',
  })
  quantity: number;

  @ApiProperty({
    example: 19.99,
    description: 'Unit price of the item at the time it was added',
  })
  unit_price: number;

  @ApiProperty({
    example: 10,
    description: 'Discount applied to this item (percentage)',
  })
  discount_applied: number;

  @ApiProperty({
    example: '2024-06-10T14:23:00.000Z',
    description: 'Timestamp when the price was recorded',
  })
  date_priced: string;

  @ApiProperty({
    type: () => ResponseCartItemVariantDto,
    description:
      'Details of the product variant associated with this cart item',
  })
  variant: ResponseCartItemVariantDto;
}
