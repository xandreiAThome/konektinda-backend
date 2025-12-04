import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserAddressDto {
  // region
  @ApiPropertyOptional({
    description: 'Region Name',
    example: 'NCR',
    type: String,
  })
  @IsOptional()
  @IsString()
  region?: string;

  // province
  @ApiPropertyOptional({
    description: 'State or province',
    example: 'Metro Manila',
  })
  @IsOptional()
  @IsString()
  province?: string;

  // city
  @ApiPropertyOptional({
    description: 'City name',
    example: 'Makati City',
  })
  @IsOptional()
  @IsString()
  city?: string;

  // barangay
  @ApiPropertyOptional({
    description: 'Barangay name',
    example: 'Bel-Air',
  })
  @IsOptional()
  @IsString()
  barangay?: string;

  // zip_code
  @ApiPropertyOptional({
    description: 'Zip code',
    example: '1121',
  })
  @IsOptional()
  @IsString()
  zip_code?: string;
}
