import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ResponseSupplierDto {
  @ApiProperty({ example: 1 })
  supplier_id: number;

  @ApiProperty({ example: 'Local Farm Co.' })
  supplier_name: string;

  @ApiPropertyOptional({ example: 'A trusted local supplier of fresh produce' })
  supplier_description: string | null;
}
