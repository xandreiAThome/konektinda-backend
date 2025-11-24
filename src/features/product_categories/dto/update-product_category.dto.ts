import { PartialType } from '@nestjs/mapped-types';
import { CreateProductCategoryDto } from './create-product_category.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateProductCategoryDto extends PartialType(
  CreateProductCategoryDto,
) {
  @ApiProperty({
    description: 'The name of the product category',
    example: 'Fruits',
  })
  @IsString()
  @IsNotEmpty()
  category_name: string;
}
