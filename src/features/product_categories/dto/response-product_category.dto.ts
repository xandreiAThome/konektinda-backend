import { ApiProperty } from '@nestjs/swagger';

export class ResponseCategoryDto {
  @ApiProperty({ example: 1 })
  product_category_id: number;

  @ApiProperty({ example: 'Fruits' })
  category_name: string;
}
