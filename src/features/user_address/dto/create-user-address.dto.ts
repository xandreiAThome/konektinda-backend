import { IsString, IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserAddressDto {
  // user_id
  @ApiProperty({
    description: 'The ID of the user',
    example: 1,
    type: Number,
  })
  @IsInt()
  @IsNotEmpty()
  user_id: number;

  // region
  @ApiProperty({
    description: 'Region Name',
    example: 'NCR',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  region: string;

  // province
  @ApiProperty({
    description: 'State or province',
    example: 'Metro Manila',
  })
  @IsString()
  @IsNotEmpty()
  province: string;

  // city
  @ApiProperty({
    description: 'City name',
    example: 'Makati City',
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  // barangay
  @ApiProperty({
    description: 'Barangay name',
    example: 'Bel-Air',
  })
  @IsString()
  @IsNotEmpty()
  barangay: string;

  // zip_code
  @ApiProperty({
    description: 'Zip code',
    example: '1121',
  })
  @IsString()
  @IsNotEmpty()
  zip_code: string;
}
