import { IsNotEmpty, IsString, Max, MaxLength } from 'class-validator';

export class CreateSupplierDto {
  @IsString()
  @MaxLength(50)
  supplier_name: string;

  @IsString()
  supplier_description: string;
}
