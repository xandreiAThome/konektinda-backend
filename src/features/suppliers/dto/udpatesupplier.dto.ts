import { IsOptional } from "class-validator"

export class UpdateSupplierDto {
  @IsOptional()
  supplier_name?: string

  @IsOptional()
  supplier_description?: string
}