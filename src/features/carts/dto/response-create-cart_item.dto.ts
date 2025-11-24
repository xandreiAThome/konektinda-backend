import { ApiProperty } from '@nestjs/swagger';

export class ResponseCreateCartItemDto {
  @ApiProperty({ example: 2 })
  cart_item_id: number;

  @ApiProperty({ example: 1 })
  cart_id: number;

  @ApiProperty({ example: 9 })
  product_variant_id: number;

  @ApiProperty({ example: 1 })
  quantity: number;

  @ApiProperty({ example: 79.99 })
  unit_price: number;

  @ApiProperty({ example: 20 })
  discount_applied: number;

  @ApiProperty({
    example: '2025-11-24T11:43:32.465Z',
    description: 'Timestamp when the price/discount was recorded',
  })
  date_priced: string;
}
