import { IsString, IsInt, MaxLength, IsNotEmpty } from 'class-validator';

export class CreateUserAddressDto {
  @IsInt()
  @IsNotEmpty()
  user_id: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  region: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  province: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  city: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  barangay: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  zip_code: string;
}
