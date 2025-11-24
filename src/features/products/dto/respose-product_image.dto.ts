import { ApiProperty } from '@nestjs/swagger';

export class ResponseProductImageDto {
  @ApiProperty({
    example: 15,
    description: 'Unique ID of the product image',
  })
  product_image_id: number;

  @ApiProperty({
    example: 'https://example.com/images/sample.jpg',
    description: 'URL of the image',
  })
  image_url: string;

  @ApiProperty({
    example: 1,
    description: 'ID of the product this image belongs to',
  })
  product_id: number;
}
