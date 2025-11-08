import { IsInt } from 'class-validator';

export class CreateCartDto {
  @IsInt()
  user_id: number;
}
