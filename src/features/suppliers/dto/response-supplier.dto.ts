import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ResponseSupplierDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  supplier_id: number;

  @ApiProperty({ example: 'Local Farm Co.' })
  @IsString()
  supplier_name: string;

  @ApiPropertyOptional({ example: 'A trusted local supplier of fresh produce' })
  @IsString()
  supplier_description: string | null;
}
