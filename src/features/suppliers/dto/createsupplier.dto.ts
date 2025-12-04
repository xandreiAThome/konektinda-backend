import { IsString, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSupplierDto {
  @ApiProperty({
    description: 'Name of the supplier',
    maxLength: 50,
    example: 'Acme Logistics Inc.',
  })
  @IsString()
  @MaxLength(50)
  supplier_name: string;

  @ApiPropertyOptional({
    description: 'Description or additional details about the supplier',
    maxLength: 1000,
    example: 'A trusted supplier for electronics and hardware components.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  supplier_description?: string;
}
