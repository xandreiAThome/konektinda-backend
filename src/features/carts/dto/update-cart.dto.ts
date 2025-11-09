import { IsInt, IsOptional } from 'class-validator';

export class UpdateCartDto {
  @IsInt()
  @IsOptional()
  user_id?: number;
}
