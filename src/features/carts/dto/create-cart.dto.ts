import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class CreateCartDto {
  @ApiProperty({ description: "ID of the cart's linked user", example: 1 })
  @IsInt()
  user_id: number;
}
