import { PartialType } from '@nestjs/mapped-types';
import { CreateProductVariantDto } from './create-product_variant.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsString,
  MaxLength,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

export class UpdateProductVariantDto {
  @ApiPropertyOptional({
    description: 'The name of the product variant',
    example: '24 Liters',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  variant_name?: string;

  @ApiPropertyOptional({
    description: 'The initial stock of the product variant',
    example: 30,
  })
  @IsOptional()
  @IsInt()
  stock?: number;

  @ApiPropertyOptional({
    description: 'The current price of the product variant',
    example: 99.5,
  })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiPropertyOptional({
    description: 'The discount currently applied to the product in percentage',
    example: 50,
  })
  @IsOptional()
  @IsInt()
  discount?: number;

  @ApiPropertyOptional({
    description: 'Active status of the product variant',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @ApiPropertyOptional({
    description: 'Image URL of the product variant',
    example: 'images.com/api/23231',
  })
  @IsString()
  product_variant_img: string;
}
