import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateCartDto {
  @IsInt()
  @IsNotEmpty()
  user_id: number;
}
