import { IsString, IsOptional, MaxLength } from 'class-validator';

export class UpdateUserAddressDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  region?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  province?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  city?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  barangay?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  zip_code?: string;
}
