import { ApiProperty } from '@nestjs/swagger';

export class ResponseProductVariantDto {
  @ApiProperty({ example: 1 })
  product_variant_id: number;

  @ApiProperty({ example: 1 })
  product_id: number;

  @ApiProperty({ example: '24 liters' })
  variant_name: string;

  @ApiProperty({ example: 30 })
  stock: number;

  @ApiProperty({ example: 99.5 })
  price: number;

  @ApiProperty({ example: 50 })
  discount: number;

  @ApiProperty({ example: true })
  is_active: boolean;
}
