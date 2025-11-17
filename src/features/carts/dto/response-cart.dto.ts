import { ApiProperty } from '@nestjs/swagger';

export class ResponseCartDto {
  @ApiProperty({ example: 1 })
  cart_id: number;

  @ApiProperty({ example: 1 })
  user_id: number;
}
