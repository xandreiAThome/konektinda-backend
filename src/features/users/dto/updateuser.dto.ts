import {
  IsString,
  IsEmail,
  IsOptional,
  MaxLength,
  MinLength,
  IsEnum,
  IsInt,
  IsBoolean,
} from 'class-validator';
import { UserRole } from 'src/enums';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(128)
  firebase_uid?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  @MinLength(1)
  first_name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  @MinLength(1)
  last_name?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(50)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  @MinLength(3)
  username?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  password_hash?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone_number?: string;

  @IsOptional()
  @IsBoolean()
  email_verified?: boolean;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  profile_picture_url?: string;

  @IsOptional()
  @IsInt()
  supplier_id?: number;
}
