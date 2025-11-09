import { IsString, MaxLength, IsOptional } from 'class-validator';

export class CreateSupplierDto {
  @IsString()
  @MaxLength(50)
  supplier_name: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  supplier_description?: string;
}
