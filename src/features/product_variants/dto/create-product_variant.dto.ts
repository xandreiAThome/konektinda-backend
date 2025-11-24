import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateProductVariantDto {
  @ApiProperty({
    description: 'The id of the parent product of the product variant.',
    example: 1,
  })
  @IsInt()
  product_id: number;

  @ApiProperty({
    description: 'The name of the product variant',
    example: '24 Liters',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  variant_name: string;

  @ApiProperty({
    description: 'The initial stock of the product variant',
    example: 30,
  })
  @IsInt()
  stock: number;

  @ApiProperty({
    description: 'The current price of the product variant',
    example: 99.5,
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'The discount currently applied to the product in percentage',
    example: 50,
  })
  @IsInt()
  discount: number;

  @ApiProperty({
    description: 'Active status of the product variant',
    example: true,
  })
  @IsBoolean()
  is_active: boolean;

  @ApiProperty({
    description: 'Image URL of the product variant',
    example: 'images.com/api/23231',
  })
  @IsString()
  product_variant_img: string;
}
