import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserAddressDto {
  @ApiPropertyOptional({
    description: 'Region of the address',
    example: 'NCR',
    maxLength: 50,
    type: String,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  region?: string;

  @ApiPropertyOptional({
    description: 'Province of the address',
    example: 'Metro Manila',
    maxLength: 50,
    type: String,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  province?: string;

  @ApiPropertyOptional({
    description: 'City of the address',
    example: 'Quezon City',
    maxLength: 50,
    type: String,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  city?: string;

  @ApiPropertyOptional({
    description: 'Barangay of the address',
    example: 'Commonwealth',
    maxLength: 50,
    type: String,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  barangay?: string;

  @ApiPropertyOptional({
    description: 'Zip code of the address',
    example: '1121',
    maxLength: 10,
    type: String,
  })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  zip_code?: string;
}
