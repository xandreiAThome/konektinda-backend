import { IsString, MaxLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserAddressDto {
  @ApiProperty({
    description: 'Region of the address',
    example: 'NCR',
    maxLength: 50,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  region: string;

  @ApiProperty({
    description: 'Province of the address',
    example: 'Metro Manila',
    maxLength: 50,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  province: string;

  @ApiProperty({
    description: 'City of the address',
    example: 'Quezon City',
    maxLength: 50,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  city: string;

  @ApiProperty({
    description: 'Barangay of the address',
    example: 'Commonwealth',
    maxLength: 50,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  barangay: string;

  @ApiProperty({
    description: 'Zip code of the address',
    example: '1121',
    maxLength: 10,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  zip_code: string;
}
