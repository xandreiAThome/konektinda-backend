import { ApiProperty } from '@nestjs/swagger';

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
}
